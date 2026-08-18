Configure o OpenCode global na minha máquina Windows com as regras da Sky Informática. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Passos:

1. Verifique se a pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.

2. Descubra todos os arquivos .md na pasta rules/ deste repositório:
   https://github.com/SkyInformatica/opencode-instructions/tree/main/rules

   Liste o conteúdo da pasta rules via GitHub API:
   https://api.github.com/repos/SkyInformatica/opencode-instructions/contents/rules

   Para cada arquivo .md encontrado, monte a URL raw:
   https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/rules/ARQUIVO.md

   Guarde estas URLs para usar no passo 4.

3. Baixe as skills da pasta skills/ deste repositório para a pasta global de skills:
   https://github.com/SkyInformatica/opencode-instructions/tree/main/skills

   Liste o conteúdo da pasta skills via GitHub API:
   https://api.github.com/repos/SkyInformatica/opencode-instructions/contents/skills

   Para cada subpasta encontrada, verifique se %USERPROFILE%\.config\opencode\skills\SUBPASTA\SKILL.md já existe:
   - Se existir, pule (já configurada).
   - Se não existir, crie a pasta e baixe o SKILL.md:
     https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/skills/SUBPASTA/SKILL.md

4. Configure o opencode.json global:
   - Se %USERPROFILE%\.config\opencode\opencode.json já existir, leia o conteúdo atual.
     - Se alguma URL de regras descoberta no passo 2 ainda não estiver no array "instructions", adicione-a.
     - Se "model" ou "small_model" não estiverem definidos, adicione usando opencode.json do repositório como sugestão.
     - Mantenha todo o resto inalterado ($schema, plugins, MCPs, permissões).
   - Se não existir, crie usando como modelo:
     https://github.com/SkyInformatica/opencode-instructions/blob/main/global/opencode.json
     Adapte model, small_model e instructions conforme necessário.

5. Verifique se os arquivos estão corretos lendo %USERPROFILE%\.config\opencode\opencode.json.

6. Confirme que as URLs raw dos arquivos de regras estão acessíveis.

Pronto. Todas as execuções são seguras: o que já existe não é duplicado nem sobrescrito.