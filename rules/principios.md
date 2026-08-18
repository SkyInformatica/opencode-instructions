---
description: "Princípios inegociáveis (sempre): Library First, DRY, SOLID, KISS, YAGNI, Clean Code, contratos e segurança."
alwaysApply: true
---

# Princípios de engenharia — Sky Informática

## Princípios essenciais (sempre)

- Library First: regra de negócio nasce como biblioteca interna reutilizável antes de virar qualquer interface de entrega.
- DRY: uma regra em um único ponto de verdade; sem duplicação.
- SOLID: responsabilidades claras, baixo acoplamento e dependências invertidas; contratos explícitos.
- KISS: soluções diretas, legíveis, sem superengenharia.
- YAGNI: sem “só por via das dúvidas”; flexibilidade só com caso de uso real.
- Clean Code: nomes claros, baixo acoplamento, funções curtas, sem comentários por padrão.
- Contratos e tipagem forte: contratos explícitos, tipos/enumerações para listas fechadas, evitar valores soltos.
- Segurança e confiabilidade: menor privilégio, validação de entrada, sem vazamento de segredos/dados sensíveis.

## Biblioteca primeiro (Library First)

Todo código novo deve nascer como módulo reutilizável (biblioteca interna) antes de virar endpoint/job/worker/UI/CLI (ou qualquer outra forma de entrega). Interfaces de entrega devem orquestrar; regra de negócio deve estar isolada e reutilizável.

- Preferir unidades pequenas e coesas, com API explícita (funções/classes bem tipadas).
- A biblioteca deve ser testável de forma isolada e ter responsabilidades claras.
- Interfaces de entrega consomem bibliotecas; não duplicam lógica.

## Clean code e português brasileiro (pt-BR)

- Nomear entidades, funções, classes, variáveis e constantes em pt-BR, com intenção explícita.
- Respostas, documentação e mensagens de erro devem ser em pt-BR, claras e diretas; explicar conceitos técnicos quando necessário e evitar jargões desnecessários.
- Evitar comentários por padrão; preferir nomes autoexplicativos. Documentação inline em pt-BR apenas para unidades não triviais.
- Manter funções curtas, baixo acoplamento e retornos antecipados para reduzir aninhamento.

## Nomenclatura orientada ao domínio

Nomes de funções, métodos, classes, arquivos e variáveis devem expressar a intenção de domínio do que fazem, e não detalhes internos de implementação, transporte, infraestrutura, tratamento de exceções, mecanismo de persistência, estratégia de retry ou forma de consulta.

Os exemplos abaixo usam snake_case apenas como ilustração. A convenção de caixa (snake_case, camelCase, PascalCase) é definida por projeto, nas skills específicas da linguagem (PHP, Java, .NET, Delphi, Python, Node.js etc.).

- Nomear pela ação e pelo significado no domínio: `obter_checklist`, `listar_checklists_ativos`, `calcular_saldo_mensal`, `emitir_token_serventia`.
- Funções e métodos devem ser nomeados sempre no infinitivo impessoal, representando a ação de domínio esperada: `obter`, `executar`, `definir`, `calcular`, `escrever`, `listar`, `validar`, `importar`, `remover`.
- Evitar tempos verbais, flexões ou formas coloquiais fora desse padrão. O nome deve soar como uma ação canônica de domínio, e não como comando informal, apelido técnico ou verbo improvisado.
- Para operações do tipo getter/setter, usar sempre `obter` e `definir`. Nunca usar `pegar`, `setar`, `get`, `set` ou variações equivalentes.
- Preferir verbos canônicos e semanticamente estáveis no projeto. Se dois nomes competirem, escolher o mais claro para o domínio e o mais consistente com o restante do código.
- Não nomear pelo efeito colateral técnico, pela exceção lançada ou pelo detalhe da borda: evitar nomes como `obter_checklist_ou_404`, `buscar_usuario_raise_403`, `salvar_com_retry`, `listar_serventias_com_join`, `processar_em_background`.
- Quando a falha faz parte do comportamento esperado da camada, isso continua implícito e não entra no nome. Exceções, logs, `commit`, `flush`, cache, fallback, retry e outros detalhes operacionais devem aparecer no corpo da implementação, não na assinatura nominal.
- Se houver mais de uma variante real de domínio para a mesma ação, diferenciar pelo contexto de negócio e não pelo mecanismo técnico: `obter_checklist`, `obter_checklist_ativo`, `obter_checklist_por_identificador`.
- Sufixos e prefixos só são aceitáveis quando representam uma distinção semântica real do domínio. Se o termo não ajuda a explicar a regra de negócio para um humano do projeto, ele não deve estar no nome.
- Revisões devem bloquear nomes que exponham detalhes internos sem valor semântico de domínio, mesmo quando o comportamento técnico estiver correto.

## Reuso e zero duplicação (DRY)

Código duplicado é bug futuro e é proibido como padrão.

- Antes de criar algo novo, procurar utilitários/abstrações existentes e reaproveitar.
- Centralizar normalizações, validações e mapeamentos em utilitários compartilhados.
- Se uma regra é usada em mais de um lugar, ela deve existir em um único ponto de verdade.
- Em interfaces de usuário, extrair padrões repetidos em componentes reutilizáveis e/ou abstrações de composição; evitar duplicar lógica de integração/normalização.
- Evitar obsessão por primitivos: quando fizer sentido, criar tipos/DTOs/Enums para dar semântica e reduzir erros.

## Tipagem forte, enums e contratos

Valores constantes tipados devem ser declarados como Enums; contratos devem ser explícitos.

- Para listas fechadas (status, tipos, modos), usar `Enum`/enums dedicados; não usar strings soltas.
- Contratos devem ser validados na borda do sistema (entrada e saída) e propagados de forma tipada internamente.
- Mudanças de contrato exigem atualização coordenada (consumidores, testes e documentação).

## SOLID (design por responsabilidades)

- Responsabilidade única: cada unidade deve ter um motivo principal para mudar (orquestração, regra de negócio, persistência, integrações externas, etc.).
- Aberto/fechado: preferir extensão por composição em vez de editar muitos pontos do fluxo.
- Substituição de Liskov: subtipos devem ser substituíveis sem quebrar invariantes; manter comportamento compatível com o contrato.
- Segregação de interfaces: evitar “interfaces gigantes”; preferir contratos pequenos e focados por caso de uso.
- Inversão de dependência: regras de negócio não devem depender de detalhes de infraestrutura; encapsular I/O e integrações em adaptadores.

## KISS (simplicidade deliberada)

- Manter soluções simples, claras e com propósito; evitar superengenharia.
- Evitar otimização prematura: medir antes e documentar a motivação quando necessário.
- Preferir padrões já estabelecidos no projeto antes de criar novos.
- Minimizar dependências externas; adicionar biblioteca apenas quando houver ganho claro frente ao custo de manutenção.

## YAGNI (você não vai precisar disso)

- Não criar camadas abstratas “só por via das dúvidas”; introduzir flexibilidade apenas com caso de uso real.
- Evitar funcionalidades especulativas; implementar apenas o necessário no momento.

## Comportamento ao programar

Antes de implementar, expor o raciocínio em vez de presumir.

- Declarar as premissas explicitamente; diante de incerteza ou ambiguidade relevante, perguntar antes de codar.
- Se houver mais de uma interpretação válida, apresentá-las; não escolher uma silenciosamente.
- Se existir abordagem mais simples, dizer e contestar quando for justificado.
- Antes de entregar, aplicar o autocheck de simplicidade (KISS/YAGNI): se a solução tem muito mais código do que o problema exige, reescrever menor.

## Segurança, confiabilidade e simplicidade

Segurança e previsibilidade são requisitos; simplicidade é a estratégia padrão.

- Não commitar segredos e não vazar dados sensíveis em logs.
- Princípio do menor privilégio, validação de entrada e saneamento de dados são obrigatórios.
- Tratar erros com mensagens objetivas; manter logs neutros para serviços externos.
- Preferir mudanças pequenas, locais e testáveis; justificar complexidade quando inevitável.
- Otimização apenas quando necessário: medir antes e documentar a motivação.

## Governança

- Estes princípios prevalecem sobre templates, hábitos e decisões locais.
- Mudanças nestes princípios exigem revisão explícita (humana ou por agente) e registro rastreável (issue/tarefa) antes de integrar na main.
- Refatoração por substituição: ao solicitar refatoração para mudar comportamento, assumir que a lógica antiga será removida e o código novo será a única fonte de verdade; em caso de dúvida, perguntar antes de preservar comportamento legado. Convivência entre lógicas (velha e nova) só quando solicitado explicitamente.
- Revisões devem bloquear mudanças que:
  - duplicam código,
  - introduzem constantes soltas onde caberia Enum,
  - misturam orquestração com regra de negócio (violação de camadas),
  - vazam segredos ou dados sensíveis,
  - quebram contratos sem atualização coordenada (consumidores, testes e documentação).
- Mudanças cirúrgicas: tocar apenas no necessário; cada linha alterada deve rastrear diretamente ao pedido. Não "melhorar" código, comentários ou formatação adjacentes não solicitados, nem refatorar o que não está quebrado por iniciativa própria — refatoração só quando solicitada (ver Refatoração por substituição).
- Remover apenas os órfãos que a própria mudança criou (imports/variáveis/funções que ela tornou inúteis); código morto preexistente deve ser mencionado e sugerir a remoção, não removido sem solicitação.
