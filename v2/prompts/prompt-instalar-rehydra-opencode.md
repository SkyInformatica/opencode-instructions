Instale o plugin @rehydra/opencode no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

> **Status OpenCode V2 (set/2026): BLOQUEADO — não instale em máquina V2.** O upstream ainda usa a API de plugin V1 (hooks `messages.transform`, `system.transform`, `tool.execute.*`, `text.complete`) e o port V2 está em andamento no time do rehydra; a release pública continua sem suporte V2.
> - **Evidência (2026-09-30, `@rehydra/opencode@0.13.0` + OpenCode V2):** empacotado como arquivo local `plugins/rehydra.ts` com o shape V2 correto (`export default { id, setup }`), o V2 **descobre e carrega** o plugin — mas o `setup()` do pacote morre logo em seguida: `failed to load plugin plugin.id=rehydra cause="TypeError: undefined is not an object (evaluating 'client.app')"`. O `setup()` do upstream lê `client.app`, que não existe no `ctx` do V2. A falha é do pacote, não do wrapper.
> - **Em máquina V2: pare no passo 2 e não instale nada.** Só siga os passos 3+ se a máquina for V1, ou se o upstream já tiver publicado suporte V2 — condição mínima de desbloqueio: `npm view @rehydra/opencode version` retornando **acima de 0.13.0** com changelog citando V2 (`ctx.session.hook` / `ctx.tool.hook`).
> - Alternativa de redação: nenhuma hoje. O `opencode-secret-redactor` está bloqueado pelo mesmo motivo (ver `v2/prompts/prompt-instalar-secret-redactor-opencode.md`).

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
   - Adicione "@rehydra/opencode" ao array de plugins existente no %USERPROFILE%\.config\opencode\opencode.json.
   - Se já existir array de plugins (`plugin` ou `plugins`), adicione ao mesmo array. Se não existir nenhum, crie o array com o nome **`plugins`** (formato nativo V2) com o plugin como único elemento.
   - NUNCA remova, reordene ou altere outros plugins já presentes no array. Apenas adicione o novo item.
   - NUNCA altere outros campos do opencode.json (model, instructions, etc.).

4. Verifique a instalação:
   - Leia o %USERPROFILE%\.config\opencode\opencode.json modificado e confirme:
     - JSON é válido (parseável).
     - O campo "plugin" ou "plugins" contém "@rehydra/opencode".
     - Todos os plugins e configurações anteriores continuam presentes e inalterados.
   - Lembre o usuário: no OpenCode V2 esse plugin só é ativo se a versão instalada for compatível com a API V2; caso contrário, o V2 o ignora (veja o aviso no topo).

5. Me informe o resultado: o que foi adicionado, o que já existia e foi preservado, e que o plugin está ativo (sem necessidade de configuração extra).

6. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\ (skills, plugins, commands, agents, etc.) com `dir /s /b` ou equivalente.

Logs:
- Para ver o que o Rehydra interceptou, execute OpenCode com `opencode --log-level DEBUG`
- Logs ficam em %LOCALAPPDATA%\opencode\log\
- Formato: `INFO service=rehydra scrubbed={"SECRET_NAME":2} messageCount=3`
- Mostra: quantos secrets/PII foram scrubbed, quais tools tiveram args rehydrated
