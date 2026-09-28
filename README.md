# README

> **Novo no OpenCode?** Leia o [guia completo de setup OPENCODE.md](OPENCODE.md) antes de prosseguir.

Repositório global de regras e configuração do [OpenCode](https://opencode.ai) para a **Sky Informática**.

## Versões V1 e V2

O repositório atende **duas versões** do OpenCode em pastas separadas, para migrar máquina por máquina:

| Pasta | Versão | Conteúdo |
|---|---|---|
| **`v2/`** | **V2 — padrão atual** | config nativa, agents, prompts e plugins V2 |
| `v1/` | V1 (legado) | config antiga (`small_model`, `plugin`), agents e prompts V1 |
| **raiz** | **compartilhado** | `rules/`, `skills/`, arquivos de instrução (MCP/Redmine/Azure) e os prompts de MCP e de ambiente Windows — válidos nas duas versões |

**Os comandos deste README usam os prompts de `v2/prompts/` (padrão).** Se a máquina ainda roda OpenCode V1, troque `/v2/prompts/` por `/v1/prompts/` na URL do prompt. `rules/` e `skills/` são as mesmas nos dois — instale sempre da raiz.

Detalhes da migração V1→V2: [`v2/README.md`](v2/README.md).

## Instalação

### OpenCode Desktop (Windows)

Baixe e instale a versão desktop do OpenCode para Windows — não precisa de WSL:

- Instalador NSIS (64-bit): [opencode.ai/br/download/stable/windows-x64-nsis](https://opencode.ai/br/download/stable/windows-x64-nsis)
- Demais plataformas: [opencode.ai/br/download](https://opencode.ai/br/download)

### OpenChamber (IDE desktop — recomendado)

O [OpenChamber](https://github.com/openchamber/openchamber/releases) é a IDE desktop para OpenCode e o padrão sugerido pela Sky por ser bem mais completo que o OpenCode Desktop. Ele usa o OpenCode instalado no passo anterior como backend.

### Autenticar no OpenCode Zen

1. Abra o OpenCode Desktop ou OpenChamber
2. No menu **Settings**, procure a opção **Providers**
3. Adicione o provider **opencode zen**
4. **Autentique com login**: clique em **Sign in** / **Log in** — o navegador abre o site do OpenCode; clique em **"OpenCode Console account"**, faça login (conta `@skyinformatica.com.br`) e **autorize** o acesso. Ao voltar para o OpenCode, o provider fica autenticado — não é mais necessário inserir chave de API.

### Configurar skills e regras

Após instalado, configure com o prompt abaixo.

### Configurar Ambiente Windows (Git, Node.js)

Antes de instalar plugins ou configurar regras, garanta que as ferramentas essenciais estão disponíveis. Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-configurar-ambiente-windows.md para configurar o ambiente
```

Isso instalará (se necessário) e configurará no PATH:
- **Node.js 18+** (necessário para plugins)
- **Git** (necessário para npm/npx e versionamento)

## Configurar o OpenCode global

A configuração pode ser feita via **OpenCode Desktop** ou **OpenChamber** — ambos usam o mesmo arquivo `opencode.json` global. Em uma sessão do OpenCode, use o prompt abaixo:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-configurar-opencode.md para configurar meu opencode
```

O prompt é interativo e perguntará o escopo desejado. Você pode personalizar a instalação de diversas formas:

> Para OpenCode **V1**, use `v1/prompts/prompt-configurar-opencode.md` no lugar de `v2/prompts/...`.

#### Exemplos de uso

**Instalação completa (regras + skills + modelos):**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-configurar-opencode.md para instalar todas as regras e skills da Sky
```

**Somente skills (todas):**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-configurar-opencode.md para instalar somente as skills da Sky
```

**Somente um time (regras + skills):**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-configurar-opencode.md para instalar somente as regras e skills do time delphi
```
Troque `delphi` por `dotnet` para o outro time. O prompt resolve pelo prefixo `sky-delphi-`/`sky-dotnet-` e inclui os itens gerais (`sky-principios`, `sky-oquehadenovo`).

**Somente regras (todas):**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-configurar-opencode.md para instalar somente as regras da Sky
```

**Somente regras Delphi e SVN:**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-configurar-opencode.md para instalar somente as regras sky-delphi-diretivas e sky-delphi-svn da Sky
```

**Somente regra de princípios:**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-configurar-opencode.md para instalar somente a regra sky-principios da Sky
```

**Somente skills do time .NET (C#):**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-configurar-opencode.md para instalar somente as skills sky-dotnet-testes e sky-dotnet-proposta da Sky
```

**Somente configurar modelos:**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-configurar-opencode.md para configurar somente os modelos do OpenCode Zen
```

Nota: o prompt não configura mais whitelist de modelos — os modelos ficam livres, sem restrição no `opencode.json`.

Isso configurará automaticamente:

- **`%USERPROFILE%\.config\opencode\opencode.json`** — modelo e small_model do agente, `instructions` apontando para todas as regras em `rules/` deste repositório
- **`%USERPROFILE%\.config\opencode\rules\`** — regras da Sky (`sky-principios`, `sky-delphi-diretivas`, `sky-delphi-svn`)
- **`%USERPROFILE%\.config\opencode\skills\`** — skills da Sky, prefixadas por time (`sky-delphi-*`, `sky-dotnet-*`) e as compartilhadas `sky-oquehadenovo`
- **`%USERPROFILE%\.config\opencode\agents\`** — agents da Sky (orquestrador, executor)

Tudo carregado da pasta global (rules copiados da repo para `%USERPROFILE%\.config\opencode\rules\`), sem copiar arquivos para cada projeto. O prompt é seguro para executar múltiplas vezes: nunca duplica nem sobrescreve configurações existentes.

## Agentes Orquestrador e Executor

Estrutura de **dois agents complementares** para desenvolvimento guiado por plano aprovado:

- **Orquestrador** (primário): planeja antes de codar, apresenta o plano para aprovação do usuário e só então executa. Decisão por complexidade: tarefa simples ele mesmo implementa na sessão; tarefa complexa delega ao executor.
- **Executor** (subagente): implementa arquivo por arquivo, na ordem e escopo exatos do plano aprovado — sem mudar o que não está quebrado, sem expandir escopo.

Instalam juntos com regras e skills pelo prompt de configuração:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-configurar-opencode.md para instalar somente os agents da Sky
```

### Como usar

1. **Invoque o orquestrador**: no OpenCode, selecione o agent `orquestrador` (ou inicie a sessão mencionando "use o orquestrador"). O orquestrador é um agent **primário**, então pode ser escolhido como agente da sessão.
2. **Receba o plano**: ele lê o código afetado e devolve um plano em pt-BR (arquivos, ordem, riscos) — sem editar nada.
3. **Aprove ou ajuste**: revise o plano e confirme ("aprovado") ou peça mudanças. Só depois disso ele implementa.
4. **Execução automática**: tarefa complexa é delegada ao subagente `executor` com o plano aprovado; tarefa simples o próprio orquestrador resolve na sessão.
5. **Verificação**: ao final ele confere o diff e reporta o resultado — incluindo quando o código **não foi compilado** (build Delphi indisponível no ambiente, nunca reporta "compila" sem build).

O `executor` também pode ser chamado diretamente via task tool com um plano já aprovado, quando você mesmo quer orquestrar a divisão do trabalho.

### Vantagens da estrutura

- **Plano antes do código**: tarefa complexa não sai codando direto; o orquestrador lê o código afetado, produz plano e espera aprovação — evita retrabalho e mudança de rumo no meio da implementação.
- **Escopo travado**: executor segue o plano aprovado à risca; sem "melhorias" não solicitadas nem refatorações de código quebrado.
- **Contexto focado por papel**: orquestrador mantém a visão geral (análise, riscos, ordem); executor recebe só o plano e os arquivos — cada um usa o modelo adequado (flash pra orquestrar, pro pra executar).
- **Reuso em qualquer projeto**: agents ficam no config global e valem para todas as tarefas da máquina, sem configuração por projeto.

## Instalar plugins

> Os comandos abaixo usam os prompts de `v2/prompts/`. Para OpenCode **V1**, troque `/v2/prompts/` por `/v1/prompts/`.

### Secret Redactor (proteção contra vazamento de segredos)

Plugin que anonimiza chaves, tokens e strings de conexão antes de enviar ao LLM, prevenindo vazamento de dados sensíveis. Zero configuração após instalação.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-instalar-secret-redactor-opencode.md para instalar o plugin
```

### Rehydra (anonimização de PII e secrets)

Plugin oficial que detecta e anonimiza PII (emails, telefones, CPFs, cartões) e secrets (API keys, JWTs, connection strings) antes de enviar ao LLM. Também detecta valores reais de variáveis de ambiente em arquivos `.env`.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-instalar-rehydra-opencode.md para instalar o plugin
```

### Caveman (respostas compactas)

Skill que comprime respostas do agente em formato terse/caveman, reduzindo tokens em ~65%.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-instalar-caveman-opencode.md para instalar o caveman
```

### RTK (compressão de output de bash)

Proxy CLI que intercepta comandos shell e comprime a saída antes do agente ler, reduzindo até 90% do output de bash (git, cargo, npm, docker, etc.).

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-instalar-rtk-opencode.md para instalar o RTK
```

### PonyTail (código mínimo)

Skill que força o agente a escrever apenas o necessário — YAGNI, stdlib primeiro, KISS. Reduz ~54% de código gerado (ate 94%) e ~20% de custo.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-instalar-ponytail-opencode.md para instalar o PonyTail
```

### Encoding Auto (arquivos ANSI/LATIN1)

Plugin que resolve automaticamente o encoding de arquivos (ANSI/Windows-1252, UTF-8, etc.): no read detecta e decodifica (agente vê o texto correto, sem mojibake); no edit/write converte ANSI→UTF-8 antes, aplica e converte de volta pro encoding original — acentos preservados. Essencial para projetos Delphi que mantêm fontes em ANSI/LATIN1.

Usa a versão ajustada pela Sky: corrige a corrupção de .pas ANSI (Windows-1252) e evita injeção de prefixo PowerShell em shell bash.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/v2/prompts/prompt-instalar-encoding-auto-opencode.md para instalar o plugin
```

## Instalar MCP Redmine

Servidor MCP que conecta o OpenCode ao Redmine da Sky, permitindo buscar/criar/atualizar tarefas, gerenciar sprints (Versions), lançar apontamentos de tempo, subir/baixar anexos e consultar a API completa via `redmine_request`.

Configura o MCP global no `opencode.json` com:
- **URL padrão**: `https://redmine.skyinformatica.com.br` (HTTPS)
- **API key**: solicitada ao usuário no momento da instalação
- **Instruções de contexto**: baixa `redmine-instructions.md` deste repositório para `%USERPROFILE%\.config\opencode\` e aponta `REDMINE_REQUEST_INSTRUCTIONS` para ele (paginação completa, formato de sprints/Versions, IDs de equipes)
- Roda via `uvx` (Python 3.12 obrigatório), instalando `uv` automaticamente se necessário

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-instalar-mcp-redmine-opencode.md para configurar o MCP do redmine
```

## Instalar MCP Azure DevOps

Servidor MCP que conecta o OpenCode ao Azure DevOps da Sky, permitindo lidar com projetos, work items, repos, wikis, pipelines, test plans e advanced security via tools (`core`, `work`, `work-items`, `repositories`, etc.).

Configura o MCP global no `opencode.json` com:
- **Organização**: `SkyInfoDevOps`
- **Projeto padrão**: `Terra Média`
- **Autenticação**: perguntada no momento da instalação — interativa (login Microsoft) ou Personal Access Token (PAT) salvo como variável de ambiente de usuário do Windows (`PERSONAL_ACCESS_TOKEN`), não em texto claro
- **Instruções de contexto**: baixa `azure-instructions.md` deste repositório para `%USERPROFILE%\.config\opencode\` e aponta para ele (organização, domínios carregados e convenções de uso)
- Roda via `npx` (pacote npm `@azure-devops/mcp`), exigindo Node.js 20+ — o `npx` instala as dependências automaticamente se não existirem (`-y`)

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-instalar-mcp-azuredevops-opencode.md para configurar o MCP do Azure DevOps
```

## Projetos Sky

Cada projeto mantém seu `AGENTS.md` (contexto de produto) e `.opencode/skills/` (playbooks). As regras globais vêm do repositório central automaticamente.

## Estrutura

- `v2/` — configuração e prompts do OpenCode **V2 (padrão)**: `global/`, `agents/`, `prompts/`, `plugins/`
- `v1/` — mesma estrutura para o OpenCode **V1 (legado)**: `global/`, `agents/`, `prompts/`
- `rules/` — regras de engenharia (compartilhadas), carregadas via `instructions`
- `skills/` — skills globais da Sky (compartilhadas, prefixadas por time — ver taxonomia abaixo)
- `azure-instructions.md`, `redmine-instructions.md` — contexto dos MCPs (compartilhados)
- `prompt-instalar-mcp-*.md`, `prompt-configurar-ambiente-windows.md` — prompts compartilhados (valem V1 e V2)
- `OPENCODE.md` — guia completo de setup OpenCode

## Taxonomia de nomes

Skills e regras seguem o padrão `sky-<time>-<assunto>`:

- **`sky-`** — ownership: separa as skills da Sky das de terceiros (`caveman`, `ponytail`, `docling`) instaladas na mesma pasta global.
- **`<time>`** — time dono do playbook:
  - **`delphi`** — time Delphi (Redmine + SVN + Delphi/VCL, incluindo C# de interop: `sky-delphi-csharp`).
  - **`dotnet`** — time .NET (Azure DevOps + git + OpenSpec).
  - **ausente** — compartilhada entre times (ex.: `sky-oquehadenovo`).
- **`<assunto>`** — resto, minúsculo com hífen.

Exemplos: `sky-delphi-revisar`, `sky-dotnet-revisar-pr`, `sky-delphi-devexpress`, `sky-oquehadenovo`.

Regras seguem o mesmo prefixo quando são de um time (`sky-delphi-diretivas`, `sky-delphi-svn`); regras gerais usam só `sky-` (`sky-principios`).

Os referenciais técnicos compartilhados ficam em `skills/references/<time>/` — hoje `skills/references/dotnet/` (arquitetura, regras de codificação, testes, input de PR) e `skills/references/delphi/` (reservado).
