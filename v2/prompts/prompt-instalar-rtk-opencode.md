Instale ou atualize para a versão estável mais recente do RTK (Rust Token Killer) no OpenCode V2 global da minha máquina Windows. Preserve configurações e arquivos existentes; não instale integrações de outros agentes nem sobrescreva arquivos personalizados.

Fontes oficiais:
- https://github.com/rtk-ai/rtk
- https://github.com/rtk-ai/rtk/blob/master/hooks/opencode/README.md
- https://github.com/rtk-ai/rtk/releases

1. Verifique `opencode --version`, `rtk --version` e `where.exe rtk`.
   - Exija OpenCode 1.18.29 ou mais novo. Se não atender, pare e informe.
   - Identifique o executável RTK efetivamente resolvido pelo PATH. Não presuma que esteja em `%USERPROFILE%\.local\bin`.
   - Verifique se `%USERPROFILE%\.config\opencode\plugins\rtk.ts` já existe. Preserve plugins personalizados; se o arquivo não for claramente gerenciado pelo RTK, pare e peça autorização antes de substituí-lo.

2. Consulte `https://api.github.com/repos/rtk-ai/rtk/releases/latest` e leia `tag_name`.
   - Use somente release estável, sem downgrade.
   - Baixe `rtk-x86_64-pc-windows-msvc.zip` da release identificada, não de um build de desenvolvimento.
   - Confira `checksums.txt` da release quando ele incluir o arquivo baixado.

3. Instale ou atualize o binário.
   - Se RTK já estiver instalado, faça backup do executável efetivamente resolvido pelo PATH, com nome único; nunca sobrescreva backup anterior.
   - Se não estiver instalado, use `%USERPROFILE%\.local\bin\rtk.exe` e adicione essa pasta ao PATH persistente do usuário sem remover entradas existentes.
   - Se não puder atualizar o executável existente com segurança, pare e informe antes de instalar uma cópia concorrente.
   - Em um terminal novo, confirme que `where.exe rtk` seleciona o binário atualizado e que `rtk --version` corresponde à tag da release.
   - Execute `rtk telemetry disable` antes de inicializar a integração.

4. Instale somente a integração global do OpenCode.
   - Pré-visualize: `rtk init -g --opencode --hook-only --no-patch --dry-run`.
   - Se a prévia indicar alterações fora da integração do OpenCode, pare e informe.
   - Execute: `rtk init -g --opencode --hook-only --no-patch`.
   - Não edite manualmente o plugin nem adicione RTK ao array `plugins` de `opencode.json`.

5. Valide a integração.
   - Confirme que `%USERPROFILE%\.config\opencode\plugins\rtk.ts` exporta um objeto com `id: "rtk"`, `setup(ctx)` e `server()`.
   - Confirme os hooks V2 `ctx.tool.hook("execute.before", ...)` e `ctx.shell.hook("create.before", ...)`.
   - Execute `rtk hook opencode --help` e confirme código de saída zero.
   - Execute `rtk hook opencode "git status"` e confirme resposta JSON válida. `{}` é válido quando uma reescrita mudaria a decisão de permissões do OpenCode.
   - Abra uma nova sessão do OpenCode, execute `git status` e confirme no log do servidor que o plugin carregou e RTK reescreveu o comando quando permitido.
   - Execute `rtk gain` para confirmar que instalou Rust Token Killer.

Se qualquer validação falhar, pare e informe o erro; não contorne permissões nem faça instalação manual.

Ao terminar, informe versões do OpenCode e RTK, caminho do binário, estado do plugin e resultado dos testes. Não exiba arquivos de configuração completos nem valores que possam conter segredos.
