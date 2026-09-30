## Controle de versão

Projetos Delphi (D5, D7, D10) usam SVN.

### ⚠️ ALERTA CRÍTICO — ferramentas e SVN

**NUNCA usar SVN sem permissão explícita do usuário, NUNCA.** Isso inclui
svn revert, svn update, svn checkout, svn switch, svn resolve,
svn cleanup, svn commit, svn delete, svn move, svn add.
**NUNCA usar svn revert** — o working copy quase sempre contém alterações
não comitadas, e o revert as destrói de forma IRREVERSÍVEL.
**Proibida qualquer ação irreversível** (revert, delete, rm, mv,
sobrescrever arquivo) sem autorização prévia do usuário.
**Editar .pas/.dpr/.dfm SEMPRE por script Python em cp1252 (ou no encoding
original do arquivo) + CRLF.** É PROIBIDO usar a ferramenta de edição/escrita
genérica nesses arquivos — ela grava UTF-8 e quebra a acentuação.
Após qualquer edição, verificar os bytes do arquivo inteiro:
EF BF BD (acento destruído) ausente, C3 (UTF-8) ausente, \r\n presente,
decodifica em cp1252 sem erro.
**Antes de editar/sobrescrever arquivo existente:** checar svn status do
arquivo e o tamanho, mostrar o que será alterado e **aguardar aprovação**.
Em caso de dúvida, **parar e perguntar** — nunca "consertar" por conta própria.
