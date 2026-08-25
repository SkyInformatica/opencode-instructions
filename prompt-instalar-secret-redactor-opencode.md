Instale o plugin opencode-secret-redactor no OpenCode global da minha máquina. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Referência oficial:
- https://github.com/casonadams/opencode-secret-redactor

O que o plugin faz:
- Intercepta a saída de ferramentas (bash, read) e detecta segredos (chaves AWS, tokens GitHub/GitLab, OpenAI/Anthropic, JWTs, strings de conexão, chaves privadas, etc.)
- Substitui segredos por placeholders `🔒label🔓` antes de enviar ao LLM
- Restaura valores originais automaticamente quando a ferramenta precisa executar com o valor real
- Zero configuração necessária após instalação

Passos:

1. Verifique os pré-requisitos:
   - A pasta ~/.config/opencode/ existe. Se não existir, crie-a.
   - O arquivo ~/.config/opencode/opencode.json existe e é JSON válido. Se não existir, crie com pelo menos o $schema.

2. Verifique se o plugin já está instalado:
   - Leia ~/.config/opencode/opencode.json e verifique se o array `plugin` já contém uma entrada que comece com "opencode-secret-redactor".

   Se já estiver instalado, pule para o passo 4 (verificação). Não reinstale nem duplique nada.

3. Instale o plugin:
   - Adicione "opencode-secret-redactor@0.5.1" ao array `plugin` existente no ~/.config/opencode/opencode.json.
   - Se o array `plugin` não existir, crie-o com o plugin como único elemento.
   - NUNCA remova, reordene ou altere outros plugins já presentes no array. Apenas adicione o novo item.
   - NUNCA altere outros campos do opencode.json (model, instructions, etc.).

4. Verifique a instalação:
   - Leia o ~/.config/opencode/opencode.json modificado e confirme:
     - JSON é válido (parseável).
     - O campo "plugin" contém "opencode-secret-redactor@0.5.1".
     - Todos os plugins e configurações anteriores continuam presentes e inalterados.

5. Me informe o resultado: o que foi adicionado, o que já existia e foi preservado, e que o plugin está ativo (sem necessidade de configuração extra).
