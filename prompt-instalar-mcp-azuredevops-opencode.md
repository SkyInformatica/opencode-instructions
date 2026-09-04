Configure o servidor MCP do Azure DevOps no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

**IMPORTANTE: o ambiente-alvo é SEMPRE Windows.** Mesmo que a máquina onde este prompt está sendo executado pareça outro sistema (ex.: macOS), trate o destino como Windows: use `%USERPROFILE%`, caminhos com `\` (ex.: `%USERPROFILE%\.config\opencode\`), comandos Windows (`dir /s /b`) e nunca caminhos/comandos de Unix (`~/`, `/Users/...`, `ls -R`).

Referência oficial do servidor MCP:
- https://github.com/microsoft/azure-devops-mcp

O servidor MCP do Azure DevOps roda via `npx` (pacote npm `@azure-devops/mcp`) e expõe tools para lidar com projetos, work items, repos, wikis, pipelines, test plans e advanced security do Azure DevOps. Ferramentas oficiais: https://github.com/microsoft/azure-devops-mcp/blob/main/docs/TOOLSET.md

**Autenticação do Azure DevOps — PERGUNTE ao usuário qual método usar (obrigatório):**

Pergunte explicitamente: **"Como deseja autenticar no Azure DevOps: (1) interativa (login Microsoft) ou (2) Configurar PERSONAL API KEY nas variáveis de ambiente do Windows?"**

1. **Interativa (padrão, recomendada para teste):**
    - Não configura token nenhum. Na primeira vez que uma tool do MCP for usada, abre um navegador para login da conta Microsoft que tenha acesso à organização Azure DevOps.
    - Simples e mais seguro (nenhum segredo salvo em arquivo). Use quando o usuário só quer testar sem se preocupar com token.

2. **Configurar PERSONAL API KEY nas variáveis de ambiente do Windows:**
    - **Prévia (mostrar abaixo da opção):** ao selecionar esta opção, o usuário deve **gerar uma Personal Access Key (PAT)** na Azure, caso ainda não tenha uma. A chave fica salva como **variável de ambiente de usuário do Windows** (`[Environment]::SetEnvironmentVariable(..., "User")`), persistente — **NÃO** no `opencode.json` nem em arquivo de config em texto claro.
    - **Geração da API key:** se o usuário não tiver uma PAT, oriente a gerá-la: acesse `https://dev.azure.com/<organizacao>/_usersSettings/tokens`, faça login, crie um PAT com escopos de leitura apropriados (pelo menos `Work Items`/`Build`/`Code`, etc. conforme os domínios escolhidos) e copie o valor.
    - **Caixa de texto para a API key:** quando o usuário selecionar esta opção, **abra uma caixa de texto pedindo: "Cole aqui a sua API KEY"** e aguarde o usuário colar o valor do PAT. Ao pedir, **mostre também como criar a API key** caso o usuário ainda não tenha uma, informando o link e explicando o processo:
        - Acesse `https://dev.azure.com/SkyInfoDevOps/_usersSettings/tokens` (organização da Sky).
        - Faça login com a conta Microsoft que tem acesso à organização.
        - Clique em **"+ New Token"** (ou **Criar token**).
        - Preencha um **Name** (nome) para o token.
        - Em **Scope**, defina uma **Organization** válida (ex.: SkyInfoDevOps) e selecione `Custom defined` ou os escopos de leitura apropriados para os domínios usados: pelo menos **`Work Items`** (read), **`Build`** (read), **`Code`** (read) e **`Project and Team`** (read). Conforme os domínios que for usar (repositories, pipelines, wiki, test plans etc.), marque os escopos correspondentes.
        - Defina uma **Expiration** (validade) adequada.
        - Clique em **Create** (Criar) e **copie o valor do token imediatamente** — a Azure não mostra o token novamente depois de fechar a página.
        - Cole o valor copiado na caixa de texto abaixo.
- **O servidor** lê `PERSONAL_ACCESS_TOKEN` (valor em base64 de `<usuario>:<pat>`) e deve ser iniciado com o argumento `-a pat`.
- **Prefixo automático — nome de usuário do Windows (sem caixa de texto):** **não** pergunte email ao usuário. Use automaticamente o nome do usuário do Windows logado como prefixo, obtido em runtime via `$env:USERNAME` (ou `[Environment]::UserName`). O base64 fica `base64($env:USERNAME + ":" + <pat>)`. Como o prefixo é o nome do usuário da máquina e cada usuário tem o seu PAT na Azure e a sua env var `PERSONAL_ACCESS_TOKEN` no nível de usuário do Windows, não há conflito entre usuários da mesma máquina (o servidor ignora o prefixo; o que autentica é o PAT).
- Oriente: o valor da API key é sensível — nunca commitar, nunca colar em logs. O prompt salva o base64 via env var de usuário do Windows, fora de qualquer arquivo versionado.

**O usuário precisa informar:**
1. **Nome da organização Azure DevOps** (ex.: `SkyInfoDevOps`). Também pode estar já memorizada em `%USERPROFILE%\.config\opencode\azure-config.json` (ver passo 2c).
2. **Método de autenticação** (interativa ou Configurar PERSONAL API KEY nas variáveis de ambiente do Windows) — conforme escolhido acima.

Passos:

1. Verifique os pré-requisitos:
    - A pasta `%USERPROFILE%\.config\opencode\` existe. Se não existir, crie-a.
    - O arquivo `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`, formato usado pela Sky) existe e é JSON válido. Se não existir, crie com pelo menos o `$schema`.
    - `node`/`npm`/`npx` instalados. Verifique com `node --version` e `npx --version`. Se ausentes, instale o Node.js 20+ pelo instalador oficial: https://nodejs.org/

2. Configure o arquivo de instruções do Azure DevOps — **baixe SEMPRE, mesmo que o MCP já esteja instalado**:
    - Baixe a versão atual do repositório:
      https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/azure-instructions.md
    - Salve em `%USERPROFILE%\.config\opencode\azure-instructions.md`
    - Se o arquivo já existir, sobrescreva com a versão baixada — **não pule o download**. Esse arquivo dá contexto à skill/agente sobre a organização, domínios carregados e convenções de uso.

2b. (Opções de autenticação — aplicar conforme a escolha do usuário no início):
- **Interativa:** nenhuma variável de ambiente precisa ser criada. O MCP será configurado sem argumento `-a` (o padrão já é interativo).
- **Configurar PERSONAL API KEY nas variáveis de ambiente do Windows:**
    1. **Pergunte a API key** ao usuário em uma **caixa de texto**: "Cole aqui a sua API KEY". Se ele não tiver uma, oriente a gerá-la na Azure (ver prévia na seção de autenticação) e aguarde ele colar.
    2. **Prefixo automático (nome de usuário do Windows):** **não peça email** nem qualquer caixa de texto extra. Use o nome do usuário do Windows logado como prefixo, obtido em runtime via `$env:USERNAME` (ou `[Environment]::UserName`).
    3. Crie a variável de ambiente de usuário do Windows (se ainda não existir), com o base64 de `$env:USERNAME:pat`:
       ```powershell
       $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$env:USERNAME`:$pat"))
       [Environment]::SetEnvironmentVariable("PERSONAL_ACCESS_TOKEN", $b64, "User")
       ```
       Onde `$env:USERNAME` é o nome do usuário do Windows (ex.: `kaian.vargas`) e `$pat` é a API key colada pelo usuário, uma variável **pertencente a cada perfil de usuário do Windows**.
    4. **Não** registrar o valor base64 em nenhum arquivo versionado. `/etc`/config do OpenCode não deve conter o token.
- Aviso: a variável de ambiente só é lida pelo MCP a partir de um terminal/OpenCode **reiniciado** após a criação.

2c. (Memória local — **NÃO criar por padrão**) O `%USERPROFILE%\.config\opencode\azure-config.json` é um arquivo de preferência local e **não deve ser criado nesta instalação**. Ele só passa a existir quando necessário, em um destes casos:
- **Override local de projeto ou organização** (usuário usa projeto diferente de `Terra Média` / org diferente de `SkyInfoDevOps`).
- **Autenticação por variável de ambiente** (usuário optou por Configurar PERSONAL API KEY nas variáveis de ambiente do Windows, `autenticacao: pat`).
- Fora desses casos, **não crie** o arquivo: os padrões da Sky vêm do `azure-instructions.md`. Não pergunte ao usuário sobre memorizar nesta instalação.
- Se o arquivo **já existir**, reutilize os valores (organização, projeto, domínios) em vez de perguntar de novo, a menos que o usuário peça para mudar. Formato:
  ```json
  {
    "organizacao": "SkyInfoDevOps",
    "autenticacao": "interativa" | "envvar" | "pat",
    "dominios": ["core", "work", "work-items", "repositories", "wiki", "pipelines"],
    "projeto": "Terra Média"
  }
  ```
- **NUNCA** colocar o PAT dentro do `azure-config.json` — o token fica somente na variável de ambiente do Windows. O arquivo guarda apenas metadados, sem segredos.

3. Configure o MCP no `opencode.json` global:
    - Leia `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`) e verifique se já existe a seção `mcp.azure-devops`.
    - Se NÃO existir, adicione o bloco abaixo ao campo `mcp` (se o campo `mcp` não existir, crie-o):
        - **Interativa** (sem argumento `-a`):
          ```json
          "mcp": {
            "azure-devops": {
              "type": "local",
              "command": ["npx", "-y", "@azure-devops/mcp", "<ORGANIZACAO>", "-d", "core", "work", "work-items", "repositories"],
              "enabled": true
            }
          }
          ```
- **Configurar PERSONAL API KEY (PAT) nas variáveis de ambiente do Windows**:
  ```json
  "mcp": {
    "azure-devops": {
      "type": "local",
      "command": ["npx", "-y", "@azure-devops/mcp", "<ORGANIZACAO>", "-a", "pat", "-d", "core", "work", "work-items", "repositories"],
      "enabled": true
    }
  }
  ```
    - Substitua `<ORGANIZACAO>` pelo nome real da organização (ex.: `SkyInfoDevOps`).
    - **Domínios:** o argumento `-d` limita as tools carregadas. Sempre inclua `core` (necessário para informações de projeto). Domínios disponíveis: `core`, `work`, `work-items`, `search`, `test-plans`, `repositories`, `wiki`, `pipelines`, `advanced-security`. Comece com `core work work-items repositories` para um teste básico; o usuário pode ampliar depois. Se preferir todas as tools, omita o `-d`.
    - **Windows + npx:** se o `npx` não estiver como executável direto no Windows (erro de "npx não é reconhecido"), use o wrapper `cmd /c` no comando:
      ```json
      "command": ["cmd", "/c", "npx", "-y", "@azure-devops/mcp", "<ORGANIZACAO>", "-a", "pat", "-d", "core", "work", "work-items", "repositories"],
      ```
    - Se o bloco `mcp.azure-devops` JÁ existir, apenas garanta que os campos estejam corretos (organização, método de auth, domínios) sem duplicar nem remover nada. **Independente de o bloco já existir, o passo 2 (baixar e sobrescrever o `azure-instructions.md`) deve ter sido executado.**
    - NUNCA altere outros campos do opencode.json (model, instructions, plugins, shell, outros MCPs, etc.).

4. Verifique a configuração:
    - Leia o `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`) modificado e confirme:
        - JSON é válido (parseável).
        - O campo `mcp.azure-devops` contém a organização, o método de autenticação (interativa ou `-a pat`) e os domínios desejados.
        - Todas as configurações anteriores continuam presentes e inalteradas.
    - Confirme que `%USERPROFILE%\.config\opencode\azure-instructions.md` existe e não está vazio.
    - Se for auth por PERSONAL API KEY, confirme que a variável `PERSONAL_ACCESS_TOKEN` foi criada no nível de usuário sem expor o valor.

5. Teste o servidor:
    - Execute o comando do MCP para confirmar que sobe sem erro (deve iniciar e aguardar stdin; use timeout, ex.: `timeout 15`):
      ```
      npx -y @azure-devops/mcp <ORGANIZACAO> -d core work work-items repositories
      ```
      (adicione `-a pat` se a auth escolhida for Configurar PERSONAL API KEY nas variáveis de ambiente do Windows)
    - Para auth por PERSONAL API KEY, rode no mesmo terminal onde a variável de ambiente já esteja definida (ou defina antes: `set PERSONAL_ACCESS_TOKEN=...`).
    - A saída deve mostrar a inicialização do servidor MCP (protocolo stdio) sem erro de autenticação. Se houver erro, corrija antes de finalizar.

6. Me informe o resultado: o que foi adicionado, o que já existia e foi preservado, o método de autenticação configurado, e que o servidor MCP do Azure DevOps está configurado (após reiniciar o OpenCode para carregar a config).

7. Ao final, mostre o estado atual da instalação:
    - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`) formatado.
    - Confirme que `%USERPROFILE%\.config\opencode\azure-instructions.md` existe.
    - Se aplicável, confirme que `%USERPROFILE%\.config\opencode\azure-config.json` existe sem expor o valor do token.

Logs:
- Para depurar o MCP, reinicie o OpenCode com `opencode --log-level DEBUG`
- Logs ficam em `%LOCALAPPDATA%\opencode\log\`
