Configure o ambiente Windows para OpenCode, instalando as ferramentas essenciais e ajustando o PATH persistentemente. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Ferramentas essenciais:
- **Node.js 18+** (necessário para plugins como Rehydra, Caveman e RTK)
- **Git** (necessário para download de pacotes via npm/npx e versionamento)

Referências oficiais:
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/

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

4. Verificação final do ambiente:
   - Abra um **terminal NOVO** (PowerShell ou cmd) para garantir que as variáveis de ambiente foram propagadas.
   - Execute os seguintes comandos e confirme as saídas:
     - `node -v`
     - `npm -v`
     - `git --version`

5. Me informe o resultado:
   - O que foi instalado (Node.js e/ou Git) e as versões.
   - O que já existia e foi preservado.
   - Confirmação de que o PATH está funcionando em terminais novos.

6. Ao final, mostre o estado atual:
   - Exiba a saída de `node -v`, `npm -v` e `git --version`.
   - Exiba o conteúdo atualizado da variável de ambiente `Path` do usuário (via PowerShell: `[Environment]::GetEnvironmentVariable('Path', 'User')`).
