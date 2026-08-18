# opencode-instructions

Repositório global de regras e configuração do [OpenCode](https://opencode.ai) para a **Sky Informática**.

## Configurar o OpenCode global

Em uma sessão do OpenCode, use o prompt abaixo:

```
siga as instrucoes do arquivo https://github.com/SkyInformatica/opencode-instructions/blob/main/prompt-configurar-opencode.md para configurar meu opencode
```

Isso configurará automaticamente:

- **`%USERPROFILE%\.config\opencode\opencode.json`** — modelo e small_model do agente, `instructions` apontando para todas as regras em `rules/` deste repositório
- **`%USERPROFILE%\.config\opencode\AGENTS.md`** — comportamento global do agente (caveman, ponytail)
- **`%USERPROFILE%\.config\opencode\skills\`** — skills da Sky (C#, Delphi)

Tudo carregado remotamente, sem copiar arquivos para cada projeto. O prompt é seguro para executar múltiplas vezes: nunca duplica nem sobrescreve configurações existentes.

## Projetos Sky

Cada projeto mantém seu `AGENTS.md` (contexto de produto) e `.opencode/skills/` (playbooks). As regras globais vêm do repositório central automaticamente.

## Conteúdo deste repositório

| Arquivo | Descrição |
| --- | --- |
| `AGENTS.md` | Modelo de referência do `AGENTS.md` global (comportamento do agente em toda sessão). |
| `opencode.json` | Modelo de referência do `opencode.json` global (`model`, `small_model`, `instructions`). |
| `OPENCODE.md` | Guia completo: estrutura de pastas, regras, skills, comandos, setup global. |
| `rules/principios.md` | Princípios de engenharia (Library First, DRY, SOLID, KISS, YAGNI, Clean Code). |
| `prompt-configurar-opencode.md` | Instruções que o agente OpenCode segue para configurar o ambiente global. |
| `skills/sky-csharp/SKILL.md` | Regras de C# da Sky (nomenclatura pt-BR, interop COM, arquitetura DLL+Backend). |
| `skills/sky-delphi/SKILL.md` | Regras de Delphi da Sky (nomenclatura pt-BR, compatibilidade D5/D7↔D10.2, encoding). |