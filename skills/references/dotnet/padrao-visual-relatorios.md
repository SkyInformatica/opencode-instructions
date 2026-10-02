# Padrão Visual de Relatórios — Sky (.frx)

Guia de **visual**: fonte, espaçamento, cabeçalho, banda de dados, grupos e
rodapé usados nos relatórios FastReport da Sky.

> **STATUS: RASCUNHO.** Valores abaixo são *pendentes de extração* dos
> relatórios `.frx` reais. Cada seção traz marcador `[TODO: extrair de .frx]`.
> **Não inventar valores** — extrair de 2–3 relatórios consolidados e
> generalizar antes de marcar como definido.
>
> Para a mecânica do FastReport (lifecycle, `RegisterData`, export) ver a
> skill `fastreport-dotnet`.

## Fonte

| Propriedade | Valor | Origem |
|---|---|---|
| Família base (corpo) | `[TODO: extrair de .frx]` | `TextObject.Font` |
| Família títulos | `[TODO: extrair de .frx]` | `TextObject.Font` |
| Tamanho corpo | `[TODO]` | |
| Tamanho título principal | `[TODO]` | |
| Tamanho título de seção/grupo | `[TODO]` | |
| Números / moeda | `[TODO: monoespaçada? formato?]` | |
| Negrito quando | `[TODO]` | |

Regra: se `.frx` usa fontes Windows (`Arial`, `Calibri`, `Segoe UI`) em
relatório servido via Linux/Docker, validar disponibilidade no container
(`fc-list`) — senão trocar para fonte embarcada/deployada.

## Cabeçalho (PageHeaderBand)

| Item | Valor | Origem |
|---|---|---|
| Logotipo | `[TODO: tamanho, posição]` | `PictureObject` |
| Título do relatório | `[TODO]` | `TextObject` |
| Nº do documento | `[TODO: formato]` | parâmetro/txt |
| Data/hora de emissão | `[TODO: formato]` | parâmetro/txt |
| Layout (top/left de cada item) | `[TODO]` | `Bounds` dos objetos |

## Banda de dados (DataBand)

| Propriedade | Valor | Origem |
|---|---|---|
| Altura da linha | `[TODO]` | `DataBand.Height` |
| Interlinha / padding vertical | `[TODO]` | `TextObject.Bounds` |
| Alinhamento por tipo de coluna | `[TODO: texto=esq, número=dir, moeda=dir]` | `TextObject.HorzAlign` |
| Zebra / cor alternada | `[TODO: sim/não + cor]` | `Fill` |
| Formato de data | `[TODO]` | `Format` |
| Formato de moeda | `[TODO]` | `Format` |
| Split/keep juntos | `[TODO]` | `DataBand` |

## Grupo (GroupHeaderBand / GroupFooterBand)

| Item | Valor | Origem |
|---|---|---|
| Campo de quebra | `[TODO: ex. Cliente, Filial, Período]` | `GroupHeaderBand.Condition` |
| Cabeçalho de grupo (fonte/cor) | `[TODO]` | `TextObject` |
| Subtotal por grupo | `[TODO: expressão agregada]` | `[Sum(x)]` |
| Repete cabeçalho em nova página | `[TODO]` | `RepeatOnNewPage` |

## Rodapé (PageFooterBand / ReportSummaryBand)

| Item | Valor | Origem |
|---|---|---|
| Nº de página | `[TODO: formato "[PageN] de [TotalPages]"?]` | `PageN/TotalPages` |
| Total geral | `[TODO]` | `ReportSummaryBand` |
| Assinatura / resp. | `[TODO]` | `TextObject` |

## Regras gerais

- Margens, unidades, tamanho de papel: `[TODO: extrair de .frx; não alterar por relatório]`.
- Expressões usam nomes dos parâmetros/datasources registrados — contrato com o C# (`RegisterData`), nunca renomear sem sincronizar.
- Idade de texto em pt-BR; datas `[TODO: formato]`.
- Valores de um relatório não viram exceção sem aval — divergência documentada aqui, não no template.