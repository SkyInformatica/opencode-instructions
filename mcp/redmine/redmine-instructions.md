> Redmine da Sky. Ao mudar o fluxo no plugin, atualizar os dois arquivos.

> Cópia das instruções usadas pelo servidor **MCP do Redmine** no OpenCode
> (`REDMINE_REQUEST_INSTRUCTIONS`, em `~/.config/opencode/redmine-instructions.md`).
> Aqui vale como referência do fluxo de tarefas e das convenções da API do
> Redmine da Sky. Ao mudar o fluxo no plugin, atualizar os dois arquivos.

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
| 9 | Teste | Reservar horas e registrar o tempo dedicado aos testes entre pares na equipe de desenvolvimento |

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
3. A cópia segue o fluxo normal até ser **Resolvida** (3). Se a tarefa que está sendo copiada está **Em andamento** (2), a cópia já nasce **Em andamento** e com o **mesmo desenvolvedor** responsável — não é preciso remanejar.
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

### Liberação de versão

**Liberar a versão** é uma destas duas coisas na tarefa de desenvolvimento — ou
as duas:

1. **A tarefa sair de Resolvida (3), indo para Fechada (5).** A `Versão estável`
   **nem sempre é preenchida** (às vezes esquecem), então o fechamento da DEVEL
   por si só já significa que a versão foi liberada.
2. **Preencher o campo Versão estável**, com a tarefa ainda em **Resolvida** — é o
   caminho normal: a versão foi liberada e ainda falta fechar a tarefa.

Vale como "versão liberada" o que acontecer **primeiro**: o preenchimento da
`Versão estável` ou a passagem de Resolvida para Fechada. É histórico: se a
versão foi liberada antes de o teste terminar, esse registro permanece mesmo
depois que a tarefa de testes for fechada.

### Fechar a DEVEL não fecha a tarefa do QS

O fechamento automático da tarefa de testes (de **Teste OK** para **Teste OK -
Fechada**) só acontece quando a tarefa do QS está em **Teste OK** no momento em
que a DEVEL passa para **Fechada**.

Se a tarefa do QS estiver em **Nova**, **Em andamento** ou **Teste NOK**, fechar
a DEVEL **não** fecha a QS. Isso é comum e esperado: é possível ter DEVEL
**Fechada** com a QS ainda no **estoque do QS** (Nova), ou até com a QS ainda não
criada. A QS é fechada depois, quando chegar em **Teste OK** ou **Teste NOK**.

### Teste dispensado

Algumas tarefas não passam pelo QS por decisão própria, e nelas **não existe**
teste a comparar:

- tarefas que vão para **Fechada - sem desenvolvimento** (49);
- tarefas de **Conversão** (tracker 5);
- tarefas com o campo **Teste QS** = **Não necessita teste**.

## Fluxo completo de uma tarefa (somente quando solicitado)

O Redmine da Sky Informática tem um **plugin personalizado de indicadores**, cuja API consolida o fluxo e os dados das tarefas relacionadas. Para consultar etapa atual, custo, horas, retornos de testes ou tempos, use essa API: ela já considera as issues encadeadas e evita percorrer manualmente todas as relações.

Percorra manualmente as relações entre issues **somente quando o usuário pedir explicitamente o fluxo completo**, por exemplo, a cadeia inteira de tarefas, todas as cópias e retornos ou uma linha do tempo issue por issue. Não faça essa investigação apenas porque o usuário perguntou pela etapa atual, pelo custo ou pelo histórico resumido: use os indicadores e consulte issues individuais apenas para detalhes que a API não fornece, como descrição ou journals.

Uma tarefa pode envolver várias issues ligadas por relações: cópias entre sprints, cópia para o projeto QS (99), retorno de testes (21) ou duplicatas. Se o pedido exigir esse detalhamento completo, siga as regras abaixo:

### Como percorrer o fluxo completo

1. **Voltar até a primeira tarefa** do fluxo — suba as relações até a origem (a tarefa de onde todas derivam). Se a issue não tiver relação anterior, ela mesma é a origem.
2. **Percorrer a ligação das tarefas até o fim** — siga as relações até a **última** issue da cadeia, passando por todas as cópias e retornos intermediários.
3. **Percorrer as duas direções**: para trás (origem) e para frente (destino). A cadeia é uma linha do tempo, não uma árvore — se houver mais de uma origem ou mais de um destino, percorra **todos** os ramos e diga qual chose é o fluxo principal.
4. **Não pare na primeira página / primeiro nível.** Cadeiras podem ter 3 ou mais cópias, e a cadeia **atravessa projetos** (desenvolvimento → QS → voltar para desenvolvimento). Não filtre por `project_id` ao seguir o fluxo: busque por `issue_id`.
5. Só considere encerrada a investigação quando a última issue da cadeia não tiver relação que avance o fluxo.

### Como percorrer (API)

1. Issue inicial:
   ```
   GET /issues/{id}.json?include=relations
   GET /issues/{id}/relations.json
   ```
   O campo `relations[]` traz cada ligação com `issue_id`, `issue_to_id` e `type`.
2. Para cada issue vizinha, repita o passo 1 — montando o grafo. Guarde os `issue_id` já visitados para não entrar em laço (relações do tipo "duplicada de" são simétricas).
   O `type` diz a direção: `Duplicated` = esta é cópia de outra (volte para `issue_to_id`); `Duplicated by` = outra é cópia desta (avance); `Precedes`/`Follows` = ordem; `Relates to` = ligação sem ordem (tarefa de testes, por exemplo).
3. Ordene a cadeia em ordem cronológica (`created_on`) para montar a linha do tempo do fluxo.
4. Para o custo, some as horas de **todas** as issues da cadeia:
   ```
   GET /time_entries.json?issue_id={id}&limit=100   (loop de paginação)
   ```
   Some também `spent_hours` de cada issue e compare com o estimado (`estimated_hours`) para dizer se estourou.

### Como apresentar

Devolva a cadeia inteira em ordem, uma linha por issue:

| # | ID | Tarefa | Projeto | Sprint | Status | Horas |
|---|----|--------|---------|--------|--------|-------|

E embaixo: **total de horas do fluxo**, quantas issues tem a cadeia e em que status parou. Se alguma issue da cadeia não foi encontrada (sem permissão, deletada), diga qual é — não pule em silêncio.

## API de indicadores do plugin personalizado da Sky (o fluxo já vem consolidado)

Use esta API como fonte padrão para consultar o consolidado de uma tarefa, sem
percorrer manualmente a cadeia de relações. O plugin personalizado, desenvolvido
pela Sky Informática, devolve **um registro por fluxo de desenvolvimento** — a demanda
começa numa issue e termina em outra — com datas, tempos e horas de todas as
tarefas encadeadas. Percorra as relações manualmente somente se o usuário pedir
explicitamente o fluxo completo issue por issue; para descrição, journals e
outros detalhes de uma issue, consulte a API de issues.

### Autenticação e rotas

Precisa da chave de API no header `X-Redmine-API-Key`.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/issues/{id}/indicadores.json` | Indicador do fluxo. Aceita **qualquer** tarefa do fluxo (DEVEL, QS ou cópia do meio) e devolve o mesmo registro. |
| GET | `/projects/{id}/indicadores.json` | Indicadores de um projeto (ID ou identificador). Exige o módulo Indicadores habilitado e permissão de visualização. |
| GET | `/indicadores.json` | Todos os indicadores visíveis, com filtros e paginação. |

```sh
curl -H "X-Redmine-API-Key: $REDMINE_API_KEY" "$REDMINE_URL/issues/96258/indicadores.json"
```

**Estas rotas não aparecem em `redmine_paths_list`** — aquela tool só lê o spec
padrão do Redmine embarcado no pacote do MCP. Chame-as direto pelo `path`; estão
funcionando normalmente.

A resposta vem em `{"indicadores": [...], "total_count": N, "offset": 0, "limit": 25}`.
Paginação `limit`/`offset` (máximo 100, loop até `total_count` como na regra geral).
Erros: `401` chave inválida, `404` tarefa ou projeto não encontrado/sem permissão,
`422` filtro ou ordenação inválidos.

### Como filtrar (via `params`, não query string)

Os filtros vão no argumento **`params`** da tool, como **dict** — não cole uma
query string no `path`. Dois formatos equivalentes:

**1 — parâmetro direto** (mais simples, operador `=`). Qualquer coluna da tabela
serve de filtro:

```json
{ "path": "/indicadores.json",
  "params": { "projeto": "Equipe Notar",
              "etapa_atual": "E01_ESTOQUE_DEVEL",
              "limit": 100, "offset": 0 } }
```

**2 — forma `f[]` / `op[campo]` / `v[campo][]`**, quando precisar de operador.
As chaves do dict **incluem os colchetes**:

```json
{ "path": "/indicadores.json",
  "params": { "f[]": "status", "op[status]": "~",
              "v[status][]": "Resolvida", "limit": 100 } }
```

| Operador | Significado |
|----------|-------------|
| `=` | igual a qualquer valor |
| `!` | diferente de todos |
| `~` / `!~` | contém / não contém |
| `><` | entre dois valores (inclusive) |
| `>=` / `<=` | maior ou igual / menor ou igual |
| `*` / `!*` | vazio-nulo / preenchido |
| `o` / `c` | status aberto / fechado (só `status_id`) |

Detalhes que evitam erro:

- **Atalhos que aceitam ID** do Redmine e traduzem para as colunas:

  | Atalho | Procura em |
  |--------|------------|
  | `project_id` | `projeto`, `projeto_qs` |
  | `status_id` | `status`, `status_qs` |
  | `assigned_to_id` | `atribuido_para`, `atribuido_para_qs` |
  | `issue_id` | `id_tarefa`, `id_ultima_tarefa`, `id_tarefa_qs`, `id_ultima_tarefa_qs` |

- **`op[campo]` sozinho é ignorado silenciosamente** — o operador só é validado e
  aplicado quando vem junto com o `f[]` correspondente. Sempre mande os dois.
- Ordenação: `sort` = `"campo:direcao"`, vírgula para múltiplos, ex.
  `"tempo_gasto:desc,id_tarefa:asc"`. Padrão `id_tarefa:desc`. Campo inválido → 422.
- Datas seguem `YYYY-MM-DD` e aceitam os mesmos operadores da tabela de
  `created_on` mais abaixo (`>=`, `<=`, `><` com `|`).

### O que significa cada campo

Sem sufixo = lado **DEVEL** do fluxo. Com sufixo `_qs` = lado **QS** (vazio se o
fluxo não passou pelo QS).

**Identificação do fluxo**

| Campo | Significado |
|-------|-------------|
| `id_tarefa` | **Primeira tarefa DEVEL** do fluxo — a chave lógica do indicador. |
| `id_ultima_tarefa` | Última tarefa DEVEL (após continuidades e retornos de testes). |
| `id_tarefa_qs` / `id_ultima_tarefa_qs` | Primeira e última tarefa de QS do fluxo. |
| `tipo` | Tracker da primeira DEVEL (Defeito, Funcionalidade, Conversão…). |
| `status` | Status atual da **última** DEVEL. |
| `projeto` / `sprint` | Projeto e sprint da primeira DEVEL. |
| `sprint_ultima_tarefa` | Sprint da última DEVEL. |
| `atribuido_para` | Responsável da primeira DEVEL. |
| `categoria` | Categoria da primeira DEVEL. |
| `sistema`, `origem`, `skynet`, `cliente`, `clientenome`, `clientecidade`, `qtde_skynet` | Campos personalizados da primeira DEVEL. |

**Planejamento**

| Campo | Significado |
|-------|-------------|
| `data_prevista` | Data prevista (due date) da primeira DEVEL. |
| `tarefa_nao_planejada_imediata` | `true`/`false` — alguma DEVEL do fluxo é não planejada imediata. |
| `tarefa_antecipada_sprint` | `true`/`false` — alguma DEVEL do fluxo foi antecipada na sprint. |
| `versao_estavel` / `versao_teste` | Versões da última DEVEL. A `versao_estavel` preenchida com a tarefa em Resolvida é a etapa "versão liberada, falta fechar". |
| `teste_no_desenvolvimento` | Teste feito dentro do desenvolvimento (`Não testada`, `Teste OK`, `Teste NOK`). |
| `tarefa_complementar` | `SIM`, `NAO` ou o rótulo de tarefa não planejada (tarefas de teste, vídeo, documentação, suporte, planejamento). |

> **Padrão de valores:** `tarefa_complementar` e `tarefa_fechada_sem_testes` usam
> `SIM` / `NAO` — tudo maiúsculo e sem acento. Já `tarefa_nao_planejada_imediata`,
> `tarefa_antecipada_sprint` e as variantes `_qs` são booleanas e saem como
> `true` / `false` (ou vazio). Filtre cada um com o formato que ele devolve.

**Tempos e datas** (tempos em **dias**, as datas lidas do histórico das tarefas)

| Campo | Significado |
|-------|-------------|
| `tempo_estimado` / `tempo_gasto` | Soma das horas estimadas / gastas de **todas** as DEVEL do fluxo. |
| `data_criacao_ou_atendimento` | Data de criação da primeira DEVEL (ou o campo "Data de_ATendimento", se houver). |
| `data_andamento` | Início do desenvolvimento no primeiro ciclo DEVEL. |
| `data_resolvida` / `data_fechamento` | Resolução e fechamento da última DEVEL. |
| `tempo_andamento` | Da criação até o início do desenvolvimento. |
| `tempo_resolucao` | Do início do desenvolvimento até a resolução. |
| `tempo_fechamento` | Da resolução até o fechamento. |
| `tempo_para_encaminhar_qs` | Da resolução da DEVEL até a criação da tarefa QS. |
| `tempo_total_devel` | Da criação até a resolução. |
| `tempo_total_liberar_versao` | Da criação até o fechamento (liberar a versão). |
| `tempo_total_devel_concluir_testes` | Da criação até a conclusão dos testes no QS. |
| `tempo_*_detalhes` | Texto do intervalo, ex.: `De 01/10/2026 até 01/10/2026`. |
| `qtd_retorno_testes_qs` | Quantas vezes o fluxo voltou do QS para o DEVEL. |
| `qtd_retorno_testes_devel` | Quantas dessas voltadas foram criadas como **Retorno de testes**. |

**QS** (vazio se o fluxo não passou pelo QS)

| Campo | Significado |
|-------|-------------|
| `status_qs` | Status atual da última tarefa QS. |
| `projeto_qs` / `sprint_qs` | Projeto e sprint da primeira QS. |
| `atribuido_para_qs` | Responsável da primeira QS. |
| `tempo_estimado_qs` / `tempo_gasto_qs` | Soma das horas estimadas / gastas de todas as QS. |
| `houve_teste_nok` | `true` se alguma QS passou por **Teste NOK**. |
| `categoria_teste_nok` / `categoria_teste_nok_todas_tarefas_qs` | Categoria do Teste NOK: a primeira e a lista de todas. |
| `data_criacao_qs`, `data_andamento_qs`, `data_resolvida_qs`, `data_fechamento_qs` | Datas do ciclo de testes. |
| `tempo_andamento_qs`, `tempo_resolucao_qs`, `tempo_fechamento_qs` | Tempos do ciclo de testes, em dias. |
| `tempo_concluido_testes_versao_liberada` | Da conclusão dos testes até o fechamento da DEVEL. |
| `tempo_total_testes` | Da criação da QS até a conclusão (quando o teste deu OK). |

**Situação atual e flags**

| Campo | Significado |
|-------|-------------|
| `etapa_atual` | Etapa em que o fluxo está agora (ver tabela abaixo). É também o valor de filtro. |
| `etapa_atual_agrupado_retorno_testes` | A mesma etapa **sem** o sufixo `_RT`, para agrupar idas e voltas do QS. |
| `equipe_responsavel_atual` | Onde o fluxo está: `DEVEL`, `QS` ou `FECHADA`. |
| `data_etapa_atual` | Data em que a etapa atual foi identificada. |
| `tarefa_fechada_sem_testes` | `SIM` quando a versão foi liberada antes de o teste do QS concluir. Registro histórico: não volta de `SIM` para `NAO`. É `NAO` quando o teste é dispensado (`Fechada - sem desenvolvimento`, Conversão ou "Teste QS" = `Não necessita teste`) ou quando a QS foi cancelada. |
| `motivo_situacao_desconhecida` | Por que a etapa caiu em `E99_DESCONHECIDA` (ex.: tarefa `Continua proxima sprint` sem cópia). |

**Códigos de `etapa_atual`** — o sufixo `_RT` marca as etapas posteriores a um retorno de testes:

| Código | Etapa |
|--------|-------|
| `E01_ESTOQUE_DEVEL` | Estoque, ainda não começou |
| `E02_EM_ANDAMENTO_DEVEL` | Em desenvolvimento |
| `E03_AGUARDA_TESTES_DEVEL` | Aguardando teste no desenvolvimento |
| `E03_AGUARDA_ENCAMINHAR_RT_DEVEL` | Aguardando encaminhar um retorno de testes ao QS |
| `E04_AGUARDA_ENCAMINHAR_QS` | Resolvida, aguardando encaminhar ao QS |
| `E05_ESTOQUE_QS` | Com o QS, aguardando |
| `E06_EM_ANDAMENTO_QS` | QS testando |
| `E07_AGUARDA_VERSAO` / `E07_AGUARDA_ENCAMINHAR_RT` | Aguardando versão / aguardando encaminhar retorno |
| `E08_VERSAO_LIBERADA` | Versão liberada (fluxo concluído) |
| `E08_VERSAO_LIBERADA_FALTA_FECHAR` | Versão já preenchida, tarefa DEVEL ainda não fechada |
| `E08_FECHADA_SEM_DESENVOLVIMENTO` / `E08_CANCELADA` | Encerrado sem desenvolvimento / cancelado |
| `E99_INTERROMPIDA` / `E99_INTERROMPIDA_ANALISE` | Interrompida / interrompida para análise |
| `E99_DESCONHECIDA` | Fora do esperado — ver `motivo_situacao_desconhecida` |

Dois cuidados ao filtrar por `etapa_atual`:

- **O prefixo `E0x` agrupa etapas diferentes.** Filtrar por `E08` traz 14416
  registros, misturando `VERSAO_LIBERADA` (12855), `VERSAO_LIBERADA_FALTA_FECHAR`
  (71), `FECHADA_SEM_DESENVOLVIMENTO` (888) e `CANCELADA` (602) — filtre pelo
  código **completo** quando a diferença importar.
- **Considere `equipe_responsavel_atual` para "quantas tarefas estão onde"**, já
  que `DEVEL` \| `QS` \| `FECHADA` é o corte gerencial mais útil.

Use a API para o consolidado e as issues para o detalhe (descrição, journals,
anexos) de uma tarefa específica. A referência completa está em
`docs/api_indicadores.md`, no repositório do plugin `sky_redmine_plugin`.

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
| Teste (9) | `Tarefa de testes - <nome do programador>` | Reservar horas e registrar o tempo dedicado a **testes entre pares** na equipe de desenvolvimento, nas tarefas resolvidas **antes de encaminhar para o QS**. Existe somente no desenvolvimento (não no QS). As tarefas de desenvolvimento testadas devem ser **relacionadas** à tarefa de testes, como evidência de quais tarefas foram testadas pelo programador |
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
| 82 | Equipe SKY.NET |
| 8  | Equipe SkyWeb |

### Equipe QS

A equipe QS (testes) também tem um projeto próprio no Redmine para organizar suas tarefas e sprints:

| ID | Nome |
|----|------|
| 99 | QS |

## Convenções de API

- Datas no formato `YYYY-MM-DD` (ISO), exceto o nome da sprint que usa `DD/MM`.
- `offset`: deslocamento de paginação (padrão 0).
- `limit`: quantidade de itens por página (padrão 25, máximo 100 — use 100).

## Filtro no GET de issues (obrigatório)

Ao consultar tarefas, **sempre filtre no servidor** via `params` do `/issues.json`. Nunca puxe todas as issues e filtre localmente.

Filtros nativos do endpoint (use no `params`):

| Parâmetro | Uso |
|-----------|-----|
| `project_id` | Filtrar por projeto (id da equipe) |
| `fixed_version_id` | Filtrar por sprint (id da Version) |
| `status_id=open` | Apenas issues abertas |
| `assigned_to_id=me` | Issues atribuídas ao usuário logado |
| `tracker_id` | Filtrar por tipo de tarefa |
| `created_on` | Filtrar por data de criação da tarefa (operadores abaixo) |
| `updated_on` | Filtrar por data de última atualização |
| `closed_on` | Filtrar por data de fechamento |
| `start_date` | Filtrar por data de início |
| `due_date` | Filtrar por data de vencimento |

### Filtro por datas (campos de data, ex.: data de criação)

O MCP aceita filtro por campos de data direto nos `params`. O valor é um **operador seguido da data `YYYY-MM-DD`**. Operadores suportados (testados na API da Sky):

| Operador | Significado | Exemplo (`created_on`) |
|----------|-------------|------------------------|
| `>=` | a partir de (maior/igual) | `created_on: ">=2026-08-20"` |
| `<=` | até (menor/igual) | `created_on: "<=2026-01-01"` |
| `=` | igual (dia exato) | `created_on: "=2026-09-01"` |
| `><` | entre (intervalo, datas separadas por `\|`) | `created_on: "><2026-08-20\|2026-08-25"` |
| `*` | não vazio (tem data preenchida) | `created_on: "*"` |

Regras:

1. **Não existe** operador `<` ou `>` isolado (apenas `<=`/`>=`) — usar `<=`/`>=` ou o intervalo `><`. Tentar `<` retorna erro 422.
2. Campos válidos: `created_on` (criação), `updated_on` (atualização), `closed_on` (fechamento), `start_date`, `due_date`. O usuário pode pedir em português ("tarefas criadas depois de X", "vencendo até Y", "atualizadas em Z") — mapeie para o campo correspondente.
3. Combine com os demais filtros: `project_id` + `created_on=>=...` funciona junto.
4. Mantenha a paginação (loop `offset`/`limit`) mesmo com filtro de data.

Regras:

1. **Combine filtros sempre que possível.** Se o projeto e a sprint forem conhecidos, use `project_id` + `fixed_version_id` juntos.
2. "Minhas tarefas" → use `assigned_to_id=me` (quando disponível) em vez de buscar tudo.
3. Aplicar `status_id=open` e/ou lista de status abertos por padrão em questões abertas.
4. **Única exceção:** buscar sem filtro (todos os projetos/sprints) **somente** quando o usuário pedir explicitamente "todas as tarefas de todos os projetos".
5. Mantenha a paginação (loop `offset`/`limit`) mesmo com filtro.

### Exemplo — minhas tarefas da sprint atual do projeto memorizado

```
1. Leia o projeto memorizado (ver seção "Projeto de trabalho padrão").
2. Descubra a sprint atual do projeto (consulte `/projects/{id}/versions.json` e compare a data de hoje com o período).
3. Busque com filtro: `/issues.json?project_id={id}&fixed_version_id={version_id}&assigned_to_id=me&status_id=open`
4. Faça o loop de paginação até trazer tudo (total_count).
```

## Projeto de trabalho padrão (memorização)

Para não pedir o projeto toda hora, o projeto de trabalho pode ser **memorizado** em um arquivo de configuração local, criado pelo próprio agente sob demanda:

- **Local do config:** `%USERPROFILE%\.config\opencode\redmine-config.json`
- **Formato:**
  ```json
  { "projeto": "<ID do projeto>", "nome": "<Nome da equipe>" }
  ```

Comportamento do agente:

1. **No início das interações de tarefa**, verifique se `redmine-config.json` existe. Se existir, **use `project_id` desse projeto como padrão** em toda consulta de issues.
2. **Se não existir** (ou o usuário parecer trabalhar em outro projeto), **pergunte ao usuário** se quer memorizar o projeto, listando os projetos disponíveis:
   | ID | Nome |
   |----|------|
   | 4  | Equipe Protesto |
   | 9  | Equipe Imóveis |
   | 16 | Equipe Civil |
   | 17 | Equipe TED |
   | 21 | Equipe Notar |
   | 22 | Equipe Financeiro |
   | 82 | Equipe SKY.NET |
   | 8  | Equipe SkyWeb |
   | 99 | QS |
3. **Se o usuário quiser memorizar**, crie/atualize o `redmine-config.json` com o projeto escolhido (o agente tem ferramentas de escrita de arquivo; use o caminho Windows acima).
4. **Observação:** como o arquivo de instruções é lido na inicialização do servidor, o `redmine-config.json` memorizado passa a influenciar **a partir da próxima sessão**. Na sessão atual, o agente já aplica o projeto após a memorização no próprio fluxo.
5. **Override explícito:** se o usuário disser explicitamente "todos os projetos" ou citar outro projeto, **ignore** o memorizado e use o que foi pedido.
6. **Trocar de projeto:** se o usuário disser que agora trabalha em outro projeto, atualize o `redmine-config.json` para o novo projeto.

<!-- TODO: completar mais contexto aqui -->
