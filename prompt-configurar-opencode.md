Configure o OpenCode global na minha máquina Windows com as regras da Sky Informática. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

**Antes de executar qualquer passo técnico, você DEVE perguntar ao usuário o seguinte:**

A. **Escopo da instalação:**
   Pergunte: "Deseja instalar regras, skills, ou ambos? (responda: 'somente regras', 'somente skills', ou deixe em branco para ambos)"

   - Se usuário responder "somente regras" → pule todo passo relacionado a skills
   - Se usuário responder "somente skills" → pule todo passo relacionado a regras
   - Se usuário não informar / deixar em branco → considere ambos (regras + skills)

B. **Se o escopo incluir regras:**
   Pergunte: "Quais regras deseja instalar? (informe os nomes separados por vírgula, ou 'todas')"

   - Se usuário responder "todas" → instale todas as regras disponíveis na pasta rules/
   - Se usuário informar nomes específicos → instale apenas as regras com esses nomes
   - Se usuário não informar nada / deixar em branco → liste as regras disponíveis (consultando a pasta rules/ do repositório via GitHub API) e peça para o usuário escolher quais deseja. Repita a pergunta até obter uma resposta válida (nomes específicos ou "todas").

C. **Se o escopo incluir skills:**
   Pergunte: "Quais skills deseja instalar? (informe os nomes separados por vírgula, ou 'todas')"

   - Se usuário responder "todas" → instale todas as skills disponíveis na pasta skills/
   - Se usuário informar nomes específicos → instale apenas as skills com esses nomes
   - Se usuário não informar nada / deixar em branco → liste as skills disponíveis (consultando a pasta skills/ do repositório via GitHub API) e peça para o usuário escolher quais deseja. Repita a pergunta até obter uma resposta válida (nomes específicos ou "todas").

**Após obter as escolhas do usuário, execute os passos abaixo:**

Passos:

1. Verifique se a pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.

2. **Se o escopo incluir regras**, descubra os arquivos .md na pasta rules/ do repositório:
   https://github.com/SkyInformatica/opencode-instructions/tree/main/rules

   Liste o conteúdo da pasta rules via GitHub API:
   https://api.github.com/repos/SkyInformatica/opencode-instructions/contents/rules

   Para cada regra selecionada pelo usuário, monte a URL raw:
   https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/rules/ARQUIVO.md

   Guarde estas URLs para usar no passo 4.

3. **Se o escopo incluir skills**, baixe as skills selecionadas da pasta skills/ do repositório para a pasta global de skills:
   https://github.com/SkyInformatica/opencode-instructions/tree/main/skills

   Liste o conteúdo da pasta skills via GitHub API:
   https://api.github.com/repos/SkyInformatica/opencode-instructions/contents/skills

   Para cada skill selecionada pelo usuário, verifique se %USERPROFILE%\.config\opencode\skills\SUBPASTA\SKILL.md já existe:
   - Se existir, pule (já configurada).
   - Se não existir, crie a pasta e baixe o SKILL.md:
     https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/skills/SUBPASTA/SKILL.md

4. **Se o escopo incluir regras**, configure o opencode.json global:
   - Se %USERPROFILE%\.config\opencode\opencode.json já existir, leia o conteúdo atual.
     - Se alguma URL de regras descoberta no passo 2 ainda não estiver no array "instructions", adicione-a.
     - Se "model" ou "small_model" não estiverem definidos, adicione usando opencode.json do repositório como sugestão.
     - Mantenha todo o resto inalterado ($schema, plugins, MCPs, permissões).
   - Se não existir, crie usando como modelo:
     https://github.com/SkyInformatica/opencode-instructions/blob/main/global/opencode.json
     Adapte model, small_model e instructions conforme necessário.

5. Verifique se os arquivos estão corretos lendo %USERPROFILE%\.config\opencode\opencode.json.

6. Confirme que as URLs raw dos arquivos de regras estão acessíveis (se aplicável).

7. Me informe o resultado: o que foi instalado (regras e/ou skills adicionadas), o que já existia e foi preservado, e que o OpenCode está configurado para usar as regras remotas automaticamente (sem necessidade de configuração extra por projeto).

8. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\skills\ e %USERPROFILE%\.config\opencode\rules\ (se existir) com `dir /s /b` ou equivalente.