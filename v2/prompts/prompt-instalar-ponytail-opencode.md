Instale o PonyTail (modo "código mínimo" / lazy senior dev) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

> **Status OpenCode V2 (set/2026):** o upstream (`@dietrichgebert/ponytail@4.x`, `opencode-ponytail`) ainda usa a API de plugin V1 (hooks `experimental.chat.system.transform` e `command.execute.before`) e **não roda no V2** — o V2 exige `export default { id, setup }` com hooks registrados via `ctx.session.hook` / `ctx.command.transform`.
> - PR [#907](https://github.com/DietrichGebert/ponytail/pull/907) (aberto) tenta dual V1/V2, mas o reviewer apontou bloqueio: `setup()` **retornando** hooks é **ignorado** no V2 (o plugin carrega e não faz nada silenciosamente); os testes do PR são circulares (chamam `setup` à mão e invocam hooks V1 direto). Também mencionei o PR [#928](https://github.com/DietrichGebert/ponytail/pull/928) (fechado) que tentava outra abordagem.
> - **Solução usada aqui:** **port V2 versionado neste repo** — `v2/plugins/ponytail/` (mesmo padrão do port do caveman): `plugin.js` com default export `{ id, setup }` + `index.js` byte-idêntico + helpers CJS vendados (`hooks/ponytail-config.cjs`, `hooks/ponytail-instructions.cjs`, `ponytail-parse.cjs`) + `skills/ponytail/SKILL.md` + templates `command/*.md`. Com ele, injeção por turno, switches `/ponytail <modo>` persistidos e comandos `/ponytail*` funcionam no V2.

Referência oficial:
- https://github.com/DietrichGebert/ponytail/blob/main/README.md

O que o PonyTail faz:
- Injeta a regra de "código mínimo" (YAGNI, stdlib primeiro, nativo, uma linha, mínimo que funciona) no system prompt a cada turno do agente, no nível ativo
- Persiste o nível trocado via `/ponytail <modo>` no flag `%USERPROFILE%\.config\opencode\.ponytail-active`
- Adiciona comandos `/ponytail`, `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-help`

Passos:

1. Verifique os pré-requisitos:
   - Node.js 18+ instalado (`node -v`). Se não houver, pare e me avise.
   - A pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.
   - O arquivo %USERPROFILE%\.config\opencode\opencode.json existe e é JSON válido. Se não existir, crie com pelo menos o $schema.

2. Verifique se o PonyTail já está instalado antes de qualquer alteração:
   - Leia %USERPROFILE%\.config\opencode\opencode.json e verifique o array **`plugins`** (V2).
   - Se contém "`./plugins/ponytail`" **e** a pasta %USERPROFILE%\.config\opencode\plugins\ponytail\ existe com `index.js`, pule para o passo 4 (verificação). Não reinstale nem duplique nada.
   - Se o array contém uma entrada V1 ("`@dietrichgebert/ponytail`" ou "`opencode-ponytail`"): esse pacote npm é plugin V1 e **falha ao carregar no V2** (log: `Plugin must export a default definition...`). Substitua essa entrada por "`./plugins/ponytail`" — é o upgrade intencional para o port V2 deste repo.

3. Instale o port V2:
   a. Baixe os arquivos do port publicado neste repo para %USERPROFILE%\.config\opencode\plugins\ponytail\:
      - Origem: https://github.com/SkyInformatica/opencode-instructions/blob/main/v2/plugins/ponytail/ (toda a árvore)
      - Estrutura de destino:
        ```
        %USERPROFILE%\.config\opencode\plugins\ponytail\
        ├── package.json
        ├── plugin.js
        ├── index.js              ← byte-idêntico ao plugin.js (o V2 descobre plugin de diretório pelo index.js, ignora o main do package.json)
        ├── ponytail-parse.cjs    ← parser de mudança de modo (NL "stop ponytail" + template expandido)
        ├── hooks\
        │   ├── ponytail-config.cjs
        │   └── ponytail-instructions.cjs
        ├── skills\ponytail\SKILL.md
        └── command\              ← templates dos comandos /ponytail*
        ```
      - Confirme que `index.js` é byte-idêntico ao `plugin.js` local (no Windows: `fc /b index.js plugin.js`).
      - **Não** copie nada para %USERPROFILE%\.config\opencode\commands\ nem %USERPROFILE%\.config\opencode\skills\: o plugin registra os comandos via `ctx.command.transform` e o builder de instruções lê `skills\ponytail\SKILL.md` de dentro do próprio diretório do plugin.
   b. Config opencode.json (formato V2):
      - Garanta que o array **`plugins`** contenha a entrada "`./plugins/ponytail`" (o diretório — não `plugin.js`; o V2 descobrirá o `index.js` dentro dele). Sem duplicar entradas.
      - Se a entrada V1 ("`@dietrichgebert/ponytail`" / "`opencode-ponytail`") estiver presente, remova-a (ver passo 2).
      - Se a máquina é 100% V2 e existe a chave **`plugin`** (formato V1), ela é ignorada pelo V2 — remova-a (backup do opencode.json antes), deixando só `plugins`. O V2 só lê `plugins`.
      - Mantenha todo o resto inalterado ($schema, model, agents.title.model, plugins npm, MCPs, permissões).

4. Verifique a instalação:
   - %USERPROFILE%\.config\opencode\plugins\ponytail\index.js e plugin.js existem e são byte-idênticos (`fc /b`).
   - Recarregue a config: `opencode reload`. Depois `opencode plugin list --builtin` — a lista deve mostrar uma linha `ponytail` com origem local apontando para `plugins\ponytail\index.js`.
     - Se não mostrar, reinicie o serviço (`opencode service restart`) e repita.
     - Confira no log do opencode que **não** há "failed to load plugin" / "disabled plugin after transform failure" para o ponytail.
   - Diferente do caveman, o ponytail **não** grava flag ao carregar: `%USERPROFILE%\.config\opencode\.ponytail-active` só aparece depois do primeiro `/ponytail <modo>`. Sem flag, o modo efetivo é o default `full` (env `PONYTAIL_DEFAULT_MODE` ou `%USERPROFILE%\.config\ponytail\config.json` com `{"defaultMode": "lite"}`).
   - Teste de fumaça: peça ao usuário para digitar `/ponytail lite` numa sessão e confirme que o flag `.ponytail-active` passou a conter `lite`; depois `/ponytail off` (flag = `off`, injeção silenciosa) e `/ponytail` (retorna ao default).
   - Leia %USERPROFILE%\.config\opencode\opencode.json e confirme que continua válido (JSON íntegro) e que nada foi removido ($schema, model, instructions, plugins, MCPs, permissões).

5. Me informe o resultado: o que foi instalado, o que já existia e foi preservado/substituído (nota: entrada npm V1 removida, se existia), e como usar:
   - `/ponytail lite|full|ultra|review|off` — mudar intensidade (bare `/ponytail` volta ao default)
   - `/ponytail-review` — revisar diff atual por over-engineering
   - `/ponytail-audit` — auditar repo inteiro
   - `/ponytail-debt` — levantar atalhos marcados com `ponytail:`
   - `/ponytail-help` — cartão de referência
   - Desativar por linguagem natural: "stop ponytail" ou "normal mode" (persistido como `off`)
   - Modo padrão: `full`. Altere via comando ou `PONYTAIL_DEFAULT_MODE=full` / `%USERPROFILE%\.config\ponytail\config.json`.

6. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\plugins\ponytail\ com `dir /s /b` ou equivalente.
   - Exiba a saída de `opencode plugin list --builtin` (mostrando `ponytail` carregado).