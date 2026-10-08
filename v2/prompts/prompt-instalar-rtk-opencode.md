Instale o RTK (Rust Token Killer) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

> **Status OpenCode V2 (atualizado 2026-10-08):** **ainda não existe versão estável do plugin RTK com suporte oficial ao V2.** A release estável mais recente é `v0.51.0` (02/10/2026) e a branch `develop` ainda embutem só o plugin V1 (`export const RtkOpenCodePlugin: Plugin = async ({ $ })` + `tool.execute.before`, usando `$` do bun e `which`), que o V2 **não executa** — e que também falha no OpenCode Desktop/Electron e no Windows. O que mudou no oficial desde 30/09:
> - O `develop` agora delega a decisão para `rtk hook opencode` (não mais `rtk rewrite`), mas o shape continua V1-only (função + `$` + `which`).
> - O subcomando `rtk hook opencode` foi adicionado no PR [#4349](https://github.com/rtk-ai/rtk/pull/4349) (mergeado 05/10/2026) e **só existe a partir do rtk 0.51.1** — a `v0.51.0` **não o tem**. O plugin V2 abaixo exige `rtk >= 0.51.1` (por ora só há builds `dev-0.51.1-rc.*`; a estável ainda não saiu).
> - O mesmo PR passou o plugin a respeitar as regras de permissão do OpenCode: ele responde `{}` (não reescreve) sempre que o rewrite mudaria o veredito (`allow`/`ask`/`deny`) das regras do usuário.
> - O suporte V2 continua no PR [#4187](https://github.com/rtk-ai/rtk/pull/4187) (`fix(hook/opencode): support OpenCode V2, Desktop, and Windows`, fecha #3898, #3463, #3326, #2516, #1993), **aberto e não mergeado** (atualizado 06/10/2026). Diferente do que o doc dizia antes, o head do PR **já exporta o shape-objeto** `{ id, setup, server }` (correção após teste em OpenCode 2.0.16). O maintainer pediu mudanças em 05/10, então o merge não é iminente.
> - Situação das issues/PRs relacionadas: **#3898 CLOSED** (03/10, duplicate), **#2705 CLOSED** (05/10, não mergeado), **#4059 aberto**, **#2566 aberto** (stale).
>
> Observação: `rtk init -g --opencode` (mesmo no `develop`) instala o arquivo oficial, que **continua V1-only** — no V2 ele é descartado com `PluginModule.LoadError: ... Expected object at ["default"]`. **Enquanto isso, o caminho dos passos 3b/3c é obrigatório, não paliativo.**

Referência oficial:
- https://github.com/rtk-ai/rtk/blob/develop/README.md
- PR de suporte V2: https://github.com/rtk-ai/rtk/pull/4187
- PR das permissões OpenCode (`rtk hook opencode`): https://github.com/rtk-ai/rtk/pull/4349

O que o RTK faz:
- Intercepta comandos shell (Bash) e comprime a saída antes do agente LLM ler
- Reduz até 90% do output de bash (git, cargo, npm, docker, etc.)
- No OpenCode V2, roda como plugin `{ id, setup }` com `ctx.tool.hook("execute.before", ...)`, que delega para `rtk hook opencode` — o comando é reescrito respeitando as regras de permissão do próprio OpenCode

Passos:

1. Verifique os pré-requisitos:
   - Node.js 18+ instalado (`node -v`). Se não houver, pare e me avise.
   - O arquivo `rtk.exe` está disponível no PATH? Verifique com `rtk --version`.
   - Se `rtk.exe` não estiver no PATH, baixe o binário pré-compilado:
     - Arquivo: `rtk-x86_64-pc-windows-msvc.zip` de https://github.com/rtk-ai/rtk/releases
     - Extraia e mova `rtk.exe` para `%USERPROFILE%\.local\bin\` (ou outro diretório no PATH).
      - IMPORTANTE: garantir que o diretório fique no **PATH persistido do Windows** (registro), não apenas na sessão atual. O comando pode funcionar dentro desta sessão do OpenCode e ainda assim falhar num cmd/PowerShell novo. Corrija assim (PowerShell):
        ```powershell
        $alvo = '%USERPROFILE%\.local\bin'
        $path = ([Environment]::GetEnvironmentVariable('Path', 'User') -split ';' | Where-Object { $_ -and $_ -ne $alvo }) -join ';'
        [Environment]::SetEnvironmentVariable('Path', "$path;$alvo", 'User')
        ```
        - Grava no registro (`HKCU\Environment`) como `REG_EXPAND_SZ`, expansível e portátil.
        - Remove entradas vazias/duplicadas antes de gravar.
        - `SetEnvironmentVariable` com escopo `'User'` já transmite `WM_SETTINGCHANGE` ao sistema.
      - Confirme num **terminal NOVO** (os já abertos não enxergam a mudança): `where.exe rtk` deve apontar para `%USERPROFILE%\.local\bin\rtk.exe` e `rtk --version` deve retornar a versão.
   - Instale ripgrep (`rg`) se não estiver disponível — ele é necessário para alguns filtros:
     - `winget install BurntSushi.ripgrep.MSVC`
     - Verifique com `rg --version`.
   - A pasta `%USERPROFILE%\.config\opencode\` existe. Se não existir, crie-a.

2. Verifique se o RTK já está instalado para o OpenCode antes de qualquer alteração:
   - `rtk --version` retorna uma versão válida? Anote a versão local — ela é usada no passo 5 (atualização).
   - O OpenCode V2 descobre plugins automaticamente na pasta `%USERPROFILE%\.config\opencode\plugins\` (arquivos `*.ts`/`*.js` diretos) — **não** é preciso (nem deve-se) listar o rtk no array `plugins` do `opencode.json`. Verifique se existe `%USERPROFILE%\.config\opencode\plugins\rtk.ts` e se ele é V2-capable (veja o passo 3b).

   Se já houver um `rtk.ts` V2-capable instalado, não reinstale nem duplique: vá direto ao passo 5 (atualização).

3. Instale usando o comando oficial, apenas para o agente OpenCode:

   rtk init -g --opencode

   Observações:
   - **Não existe flag `--opencode-v2`** — nem no V1 nem no PR #4187. O mesmo comando instala o arquivo com a lógica V1+V2 (após o fix ser lançado); mesmo assim, confira o shape no passo 3b.
   - O flag `-g` instala globalmente (não apenas no projeto atual).
   - O flag `--opencode` configura o plugin para OpenCode (arquivo em `%USERPROFILE%\.config\opencode\plugins\rtk.ts`).
   - Antes de executar de verdade, verifique o que será feito com:
     rtk init --show
   - Se o comando falhar, pare e me informe o erro. Não tente instalação manual.
   - Se o RTK pedir consentimento de telemetria, responda "não" (não ativar telemetria).

   **b. Confirme que o plugin instalado é V2-capable** — inspecione `%USERPROFILE%\.config\opencode\plugins\rtk.ts`:
   - **V2-capable:** o `export default` é um **OBJETO** `{ id: "rtk", setup(ctx) { ... } }` (ou `Plugin.define({ id, setup })`) contendo `ctx.tool.hook("execute.before"` e **não** usa `$` do bun (`node:child_process`). Esse é o shape exigido pelo loader do V2 (schema `PluginModule`). O head do PR #4187 traz também `server()` para o OpenCode 1.x (1.18.29+), formando o dual-shape.
   - **V1-only (release estável atual e o `develop`):** o `export default` é uma **função** (ex.: `export const RtkOpenCodePlugin: Plugin = async ({ $ }) => ...`) e usa `tool.execute.before` + `$` do bun. **NÃO funciona no V2.**

   **c. Se for V1-only** (a release estável instalada ainda não tem o fix do PR #4187), instale o plugin V2 manualmente:
   1. Baixe o arquivo do PR: `https://raw.githubusercontent.com/amnesiaof/rtk/fix/opencode-v2-compatibility/hooks/opencode/rtk.ts`
   2. Faça backup do atual: `copy %USERPROFILE%\.config\opencode\plugins\rtk.ts %USERPROFILE%\.config\opencode\plugins\rtk.ts.v1-backup`
   3. Salve o arquivo baixado como `%USERPROFILE%\.config\opencode\plugins\rtk.ts`.
      - **O arquivo já vem no shape correto.** O `export default` já é um objeto `{ id, setup, server }`, usa `node:child_process` (sem `$`) e descobre o binário por PATH/PATHEXT. **NÃO converta nem edite o `export default`** — versões antigas deste doc mandavam substituir a cauda por um objeto `{ id, setup }`; isso quebraria o arquivo atual (que já é objeto e ainda traz `server()` para o V1).
      - Mantenha intactas as funções `resolveRtkPath`, `probeRtkHookOpencode`, `runHookOpencode` e `tryRewriteCommand` (o nome antigo `runRtkRewrite` não existe mais).
      - **Requisito de versão:** esse plugin chama `rtk hook opencode`, que **só existe a partir do rtk 0.51.1**. Com a `v0.51.0` estável ele se auto-desabilita (o probe do subcomando falha) e nenhum comando é reescrito. Enquanto a `v0.51.1` estável não sair, use um build `dev-0.51.1-rc.*` do `develop` (o passo 5 cuida da troca quando a estável sair).
   4. Reexecute a verificação do passo 4.

   Observação (usada pelo passo 5): quando o upstream lançar o fix numa release estável, `rtk init -g --opencode` sobrescreve o arquivo com a versão oficial. Se a oficial **ainda** vier no shape de função, reaplique o passo 3c (compare pelo erro `Expected object at ["default"]` no log). Só pare de reaplicar quando a oficial já vier V2-capable (passo 3b).

4. Verifique a instalação:
   - Em um terminal NOVO (cmd ou PowerShell, fora desta sessão), `where.exe rtk` aponta para `%USERPROFILE%\.local\bin\rtk.exe` — confirma PATH persistido.
   - `rtk --version` retorna a versão correta.
   - O arquivo `%USERPROFILE%\.config\opencode\plugins\rtk.ts` existe e o `export default` é um objeto `{ id: "rtk", setup, server }` com `ctx.tool.hook("execute.before"` (passo 3b).
   - Teste direto do reescritor:
     - `rtk rewrite "git status"` deve retornar o comando reescrito (ex.: `rtk git status`). Comando legado, ainda válido.
     - `rtk hook opencode "git status"` deve retornar JSON, ex.: `{"command":"rtk git status"}`, ou `{}` quando o rewrite mudaria o veredito de permissão do OpenCode. Se retornar erro de subcomando inexistente, o rtk instalado é anterior ao 0.51.1 (veja passo 3c).
   - Abra um OpenCode V2 novo e execute um comando de terminal (ex.: `git status`). Confirme no log do servidor (`%USERPROFILE%\.local\share\opencode\log\opencode.log`, filtro `role=server`) que o rtk carregou e que o comando efetivamente executado foi reescrito (procure por `rtk git status` em `message="spawning process" args=[...]`). Se o shape estiver errado, o log mostra `failed to load plugin ... Expected object at ["default"]`.
   - O `%USERPROFILE%\.config\opencode\opencode.json` continua válido e **sem** entrada rtk no array `plugins` (o V2 descobre pela pasta; não duplicar).
   - Teste rápido: execute `rtk gain` para ver o dashboard de savings (deve retornar estatísticas ou 0 se primeira execução).

5. Atualização do RTK e do plugin — **sempre que houver versão estável nova no repositório oficial**:

   Esta checagem deve rodar **toda vez** que este prompt for executado, não só na primeira instalação. O objetivo é comparar a versão instalada localmente com a última versão **estável** publicada e atualizar quando a remota for mais nova.

   1. Versão local: `rtk --version` (ex.: `rtk 0.51.0`).
   2. Última versão **estável** publicada (ignorar prereleases/`dev-rc`):
      - `curl -s https://api.github.com/repos/rtk-ai/rtk/releases/latest` → campo `tag_name` (ex.: `v0.51.1`).
      - Sem curl: abra https://github.com/rtk-ai/rtk/releases/latest e leia a tag.
   3. Compare como semver (`major.minor.patch`):
      - Estável remota **maior** que a local → atualize (item 4).
      - Igual ou menor → **nada a fazer**. Nunca faça downgrade e nunca troque a estável por um prerelease automaticamente.
   4. Se houver versão nova:
      a. Backup do binário atual: renomeie `%USERPROFILE%\.local\bin\rtk.exe` para `rtk.exe.bak`.
      b. Baixe `rtk-x86_64-pc-windows-msvc.zip` de https://github.com/rtk-ai/rtk/releases/tag/<tag>, extraia e mova `rtk.exe` para `%USERPROFILE%\.local\bin\`.
      c. Confirme: `rtk --version` mostra a nova versão e `where.exe rtk` continua apontando para o binário novo.
      d. Reinstale/atualize o plugin: `rtk init -g --opencode` (ele sobrescreve `%USERPROFILE%\.config\opencode\plugins\rtk.ts`).
      e. Revalide o shape (passo 3b): se a oficial vier V2-capable, pronto; se ainda vier V1-only, reaplique o passo 3c.
      f. Rode a verificação do passo 4.
   5. Se o plugin instalado exige um subcomando que a estável ainda não tem (caso atual: `rtk hook opencode`, a partir de 0.51.1), mantenha o build `dev-0.51.1-rc.*` do passo 3c até a estável alcançar — não faça downgrade para a `v0.51.0`, que não reescreve no V2.
   6. Registre no relatório (passo 6): versão local anterior, versão estável encontrada, se atualizou e qual plugin ficou instalado.

6. Me informe o resultado: o que foi instalado, o que já existia e foi pulado, o que foi atualizado no passo 5, a versão do RTK, e como usar:
   - Comandos úteis: `rtk gain`, `rtk discover`, `rtk gain --history`
   - Para desinstalar: `rtk init -g --uninstall` seguido de `cargo uninstall rtk` (se instalado via Cargo) ou remover `rtk.exe` do PATH.
   - Para desativar telemetria: `rtk telemetry disable`

7. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\plugins\rtk.ts` (o plugin instalado).
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\opencode.json` formatado (confirmando que rtk não está duplicado no array `plugins`).
   - Exiba a saída de `rtk init --show`.
