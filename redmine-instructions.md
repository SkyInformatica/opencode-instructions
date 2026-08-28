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

## Como descobrir a sprint atual

- A sprint atual é determinada **pela data de hoje**, comparando com o período de cada Version.
- As sprints têm sempre **duas semanas** e começam sempre em uma **segunda-feira**.
- Para descobrir a sprint atual do projeto:
  1. Consulte as Versions do projeto (ex.: `/projects/{id}/versions.json`).
  2. Encontre a Version cujo período `(DD/MM a DD/MM)` **contém a data de hoje**.
  3. Essa é a sprint atual.
- Normalmente a sprint atual é a **última** do projeto, mas confirme sempre pelo período, não pelo fato de ser a última listada.
- **Virada do ano:** a última sprint do ano pode terminar na primeira semana do ano seguinte. Nesse caso, o ano do período final (`DD/MM`) pode ser diferente do `AAAA` do nome — a sprint `2026-18 (24/08 a 04/09)` ainda pertence a 2026 mesmo o fim sendo em setembro; use sempre o período para decidir, nunca só o ano.
- **Exemplo:** se hoje é 28/08 e a Version `2026-18 (24/08 a 04/09)` existe, a sprint atual é a `2026-18`, pois 28/08 está dentro de 24/08 a 04/09.
- **Sprints definidas em conjunto:** todos os projetos têm suas sprints definidas **juntas**, com os mesmos nomes e períodos. Se um projeto tem a sprint `2026-18 (24/08 a 04/09)`, **todos** os demais projetos também devem ter a sprint `2026-18 (24/08 a 04/09)`. O número e o período de cada sprint são idênticos entre projetos.

## Projetos e Equipes

Os projetos do Redmine são organizados por equipe. Use os IDs abaixo para filtrar/associar tarefas:

| ID | Nome |
|----|------|
| 22 | Equipe Financeiro |
| 21 | Equipe Notar |
| 4  | Equipe Protesto |
| 16 | Equipe Civil |
| 9  | Equipe Imóveis |
| 17 | Equipe TED |

## Convenções de API

- Datas no formato `YYYY-MM-DD` (ISO), exceto o nome da sprint que usa `DD/MM`.
- `offset`: deslocamento de paginação (padrão 0).
- `limit`: quantidade de itens por página (padrão 25, máximo 100 — use 100).

<!-- TODO: completar mais contexto aqui -->
