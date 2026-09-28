# AGENTS.md

## Contexto

Este repo é um **repositório de compartilhamento** de skills, regras e agents para configurar o OpenCode nas máquinas dos programadores da Sky Informática.

**Não é um projeto de software.** É uma biblioteca de configurações distribuídas entre a equipe.

## Regra crítica: editar arquivos DO REPO, não do OpenCode local

Quando working neste repo e o usuário pede para "editar uma skill", "editar uma regra" ou "editar um agent", ele quer dizer **o arquivo dentro deste repositório** — não a configuração instalada no OpenCode local da máquina.

- ** skills/** → skill files do repo (compartilhadas via git)
- ** rules/** → regra files do repo (compartilhadas via git)
- ** v1/agents/** e ** v2/agents/** → agent files do repo (versão V1 e V2)

**Não** editamos `%USERPROFILE%\.config\opencode\` da máquina local. O que editamos aqui é o que será distribuído para outras máquinas via push/clone.

## Estrutura

```
skills/          → skills globais da Sky (compartilhadas V1/V2)
rules/           → regras de engenharia (compartilhadas V1/V2)
v1/              → config, agents e prompts do OpenCode V1 (legado)
v2/              → config, agents e prompts do OpenCode V2 (padrão atual)
*.md (raiz)      → instructions dos MCPs e prompts compartilhados
```

Normalmente no OpenCode esses arquivos ficam em `.opencode/`. Neste repo ficam na raiz porque é de compartilhamento, não de execução.

## Workflow ao editar

1. Edite o arquivo em `skills/`, `rules/`, `v1/` ou `v2/` conforme necessário
2. Não se preocupe se a skill/regla não está instalada no OpenCode local — isso é esperado
3. Após commit e push, outros programadores instalam via prompt de configuração
4. Os prompts `v1/prompts/prompt-configurar-opencode.md` e `v2/prompts/prompt-configurar-opencode.md` sincronizam o repo local com `%USERPROFILE%\.config\opencode\`

## Não confunda com OpenCode local

- Este repo **pode** ser clonado em qualquer lugar
- Os prompts de instalação (ex: `v2/prompts/prompt-instalar-caveman-opencode.md` e a versão `v1/prompts/`) são instruções para o OpenCode local **instalar** algo — são arquivos de referência, não para serem executados aqui
- Os `v1/global/opencode.json` e `v2/global/opencode.json` são **modelos** — não altere o config da máquina local editando-os diretamente
