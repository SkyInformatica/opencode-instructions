Configure o OpenCode global na minha máquina Windows com as regras da Sky Informática. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes (opencode.json e demais configs). Exceção: regras e skills locais são sempre atualizadas com a versão do repositório, pois podem estar desatualizadas na máquina.

**IMPORTANTE: o ambiente-alvo é SEMPRE Windows.** Mesmo que a máquina onde este prompt está sendo executado pareça outro sistema (ex.: macOS), trate o destino como Windows: use `%USERPROFILE%`, caminhos com `\` (ex.: `%USERPROFILE%\.config\opencode\`), comandos Windows (`dir /s /b`) e nunca caminhos/ comandos de Unix (`~/`, `/Users/...`, `ls -R`).

**Pré-requisitos do Ambiente (Obrigatório):**
Antes de configurar o OpenCode, certifique-se de que as ferramentas essenciais estão instaladas e configuradas no PATH persistentemente. Siga as instruções do arquivo `prompt-configurar-ambiente-windows.md` (ou execute o comando abaixo para verificar/instalar automaticamente):
1. **Node.js 18+**: Verifique com `node -v`. Se ausente ou inferior, instale via `winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements --silent`.
2. **Git**: Verifique com `git --version`. Se ausente, instale via `winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements --silent`.
3. **PATH**: Após instalação, garanta que os diretórios de instalação (ex: `%ProgramFiles%\Git\cmd`, `%USERPROFILE%\AppData\Roaming\nvm\current`) estejam no PATH do usuário (registro) e atualize a sessão atual.

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

4. **Se o escopo incluir regras**, configure o opencode.json global:
   - Se %USERPROFILE%\.config\opencode\opencode.json já existir, leia o conteúdo atual.
     - Garanta que o array "instructions" contenha o padrão global (apenas uma vez, sem duplicar):
       "~/.config/opencode/rules/*.md"
       Esse wildcard carrega automaticamente todas as regras da pasta local, inclusive novas regras baixadas depois. Não liste arquivos de regra individualmente. Se o array ainda tiver URLs raw antigas do repositório (raw.githubusercontent.com/SkyInformatica/opencode-instructions/.../rules/...), remova-as e deixe apenas o wildcard.
       Obs.: o "~" aqui é sintaxe interna do OpenCode (expandida por ele em qualquer SO, inclusive Windows) — escreva exatamente assim no JSON; não substitua por %USERPROFILE%.
      - Se "model" ou "small_model" não estiverem definidos, defina ambos como `opencode/deepseek-v4-flash`.
     - Mantenha todo o resto inalterado ($schema, plugins, MCPs, permissões).
   - Se não existir, crie usando como modelo:
     https://github.com/SkyInformatica/opencode-instructions/blob/main/global/opencode.json
      Adapte model (`opencode/deepseek-v4-flash`), small_model (`opencode/deepseek-v4-flash`) e instructions conforme necessário.

5. Verifique se os arquivos estão corretos lendo %USERPROFILE%\.config\opencode\opencode.json.

6. Confirme que os arquivos de regras baixados existem em %USERPROFILE%\.config\opencode\rules\ e que o padrão "~/.config/opencode/rules/*.md" está no "instructions" do opencode.json.

7. Me informe o resultado: o que foi instalado, o que já existia e foi atualizado com a versão do repositório, o que já estava igual e não precisou de mudança, e que o OpenCode está configurado para carregar automaticamente todas as regras da pasta local via wildcard (sem necessidade de configuração extra por projeto ou ao adicionar novas regras).

8. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\skills\ e %USERPROFILE%\.config\opencode\rules\ (se existir) com `dir /s /b`.

---

## Configurar whitelist de modelos do OpenCode Zen

Este passo pode ser executado várias vezes. Sempre atualiza o `opencode.json` global habilitando somente os modelos da lista abaixo no provider `opencode` (Zen).

**Modelos habilitados (whitelist):**

| Modelo | ID |
|---|---|
| Big Pickle | `big-pickle` |
| Claude Fable 5 | `claude-fable-5` |
| Claude Opus 5 | `claude-opus-5` |
| Claude Sonnet 5 | `claude-sonnet-5` |
| GPT 5.4 Nano | `gpt-5.4-nano` |
| GPT 5.6 Luna | `gpt-5.6-luna` |
| GPT 5.6 Sol | `gpt-5.6-sol` |
| GPT 5.6 Terra | `gpt-5.6-terra` |
| Gemini 3.5 Flash Lite | `gemini-3.5-flash-lite` |
| Gemini 3.6 Flash | `gemini-3.6-flash` |
| Gemini 3.7 Flash | `gemini-3.7-flash` |
| DeepSeek V4 Flash | `deepseek-v4-flash` |
| DeepSeek V4 Pro | `deepseek-v4-pro` |
| GLM 5.2 | `glm-5.2` |
| Kimi K2.6 | `kimi-k2.6` |
| Kimi K2.7 Code | `kimi-k2.7-code` |
| Kimi K3 | `kimi-k3` |
| Qwen3.5 Plus | `qwen3.5-plus` |
| Qwen3.6 Plus | `qwen3.6-plus` |
| Grok 4.5 | `grok-4.5` |
| Grok 4.6 | `grok-4.6` |
| Grok Build 0.1 | `grok-build-0.1` |
| MiniMax M2.5 | `minimax-m2.5` |
| MiniMax M2.7 | `minimax-m2.7` |
| MiniMax M3 | `minimax-m3` |
| Ox Alpha Free | `x-preview-f-free` |

**Passos:**

1. Leia o `%USERPROFILE%\.config\opencode\opencode.json` atual.

2. Garanta que exista a seção `provider.opencode` no JSON. Se não existir, crie com `{}`.

3. Substitua (ou crie) o array `provider.opencode.whitelist` com exatamente a lista de IDs acima:
   ```json
   "provider": {
     "opencode": {
        "whitelist": [
          "big-pickle",
          "claude-fable-5",
          "claude-opus-5",
          "claude-sonnet-5",
          "gpt-5.4-nano",
          "gpt-5.6-luna",
          "gpt-5.6-sol",
          "gpt-5.6-terra",
          "gemini-3.5-flash-lite",
          "gemini-3.6-flash",
          "gemini-3.7-flash",
          "deepseek-v4-flash",
          "deepseek-v4-pro",
          "glm-5.2",
          "kimi-k2.6",
          "kimi-k2.7-code",
          "kimi-k3",
          "qwen3.5-plus",
          "qwen3.6-plus",
          "grok-4.5",
          "grok-4.6",
          "grok-build-0.1",
          "minimax-m2.5",
          "minimax-m2.7",
          "minimax-m3",
          "x-preview-f-free"
        ]
     }
   }
   ```

4. **Não remova** nenhum outro campo existente no `opencode.json` (`$schema`, `model`, `small_model`, `instructions`, `provider` com outros providers, etc.). Mantenha tudo que já existe — apenas garanta que `provider.opencode.whitelist` contenha exatamente a lista acima.

5. Se já existia um `whitelist` no provider `opencode`, substitua pela lista acima (atualização idempotente).

6. Salve o arquivo.

7. Confirme o resultado: leia e exiba o `%USERPROFILE%\.config\opencode\opencode.json` final formatado, verificando que:
     - O `whitelist` do provider `opencode` contém exatamente os 26 IDs listados.
   - Nenhuma outra configuração foi removida ou alterada.