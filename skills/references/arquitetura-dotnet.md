# Estrutura e Aplicação dos Conceitos — SkyInfo.Core

Documento **estrutural**: descreve como este repositório está organizado —
camadas, tecnologias, divisão dos domínios e como os conceitos de
[principios.md](principios.md) são concretamente materializados aqui. Não é um
guia de codificação; para regras de implementação ver [regras-de-codificacao-dotnet.md]
(regras-de-codificacao-dotnet.md) e as decisões em `Documentos/DecisõesArquiteturais/`.

## Stack e tecnologias

- **Linguagem/plataforma**: .NET (C#), API ASP.NET Core (`Microsoft.NET.Sdk.Web`)
  e bibliotecas/DLLs (`Microsoft.NET.Sdk`).
- **Orquestração de casos de uso**: MediatR 12.x — comando/consulta roteados
  para manipuladores; a borda dispara, o domínio executa.
- **Persistência**: RavenDB (via pacotes `SkyInfo.Infra.Armazenamento.RavenDb`
  e abstrações `SkyInfo.Infra.Armazenamento.Abstracoes`).
- **Mensageria**: RabbitMQ (via `SkyInfo.Infra.Bus.RabbitMq`), com padrão de
  consumidores no domínio.
- **Validação**: FluentValidation (linguagem configurada para pt-BR pela
  aplicação).
- **Mapeamento**: AutoMapper.
- **Tempo**: NodaTime (tratamento híbrido de DateTime/timezone — ver
  `NodaTime.md` e `DateTime_Timezone.md` no core).
- **Logs**: Serilog.
- **Serialização**: Newtonsoft.Json.
- **Segredos/segurança**: Azure Key Vault
  (`SkyInfo.Infra.Segurança.AzureKeyVault`); autorização e manipulação de
  exceção via pacotes da Sky (`SkyInfo.Infra.Autorizacao.AspNetCore.Mvc`,
  `SkyInfo.Infra.Excecao.Manipulacao.AspNetCore.Mvc`).
- **DTOs regionais de infraestrutura**: pacotes `SkyInfo.Infra.*` (Sky)
  fornecem abstrações de armazenamento, barramento, domínio e validação, que
  os projetos do repositório consomem e estendem.

> Os nomes de namespace e de pacotes são com acentuação quando a convenção
> interna define (ex.: `SkyInfo.Infra.Domínio.Bus.Abstrações`), preservando a
> regra de nomenclatura pt-BR do domínio.

## Camadas

O código é dividido em quatro camadas, em ordem de dependência (a camada
superior depende das inferiores, nunca o contrário):

```
src/
├── Dominio/          Regras de negócio e invariantes (DLLs reutilizáveis).
├── Aplicacao/        Orquestração de casos de uso e composição de domínios.
├── Infraestrutura/   Persistência, integrações e detalhes técnicos.
└── Servico/          Interfaces de entrega (API, mensageria, workers).
```

### `src/Dominio` — o coração do sistema

Contém os **contextos de negócio** e o **núcleo compartilhado**. A regra de
negócio vive aqui e não conhece camada inferior.

- **Contextos**: `Cartorio/`, `Financeiro/`, `Agente/`, `Geral/`,
  `GeralOrganizacao/`, além de domínios transversais (`Autenticacao`, `Token`,
  `Relatórios`).
- **Núcleo compartilhado** `SkyInfo.Core.Dominio` ("core"): fornece a todos os
  domínios a linguagem de **Organização e Usuário**, a base dos manipuladores
  de comando, dos repositórios, do vínculo com organização, dos DTOs, do
  contrato de registro único e de requisição de contexto. É o conceito DDD de
  *núcleo compartilhado* + *domínio principal* (ver `readme.md` do core).
- **Infraestrutura de domínio** `src/Dominio/Infraestrutura/`: extensões e
  utilidades pequenas (`Caminho`, `Configuracao`, `String`) usadas **dentro**
  do contexto de domínio — não é a camada de infraestrutura do sistema.

### `src/Aplicacao` — orquestração

- Compõe casos de uso a partir do domínio, sem conter a regra de negócio.
- Contém a **Composition Root** (`InjecaoDependencia/`) e a configuração do
  domínio (`ConfiguracaoDominio.cs` — define a cultura do FluentValidation,
  ex.: `ValidatorOptions.LanguageManager.Culture = Cultura.Brasil`).
- Projetos: `SkyInfo.Core.Aplicacao` (principal),
  `SkyInfo.Core.Aplicacao.Armazenamento` (DAO/RavenDB),
  `SkyInfo.Core.Aplicacao.Mensageria`, `SkyInfo.Core.Aplicacao.Monolito`.

### `src/Infraestrutura` — detalhes técnicos

- Implementa **persistência e integrações** que o domínio apenas declara por
  interface: `RavenDb/`, `Mensageria/`, `Criptografia/`, `Json/`, `Xml/`,
  `ManipulaçãoDeCertificados/`, `Segredos/`, `Cultura/`, `ServiçosDeBackground/`,
  etc.

### `src/Servico` — interfaces de entrega

- Camada mais externa, apenas **orquestra e entrega**: API monolítica,
  consumidores/workers de mensageria e a base `SkyInfo.Core.Servico`.
- `Controllers/` espelham os contextos (`Cartorio/`, `Financeiro/`, `Agente/`,
  `Geral/`, `GeralOrganizacao/`, `Autenticacao/`, `Administrativo/`,
  `OrganizacaoUsuario/`) e **não contém regra de negócio**.

## Organização dos domínios

Cada contexto de negócio é **segmentado por agregado** em pastas e projetos
próprios, com nome no padrão `SkyInfo.Core.Dominio.<Contexto>[.<Agregado>]`.

Estrutura ilustrativa (ex.: `Cartorio`):

```
Dominio/Cartorio/
├── Livros/
│   ├── LivroDeProtocolos/
│   │   └── SkyInfo.Core.Dominio.Cartorio.Livros.LivroDeProtocolos.Pr/
│   ├── LivroDoDistribuidor/
│   │   └── SkyInfo.Core.Dominio.Cartorio.Livros.LivroDoDistribuidor.Pr/
│   └── SkyInfo.Core.Dominio.Cartorio.Livros/
├── SeloDigital/
│   ├── SkyInfo.Core.Dominio.Cartorio.SeloDigital/
│   ├── SkyInfo.Core.Dominio.Cartorio.SeloDigital.Rs/
│   └── SkyInfo.Core.Dominio.Cartorio.SeloDigital.Rs.Compartilhado/
├── SkyInfo.Core.Dominio.Cartorio/
└── ...
```

Regras de organização:

- **Variação regional** (`Rs`, `Pr`, ...) é a variação da regra de negócio por
  estado/regional — um **subdomínio próprio** com projeto próprio, não um `if`
  no domínio base.
- **Projetos compostos/compartilhados** (`.Compartilhado`) reúnem o que é
  comum entre variantes de um mesmo agregado.
- O nome completo do projeto carrega o caminho do contexto → agregado → variante,
  o que torna o grafo de dependência explícito.
- Cada edição regional refere-se ao **cartório base** (`SkyInfo.Core.Dominio.Cartorio`)
  e a outros domínios que precise (ex.: `SeloDigital.Rs` depende de
  `Geral.Arquivos`, `PrestaçãoDeContas`, `Agente`), mas nunca o contrário.

## Como o MediatR é definido neste projeto

O MediatR é o **orquestrador de casos de uso**. Sua definição concreta:

- O `IMediatorHandler` (barramento do domínio) centraliza o envio de
  comandos, consultas e eventos; os repositórios publicam eventos de domínio
  (`AdicionadoObjetoEvento`, `AtualizadoObjetoEvento`, `RemovidoObjetoEvento`)
  por ele.
- O core fornece **manipuladores base** (`ComandosHandlers/`, ex.:
  `ComandoCrudBaseHandler`) para casos de uso CRUD com retorno padronizado —
  `IId` no adicionar, `IAtualizarComandoRetorno` no atualizar e
  `IRemoverComandoRetorno` no remover (ver `readme.md` do core).
- A borda (`Controller`) envia um comando/consulta; o **manipulador** resolvido
  executa o caso de uso no domínio: valida (FluentValidation), lê via
  repositório, aplica a regra, persiste e publica eventos.

## Organização (vínculo multi-tenant)

O núcleo com o vínculo com **organização**:

- O core `SkyInfo.Core.Dominio` não conhece entidade de Organização/Usuário,
  mas conhece a **nomenclatura** e fornece DTOs simples (`Organizacao`,
  `OrganizacaoId`, `OrganizacaoNome`, `Usuario`, `UsuarioId`) para não criar
  dependência com os domínios que os controlam.
- **`IIdOrganizacao`**: contrato que indica que a entidade/DTO pertence a uma
  organização; expõe `Organizacao` (`OrganizacaoId`).
- **`EntidadeOrganizacao`** (`Entidades/`): base para entidades com vínculo.
- **`IRequisicaoContexto`**: provê organização/usuário correntes; populado na
  borda (ex.: autenticação via token) e consumido pelos repositórios para
  **isolar automaticamente os dados por organização**.

## Repositórios

Herdam de bases do core e encapsulam acesso a dados + publicação de eventos:

- **`RepositorioBase<TEntidade>`**: sobre `RepositorioAsync`, integra `IDao`,
  `IMediatorHandler`, `IValidadorDominio` e configurações regionais; padroniza
  conversão `DateTime → UTC` e publicação dos eventos de adicionar/atualizar/
  remover.
- **`RepositorioEntidadeOrganizacao<TEntidade>`**: deriva da base e adiciona
  o **isolamento por organização** — preenche `Organizacao` da
  `IRequisicaoContexto` e filtra as consultas pela organização corrente.
- **Registro único** (`Repositorio/RegistroUnico/`): variantes para **1:1** ou
  **valor único por organização**
  (`RepositorioEntidadeOrganizacaoComRegistroUmParaUm`,
  `RepositorioEntidadeOrganizacaoComRegistroUnicoParaAOrganizacao`, etc.).

O domínio **declara** a interface; a infraestrutura/aplicação de
armazenamento **implementa**; a composição **injeta**.

## Serviços

- **Serviços de domínio** (em `Dominio/`): operações que não pertencem
  naturalmente a uma entidade; decompõem casos de uso, mantendo a regra no
  domínio.
- **Serviços de aplicação** (em `Aplicacao/`): orquestram composição de casos
  de uso.
- **Serviços de entrega** (`src/Servico`): fronteiras executáveis
  (API, consumidores, workers); apenas orquestram, sem regra de negócio.

## DTOs

- **DTOs de Organização/Usuário** (`Dominio/SkyInfo.Core.Dominio/Dtos/`):
  estruturas simples do core para os domínios conversarem sobre organização/
  usuário sem depender das entidades que os controlam.
- **DTOs de consulta/transporte**: quando a persistência difere da consulta ou
  é necessário reunir dados de vários domínios, usa-se DTO/entidade de
  consulta própria (padrões 3.4.1 e 3.4.2 de `SolucoesPadroes.md`).
- DTOs com vínculo de organização implementam `IIdOrganizacao`.

## Como os conceitos de principios.md se aplicam aqui

| Conceito (principios.md) | Materialização no projeto |
|---|---|
| **Library First** | Todo caso de uso nasce como DLL em `Dominio/` ou `Aplicacao/`; a camada `Servico` (API, workers) apenas orquestra e consome. |
| **DDD** | Regras de negócio no `Dominio/`; contexto por domínio, agrupado por agregado; variação regional como subdomínio; núcleo compartilhado `SkyInfo.Core.Dominio`. |
| **DRY** | Reprocesso via bases compartilhadas: `RepositorioBase`/`RepositorioEntidadeOrganizacao`, manipuladores base do core, DTOs e contratos comuns (`IIdOrganizacao`, registro único). |
| **SOLID** | Interface declarada no domínio, implementada na infra; `IRequisicaoContexto` e `IMediatorHandler` invertem dependências; dependência flui só para baixo nas camadas. |
| **KISS / YAGNI** | Padrões estabelecidos (MediatR, repositórios base, FluentValidation) têm precedência; subdomínio regional evita condicionais difusos; sem camadas especulativas. |
| **Clean Code** | Nomenclatura pt-BR no domínio; os `readme.md` de cada domínio descrevem conceito e expansão (ver `readme.md` do core e dos agregados). |
| **Tipagem forte e contratos** | Enums e DTOs tipados; `IIdOrganizacao`/`IId` como contratos; FluentValidation na borda do caso de uso via `IValidadorDominio`. |
| **Segurança e confiabilidade** | Segredos via Azure Key Vault; isolamento multi-tenant por organização garantido pelos repositórios; tempo normalizado para UTC; manipulação de exceção na borda via pacote da Sky. |

Pontos de decisão arquitetural relevantes (em `Documentos/DecisõesArquiteturais/`):
`SolucoesPadroes.md` (comunicação entre domínios e modelagem de dados),
`RegistroUnico.md` (identificação única), `LimitaçõesDoRavenDB.md`,
`PadrãoDeComparaçãoNula.md`.

## Governança

Este documento é a referência estrutural do repositório. Alterações na
organização dos domínios, nas camadas ou no uso das tecnologias devem ser
registradas de forma rastreável e revisadas explicitamente antes de integrar,
sempre subordinadas aos princípios inegociáveis de [principios.md]
(principios.md).