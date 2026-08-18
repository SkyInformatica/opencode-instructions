# opencode-instructions

Repositório global de regras e configuração do [OpenCode](https://opencode.ai) para a **Sky Informática**.

## Configurar o OpenCode global

Em uma sessão do OpenCode, use o prompt abaixo:

```
siga as instrucoes do arquivo https://github.com/SkyInformatica/opencode-instructions/blob/main/instrucoes-configurar-opencode.md para configurar meu opencode
```

Isso criará `%USERPROFILE%\.config\opencode\opencode.json` apontando para os principios de engenharia deste repositório — carregados remotamente em toda sessão, sem copiar arquivos para cada projeto.

## Projetos Sky

Cada projeto mantém seu `AGENTS.md` (contexto de produto) e `.opencode/skills/` (playbooks). As regras globais vêm do repositório central automaticamente.

## Conteúdo deste repositório

| Arquivo | Descrição |
| --- | --- |
| `OPENCODE.md` | Guia completo: estrutura de pastas, regras, skills, comandos, setup global. |
| `rules/principios.md` | Princípios de engenharia (Library First, DRY, SOLID, KISS, YAGNI, Clean Code). |
| `instrucoes-configurar-opencode.md` | Instruções que o agente OpenCode segue para configurar o `opencode.json` global. |