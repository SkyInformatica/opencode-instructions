Instale o RTK (Rust Token Killer) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

> **Status OpenCode V2 (atualizado 2026-09-24):** o suporte a V2 do plugin OpenCode do RTK chega via PR [#4187](https://github.com/rtk-ai/rtk/pull/4187) no repo rtk-ai/rtk (`fix(hook/opencode): support OpenCode V2, Desktop, and Windows` — fecha as issues #3463, #3326, #2516, #1993). O PR **não cria flag nova**: transforma `hooks/opencode/rtk.ts` num plugin com lógica compatível V1+V2 (`node:child_process`, sem `$` do bun), então `rtk init -g --opencode` já instala o plugin certo quando a release tiver o fix. Enquanto o PR não for mergeado/lançado, as releases do rtk embutem só o plugin V1, que o V2 **não executa**. Observação importante: o PR exporta o plugin como *função* com `.id`/`.setup` anexados — o loader do OpenCode 2.0.x exige `export default` de **objeto** `{ id, setup }`; sem essa conversão o OpenCode descarta o plugin com `PluginModule.LoadError: ... Expected object at ["default"]` (ver passos 3b/3c).

Referência oficial:
- https://github.com/rtk-ai/rtk/blob/develop/README.md
- PR de suporte V2: https://github.com/rtk-ai/rtk/pull/4187

O que o RTK faz:
- Intercepta comandos shell (Bash) e comprime a saída antes do agente LLM ler
- Reduz até 90% do output de bash (git, cargo, npm, docker, etc.)
- No OpenCode V2, roda como plugin `{ id, setup }` com `ctx.tool.hook("execute.before", ...)` — reescreve `event.input.command` antes do comando executar

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
   - `rtk --version` retorna uma versão válida?
   - O OpenCode V2 descobre plugins automaticamente na pasta `%USERPROFILE%\.config\opencode\plugins\` (arquivos `*.ts`/`*.js` diretos) — **não** é preciso (nem deve-se) listar o rtk no array `plugins` do `opencode.json`. Verifique se existe `%USERPROFILE%\.config\opencode\plugins\rtk.ts` e se ele é V2-capable (veja o passo 3b).

   Se já houver um `rtk.ts` V2-capable instalado, pule para o passo 4 (verificação). Não reinstale nem duplique nada.

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
   - **V2-capable:** o `export default` é um **OBJETO** `{ id: "rtk", setup(ctx) { ... } }` (ou `Plugin.define({ id, setup })`) contendo `ctx.tool.hook("execute.before"` e **não** usa `$` do bun (`node:child_process`). Esse é o shape exigido pelo loader do V2 (schema `PluginModule`).
   - **V1-only (release antiga):** o `export default` é uma **função** (ex.: `export const RtkOpenCodePlugin: Plugin = async ({ $ }) => ...`) e usa `tool.execute.before` + `$` do bun. **NÃO funciona no V2.**
   - ⚠️ **Cuidado:** o PR #4187 em si exporta uma *função* com `.id`/`.setup` anexados — o loader do OpenCode 2.0.x **rejeita** esse shape com `PluginModule.LoadError: ... Expected object at ["default"]` e descarta o plugin (o arquivo carrega sim, mas falha). Vale o mesmo para qualquer arquivo cru baixado do PR: é preciso converter o `export default` para objeto (passo 3c).

   **c. Se for V1-only** (a release instalada ainda não tem o fix do PR #4187), instale o plugin universal manualmente:
   1. Baixe o arquivo do PR: `https://raw.githubusercontent.com/amnesiaof/rtk/fix/opencode-v2-compatibility/hooks/opencode/rtk.ts`
   2. Faça backup do atual: `copy %USERPROFILE%\.config\opencode\plugins\rtk.ts %USERPROFILE%\.config\opencode\plugins\rtk.ts.v1-backup`
   3. Salve o arquivo baixado como `%USERPROFILE%\.config\opencode\plugins\rtk.ts`
   4. **Converta o `export default` para o shape-objeto do V2** — substitua a seção final do arquivo (da linha `async function RtkOpenCodePlugin(ctx?: any) {` até o fim) por:
      ```ts
      // Shape exigido pelo loader do OpenCode V2 (2.0.x): default export de OBJETO { id, setup }.
      // (O PR #4187 exporta função com .id/.setup anexados — o loader rejeita com "Expected object".)
      export default {
        id: "rtk",
        async setup(ctx: any) {
          if (!resolveRtkPath()) {
            console.warn("[rtk] rtk binary not found — plugin disabled")
            return
          }
          if (!ctx?.tool?.hook) {
            console.warn("[rtk] ctx.tool.hook unavailable in this OpenCode build — plugin disabled")
            return
          }
          await ctx.tool.hook("execute.before", async (event: any) => {
            const input = event?.input
            if (!input || typeof input !== "object") return
            const rewritten = await tryRewriteCommand(event?.tool ?? "", input.command)
            if (rewritten) input.command = rewritten
          })
        },
      }
      ```
      Mantenha intactas as funções `resolveRtkPath`, `runRtkRewrite` e `tryRewriteCommand` do arquivo baixado (não usam `$` do bun).
   5. Quando o upstream lançar o fix, `rtk init -g --opencode` sobrescreve o arquivo com a versão oficial — se a oficial ainda usar o shape de função, mantenha a conversão acima (compare por `Expected object` no log).

4. Verifique a instalação:
   - Em um terminal NOVO (cmd ou PowerShell, fora desta sessão), `where.exe rtk` aponta para `%USERPROFILE%\.local\bin\rtk.exe` — confirma PATH persistido.
   - `rtk --version` retorna a versão correta.
   - O arquivo `%USERPROFILE%\.config\opencode\plugins\rtk.ts` existe e o `export default` é um objeto `{ id: "rtk", setup }` com `ctx.tool.hook("execute.before"` (passo 3b).
   - Teste direto do reescritor: `rtk rewrite "git status"` deve retornar o comando reescrito (ex.: `rtk git status`). Anote a saída.
   - Abra um OpenCode V2 novo e execute um comando de terminal (ex.: `git status`). Confirme no log do servidor (`%USERPROFILE%\.local\share\opencode\log\opencode.log`, filtro `role=server`) que o rtk carregou e que o comando efetivamente executado foi reescrito (procure por `rtk git status` em `message="spawning process" args=[...]`). Se o shape estiver errado, o log mostra `failed to load plugin ... Expected object at ["default"]`.
   - O `%USERPROFILE%\.config\opencode\opencode.json` continua válido e **sem** entrada rtk no array `plugins` (o V2 descobre pela pasta; não duplicar).
   - Teste rápido: execute `rtk gain` para ver o dashboard de savings (deve retornar estatísticas ou 0 se primeira execução).

5. Me informe o resultado: o que foi instalado, o que já existia e foi pulado, a versão do RTK, e como usar:
   - Comandos úteis: `rtk gain`, `rtk discover`, `rtk gain --history`
   - Para desinstalar: `rtk init -g --uninstall` seguido de `cargo uninstall rtk` (se instalado via Cargo) ou remover `rtk.exe` do PATH.
   - Para desativar telemetria: `rtk telemetry disable`

6. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\plugins\rtk.ts` (o plugin instalado).
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\opencode.json` formatado (confirmando que rtk não está duplicado no array `plugins`).
   - Exiba a saída de `rtk init --show`.