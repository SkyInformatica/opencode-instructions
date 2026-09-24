Instale o PonyTail (skill de código mínimo) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

> **Status OpenCode V2:** o upstream (`@dietrichgebert/ponytail@4.x`) ainda usa a API de plugin V1 (hooks `experimental.chat.system.transform` e `command.execute.before`) e **não roda no V2**. A API de plugins mudou e plugins V1 não são executados no V2. Antes de instalar, verifique se já existe versão compatível com V2 (`Plugin.define` / `@opencode/plugin`, `ctx.session.hook("context", ...)`). Se a máquina já roda V2 e não houver versão V2, avise o usuário — neste caso, o AGENTS.md do ponytail (regra always-on) ainda pode ser usado manualmente, mas os comandos `/ponytail*` não funcionarão até o port. Este prompt serve para máquinas V1 ou quando o upstream publicar suporte V2.

Referência oficial:
- https://github.com/DietrichGebert/ponytail/blob/main/README.md

O que o PonyTail faz:
- Injeta regras de "código mínimo" (YAGNI, stdlib primeiro, KISS) a cada turno do agente
- Adiciona comandos `/ponytail`, `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`
- Funciona via plugin TS no OpenCode (`tool.execute.before`)

Passos:

1. Verifique os pré-requisitos:
   - Node.js 18+ instalado (`node -v`). Se não houver, pare e me avise.
   - A pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.
   - O arquivo %USERPROFILE%\.config\opencode\opencode.json existe e é JSON válido. Se não existir, crie com pelo menos o $schema.

2. Verifique se o PonyTail já está instalado antes de qualquer alteração:
   - Leia %USERPROFILE%\.config\opencode\opencode.json e verifique se o array de plugins (`plugin` no V1 ou `plugins` no V2) já contém "@dietrichgebert/ponytail".

   Se já estiver instalado, pule para o passo 4 (verificação). Não reinstale nem duplique nada.

3. Instale o plugin:
   - IMPORTANTE: NÃO use `npm install -g`. O plugin deve ser instalado LOCALMENTE na pasta do OpenCode.
   - Execute no prompt: `cd %USERPROFILE%\.config\opencode && npm install @dietrichgebert/ponytail`
   - Isso instala o pacote em `%USERPROFILE%\.config\opencode\node_modules\@dietrichgebert\ponytail\`
   - Adicione "@dietrichgebert/ponytail" ao array de plugins existente no %USERPROFILE%\.config\opencode\opencode.json.
   - Se já existir array de plugins (`plugin` ou `plugins`), adicione ao mesmo array. Se não existir nenhum, crie o array com o nome **`plugins`** (formato nativo V2) com o plugin como único elemento.
   - NUNCA remova, reordene ou altere outros plugins já presentes no array. Apenas adicione o novo item.
   - NUNCA altere outros campos do opencode.json (model, instructions, etc.).

4. Verifique a instalação:
   - Leia o %USERPROFILE%\.config\opencode\opencode.json modificado e confirme:
     - JSON é válido (parseável).
     - O campo "plugin" ou "plugins" contém "@dietrichgebert/ponytail".
     - Todos os plugins e configurações anteriores continuam presentes e inalterados.
   - Verifique se o diretório %USERPROFILE%\.config\opencode\node_modules\@dietrichgebert\ponytail\ existe e contém arquivos.
   - Lembre o usuário: no OpenCode V2 esse plugin só é ativo se a versão instalada for compatível com a API V2; caso contrário, o V2 o ignora (veja o aviso no topo).

5. Me informe o resultado: o que foi adicionado, o que já existia e foi preservado, e que o plugin está ativo (sem necessidade de configuração extra). Informe também como usar:
   - `/ponytail lite|full|ultra|off` — mudar intensidade
   - `/ponytail-review` — revisar diff atual
   - `/ponytail-audit` — auditar repo inteiro
   - `/ponytail-debt` — levantar atalhos marcados com `ponytail:`
   - Modo padrão: `full`. Altere via comando ou variável de ambiente `PONYTAIL_DEFAULT_MODE=full`.

6. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\node_modules\@dietrichgebert\ponytail\ com `dir /s /b` ou equivalente.
