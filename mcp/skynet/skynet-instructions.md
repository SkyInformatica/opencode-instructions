# Instruções de contexto — SkyNet Sky Informática

Este documento descreve o ambiente SkyNet (sistema de atendimentos da Sky Informática) para orientar o uso das ferramentas do MCP `skynet`. Ele é exposto como recurso MCP `skynet://instrucoes` — leia antes de consultas complexas ou de interpretar resultado.

As ferramentas são **somente leitura**. Nada é aberto, alterado, finalizado ou excluído no SkyNet por este MCP.

## Instalação e arquivos

| Arquivo | Função |
|---|---|
| `%USERPROFILE%\.config\opencode\skynet-instructions.md` | este documento (contexto; lido como recurso `skynet://instrucoes`) |
| `%USERPROFILE%\.config\opencode\mcp\skynet\server.mjs` | servidor MCP (stdio, Node 18+, sem dependências) |
| `%USERPROFILE%\.config\opencode\mcp\skynet\renovar-token.mjs` | faz login e grava o token (~8h) |
| `%USERPROFILE%\.config\opencode\mcp\skynet\token.json` | token vigente, git-ignored — **nunca mostrar o conteúdo** |

Trecho do `%USERPROFILE%\.config\opencode\opencode.json`:

```json
"skynet": {
  "type": "local",
  "command": [
    "C:\\Program Files\\nodejs\\node.exe",
    "C:\\Users\\<USUARIO>\\.config\\opencode\\mcp\\skynet\\server.mjs"
  ],
  "enabled": true,
  "environment": {
    "SKYNET_URL": "https://erp.skyinformatica.com.br",
    "SKYNET_INSTRUCTIONS": "C:\\Users\\<USUARIO>\\.config\\opencode\\skynet-instructions.md"
  }
}
```

Variáveis: `SKYNET_URL` (default `https://erp.skyinformatica.com.br`; aceita a raiz, `/skynet` ou `/skynet/api`), `SKYNET_INSTRUCTIONS` (default: este arquivo, na raiz `%USERPROFILE%\.config\opencode\`, uma pasta acima do servidor), `SKYNET_TOKEN_FILE` (default `mcp\skynet\token.json`), `SKYNET_TIMEOUT_MS` (default 30000).

Logs do servidor vão para stderr (`[skynet-mcp] ...`); stdout é só JSON-RPC.

## Regra geral: quando o assunto é o SkyNet

- Se o pedido do usuário mencionar **"atendimento"** e/ou **"skynet"** (qualquer forma, plural, minúscula, abreviado), o assunto é o SkyNet e a resposta deve vir das ferramentas deste servidor.
- Exemplos de disparo: `o atendimento 12345`, `atendimentos abertos do João`, `o que tem no skynet`, `quantos atendimentos resolvidos hoje`.
- Um número solto no contexto de atendimento deve ser tratado como **id de atendimento**.

## Regra geral: sempre retornar tudo que foi pedido

- A API do SkyNet é paginada (`offset`/`limite`). **Nunca trate uma página como resposta final.**
- `limite` máximo aceito por esta ferramenta: **100** (a API recusa `max` acima de 100). Use `limite: 100` e incremente `offset` até o retorno vir vazio ou menor que o limite.
- Use `contar: true` para responder "quantos", sem trazer a lista.
- Se a resposta vier grande para o contexto, apresente um resumo explícito com a **quantidade total**, o recorte exibido e o comando de continuação — nunca trunque silenciosamente.

## Ferramentas e quando usar cada uma

| Ferramenta | Use para |
|---|---|
| `skynet_atendimento` | Um atendimento pelo id, **com o histórico de tarefas** (comentários, troca de responsável/prioridade, anexos, contatos) |
| `skynet_listar_atendimentos` | Consultas por filtro: responsável, cliente, status, período, prioridade, produto/serviço, **fila** (`fila: true` = sem responsável), `redmine_issue_id`. `contar: true` devolve só o total |
| `skynet_buscar_usuario` | Resolver nome de pessoa → id (responsável, atendente, solicitante) |
| `skynet_buscar_cliente` | Resolver nome/CNS/CNPJ → id de cliente |
| `skynet_usuario_logado` | Descobrir com qual usuário o MCP está autenticado e quando o token expira |

Fluxo padrão de uma consulta por pessoa:

```
skynet_buscar_usuario(nome: "João")        -> confere se o nome é único
skynet_listar_atendimentos(responsavel_id: <id>, status: ["ABERTO","EM_ATENDIMENTO"])
```

Se a busca de usuário devolver mais de um homônimo, **pergunte ao usuário** qual é, ou apresente os candidatos. Nunca escolha um nome ambíguo sozinho.

## Status do atendimento

| Status | Significado |
|---|---|
| `ABERTO` | Aberto, ainda não atendido |
| `EM_ATENDIMENTO` | Alguém já assumiu e está trabalhando |
| `RESOLVIDO` | Solução registrada, aguardando encerramento |
| `FINALIZADO` | Encerrado |

"Fila de trabalho" costuma significar `ABERTO` + `EM_ATENDIMENTO`.

## Atendimentos na fila

Conceito central para consultas de volume. Existem **dois sentidos** de "fila" — pergunte/infira pelo contexto e deixe claro na resposta qual você usou:

| Sentido | Definição | Como filtrar |
|---|---|---|
| **Fila de aguardando contato** (sentido padrão deste MCP) | Atendimento **sem responsável**: `nomeResponsavelAtual` vazio | `fila: true` (API: `usuarioResponsavelAtualIsNull: true`) |
| **Fila de trabalho** (uso coloquial) | Ainda em andamento: `status` `ABERTO` + `EM_ATENDIMENTO` | `status: ["ABERTO","EM_ATENDIMENTO"]` |

### Filtros da tool

| Parâmetro | Efeito |
|---|---|
| `fila: true` | só **sem** responsável (fila de aguardando contato) |
| `fila: false` | só **com** responsável |
| omitir `fila` | todos |
| `fila_id` | id exato da fila de atendimento (`idFilaEquals`) — só se o usuário souber o id |

Combine sempre com `status` quando fizer sentido (na prática a fila de aguardando contato é composta por atendimentos `ABERTO`; consultado em 06/10/2026: ≈ 575 itens, todos `ABERTO`).

### Qualificação da fila — campo `indicadorFila`

| Valor | Significado |
|---|---|
| `NAO_LIDO` | na fila, ainda não lido por ninguém |
| `CLIENTE_AGUARDANDO_RESPOSTA` | cliente aguardando retorno |
| `null` | sem indicador |

### Fila por produto/serviço

- **Não há filtro por nome de produto** (`nomeProdutoServicoLike` é ignorado em silêncio pela API). Filtrar por **id**:
  - `produto_servico_ids: [31]` (lista) ou `produto_servico_id: 31` (exato).
  - **Id conhecido: `31` = IMOVEIS AD.** Outros ids: descobrir por biseção (o payload só traz `nomeProdutoServico`, e `/v1/produtoservico/*` dá 403). Produto "IMOVEIS" simples tem id desconhecido (0 itens na fila, invisível para bisseção).
- Para **sistema/porta de abertura** use `aberto_via` (`SISTEMA`, `PORTAL`, `WEB_SERVICE`) — é filtro por lista, não precisa de id.

### Respostas padrão

- **"quantos na fila?"** → `skynet_listar_atendimentos(fila:true, contar:true)` → `total`. Nunca conte paginação manualmente.
- **"lista da fila"** → `skynet_listar_atendimentos(fila:true, limite:100)` e percorra `offset` até virar vazio/menor que 100.
- **"fila do produto X"** → `skynet_listar_atendimentos(fila:true, produto_servico_ids:[<id>], contar:true)` (base 06/10/2026: Imóveis AD ≈ 50).
- Ao apresentar: diga **qual fila** (aguardando contato vs. trabalho) e o **corte** (produto/status/data) usado — sem isso o número é ambíguo.

## Campos do atendimento (`skynet_atendimento` / `skynet_listar_atendimentos`)

| Campo | O que é |
|---|---|
| `id` | Id do atendimento (o número que o usuário informa) |
| `status` / `statusNome` | Situação (ver tabela acima) |
| `nomeResponsavelAtual` | Responsável atual; vazio = sem responsável (na fila) |
| `idCliente`, `nomeCliente`, `identificadorCliente` | Cliente do atendimento (CNPJ/CPF) |
| `nomeCidadeCliente`, `siglaUfCliente` | Localidade do cliente |
| `idSolicitante`, `nomeSolicitante`, `identificadorSolicitante` | Quem abriu o chamado |
| `nomeCadastradoPor`, `tipoCadastroUsuario` | Quem registrou e de que porta (`CLIENTE`, `FORNECEDOR`, `USUARIO`) |
| `nomeProdutoServico`, `nomeProdutoServicoModulo`, `nomeProdutoServicoSubmodulo`, `descricaoProdutoServicoVersao` | Classificação comercial/técnica |
| `nomeAtendimentoTipoInterno`, `nomeCategoria`, `nomeArea` | Áreas de atendimento |
| `nomePrioridade`, `tempoEmMinutosPrioridade`, `dataPrazoAtender` | Prioridade e SLA |
| `dataHoraAbertura`, `dataHoraAlteracao`, `dataHoraResolucao` | Marcos do atendimento |
| `abertoVia` | `SISTEMA`, `PORTAL`, `WEB_SERVICE` |
| `privado` | `true` =-restrito; respeite privacidade (só mostre se o usuário tiver contexto legítimo) |
| `redmineIssueId`, `redmineIssueStatusName`, `redmineIssueFixedVersionName` | Vínculo com tarefa do Redmine (o MCP do Redmine consegue buscar o detalhe) |
| `urlPesquisa` | Link de consulta no portal do SkyNet |
| `qtdeAtendimentosPai`, `qtdeAtendimentosFilho` | Atendimento pai/filhos — **só contagem**; os ids dos vinculados vêm das tarefas de vínculo (ver "Vínculo entre atendimentos" abaixo) |
| `qtdeRtsVinculados`, `qtdeTermosAceiteVinculados` | RTS (raportes de serviço) e termos de aceite vinculados |
| `marcadoComoUrgente`, `exibeNoPortal` | Flags |

Datas em ISO-8601. Campo `dataHora*` é o que deve ser usado para ordenar/entender a linha do tempo; não infira a data pelo `id`.

## Histórico de tarefas (`AtendimentoTarefaPojoRest`)

Cada item do histórico traz `tipo`, `dataHora`, `nomeUsuario`, `descricao`, `nomeResponsavelAnterior`/`Atual`, `nomePrioridadeAnterior`/`Atual`, `listaArquivos` (anexos) e `listaContatos`.

Tipos mais comuns:

| Tipo | Aconteceu |
|---|---|
| `ABERTURA` | Abertura do atendimento |
| `COMENTARIO` / `COMENTARIO_DO_CLIENTE` | Interação interna / retorno do cliente |
| `ASSUNCAO_RESPONSABILIDADE` | Alguém assumiu o atendimento |
| `INICIO_ATENDIMENTO` / `INTERRUPCAO_ATENDIMENTO` | Início e pausas do trabalho |
| `TROCA_PRIORIDADE` | Alteração de prioridade |
| `RESOLUCAO` / `FINALIZACAO` / `REABERTURA` | Fim, encerramento, reabertura |
| `VINCULO_A_TAREFA_NO_REDMINE` / `REMOCAO_DO_VINCULO_A_TAREFA_NO_REDMINE` | Ligação/desligamento com o Redmine |
| `VINCULO_A_ATENDIMENTO_PAI` / `VINCULO_A_ATENDIMENTO_FILHO` (+ `REMOCAO_DO_VINCULO_A_ATENDIMENTO_PAI`, `REMOCAO_DO_VINCULO_A_ATENDIMENTO_FILHO`, `FINALIZACAO_DE_ATENDIMENTO_FILHO`, `REABERTURA_DE_ATENDIMENTO_FILHO`) | Vínculo/desvínculo entre atendimentos pai e filho |
| `TROCA_FILA_ATENDIMENTO`, `TROCA_CATEGORIA`, `TROCA_PRODUTO_SERVICO`, `TROCA_MODULO`, `TROCA_SUBMODULO` | Reclassificações |
| `TERMO_ACEITE` | Assinatura/recusa de termo |

A lista completa de tipos está no schema da tool (`tarefas_tipo`). Use-a para filtrar histórico e reduzir ruído — por exemplo, só `COMENTARIO` quando o usuário pergunta o que foi falado.

O histórico vem paginado (`tarefas_offset`, `tarefas_limite`, padrão 50). Se a conversa exigir o histórico inteiro, percorra todas as páginas.

## Vínculo entre atendimentos (pai/filho)

Atendimentos podem ser vinculados entre si (pai/filho — ex.: um atendimento "filho" aberto a partir de uma programação). O detalhe do atendimento só expõe **contagens** (`qtdeAtendimentosPai`, `qtdeAtendimentosFilho`); os **ids** dos vinculados vêm das tarefas de vínculo no histórico:

- Filtre `tarefas_tipo` pelos tipos de vínculo (`VINCULO_A_ATENDIMENTO_PAI`, `VINCULO_A_ATENDIMENTO_FILHO`, `REMOCAO_DO_VINCULO_A_ATENDIMENTO_PAI`, `REMOCAO_DO_VINCULO_A_ATENDIMENTO_FILHO`, `FINALIZACAO_DE_ATENDIMENTO_FILHO`, `REABERTURA_DE_ATENDIMENTO_FILHO`).
- Em cada tarefa, o campo **`idAtendimentoVinculadoDesvinculado`** traz o **id do outro atendimento** (o pai do atual no `VINCULO_A_ATENDIMENTO_PAI`; o filho no `VINCULO_A_ATENDIMENTO_FILHO`).
- `descricaoTratada` traz o texto legível com `#id` e o motivo (ex.: `Este atendimento teve o atendimento #2062727 vinculado como seu pai.<br>Motivo do vínculo: Encaminhado para a programação`).
- Com o id em mãos, **busque o atendimento vinculado com `skynet_atendimento(<id>)`** — o fluxo funciona dos dois lados (ver exemplo na tabela "Exemplos de pergunta → chamada").

Exemplo de fluxo: "ache o atendimento pai de 2063977" → `skynet_atendimento(2063977, tarefas_tipo:["VINCULO_A_ATENDIMENTO_PAI","VINCULO_A_ATENDIMENTO_FILHO"])` → lê `idAtendimentoVinculadoDesvinculado: 2062727` → `skynet_atendimento(2062727)`.

## Mapa de filtros

| Parâmetro da tool | Campo enviado à API | Tipo |
|---|---|---|
| `responsavel_id` | `idUsuarioResponsavelAtualEquals` | exato |
| `responsavel_nome` | `nomeUsuarioResponsavelAtualLike` | like |
| `equipe_id` | `idEquipeUsuarioResponsavelAtualEquals` | exato |
| `cliente_id` / `clientes_ids` | `idClienteEquals` / `listaIdClienteIn` | exato |
| `solicitante_nome` | `nomeSolicitanteLike` | like |
| `status` | `listaStatusIn` | lista |
| `prioridade_ids` | `listaIdPrioridadeIn` | lista |
| `produto_servico_ids` | `listaIdProdutoServicoIn` | lista (id, não nome) |
| `produto_servico_id` | `idProdutoServicoEquals` | exato (ex.: `31` = IMOVEIS AD) |
| `fila` | `usuarioResponsavelAtualIsNull` | `true` sem responsável / `false` com responsável / omitir todos |
| `fila_id` | `idFilaEquals` | exato (id da fila) |
| `tipo_interno_ids` | `listaIdTipoInternoIn` | lista |
| `categoria_ids` | `listaIdCategoriaIn` | lista |
| `area_id` | `idAtendimentoAreaEquals` | exato |
| `aberto_via` | `listaAbertoViaIn` | lista |
| `descricao_like` | `descricaoTarefaLike` | like |
| `data_abertura_de` / `_ate` | `dataHoraTarefaAberturaMaiorOuIgualA` / `MenorOuIgualA` | intervalo |
| `data_finalizacao_de` / `_ate` | `dataHoraTarefaFinalizacaoMaiorOuIgualA` / `MenorOuIgualA` | intervalo |
| `privado` | `privadoEquals` | `true` só privados, `false` só públicos |
| `redmine_issue_id` | `redmineIssueIdEquals` | exato |

Limitações conhecidas da API (não tente contornar com filtros inventados):

- **Não há filtro por nome de produto/serviço no atendimento**: `nomeProdutoServicoLike`/`Equals` são **ignorados em silêncio** (total não muda) e nem existem em `RepositorioAtendimentoParams`. Resolva para id com a tabela abaixo ou com `skynet_buscar_cliente` / `skynet_buscar_usuario` e filtre por id.
- **Não há endpoint aberto de produtos/serviços**: `/v1/produtoservico/*` devolve 403 para este perfil. Os ids de produto não vêm no payload do atendimento (só `nomeProdutoServico`). Ids conhecidos foram descobertos por biseção na fila: **`31` = IMOVEIS AD** (produto "IMOVEIS" simples existe, id desconhecido — 0 itens na fila, invisível para bisseção).
- `*Like` é busca parcial: "Silva" pode devolver homônimos. Se vier resultado ambíguo, refine ou pergunte.
- `sort_by` vai cru para a API (`sortBy`) e a sintaxe não está documentada. Se a API recusar, repita sem `sort_by`.

Fonte da verdade dos filtros de atendimento: definição `RepositorioAtendimentoParams` do swagger (cópia local: `%USERPROFILE%\Downloads\swagger.json`, 2026-10; o servidor não hospeda swagger — `swagger-ui`/`api-docs` dão 404).

## Diagnóstico

| Situação | O que fazer |
|---|---|
| Erro `Sem token do SkyNet` | Não há `token.json`. Peça **usuário e senha** ao usuário e rode `node renovar-token.mjs <usuario> <senha>` (grava só o token, ~8h de validade). Não reinicie o OpenCode: o MCP relê o token sozinho. |
| Erro `Token do SkyNet expirado (401)` | Mesmo passo: pedir credenciais e rodar `renovar-token.mjs`. |
| Login recusado (`E-mail incorreto ou senha incorreta`) | Confirme os dados com o usuário antes de tentar de novo. |
| Lista vazia sem erro | Pode ser (a) filtro restritivo demais, (b) o usuário não tem permissão para ver aquele cliente/atendimento, (c) consulta no período errado. Cheque com `skynet_usuario_logado` e reduza filtros um a um. |
| `403` / acesso negado | O token é válido mas o perfil não tem permissão. Informe o usuário e use o MCP do Redmine ou acesso humano. |
| `403` em `/v1/usuario/*` ou `/v1/cliente/*` | Perfil do token atual bloqueado nesses recursos (ex.: com o token de FERNANDO id54, `skynet_buscar_usuario`/`skynet_buscar_cliente` falham 403; só `/v1/atendimento/*` funciona). Renovar com conta de perfil com acesso, ou viver sem buscar usuário/cliente enquanto isso. |
| Timeout | A API pode demorar em relatórios grandes. Reduza `limite` e filtre por período/mês. |

## Renovação do token

- O token do SkyNet vale **~8h**. O MCP guarda **somente o token** em `token.json` (nunca usuário/senha).
- Quando o token vencer, **pergunte ao usuário o usuário e a senha** (não tente adivinhar nem reuse credenciais de outro lugar) e rode:

  ```bash
  node "C:\Users\<USUARIO>\.config\opencode\mcp\skynet\renovar-token.mjs" <usuario> <senha>
  ```

- Depois de renovar, **repita a chamada que falhou** — não é preciso reiniciar o OpenCode.

Pendências conhecidas:

- Se a conta exigir **duplo fator**, o login pode não devolver token direto; o script avisa e é preciso gerar o token por outro caminho e gravar em `token.json`.
- Para restringir o arquivo do token: `icacls "mcp\skynet\token.json" /inheritance:r /grant:r "%USERNAME%:F"`.
- A sintaxe de `sort_by` (`sortBy`) não está documentada (é string crua em `RepositorioAtendimentoParams`); o padrão é omitir e deixar a ordenação padrão da API.
- ~~`contar: true` quebrava~~ (antigo endpoint `contarClienteEspecifico` 401): corrigido — a contagem usa `POST /v1/atendimento/listarContar` com os mesmos filtros e lê `msg.total`. Lembrete: `listarContar` é **POST** (GET/PUT dão 405) e `max`/`first` vão no body.

## Exemplos de pergunta → chamada

| Pergunta | Chamada |
|---|---|
| "como está o atendimento 12345?" | `skynet_atendimento(12345)` |
| "o que o cliente falou no atendimento 12345?" | `skynet_atendimento(12345, tarefas_tipo:["COMENTARIO","COMENTARIO_DO_CLIENTE"])` |
| "quais os anexos do 12345?" | `skynet_atendimento(12345, tarefas_tipo:["COMENTARIO","COMENTARIO_DO_CLIENTE","RESOLUCAO"])` e olhar `listaArquivos` |
| "quantos atendimentos abertos a Maria tem?" | `skynet_buscar_usuario(nome:"Maria")` → `skynet_listar_atendimentos(responsavel_id:<id>, status:["ABERTO","EM_ATENDIMENTO"], contar:true)` |
| "quantos na fila de aguardando contato do Imóveis?" | `skynet_listar_atendimentos(fila:true, produto_servico_ids:[31], contar:true)` → `total` (base 06/10: ~50) |
| "atendimentos da Clínica X abertos em setembro" | `skynet_buscar_cliente(nome:"Clínica X")` → `skynet_listar_atendimentos(cliente_id:<id>, status:["ABERTO"], data_abertura_de:"2026-09-01T00:00:00", data_abertura_ate:"2026-09-30T23:59:59")` |
| "atendimentos vinculados à tarefa 4321 do Redmine" | `skynet_listar_atendimentos(redmine_issue_id:4321)` |
| "qual o prazo/SLA do 12345?" | `skynet_atendimento(12345)` e ler `nomePrioridade`, `dataPrazoAtender` |
| "quais os atendimentos pai/filho do 12345?" | `skynet_atendimento(12345, tarefas_tipo:["VINCULO_A_ATENDIMENTO_PAI","VINCULO_A_ATENDIMENTO_FILHO","REMOCAO_DO_VINCULO_A_ATENDIMENTO_PAI","REMOCAO_DO_VINCULO_A_ATENDIMENTO_FILHO"])` e ler `idAtendimentoVinculadoDesvinculado`; depois `skynet_atendimento(<id do vinculado>)` para os dados do outro lado |

## Apresentação da resposta

- Apresente em linguagem de negócio: status, cliente, responsável, prazo, e a última movimentação relevante.
- Datas: mostre em `dd/MM/yyyy hh:mm`; mantenha ISO-8601 apenas se o usuário pedir formato técnico.
- Cite o id do atendimento sempre que citar um atendimento — é como o usuário o reconhece.
- Se houver tarefas de sistema (sem autor humano), não as trate como interação do cliente.