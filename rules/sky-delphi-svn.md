# SVN — Uso com OpenCode

Este projeto usa Subversion (SVN), não Git. Nunca use comandos git. Use comandos svn ou TortoiseSVN.

## Terminal — comandos svn

| Operação | Git | SVN |
|---|---|---|
| status | `git status` | `svn status` |
| diff (working) | `git diff` | `svn diff` |
| diff (revisão) | `git diff HEAD~1` | `svn diff -r PREV:BASE` |
| log | `git log` | `svn log -l 10` |
| log (detalhado) | `git log -p` | `svn log --diff -l 5` |
| add | `git add arquivo` | `svn add arquivo` |
| commit | `git commit -m "msg"` | `svn commit -m "msg"` |
| revert (working) | `git checkout -- arquivo` | `svn revert arquivo` |
| update | `git pull` | `svn update` |
| blame | `git blame arquivo` | `svn blame arquivo` |
| info | `git remote -v` | `svn info` |
| list files | `git ls-files` | `svn list -R` |
| rename | `git mv` | `svn mv` |
| delete | `git rm` | `svn rm` |
| ignore | `.gitignore` | `svn propset svn:ignore "*.log" .` |
| branch list | `git branch` | `svn list ^/branches` |
| branch create | `git checkout -b feat/x` | `svn copy ^/trunk ^/branches/feat/x -m "branch"` |
| switch branch | `git checkout feat/x` | `svn switch ^/branches/feat/x` |
| merge | `git merge feat/x` | `svn merge ^/branches/feat/x` (com `--reintegrate` quando aplicável) |
| resolve conflicts | resolver manualmente + `git add` | resolver manualmente + `svn resolve --accept=working arquivo` |
| stashes | `git stash` | não tem nativo; criar patch: `svn diff > meu_patch.patch; svn revert -R .` |

## TortoiseSVN (Windows) — interface gráfica

Usar quando operação interativa for mais segura (merge complexo, resolução de conflitos, log visual).

```
TortoiseProc.exe /command:commit /path:"%CD%" /logmsg "mensagem"
TortoiseProc.exe /command:log /path:"%CD%" /limit:20
TortoiseProc.exe /command:diff /path:"caminho/do/arquivo"
TortoiseProc.exe /command:repostatus /path:"%CD%"
TortoiseProc.exe /command:update /path:"%CD%"
TortoiseProc.exe /command:merge /path:"%CD%"
TortoiseProc.exe /command:blame /path:"caminho/do/arquivo"
TortoiseProc.exe /command:switch /path:"%CD%"
```

Para abrir o diálogo de commit com mensagem preenchida:
```
TortoiseProc.exe /command:commit /path:"%CD%" /logmsg "implementa feature X"
```

## Regras para o agente

1. **Nunca use `git`** — todo comando VCS é `svn` via terminal ou `TortoiseProc.exe` no Windows.
2. **Status primeiro** — antes de commit, diff, ou qualquer operação, executar `svn status` para verificar o estado da working copy.
3. **Commit sempre com `-m`** — `svn commit -m "mensagem descritiva em pt-BR"`.
4. **Update antes de commit** — `svn update` primeiro para evitar conflitos.
5. **svn:ignore** — usar `svn propset svn:ignore` nos diretórios, não `.gitignore`.
6. **Merge complexo** — preferir TortoiseSVN (`TortoiseProc.exe /command:merge`) para merge com conflitos.
7. **Sem `git stash`** — não existe em SVN. Usar patch file como alternativa.
8. **`svn diff` para revisar** — `svn diff` antes de commit para conferir alterações.