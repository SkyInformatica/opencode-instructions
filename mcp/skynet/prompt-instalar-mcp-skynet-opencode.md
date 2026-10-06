Configure o servidor MCP do SkyNet (sistema de atendimentos) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

**IMPORTANTE: o ambiente-alvo é SEMPRE Windows.** Mesmo que a máquina onde este prompt está sendo executado pareça outro sistema (ex.: macOS), trate o destino como Windows: use `%USERPROFILE%`, caminhos com `\` (ex.: `%USERPROFILE%\.config\opencode\`), comandos Windows (`dir /s /b`) e nunca caminhos/comandos de Unix (`~/`, `/Users/...`, `ls -R`).

O MCP do SkyNet é um servidor próprio, escrito em Node.js, sem dependências (protocolo MCP via stdio). Expõe as tools `skynet_atendimento`, `skynet_listar_atendimentos`, `skynet_buscar_usuario`, `skynet_buscar_cliente` e `skynet_usuario_logado`, além do recurso `skynet://instrucoes`. Todas as consultas são **somente leitura**: o MCP não abre, altera, finaliza nem exclui nada no SkyNet.

Organização de arquivos:

| Caminho | Função |
|---|---|
| `%USERPROFILE%\.config\opencode\skynet-instructions.md` | contexto de uso do SkyNet, exposto como recurso MCP |
| `%USERPROFILE%\.config\opencode\mcp\skynet\server.mjs` | servidor MCP |
| `%USERPROFILE%\.config\opencode\mcp\skynet\renovar-token.mjs` | faz login e grava o token (~8h) |
| `%USERPROFILE%\.config\opencode\mcp\skynet\token.json` | token vigente (git-ignored) |

**Credenciais do SkyNet:**
1. **Host da API** — base é `https://erp.skyinformatica.com.br` (a API fica em `<host>/skynet/api`). Se o `mcp.skynet` já estiver configurado, reutilize o `SKYNET_URL` existente.
2. **Token** — o MCP **não guarda usuário e senha**. Ele lê `token.json`, gerado pelo script auxiliar, e o token do SkyNet vale ~8h.
   - Se `token.json` já existir e for válido, **não peça credenciais**.
   - Só peça usuário e senha quando o token estiver ausente ou expirado. Se ele não informar, aguarde e oriente a gerar o token rodando o script do passo 2 (grava só o token no arquivo).

Passos:

1. Verifique os pré-requisitos:
   - A pasta `%USERPROFILE%\.config\opencode\` existe. Se não existir, crie-a.
   - O arquivo `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`, formato usado pela Sky) existe e é JSON válido. Se não existir, crie com pelo menos o `$schema`.
   - `node` instalado, versão 18 ou superior (o servidor usa `fetch` nativo). Verifique com `node --version`. Se ausente, instale o Node LTS pelo instalador oficial. Se o `node` não estiver no PATH do OpenCode, use o caminho absoluto (geralmente `C:\Program Files\nodejs\node.exe`).

2. Instale os arquivos do MCP:
   - Crie a pasta `%USERPROFILE%\.config\opencode\mcp\skynet\`.
   - Baixe da versão atual do repositório:
     - https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/mcp/skynet/server.mjs → salve como `%USERPROFILE%\.config\opencode\mcp\skynet\server.mjs`
     - https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/mcp/skynet/renovar-token.mjs → salve como `%USERPROFILE%\.config\opencode\mcp\skynet\renovar-token.mjs`
     - https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/mcp/skynet/skynet-instructions.md → salve em `%USERPROFILE%\.config\opencode\skynet-instructions.md`
   - Se algum download falhar porque o arquivo ainda não foi publicado no repositório, pergunte ao usuário de onde copiar (instalação existente — antiga pasta `%USERPROFILE%\.config\opencode\mcp-skynet\` ou a nova `mcp\skynet\`) e **não prossiga sem o `server.mjs`**.
   - Se `skynet-instructions.md` já existir, sobrescreva com a versão baixada — **não pule o download** quando o `mcp.skynet` já estiver configurado: a cópia local pode estar desatualizada.
   - Verifique a sintaxe dos scripts com `node --check` antes de seguir.

3. Configure o MCP no `opencode.json` global:
   - Leia `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`) e verifique se já existe a seção `mcp.skynet`.
   - Se NÃO existir, adicione o bloco abaixo ao campo `mcp` (se o campo `mcp` não existir, crie-o):
     ```json
     "skynet": {
       "type": "local",
       "command": [
         "C:\\Program Files\\nodejs\\node.exe",
         "C:\\Users\\<USUARIO>\\.config\\opencode\\mcp\\skynet\\server.mjs"
       ],
       "enabled": true,
       "environment": {
         "SKYNET_URL": "https://erp.skyinformatica.com.br",
         "SKYNET_INSTRUCTIONS": "C:\\Users\\<USUARIO>\\.config\\opencode\\skynet-instructions.md"
       }
     }
     ```
   - Substitua `<USUARIO>` pelo nome de usuário real do Windows e ajuste o caminho do `node.exe` se `where node` indicar outro lugar.
   - Requisitos técnicos (não altere):
     - **Nunca** coloque `SKYNET_EMAIL`, `SKYNET_SENHA` ou senha/token no config. A senha não vai para arquivo nenhum; só `token.json` é gravado, e apenas com o token.
     - `SKYNET_URL` aceita a raiz (`https://erp.skyinformatica.com.br`) ou já com `/skynet` ou `/skynet/api`.
     - `SKYNET_INSTRUCTIONS` é opcional; sem ele o servidor usa `skynet-instructions.md` na pasta acima do `server.mjs` (raiz `%USERPROFILE%\.config\opencode\`).
   - Se o bloco `mcp.skynet` JÁ existir, apenas garanta que os campos estão corretos (host, path do node, path do `server.mjs`, instruções) sem duplicar nem remover nada. **Independente de o bloco já existir, o passo 2 deve ter sido executado**.
   - NUNCA altere outros campos do opencode.json (model, instructions, plugins, shell, outros MCPs, etc.).

4. Obtenha o token (se `token.json` ainda não existir ou estiver vencido):
   - Peça ao usuário o **usuário e a senha** do SkyNet. Se ele preferir rodar o comando, use:
     ```
     node "C:\Users\<USUARIO>\.config\opencode\mcp\skynet\renovar-token.mjs" <usuario> <senha>
     ```
   - O comando grava `%USERPROFILE%\.config\opencode\mcp\skynet\token.json` com `token`, `obtidoEm` e `expiraAproximadamente` (8h). Confirme que o arquivo existe e **não mostre o conteúdo do token** na resposta.
   - Se o login for recusado (`E-mail incorreto ou senha incorreta`) ou não devolver token (possível exigência de dupla autenticação), informe o usuário e aguarde novos dados. Não insista em tentativas repetidas.

5. Verifique a configuração:
   - Leia o `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`) modificado e confirme:
     - JSON válido (parseável).
     - `mcp.skynet` com o `SKYNET_URL` correto, o `command` apontando para `node.exe` + `mcp\skynet\server.mjs` e o `SKYNET_INSTRUCTIONS` para `skynet-instructions.md`.
     - Nenhuma credencial (usuário, senha ou token) no arquivo.
     - Todas as configurações anteriores continuam presentes e inalteradas.
   - Confirme que `%USERPROFILE%\.config\opencode\skynet-instructions.md` existe e não está vazio.
   - Garanta que `token.json` está no `.gitignore` (o token não pode ir para o repositório).

6. Teste o servidor:
   - Suba o servidor com as variáveis setadas para confirmar que responde MCP (deve aguardar stdin; use timeout):
     ```
     set SKYNET_URL=https://erp.skyinformatica.com.br
     "%ProgramFiles%\nodejs\node.exe" "%USERPROFILE%\.config\opencode\mcp\skynet\server.mjs"
     ```
     Envie um `initialize` e um `tools/list` por stdin. A resposta esperada traz `serverInfo.name = "skynet"` e as 5 tools.
   - Se houver token, chame `skynet_usuario_logado` para confirmar autenticação. Se der `Sem token` ou `401`, o token está ausente/vencido — volte ao passo 4.
   - Se houver erro, corrija antes de finalizar.

7. Me informe o resultado: o que foi adicionado, o que já existia e foi preservado, e que o servidor MCP do SkyNet está configurado (após reiniciar o OpenCode para carregar a config).

8. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`) formatado.
   - Confirme que `%USERPROFILE%\.config\opencode\mcp\skynet\server.mjs`, `%USERPROFILE%\.config\opencode\mcp\skynet\renovar-token.mjs` e `%USERPROFILE%\.config\opencode\skynet-instructions.md` existem.
   - Confirme se existe `token.json` e quando ele expira aproximadamente (sem exibir o token).

Logs:
- Para depurar o MCP, reinicie o OpenCode com `opencode --log-level DEBUG`
- Logs ficam em `%LOCALAPPDATA%\opencode\log\`