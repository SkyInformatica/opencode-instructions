Instale o plugin opencode-secret-redactor no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

> **Status OpenCode V2:** o upstream (`opencode-secret-redactor@0.5.1`) ainda usa a API de plugin V1 (`"plugin"` + hooks `tool.execute.*`) e **não roda no V2** — a API de plugins mudou e plugins V1 não são executados. Antes de instalar, verifique se já existe versão compatível com V2 (`Plugin.define` / `@opencode/plugin`). Se a máquina já roda V2 e não houver versão V2, avise o usuário em vez de instalar algo que não carregará; considere o `@rehydra/opencode` (mesma função de redação) ou remover/aguardar o port. Este prompt serve para máquinas V1 ou quando o upstream publicar suporte V2.

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

3. Instale o plugin:
   - Adicione "opencode-secret-redactor@0.5.1" ao array de plugins existente no %USERPROFILE%\.config\opencode\opencode.json.
   - Se já existir array de plugins (`plugin` ou `plugins`), adicione ao mesmo array. Se não existir nenhum, crie o array com o nome **`plugins`** (formato nativo V2) com o plugin como único elemento.
   - NUNCA remova, reordene ou altere outros plugins já presentes no array. Apenas adicione o novo item.
   - NUNCA altere outros campos do opencode.json (model, instructions, etc.).

4. Verifique a instalação:
   - Leia o %USERPROFILE%\.config\opencode\opencode.json modificado e confirme:
     - JSON é válido (parseável).
     - O campo "plugin" ou "plugins" contém "opencode-secret-redactor@0.5.1".
     - Todos os plugins e configurações anteriores continuam presentes e inalterados.
   - Lembre o usuário: no OpenCode V2 esse plugin só é ativo se a versão instalada for compatível com a API V2; caso contrário, o V2 o ignora (veja o aviso no topo).

5. Me informe o resultado: o que foi adicionado, o que já existia e foi preservado, e que o plugin está ativo (sem necessidade de configuração extra).

6. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\ (skills, plugins, commands, agents, etc.) com `dir /s /b` ou equivalente.
