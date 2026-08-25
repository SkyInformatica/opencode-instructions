Instale o RTK (Rust Token Killer) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Referência oficial:
- https://github.com/rtk-ai/rtk/blob/develop/README.md

O que o RTK faz:
- Intercepta comandos shell (Bash) e comprime a saída antes do agente LLM ler
- Reduz até 90% do output de bash (git, cargo, npm, docker, etc.)
- Plugin para OpenCode via `tool.execute.before` — reescreve comandos automaticamente

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
   - O diretório `%USERPROFILE%\.config\rtk\` existe com um `config.toml`?
   - O OpenCode já tem um plugin RTK configurado? Verifique se o `%USERPROFILE%\.config\opencode\opencode.json` já contém referência a RTK no array `plugin`.

   Se tudo já existir, pule para o passo 4 (verificação). Não reinstale nem duplique nada.

3. Instale usando o comando oficial, apenas para o agente OpenCode:

   rtk init -g --opencode

   Observações:
   - O flag `-g` instala globalmente (não apenas no projeto atual).
   - O flag `--opencode` configura o plugin TS para OpenCode (`tool.execute.before`).
   - Antes de executar de verdade, verifique o que será feito com:
     rtk init --show
   - Se o comando falhar, pare e me informe o erro. Não tente instalação manual.
   - Se o RTK pedir consentimento de telemetria, responda "não" (não ativar telemetria).

4. Verifique a instalação:
   - Em um terminal NOVO (cmd ou PowerShell, fora desta sessão), `where.exe rtk` aponta para `%USERPROFILE%\.local\bin\rtk.exe` — confirma PATH persistido.
   - `rtk --version` retorna a versão correta.
   - `rtk init --show` confirma que o hook/plugin para OpenCode está ativo.
   - O `%USERPROFILE%\.config\rtk\config.toml` existe e é válido (TOML parseável).
   - O `%USERPROFILE%\.config\opencode\opencode.json` contém o plugin RTK (se aplicável) e continua válido (JSON íntegro, nada removido: $schema, model, instructions, plugins, MCPs, permissões).
   - Teste rápido: execute `rtk gain` para ver o dashboard de savings (deve retornar estatísticas ou 0 se首次安装).

5. Me informe o resultado: o que foi instalado, o que já existia e foi pulado, a versão do RTK, e como usar:
   - Comandos úteis: `rtk gain`, `rtk discover`, `rtk gain --history`
   - Para desinstalar: `rtk init -g --uninstall` seguido de `cargo uninstall rtk` (se instalado via Cargo) ou remover `rtk.exe` do PATH.
   - Para desativar telemetria: `rtk telemetry disable`

6. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\rtk\config.toml` (se existir).
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\opencode.json` formatado.
   - Exiba a saída de `rtk init --show`.
