Instale o Caveman (skill de respostas compactas) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

> **Status OpenCode V2 (atualizado 2026-09-30):** o Caveman tem suporte V2 no upstream, mas **só na branch `main` e só pela rota `caveman enable opencode`** — ainda não em release, e não pela rota do instalador que este prompt usa.
> - PRs #1087 e #1088 foram **fechados sem merge**, mas adotados via cherry-pick no PR #1089 (mergeado em `main` em 20/09/2026). O que entrou: `opencodeNativePluginSourceV2()` em `packages/cli/src/index.ts`, com gate por `opencode --version` (major ≥ 2 → API V2; versão ilegível → mantém V1). Testado end-to-end no `setup()`.
> - A release `v2.7.0` (15/09) é **anterior** ao merge e **não tem V2**. Espere uma release pós-20/09 para o caminho oficial.
> - A rota `caveman enable opencode` grava `~/.config/opencode/plugins/caveman-native.js` (arquivo flat gerado), que é diferente do `plugins/caveman/` escrito pelo instalador.
> - A rota `node bin/install.js --only opencode` (`npx -y github:JuliusBrussee/caveman -- --only opencode`) **continua escrevendo o plugin na API V1**, mesmo em `main`: `OPENCODE_PLUGIN_REL = './plugins/caveman/plugin.js'`, entrada em `cfg.plugin`, e `src/plugins/opencode/plugin.js` ainda é `export const CavemanPlugin = async (_ctx)`.
> - **Importante:** o V2 **ignora** o `main` do package.json e só descobre plugin de diretório pelo **`index.js`**. Por isso, em máquina V2, depois do instalador oficial, aplica-se o **port V2 versionado neste repo** (`v2/plugins/caveman/`): `plugin.js` com default export `{ id, setup }` + `index.js` byte-idêntico + helpers `caveman-config.cjs`/`caveman-parse.cjs`. Com isso skill + bloco do AGENTS.md + plugin dinâmico (comandos `/caveman <modo>`, flag, injeção de reforço) funcionam no V2. O port segue válido mesmo depois de sair a release oficial — a rota oficial gera outro arquivo, em outro formato.

Referência oficial:
- https://github.com/JuliusBrussee/caveman/blob/main/INSTALL.md

Passos:

1. Verifique os pré-requisitos:
   - Node.js 18 ou superior instalado (node --version). Se não houver, pare e me avise.
   - Git disponível no PATH (git --version). O instalador roda via `npx` com um pacote hospedado no GitHub, e o npm precisa do executável `git` para baixá-lo. Sem git, o comando falha com `npm error syscall spawn git`.
     - Antes de concluir que falta, verifique os locais padrão fora do PATH: `%ProgramFiles%\Git\cmd\git.exe` e `%LOCALAPPDATA%\Programs\Git\cmd\git.exe`.
       - Se realmente não houver git, instale pelo winget:
         winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements --silent
       - Garanta que o git fique no **PATH persistido do Windows** (registro), não apenas na sessão atual. O instalador do Git normalmente já adiciona ao PATH do sistema, mas confirme; se um terminal novo (cmd/PowerShell fora desta sessão) ainda não reconhecer `git --version`, corrija assim (PowerShell, mesmo padrão do prompt do RTK):
         ```powershell
         $alvo = 'C:\Program Files\Git\cmd'
         $path = ([Environment]::GetEnvironmentVariable('Path', 'User') -split ';' | Where-Object { $_ -and $_ -ne $alvo }) -join ';'
         [Environment]::SetEnvironmentVariable('Path', "$path;$alvo", 'User')
         ```
         - Ajuste `$alvo` conforme a pasta real da instalação (`%LOCALAPPDATA%\Programs\Git\cmd` em instalação por usuário).
       - Atualize o PATH da sessão atual e confirme com `git --version` antes de seguir; num terminal NOVO (cmd/PowerShell fora desta sessão), `where.exe git` deve apontar para a pasta da instalação.
   - A pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.

2. Verifique se o Caveman já está instalado antes de qualquer alteração:
   - %USERPROFILE%\.config\opencode\skills\caveman\SKILL.md existe?
   - %USERPROFILE%\.config\opencode\plugins\caveman\ existe? (e o estado V2: `index.js` existe?)
   - O AGENTS.md global (%USERPROFILE%\.config\opencode\AGENTS.md) já contém o bloco entre os marcadores <!-- caveman-begin --> e <!-- caveman-end -->?

   Se tudo já existir e o plugin carregar (passo 4), pule para a verificação final (passo 5). Não reinstale nem duplique nada.

3. Instale:
   a. Rode o instalador oficial, apenas para o agente opencode (traz skills, commands, agents, bloco no AGENTS.md e a pasta plugins\caveman\):
      - Antes de executar de verdade, rode com --dry-run e revise o que será feito:
        npx -y github:JuliusBrussee/caveman -- --only opencode --dry-run
      - Depois, execute:
        npx -y github:JuliusBrussee/caveman -- --only opencode
      - O instalador escreve em %USERPROFILE%\.config\opencode\ e é seguro para reexecução, mas não use --force se já houver instalação.
      - Se o instalador falhar, pare e me informe o erro. Não tente instalação manual.
        - Exceção: se a falha for `npm error syscall spawn git` (git ausente), trate conforme o passo 1 (instale o git via winget) e reexecute o instalador.
   b. **Fix V2 — sobrescreva a pasta do plugin com o port V2 versionado neste repo:**
      - Origem: https://github.com/SkyInformatica/opencode-instructions/blob/main/v2/plugins/caveman/ (arquivos: `plugin.js`, `index.js`, `package.json`, `caveman-config.cjs`, `caveman-parse.cjs`)
      - Baixe os 5 arquivos e copie por cima de %USERPROFILE%\.config\opencode\plugins\caveman\ (sobrescrevendo o plugin.js V1 que o instalador acabou de gravar).
      - Confirme que `index.js` é byte-idêntico ao `plugin.js` local (no Windows: `fc /b index.js plugin.js`). Se o upstream um dia passar a entregar plugin V2 no instalador, o diff mostrará — aí o passo b. pode ser pulado.
      - Observação p/ re-runs futuros: o instalador sobrescreve `plugin.js` (arquivo owned) e NÃO toca `index.js` (não-owned) — ou seja, o plugin V2 sobrevive a re-runs. Mesmo assim, após qualquer re-run do instalador, reaplique o passo b. para manter plugin.js/index.js consistentes.
   c. **Config opencode.json (formato V2) — nada a adicionar:**
      - **Não** registre o caveman no `opencode.json`. O V2 auto-descobre plugins locais em %USERPROFILE%\.config\opencode\plugins\ (arquivos `.ts`/`.js` diretos e subpastas de pacote, descobertas pelo `index.js`) — a pasta `plugins\caveman\` do passo b. basta.
      - Se já existir uma entrada redundante `"./plugins/caveman"` (instalação anterior), remova-a (backup do opencode.json antes): a descoberta automática já cobre o diretório, o array é redundante.
      - Se o instalador criou/alterou a chave **`plugin`** (formato V1), ela é ignorada pelo V2. Se a máquina é 100% V2, remova a entrada dela (fazendo backup do opencode.json antes).
      - Mantenha todo o resto inalterado ($schema, model, agents.title.model, plugins npm, MCPs, permissões).

4. Verifique a instalação:
   - %USERPROFILE%\.config\opencode\skills\caveman\SKILL.md existe.
   - %USERPROFILE%\.config\opencode\plugins\caveman\index.js e plugin.js existem e são byte-idênticos (`fc /b`).
   - O AGENTS.md global contém o bloco caveman (uma única vez, sem duplicação).
   - Recarregue a config e confirme que o plugin carrega: `opencode reload` e depois `opencode plugin list --builtin` — a lista deve mostrar uma linha `caveman` com origem local apontando para `plugins\caveman\index.js`.
     - Se `opencode plugin list` não mostrar, reinicie o serviço (`opencode service restart`) e repita.
     - Se ainda assim não mostrar, o build não está auto-descobrigindo a pasta global: aplique o fallback — adicione `"./plugins/caveman"` ao array `plugins` do opencode.json (builds antigos só descobrem `.opencode/plugins/` do projeto).
     - Confira também que o flag `%USERPROFILE%\.config\opencode\.caveman-active` contém o modo (ex.: `full`) — o setup() do plugin grava o flag ao carregar.
   - Leia %USERPROFILE%\.config\opencode\opencode.json e confirme que ele continua válido (JSON íntegro) e que nada foi removido ($schema, model, instructions, plugins, MCPs, permissões).

5. Me informe o resultado: o que foi instalado, o que já existia e foi pulado, e como ativar/desativar (/caveman lite|full|ultra|off, ou "stop caveman").

6. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\skills\ e %USERPROFILE%\.config\opencode\plugins\ com `dir /s /b` ou equivalente.
   - Exiba a saída de `opencode plugin list --builtin` (mostrando `caveman` carregado).