# Princípios de engenharia — Sky Informática

## Biblioteca primeiro (Library First)

Todo código novo nasce como módulo reutilizável (biblioteca interna) antes de virar endpoint/job/worker/UI/CLI ou qualquer outra forma de entrega. Interfaces de entrega orquestram e consomem bibliotecas; regra de negócio fica isolada e reutilizável, sem duplicação nas bordas.

- Preferir unidades pequenas e coesas, com API explícita (funções/classes bem tipadas).
- A biblioteca deve ser testável de forma isolada e ter responsabilidades claras.

## Clean code e português brasileiro (pt-BR)

- Nomear entidades, funções, classes, variáveis e constantes em pt-BR, com intenção explícita.
- Respostas, documentação e mensagens de erro em pt-BR, claras e diretas; explicar conceitos técnicos quando necessário e evitar jargões desnecessários.
- Evitar comentários por padrão; preferir nomes autoexplicativos. Documentação inline em pt-BR apenas para unidades não triviais.
- Funções curtas, baixo acoplamento e retornos antecipados para reduzir aninhamento.

## Nomenclatura orientada ao domínio

Nomes de funções, métodos, classes, arquivos e variáveis devem expressar a intenção de domínio, não detalhes internos de implementação, transporte, infraestrutura, tratamento de exceções, persistência, retry ou forma de consulta. A convenção de caixa (snake_case, camelCase, PascalCase) é definida por projeto, nas skills específicas da linguagem; os exemplos abaixo usam snake_case apenas como ilustração.

- Nomear pela ação e pelo significado no domínio: `obter_checklist`, `listar_checklists_ativos`, `calcular_saldo_mensal`, `emitir_token_serventia`.
- Funções e métodos sempre no infinitivo impessoal, com verbos canônicos e estáveis no projeto (`obter`, `executar`, `definir`, `calcular`, `escrever`, `listar`, `validar`, `importar`, `remover`); sem flexões, tempos verbais ou formas coloquiais.
- Getters/setters: sempre `obter` e `definir`. Nunca `pegar`, `setar`, `get`, `set` ou variações.
- Não nomear pelo efeito colateral técnico ou detalhe de borda: evitar `obter_checklist_ou_404`, `buscar_usuario_raise_403`, `salvar_com_retry`, `listar_serventias_com_join`, `processar_em_background`. Exceções, logs, `commit`, `flush`, cache, fallback e retry pertencem ao corpo da implementação, não ao nome.
- Variantes da mesma ação se diferenciam pelo contexto de negócio, não pelo mecanismo técnico: `obter_checklist`, `obter_checklist_ativo`, `obter_checklist_por_identificador`.
- Sufixos e prefixos só quando representam distinção semântica real de domínio; se o termo não ajuda a explicar a regra de negócio para um humano do projeto, não entra no nome.
- Revisões devem bloquear nomes que exponham detalhes internos sem valor de domínio, mesmo com comportamento técnico correto.

## Reuso e zero duplicação (DRY)

Código duplicado é bug futuro e é proibido como padrão. Regra usada em mais de um lugar existe em um único ponto de verdade.

- Antes de criar algo novo, procurar utilitários/abstrações existentes e reaproveitar.
- Centralizar normalizações, validações e mapeamentos em utilitários compartilhados.
- Em interfaces de usuário, extrair padrões repetidos em componentes reutilizáveis e/ou abstrações de composição.
- Evitar obsessão por primitivos: quando fizer sentido, criar tipos/DTOs/Enums para dar semântica e reduzir erros.

## Tipagem forte, enums e contratos

- Para listas fechadas (status, tipos, modos), usar `Enum`/enums dedicados; não usar strings soltas. Quando a linguagem não oferecer enum nativo, usar o equivalente mais forte disponível (union types, constantes agrupadas em estrutura imutável); strings soltas continuam proibidas.
- Contratos explícitos, validados na borda do sistema (entrada e saída) e propagados de forma tipada internamente.
- Mudanças de contrato exigem atualização coordenada (consumidores, testes e documentação).

## SOLID (design por responsabilidades)

Em paradigmas não orientados a objetos (frontends funcionais, módulos procedurais), os mesmos princípios se aplicam via composição e contratos explícitos (props, assinaturas de funções, módulos).

- Responsabilidade única: cada unidade tem um motivo principal para mudar (orquestração, regra de negócio, persistência, integrações externas, etc.).
- Aberto/fechado: preferir extensão por composição em vez de editar muitos pontos do fluxo.
- Substituição de Liskov: subtipos substituíveis sem quebrar invariantes; comportamento compatível com o contrato.
- Segregação de interfaces: contratos pequenos e focados por caso de uso; evitar "interfaces gigantes".
- Inversão de dependência: regra de negócio não depende de infraestrutura; encapsular I/O e integrações em adaptadores.

## KISS e YAGNI

- Soluções simples, claras e com propósito; evitar superengenharia.
- Evitar otimização prematura: medir antes e documentar a motivação quando necessário.
- Preferir padrões já estabelecidos no projeto antes de criar novos.
- Minimizar dependências externas; adicionar biblioteca apenas quando houver ganho claro frente ao custo de manutenção.
- Não criar camadas abstratas "só por via das dúvidas" nem funcionalidades especulativas; flexibilidade apenas com caso de uso real.

## Comportamento ao programar

Antes de implementar, expor o raciocínio em vez de presumir.

- Declarar as premissas explicitamente; diante de incerteza ou ambiguidade relevante, perguntar antes de codar.
- Se houver mais de uma interpretação válida, apresentá-las; não escolher uma silenciosamente.
- Se existir abordagem mais simples, dizer e contestar quando for justificado.
- Antes de entregar, aplicar o autocheck de simplicidade (KISS/YAGNI): se a solução tem muito mais código do que o problema exige, reescrever menor.

## Segurança e confiabilidade

- Não commitar segredos e não vazar dados sensíveis em logs.
- Princípio do menor privilégio, validação de entrada e saneamento de dados são obrigatórios.
- Tratar erros com mensagens objetivas; manter logs neutros para serviços externos.
- Preferir mudanças pequenas, locais e testáveis; justificar complexidade quando inevitável.

## Governança

- Estes princípios prevalecem sobre templates, hábitos e decisões locais.
- Mudanças nestes princípios exigem revisão explícita (humana ou por agente) e registro rastreável (issue/tarefa) antes de integrar na main.
- Refatoração por substituição: ao refatorar para mudar comportamento, a lógica antiga é removida e o código novo é a única fonte de verdade; em caso de dúvida, perguntar antes de preservar comportamento legado. Convivência entre lógicas (velha e nova) só quando solicitado explicitamente.
- Revisões devem bloquear mudanças que: duplicam código; introduzem constantes soltas onde caberia Enum; misturam orquestração com regra de negócio; vazam segredos ou dados sensíveis; quebram contratos sem atualização coordenada.
- Mudanças cirúrgicas: tocar apenas no necessário; cada linha alterada deve rastrear diretamente ao pedido. Não "melhorar" código, comentários ou formatação adjacentes não solicitados, nem refatorar o que não está quebrado por iniciativa própria — refatoração só quando solicitada.
- Remover apenas os órfãos que a própria mudança criou (imports/variáveis/funções que ela tornou inúteis); código morto preexistente deve ser mencionado com sugestão de remoção, não removido sem solicitação.
