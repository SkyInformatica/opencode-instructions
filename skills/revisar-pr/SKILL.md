---
name: revisar-pr
description: "Revisão de PR no Azure DevOps: valida regras de codificação .NET (SOLID, Clean Code, arquitetura Sky) e publica comentários individuais por linha."
---

# revisar-pr

## Quando usar

Ative esta skill quando o usuário pedir para revisar um PR, Code Review, ou quando mencionar `!` seguido de número (ex.: `!123`), ou branch no formato `tarefa/<numero>` ou `entrega/<numero>`.

## Input aceito

Consulte `skills/references/input-pr-branch.md` para os formatos de entrada aceitos (`!<numero>`, `tarefa/<numero>`, `entrega/<numero>`).

## Regras de referência

Carregue os três arquivos abaixo **antes** de iniciar a revisão. Eles são a base de validação:

1. `references/regras-de-codificacao-dotnet.md` — regras de nomenclatura, padrões MediatR, organização de arquivos, tratamento de erros, async/cancellation, enums, comentários
2. `references/arquitetura-dotnet.md` — camadas (Dominio/Aplicacao/Infraestrutura/Servico), organização de domínios, DDD, multi-tenant, MediatR, repositórios
3. `rules/principios.md` — SOLID, DRY, KISS/YAGNI, Library First, tipagem forte, segurança

## Workflow

### Fase 1 — Localizar o PR

Siga o fluxo definido em `skills/references/input-pr-branch.md` para identificar o PR.

### Fase 2 — Obter dados do PR e diffs

1. Com o PR identificado, chame `azure-devops_repo_pull_request` com `action: "get"` e `includeChangedFiles: true` para obter a lista de arquivos alterados.
2. Para cada arquivo `.cs` alterado, chame `azure-devops_repo_file` com `action: "get_content"` usando o `version` igual ao commit da branch fonte (head commit do PR) para obter o conteúdo completo do arquivo.
3. Se houver muitos arquivos (mais de 15), priorize arquivos `.cs` e ignore arquivos de configuração, props, csproj, json, xml, a menos que o usuário solicite revisão completa.

### Fase 3 — Revisão

Para **cada arquivo `.cs` alterado**, faça **duas camadas de análise**:

1. **Regras da Sky** — valide contra as regras carregadas (checklist abaixo).
2. **Revisão geral do OpenCode (`/review`)** — além das regras da Sky, aplique a análise genérica de revisão de código do OpenCode (ativa as skills `ponytail-review` e/ou `caveman-review`). Procure por **bugs**, falhas de lógica, problemas de segurança/validação de entrada, riscos de corrida/raça, erros engolidos, tratamento de exceções, performance, e **over-engineering** (abstrações especulativas, código desnecessário, reinvenção de stdlib). Os achados desta camada entram na mesma tabela da Fase 4, com a regra violada descrita conforme o achado (ex.: `Bug`, `Risco`, `Over-engineering`, `Nit`).

> A camada `/review` complementa o checklist da Sky: enquanto o checklist valida **conformidade com as convenções** (nomenclatura, estrutura, MediatR, camadas), o `/review` valida **correção e simplicidade** (bugs de lógica, segurança, complexidade desnecessária). As duas camadas são independentes e os resultados são consolidados juntos.

**Checklist de validação (regras da Sky):**

| Categoria | O que verificar |
|---|---|
| **Nomenclatura** | Classes PascalCase pt-BR, métodos no infinitivo impessoal, verbos canônicos (Obter/Listar/Adicionar/Atualizar/Remover/Validar), interfaces com `I` + PascalCase, campos privados camelCase com `private readonly` |
| **Organização de arquivos** | Uma classe por arquivo, usings na ordem (sistema → terceiros → projeto), namespace file-scoped, pasta correta conforme camada |
| **Padrões MediatR** | Comando herda `Comando<T>` com `[Validador]`, Handler herda `ComandoHandlerAutoValidador` e implementa `IRequestHandler`, validação como primeira ação retornando `default` |
| **Validadores** | Sempre `internal`, herda `Validador<T>`, regras no construtor, mensagens em pt-BR |
| **Repositórios** | Herda `RepositorioBase<T>` ou `RepositorioEntidadeOrganizacao<T>`, override dos métodos corretos, interface declarada no domínio |
| **Controllers** | Finos (orquestração apenas), sem regra de negócio, preferir classes genéricas base, primary constructor em arquivos novos |
| **Tratamento de erros** | Nunca lançar exceções no domínio, usar `IValidadorDominio.NotificarErroValidacao`, retornar `default` em handlers |
| **Null handling** | `is not null` / `is null` preferido, pattern matching com atribuição, retornar `default` não `null` |
| **Async/CancellationToken** | Todos os métodos de repositório/handler/controller são async, CancellationToken sempre propagado |
| **Enums** | Valores em pt-BR PascalCase, sem números explícitos, pasta `Enumerados/` |
| **Comentários** | Não comentar código autoexplicativo, XML doc apenas em interfaces públicas não autoexplicativas |
| **Expression-bodied** | Usar quando corpo tem única expressão |
| **Acesso** | Campos `private readonly`, validadores `internal`, controllers `public`, base `protected virtual/override` |
| **SOLID** | Responsabilidade única, inversão de dependência (domínio não depende de infra), segregação de interfaces |
| **Arquitetura** | Dependência flui de cima para baixo (Servico → Aplicacao → Dominio), regra de negócio no Dominio, orquestração na borda |
| **DRY** | Código duplicado, lógica repetida que deveria estar em base compartilhada |
| **KISS/YAGNI** | Superengenharia, abstrações especulativas, camadas desnecessárias |
| **Usings não utilizadas** | Identificar `using` declarados cujo namespace não é referenciado no corpo do arquivo. Verificar se o namespace da using aparece como tipo, atributo, extensão, herança ou chamada estática no código. Se não aparecer, a using deve ser removida. Cuidado com: `using static` (verificar membros estáticos importados), `using` com alias (verificar uso do alias), e namespaces implícitos do global usings (não marcar como não utilizada se for um global using do projeto). |
| **Complexidade** | Métodos com mais de 20 linhas (decompor), mais de 7 parâmetros em construtores/métodos (agrupar em DTO/objeto de valor), métodos que fazem mais de uma coisa (violação de SRP). |

### Fase 4 — Validação e ajustes

Apresente **todos os problemas de uma vez** em tabela. Se não houver problemas, informe "Nenhuma violação encontrada" e encerre.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Revisão — PR !{numero}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| # | Arquivo | Linha | Regra violada | Código atual | Sugestão |
|---|---------|-------|---------------|--------------|----------|
| 1 | `Arquivo.cs` | 42 | Acesso (validadores devem ser `internal`) | `public class FooValidador` | `internal class FooValidador` |
| 2 | `Bar.cs` | 10 | Complexidade (método > 20 linhas) | `public async Task Foo() { ... }` | Decompor em métodos menores |
| X | ... | ... | ... | ... | ... |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Regras da tabela:**
- Cada linha é um problema: número, caminho do arquivo, linha, regra violada, código atual, sugestão
- "Código atual" = trecho exato que viola a regra (com número da linha)
- "Sugestão" = código corrigido — **apenas mudanças cosméticas** (nome, formatação, usings, visibilidade), **nunca alterar a lógica**
- **Exceção para achados da camada `/review`**: nas categorias `Bug`, `Risco` (segurança, corrida, erro engolido) e `Over-engineering`, a sugestão **pode** corrigir a lógica — é esse o propósito dessa camada. Sinalize esses itens explicitamente na coluna "Regra violada" (ex.: `Bug: user pode ser null`) para deixar claro que a correção altera comportamento.

**Após a tabela, pergunte:**

> Se quiser descartar ou editar algum item, cite o número. Caso contrário, deseja publicar os comentários no PR?

**Respostas aceitas:**

| Resposta | Ação |
|---|---|
| `não publique`, `n`, `nao` | Não publica — encerra |
| `publique`, `sim`, `s`, `pode ser` | Publica os itens não descartados (Fase 5) |
| `descartar: 1, 3` ou `remover: 2` | Remove os itens indicados — reapresenta tabela |
| `editar: 2 internal class BarValidador` | Atualiza a sugestão do item indicado — reapresenta tabela |

### Fase 5 — Publicação

**Somente após confirmação explícita**, para cada item autorizado, publique um comentário individual no PR usando `azure-devops_repo_pull_request_thread_write` com:

- `action: "create"`
- `repositoryId`: repositório do PR
- `pullRequestId`: número do PR
- `project`: projeto do Azure DevOps
- `filePath`: caminho do arquivo
- `rightFileStartLine`: linha do código (se disponível)
- `content` no formato:

```
**Revisão de código — Sky Informática**

**Regra violada:** [nome da regra/referência]

**Problema:**
[descrição do problema]

**Código atual:**
```csharp
[código original]
```

**Sugestão de ajuste:**
```csharp
[código corrigido (ou editado pelo usuário)]
```
```

**Após publicar todos os comentários:**
- Informe quantos comentários foram publicados
- Forneça o link direto para o PR no Azure DevOps

## Formato do link do PR

O link para o PR pode ser obtido do campo `url` retornado pela chamada `azure-devops_repo_pull_request` com `action: "get"`. O padrão é:
```
https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repoId}/pullRequests/{pullRequestId}
```
Ou acesse diretamente no Azure DevOps pelo número do PR.

## Notas importantes

- **Nunca publique comentários sem confirmação explícita do usuário.**
- Apresente todos os problemas de uma vez em tabela; o usuário descarta/edita por número.
- **Sugestões são somente cosméticas** (regras da Sky) — as correções devem respeitar integralmente a lógica existente do código. Nunca alterar: fluxo de execução, condições, return, try/catch, null checks, validações, sequência de operações, ou qualquer comportamento observável. Mudanças permitidas: renomear identificadores, reordenar usings, ajustar espaçamento/indentação, remover usings não utilizadas, mover código para método auxiliar (mantendo a mesma lógica), ajustar visibilidade de membros, converter para expression-bodied quando aplicável, e remover comentários desnecessários. **Exceção**: achados da camada `/review` classificados como `Bug`, `Risco` ou `Over-engineering` podem propor correção de lógica (ver Fase 3/Fase 4).
- Foque em `.cs` por padrão. Se o usuário pedir revisão de outros arquivos, valide padrões gerais (nomenclatura, DRY, SOLID).
- Se o PR não existir ou não estiver acessível, informe o usuário claramente.
- Se não houver problemas, informe: "Nenhuma violação encontrada nas regras de codificação .NET." e encerre.
