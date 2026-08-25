Instale o Caveman (skill de respostas compactas) no OpenCode global da minha máquina Windows. Tudo que já estiver configurado deve ser mantido — nunca duplicar, nunca sobrescrever configurações existentes.

Referência oficial:
- https://github.com/JuliusBrussee/caveman/blob/main/INSTALL.md

Passos:

1. Verifique os pré-requisitos:
   - Node.js 18 ou superior instalado (node --version). Se não houver, pare e me avise.
   - Git disponível no PATH (git --version). O instalador roda via `npx` com um pacote hospedado no GitHub, e o npm precisa do executável `git` para baixá-lo. Sem git, o comando falha com `npm error syscall spawn git`.
     - Antes de concluir que falta, verifique os locais padrão fora do PATH: `%ProgramFiles%\Git\cmd\git.exe` e `%LOCALAPPDATA%\Programs\Git\cmd\git.exe`.
     - Se realmente não houver git, instale pelo winget:
       winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements --silent
     - Após instalar, atualize o PATH da sessão atual (ou abra um terminal novo) e confirme com `git --version` antes de seguir.
   - A pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.

2. Verifique se o Caveman já está instalado antes de qualquer alteração:
   - %USERPROFILE%\.config\opencode\skills\caveman\SKILL.md existe?
   - %USERPROFILE%\.config\opencode\plugins\caveman\ existe?
   - O AGENTS.md global (%USERPROFILE%\.config\opencode\AGENTS.md) já contém o bloco entre os marcadores <!-- caveman-begin --> e <!-- caveman-end -->?

   Se tudo já existir, pule para o passo 4 (verificação). Não reinstale nem duplique nada.

3. Instale usando o instalador oficial, apenas para o agente opencode:

   npx -y github:JuliusBrussee/caveman -- --only opencode

   Observações:
   - Antes de executar de verdade, rode com --dry-run e revise o que será feito:
     npx -y github:JuliusBrussee/caveman -- --only opencode --dry-run
   - O instalador escreve em %USERPROFILE%\.config\opencode\ (plugin, skills e bloco no AGENTS.md). Ele é seguro para reexecução, mas não use --force se já houver instalação.
   - Se o instalador falhar, pare e me informe o erro. Não tente instalação manual.
     - Exceção: se a falha for `npm error syscall spawn git` (git ausente), trate conforme o passo 1 (instale o git via winget) e reexecute o instalador.

4. Verifique a instalação:
   - %USERPROFILE%\.config\opencode\skills\caveman\SKILL.md existe.
   - O AGENTS.md global contém o bloco caveman (uma única vez, sem duplicação).
   - Leia %USERPROFILE%\.config\opencode\opencode.json e confirme que ele continua válido (JSON íntegro) e que nada foi removido ($schema, model, instructions, plugins, MCPs, permissões).

5. Me informe o resultado: o que foi instalado, o que já existia e foi pulado, e como ativar/desativar (/caveman lite|full|ultra|off, ou "stop caveman").

6. Ao final, mostre o estado atual da instalação:
   - Exiba o conteúdo completo de %USERPROFILE%\.config\opencode\opencode.json formatado.
   - Exiba a árvore de pastas e arquivos em %USERPROFILE%\.config\opencode\skills\ e %USERPROFILE%\.config\opencode\plugins\ com `dir /s /b` ou equivalente.
