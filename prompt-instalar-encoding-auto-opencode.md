Instale o plugin encoding-auto (auto-detecção de encoding ANSI/UTF-8) no OpenCode global da minha máquina Windows, **com a versão ajustada pela Sky**. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Referência oficial (upstream, com bugs que a Sky corrige):
- https://github.com/vexakuro67/opencode-plugin-encoding-auto
- https://www.npmjs.com/package/opencode-plugin-encoding-auto

O que o plugin faz:
- `read`: detecta o encoding (chardet) e decodifica com iconv-lite — o agente vê o texto correto, sem mojibake.
- `edit`/`write`: converte ANSI→UTF-8 antes, aplica a edição, converte de volta pro encoding original depois — acentos preservados.
- `bash`: força `[Console]::OutputEncoding = UTF8` (apenas quando o shell é PowerShell).

Passos:

1. Verifique os pré-requisitos:
   - A pasta `%USERPROFILE%\.config\opencode\` existe. Se não existir, crie-a.
   - A pasta `%USERPROFILE%\.config\opencode\plugins\` existe. Se não existir, crie-a.
   - Node.js 18+ instalado (`node -v`).

2. Verifique se o plugin já está instalado antes de qualquer alteração:
   - `%USERPROFILE%\.config\opencode\plugins\encoding-auto.ts` existe?
   - Se existir, confirme se contém os ajustes da Sky (ver passo 4): a lista `UTF8_ENCODINGS` deve ter apenas `["utf-8","ascii","utf-16le","utf-16be"]` e o hook de bash deve ter o guard `isPowershell`.
   - Se já estiver com os ajustes, pule para o passo 5 (verificação). Não reinstale nem duplique nada.

3. Baixe o fonte do upstream:
   - Baixe `https://raw.githubusercontent.com/vexakuro67/opencode-plugin-encoding-auto/main/src/index.ts` e salve em `%USERPROFILE%\.config\opencode\plugins\encoding-auto.ts`.
   - Instale as dependências localmente na pasta do OpenCode (NÃO `npm install -g`):
     ```
     cd %USERPROFILE%\.config\opencode && npm install chardet iconv-lite
     ```

4. Aplique os DOIS ajustes da Sky (a versão upstream corrompe `.pas` ANSI e polui comandos bash — não usar o fonte cru):
   - Ajuste 1 (encoding ANSI Windows-1252): no `encoding-auto.ts`, a constante `UTF8_ENCODINGS` vem do upstream como
     `["utf-8","ascii","utf-16le","utf-16be","iso-8859-1","iso-8859-15","windows-1252"]`.
     Altere para conter APENAS encodings UTF reais:
     `["utf-8","ascii","utf-16le","utf-16be"]`
     Motivo: `iso-8859-1`/`iso-8859-15`/`windows-1252` são single-byte e, se tratados como UTF-8-like, o plugin NÃO converte arquivos ANSI — o `edit`/`write` lê/grava como UTF-8 e corrompe acentos (`U+FFFD`). Removê-los faz o plugin converter ANSI corretamente no read e no edit/write.
   - Ajuste 2 (hook de bash): no hook `tool.execute.before`, no bloco `if (input.tool === "bash")`, adicione logo no início:
     ```
     const isPowershell = /powershell|pwsh/i.test(process.env.SHELL || "")
     if (!isPowershell) return
     ```
     Motivo: o upstream injeta prefixo PowerShell (`[Console]::OutputEncoding = ...;`) em TODOS os comandos bash; com shell bash isso gera erro `command not found` no topo de todo comando. O guard só injeta quando o shell é powershell/pwsh.

5. Verifique a instalação:
   - `%USERPROFILE%\.config\opencode\plugins\encoding-auto.ts` existe e contém os dois ajustes do passo 4.
   - `%USERPROFILE%\.config\opencode\node_modules\` tem `chardet` e `iconv-lite`.
   - Leia `%USERPROFILE%\.config\opencode\opencode.json` e confirme que continua válido (JSON íntegro) e que nada foi removido ($schema, model, instructions, plugins, MCPs, permissões). O plugin fica em `plugins/` e é descoberto automaticamente — não precisa registrar no `opencode.json`.
   - Lembre o usuário de reiniciar o OpenCode para o plugin carregar.

6. Me informe o resultado: o que foi instalado, os dois ajustes aplicados, e que o plugin está ativo (transparente ao agente, sem configuração extra).

7. Ao final, mostre o estado atual da instalação:
   - Exiba a árvore de pastas e arquivos em `%USERPROFILE%\.config\opencode\plugins\` com `dir /s /b` ou equivalente.
   - Exiba o conteúdo completo de `%USERPROFILE%\.config\opencode\opencode.json` formatado.
