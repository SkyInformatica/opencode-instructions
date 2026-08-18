Configure o OpenCode global na minha máquina Windows com as regras da Sky Informática.

Passos:

1. Verifique se a pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.

2. Descubra todos os arquivos .md na pasta rules/ deste repositório:
   https://github.com/SkyInformatica/opencode-instructions/tree/main/rules

   Liste o conteúdo da pasta rules via GitHub API:
   https://api.github.com/repos/SkyInformatica/opencode-instructions/contents/rules

   Para cada arquivo .md encontrado, monte a URL raw:
   https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/rules/ARQUIVO.md

3. Baixe o arquivo AGENTS.md da raiz deste repositório e salve como %USERPROFILE%\.config\opencode\AGENTS.md:
   https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/AGENTS.md

4. Crie o arquivo %USERPROFILE%\.config\opencode\opencode.json com TODOS os arquivos .md descobertos no campo "instructions".
   ATENÇÃO: mantenha o $schema exato, incluindo o cifrão — é um identificador do schema, não variável.

   Use como modelo o arquivo opencode.json na raiz deste repositório:
   https://github.com/SkyInformatica/opencode-instructions/blob/main/opencode.json

   Adapte model, small_model e instructions conforme necessário.

5. Verifique se o arquivo foi criado corretamente lendo seu conteúdo.

6. Confirme que as URLs raw dos arquivos de regras estão acessíveis.

Pronto. Sempre que novas regras forem adicionadas ao repositório, repita este processo para atualizar o opencode.json local.