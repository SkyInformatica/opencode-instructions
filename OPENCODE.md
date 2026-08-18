# Desenvolvimento com OpenCode

## Visão geral

### Padrões que OpenCode reconhece

Ferramentas de IA para programação organizam regras, skills e comandos em pastas. Cada ferramenta usa um nome de pasta raiz diferente:

| Ferramenta             | Pasta raiz   |
| ---------------------- | ------------ |
| OpenCode               | `.opencode/` |
| Claude Code            | `.claude/`   |
| GPT Codex, Antigravity | `.agents/`   |

O OpenCode reconhece as três convenções. Se existirem múltiplas, a ordem de precedência é `.agents/` → `.claude/` → `.opencode/`. Dentro da pasta raiz, a estrutura de subpastas é a mesma: `rules/`, `skills/`, `commands/`.

Além disso, um projeto pode ter um arquivo `AGENTS.md` (ou `CLAUDE.md` como fallback) na raiz com regras carregadas em todo prompt, e um `opencode.json` com configurações.

### Nosso padrão: `.opencode/`

Usamos `.opencode/` como pasta canônica do projeto:

```
.opencode/
├── skills/             # habilidades carregadas sob demanda
│   ├── backend-playbook/
│   │   └── SKILL.md
│   └── frontend-playbook/
│       └── SKILL.md
└── commands/           # comandos personalizados (quando houver)
```

O contexto do produto (resumo canônico) fica no `AGENTS.md` na raiz do projeto, carregado automaticamente pelo OpenCode. Os princípios de engenharia são carregados remotamente pelo `instructions` do `opencode.json` global (ver abaixo). Skills carregam detalhes operacionais sob demanda para economizar tokens em cada sessão.

## Como o OpenCode carrega regras

Em toda sessão, o OpenCode carrega no contexto do agente:

1. **Arquivos de regras** — ordem de busca:
   - Projeto: `<projeto>/AGENTS.md` (ou `CLAUDE.md` se não houver `AGENTS.md`)
   - Global: `%USERPROFILE%\.config\opencode\AGENTS.md` (ou `%USERPROFILE%\.claude\CLAUDE.md` se não houver)

   Apenas o `AGENTS.md` da **raiz do projeto** é carregado automaticamente. `AGENTS.md` em subpastas (ex.: `backend/AGENTS.md`) é ignorado a menos que referenciado explicitamente em `instructions`.

2. **Campo `instructions` do `opencode.json`** — permite globs de arquivos locais e **URLs remotas** (timeout 5s). Combinadas com o `AGENTS.md`. É o mecanismo que usamos para carregar principios.md remotamente no `opencode.json` global.
3. **Configuração (`opencode.json`)** — define modelo, provedor, MCPs, plugins e permissões. Lida em dois níveis (mesclados):
   - Global: `%USERPROFILE%\.config\opencode\opencode.json`
   - Projeto: `<projeto>/opencode.json` (maior precedência)

Links oficiais: [Regras](https://opencode.ai/docs/pt-br/rules/) · [Configuração](https://opencode.ai/docs/pt-br/config/).

## Estrutura de pastas do projeto

```
.
├── .opencode/
│   ├── skills/             # habilidades carregadas sob demanda
│   │   ├── backend-playbook/
│   │   │   └── SKILL.md
│   │   └── frontend-playbook/
│   │       └── SKILL.md
└── opencode.json
```

O `AGENTS.md` na raiz carrega automaticamente o contexto do produto. Os principios.md são carregados remotamente pelo `instructions` do `opencode.json` global. Skills carregam detalhes operacionais sob demanda.

## Regras — carregadas sempre

Regras carregadas em **toda sessão, todo prompt**, combinando duas fontes:

1. **`AGENTS.md`** na raiz do projeto — contexto do produto (carregado automaticamente).
2. **`instructions` do `opencode.json` global** — principios.md carregado remotamente do repositório compartilhado da Sky Informática:

```json
{
  "instructions": [
    "https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/rules/principios.md"
  ]
}
```

O `opencode.json` global (`%USERPROFILE%\.config\opencode\opencode.json`) aceita URLs remotas (timeout 5s). Isso permite compartilhar principios entre todos os projetos Sky sem duplicar arquivos. Instruções específicas de domínio (backend, frontend, deploy) vão em skills, carregadas sob demanda.

## Skills (`.opencode/skills`) — carregadas sob demanda

Skills são instruções **carregadas sob demanda** pela ferramenta `skill` do OpenCode, quando o agente identifica que a tarefa corresponde à descrição. Cada skill é uma pasta `<nome>/SKILL.md` com frontmatter YAML (`name`, `description`).

**Por que separar regras de skills?** Regras consomem tokens em toda sessão; skills só quando ativadas. Instruções extensas e específicas (playbooks, guias de integração) devem ficar em skills para economizar contexto. Exemplo real do projeto **Sk.AI**:

| Skill               | O que faz                                                              |
| ------------------- | ---------------------------------------------------------------------- |
| `backend-playbook`  | Playbook do backend: arquitetura, autenticação, domínios, integrações. |
| `frontend-playbook` | Playbook do frontend: roteamento, autenticação, consumo de API.        |
| `deploy`            | Publicação da aplicação em homologação/produção.                       |

Skills do projeto ficam em `.opencode/skills/` (commitadas). Skills globais (caveman, ponytail) ficam em `%USERPROFILE%\.config\opencode\skills\`.

Links: [Skills (Habilidades do Agente)](https://opencode.ai/docs/pt-br/skills/).

## Comandos (`.opencode/commands`)

Comandos personalizados para tarefas repetitivas, executados via `/comando` no TUI. Ficam em `.opencode/commands/` (projeto) ou `%USERPROFILE%\.config\opencode\commands\` (global). No momento não usamos comandos de projeto, mas o padrão está definido.

Links: [Comandos](https://opencode.ai/docs/pt-br/commands/).

## Setup global (`%USERPROFILE%\.config\opencode\`)

Ferramentas de produtividade instaladas uma vez na máquina, servem a todos os projetos e **não são commitadas**:

### rtk

Proxy CLI que compacta saída de comandos (ls/read/grep/git) para reduzir tokens.

Instalação no Windows — baixe de https://github.com/rtk-ai/rtk/releases e coloque no PATH.

Site oficial: <https://www.rtk-ai.app/>. Use `rtk read`, `rtk ls`, `rtk rg`, `rtk git`.

### caveman

Plugin de comunicação ultra-compacta: respostas estilo "caveman", cortando enfeites mas mantendo conteúdo técnico. Modos: `lite`, `full`, `ultra`, `wenyan`.

### ponytail

Plugin "dev sênior preguiçoso": escolhe sempre a solução mais simples (stdlib/nativo > biblioteca), evita abstração desnecessária, marca simplificações com `ponytail:`. Habilita junto com caveman (mesmo plugin list acima).

## Ambiente desktop: IDE OpenChamber

Para ambiente desktop, use a IDE **OpenChamber** ([site](https://openchamber.dev/) · [docs](https://docs.openchamber.dev/)) — workspace visual sobre o OpenCode que mostra e controla o trabalho do agente (sessões isoladas, revisão de diffs, terminais, progresso), reaproveitando o mesmo setup de regras, skills e `opencode.json`.
