Instale o RTK (Rust Token Killer) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Referência oficial:
- https://github.com/rtk-ai/rtk/blob/master/README.md
- Hook do OpenCode: https://github.com/rtk-ai/rtk/blob/master/hooks/opencode/README.md
- Releases: https://github.com/rtk-ai/rtk/releases

O que o RTK faz:
- Intercepta comandos shell (Bash) e comprime a saída antes do agente LLM ler
- Reduz até 90% do output de bash (git, cargo, npm, docker, etc.)
- No OpenCode V2, roda como plugin `{ id, setup }` com `ctx.tool.hook("execute.before", ...)`, que delega a decisão para `rtk hook opencode`. O RTK respeita as regras de permissão do próprio OpenCode: sempre que a reescrita mudaria o veredito (`allow`/`ask`/`deny`), ele devolve `{}` e o comando segue como foi digitado.

Passos:

1. Verifique os pré-requisitos:
   - **OpenCode 1.18.29 ou mais novo** (`opencode --version`). Abaixo disso o `rtk init` não grava o plugin (e preserva o que já existe). Se estiver abaixo, pare e me avise.
   - **RTK 1.0.0 ou mais novo** no PATH (`rtk --version`). Se não estiver, baixe o binário:
     - Arquivo: `rtk-x86_64-pc-windows-msvc.zip` de https://github.com/rtk-ai/rtk/releases/latest
     - O manifesto do winget não acompanha as releases atuais; baixe o `.zip` direto.
     - Extraia e mova `rtk.exe` para `%USERPROFILE%\.local\bin\` (ou outro diretório no PATH).
      - IMPORTANTE: garantir que o diretório fique no **PATH persistido do Windows** (registro), não apenas na sessão atual. O comando pode funcionar dentro desta sessão do OpenCode e ainda assim falhar num cmd/PowerShell novo — e o plugin resolve o `rtk` **somente pelo PATH** do processo do OpenCode. Corrija assim (PowerShell):
        ```powershell
        $alvo = '%USERPROFILE%\.local\bin'
        $path = ([Environment]::GetEnvironmentVariable('Path', 'User') -split ';' | Where-Object { $_ -and $_ -ne $alvo }) -join ';'
        [Environment]::SetEnvironmentVariable('Path', "$path;$alvo", 'User')
        ```
        - Grava no registro (`HKCU\Environment`) como `REG_EXPAND_SZ`, expansível e portátil.
        - Remove entradas vazias/duplicadas antes de gravar.
        - `SetEnvironmentVariable` com escopo `'User'` já transmite `WM_SETTINGCHANGE` ao sistema.
      - Confirme num **terminal NOVO** (os já abertos não enxergam a mudança): `where.exe rtk` deve apontar para `%USERPROFILE%\.local\bin\rtk.exe` e `rtk --version` deve retornar `1.0.0` ou mais novo.
   - Recomendado: ripgrep (`rg`), usado por alguns filtros. Se faltar:
     - `winget install BurntSushi.ripgrep.MSVC`
     - Verifique com `rg --version`.
   - A pasta `%USERPROFILE%\.config\opencode\` existe. Se não existir, crie-a.
   - Node.js **não** é pré-requisito deste plugin (ele roda dentro do OpenCode; o `rtk` é um binário Rust).

2. Verifique se o RTK já está instalado para o OpenCode antes de qualquer alteração:
   - `rtk --version` retorna uma versão válida? Anote — é usada no passo 5 (atualização).
   - O OpenCode V2 descobre plugins automaticamente na pasta `%USERPROFILE%\.config\opencode\plugins\` (arquivos `*.ts`/`*.js` diretos) — **não** é preciso (nem se deve) listar o rtk no array `plugins` do `opencode.json`. Verifique se existe `%USERPROFILE%\.config\opencode\plugins\rtk.ts` e qual é o shape (passo 3d).

   Se já houver um `rtk.ts` no shape V2 e o `rtk --version` for `1.0.0+`, não baixe o binário de novo: rode o passo 3c (idempotente, garante que o plugin é o embutido na versão atual) e siga para 4 e 5.

3. Instale usando o comando oficial, apenas para o agente OpenCode:

   a. Se quiser pré-visualizar sem gravar nada (opcional):
      rtk init -g --opencode --hook-only --no-patch --dry-run

   b. Desative a telemetria antes do init (o init só pergunta em terminal interativo; isto garante o opt-out):
      rtk telemetry disable

   c. Instale:
      rtk init -g --opencode --hook-only --no-patch

   Observações:
   - `--hook-only --no-patch` mantém o comando restrito ao plugin do OpenCode: sem elas, o `init` também instala integrações de outros agentes.
   - O flag `-g` instala globalmente (não apenas no projeto atual).
   - O arquivo vai para `%USERPROFILE%\.config\opencode\plugins\rtk.ts`.
   - Saída esperada: `RTK hook registered (hook-only mode).` e a linha `OpenCode: ...\plugins\rtk.ts`. O comando também imprime um bloco `MANUAL STEP` de outra integração — **ignore**, não é necessário para o OpenCode.
   - Se o comando falhar, pare e me informe o erro. Não tente instalação manual.

   d. Confirme que o plugin instalado é V2-capable — inspecione `%USERPROFILE%\.config\opencode\plugins\rtk.ts`:
      - O `export default` é um **OBJETO**: `const RtkOpenCodePlugin = { id: "rtk", async setup(ctx) { ... }, async server() { ... } }` + `export default RtkOpenCodePlugin`.
      - Contém `ctx.tool.hook("execute.before"` (V2) e `"tool.execute.before"` (V1).
      - Importa `node:child_process` e resolve o binário por PATH/PATHEXT (não usa `$` do bun nem `which`).
      - Se o `export default` for uma **função**, o binário está abaixo da `1.0.0`: volte ao passo 1 e atualize o `rtk.exe`, depois repita o passo 3c.

4. Verifique a instalação:
   - Em um terminal NOVO (cmd ou PowerShell, fora desta sessão), `where.exe rtk` aponta para `%USERPROFILE%\.local\bin\rtk.exe` — confirma PATH persistido.
   - `rtk --version` retorna `1.0.0` ou mais novo.
   - O arquivo `%USERPROFILE%\.config\opencode\plugins\rtk.ts` existe e bate com o shape do passo 3d.
   - Teste direto do hook do OpenCode:
     - `rtk hook opencode --help` deve sair com código 0 (subcomando presente).
     - `rtk hook opencode "git status"` deve retornar JSON, ex.: `{"command":"rtk git status"}`.
     - É normal retornar `{}` quando a reescrita mudaria o veredito das suas regras de permissão do OpenCode; nesse caso o comando roda como digitado, sem perda de segurança.
   - Abra um OpenCode V2 **novo** e execute um comando de terminal (ex.: `git status`). Confirme no log do servidor (`%USERPROFILE%\.local\share\opencode\log\opencode.log`, filtro `role=server`) que o rtk carregou e que o comando efetivamente executado foi reescrito (procure por `rtk git status` em `message="spawning process" args=[...]`). Se o shape estiver errado, o log mostra `failed to load plugin ... Expected object at ["default"]`.
   - O `%USERPROFILE%\.config\opencode\opencode.json` continua válido e **sem** entrada rtk no array `plugins` (o V2 descobre pela pasta; não duplicar).
   - `rtk init --show` não reporta o plugin do OpenCode; a validação é a dos itens acima.
   - Teste rápido: execute `rtk gain` para ver o dashboard de savings (deve retornar estatísticas ou 0 se primeira execução).
   - Se o `rtk gain` avisar `No hook installed — run rtk init -g`, é só um aviso sobre outra integração. Silencie com `suppress_hook_warning = true` na seção `[hooks]` de `%APPDATA%\rtk\config.toml` (o `rtk telemetry disable` já cria o arquivo).

5. Atualização do RTK e do plugin — **sempre que este prompt for executado**:

   Esta checagem não é só da primeira instalação: compare a versão local com a última versão **estável** publicada e atualize quando a remota for mais nova.

   1. Versão local: `rtk --version` (ex.: `rtk 1.0.1`).
   2. Última versão **estável** publicada (ignorar `dev-*`/prerelease):
      - `curl -s https://api.github.com/repos/rtk-ai/rtk/releases/latest` → campo `tag_name` (ex.: `v1.0.1`).
      - Sem curl: abra https://github.com/rtk-ai/rtk/releases/latest e leia a tag.
   3. Compare como semver (`major.minor.patch`):
      - Estável remota **maior** que a local → atualize (item 4).
      - Igual ou menor → **nada a fazer**. Nunca faça downgrade e nunca troque a estável por um prerelease automaticamente.
   4. Se houver versão nova:
      a. Backup do binário atual: renomeie `%USERPROFILE%\.local\bin\rtk.exe` para `rtk.exe.bak`.
      b. Baixe `rtk-x86_64-pc-windows-msvc.zip` de https://github.com/rtk-ai/rtk/releases/tag/<tag>, extraia e mova `rtk.exe` para `%USERPROFILE%\.local\bin\`.
      c. Confirme: `rtk --version` mostra a nova versão e `where.exe rtk` continua apontando para o binário novo.
      d. Reinstale/atualize o plugin: `rtk init -g --opencode --hook-only --no-patch` (reescreve `%USERPROFILE%\.config\opencode\plugins\rtk.ts` com o plugin embutido na versão nova).
      e. Revalide o shape (passo 3d) e rode o passo 4.
   5. Se a versão local for anterior à `1.0.0`, a atualização é **obrigatória** para o V2 funcionar — não tente manter a versão antiga com plugin manual.

6. Me informe o resultado: o que foi instalado, o que já existia e foi pulado, o que foi atualizado no passo 5, as versões do RTK e do OpenCode, e como usar:
   - Comandos úteis: `rtk gain`, `rtk discover`, `rtk gain --history`
   - Para desinstalar: `rtk init -g --uninstall` (remove o plugin do OpenCode junto com os demais artefatos do RTK) e depois remova `rtk.exe` do PATH.
   - Para desativar telemetria: `rtk telemetry disable` (já feito no passo 3b).

7. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\plugins\rtk.ts` (o plugin instalado).
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\opencode.json` formatado (confirmando que rtk não está duplicado no array `plugins`).
   - Exiba a saída de `rtk hook opencode --help` e de `rtk hook opencode "git status"`.
   - Exiba o conteúdo de `%APPDATA%\rtk\config.toml` (no Windows o RTK grava em `%APPDATA%\rtk\`).
