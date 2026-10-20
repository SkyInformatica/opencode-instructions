Instale o Caveman (skill de respostas compactas) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Referência oficial:
- https://github.com/JuliusBrussee/caveman/blob/main/INSTALL.md
- Releases: https://github.com/JuliusBrussee/caveman/releases

O que o Caveman instala:
- Skill `caveman` e variantes (`ultracave`, `megacave`, `caveman-commit`, `caveman-review`, `caveman-help`, `caveman-stats`, `caveman-compress`, `cavecrew`) em `%USERPROFILE%\.config\opencode\skills\`.
- Comandos `/caveman`, `/ultracave`, `/megacave` e os de review/commit/compress/help/stats em `%USERPROFILE%\.config\opencode\commands\`.
- Subagentes `cavecrew-*` em `%USERPROFILE%\.config\opencode\agents\`.
- Plugin em `%USERPROFILE%\.config\opencode\plugins\caveman\` com `plugin.js` (OpenCode 1.x) e `server.js` (OpenCode 2.x).
- Bloco sempre-ativo entre `<!-- caveman-begin -->` e `<!-- caveman-end -->` no `AGENTS.md` global.

Passos:

1. Verifique os pré-requisitos:
   - **Node.js 18 ou superior** (`node --version`). Se não houver, pare e me avise.
   - **Git no PATH** (`git --version`). O `npx` baixa o pacote do GitHub e precisa do `git`. Sem ele o comando falha com `npm error syscall spawn git`.
     - Verifique também `%ProgramFiles%\Git\cmd\git.exe` e `%LOCALAPPDATA%\Programs\Git\cmd\git.exe`.
     - Se faltar, instale com `winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements --silent`.
     - Garanta o PATH **persistido** (registro), não só a sessão atual. Em terminal NOVO, `where.exe git` deve resolver. Se não resolver (PowerShell):
       ```powershell
       $alvo = 'C:\Program Files\Git\cmd'
       $path = ([Environment]::GetEnvironmentVariable('Path', 'User') -split ';' | Where-Object { $_ -and $_ -ne $alvo }) -join ';'
       [Environment]::SetEnvironmentVariable('Path', "$path;$alvo", 'User')
       ```
   - A pasta `%USERPROFILE%\.config\opencode\` existe. Se não existir, crie.
   - Verifique a versão do npm (`npx --version`). **npm 12 ou mais novo** bloqueia pacotes git por padrão: use `--allow-git=root` em todos os comandos `npx` abaixo.

2. Verifique o estado atual antes de alterar:
   - `%USERPROFILE%\.config\opencode\skills\caveman\SKILL.md` existe?
   - `%USERPROFILE%\.config\opencode\plugins\caveman\` existe? Quais arquivos? Em especial, existe `server.js`?
   - `%USERPROFILE%\.config\opencode\AGENTS.md` já tem o bloco entre `<!-- caveman-begin -->` e `<!-- caveman-end -->`?
   - `%USERPROFILE%\.config\opencode\opencode.json(c)` tem a chave `plugins` (V2) ou `plugin` (V1) com entrada do caveman?

   **Instalação manual antiga:** se a pasta do plugin tiver `index.js` (e não tiver `server.js`), o instalador se recusa a sobrescrever com `opencode ownership conflict: plugins/caveman`. Nesse caso use `--force` no passo 3 — o instalador guarda backup em `%USERPROFILE%\.config\opencode\.caveman-opencode-backups\` e registra em `.caveman-opencode-ownership.json`.

3. Instale com o instalador oficial, apenas para o agente OpenCode.

   a. Pré-visualize (não grava nada):
      ```
      npx -y github:JuliusBrussee/caveman#v4.0.1 -- --only opencode --dry-run
      ```
      Com npm 12+:
      ```
      npx --allow-git=root -y github:JuliusBrussee/caveman#v4.0.1 -- --only opencode --dry-run
      ```

   b. Instale:
      ```
      npx -y github:JuliusBrussee/caveman#v4.0.1 -- --only opencode
      ```
      Com npm 12+:
      ```
      npx --allow-git=root -y github:JuliusBrussee/caveman#v4.0.1 -- --only opencode
      ```
      - Se já houver instalação manual antiga (passo 2), acrescente `--force`.
      - O instalador escreve só em `%USERPROFILE%\.config\opencode\`; não toca em outros agentes.
      - Saída esperada: `installed owned opencode payload under: ...` e `patched: ...opencode.json` (ou `.jsonc`).
      - Se falhar, pare e me informe o erro. Não copie arquivos manualmente.

   c. Ajuste o `opencode.json(c)` (formato V2):
      - O instalador pode adicionar `"./plugins/caveman"` à chave **`plugin`** (formato V1). O OpenCode 2 ignora essa chave e descobre o plugin automaticamente pela pasta.
      - Remova **apenas** essa entrada da chave `plugin`; mantenha qualquer outra entrada. Se a chave ficar vazia, remova a chave.
      - **Não** adicione nada à chave `plugins` (V2): a descoberta automática cobre `%USERPROFILE%\.config\opencode\plugins\`.
      - Faça backup do arquivo antes de editar e preserve `$schema`, `model`, `agents`, `mcp`, permissões e providers.

4. Verifique a instalação:
   - `plugins\caveman\` contém `plugin.js`, `server.js`, `package.json`, `caveman-config.cjs` e `caveman-parse.cjs`.
   - `skills\caveman\SKILL.md` existe; `commands\caveman.md` existe; `agents\cavecrew-investigator.md` existe.
   - `AGENTS.md` contém o bloco caveman **uma única vez**.
   - O `opencode.json(c)` continua válido e sem a entrada V1 do caveman.
   - Reinicie o OpenCode (`opencode service restart`) e confirme que o plugin carrega:
     - `opencode plugin list --builtin` deve listar `caveman` com origem em `plugins\caveman\...`. Se a lista vier vazia mesmo com o plugin funcionando, valide pelo log.
     - No log `%USERPROFILE%\.local\share\opencode\log\opencode.log`, procure `loading plugin` com `entrypoint=...\plugins\caveman\server.js`. É essa a entrada usada no OpenCode 2.
   - Abra uma sessão nova e rode `/caveman` ou diga "caveman mode". O flag `%USERPROFILE%\.config\opencode\.caveman-active` deve ser criado com o modo ativo.

5. Atualização — sempre que este prompt for executado:
   1. Consulte a última versão **estável**: `https://api.github.com/repos/JuliusBrussee/caveman/releases/latest` → `tag_name`. Ignore prerelease.
   2. O instalador não grava a versão instalada. Para atualizar, repita o passo 3 com a tag nova — a instalação é idempotente e atualiza skills, comandos, agentes, plugin e bloco do `AGENTS.md`.
   3. Se a tag local já for a última estável, nada a fazer.
   4. Nunca faça downgrade nem instale prerelease automaticamente.

6. Me informe: o que foi instalado, o que já existia, se houve migração com `--force`, a versão usada, e como ativar/desativar:
   - `/caveman lite|full|ultra|off`, `/ultracave`, `/megacave` ou "stop caveman".
   - Desinstalar: `npx -y github:JuliusBrussee/caveman -- --uninstall` (ou a mesma tag usada na instalação).

7. Ao final, mostre o estado atual:
   - Conteúdo do `%USERPROFILE%\.config\opencode\opencode.json(c)` formatado — **sem expor chaves de API ou tokens** (substitua por `<redacted>`).
   - Árvore de `%USERPROFILE%\.config\opencode\skills\`, `commands\`, `agents\` e `plugins\caveman\`.
   - Saída de `opencode plugin list --builtin` e a linha `loading plugin` do log que aponta para `server.js`.
