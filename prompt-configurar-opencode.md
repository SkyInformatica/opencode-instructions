Configure o OpenCode global na minha máquina Windows com as regras da Sky Informática. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes (opencode.json e demais configs). Exceção: regras e skills locais são sempre atualizadas com a versão do repositório, pois podem estar desatualizadas na máquina.

**IMPORTANTE: o ambiente-alvo é SEMPRE Windows.** Mesmo que a máquina onde este prompt está sendo executado pareça outro sistema (ex.: macOS), trate o destino como Windows: use `%USERPROFILE%`, caminhos com `\` (ex.: `%USERPROFILE%\.config\opencode\`), comandos Windows (`dir /s /b`) e nunca caminhos/ comandos de Unix (`~/`, `/Users/...`, `ls -R`).

**Pré-requisitos do Ambiente (Obrigatório):**
Antes de configurar o OpenCode, certifique-se de que as ferramentas essenciais estão instaladas e configuradas no PATH persistentemente. Siga as instruções do arquivo `prompt-configurar-ambiente-windows.md` (ou execute o comando abaixo para verificar/instalar automaticamente):
1. **Node.js 18+**: Verifique com `node -v`. Se ausente ou inferior, instale via `winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements --silent`.
2. **Git**: Verifique com `git --version`. Se ausente, instale via `winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements --silent`.
3. **PATH**: Após instalação, garanta que os diretórios de instalação estejam no PATH do usuário (registro) e atualize a sessão atual.

**Antes de executar qualquer passo técnico, você DEVE perguntar ao usuário o seguinte:**

A. **Escopo da instalação:**
   Pergunte: "Deseja instalar regras, skills, agents, ou combinação? (responda: 'somente regras', 'somente skills', 'somente agents', ou deixe em branco para todos)"

   - Se usuário responder "somente regras" → pule todo passo relacionado a skills e agents
   - Se usuário responder "somente skills" → pule todo passo relacionado a regras e agents
   - Se usuário responder "somente agents" → pule todo passo relacionado a regras e skills
   - Se usuário não informar / deixar em branco → considere todos (regras + skills + agents)

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

D. **Se o escopo incluir agents:**
   Pergunte: "Quais agents deseja instalar? (informe os nomes separados por vírgula, ou 'todos')"

   - Se usuário responder "todos" → instale todos os agents disponíveis na pasta agents/
   - Se usuário informar nomes específicos → instale apenas os agents com esses nomes
   - Se usuário não informar nada / deixar em branco → liste os agents disponíveis (consultando a pasta agents/ do repositório via GitHub API) e peça para o usuário escolher quais deseja. Repita a pergunta até obter uma resposta válida (nomes específicos ou "todos").

**Após obter as escolhas do usuário, execute os passos abaixo:**

Passos:

1. Verifique se a pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.

2. **Se o escopo incluir regras**, baixe as regras selecionadas da pasta rules/ do repositório para a pasta local de regras:
   https://github.com/SkyInformatica/opencode-instructions/tree/main/rules

   Liste o conteúdo da pasta rules via GitHub API:
   https://api.github.com/repos/SkyInformatica/opencode-instructions/contents/rules

   Para cada regra selecionada pelo usuário:
   - Baixe sempre a versão atual do repositório:
     https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/rules/ARQUIVO.md
   - Se %USERPROFILE%\.config\opencode\rules\ARQUIVO.md já existir, sobrescreva com a versão baixada (a cópia local pode estar desatualizada).
   - Se não existir, salve a versão baixada em %USERPROFILE%\.config\opencode\rules\ARQUIVO.md

3. **Se o escopo incluir skills**, baixe as skills selecionadas da pasta skills/ do repositório para a pasta global de skills:
   https://github.com/SkyInformatica/opencode-instructions/tree/main/skills

   Liste o conteúdo da pasta skills via GitHub API:
   https://api.github.com/repos/SkyInformatica/opencode-instructions/contents/skills

   Para cada skill selecionada pelo usuário:
   - Baixe sempre a versão atual do repositório:
     https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/skills/<SUBPASTA>/SKILL.md
   - Se %USERPROFILE%\.config\opencode\skills\<SUBPASTA>\SKILL.md já existir, sobrescreva com a versão baixada (a cópia local pode estar desatualizada).
   - Se não existir, crie a pasta %USERPROFILE%\.config\opencode\skills\<SUBPASTA>\ e salve o SKILL.md baixado.

3b. **Se o escopo incluir agents**, baixe os agents selecionados da pasta agents/ do repositório para a pasta global de agents:
   https://github.com/SkyInformatica/opencode-instructions/tree/main/agents

   Liste o conteúdo da pasta agents via GitHub API:
   https://api.github.com/repos/SkyInformatica/opencode-instructions/contents/agents

   Para cada agent selecionado pelo usuário:
   - Baixe sempre a versão atual do repositório:
     https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/agents/<SUBPASTA>.md
   - Se %USERPROFILE%\.config\opencode\agents\<SUBPASTA>.md já existir, sobrescreva com a versão baixada (a cópia local pode estar desatualizada).
   - Se não existir, crie a pasta %USERPROFILE%\.config\opencode\agents\ e salve o <SUBPASTA>.md baixado.

4. **Se o escopo incluir regras**, configure o opencode.json global:
   - Se %USERPROFILE%\.config\opencode\opencode.json já existir, leia o conteúdo atual.
     - Garanta que o array "instructions" contenha o padrão global (apenas uma vez, sem duplicar):
       "~/.config/opencode/rules/*.md"
       Esse wildcard carrega automaticamente todas as regras da pasta local, inclusive novas regras baixadas depois. Não liste arquivos de regra individualmente. Se o array ainda tiver URLs raw antigas do repositório (raw.githubusercontent.com/SkyInformatica/opencode-instructions/.../rules/...), remova-as e deixe apenas o wildcard.
       Obs.: o "~" aqui é sintaxe interna do OpenCode (expandida por ele em qualquer SO, inclusive Windows) — escreva exatamente assim no JSON; não substitua por %USERPROFILE%.
      - Se "model" ou "small_model" não estiverem definidos, defina ambos como `opencode/deepseek-v4-flash`.
      - Garanta que `"shell": "bash"` esteja presente no JSON. Isso garante que o OpenCode use o Git Bash (que já inclui comandos Unix nativos), e não cmd/PowerShell.
     - Mantenha todo o resto inalterado ($schema, plugins, MCPs, permissões).
   - Se não existir, crie usando como modelo:
     https://github.com/SkyInformatica/opencode-instructions/blob/main/global/opencode.json
      Adapte model (`opencode/deepseek-v4-flash`), small_model (`opencode/deepseek-v4-flash`), instructions e `"shell": "bash"` conforme necessário.

5. Verifique se os arquivos estão corretos lendo %USERPROFILE%\.config\opencode\opencode.json.

6. Confirme que os arquivos de regras baixados existem em %USERPROFILE%\.config\opencode\rules\ e que o padrão "~/.config/opencode/rules/*.md" está no "instructions" do opencode.json. Confirme também que os agents selecionados existem em %USERPROFILE%\.config\opencode\agents\.

7. Me informe o resultado: o que foi instalado, o que já existia e foi atualizado com a versão do repositório, o que já estava igual e não precisou de mudança, e que o OpenCode está configurado para carregar automaticamente todas as regras da pasta local via wildcard (sem necessidade de configuração extra por projeto ou ao adicionar novas regras).

8. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\skills\, %USERPROFILE%\.config\opencode\agents\ e %USERPROFILE%\.config\opencode\rules\ (se existir) com `dir /s /b`.

---

## Modelos

Nenhum whitelist ou restrição de modelos é configurada. O OpenCode fica livre para usar qualquer modelo disponível. Não crie nem remova a seção `provider` no `opencode.json`.