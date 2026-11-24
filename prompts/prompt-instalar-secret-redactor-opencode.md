Instale `opencode-secret-redactor` somente quando houver release estável oficial compatível com OpenCode V2. Preserve configurações e plugins existentes.

Referências:
- https://github.com/casonadams/opencode-secret-redactor
- https://github.com/casonadams/opencode-secret-redactor/releases

Estado conhecido: a versão estável oficial é `0.5.1` e não carrega no OpenCode V2. PR #4 propõe o port, mas continua aberto. `opencode-secret-redactor-fixed@2.0.0` é um pacote separado em canal `next`; não o instale como substituto automático.

1. Confirme que `opencode --version` informa versão 2.x.
2. Consulte `npm view opencode-secret-redactor version` e leia o README/changelog da versão publicada.
   - Se a versão não tiver suporte V2 explícito (`Plugin.define`, `setup(ctx)` e hooks V2), pare.
   - Não altere arquivos nem configuração quando parar. Informe que nada foi instalado.
3. Se houver release estável oficial compatível:
   - Confira `opencode plugin list` e a entrada global de `opencode-secret-redactor`.
   - Se ainda não estiver instalado: `opencode plugin add opencode-secret-redactor@latest`.
   - Se estiver instalado: atualize somente esse pacote com `opencode plugin update opencode-secret-redactor`.
   - Preserve todas as outras entradas e configurações. Não registre o plugin no campo `plugin` legado.
4. Verifique com `opencode plugin list` e confirme que o plugin está carregado.
   - Use apenas um valor sintético de teste. Nunca exponha segredos reais.
   - Se o carregamento falhar, informe a mensagem exata e pare; não aplique port manual.

Ao terminar, informe a versão consultada, a versão instalada ou por que a instalação foi bloqueada. Não mostre o conteúdo completo de `opencode.json` nem valores secretos.
