Instale o plugin @rehydra/opencode no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

> **Status OpenCode V2 (out/2026): LIBERADO a partir de `@rehydra/opencode@0.15.0`.** O pacote passou a publicar entrypoint duplo V1/V2: `createRehydraPluginV2()` retorna `Plugin.define({ id: "rehydra", setup(ctx) })` e o export default é `{ id, server, setup }` — o V2 lê `id`/`setup()` e ignora `server()`.
> - **Evidência:** release 0.15.0 (2026-10-16) — "support OpenCode 2 V2 plugin API via dual V1/V2 entrypoint". Versão atual: `0.16.0` (2026-10-16), README documenta `plugins` plural, `Plugin.define` e opções nativas no `opencode.json`.
> - **Falha antiga, já corrigida:** no `0.13.0` o `setup()` lia `client.app`, inexistente no `ctx` do V2, e morria com `TypeError: undefined is not an object (evaluating 'client.app')`. Não se aplica a `>= 0.15.0`.
> - **Guarda de versão obrigatória:** antes de instalar, rode `npm view @rehydra/opencode version`. Se retornar **abaixo de 0.15.0**, pare e avise o usuário que a versão publicada não tem suporte V2. Se retornar `0.15.0` ou maior, prossiga.
> - **Em máquina V1:** continua funcionando pelo mesmo pacote (hooks clássicos, `createRehydraPlugin()`), sem mudança de passos.
> - Plugin de redação alternativo: `opencode-secret-redactor` **continua sem suporte V2** (ver `v2/prompts/prompt-instalar-secret-redactor-opencode.md`). Não é bloqueio para este.

Referência oficial:
- https://docs.rehydra.ai/guides/opencode-plugin

O que o plugin faz:
- Intercepta toda a conversa entre OpenCode e o LLM
- Detecta PII (emails, telefones, CPFs, cartões) e secrets (API keys, JWTs, connection strings)
- Detecta valores reais de variáveis de ambiente em arquivos `.env`
- Substitui por placeholders antes de enviar ao LLM
- Restaura valores reais antes de executar tools localmente

Passos:

1. Verifique os pré-requisitos:
   - A pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.
   - O arquivo %USERPROFILE%\.config\opencode\opencode.json existe e é JSON válido. Se não existir, crie com pelo menos o $schema.
   - Node.js 18+ instalado (verifique com `node -v`).

2. Verifique se o plugin já está instalado:
   - Leia %USERPROFILE%\.config\opencode\opencode.json e verifique se o array de plugins (`plugin` no V1 ou `plugins` no V2) já contém "@rehydra/opencode".

   Se já estiver instalado, pule para o passo 4 (verificação). Não reinstale nem duplique nada.

3. Instale o plugin:
   - IMPORTANTE: NÃO use `npm install -g`. O plugin deve ser instalado LOCALMENTE na pasta do OpenCode.
   - Execute no prompt: `cd %USERPROFILE%\.config\opencode && npm install @rehydra/opencode`
   - Isso instala o pacote em `%USERPROFILE%\.config\opencode\node_modules\@rehydra\opencode\`
   - Confirme a versão instalada: `npm ls @rehydra/opencode` deve mostrar **0.15.0 ou maior**. Se mostrar menor, desfaça a instalação e avise o usuário.
   - Adicione "@rehydra/opencode" ao array de plugins existente no %USERPROFILE%\.config\opencode\opencode.json.
   - Se já existir array de plugins (`plugin` ou `plugins`), adicione ao mesmo array. Se não existir nenhum, crie o array com o nome **`plugins`** (formato nativo V2) com o plugin como único elemento.
   - No V2 **não** é necessário criar arquivo local `plugins/rehydra.ts`; o pacote carrega pelo `plugins` do `opencode.json`.
   - Opções do plugin (`envFiles`, `redactValues`, `disableTypes`, `redactTools`, `vcsIdentities`) são opcionais. No V2 usam o formato `{ "package": "@rehydra/opencode", "options": { ... } }`. Só aplique se o usuário pedir; não altere o formato do array por conta própria.
   - NUNCA remova, reordene ou altere outros plugins já presentes no array. Apenas adicione o novo item.
   - NUNCA altere outros campos do opencode.json (model, instructions, etc.).

4. Verifique a instalação:
   - Leia o %USERPROFILE%\.config\opencode\opencode.json modificado e confirme:
     - JSON é válido (parseável).
     - O campo "plugin" ou "plugins" contém "@rehydra/opencode".
     - Todos os plugins e configurações anteriores continuam presentes e inalterados.
   - Confirme que a versão instalada é `>= 0.15.0` (única faixa com suporte V2). Em máquina V1, qualquer versão serve.
   - Em caso de falha de carregamento, o log mostra `failed to load plugin plugin.id=rehydra cause="..."`. Cite a mensagem exata ao usuário e não tente workaround com arquivo local.

5. Me informe o resultado: o que foi adicionado, o que já existia e foi preservado, e que o plugin está ativo (sem necessidade de configuração extra).

6. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\ (skills, plugins, commands, agents, etc.) com `dir /s /b` ou equivalente.

Logs:
- Para ver o que o Rehydra interceptou, execute OpenCode com `opencode --log-level DEBUG`
- Logs ficam em %LOCALAPPDATA%\opencode\log\
- Formato: `INFO service=rehydra scrubbed={"SECRET_NAME":2} messageCount=3`
- Mostra: quantos secrets/PII foram scrubbed, quais tools tiveram args rehydrated
