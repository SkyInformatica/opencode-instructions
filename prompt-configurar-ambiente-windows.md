Configure o ambiente Windows para OpenCode, instalando as ferramentas essenciais e ajustando o PATH persistentemente. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Ferramentas essenciais:
- **Node.js 18+** (necessário para plugins como Rehydra, Caveman e RTK)
- **Git** (necessário para download de pacotes via npm/npx e versionamento)
- **Microsoft Coreutils** (coreutils Unix nativos no Windows — ls, cat, cp, mv, rm, pwd, find, grep, etc. — necessário para comandos shell e RTK funcionarem corretamente)

Referências oficiais:
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/
- Microsoft Coreutils: https://github.com/microsoft/coreutils

Passos:

1. Verifique os pré-requisitos do sistema:
   - O comando `winget` está disponível? (necessário para instalação silenciosa).
   - A pasta `%USERPROFILE%\.config\opencode\` existe? Se não existir, crie-a.

2. Verifique e instale **Node.js**:
   - Verifique a versão atual: `node -v`.
   - Se a versão for 18 ou superior, pule para o passo 3.
   - Se não houver Node.js ou a versão for inferior, instale a versão LTS mais recente via winget:
     ```powershell
     winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements --silent
     ```
   - Garanta que o Node.js fique no **PATH persistido do Windows** (registro). O instalador normalmente já adiciona, mas confirme:
     ```powershell
     $alvo = '%USERPROFILE%\AppData\Roaming\nvm\current' # Ou o caminho padrão do instalador
     # Verifique se o npm/node está em um diretório comum como %USERPROFILE%\AppData\Roaming\npm ou %ProgramFiles%\nodejs
     $path = ([Environment]::GetEnvironmentVariable('Path', 'User') -split ';' | Where-Object { $_ -and $_ -ne $alvo }) -join ';'
     [Environment]::SetEnvironmentVariable('Path', "$path;$alvo", 'User')
     ```
   - Atualize o PATH da sessão atual: `$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')`.
   - Confirme: `node -v` e `npm -v` devem retornar versões válidas.

3. Verifique e instale **Git**:
   - Verifique a versão atual: `git --version`.
   - Se Git estiver disponível e no PATH, pule para o passo 4.
   - Se não houver Git, instale via winget:
     ```powershell
     winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements --silent
     ```
   - Garanta que o Git fique no **PATH persistido do Windows** (registro). O instalador normalmente adiciona `%ProgramFiles%\Git\cmd`, mas confirme:
     ```powershell
     $alvo = 'C:\Program Files\Git\cmd'
     $path = ([Environment]::GetEnvironmentVariable('Path', 'User') -split ';' | Where-Object { $_ -and $_ -ne $alvo }) -join ';'
     [Environment]::SetEnvironmentVariable('Path', "$path;$alvo", 'User')
     ```
   - Atualize o PATH da sessão atual.
   - Confirme: `git --version` deve retornar a versão instalada.

4. Verifique e instale **Microsoft Coreutils**:
   - Verifique se está instalado: `coreutils --version`.
   - Se estiver disponível, pule para o passo 5.
   - Se não houver, instale via winget (requer elevação admin):
     ```powershell
     winget install --id Microsoft.Coreutils -e --accept-source-agreements --accept-package-agreements
     ```
   - O instalador pode pedir confirmação de UAC. Após instalação, abra terminal novo.
   - Confirme: `coreutils --version` deve retornar a versão.
   - Estes comandos passam a estar disponíveis como executáveis reais no PATH: `ls`, `cat`, `cp`, `mv`, `rm`, `pwd`, `find`, `grep`, `sort`, `tee`, `sleep`, `uptime`, `hostname`.

5. Verificação final do ambiente:
   - Abra um **terminal NOVO** (PowerShell ou cmd) para garantir que as variáveis de ambiente foram propagadas.
    - Execute os seguintes comandos e confirme as saídas:
      - `node -v`
      - `npm -v`
      - `git --version`
      - `coreutils --version`

6. Me informe o resultado:
   - O que foi instalado (Node.js, Git, Microsoft Coreutils) e as versões.
   - O que já existia e foi preservado.
   - Confirmação de que o PATH está funcionando em terminais novos.

7. Ao final, mostre o estado atual:
   - Exiba a saída de `node -v`, `npm -v`, `git --version` e `coreutils --version`.
   - Exiba o conteúdo atualizado da variável de ambiente `Path` do usuário (via PowerShell: `[Environment]::GetEnvironmentVariable('Path', 'User')`).
