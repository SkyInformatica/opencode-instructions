# Instruções de contexto — Azure DevOps Sky Informática

Este documento descreve o contexto do ambiente Azure DevOps da Sky Informática para auxiliar nas interações com o servidor MCP (`azure-devops`).

## Valores padrão da Sky

Estes valores são padrão da empresa — **todos os programadores da Sky** os usam. Use-os por padrão em toda interação, a menos que o usuário peça explicitamente outra coisa.

- **Organização:** `SkyInfoDevOps`
- **Projeto padrão:** `Terra Média`
- **Domínios padrão (tools MCP):** `core`, `work`, `work-items`, `repositories`

O projeto é sempre **`Terra Média`** no ambiente da Sky. Não pergunte o projeto ao usuário — assuma `Terra Média` como padrão em todas as consultas de PRs, work items, repos e demais operações, exceto quando o usuário citar outro projeto explicitamente.

## Memória local (azure-config.json) — gerado somente sob demanda

Este arquivo **não** é criado por padrão na instalação. Ele só existe quando há necessidade de guardar uma preferência local do usuário que **diverge dos padrões globais da Sky**. Gerar/criar apenas quando ocorrer **um** destes casos:

1. **Override local de projeto ou organização** — o usuário trabalha num projeto diferente de `Terra Média` (ou organização diferente de `SkyInfoDevOps`) e quer memorizar essa preferência.
2. **Autenticação por variável de ambiente** — o usuário optou por usar PAT (`autenticacao: pat` / `envvar`) em vez de interativa.

Fora desses casos, **não crie** o arquivo: use direto os padrões da Sky (seção acima).

- **Local do config:** `%USERPROFILE%\.config\opencode\azure-config.json`
- **Formato:**
  ```json
  {
    "organizacao": "SkyInfoDevOps",
    "autenticacao": "interativa" | "envvar" | "pat",
    "dominios": ["core", "work", "work-items", "repositories", "wiki", "pipelines"],
    "projeto": "Terra Média"
  }
  ```
- **IMPORTANTE:** este arquivo **nunca** contém o token/PAT. Ele guarda apenas metadados. O segredo fica na variável de ambiente do Windows (`PERSONAL_ACCESS_TOKEN`) ou via login interativo. Nunca escreva segredos neste arquivo.
- **Remoção:** se o usuário voltar aos padrões da Sky (projeto `Terra Média`, interativo), o arquivo pode ser removido e deixa de influenciar.

Comportamento do agente:

1. **No início das interações de tarefa**, verifique se `azure-config.json` existe. Se existir, use `organizacao`, `dominios`, `projeto` e `autenticacao` **somente nos campos presentes** que divergem do padrão.
2. **Se não existir**, use os valores padrão da Sky (seção acima) — `SkyInfoDevOps`, `Terra Média`, domínios padrão, auth interativa.
3. **Criar:** somente se o usuário trocar de projeto/org ou optar por auth por env var — aí sim crie/atualize o `azure-config.json` com o override (o padrão da Sky no `azure-instructions.md` continua valendo como referência geral).
4. **Remover:** se o usuário disser que voltou ao padrão (ex.: agora usa `Terra Média` de novo / voltou à auth interativa), remova o `azure-config.json`.

## Domínios de tools

O MCP pode ser configurado para carregar apenas certos grupos de ferramentas (domínios) para manter a lista enxuta. Domínios disponíveis:

| Domínio | Cobre |
|---------|-------|
| `core` | Informações de projeto (sempre incluir) |
| `work` | Iterações e organização do trabalho |
| `work-items` | Work items (tarefas, bugs, histórias) |
| `search` | Busca de código e work items |
| `test-plans` | Planos e suítes de teste |
| `repositories` | Repositórios e código |
| `wiki` | Wikis |
| `pipelines` | Pipelines e builds |
| `advanced-security` | Advanced Security |

A lista de domínios carregados é fixa nos argumentos `-d` do MCP no `opencode.json` e refletida nos padrões da Sky acima.

## Exemplos de uso

- "List meus work items do projeto X" → usar tools do domínio `work-items`.
- "Listar builds do pipeline Y" → usar tools do domínio `pipelines`.
- "Buscar arquivo no repo Z" → usar tools do domínio `repositories`/`search`.
- "Listar projetos ADO" → tool do domínio `core`.

## Boas práticas

- Use por padrão o projeto **`Terra Média`** e a organização **`SkyInfoDevOps`**; só use outro se o usuário pedir explicitamente.
- Prefira perguntar/usar o projeto e a iteração corretos antes de criar work items.
- Ao listar, utilize a paginação quando o MCP oferecer (não corte resultados).
- Nunca vazar tokens ou dados sensíveis em logs ou respostas.
