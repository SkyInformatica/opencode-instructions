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

## Tipos de Tarefa (Trackers)

Os trackers definem o tipo de cada tarefa. Use o campo `tracker_id` para filtrar/criar.

### Tarefas de desenvolvimento

| ID | Tracker | Uso |
|----|---------|-----|
| 1 | Defeito | Tarefas de correção de defeitos |
| 2 | Funcionalidade | Tarefas de nova funcionalidade |
| 5 | Conversão | Tarefas de implementação/envolvimento com a conversão do sistema durante a implantação de um novo cliente (converter os dados de um sistema que o cliente utilizava para o nosso sistema) |
| 21 | Retorno de testes | Correção de um defeito encontrado pelo QS (testes), como continuação de uma tarefa anterior de defeito ou funcionalidade |

### Tarefas complementares

| ID | Tracker | Uso |
|----|---------|-----|
| 10 | Suporte | Registrar horas de apoio ao suporte |
| 17 | Documentação | Registrar horas de elaboração de manuais e documentos |
| 23 | Videos | Registrar horas de elaboração de vídeos de ajuda sobre o sistema |
| 11 | Planejamento | Registrar horas de reuniões e outras tarefas que não se enquadram nas anteriores |

### Outros

| ID | Tracker | Uso |
|----|---------|-----|
| 9 | Teste | Tarefas de teste/QS |

## Status das Tarefas

Os status são identificados por `status_id`. São dois fluxos distintos: o das **tarefas de desenvolvimento** e o das **tarefas de testes (QS)**.

### Status gerais

| ID | Status | Fechado? |
|----|--------|----------|
| 1 | Nova | não |
| 2 | Em andamento | não |
| 7 | Interrompida | não |
| 4 | Interrompida para analise | não |
| 3 | Resolvida | sim |
| 5 | Fechada | sim |
| 8 | Cancelada | sim |
| 41 | Continua proxima sprint | sim |

### Status de testes (QS)

| ID | Status | Fechado? |
|----|--------|----------|
| 44 | Teste OK | sim |
| 45 | Teste NOK | sim |
| 46 | Teste OK - Fechada | sim |
| 47 | Teste NOK - Fechada | sim |
| 48 | Fechada - cont retorno testes | sim |
| 49 | Fechada - sem desenvolvimento | sim |

### Fluxo das tarefas de desenvolvimento

1. A tarefa nasce como **Nova** (1), ainda não desenvolvida — consideramos **Estoque**.
2. Quando o desenvolvedor coloca a tarefa de **Defeito**, **Funcionalidade** ou **Conversão** em desenvolvimento, ela fica **Em andamento** (2). **Só pode haver uma tarefa de desenvolvimento em andamento por vez.**
3. Quando o desenvolvimento é concluído, a tarefa vai para **Resolvida** (3).
4. Após ser testada com sucesso, a tarefa é **Fechada** (5).

Outros estados possíveis:
- **Interrompida** (7): pausada momentaneamente para fazer outra tarefa e retomada depois.
- **Interrompida para analise** (4): pausada porque precisa conversar com o coordenador do projeto para esclarecer dúvidas.
- **Cancelada** (8): não será mais feita.

### Tarefa não concluída na sprint (cópia)

Se uma tarefa não for concluída na sprint, ela **continua na sprint seguinte**:

1. É feita uma **cópia** da tarefa para a próxima sprint (a cópia fica registrada nas **relações entre tarefas** no Redmine).
2. A tarefa atual fica com status **Continua proxima sprint** (41).
3. A cópia segue o fluxo normal até ser **Resolvida** (3).
4. Isso pode se repetir (2, 3 ou mais cópias). **Somente a última tarefa da cadeia de cópias** fica **Resolvida**; as anteriores (das sprints anteriores) ficam **Continua proxima sprint**.

### Fluxo da equipe QS (testes)

A equipe **QS** tem um projeto próprio no Redmine para organizar tarefas e sprints: **projeto ID 99**.

Quando uma tarefa de desenvolvimento fica **Resolvida** (3), ela vai para os testes. É feita uma **cópia** dela para o projeto da equipe QS.

A tarefa copiada para QS segue outro fluxo:

1. Começa como **Nova** (1).
2. Vai para **Em andamento** (2) enquanto o QS testa.
3. Conclui como **Teste OK** (44) — se tudo funcionou — ou **Teste NOK** (45) — se houve alguma não conformidade.

#### Teste NOK → Retorno de testes

Quando o teste resulta **NOK**:

1. É criada uma **cópia** da tarefa para correção, que volta para a equipe de desenvolvimento como tarefa do tipo **Retorno de testes** (tracker 21). Isso acontece **somente para tarefas originais de desenvolvimento** dos tipos **Defeito** ou **Funcionalidade**.
2. A tarefa de testes que estava **Teste NOK** (45) é fechada com o status **Teste NOK - Fechada** (47).
3. A tarefa de desenvolvimento que estava **Resolvida** também é fechada com o status **Continua proxima sprint** (41).
4. O **Retorno de testes** reinicia todo o fluxo de desenvolvimento até que os testes concluam com **Teste OK**.

#### Teste OK → Fechamento

Quando o teste resulta **OK**, a tarefa está pronta para entrar em uma versão:

1. A tarefa de desenvolvimento vai de **Resolvida** (3) para **Fechada** (5).
2. A tarefa de testes é fechada com **Teste OK - Fechada** (46).

### Outros

| ID | Tracker | Uso |
|----|---------|-----|
| 9 | Teste | Tarefas de teste/QS, inclui a reserva de horas para os testes entre pares na sprint |

## Prioridades das Tarefas

As prioridades são identificadas por `priority_id`:

| ID | Prioridade | Padrão? |
|----|-----------|---------|
| 3 | Baixa | não |
| 4 | Média | sim |
| 6 | Alta | não |
| 42 | Imediata | não |

## Organização de cada Sprint de Desenvolvimento

Toda sprint de desenvolvimento reserva horas para atividades complementares e imprevistos. Além das tarefas de desenvolvimento planejadas, a sprint é criada com uma tarefa complementar **por programador**, seguindo o padrão de nome abaixo.

### Tarefas complementares criadas na sprint

| Tracker | Nome da tarefa | Finalidade |
|---------|----------------|------------|
| Teste (9) | `Tarefa de testes - <nome do programador>` | Reservar horas e registrar o tempo gasto nos **testes entre pares** na equipe de desenvolvimento, feitos nas tarefas resolvidas **antes de encaminhar para o QS** |
| Suporte (10) | `Tarefa de suporte - <nome do programador>` | Reservar e registrar horas do desenvolvedor que ajuda o **suporte** nos atendimentos do dia a dia |
| Planejamento (11) | `Tarefa de planejamento - <nome do programador>` | Reservar e registrar horas de **atividades complementares** que não são desenvolvimento, suporte ou testes — planejamento e reuniões, e outras como resolver um problema na máquina, fazer merge para liberar uma versão, ou qualquer atividade administrativa |
| Defeito (1) | `Tarefas nao planejadas - <nome do programador>` | **Reservar** horas para tarefas **imediatas** (prioridade Imediata) que não foram planejadas e vão aparecer durante a sprint |

Padrão: o nome das tarefas complementares é sempre `Tarefa de <tipo> - <nome do programador>`.

## Projetos e Equipes

Os projetos do Redmine são organizados por equipe. Há **equipes de desenvolvimento** (cada uma com um projeto próprio) e a **equipe QS** (com um projeto próprio para suas tarefas de teste).

### Equipes de desenvolvimento

Cada equipe de desenvolvimento tem um projeto no Redmine. Use os IDs abaixo para filtrar/associar tarefas:

| ID | Nome |
|----|------|
| 22 | Equipe Financeiro |
| 21 | Equipe Notar |
| 4  | Equipe Protesto |
| 16 | Equipe Civil |
| 9  | Equipe Imóveis |
| 17 | Equipe TED |

### Equipe QS

A equipe QS (testes) também tem um projeto próprio no Redmine para organizar suas tarefas e sprints:

| ID | Nome |
|----|------|
| 99 | QS |

## Convenções de API

- Datas no formato `YYYY-MM-DD` (ISO), exceto o nome da sprint que usa `DD/MM`.
- `offset`: deslocamento de paginação (padrão 0).
- `limit`: quantidade de itens por página (padrão 25, máximo 100 — use 100).

<!-- TODO: completar mais contexto aqui -->
