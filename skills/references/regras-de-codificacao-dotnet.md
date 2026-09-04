# Regras de Codificação — .NET

Guia de **implementação**: como escrever código neste repositório. Para a
estrutura do projeto (camadas, domínios, tecnologias) ver
[arquitetura-dotnet.md](arquitetura-dotnet.md); para os princípios
gerais ver [principios.md](principios.md).

## Nomenclatura

Todas as identificadores são em **pt-BR**, no estilo indicado abaixo.

| Elemento | Estilo | Exemplo |
|---|---|---|
| Classe / struct | PascalCase | `SenhaDoUsuarioRepositorio`, `AutenticarComando` |
| Método | PascalCase, infinitivo impessoal | `ObterAPartirDoEmailAsync`, `NotificarErroValidacao` |
| Propriedade | PascalCase | `FusoHorárioDaOrganização`, `RetornarDataEHoraApenasEmUtc` |
| Variável / parâmetro | camelCase | `usuarioRepositorio`, `configuracaoBCrypt` |
| Campo privado | camelCase, `private readonly` | `private readonly IValidadorDominio validadorDominio;` |
| Constante | PascalCase, `private const` | `MensagemDeErroValidaçãoDasCredenciais` |
| Campo estático | PascalCase | `public static CultureInfo Brasil { get; }` |
| Enum (tipo) | PascalCase | `TipoDeEncerramento`, `TiposDeCampo` |
| Enum (valor) | PascalCase | `Mensal`, `PorMáximoDeFolhas`, `Simples` |
| Interface | `I` + PascalCase pt-BR | `IRequisicaoContexto`, `IIdOrganizacao` |

### Verbos canônicos

Usar sempre no infinitivo impessoal. Variações da mesma ação se diferenciam
pelo contexto de negócio, não pelo mecanismo técnico.

| Ação | Usar | Evitar |
|---|---|---|
| Buscar algo | `Obter...`, `Listar...` | `Buscar...`, `Pegar...`, `Get...` |
| Criar | `Adicionar...`, `Criar...` | `Inserir...`, `Salvar...` (salvar é Update) |
| Atualizar | `Atualizar...` | `Setar...`, `Modificar...` |
| Remover | `Remover...` | `Deletar...`, `Apagar...` |
| Validar | `Validar...` | `Checar...`, `Verificar...` |
| Notificar erro | `NotificarErro...` | `Lançar...`, `Throw...` |

### Sufixos por tipo

| Tipo | Sufixo | Exemplo |
|---|---|---|
| Comando MediatR | `Comando` | `AutenticarComando` |
| Handler de comando | `ComandoHandler` | `AutenticacaoComandoHandler` |
| Validador | `Validador` | `AutenticarValidador` |
| Repositório | `Repositorio` | `SenhaDoUsuarioRepositorio` |
| Controller | `Controller` | `OrganizacoesController` |
| Serviço de domínio | `Servico` | `GeradorTokenAutenticacao` |

## Organização de arquivos

### Estrutura padrão

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace SkyInfo.Core.Dominio.Autenticacao.ComandosHandlers;

public class AutenticacaoComandoHandler : ComandoHandlerAutoValidador,
    IRequestHandler<AutenticarComando, IEnumerable<TokenOrganizacao>>
{
}
```

1. Usings do sistema
2. Usings de terceiros
3. Usings do projeto
4. Namespace (file-scoped preferido; block-scoped aceito em arquivos antigos)
5. Declaração da classe

### Uma classe por arquivo

Exceção: validadores pequenos e relacionados podem compartilhar arquivo
(ex.: `RedefinirSenhaUsuarioValidador.cs` com `ConfirmarRedefinicaoSenhaUsuarioValidador`).

### Pasta do arquivo

| Camada | Localização |
|---|---|
| Comando | `ComandosHandlers/Comandos/` dentro do domínio |
| Handler | `ComandosHandlers/` dentro do domínio |
| Validador | `ComandosHandlers/Comandos/Validadores/` |
| Repositório | `Usuario/`, `Conta/` etc. (pasta do agregado) ou `Repositorio/` |
| Controller | `Controllers/<Contexto>/` na camada `Servico` |
| Enum | `Enumerados/` ou `Enumerado/` dentro do domínio |
| DTO | `Dtos/` ou junto à entidade |

## Padrões MediatR

### Comando

```csharp
[Validador(typeof(AutenticarValidador))]
public class AutenticarComando : Comando<IEnumerable<TokenOrganizacao>>
{
    public Contato Email { get; set; }
    public string Senha { get; set; }
}
```

- Herdar de `Comando<TResposta>`
- Vincular validador via atributo `[Validador(typeof(...))]`
- Propriedades são dados de entrada, sem lógica

### Handler

```csharp
public class AutenticacaoComandoHandler : ComandoHandlerAutoValidador,
    IRequestHandler<AutenticarComando, IEnumerable<TokenOrganizacao>>
{
    public async Task<IEnumerable<TokenOrganizacao>> Handle(
        AutenticarComando request, CancellationToken cancellationToken)
    {
        if (!await ValidarAsync(request, cancellationToken))
            return default;

        // lógica de negócio...
    }
}
```

- Herdar de `ComandoHandlerAutoValidador`
- Implementar `IRequestHandler<TComando, TResposta>`
- **Primeira ação**: validar e retornar `default` em caso de falha
- Um handler pode implementar múltiplos `IRequestHandler` para comandos
  relacionados

### Validador

```csharp
internal class AutenticarValidador : Validador<AutenticarComando>
{
    public AutenticarValidador()
    {
        RuleFor(x => x.Email).NotNull();
        RuleFor(x => x.Email.TipoContato)
            .Equal(TipoContato.Email)
            .When(x => x.Email is not null);
        RuleFor(x => x.Senha).NotEmpty();
    }
}
```

- Sempre `internal`
- Herdar de `Validador<TComando>` (não `AbstractValidator` diretamente)
- Regras no construtor com `RuleFor`
- Mensagens de erro em pt-BR (configuradas na `ConfiguracaoDominio`)

## Repositórios

```csharp
public class SenhaDoUsuarioRepositorio : RepositorioBase<SenhaDoUsuario>
{
    protected override async Task AdicionarAsync(
        SenhaDoUsuario entidade, CancellationToken cancellationToken) { ... }

    public override async Task SalvarAsync(
        SenhaDoUsuario entidade, CancellationToken cancellationToken = default) { ... }
}
```

- Herdar de `RepositorioBase<T>` (isolamento por organização) ou
  `RepositorioEntidadeOrganizacao<T>` (multi-tenant)
- Override dos métodos `AdicionarAsync`, `AtualizarAsync`, `RemoverAsync`,
  `SalvarAsync` conforme necessidade
- O domínio declara interface; a infraestrutura implementa; a composição injeta

## Controllers

```csharp
// Controller CRUD genérico (uma linha)
public class CategoriasDeReceitasEDespesasController : ControllerCrudOrganizacao<
    CategoriaDeReceitasEDespesas,
    AdicionarCategoriaDeReceitasEDespesasComando, IId,
    AtualizarCategoriaDeReceitasEDespesasComando, IAtualizarComandoRetorno,
    RemoverCategoriaDeReceitasEDespesasComando, IRemoverComandoRetorno>
{
    public CategoriasDeReceitasEDespesasController(
        IMediatorHandler bus, IValidadorDominio validadorDominio,
        IInicializador inicializador,
        CategoriaDeReceitasEDespesasRepositorio repositorio) :
        base(bus, validadorDominio, inicializador, repositorio) { }
}

// Controller de consulta (primary constructor)
[ControladorDeUsoGeral]
public class OrganizacoesConsultaController(
    IMediatorHandler bus, IValidadorDominio validadorDominio, IInicializador inicializador
) : ControllerSomenteLeituraBase<ObterDadosDaOrganizacaoComando, IId>(bus, validadorDominio, inicializador);
```

- Controllers são **finos**: orquestram, não contêm regra de negócio
- Preferir classes genéricas base (`ControllerCrudOrganizacao`,
  `ControllerComandoPost`, etc.)
- Primary constructor (C# 12) em arquivos novos
- `[ControladorDeUsoGeral]` em controllers de leitura/consulta

## Tratamento de erros

- **Nunca** lançar exceções diretamente no domínio
- Usar `IValidadorDominio.NotificarErroValidacao(mensagem, cancellationToken)`
- Retornar `default` nos handlers quando houver notificação de erro
- Controllers consultam `validadorDominio.PossuiNotificacoes()` antes de
  retornar resposta
- Exceções técnicas são convertidas na camada de infraestrutura

## Null handling

- Preferir `is not null` / `is null` sobre `== null`
- Pattern matching com atribuição: `if (x is not { } id) return;`
- Retornar `default` (não `null`) em métodos com retorno genérico
- Null-conditional com moderação: `entidade?.ChaveNaoPreenchida() ?? true`
- Validação centralizada no FluentValidation; evitar guard clauses manuais

## Async / CancellationToken

- Todos os métodos de repositório, handler e controller são `async`
- `CancellationToken` sempre propagado; usar `= default` nos pontos públicos
- Expression-bodied para métodos async de uma linha:

```csharp
public virtual Task<TEntidade> ObterRegistroUnicoDaOrganizacao(
    CancellationToken cancellationToken) =>
    repositorio.ObterRegistroUnicoDaOrganizacao(cancellationToken);
```

## Enums

- Valores em pt-BR, PascalCase, sem números explícitos
- Armazenar em pasta `Enumerados/` dentro do domínio
- Usar `ExtensõesDeFlags` para operações com `[Flags]`:

```csharp
public enum TipoDeEncerramento
{
    Mensal,
    PorMáximoDeFolhas
}
```

## Comentários

- **Não** comentar código autoexplicativo; o nome pt-BR explica a intenção
- XML doc em interfaces públicas quando a assinatura não é autoexplicativa
- `[SuppressMessage]` para justificar exceções a regras de análise estática
- Nenhuma outra forma de comentário deve existir

## Expressão em uma linha

Usar expression-bodied members quando o corpo tem uma única expressão:

```csharp
public override int GetHashCode() => Id?.GetHashCode() ?? 0;
public OrganizacaoId(string id) => Id = id;
protected virtual Task<bool> ValidarUsoEntidade(...) => ValidarIdDaEntidade(...);
```

## Acesso

- Campos privados: `private readonly`
- Validadores: `internal`
- Controllers concretos: `public`
- Métodos base para override: `protected virtual` / `protected override`
- Nunca campos públicos; propriedades públicas somente quando necessárias

## Complexidade e legibilidade

- **Tamanho de métodos**: evitar métodos com mais de 20 linhas. Se exceder, decompor em métodos menores com nomes que expressem a intenção no domínio.
- **Responsabilidade única (SRP)**: cada método deve ter um motivo e somente um para mudar. Se um método faz validação + persistência + notificação, separar em unidades coesas.
- **Parâmetros de entrada**: limitar a no máximo 7 parâmetros em construtores e métodos. Quando houver mais, agrupar em DTO/objeto de valor (ex.: `ParametrosDeBusca`, `DadosDeEntrada`).
