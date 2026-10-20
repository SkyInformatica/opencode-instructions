Instale o plugin opencode-secret-redactor no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

> **Status OpenCode V2 (out/2026): BLOQUEADO — não instale em máquina V2.** A última release pública (`opencode-secret-redactor@0.5.1`, 2026-04-04) usa a API de plugin V1 (`"plugin"` + hooks `tool.execute.*`), e o V2 não executa plugins V1 (`Plugin export is not a function`). O repositório não recebe commits desde 2026-04-04.
> - **Port V2 em andamento:** PR #4 (`opencode-v2`, atualizado em 2026-10-19, +5307/−943) e PR #3 (`feat/opencode-v2`, 2026-09-28) estão **abertos e não mergeados**. Nenhuma versão publicada no npm.
> - **Condição de desbloqueio:** `npm view opencode-secret-redactor version` retornando versão acima de `0.5.1` cujo README/changelog cite API V2 (`Plugin.define` / `ctx.session.hook` / `ctx.tool.hook`). Enquanto isso não acontecer, **pare no passo 2 e não instale nada** em máquina V2.
> - **Não substitua por `@rehydra/opencode`:** ele já suporta V2 desde `0.15.0`, mas é outro plugin, com outra instalação e outra configuração. Se o usuário quiser trocar, indique `v2/prompts/prompt-instalar-rehydra-opencode.md`.
> - Este prompt serve para máquinas V1 ou para quando o upstream publicar suporte V2.

Referência oficial:
- https://github.com/casonadams/opencode-secret-redactor

O que o plugin faz:
- Intercepta a saída de ferramentas (bash, read) e detecta segredos (chaves AWS, tokens GitHub/GitLab, OpenAI/Anthropic, JWTs, strings de conexão, chaves privadas, etc.)
- Substitui segredos por placeholders `🔒label🔓` antes de enviar ao LLM
- Restaura valores originais automaticamente quando a ferramenta precisa executar com o valor real
- Zero configuração necessária após instalação

Passos:

1. Verifique os pré-requisitos:
   - A pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.
   - O arquivo %USERPROFILE%\.config\opencode\opencode.json existe e é JSON válido. Se não existir, crie com pelo menos o $schema.

2. Verifique se o plugin já está instalado:
   - Leia %USERPROFILE%\.config\opencode\opencode.json e verifique se o array de plugins (`plugin` no V1 ou `plugins` no V2) já contém uma entrada que comece com "opencode-secret-redactor".

   Se já estiver instalado, pule para o passo 4 (verificação). Não reinstale nem duplique nada.

   Se não estiver instalado, descubra a versão do OpenCode (`opencode --version`) e a versão publicada do plugin (`npm view opencode-secret-redactor version`):
   - **Máquina V2 + versão publicada ainda `0.5.1`:** pare aqui. Avise o usuário que o plugin não carrega no V2, cite o PR #4 aberto e não instale nada.
   - **Máquina V1:** siga para o passo 3.
   - **Qualquer máquina, versão publicada acima de `0.5.1` com V2 no changelog:** siga para o passo 3, usando essa versão.

3. Instale o plugin:
   - Use a versão validada no passo 2 (hoje `opencode-secret-redactor@0.5.1`).
   - Adicione a entrada ao array de plugins existente no %USERPROFILE%\.config\opencode\opencode.json.
   - Se já existir array de plugins (`plugin` ou `plugins`), adicione ao mesmo array. Se não existir nenhum, crie o array com o nome **`plugins`** (formato nativo V2) com o plugin como único elemento.
   - NUNCA remova, reordene ou altere outros plugins já presentes no array. Apenas adicione o novo item.
   - NUNCA altere outros campos do opencode.json (model, instructions, etc.).

4. Verifique a instalação:
   - Leia o %USERPROFILE%\.config\opencode\opencode.json modificado e confirme:
     - JSON é válido (parseável).
     - O campo "plugin" ou "plugins" contém a entrada `opencode-secret-redactor` na versão instalada.
     - Todos os plugins e configurações anteriores continuam presentes e inalterados.
   - Em máquina V2, confirme que a versão instalada tem suporte V2. Sem isso, o plugin não é executado, mesmo presente no array.

5. Me informe o resultado: o que foi adicionado, o que já existia e foi preservado. Se instalou, confirme que o plugin está ativo (sem necessidade de configuração extra). Se parou no passo 2, diga claramente que **nada foi instalado** e por quê.

6. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\ (skills, plugins, commands, agents, etc.) com `dir /s /b` ou equivalente.
