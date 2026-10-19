# Alinhamento do texto entre tamanhos e pesos de fonte — Sky (.frx)

Guia do **alinhamento horizontal do texto** entre objetos com tamanhos e pesos de
fonte diferentes nos relatórios FastReport da Sky: por que `Left` igual não
alinha, o modelo do deslocamento interno do motor, a tabela de valores medidos e
a regra de compensação.

> Complementa `padrao-visual-relatorios.md` (define o **VISUAL**) e a skill
> `fastreport-dotnet` (define a **MECÂNICA** do `.frx`).
> **Este doc define apenas o alinhamento do texto.** Unidades em **px a 96 dpi**,
> como no `.frx`.

### STOP — leia antes de ajustar alinhamento

1. **`Left` igual NÃO garante texto alinhado.** O motor recua o texto um valor que
   **cresce com o tamanho da fonte**; o negrito recua um pouco mais.
2. **`Padding` do FastReport é `System.Windows.Forms.Padding`, com membros
   `Int32`.** Fração no XML é **descartada** e o `Padding` volta ao default.
   Nunca escrever fração.
3. **A diferença entre tamanhos vizinhos pode ser menor que 1 px** (7 pt negrito
   × 8 pt regular = 0,48 px). Nesse caso o `Padding` sozinho **nunca** alinha.
4. **A compensação é dividida:** parte inteira no `Padding`, resto no
   `Left`/`Width`.
5. **Não trocar tamanho de fonte para "resolver"** — a tipografia é fixa.
6. **Divisórias começam e terminam na borda do TEXTO**, não na borda do objeto.

## Por que o `Left` não basta

Dois objetos com o mesmo `Left` e a mesma largura, mas fontes de tamanhos
diferentes, **não** começam o texto no mesmo ponto: o motor posiciona o glifo com
um deslocamento interno proporcional ao tamanho da fonte (o *bearing* esquerdo do
glifo escalado pelo tamanho, somado ao preenchimento do objeto). Um texto de 7 pt
"entra" menos que um de 10,5 pt.

Isso aparece nas colunas: um cabeçalho de 7 pt bold e as linhas de detalhe de 8 pt
regular parecem começar em pontos diferentes — o detalhe fica à esquerda.

## Modelo

```
borda_esquerda = Left + Padding.Left  + gL(tamanho, peso)
borda_direita  = Left + Width − Padding.Right − gR(tamanho, peso)
```

- `gL` / `gR` = **deslocamento natural** do glifo, medido com `Padding` zerado.
- `Padding` **default do motor** = `(2, 0, 2, 0)` (Left=2, Right=2) — vale mesmo
  sem o atributo no XML.
- A ordem serializada do atributo é `Left, Top, Right, Bottom`.

## Tabela de deslocamento (medida a 600 dpi)

| Tamanho | `gL` regular | `gL` negrito | `gR` regular | `gR` negrito |
|---|---|---|---|---|
| 7 pt | 2,52 | 2,36 | 2,76 | 2,44 |
| 7,5 pt | 2,68 | 2,68 | 2,76 | 2,60 |
| 8 pt | 2,84 | 2,68 | 2,92 | 2,92 |
| 8,5 pt | 3,00 | 2,84 | 3,08 | 3,08 |
| 9 pt | 3,32 | 3,16 | 3,56 | 3,40 |
| 10,5 pt | 3,80 | 3,64 | 4,04 | 4,04 |
| 14 pt | 5,08 | 4,92 | 5,48 | 5,32 |

Leitura: **o deslocamento cresce com o tamanho** e o **negrito desloca ~0,2 px
para a esquerda**. Não existe um valor único por tamanho — por isso a compensação
é por objeto.

> Medir a **96 dpi não serve**: a granularidade de 1 px agrupa tamanhos que na
> verdade diferem (7 e 7,5 pt; 8 a 10,5 pt) e esconde a diferença de negrito.
> Medir sempre a **600 dpi**.

## Como medir

Método: renderizar cada objeto com `Padding` zerado e localizar a **primeira** (e
a **última**) coluna de pixels com tinta. A 600 dpi isso dá ~0,16 px de resolução
na escala de 96 dpi.

1. Montar um relatório com um `TextObject` por linha, todos com o **mesmo
   `Left`**, variando tamanho e peso, `Padding` = 0, texto de referência (ex.:
   `HHHHH`).
2. Exportar em **600 dpi** (`ImageExport` com `ResolutionX/Y = 600`).
3. Mapear a borda do objeto para pixel da imagem:
   `x = Left * (dpi/96) + LeftMargin_mm * dpi/25.4`.
4. `gL` = (primeiro pixel com tinta − x) / (dpi/96);
   `gR` = (x_direita − último pixel com tinta) / (dpi/96).

```csharp
// varredura horizontal; IsDark = R,G,B < 200; escala = dpi / 96.0
int inicio = -1;
for (int x = (int)leftImg - 2; x < bmp.Width && inicio < 0; x++)
    for (int dy = -20; dy <= 20; dy++)
        if (IsDark(bmp.GetPixel(x, meioY + dy))) { inicio = x; break; }
double gL = (inicio - leftImg) / escala;
```

O texto de referência importa: `gL` é o *bearing* do **primeiro glifo**. Use o
mesmo texto para comparar tamanhos; para prever um objeto real, use o texto dele.

**Ferramentas desta skill (`tools/`):**

- `tools/medir-deslocamento-texto-fastreport/` — C# + FastReport. Implementa
  exatamente o método acima: um `TextObject` por linha, exporta a **600 dpi** e
  imprime `gL`/`gR` por tamanho e peso (regular e negrito). Rodar com `dotnet run`.
- `tools/ajustar-padding-alinhamento-fechamento/Ajustar-Padding.ps1` — aplica a
  regra de compensação e ajusta as divisórias em um `.frx`. **Dry-run por
  padrão**; só grava com `-Aplicar`.

## Regra de compensação

O objeto de **maior deslocamento do lado de alinhamento** é a referência: fica com
`Padding` zero e a geometria da coluna intacta. Os demais recebem a diferença:

```
esquerda: padL = floor(gL_ref − gL)     Left  += (gL_ref − gL) − padL
direita : padR = floor(gR_ref − gR)     Width −= (gR_ref − gR) − padR
```

- `floor` (e não `round`): mantém o resto em `[0, 1)`, então o `Left` **nunca
  fica negativo**.
- Quando o resto é 0, `Left`/`Width` do objeto não mudam.
- A referência é o **maior deslocamento do lado**, não necessariamente o maior
  tamanho: `gL(14 pt negrito)` = 4,92 é maior que `gL(10,5 pt negrito)` = 3,64.

| Lado | Borda alvo |
|---|---|
| Esquerda | `gL_ref` |
| Direita | `largura útil − gR_ref` |

**Efeito colateral assumido:** dentro de uma coluna o `Left` (ou o `Width`) passa
a variar **menos de 1 px** entre objetos de tamanhos diferentes. É inevitável — o
`Padding` só anda de 1 em 1. Como os objetos não têm borda visível, a grade da
coluna não muda na tela.

**Alternativa descartada — só `Padding` inteiro, `Left`/`Width` intactos.**
Preserva a geometria da coluna, mas o resíduo entre tamanhos vizinhos fica em até
~0,5 px — visível.

## Divisórias

As divisórias (`LineObject`) **começam e terminam nas bordas do texto**, não nas
bordas da banda:

```
Left  = gL_ref
Width = (largura útil − gR_ref) − gL_ref
```

Assim a linha fecha exatamente o bloco de texto, alinhada às colunas extremas. A
espessura (`Border.Width`) e a cor não mudam.

## Checklist

- [ ] Nenhum `Padding` com parte decimal em todo o `.frx`
- [ ] O `Padding` relido pelo FastReport bate com o XML (`report.Load` + ler a
      propriedade) — fração é descartada **sem erro**
- [ ] Objetos alinhados à esquerda com a **mesma borda esquerda de texto** (não só
      o mesmo `Left`)
- [ ] Objetos alinhados à direita com a **mesma borda direita de texto**
- [ ] Objetos com `HorzAlign=Center` **não alterados**
- [ ] Divisórias começando e terminando nas bordas do texto
- [ ] Texto, fonte, tamanho, peso, cor e alinhamento **inalterados**
- [ ] Medição feita a **600 dpi** (a 96 dpi não distingue os tamanhos)

## Proibidos

| Item | Por quê |
|---|---|
| `Padding` com valor fracionário | o FastReport descarta e volta ao default — o ajuste some sem erro |
| Confiar só no `Padding` quando a diferença é < 1 px | não existe valor inteiro que alinhe (7 pt negrito × 8 pt regular = 0,48 px) |
| Mudar o tamanho da fonte para alinhar | a tipografia é fixa (`padrao-visual-relatorios.md`) |
| Alinhar só pelo `Left` do objeto | o deslocamento interno do motor não é o mesmo entre tamanhos |
| Medir o deslocamento a 96 dpi | a granularidade de 1 px esconde as diferenças reais |
| Divisória nas bordas da banda com o texto recuado | a linha fica mais longa que o bloco de texto |
| Compensar objeto centralizado | o deslocamento depende do texto, não de um lado fixo |

## Exemplo — fechamento de conta (`.frx`)

Dois templates (`RelatorioDeFechamentoDeContaSintetico.frx` e
`...Analitico.frx`), largura útil `737,01` (margens laterais 7,5 mm).

- **Esquerda:** referência = `Titulo` (14 pt negrito, `gL` = 4,92). Alvo = **4,92**.
  - 7 pt negrito → `Padding="2, 0, 2, 0"`, `Left += 0,56`
  - 8 pt regular → `Padding="2, 0, 2, 0"`, `Left += 0,08`
  - 10,5 pt negrito → `Padding="1, 0, 2, 0"`, `Left += 0,28`
- **Direita:** referência = 8 pt (`gR` = 2,92). Alvo = **734,09**.
  - 8 pt → `Padding="0, 0, 0, 0"`
  - 7 pt negrito → `Padding="0, 0, 0, 0"`, `Width −= 0,48`
- **Divisórias:** `Left="4.92"`, `Width="729.17"` (4,92 → 734,09).

Resultado verificado: toda borda esquerda de texto em **4,92** e toda borda
direita em **734,09** — 0 divergências entre objetos do mesmo alinhamento.
