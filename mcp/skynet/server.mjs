#!/usr/bin/env node
// MCP do SkyNet (sistema de atendimentos da Sky) — consultas somente-leitura.
// Zero dependencias: Node 18+ (fetch global) + protocolo MCP via stdio.
// Env: SKYNET_URL, SKYNET_TOKEN_FILE (opcional).
// Token: fica em token.json (gerado por renovar-token.mjs), NUNCA credenciais.
// Quando o token expira (8h), o MCP pede: "peça ao usuário usuário e senha".

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = (process.env.SKYNET_URL || "https://erp.skyinformatica.com.br").replace(/\/+$/, "");
// Aceita a raiz do servidor ou a base já completa (/skynet, /skynet/api).
const API = /\/skynet(\/api)?$/i.test(BASE) ? `${BASE}${/\/skynet\/api$/i.test(BASE) ? "" : "/api"}` : `${BASE}/skynet/api`;
const TIMEOUT_MS = Number(process.env.SKYNET_TIMEOUT_MS || 30000);

const DIR = dirname(fileURLToPath(import.meta.url));
const TOKEN_FILE = process.env.SKYNET_TOKEN_FILE || join(DIR, "token.json");
// Guia de contexto (exposto como recurso MCP skynet://instrucoes).
const INSTRUCOES_FILE = process.env.SKYNET_INSTRUCTIONS || join(DIR, "..", "skynet-instructions.md");
const RENOVAR = "node renovar-token.mjs <usuario> <senha>";

let token = null;
let tokenObtidoEm = null; // ISO do login que gerou o token (SkyNet: ~8h de validade)

const log = (...a) => console.error("[skynet-mcp]", ...a);

const semToken = (motivo) =>
  new Error(
    `${motivo} — gere/renove o token rodando: ${RENOVAR} (grava em ${TOKEN_FILE}). ` +
      `Peça ao usuário o usuário e a senha do SkyNet; o MCP guarda só o token, nunca a senha.`
  );

function lerToken() {
  try {
    return JSON.parse(readFileSync(TOKEN_FILE, "utf8")).token || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- HTTP + auth
async function http(path, { method = "POST", body, query, usarToken = true } = {}) {
  const url = new URL(API + path);
  for (const [k, v] of Object.entries(query || {})) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  }
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json",
      ...(usarToken && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const raw = await res.text();
  if (!res.ok) {
    const erro = new Error(
      `HTTP ${res.status} ${res.statusText} em ${method} ${url.pathname}: ${raw.slice(0, 800)}`
    );
    erro.status = res.status;
    throw erro;
  }
  return raw ? JSON.parse(raw) : null;
}

async function api(path, opts = {}) {
  token ||= lerToken();
  if (!token) throw semToken("Sem token do SkyNet");
  try {
    return await http(path, opts);
  } catch (e) {
    if (e.status !== 401) throw e;
    // O token expirou (8h). Recarrega do arquivo — assim não exige reiniciar o OpenCode.
    const novo = lerToken();
    if (!novo || novo === token) {
      throw new Error(
        `Token do SkyNet expirado (401) e não há token novo em ${TOKEN_FILE}. ` +
          `Rode: ${RENOVAR} — peça ao usuário o usuário e a senha (o MCP guarda só o token, nunca a senha).`
      );
    }
    log("401 com token novo no arquivo, repetindo a chamada");
    token = novo;
    tokenObtidoEm = null;
    return await http(path, opts);
  }
}

// ---------------------------------------------------------------- auxiliares
// A API recusa max > 100 ("Você pode listar no máximo 100 registro(s) por requisição").
const paginacao = (a, padrao = 20, teto = 100) => ({
  first: Math.max(Number(a.offset ?? 0), 0),
  max: Math.min(Math.max(Number(a.limite ?? padrao), 1), teto),
});

function pick(o) {
  const out = {};
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== "") out[k] = v;
  return out;
}

// ---------------------------------------------------------------- tools
const STATUS = ["ABERTO", "EM_ATENDIMENTO", "RESOLVIDO", "FINALIZADO"];
const TIPOS_TAREFA = [
  "ABERTURA", "ANDAMENTO", "DEVOLUCAO_PARA_FILA", "TROCA_PRIORIDADE", "ASSUNCAO_RESPONSABILIDADE",
  "QUALIFICACAO_PROBLEMA_COMUM", "DIRECIONAMENTO", "FINALIZACAO", "REABERTURA", "INICIO_ATENDIMENTO",
  "INTERRUPCAO_ATENDIMENTO", "COMENTARIO_DO_CLIENTE", "COMENTARIO", "RESOLUCAO",
  "VINCULO_A_TAREFA_NO_REDMINE", "REMOCAO_DO_VINCULO_A_TAREFA_NO_REDMINE", "VINCULO_A_ATENDIMENTO_FILHO",
  "REMOCAO_DO_VINCULO_A_ATENDIMENTO_FILHO", "VINCULO_A_ATENDIMENTO_PAI", "REMOCAO_DO_VINCULO_A_ATENDIMENTO_PAI",
  "FINALIZACAO_DE_ATENDIMENTO_FILHO", "REABERTURA_DE_ATENDIMENTO_FILHO", "VINCULO_A_RTS",
  "REMOCAO_DO_VINCULO_A_RTS", "AGENDAMENTO", "DESAGENDAMENTO", "TROCA_SOLICITANTE", "TROCA_TIPO",
  "TROCA_PRODUTO_SERVICO", "TROCA_VERSAO", "TROCA_CATEGORIA", "TROCA_MODULO", "TROCA_SUBMODULO",
  "TROCA_TIPO_ATENDIMENTO_INTERNO", "EXIBE_NO_PORTAL", "DEIXA_EXIBIR_NO_PORTAL", "SOLICITACAO_DE_COOPERACAO",
  "INICIO_COOPERACAO", "NEGACAO_COOPERACAO", "INTERRUPCAO_COOPERACAO", "DEFINICAO_ATENDIMENTO_COMO_PRIVADO",
  "DEFINICAO_ATENDIMENTO_COMO_PUBLICO", "REAGENDAMENTO", "TERMO_ACEITE", "ENVIO_RESUMO_ATENDIMENTO_VIA_EMAIL",
  "TROCA_FILA_ATENDIMENTO", "TROCA_SUBCATEGORIA",
];
const ABERTO_VIA = ["SISTEMA", "PORTAL", "WEB_SERVICE"];

const FILTROS_ATENDIMENTO = {
  responsavel_nome: { type: "string", description: "Parte do nome do responsável atual (like)." },
  responsavel_id: { type: "integer", description: "ID exato do usuário responsável atual." },
  equipe_id: { type: "integer", description: "ID da equipe do responsável atual." },
  cliente_id: { type: "integer" },
  clientes_ids: { type: "array", items: { type: "integer" } },
  solicitante_nome: { type: "string", description: "Parte do nome do solicitante (like)." },
  status: { type: "array", items: { type: "string", enum: STATUS }, description: "Padrão: todos." },
  prioridade_ids: { type: "array", items: { type: "integer" } },
  produto_servico_ids: { type: "array", items: { type: "integer" } },
  produto_servico_id: { type: "integer", description: "idProdutoServicoEquals. Ex.: 31 = IMOVEIS AD." },
  fila: { type: "boolean", description: "true = só sem responsável (fila de aguardando contato); false = só com responsável; omitir = todos." },
  fila_id: { type: "integer", description: "idFilaEquals — id da fila de atendimento." },
  tipo_interno_ids: { type: "array", items: { type: "integer" } },
  categoria_ids: { type: "array", items: { type: "integer" } },
  area_id: { type: "integer" },
  aberto_via: { type: "array", items: { type: "string", enum: ABERTO_VIA } },
  descricao_like: { type: "string", description: "Texto da tarefa/descrição do atendimento (like)." },
  data_abertura_de: { type: "string", description: "ISO-8601, ex.: 2026-09-01T00:00:00" },
  data_abertura_ate: { type: "string" },
  data_finalizacao_de: { type: "string" },
  data_finalizacao_ate: { type: "string" },
  privado: { type: "boolean", description: "true = somente privados, false = somente públicos." },
  redmine_issue_id: { type: "integer", description: "Atendimentos vinculados a uma tarefa do Redmine." },
};

const TOOLS = [
  {
    name: "skynet_atendimento",
    description:
      "Busca UM atendimento do SkyNet pelo ID, já com o histórico de tarefas (comentários, troca de responsável/prioridade, anexos, contatos). Status do atendimento: ABERTO, EM_ATENDIMENTO, RESOLVIDO, FINALIZADO.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "integer", description: "ID do atendimento." },
        incluir_tarefas: { type: "boolean", default: true, description: "false devolve só o cabeçalho." },
        tarefas_offset: { type: "integer", default: 0 },
        tarefas_limite: { type: "integer", default: 50 },
        tarefas_tipo: { type: "array", items: { type: "string", enum: TIPOS_TAREFA }, description: "Filtra o histórico por tipo de tarefa." },
      },
      required: ["id"],
    },
  },
  {
    name: "skynet_listar_atendimentos",
    description:
      "Lista atendimentos do SkyNet por filtro — principal uso: atendimentos de um responsável (responsavel_nome ou responsavel_id), por cliente, status, período, fila (fila: true = sem responsável). 'responsavel_nome' e filtros *_like são cobrem texto; para nome exato descubra o id com skynet_buscar_usuario. Use 'contar: true' para devolver só o total.",
    inputSchema: {
      type: "object",
      properties: {
        ...FILTROS_ATENDIMENTO,
        offset: { type: "integer", default: 0, description: "Pula N registros." },
        limite: { type: "integer", default: 20, description: "Máx. 100 (limite da API)." },
        sort_by: { type: "string", description: "Enviado cru para a API (ex.: 'id desc'). Se omitir, usa a ordenação padrão dela." },
        contar: { type: "boolean", description: "true devolve apenas o total de registros." },
      },
    },
  },
  {
    name: "skynet_buscar_usuario",
    description:
      "Busca usuários do SkyNet (atendentes, responsáveis) por nome, login ou ID. Use para transformar 'responsável Fulano' em um id antes de filtrar atendimentos.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "integer" },
        nome: { type: "string", description: "Parte do nome (like)." },
        login: { type: "string", description: "Login/e-mail do usuário. Se informado sozinho, busca exata." },
        ativo: { type: "boolean" },
        tipo_usuario: { type: "array", items: { type: "string", enum: ["USUARIO", "FORNECEDOR", "USUARIO_DO_CLIENTE", "CLIENTE"] } },
        offset: { type: "integer", default: 0 },
        limite: { type: "integer", default: 20 },
      },
    },
  },
  {
    name: "skynet_buscar_cliente",
    description:
      "Busca clientes do SkyNet por nome, CNS, identificador (CNPJ/CPF) ou ID. Use para resolver 'cliente X' em um id antes de filtrar atendimentos.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "integer" },
        nome: { type: "string" },
        cns: { type: "string" },
        identificador: { type: "string", description: "CNPJ/CPF." },
        termo: { type: "string", description: "Busca livre: nome OU identificador OU cidade OU CNS." },
        ativo: { type: "boolean" },
        offset: { type: "integer", default: 0 },
        limite: { type: "integer", default: 20 },
      },
    },
  },
  {
    name: "skynet_usuario_logado",
    description:
      "Dados do usuário com que este MCP se autenticou no SkyNet (id, nome, perfil), mais origem e expiração estimada do token. Útil para diagnosticar resultado vazio por falta de permissão e para saber quando renovar as credenciais.",
    inputSchema: { type: "object", properties: {} },
  },
];

const HANDLERS = {
  async skynet_atendimento(a) {
    const id = Number(a.id);
    if (!Number.isFinite(id) || id <= 0) throw new Error("Informe um id de atendimento numérico maior que zero.");
    const atendimento = await api(`/v1/atendimento/carregar/${id}`, { method: "GET" });
    if (!atendimento) return { erro: `Atendimento ${id} não encontrado (ou sem permissão para vê-lo).` };
    if (a.incluir_tarefas === false) return { atendimento };
    const tarefas = await api("/v1/atendimentotarefa/listar", {
      body: {
        idAtendimentoEquals: id,
        ...pick({ listaTipoIn: a.tarefas_tipo }),
        ...paginacao({ offset: a.tarefas_offset ?? 0, limite: a.tarefas_limite ?? 50 }),
      },
    });
    return { atendimento, tarefas };
  },

  async skynet_listar_atendimentos(a) {
    const pag = paginacao(a);
    const body = {
      ...pick({
        idUsuarioResponsavelAtualEquals: a.responsavel_id,
        nomeUsuarioResponsavelAtualLike: a.responsavel_nome,
        idEquipeUsuarioResponsavelAtualEquals: a.equipe_id,
        idClienteEquals: a.cliente_id,
        listaIdClienteIn: a.clientes_ids,
        nomeSolicitanteLike: a.solicitante_nome,
        listaStatusIn: a.status,
        listaIdPrioridadeIn: a.prioridade_ids,
        listaIdProdutoServicoIn: a.produto_servico_ids,
        idProdutoServicoEquals: a.produto_servico_id,
        usuarioResponsavelAtualIsNull: a.fila,
        idFilaEquals: a.fila_id,
        listaIdTipoInternoIn: a.tipo_interno_ids,
        listaIdCategoriaIn: a.categoria_ids,
        idAtendimentoAreaEquals: a.area_id,
        listaAbertoViaIn: a.aberto_via,
        descricaoTarefaLike: a.descricao_like,
        dataHoraTarefaAberturaMaiorOuIgualA: a.data_abertura_de,
        dataHoraTarefaAberturaMenorOuIgualA: a.data_abertura_ate,
        dataHoraTarefaFinalizacaoMaiorOuIgualA: a.data_finalizacao_de,
        dataHoraTarefaFinalizacaoMenorOuIgualA: a.data_finalizacao_ate,
        privadoEquals: a.privado,
        redmineIssueIdEquals: a.redmine_issue_id,
        sortBy: a.sort_by,
      }),
      ...pag,
    };
    // Contagem via listarContar (mesmos filtros de RepositorioAtendimentoParams).
    // O antigo /contarClienteEspecifico devolve 401 para este perfil.
    if (a.contar) {
      const r = await api("/v1/atendimento/listarContar", { body: { ...body, first: 0, max: 1 } });
      if (r?.hasError) throw new Error(JSON.stringify(r.msg));
      return { total: r?.msg?.total ?? null };
    }
    const r = await api("/v1/atendimento/listar", { body });
    if (r?.hasError) throw new Error(JSON.stringify(r.msg));
    // /listar devolve {hasError, msg:[...]} nesta API; aceita também array nu.
    const atendimentos = Array.isArray(r) ? r : r?.msg ?? [];
    return { quantidade: atendimentos.length, ...pag, atendimentos };
  },

  async skynet_buscar_usuario(a) {
    if (a.login && !a.nome && !a.id) {
      const u = await api("/v1/usuario/carregarPorValorContatoLogin", { body: { valorContatoLogin: a.login } });
      return { usuario: u };
    }
    const usuarios = await api("/v1/usuario/listar", {
      body: {
        ...pick({
          idEquals: a.id,
          nomeLike: a.nome,
          valorContatoLoginLike: a.login,
          ativoEquals: a.ativo,
          listaTipoUsuarioIn: a.tipo_usuario,
        }),
        ...paginacao(a),
      },
    });
    return { quantidade: usuarios?.length ?? 0, usuarios };
  },

  async skynet_buscar_cliente(a) {
    const clientes = await api("/v1/cliente/listar", {
      body: {
        ...pick({
          idEquals: a.id,
          nomeLike: a.nome,
          codigoCNSLike: a.cns,
          identificadorLike: a.identificador,
          nomeLikeOrIdentificadorLikeOrNomeCidadeLikeOrCodigoCNSLike: a.termo,
          ativoEquals: a.ativo,
        }),
        ...paginacao(a),
      },
    });
    return { quantidade: clientes?.length ?? 0, clientes };
  },

  async skynet_usuario_logado() {
    const info = await api("/v2/account/userInfo", { method: "GET" });
    return {
      autenticadoComo: info,
      token: {
        origem: "arquivo local",
        arquivo: TOKEN_FILE,
        obtidoEm: tokenObtidoEm,
        expiraAproximadamente: tokenObtidoEm ? new Date(Date.parse(tokenObtidoEm) + 8 * 3600e3).toISOString() : null,
      },
    };
  },
};

const INSTRUCOES = [
  "MCP do SkyNet (sistema de atendimentos da Sky). Ferramentas somente-leitura.",
  "",
  "QUANDO USAR: se o pedido do usuário mencionar 'atendimento' e/ou 'skynet' — em qualquer forma,",
  "plural, minúscula ou abreviado ('o atendimento 12345', 'atendimentos abertos do João',",
  "'o que tem no skynet') — o assunto é o SkyNet e a resposta deve vir deste servidor.",
  "Exemplos: 'como está o atendimento 987?' -> skynet_atendimento(987).",
  "'atendimentos do João' -> skynet_buscar_usuario(nome:'João') -> skynet_listar_atendimentos(responsavel_id).",
  "'quantos atendimentos abertos tem?' -> skynet_listar_atendimentos(status:['ABERTO'], contar:true).",
  "Se um número vier solto no contexto de atendimento, trate-o como id de atendimento.",
  "",
  "IDs: atendimento por id; responsável e cliente por id (use skynet_buscar_usuario / skynet_buscar_cliente para resolver nomes).",
  "skynet_atendimento já devolve o histórico de tarefas; aumente tarefas_limite se precisar de mais.",
  "skynet_listar_atendimentos pagina com offset/limite (limite máx. 100); 'contar: true' devolve o total (via /atendimento/listarContar).",
  "Fila de aguardando contato = sem responsável: use fila:true (usuarioResponsavelAtualIsNull).",
  "Filtros por nome/texto são 'like'. Datas em ISO-8601. Status: ABERTO, EM_ATENDIMENTO, RESOLVIDO, FINALIZADO.",
  "Erro de token expirado (401): peça ao usuário o usuário e a senha e rode `renovar-token.mjs`.",
  "",
  "Detalhamento (glossário dos campos, mapa de filtros, tipos de tarefa, diagnóstico de erro,",
  "exemplos de pergunta → chamada) está no recurso MCP skynet://instrucoes — leia antes de consultas",
  "complexas ou de interpretação de resultado (ex.: 'o que está pendente no atendimento 123?').",
].join("\n");

// ---------------------------------------------------------------- protocolo MCP
function send(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}
const ok = (id, result) => send({ jsonrpc: "2.0", id, result });

async function handle(msg) {
  const { id, method, params } = msg ?? {};
  if (id === undefined || String(method ?? "").startsWith("notifications/")) return;
  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: params?.protocolVersion || "2025-06-18",
        capabilities: { tools: { listChanged: false }, resources: {} },
        serverInfo: { name: "skynet", version: "1.0.0" },
        instructions: INSTRUCOES,
      });
    case "ping":
      return ok(id, {});
    case "resources/list":
      return ok(id, {
        resources: [
          {
            uri: "skynet://instrucoes",
            name: "Instruções do SkyNet",
            description: "Glossário dos campos, mapa de filtros, tipos de tarefa, diagnóstico e exemplos de pergunta → chamada.",
            mimeType: "text/markdown",
          },
        ],
      });
    case "resources/read": {
      const uri = params?.uri;
      if (uri !== "skynet://instrucoes") {
        return send({ jsonrpc: "2.0", id, error: { code: -32602, message: `Recurso desconhecido: ${uri}` } });
      }
      let texto;
      try {
        texto = readFileSync(INSTRUCOES_FILE, "utf8");
      } catch {
        texto = `# Instruções do SkyNet\n\nArquivo de instruções não encontrado: ${INSTRUCOES_FILE}\n`;
      }
      return ok(id, { contents: [{ uri, mimeType: "text/markdown", text: texto }] });
    }
    case "tools/list":
      return ok(id, { tools: TOOLS });
    case "tools/call": {
      const h = HANDLERS[params?.name];
      if (!h) return ok(id, { content: [{ type: "text", text: `Ferramenta desconhecida: ${params?.name}` }], isError: true });
      try {
        const dados = await h(params?.arguments ?? {});
        return ok(id, { content: [{ type: "text", text: JSON.stringify(dados, null, 2) }] });
      } catch (e) {
        const msg = e.cause?.message ? `${e.message} (${e.cause.message})` : e.message;
        log("erro na ferramenta", params?.name, msg);
        return ok(id, { content: [{ type: "text", text: `Erro: ${msg}` }], isError: true });
      }
    }
    default:
      return send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Método não suportado: ${method}` } });
  }
}

const { createInterface } = await import("node:readline");
let fila = Promise.resolve();
createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return;
  fila = fila.then(async () => {
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      return log("JSON inválido:", line.slice(0, 200));
    }
    try {
      await handle(msg);
    } catch (e) {
      log("falha ao tratar mensagem:", e);
      if (msg?.id !== undefined) send({ jsonrpc: "2.0", id: msg.id, error: { code: -32603, message: String(e) } });
    }
  });
});

process.on("uncaughtException", (e) => log("uncaught:", e));
process.on("unhandledRejection", (e) => log("unhandled:", e));
log(`pronto — ${API}`);