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
   - Use `OPENCODE_CONFIG_DIR` se estiver definida; senão, `XDG_CONFIG_HOME\opencode` se `XDG_CONFIG_HOME` estiver definida; caso contrário, `%USERPROFILE%\.config\opencode`. Substitua o caminho padrão abaixo se houver override.
   - Verifique a versão do npm (`npx --version`). **npm 12 ou mais novo** bloqueia pacotes git por padrão: use `--allow-git=root` em todos os comandos `npx` abaixo.

2. Verifique o estado atual antes de alterar:
   - `%USERPROFILE%\.config\opencode\skills\caveman\SKILL.md` existe?
   - `%USERPROFILE%\.config\opencode\plugins\caveman\` existe? Quais arquivos? Em especial, existe `server.js`?
   - `%USERPROFILE%\.config\opencode\AGENTS.md` já tem o bloco entre `<!-- caveman-begin -->` e `<!-- caveman-end -->`?
   - `%USERPROFILE%\.config\opencode\opencode.json(c)` tem a chave `plugins` (V2) ou `plugin` (V1) com entrada do caveman?

   - **Instalação manual antiga:** se a pasta do plugin tiver `index.js` e não tiver `server.js`, o instalador pode recusar a atualização por conflito de propriedade. Só use `--force` se confirmar que a pasta é a instalação manual antiga e autorizar a migração; o instalador cria backup em `.caveman-opencode-backups`. Se houver arquivos personalizados ou dúvida sobre a propriedade, pare e peça autorização.

3. Instale com o instalador oficial, apenas para o agente OpenCode.

   a. Consulte a release estável mais recente em PowerShell:
      ```powershell
      $release = Invoke-RestMethod -Uri 'https://api.github.com/repos/JuliusBrussee/caveman/releases/latest'
      if ($release.prerelease -or -not $release.tag_name) { throw 'Não foi possível confirmar uma release estável do Caveman.' }
      ```
      A versão estável atual é `v4.2.0`. Substitua `<tag>` nos comandos abaixo pelo `tag_name` retornado; não digite os sinais `<` e `>`.

   b. Pré-visualize (não grava nada):
      ```
      npx -y "github:JuliusBrussee/caveman#<tag>" -- --only opencode --dry-run
      ```
      Com npm 12+:
      ```
      npx --allow-git=root -y "github:JuliusBrussee/caveman#<tag>" -- --only opencode --dry-run
      ```

   c. Instale:
      ```
      npx -y "github:JuliusBrussee/caveman#<tag>" -- --only opencode
      ```
      Com npm 12+:
      ```
      npx --allow-git=root -y "github:JuliusBrussee/caveman#<tag>" -- --only opencode
      ```
      - Se já houver instalação manual antiga (passo 2), acrescente `--force`.
      - O instalador escreve só em `%USERPROFILE%\.config\opencode\`; não toca em outros agentes.
      - Saída esperada: `installed owned opencode payload under: ...` e `patched: ...opencode.json` (ou `.jsonc`).
      - Se falhar, pare e me informe o erro. Não copie arquivos manualmente.

   d. Ajuste o `opencode.json(c)` (formato V2):
      - O instalador pode adicionar `"./plugins/caveman"` à chave singular `plugin`, para compatibilidade com OpenCode 1.x.
      - OpenCode V2 também descobre plugins na pasta global. Remova apenas essa entrada redundante de Caveman; preserve todas as outras entradas e configurações.
      - Não adicione outra entrada Caveman à chave plural `plugins`.
      - Faça backup do arquivo antes de editar e preserve `$schema`, `model`, `agents`, `mcp`, permissões e providers.

4. Verifique a instalação:
   - `plugins\caveman\` contém `plugin.js`, `server.js`, `package.json`, `caveman-config.cjs` e `caveman-parse.cjs`.
   - `skills\caveman\SKILL.md` existe; `commands\caveman.md` existe; `agents\cavecrew-investigator.md` existe.
   - `AGENTS.md` contém o bloco caveman **uma única vez**.
   - O `opencode.json(c)` continua válido e sem a entrada V1 do caveman.
   - Abra uma sessão nova e confirme que `/caveman` ou "caveman mode" ativa o plugin.
   - `opencode plugin list --builtin` deve listar `caveman` com origem em `plugins\caveman\...`. Se não listar, procure `loading plugin` no log e reinicie o serviço somente se necessário.
   - Confirme que o flag `%USERPROFILE%\.config\opencode\.caveman-active` foi criado com o modo ativo.

5. Atualização — sempre que este prompt for executado:
   1. Consulte a release estável mais recente e use a tag atual no passo 3. Ignore prereleases; a versão estável atual é `v4.2.0`.
   2. O instalador não registra a versão instalada. Reexecute a prévia e a instalação com a tag atual; a instalação é idempotente e atualiza apenas arquivos gerenciados.
   3. Se houver conflito de propriedade ou arquivo personalizado, pare e peça autorização. Não use `--force` automaticamente.

6. Me informe: o que foi instalado, o que já existia, se houve migração com `--force`, a versão usada, e como ativar/desativar:
   - `/caveman lite|full|ultra|off`, `/ultracave`, `/megacave` ou "stop caveman".
   - `--uninstall` remove Caveman de todos os agentes e não aceita `--only`; não o execute para remover apenas a integração OpenCode.

7. Ao final, mostre o estado atual:
   - Conteúdo do `%USERPROFILE%\.config\opencode\opencode.json(c)` formatado — **sem expor chaves de API ou tokens** (substitua por `<redacted>`).
   - Árvore de `%USERPROFILE%\.config\opencode\skills\`, `commands\`, `agents\` e `plugins\caveman\`.
   - Saída de `opencode plugin list --builtin` e a linha `loading plugin` do log que aponta para `server.js`.
