# AGENTS.md

## Contexto

Este repo é um **repositório de compartilhamento** de skills, regras e agents para configurar o OpenCode nas máquinas dos programadores da Sky Informática.

**Não é um projeto de software.** É uma biblioteca de configurações distribuídas entre a equipe.

## Regra crítica: editar arquivos DO REPO, não do OpenCode local

Quando working neste repo e o usuário pede para "editar uma skill", "editar uma regra" ou "editar um agent", ele quer dizer **o arquivo dentro deste repositório** — não a configuração instalada no OpenCode local da máquina.

- ** skills/** → skill files do repo (compartilhadas via git)
- ** rules/** → regra files do repo (compartilhadas via git)
- ** agents/** → agent files do repo (compartilhadas via git)

**Não** editamos `%USERPROFILE%\.config\opencode\` da máquina local. O que editamos aqui é o que será distribuído para outras máquinas via push/clone.

## Estrutura

```
skills/          → skills globais da Sky
rules/           → regras de engenharia (instructions)
agents/          → agents (orquestrador, executor)
global/          → modelo de opencode.json para config global
```

Normalmente no OpenCode esses arquivos ficam em `.opencode/`. Neste repo ficam na raiz porque é de compartilhamento, não de execução.

## Workflow ao editar

1. Edite o arquivo em `skills/`, `rules/` ou `agents/` conforme necessário
2. Não se preocupe se a skill/regla não está instalada no OpenCode local — isso é esperado
3. Após commit e push, outros programadores instalam via prompt de configuração
4. O prompt `prompt-configurar-opencode.md` sincroniza o repo local com `%USERPROFILE%\.config\opencode\`

## Não confunda com OpenCode local

- Este repo **pode** ser clonado em qualquer lugar
- Os prompts de instalação (ex: `prompt-instalar-caveman-opencode.md`) são instruções para o OpenCode local **instalar** algo — são arquivos de referência, não para serem executados aqui
- O `global/opencode.json` é um **modelo** — não altere o config da máquina local editando ele diretamente
