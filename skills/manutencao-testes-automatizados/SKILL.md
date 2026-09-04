---
name: manutencao-testes-automatizados
description: "Cria, ajusta e atualiza testes automatizados (aceitação JSON e unitários C#) conforme as regras do projeto. Use quando o usuário pedir para criar, corrigir, atualizar ou manter testes, ou para uma determinada funcionalidade/classe/método."
---

# manutencao-testes-automatizados

## Quando usar

Ative esta skill quando o usuário pedir para **criar**, **ajustar**, **atualizar** ou **manter** testes automatizados. Aceita a indicação de um projeto, classe ou função para direcionar a manutenção (ex.: "mantenha os testes da classe X", "corrija o teste de Y", "crie teste para a função Z").

## Referência obrigatória

Carregue e aplique as regras de testes automatizados:

1. `../references/regras-testes-automatizados.md` — convenções dos testes de aceitação JSON: estrutura, nomenclatura, codificação UTF-8 sem BOM, determinismo, placeholders `{{...}}`/`[[...]]`, datas, valores, enums, checklist antes do commit.

Para testes unitários C#, complemente com:
2. `../references/regras-de-codificacao-dotnet.md` — nomenclatura e padrões do código .NET (aplicáveis também ao código de teste).
3. `../../rules/principios.md` — princípios gerais de engenharia (DRY, SOLID, KISS/YAGNI).

> Localização dos arquivos no repositório de compartilhamento: `skills/references/regras-testes-automatizados.md`, `skills/references/regras-de-codificacao-dotnet.md`, `rules/principios.md`.

## Localizar os testes no projeto

Antes de editar, identifique onde os testes relevantes estão no projeto:

```
test/
├── Aceitacao/          → testes de aceitação (JSON em SuiteDeTeste)
│   ├── Dominio/
│   ├── Infraestrutura/
│   └── Servico/
├── Aceitacao2/
├── AmbienteDeTestes/
├── Mocks/
└── Unidade/            → testes unitários
```

**Testes de aceitação** seguem a estrutura por domínio/feature:
```
test/Aceitacao/Dominio/<Contexto>/<Agregado>.<Aceitacao.Tests>/SuiteDeTeste/
├── 0-Contexto/           → dados base reutilizáveis
├── NN-Cenario-.../       → cenários numerados
│   ├── 0-Setup/
│   ├── 1-Sucesso/
│   └── 2-Falha/
└── *.json
```

Cada projeto de aceitação tem um `Tests.cs` que chama `ExecutorTestes.ExecutarTodosOsTestes()` e executa os JSON da `SuiteDeTeste`.

## Workflow — criar/ajustar/atualizar testes

### 1. Entender o escopo

- Se o usuário indicou um **projeto** → direcione para a pasta de testes correspondente.
- Se indicou uma **classe/função** → localize a funcionalidade no domínio e o teste correspondente (mesmo agregado/cenário).
- Se não indicou nada → pergunte o que deve ser testado (funcionalidade, cenário de sucesso/falha).

### 2. Ler o código-fonte

- Entenda o comportamento real da funcionalidade (contrato do endpoint/comando, validações, retornos) antes de escrever o esperado.
- Para aceitação, verifique a rota, método HTTP, body, headers e retorno reais.

### 3. Criar ou editar o JSON de aceitação (se aplicável)

Siga estritamente `regras-testes-automatizados.md`:
- `Nome`, `Comandos` com `Requisicao` (Rota, Metodo, Body, Headers) e `Retorno` (Codigo, Body).
- Propriedades em `lowerCamelCase`.
- Codificação **UTF-8 sem BOM** (nunca ANSI/UTF-16/BOM).
- Sem mojibake, sem `‎` (ZWNBSP).
- Placeholders: `{{variavel}}` no request/rota (valor pré-capturado), `[[nome]]` no retorno (captura), `[[***]]` no retorno (ignora). Nunca `[[...]]` no request.
- Datas em ISO 8601 com `Z`/offset quando o momento importar.
- Valores monetários como número, não string.
- ORDEM dos atributos do retorno conforme serialização real (ex.: `id` por último).
- Corpo de erro 400: testar `descricao`, ignorar `codigo` com `[[***]]`.

### 4. Criar ou editar teste unitário C# (se aplicável)

Para testes em `test/Unidade/`, siga os padrões do framework usado no projeto (NUnit, xUnit, etc.) e as regras de codificação .NET.

### 5. Revalidar o que foi alterado

Após qualquer edição:
- Confirme a codificação (UTF-8 sem BOM).
- Valide o JSON (parsing correto, sem vírgula sobrando).
- Verifique placeholders e ordem de atributos.
- Rode o checklist da seção 14 das regras de testes.

### 6. Rodar os testes

Execute o projeto de teste afetado diretamente pelo `.csproj`, por exemplo:
```powershell
dotnet test "<caminho>/<Projeto>.Aceitacao.Tests.csproj" --no-restore --logger "console;verbosity=normal"
```
- Não use `--no-build` após alterar arquivos da `SuiteDeTeste` (os JSONs são copiados para a saída de compilação e o teste poderia executar versão desatualizada).
- Ao corrigir um teste com falha, execute novamente após cada alteração, repetindo o ciclo até passar ou existir bloqueio externo claramente identificado.

## Limites

- **Nunca altere a lógica do código-fonte** para fazer o teste passar; o teste deve refletir o comportamento real esperado.
- Se o comportamento esperado divergir do código atual, valide com o usuário qual é o correto.
- Se o teste exigir ajuste no domínio (ex.: endpoint inexistente), informe em vez de criar cenário inválido.
