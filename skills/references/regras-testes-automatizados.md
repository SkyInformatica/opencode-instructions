# Regras --- Testes Automatizados (JSON)

Este documento define as regras para criação e manutenção dos arquivos
`.json` utilizados pelos testes automatizados.

Abrange: - contexto e dados base reutilizáveis; - entradas
(comandos/requests); - expectativas (responses/efeitos); - validações; -
datas e horários; - valores monetários; - IDs; - placeholders.

Objetivos: **legibilidade**, **determinismo**, **baixo acoplamento** e
**manutenção fácil**.

> Regras gerais do projeto estão em `principios.md` e
> `regras-de-codificacao-dotnet.md` (em `skills/references/`). Este arquivo
> trata apenas das convenções específicas dos testes automatizados em JSON.

------------------------------------------------------------------------

## 1. Estrutura dos testes

### 1.1 Contexto compartilhado

Use `0-Contexto/` para dados base reutilizáveis entre cenários.

Regras: - um arquivo deve representar um único assunto; - evitar mega
JSONs; - preferir arquivos pequenos e com propósito claro; - dados de
contexto devem ser estáveis e previsíveis.

Exemplos de assuntos: - organização; - unidade federativa; - base de
cálculo; - lote de selos.

### 1.2 Organização por cenário

Para testes de aceitação, preferir uma pasta por feature ou caso de uso:

``` text
0-Contexto/
NN-Cenario-.../
├── entrada.json       (quando aplicável)
├── esperado.json      (quando aplicável)
├── cenario.json       (quando o runner utilizar arquivo único)
└── readme.md          (opcional)
```

Não criar arquivos ou estruturas que o runner não utilize apenas para
seguir este padrão.

### 1.3 Estrutura de um arquivo de teste

Um arquivo de teste contém um cenário e sua lista de comandos:

``` json
{
  "Nome": "descricao do cenario",
  "Comandos": [
    {
      "Requisicao": {
        "Rota": "{{RotaBase}}/Endpoint",
        "Metodo": "Post",
        "Body": { },
        "Headers": {
          "Authorization": "Bearer {{AccessTokenAutenticar/1}}"
        }
      },
      "Retorno": {
        "Codigo": 200,
        "Body": { }
      }
    }
  ]
}
```

- **`Nome`**: identifica o cenário de forma legível.
- **`Comandos`**: lista de comandos encadeados. Cada comando tem:
  - **`Requisicao`**: `Rota` (endpoint), `Metodo` (HTTP), `Body` (entrada),
    `Headers` (autenticação via `{{AccessTokenAutenticar/1}}`).
  - **`Retorno`**: `Codigo` (status HTTP esperado) e `Body` (expectativa).
- Um único arquivo pode encadear vários comandos: preparar dados, atuar e
  verificar o resultado no mesmo cenário.
- `Rota`, `Metodo`, `Body` e `Retorno.Body` são campos obrigatórios;
  `Headers` geralmente carrega a autenticação.

### 1.4 Estado compartilhado e ordem de execução

A suite de aceitação **compartilha estado entre os arquivos** de uma mesma
suite.

- Uma variável capturada com `[[nome]]` em um arquivo fica disponível para
  os **arquivos seguintes** via `{{nome}}`.
- Os arquivos executam em **ordem alfabética**. O **prefixo numérico**
  (`00-`, `01-`, `02-`, ...) controla essa ordem e deve refletir a
  dependência entre cenários.
- Pastas de contexto (`0-Contexto/` ou `00-Contexto/`) são executadas
  primeiro e preparam estado reutilizável (contas, organizações, tokens).
- Um cenário deve **estabelecer no início dos próprios comandos** o estado
  de que precisa (ex.: abrir/fechar uma conta antes de usá-la), em vez de
  confiar em ordem acidental de execução.
- Como o estado persiste entre arquivos, o **último estado** deixado por um
  cenário afeta o seguinte. Ao projetar um fluxo, considerar em que estado
  a suite termina cada cenário.

------------------------------------------------------------------------

## 2. Nomenclatura dos arquivos

Use nomes descritivos e consistentes.

Preferir:

``` text
01-LerUnidadeFederativa.json
44-AdicionarNotaDeServicoPorEncaminhamentosRepasse.json
```

Evitar:

``` text
teste1.json
dados.json
teste.json
```

### 2.1 Prefixo numérico

O prefixo numérico serve para manter uma ordem previsível de leitura.

Quando houver muitos cenários ou necessidade frequente de inserção,
preferir intervalos, por exemplo:

``` text
10-...
20-...
30-...
```

A numeração não deve representar prioridade funcional; serve apenas para
organização.

------------------------------------------------------------------------

## 3. Convenções do JSON

### 3.1 Propriedades em lowerCamelCase

Todas as propriedades dos JSONs de teste devem utilizar
`lowerCamelCase`.

Correto:

``` json
{
  "identificadorDoDocumento": "123"
}
```

Incorreto:

``` json
{
  "IdentificadorDoDocumento": "123",
  "identificador_do_documento": "123"
}
```

Mesmo quando o domínio ou código C# utilizar PascalCase, o JSON deve
seguir o contrato esperado pelo teste.

## 4. Codificação dos arquivos

Todos os arquivos `.json` de teste devem ser salvos em:

**UTF-8 sem BOM**.

Não utilizar: - UTF-16; - ANSI/Windows-1252; - UTF-8 com BOM; - `ZWNBSP`
(`U+FEFF`) no início do arquivo.

O objetivo é garantir leitura consistente entre IDE, runner e pipeline.

### 4.1 PowerShell no Windows

Ao criar ou regravar JSON por script, preservar explicitamente UTF-8 sem
BOM:

``` powershell
$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($caminhoDoArquivo, $conteudo, $enc)
```

Não utilizar fluxos que possam alterar a codificação sem especificação
explícita.

Isso também se aplica quando um agente automatizado: - editar um JSON; -
corrigir texto; - atualizar um expected; - reescrever um payload; -
formatar um arquivo; - normalizar conteúdo.

Após qualquer edição automatizada, validar a codificação do arquivo
salvo.

### 4.2 Verificação de BOM

PowerShell:

``` powershell
Get-ChildItem -Path . -Recurse -File -Filter *.json |
  Where-Object { $_.FullName -notmatch '\\bin\\|\\obj\\' } |
  ForEach-Object {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    if ($bytes.Length -ge 3 -and
        $bytes[0] -eq 0xEF -and
        $bytes[1] -eq 0xBB -and
        $bytes[2] -eq 0xBF) {
      $_.FullName
    }
  }
```

Qualquer resultado indica um JSON com BOM e deve ser corrigido antes do
commit.

### 4.3 Mojibake

Não permitir textos corrompidos como:

``` text
nÃ£o
informaÃ§Ãµes
situaÃ§Ã£o
```

Nem o caractere de substituição:

``` text
 
```

Validação com `rg`:

``` powershell
$padraoMojibake = 'Ã[^\u0000-\u007F]|â[^\u0000-\u007F]| '
$resultado = rg -n --pcre2 --glob "*.json" --glob "!**/bin/**" --glob "!**/obj/**" $padraoMojibake .

if ($LASTEXITCODE -eq 0) {
  Write-Error "Foram encontrados caracteres corrompidos (mojibake) em arquivos JSON."
  $resultado | Write-Output
  exit 1
}
```

------------------------------------------------------------------------

## 5. Roteiro do teste

Os testes devem permitir identificar claramente:

1.  **Arrange** --- dados/contexto necessários;
2.  **Act** --- operação executada;
3.  **Assert** --- comportamento esperado.

### 5.1 Comandos

Cada comando deve possuir intenção clara.

Quando houver uma sequência de comandos, cada item deve ser
compreensível isoladamente, considerando:

-   método;
-   rota;
-   entrada/body;
-   finalidade;
-   retorno esperado.

Se um comando existir apenas para obter um ID ou preparar dados para
outro comando, essa dependência deve ficar clara no `Nome`, `descricao`
ou `readme.md`.

### 5.2 Assert

O teste deve validar **comportamento**, não detalhes irrelevantes da
implementação.

Evitar validar campos que: - mudam a cada execução; - são gerados pelo
runtime; - possuem timestamps dinâmicos; - são IDs efêmeros; - não têm
relação com o comportamento testado.

Quando esses valores forem necessários para a validação, utilizar
placeholders ou regras de comparação apropriadas.

------------------------------------------------------------------------

## 6. Determinismo dos dados

Os testes devem produzir resultados previsíveis.

Evitar dependência de: - horário real; - GUIDs aleatórios; - dados
externos não controlados; - estado residual de outro teste; - ordem
acidental de execução.

Quando um teste depender de um valor dinâmico, utilizar o mecanismo de
placeholder do runner ou preparar explicitamente o valor no contexto.

------------------------------------------------------------------------

## 7. Datas e horários

Utilizar **ISO 8601**.

### 7.1 UTC

Preferir UTC quando o valor representar um momento exato:

``` text
2024-07-25T09:49:51.527Z
2023-12-08T00:00:00Z
```

Usar UTC principalmente para: - criação; - processamento; - eventos; -
integrações; - comparações entre sistemas.

`Z` representa UTC.

### 7.2 Offset local

Usar offset quando o horário civil da localidade fizer parte do
comportamento:

``` text
2026-02-25T10:30:00-03:00
```

### 7.3 Apenas data

Usar somente data quando a hora não fizer parte do comportamento:

``` text
2026-02-25
```

### 7.4 Proibição

Não utilizar data/hora sem timezone quando a hora fizer parte do valor:

``` text
2026-02-25T10:30:00
```

Isso torna o comportamento dependente do ambiente de execução.

### 7.5 Precisão

Não comparar precisão maior do que a necessária.

Se milissegundos não fizerem parte do comportamento testado, não fixar o
valor exato no expected. Usar placeholder ou validação por regra quando
o runner permitir.

------------------------------------------------------------------------

## 8. Valores monetários e decimais

Valores numéricos devem ser representados como **número JSON**, não
string:

``` json
{
  "valor": 123.45
}
```

Para moeda, preferir duas casas decimais quando esse for o contrato do
domínio.

Não forçar duas casas quando o contrato utilizar outra precisão, como
determinados cálculos tributários ou valores de selos.

------------------------------------------------------------------------

## 9. Booleanos e flags

Booleanos devem utilizar:

``` json
true
false
```

Se uma integração ou contrato legado exigir valores como `"T"`/`"F"`,
manter essa representação apenas quando fizer parte do contrato testado.

------------------------------------------------------------------------

## 10. IDs e correlação

Diferenciar:

### 10.1 IDs de contexto

IDs fornecidos pelo contexto devem ser estáveis e fáceis de rastrear.

Preferir referências como:

``` text
{{Organizacao/1}}
{{BaseDeCalculo/1}}
```

Evitar GUIDs aleatórios no contexto quando não forem necessários.

### 10.2 IDs gerados pelo sistema

Quando um ID for criado durante a execução e precisar ser reutilizado em
outro ponto do cenário, utilizar o placeholder de ID gerado:

``` text
[[NotaDeServico/1]]
[[MovimentacaoFinanceira/1]]
[[OrdemDeServico/2]]
```

O mesmo placeholder representa o mesmo ID dentro do cenário.

Não confundir: - `{{...}}` → valor estável fornecido pelo contexto; -
`[[...]]` → valor gerado ou capturado durante a execução.

### 10.3 IDs ignorados

Os IDs são dinâmicos, e não podem ser previstos. Não teria como informar
um valor no corpo do json de forma estática, sem que o teste falhasse.
Por esse motivo, inumeras vezes armazenamos o ID gerado, para informar
ele posteriormente nos testes seguintes. Sempre que armazenamos um ID
( [[...]] ), o ID não é apenas armazenado, o teste para o valor daquele
atributo é ignorado.

Em alguns casos, um ID é retornado na resposta do endpoint e não
há necessidade de testá-lo ou mesmo armazená-lo. Queremos apenas que 
aquele atributo não seja testado. Nesses casos é usadoum identificador
específico, que serve apenas para que o ID não seja nem armazenado, 
nem testado:

``` text
[[***]]
```

### 10.4 Ordenação do `id` no corpo

Nos corpos de resposta serializados pelo domínio, o `id` é frequentemente
emitido **por último** dentro do objeto, após os demais atributos:

``` json
{
  "tipoConta": "Guichê",
  "descricao": "Conta do guichê",
  "id": "[[***]]"
}
```

Como o corpo é comparado, manter a **ordem dos atributos** igual à
serialização real. Ao ajustar um expected, posicionar `id` no fim do objeto
quando o endpoint assim o fizer.

------------------------------------------------------------------------

## 11. Enums e contratos

A representação de enums deve seguir o contrato da API/test runner.

Pode ser: - string; - código numérico.

Dentro de uma mesma suite, manter a representação consistente.

Não misturar representações para o mesmo contrato sem justificativa.

------------------------------------------------------------------------

## 12. Placeholders

### 12.0 Captura de conteúdo retornado vs. consumo de variável

Há **três sintaxes distintas**, e é essencial não confundi-las:

1. `[[nome]]` — **apenas no RETORNO** (`Retorno.Body`): captura o conteúdo retornado
   pelo endpoint naquela posição e o **armazena** na variável `nome` da suite. Ao
   capturar, o atributo deixa de ser comparado. O valor fica acessível
   posteriormente por **`{{nome}}`** (chaves).
2. `{{nome}}` — **no REQUEST** (`Requisicao.Body`) ou na **Rota**: consome o valor
   de uma variável **previamente capturada** com `[[nome]]` (ou fornecida pelo
   contexto). Só é válido se a variável já tiver sido definida.
3. `[[***]]` (ou `[[...]]`, os asteriscos) — **apenas no RETORNO** (`Retorno.Body`):
   indica que o valor daquele atributo deve ser **ignorado** na comparação.
   **Não armazena nada em nenhuma variável.** Por isso **nunca** há um `{{...}}`
   correspondente a ser usado depois.

Regras:

- **`[[***]]` é somente para ignorar o teste do atributo.** Ele não salva valor e
  não cria variável — consequentemente **não existe** `{{***}}` (nem qualquer
  `{{ }}` derivado dele) para acessar depois. Se um id for necessário em um
  comando posterior, deve-se usar `[[nome]]` (com um **nome de variável**), não
  `[[***]]`.
- **Nunca** usar `[[...]]`, `[[***]]` ou `[[nome]]` no `Requisicao.Body` ou na
  `Rota`. Nesses locais, usar sempre `{{nome}}` (chaves) referenciando uma
  variável já existente (capturada antes com `[[nome]]` ou vinda do contexto).
- O `{{ }}` só existe como **consumo** de uma variável que foi armazenada; ele
  nunca está ligado a um `[[***]]`.
- Para usar um valor capturado em um comando seguinte, referencie a variável com
  `{{nome}}` (chaves), não com `[[nome]]`.
- Exemplo: um `AberturaConta` retorna `"operações": {"idAbertura": "[[abertura/1]]"}`
  e armazena o id na variável `abertura/1`. Para atualizar essa abertura em um
  `PUT /AberturaConta`, o request usa `"Id": "{{abertura/1}}"`.

### 12.1 Organização

Quando existir um objeto `organizacao` com uma propriedade `id`,
utilizar por padrão:

``` json
{
  "organizacao": {
    "id": "{{Organizacao/1}}"
  }
}
```

Isso vale para entradas e expectativas quando a organização fizer parte
do contrato.

Para cenários de outra organização ou multi-organização, utilizar:

``` text
{{Organizacao/2}}
{{Organizacao/3}}
```

conforme a necessidade.

### 12.2 Referência de contexto

Utilizar:

``` text
{{NomeDoContexto/Indice}}
```

para valores estáveis provenientes de `0-Contexto` ou outra fonte
estável.

Exemplos:

``` text
{{Organizacao/1}}
{{BaseDeCalculo/1}}
```

### 12.3 IDs gerados

Utilizar:

``` text
[[NomeSemantico/NumeroSequencial]]
```

Exemplos:

``` text
[[NotaDeServico/1]]
[[MovimentacaoFinanceira/1]]
```

Regras: - nome semântico; - sequência iniciando em `1`; - mesmo
placeholder para o mesmo ID; - não alternar nomes para representar o
mesmo tipo.

### 12.4 Valores dinâmicos

Para datas, horários e outros valores gerados pelo runtime, preferir
placeholder ou validação por regra.

Não utilizar um valor fixo apenas para fazer o teste passar quando esse
valor não representar o comportamento testado.

### 12.5 Hoje/agora

Se o runner possuir placeholders como `{{Hoje}}`, a regra deve definir
explicitamente: - timezone utilizado; - formato produzido.

Quando possível, preferir:

``` text
{{Hoje}}
```

como data UTC no formato:

``` text
YYYY-MM-DD
```

------------------------------------------------------------------------

## 13. Corpo de erro de validação (HTTP 400)

Ao esperar uma validação que falha, o `Retorno` costuma ter `Codigo` 400 e
um corpo estruturado. Este corpo é **comparado** com o esperado (como
qualquer outro), então deve refletir o contrato real do endpoint:

``` json
{
  "titulo": "Ocorreu um erro de validação!",
  "objetosInformacao": {
    "<NomeDoComando>": {
      "<CampoValidado>": [
        { "descricao": "<mensagem>", "codigo": "<validator>" }
      ]
    }
  }
}
```

- **`objetosInformacao`**: mapeia o comando para as validações que falharam.
- A **subchave** (`<CampoValidado>`) é o **nome do campo validado**
  (ex.: `ContaDestino`, `PagamentoAvancado`, `Cancelamento`). Quando a
  validação é aplicada no comando inteiro (`RuleFor(x => x)`), a subchave é
  `""` (string vazia).
- Cada item tem `descricao` (mensagem) e `codigo` (identificador do
  validador). A `descricao` usa texto real do domínio (pt-BR).

### 13.1 Testar a descrição, ignorar o código do validador

O `codigo` (identificador do validador, ex.: `AsyncPredicateValidator`) é
um **detalhe de implementação** e pode mudar sem alterar o comportamento.
Para testar a mensagem sem acoplar ao validador, ignorar o `codigo`:

``` json
{ "descricao": "A conta 'Guichê' não está aberta.", "codigo": "[[***]]" }
```

Regras:

- A **`descricao`** deve ser **testada** (é o comportamento observável).
- O **`codigo`** pode ser **ignorado** com `[[***]]`.
- Validadores configurados com `CustomAsync`/`AddFailure` retornam apenas
  `descricao`, **sem** `codigo`. Nesse caso, o esperado deve ter **somente**
  `descricao` (não incluir `codigo`).

### 13.2 Acentuação e convenção de nomes

- **Endpoints** e **rotas** não possuem acento (`TransferirValorEntreContas`).
- **Valores de string** (descrições, mensagens, `tipo`) podem e devem usar
  acentos pt-BR corretos.
- **Nomes de variáveis** (`[[...]]` e `{{...}}`) **podem** conter acentuação
  (ex.: `[[movimentaçãoFinanceira/1]]`).
- Propriedades de resposta são serializadas conforme o contrato do domínio
  (respeitar o nome real retornado, mesmo com acento, ex.: `operação`,
  `histórico`).

------------------------------------------------------------------------

## 14. Checklist antes do commit

### Estrutura

-   [ ] O cenário possui intenção clara.
-   [ ] Dados reutilizáveis estão em `0-Contexto/`.
-   [ ] Não foi criado mega JSON sem necessidade.
-   [ ] O nome do arquivo é descritivo.
-   [ ] O prefixo numérico está consistente.

### JSON

-   [ ] Propriedades estão em `lowerCamelCase`.
-   [ ] Nomes de propriedades não possuem acentuação.
-   [ ] Decimais são números, não strings.
-   [ ] Booleanos utilizam `true`/`false`, salvo contrato legado.
-   [ ] Enums seguem a representação definida pela suite.

### Determinismo

-   [ ] Datas seguem ISO 8601.
-   [ ] Horários possuem `Z` ou offset explícito.
-   [ ] Valores dinâmicos não estão fixados sem necessidade.
-   [ ] IDs gerados utilizam placeholders quando precisam ser
    reutilizados.
-   [ ] Não há dependência acidental de dados externos ou execução
    anterior.

### Placeholders

-   [ ] `organizacao.id` utiliza `{{Organizacao/1}}` por padrão.
-   [ ] Dados estáveis utilizam `{{...}}`.
-   [ ] IDs gerados utilizam `[[...]]`.
-   [ ] O mesmo placeholder é reutilizado para o mesmo valor.
-   [ ] `[[...]]`/`[[***]]` são usados **apenas** no `Retorno.Body` (captura/ignora),
    nunca no `Requisicao.Body` nem na `Rota`.
-   [ ] O `Requisicao.Body`/`Rota` usa `{{variavel}}` (chaves) referenciando uma
    variável já capturada ou de contexto.

### Codificação

-   [ ] JSON está em UTF-8 sem BOM.
-   [ ] Não existe `U+FEFF` no início.
-   [ ] Não existe ` `.
-   [ ] Não existe mojibake como `Ã...` ou `â...`.

### Assert

-   [ ] O teste valida comportamento relevante.
-   [ ] Campos voláteis não estão sendo comparados literalmente sem
    necessidade.
-   [ ] O teste não depende de detalhes internos que não fazem parte do
    contrato.
-   [ ] Em corpo de erro 400, a `descricao` é testada e o `codigo` é
    ignorado (`[[***]]`) ou omitido quando não retornado.

### Suite / Estado

-   [ ] O cenário estabelece no início dos próprios comandos o estado de
    que depende (não confia em ordem acidental).
-   [ ] O estado final deixado pela suite é coerente com o próximo cenário
    (a suite compartilha estado entre arquivos).
-   [ ] O prefixo numérico reflete a ordem de dependência entre arquivos
    (execução em ordem alfabética).
-   [ ] A ordem dos atributos do corpo segue a serialização real (ex.: `id`
    no fim).
