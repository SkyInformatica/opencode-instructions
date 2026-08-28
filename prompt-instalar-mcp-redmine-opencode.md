Configure o servidor MCP do Redmine no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

**IMPORTANTE: o ambiente-alvo é SEMPRE Windows.** Mesmo que a máquina onde este prompt está sendo executado pareça outro sistema (ex.: macOS), trate o destino como Windows: use `%USERPROFILE%`, caminhos com `\` (ex.: `%USERPROFILE%\.config\opencode\`), comandos Windows (`dir /s /b`) e nunca caminhos/comandos de Unix (`~/`, `/Users/...`, `ls -R`).

Referência oficial do servidor MCP:
- https://github.com/runekaagaard/mcp-redmine

O servidor MCP do Redmine roda via `uvx` (pacote PyPI `mcp-redmine`) e expõe as tools `redmine_request`, `redmine_paths_list`, `redmine_paths_info`, `redmine_upload` e `redmine_download`.

**Credenciais do Redmine (Obrigatório):**
1. **URL do Redmine** — use SEMPRE a URL padrão da Sky: `https://redmine.skyinformatica.com.br` (HTTPS, NÃO http).
2. **API key do Redmine** — pergunte ao usuário. Se o usuário não informar a chave, solicite explicitamente: "Qual é a sua API key do Redmine? (Menu 'Minha conta' → 'Chave de acesso à API' no Redmine)". Não prossiga sem a chave.

Passos:

1. Verifique os pré-requisitos:
   - A pasta `%USERPROFILE%\.config\opencode\` existe. Se não existir, crie-a.
   - O arquivo `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`, formato usado pela Sky) existe e é JSON válido. Se não existir, crie com pelo menos o `$schema`.
   - `uv`/`uvx` instalado. Verifique com `uvx --version`. Se ausente, instale via instalador oficial da Astral:
     `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`
     Isso instala em `%USERPROFILE%\.local\bin\` (arquivos `uv.exe` e `uvx.exe`). O instalador NÃO registra no PATH do Windows — por isso o config deve usar o caminho absoluto do `uvx.exe` (ver passo 3).

2. Baixe o arquivo de instruções do Redmine:
   - Baixe a versão atual do repositório:
     https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/redmine-instructions.md
   - Salve em `%USERPROFILE%\.config\opencode\redmine-instructions.md`
   - Se o arquivo já existir, sobrescreva com a versão baixada (a cópia local pode estar desatualizada). Esse arquivo é usado pela variável `REDMINE_REQUEST_INSTRUCTIONS` para dar contexto à tool `redmine_request`.

3. Configure o MCP no `opencode.json` global:
   - Leia `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`) e verifique se já existe a seção `mcp.redmine`.
   - Se NÃO existir, adicione o bloco abaixo ao campo `mcp` (se o campo `mcp` não existir, crie-o):
     ```json
     "mcp": {
       "redmine": {
         "type": "local",
         "command": [
           "C:\\Users\\<USUARIO>\\.local\\bin\\uvx.exe",
           "--python",
           "3.12",
           "--from",
           "mcp-redmine==2026.8.1.2543",
           "mcp-redmine"
         ],
         "enabled": true,
         "environment": {
           "REDMINE_URL": "https://redmine.skyinformatica.com.br",
           "REDMINE_API_KEY": "<API KEY INFORMADA PELO USUARIO>",
           "REDMINE_REQUEST_INSTRUCTIONS": "C:\\Users\\<USUARIO>\\.config\\opencode\\redmine-instructions.md"
         }
       }
     }
     ```
   - Substitua `<USUARIO>` pelo nome de usuário real do Windows (mesmo do caminho do `opencode.json`) e `<API KEY INFORMADA PELO USUARIO>` pela chave fornecida no passo de credenciais.
   - Se o bloco `mcp.redmine` JÁ existir, apenas garanta que os campos estejam corretos (URL https, chave, path do uvx, versão e instruções) sem duplicar nem remover nada.
   - Requisitos técnicos do comando (não altere):
     - `--python 3.12` é obrigatório: o `mcp-redmine` pin `pyyaml==6.0.2` não tem wheel para Python 3.14/3.13 no Windows e a build falha. Em 3.12 instala limpo.
     - Use o caminho absoluto `C:\Users\<USUARIO>\.local\bin\uvx.exe` porque o instalador do uv não adiciona ao PATH.
     - Versão `mcp-redmine==2026.8.1.2543` (última estável na criação deste prompt).
   - NUNCA altere outros campos do opencode.json (model, instructions, plugins, shell, outros MCPs, etc.).

4. Verifique a configuração:
   - Leia o `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`) modificado e confirme:
     - JSON é válido (parseável).
     - O campo `mcp.redmine` contém a URL `https://redmine.skyinformatica.com.br`, a API key, o comando `uvx.exe` e a variável `REDMINE_REQUEST_INSTRUCTIONS` apontando para `redmine-instructions.md`.
     - Todas as configurações anteriores continuam presentes e inalteradas.
   - Confirme que `%USERPROFILE%\.config\opencode\redmine-instructions.md` existe e não está vazio.

5. Teste o servidor:
   - Execute o comando do MCP com as variáveis de ambiente setadas para confirmar que sobe sem erro (deve iniciar e aguardar stdin; use timeout, ex.: `timeout 15`):
     ```
     set REDMINE_URL=https://redmine.skyinformatica.com.br
     set REDMINE_API_KEY=<API KEY>
     set REDMINE_REQUEST_INSTRUCTIONS=%USERPROFILE%\.config\opencode\redmine-instructions.md
     "%USERPROFILE%\.local\bin\uvx.exe" --python 3.12 --from mcp-redmine==2026.8.1.2543 mcp-redmine
     ```
   - A saída deve mostrar a inicialização do servidor MCP Redmine (mensagem tipo "Starting MCP Redmine version ..."). Se houver erro, corrija antes de finalizar.

6. Me informe o resultado: o que foi adicionado, o que já existia e foi preservado, e que o servidor MCP do Redmine está configurado (após reiniciar o OpenCode para carregar a config).

7. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\opencode.json` (ou `opencode.jsonc`) formatado.
   - Confirme que `%USERPROFILE%\.config\opencode\redmine-instructions.md` existe.

Logs:
- Para depurar o MCP, reinicie o OpenCode com `opencode --log-level DEBUG`
- Logs ficam em `%LOCALAPPDATA%\opencode\log\`