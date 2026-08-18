# opencode-instructions

Repositório global de regras e configuração do [OpenCode](https://opencode.ai) para a **Sky Informática**.

## O que contém

| Arquivo | Descrição |
| --- | --- |
| `OPENCODE.md` | Guia completo: estrutura de pastas, regras, skills, comandos e setup global do OpenCode. |
| `rules/principios.md` | Princípios de engenharia carregados em toda sessão (Library First, DRY, SOLID, KISS, YAGNI, Clean Code, etc.). |
| `instrucoes-configurar-opencode.md` | Prompt para configurar o `opencode.json` global na máquina do desenvolvedor Windows. |

## Como usar

### 1. Configurar o OpenCode global

Em uma sessão do OpenCode, peça para executar as instruções em `instrucoes-configurar-opencode.md`.

Você pode referenciar o arquivo diretamente do repositório:

```
Siga as instruções em https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/instrucoes-configurar-opencode.md
para configurar o opencode.json global na minha máquina.
```

Isso criará `%USERPROFILE%\.config\opencode\opencode.json` apontando para as regras remotas deste repositório.

### 2. Usar nos projetos

Cada projeto Sky mantém seu próprio `AGENTS.md` (contexto de produto) e `.opencode/skills/` (playbooks específicos). As regras globais de engenharia são carregadas automaticamente do repositório central — sem duplicação.

## Detalhes

Para entender o funcionamento completo (carga de regras, skills, comandos, opencode.json), leia o [OPENCODE.md](./OPENCODE.md).