# opencode-instructions

Repositório global de regras e configuração do [OpenCode](https://opencode.ai) para a **Sky Informática**.

## Instalação

1. Instale o [OpenCode](https://opencode.ai/download)
2. Instale o [OpenChamber](https://github.com/openchamber/openchamber/releases)
3. Após instalado, configure skills e regras com o prompt abaixo

## Configurar o OpenCode global

Em uma sessão do OpenCode, use o prompt abaixo:

```
siga as instrucoes do arquivo https://github.com/SkyInformatica/opencode-instructions/blob/main/prompt-configurar-opencode.md para configurar meu opencode
```

Isso configurará automaticamente:

- **`%USERPROFILE%\.config\opencode\opencode.json`** — modelo e small_model do agente, `instructions` apontando para todas as regras em `rules/` deste repositório
- **`%USERPROFILE%\.config\opencode\skills\`** — skills da Sky (C#, Delphi)

Tudo carregado remotamente, sem copiar arquivos para cada projeto. O prompt é seguro para executar múltiplas vezes: nunca duplica nem sobrescreve configurações existentes.

## Projetos Sky

Cada projeto mantém seu `AGENTS.md` (contexto de produto) e `.opencode/skills/` (playbooks). As regras globais vêm do repositório central automaticamente.

## Estrutura

- `global/` — modelos de referência para config global do OpenCode (`opencode.json`)
- `rules/` — regras de engenharia carregadas remotamente via `instructions`
- `skills/` — skills globais da Sky (C#, Delphi)
- `OPENCODE.md` — guia completo de setup OpenCode