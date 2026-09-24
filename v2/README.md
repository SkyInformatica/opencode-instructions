# OpenCode V2 — configurações e prompts da Sky

Este diretório contém **somente** as versões OpenCode **V2** das configurações e prompts da Sky. A raiz do repositório continua sendo a versão **V1** — assim, dá para migrar máquina por máquina sem perder as instruções V1.

## Estrutura

```
v2/
├── README.md          ← este arquivo
├── global/
│   └── opencode.json  ← modelo de config global em formato nativo V2
├── agents/            ← agents com frontmatter nativo V2 (permissions, mode)
├── prompts/           ← prompts de instalação/ configuração orientados a V2
└── plugins/
    └── encoding-auto/ ← plugin portado para a API V2 (Plugin.define + ctx.tool.hook)
```

## O que fica compartilhado (não duplicar)

`skills/` e `rules/` funcionam igual no V1 e no V2 (definições baseadas em arquivo) — **não** têm cópia aqui. Instale-os do mesmo lugar de sempre.

## Diferenças V2 relevantes já aplicadas aqui

| Item | V1 (raiz) | V2 (este dir) |
| --- | --- | --- |
| Config global | `small_model` | `agents.title.model` |
| Chave de plugins | `plugin` | `plugins` |
| Frontmatter de agent | `permission:` (mapa) | `permissions:` (array) |
| encoding-auto | plugin API V1 (upstream) | port V2 em `v2/plugins/encoding-auto/` |

## Status de migração dos plugins

| Plugin | É V2-compatível hoje? | Onde acompanhar |
| --- | --- | --- |
| encoding-auto | ✅ portado neste repo (`v2/plugins/encoding-auto/`) | prompt: `v2/prompts/prompt-instalar-encoding-auto-opencode.md` |
| rtk | ⏳ em dev upstream (`--opencode-v2`, PR em aberto) | prompt checa a flag: `v2/prompts/prompt-instalar-rtk-opencode.md` |
| secret-redactor | ❌ upstream ainda V1 (0.5.1) | prompt avisa e sugere aguardar/usar rehydra |
| rehydra | ❌ upstream ainda V1 | prompt avisa |
| ponytail | ❌ upstream ainda V1 (4.x) | prompt avisa (AGENTS.md do ponytail ainda vale como regra) |
| caveman | ❌ plugin upstream V1; skill + bloco AGENTS.md seguem funcionando no V2 | prompt avisa |

Prompts de MCP (azuredevops, redmine) e de ambiente Windows são válidos nos dois — o V2 traduz a forma V1 da config `mcp` automaticamente.

## Como usar

1. Git clone/pull este repo (mesmo de antes).
2. Ao migrar uma máquina para V2, use os prompts **deste diretório** (`v2/prompts/`) — não os da raiz.
3. As regras/skills continuam instalando das pastas `rules/` e `skills/` da raiz.
4. **Cuidado**: V1 e V2 leem os mesmos locais de config (`~/.config/opencode/`). Depois de converter a config de uma máquina para o formato nativo V2, não aponte o OpenCode V1 para a mesma pasta.

## Referência

- Guia de migração oficial: https://opencode.ai/v2/docs/migrate-v1
- Migração de plugins: https://opencode.ai/v2/docs/build/plugins/migrate-v1