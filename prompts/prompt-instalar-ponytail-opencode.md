Instale ou atualize a versão estável mais recente do Ponytail no OpenCode V2 global da minha máquina Windows. Preserve configurações, plugins e arquivos não relacionados.

Fontes oficiais:
- Instalação: https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md
- Releases: https://github.com/DietrichGebert/ponytail/releases
- OpenCode: https://opencode.ai/docs/plugins/

O pacote oficial suporta OpenCode V2 desde `v4.10.1`. A versão estável atual é `v5.3.3`.

1. Verifique `opencode --version` e confirme que o OpenCode V2 está instalado. Se o comando não funcionar, pare e informe; não instale nem altere o OpenCode.
   - Resolva a pasta global: use `OPENCODE_CONFIG_DIR` se estiver definida; senão, `XDG_CONFIG_HOME\opencode` se `XDG_CONFIG_HOME` estiver definida; caso contrário, `%USERPROFILE%\.config\opencode`. Use a pasta resolvida nos passos abaixo.
   - Consulte `npm view @dietrichgebert/ponytail version` e confirme que a versão publicada é estável.

2. Verifique a instalação existente antes de alterar:
   - Execute `opencode plugin list` e inspecione apenas as entradas Ponytail em `opencode.json(c)`.
   - Verifique se existe a pasta global `plugins\ponytail\`.
   - Se for o port local da Sky (`ponytail-opencode-plugin`, versão `0.1.0`), faça backup com nome único fora de `plugins\` antes de movê-lo. Preserve `<pasta-global>\.ponytail-active`.
   - Se a pasta contiver arquivos personalizados ou não for claramente o port da Sky, pare e peça autorização. Não a sobrescreva.
   - Se a configuração contiver uma entrada local para esse port, remova apenas essa entrada depois do backup. Preserve todos os outros plugins e campos.
   - Se a configuração contiver uma versão exata antiga do pacote oficial, faça backup e substitua apenas essa entrada por `@dietrichgebert/ponytail@latest`.

3. Instale globalmente pela CLI oficial:
   - Se o pacote ainda não estiver configurado: `opencode plugin add @dietrichgebert/ponytail@latest`.
   - Se já estiver configurado: `opencode plugin update @dietrichgebert/ponytail`.
   - A CLI gerencia a configuração global. Não adicione entradas duplicadas nem edite outros campos.

4. Verifique:
   - `opencode plugin list` mostra `@dietrichgebert/ponytail` carregado.
   - `opencode plugin check` não indica atualização pendente para Ponytail.
   - Em uma sessão nova, `/ponytail` e `/ponytail-help` respondem. Teste `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt` e `/ponytail-gain`.
   - Confira os logs se o plugin não carregar; informe a mensagem exata e pare. Não instale o port local como workaround.

Ao terminar, informe a versão publicada e instalada, o estado do plugin e o backup criado, se aplicável. Não exiba o arquivo de configuração completo nem valores secretos.
