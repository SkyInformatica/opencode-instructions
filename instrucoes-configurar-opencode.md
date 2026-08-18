Configure o OpenCode global na minha máquina Windows com as regras da Sky Informática.

Passos:

1. Verifique se a pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.

2. Descubra todos os arquivos .md na pasta rules/ deste repositório:
   https://github.com/SkyInformatica/opencode-instructions/tree/main/rules

   Liste o conteúdo da pasta rules via GitHub API:
   https://api.github.com/repos/SkyInformatica/opencode-instructions/contents/rules

   Para cada arquivo .md encontrado, monte a URL raw:
   https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/rules/ARQUIVO.md

3. Crie o arquivo %USERPROFILE%\.config\opencode\opencode.json com TODOS os arquivos .md descobertos no campo "instructions".
   ATENÇÃO: mantenha o $schema exato, incluindo o cifrão — é um identificador do schema, não variável.

   Exemplo (as URLs exatas dependem dos arquivos encontrados no passo 2):
   {
     "$schema": "https://opencode.ai/config.json",
     "instructions": [
       "https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/rules/principios.md",
       "https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/rules/outra-regra.md"
     ]
   }

4. Verifique se o arquivo foi criado corretamente lendo seu conteúdo.

5. Confirme que as URLs raw dos arquivos de regras estão acessíveis.

Pronto. Sempre que novas regras forem adicionadas ao repositório, repita este processo para atualizar o opencode.json local.