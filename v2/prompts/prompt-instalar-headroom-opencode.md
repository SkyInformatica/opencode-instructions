Instale o Headroom (compressão de contexto) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Referência oficial:
- https://docs.headroomlabs.ai/docs/opencode
- https://docs.headroomlabs.ai/docs/opencode-deepseek
- https://docs.headroomlabs.ai/docs/persistent-installs
- Releases: https://github.com/headroomlabs-ai/headroom/releases

O que o Headroom faz:
- Roda um proxy local (`127.0.0.1:8787`) que comprime tool outputs, logs, JSON e trechos de código antes de enviar ao provedor.
- O original fica em cache local (CCR). O MCP do Headroom expõe `headroom_retrieve` para o modelo pedir o texto completo quando precisar.
- Atua no tráfego do provedor, não nos comandos. Complementa o RTK: o RTK comprime a saída de bash; o Headroom comprime o que chega ao modelo, inclusive JSON de MCP.
- **Não** ligue o output shaper (`HEADROOM_OUTPUT_SHAPER`): ele duplica o que o Caveman/Ponytail já fazem.

Requisitos:
- Windows 10/11 x64.
- Python 3.13 (o `uv` baixa um interpretador gerenciado se necessário).
- Node.js **não** é necessário para o CLI (o pacote npm é só SDK TypeScript).
- Acesso de usuário. No Windows o preset `persistent-service` cai automaticamente para `persistent-task`: o proxy sobe no boot e um watchdog do Task Scheduler verifica a saúde a cada 5 minutos. Não precisa de admin.

Passos:

1. Verifique o estado atual:
   - `headroom --version` já existe? Se sim, anote a versão.
   - `opencode --version` (precisa ser 2.x).
   - `%USERPROFILE%\.config\opencode\opencode.json` existe? Leia `model` e `provider` para descobrir o provedor e o `baseURL` atuais. **Não** imprima chaves de API.
   - Já existe um provider `headroom` no `opencode.json`? Se sim, valide o passo 6 em vez de duplicar.

2. Instale o CLI (Python 3.13, ambiente isolado):
   - Se `uv` não existir:
     ```
     winget install --id astral-sh.uv -e --accept-source-agreements --accept-package-agreements
     ```
   - Abra um terminal novo e confirme `uv --version`.
   - Instale a versão com suporte ao OpenCode 2.x (mínimo `0.41.0`):
     ```
     uv tool install --python 3.13 "headroom-ai[proxy,code]==0.41.0"
     ```
     - `proxy` traz o proxy/MCP; `code` traz o CodeCompressor (AST). Não use `[all]` por padrão: inclui PyTorch/ONNX e pesa vários GB. Peça `[all]` só se precisar do backend ML.
     - O pacote é `headroom-ai` (PyPI). O pacote npm `headroom-ai` é apenas SDK e não instala o comando `headroom`.
   - Garanta `%USERPROFILE%\.local\bin` no PATH **persistido** (registro). Se `headroom --version` falhar em terminal novo (PowerShell):
     ```powershell
     $alvo = "$env:USERPROFILE\.local\bin"
     $path = ([Environment]::GetEnvironmentVariable('Path', 'User') -split ';' | Where-Object { $_ -and $_ -ne $alvo }) -join ';'
     [Environment]::SetEnvironmentVariable('Path', "$path;$alvo", 'User')
     ```
   - Confirme: `headroom --version` retorna `0.41.0` ou mais novo.

3. Desligue o beacon antes de subir o proxy:
   - `HEADROOM_BEACON` vem **ligado** por padrão e envia um resumo anônimo de métricas (tokens, ratios, provider/model, SO). Não envia prompts, código nem caminhos, mas para a equipe o padrão é desligar.
   - Variáveis: `HEADROOM_BEACON=off`, `HEADROOM_TELEMETRY=off`. `HEADROOM_TELEMETRY` sozinho também para o beacon, mas defina as duas.
   - Persista no usuário (PowerShell) e aplique na sessão atual:
     ```powershell
     [Environment]::SetEnvironmentVariable('HEADROOM_BEACON', 'off', 'User')
     [Environment]::SetEnvironmentVariable('HEADROOM_TELEMETRY', 'off', 'User')
     $env:HEADROOM_BEACON = 'off'
     $env:HEADROOM_TELEMETRY = 'off'
     ```
   - **Não** use `HEADROOM_BEACON` com valor desconhecido: o código é fail-open e volta a enviar.
   - Isso vale para o CLI. O runtime persistente não herda essas variáveis; ele recebe os valores no `--env` do passo 5.

4. Descubra o upstream (para onde o proxy repassa):
   - Leia `model` e os `provider` do `opencode.json`.
   - Use um provider **OpenAI-compatible** que já tenha `baseURL` e chave no arquivo. Exemplos:
     - **OpenAI** (`api.openai.com`): não precisa de URL; o proxy usa o padrão.
     - **DeepSeek**: `https://api.deepseek.com/v1`.
     - **Gateway próprio/OpenRouter/Together**: use o `baseURL` existente.
   - **Provider gerenciado `opencode/...`**: não serve como upstream (sem `baseURL` público). Se existir outro provider OpenAI-compatible no arquivo, use ele. Se só houver o `opencode/...`, pare e me avise.
   - O `model` global pode continuar no provider gerenciado. O Headroom só entra quando você escolher um modelo `headroom/<id>`.
   - A chave de API continua vindo do `opencode.json` do provider escolhido; não copie chave para o prompt nem para o log.

5. Suba o proxy persistente:
   ```
   headroom install apply --preset persistent-service --providers manual --port 8787 --env HEADROOM_BEACON=off --env HEADROOM_TELEMETRY=off
   ```
   - `--providers manual` **sem** `--target` instala só o runtime, sem reescrever `opencode.json` nem configurar outros agentes. Não omita essas flags e não use `headroom deploy` nem `headroom wrap opencode`: eles reescrevem a config ou exigem abrir o OpenCode pelo wrapper.
   - Passe também o upstream, quando não for o padrão. Exemplo DeepSeek:
     ```
     headroom install apply --preset persistent-service --providers manual --port 8787 --env HEADROOM_BEACON=off --env HEADROOM_TELEMETRY=off --env OPENAI_TARGET_API_URL=https://api.deepseek.com/v1
     ```
     O instalador copia `OPENAI_TARGET_API_URL` do ambiente atual, mas o `--env` explícito não depende do shell.
   - No Windows o comando avisa que `persistent-service` não é suportado e usa `persistent-task` (Task Scheduler) automaticamente. É o comportamento esperado.
   - `--env` é obrigatório para o beacon: o supervisor inicia com ambiente limpo e **não** herda as variáveis do seu usuário.
   - Verifique:
     ```
     headroom install status
     curl.exe http://127.0.0.1:8787/health
     ```
     `/health` deve retornar `"status": "healthy"`.
   - Se o runtime não subir, pare e me informe o erro. Não deixe um proxy efêmero como solução permanente.

6. Configure o provider `headroom` no `opencode.json`:
   - Faça backup: copie `opencode.json` para `opencode.json.bak-headroom`.
   - Liste os modelos que o proxy expõe (a chave é a do provedor atual):
     ```
     curl.exe -s http://127.0.0.1:8787/v1/models -H "Authorization: Bearer <chave>"
     ```
   - Adicione **apenas** modelos que aparecem nessa resposta:
     ```jsonc
     "provider": {
       "headroom": {
         "npm": "@ai-sdk/openai-compatible",
         "name": "Headroom Proxy",
         "options": {
           "baseURL": "http://127.0.0.1:8787/v1",
           "apiKey": "<mesma chave do provedor atual>"
         },
         "models": {
           "<id-1>": { "name": "<nome>", "limit": { "context": 128000, "output": 16000 } },
           "<id-2>": { "name": "<nome>", "limit": { "context": 128000, "output": 16000 } }
         }
       }
     }
     ```
     Se o mesmo modelo já existe no provider atual, copie os `limit` dele em vez de usar os valores de exemplo.
   - Preserve todo o resto: `$schema`, `model`, `agents`, `mcp`, permissões e os outros providers.
   - **Não** altere o `model` global sem me perguntar. O uso fica em `headroom/<id>` via `/model`; se eu pedir para tornar padrão, aí sim troque.
   - Não crie `opencode.jsonc` se já existe `opencode.json` — ter os dois na mesma pasta causa conflito.
   - Registre o MCP de recuperação (opcional, mas recomendado para o modelo conseguir pedir o texto original):
     ```
     headroom mcp install --agent opencode --proxy-url http://127.0.0.1:8787
     ```
     Confira que não duplicou uma entrada `headroom` existente no `mcp` do `opencode.json`.

7. Reinicie e valide:
   - `opencode service restart`.
   - Abra uma sessão nova e confirme que os modelos `headroom/<id>` aparecem em `/models`.
   - Selecione um e rode um comando que gere saída grande (ex.: `git log`, teste, consulta MCP).
   - Confirme o tráfego no dashboard: `headroom dashboard --no-open` → `http://127.0.0.1:8787/dashboard`.
   - Confira também `curl.exe -s http://127.0.0.1:8787/stats`.
   - Se o modelo não aparecer, valide o `/v1/models` e o `baseURL`. Se a requisição falhar com 401, a `apiKey` do provider `headroom` está errada.

8. Atualização e remoção:
   - Atualizar: compare com a última release estável (`https://api.github.com/repos/headroomlabs-ai/headroom/releases/latest`), depois:
     ```
     uv tool install --python 3.13 "headroom-ai[proxy,code]==<versao>"
     ```
     - Em `persistent-task` (Windows), encerre e inicie a tarefa pelo Task Scheduler, ou espere o watchdog de 5 minutos. `headroom install restart` só funciona em serviço.
     - Em serviço, use `headroom install restart`.
   - Remover o runtime: `headroom install remove`.
   - Remover o provider: restaure `opencode.json.bak-headroom` (ou remova só o bloco `provider.headroom`).
   - Remover o MCP: `headroom mcp uninstall --agent opencode` (ou remova a entrada `headroom` do `mcp`).
   - Remover o CLI: `uv tool uninstall headroom-ai`.
   - Remover as variáveis de usuário `HEADROOM_*` e `OPENAI_TARGET_API_URL` se não forem mais usadas.

9. Me informe:
   - Versão instalada, upstream configurado, resultado de `headroom install status` e `/health`.
   - Quais modelos apareceram em `/v1/models` e quais foram adicionados ao `opencode.json`.
   - Como ativar/desativar o uso (escolher `headroom/<id>` em `/model`, voltar para o provider original) e como remover tudo.
   - Se só houver provider gerenciado (`opencode/...`), apenas o motivo do bloqueio — não altere a configuração.
