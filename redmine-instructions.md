# Instruções de contexto — Redmine Sky Informática

Este documento descreve o contexto do ambiente Redmine da Sky Informática para auxiliar nas interações com a API (tool `redmine_request`).

## Regra geral: sempre retornar todas as tarefas solicitadas

- Toda consulta deve retornar **todas** as tarefas solicitadas, sem cortar resultados.
- A API do Redmine é paginada. **Nunca considere uma única página como resposta final.**
- Use os parâmetros de paginação `offset` e `limit` e faça o loop até trazer **todas** as páginas.
- `limit` máximo suportado: 100. Use `limit=100` para reduzir o número de requisições e continue incrementando `offset` até o retorno ficar vazio ou abaixo do `limit`.
- Só encerre a consulta quando tiver acumulado o total informado pela API (`total_count`) ou quando não houver mais registros.
- Nunca omita tarefas por "resumo" ou por paginação; o resultado final deve ser completo.

## Organização em Sprint (Versions)

- As **sprints** são organizadas como **"Versions"** no Redmine.
- O nome de cada sprint/version segue o formato:

  ```
  AAAA-NN (DD/MM a DD/MM)
  ```

  onde:
  - `AAAA` = ano (ex.: 2026)
  - `NN` = número sequencial da sprint no ano (ex.: 11)
  - `(DD/MM a DD/MM)` = período de início e fim da sprint

- **Exemplo:** `2026-11 (18/05 a 29/05)` = sprint número 11 de 2026, começando em 18/05 e terminando em 29/05.
- Ao consultar ou associar tarefas a uma sprint, use o identificador da **Version** correspondente (busque pelo nome no formato acima).

## Projetos e Equipes

Os projetos do Redmine são organizados por equipe. Use os IDs abaixo para filtrar/associar tarefas:

| ID | Nome |
|----|------|
| 22 | Equipe Financeiro |
| 21 | Equipe Notar |
| 4  | Equipe Protesto |
| 70 | Registral |
| 16 | Equipe Civil |
| 9  | Equipe Imóveis |
| 17 | Equipe TED |

## Convenções de API

- Datas no formato `YYYY-MM-DD` (ISO), exceto o nome da sprint que usa `DD/MM`.
- `offset`: deslocamento de paginação (padrão 0).
- `limit`: quantidade de itens por página (padrão 25, máximo 100 — use 100).

<!-- TODO: completar mais contexto aqui -->
