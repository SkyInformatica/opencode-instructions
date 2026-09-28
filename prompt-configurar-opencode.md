Configure o OpenCode global na minha máquina Windows com as regras da Sky Informática. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes (opencode.json e demais configs). Exceção: regras e skills locais são sempre atualizadas com a versão do repositório, pois podem estar desatualizadas na máquina.

**IMPORTANTE: o ambiente-alvo é SEMPRE Windows.** Mesmo que a máquina onde este prompt está sendo executado pareça outro sistema (ex.: macOS), trate o destino como Windows: use `%USERPROFILE%`, caminhos com `\` (ex.: `%USERPROFILE%\.config\opencode\`), comandos Windows (`dir /s /b`) e nunca caminhos/ comandos de Unix (`~/`, `/Users/...`, `ls -R`).

**Pré-requisitos do Ambiente (Obrigatório):**
Antes de configurar o OpenCode, certifique-se de que as ferramentas essenciais estão instaladas e configuradas no PATH persistentemente. Siga as instruções do arquivo `prompt-configurar-ambiente-windows.md` (ou execute o comando abaixo para verificar/instalar automaticamente):
1. **Node.js 18+**: Verifique com `node -v`. Se ausente ou inferior, instale via `winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements --silent`.
2. **Git**: Verifique com `git --version`. Se ausente, instale via `winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements --silent`.
3. **PATH**: Após instalação, garanta que os diretórios de instalação estejam no PATH do usuário (registro) e atualize a sessão atual.

**Taxonomia dos nomes (use para resolver pedidos por time):**

Tudo segue `sky-<time>-<assunto>`, onde `<time>` é `delphi` ou `dotnet`:

| Time | Ferramentas | Prefixo (regras e skills) |
|---|---|---|
| **Delphi** | Redmine + SVN | `sky-delphi-` |
| **.NET** | Azure DevOps + git | `sky-dotnet-` |
| **Geral / compartilhado** | — | `sky-` sem time (`sky-principios`, `sky-oquehadenovo`) |

Quando o usuário pedir por **time** (ex.: "somente delphi", "só o que é do dotnet", "minhas regras e skills do time Delphi"), **não** exija nomes: resolva para os itens cujo nome começa com o prefixo do time (`sky-delphi-` ou `sky-dotnet-`) e liste o que foi selecionado antes de baixar. Inclua sempre os gerais (`sky-principios` para regras; `sky-oquehadenovo` quando o pedido incluir skills), avisando que são compartilhados.

**Antes de executar qualquer passo técnico, você DEVE perguntar ao usuário o seguinte:**

A. **Escopo da instalação:**
   Pergunte: "Deseja instalar regras, skills, agents, ou combinação? (responda: 'somente regras', 'somente skills', 'somente agents', 'somente delphi', 'somente dotnet', ou deixe em branco para todos)"

   - Se usuário responder "somente regras" → pule todo passo relacionado a skills e agents
   - Se usuário responder "somente skills" → pule todo passo relacionado a regras e agents
   - Se usuário responder "somente agents" → pule todo passo relacionado a regras e skills
   - Se usuário responder "somente delphi" → regras (`sky-delphi-*`) + skills (`sky-delphi-*`) do time Delphi; pule agents. Inclua os gerais conforme a regra da taxonomia acima.
   - Se usuário responder "somente dotnet" → regras (`sky-dotnet-*`) + skills (`sky-dotnet-*`) do time .NET; pule agents. Inclua os gerais conforme a regra da taxonomia acima.
   - Se usuário não informar / deixar em branco → considere todos (regras + skills + agents)

B. **Se o escopo incluir regras:**
   Pergunte: "Quais regras deseja instalar? (informe os nomes separados por vírgula, um time ('delphi'/'dotnet'), ou 'todas')"

   - Se usuário responder "todas" → instale todas as regras disponíveis na pasta rules/
   - Se usuário informar um time → instale as regras com o prefixo daquele time (`sky-delphi-*` / `sky-dotnet-*`) e inclua os gerais (`sky-principios`)
   - Se usuário informar nomes específicos → instale apenas as regras com esses nomes
   - Se usuário não informar nada / deixar em branco → liste as regras disponíveis (consultando a pasta rules/ do repositório via GitHub API) e peça para o usuário escolher quais deseja. Repita a pergunta até obter uma resposta válida (nomes específicos, time, ou "todas").

C. **Se o escopo incluir skills:**
   Pergunte: "Quais skills deseja instalar? (informe os nomes separados por vírgula, um time ('delphi'/'dotnet'), ou 'todas')"

   - Se usuário responder "todas" → instale todas as skills disponíveis na pasta skills/
   - Se usuário informar um time → instale as skills com o prefixo daquele time (`sky-delphi-*` / `sky-dotnet-*`) e inclua a compartilhada `sky-oquehadenovo`
   - Se usuário informar nomes específicos → instale apenas as skills com esses nomes
   - Se usuário não informar nada / deixar em branco → liste as skills disponíveis (consultando a pasta skills/ do repositório via GitHub API) e peça para o usuário escolher quais deseja. Repita a pergunta até obter uma resposta válida (nomes específicos, time, ou "todas").

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

   Ignore a subpasta `references/` ao listar/instalar: não é skill (não tem `SKILL.md`), é o acervo de referenciais técnicos compartilhados.

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

3c. **Remova arquivos legados renomeados** (a taxonomia antiga pode ter deixado arquivos órfãos na máquina — sem isso a skill/regra fica duplicada). Só remova o legado se o novo correspondente tiver acabado de ser baixado nos passos 2/3.

   Skills — remova a pasta inteira `%USERPROFILE%\.config\opencode\skills\<legada>\`:

   | Legada (remover) | Nova (mantida) |
   |---|---|
   | `sky-delphi` | `sky-delphi-codigo` |
   | `sky-devexpress` | `sky-delphi-devexpress` |
   | `sky-wptools7` | `sky-delphi-wptools7` |
   | `sky-csharp` | `sky-delphi-csharp` |
   | `delphi-review` | `sky-delphi-revisar` |
   | `preencher-instrucoes-teste` | `sky-delphi-instrucoes-teste` |
   | `revisar-pr` | `sky-dotnet-revisar-pr` |
   | `preencher-instrucoes-teste-pr` | `sky-dotnet-instrucoes-teste-pr` |
   | `proposta-dotnet` | `sky-dotnet-proposta` |
   | `implementar-proposta-dotnet` | `sky-dotnet-implementar-proposta` |
   | `manutencao-testes-automatizados` | `sky-dotnet-testes` |
   | `gerar-oquehadenovo-skai` | `sky-dotnet-oquehadenovo-skai` |
   | `gerar-oquehadenovo` | `sky-oquehadenovo` |

   Regras — remova o arquivo `%USERPROFILE%\.config\opencode\rules\<legado>.md`:

   | Legada (remover) | Nova (mantida) |
   |---|---|
   | `delphi.md` | `sky-delphi-diretivas.md` |
   | `svn.md` | `sky-delphi-svn.md` |
   | `principios.md` | `sky-principios.md` |

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