# Convenção de Input — PR e Branch

Referência compartilhada para skills que operam sobre PRs e branches no Azure DevOps.

## Formatos aceitos

A skill recebe **um** dos formatos abaixo como argumento:

| Formato | Exemplo | Descrição |
|---|---|---|
| `!<numero>` | `!456` | Número do PR no Azure DevOps |
| `tarefa/<numero>` | `tarefa/123` | Branch name vinculada ao PR |
| `entrega/<numero>` | `entrega/45` | Branch name vinculada ao PR |

Se nenhum argumento for fornecido, pergunte ao usuário qual PR ou branch utilizar.

## Como localizar o PR

**Se o input for `!<numero>`:**
- Extraia o número.
- Liste projetos com `azure-devops_core_list_projects`.
- Para cada projeto, liste repositórios com `azure-devops_repo_repository` (`action: "list"`).
- Para cada repositório, tente `azure-devops_repo_pull_request` (`action: "get"`, `pullRequestId` = número). Se encontrar, use-o.
- Se nenhum repositório retornar o PR, informe o usuário.

**Se o input for `tarefa/<numero>` ou `entrega/<numero>`:**
- Extraia o número e monte o nome da branch: `tarefa/<numero>` ou `entrega/<numero>`.
- Use `azure-devops_repo_pull_request` com `action: "list"` e `sourceRefName` filtrando por `refs/heads/tarefa/<numero>` ou `refs/heads/entrega/<numero>`.
- Se encontrar exatamente um PR ativo, use-o. Se encontrar mais de um, liste e peça confirmação. Se nenhum, informe o usuário.
