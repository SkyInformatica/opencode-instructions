Instale o plugin encoding-auto (auto-detecção de encoding ANSI/UTF-8, versão OpenCode V2 ajustada pela Sky) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Contexto: o repo Sky Informática mantém um **port oficial V2** deste plugin em `plugins/encoding-auto/` (baseado no upstream https://github.com/vexakuro67/opencode-plugin-encoding-auto). O port roda na API V2 (`Plugin.define` + `ctx.tool.hook`) e já embute os dois ajustes Sky:
- `iso-8859-1`/`iso-8859-15`/`windows-1252` **não** são tratados como UTF-8-like — sem isso, o `edit`/`write` lê/grava como UTF-8 e corrompe acentos (`U+FFFD`). Com o ajuste, o plugin converte ANSI corretamente no read e no edit/write.

O que o plugin faz:
- Read — auto-detecta o encoding do arquivo (chardet) e decodifica (iconv-lite) para texto correto antes do LLM ler
- Edit/Write — converte temporariamente o arquivo para UTF-8 antes da execução (diff correto) e converte de volta para o encoding original depois
- Bash — prefixa o comando com `[Console]::OutputEncoding = UTF8` para evitar mojibake na saída do Windows

Requisitos (V2):
- OpenCode **V2** instalado (comando `opencode2` ou `opencode` na versão 2). Este port NÃO roda no OpenCode V1.
- Node.js 18+ (verifique com `node -v`).

Passos:

1. Verifique os pré-requisitos:
   - `opencode --version` (ou `opencode2 --version`) indica OpenCode 2.x? Se vetor V1, pare e me avise: o port é só V2.
   - A pasta %USERPROFILE%\.config\opencode\plugins\ existe. Se não existir, crie-a.
   - A pasta %USERPROFILE%\.config\opencode\ exists. Se não existir, crie-a.

2. Verifique se o plugin já está instalado antes de qualquer alteração:
   - %USERPROFILE%\.config\opencode\plugins\encoding-auto\index.ts existe?

   Se existir, pule para o passo 4 (verificação). Não reinstale nem duplique nada.

3. Instale o plugin:
   a. Baixe o port V2 do repositório Sky:
      https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/v2/plugins/encoding-auto/index.ts
      Salve em: %USERPROFILE%\.config\opencode\plugins\encoding-auto\index.ts
      (crie a pasta encoding-auto se necessário)

   b. Garanta as dependências. O OpenCode V2 não instala dependências de plugins automaticamente — elas vêm de um package.json visível a partir do arquivo do plugin (ex.: %USERPROFILE%\.config\opencode\package.json).
      - Se %USERPROFILE%\.config\opencode\package.json não existir, crie com:
        {
          "name": "opencode-config",
          "private": true,
          "type": "module",
          "dependencies": {
            "chardet": "^2.2.0",
            "iconv-lite": "^0.7.0"
          }
        }
      - Se já existir, apenas adicione `chardet` e `iconv-lite` em "dependencies" (não remova/altere as deps existentes; preserve o resto do arquivo).
      - Execute no prompt: `cd %USERPROFILE%\.config\opencode && npm install`
      - Não é preciso registrar o plugin no opencode.json: o OpenCode V2 descobre automaticamente arquivos/ pacotes em %USERPROFILE%\.config\opencode\plugins\ (subpasta com index.ts = pacote).

4. Verifique a instalação:
   - %USERPROFILE%\.config\opencode\plugins\encoding-auto\index.ts existe e tem `Plugin.define({ id: "encoding-auto", ... })`.
   - %USERPROFILE%\.config\opencode\node_modules\chardet e ...\node_modules\iconv-lite existem (ou deps resolvidas no package.json da config).
   - Reinicie o OpenCode (V2) para o plugin carregar.
   - Teste real: peça para o agente ler um arquivo ANSI (ex.: Delphi com acentos em windows-1252) e confirme que os acentos aparecem corretos; edite uma linha e salve, depois confirme que o arquivo voltou ao encoding original (sem `U+FFFD`).

5. Me informe o resultado: o que foi instalado, os ajustes Sky embutidos, e que o plugin está ativo (transparente ao agente).

6. Ao final, mostre o estado atual da instalação:
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\plugins\ com `dir /s /b` ou equivalente.
   - Exiba o conteúdo de %USERPROFILE%\.config\opencode\package.json (se existir).