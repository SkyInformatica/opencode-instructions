# Padrão Visual de Relatórios — Sky (.frx)

Guia de **visual**: tipografia, margem, cabeçalho, grupos, linhas de detalhe,
totalizadores e sumário usados nos relatórios FastReport da Sky.

> Padrão **desenhado em preto e branco** (aprovado em design). Revisões
> futuras ajustam valores aqui, não em cada template.
> Para a mecânica do FastReport (lifecycle, `RegisterData`, export) ver a
> skill `fastreport-dotnet`.

## Folha e margens

| Item | Valor |
|---|---|
| Folha | A4 retrato; paisagem quando a tabela de colunas for larga |
| Margens | 15 mm nos 4 lados (não violar) |
| Cor | preto + cinza (divisórias e linha de filtros), sem cor de fundo |

## Tipografia (fonte base: Arial)

| Elemento | Tamanho | Estilo | Alinh. |
|---|---|---|---|
| Título do relatório | 14 pt | bold | esquerda |
| Subtítulo | 10 pt | regular | esquerda |
| Linha de filtros selecionados | 8.5 pt | regular, cinza 50% | esquerda |
| Cabeçalho de colunas | 8.5–9 pt | bold | por tipo de coluna |
| Grupo | 10 pt | bold | esquerda |
| Subgrupo | 9 pt | bold | esquerda |
| Linha de detalhe | 8–10 pt | regular | por tipo de coluna |
| Totalizador (subtotal) | 9–10 pt | bold | direita (valor) |
| Total geral | 10 pt | bold | direita (valor) |
| Nº de página | 8 pt | regular | canto inferior direito |

Detalhe: 8 pt para colunas com conteúdo extenso, 10 pt para linhas curtas;
**padrão 9 pt**.

## Cabeçalho (PageHeaderBand)

- Título, subtítulo e linha de filtros **alinhados à esquerda**:
  - `Título do relatório` (14 pt bold)
  - `Subtítulo` (10 pt)
  - `Filtros: Período ... │ Cliente: X │ Filial: Y` (8.5 pt, cinza 50%)
- Abaixo da linha de filtros, **linha divisória** (0.5 pt, preta) separando do
  conteúdo.
- Cabeçalho de colunas logo abaixo (negrito), também com divisória inferior.

## Alinhamento de colunas (regra fixa)

| Tipo de coluna | Alinhamento |
|---|---|
| Descrição / texto | esquerda |
| Código | esquerda |
| Data | esquerda |
| Quantidade | direita |
| Valor unitário | direita |
| Valor total | direita |

- Números alinhados **pelo último dígito** (mesma precisão decimal).
- Moeda **sem símbolo na linha**; símbolo apenas no cabeçalho da coluna.

## Grupos (GroupHeaderBand / GroupFooterBand)

- Grupo: fonte **10 pt bold**, rótulo/valor à esquerda.
- Subgrupo: **9 pt bold**, à esquerda.
- **Linha divisória** (0.5 pt) entre o grupo/subgrupo e as linhas de detalhe —
  sempre alinhada à esquerda.
- Hierarquia `grupo + subgrupo + detalhe`: divisória em cada nível, sem
  exceção.
- Subtotais por subgrupo e por grupo no final de cada nível.

## Linhas de detalhe (DataBand)

- Altura compacta; interlinha mínima (sem espaço extra entre linhas).
- Fonte 8–10 pt conforme conteúdo (padrão 9 pt).
- Sem cor alternada (zebra) por padrão.

## Totalizadores e sumário

- Subtotal: **linha divisória 0.5 pt** acima, valor à direita, bold 9–10 pt.
- Total geral: **linha dupla** acima, 10 pt bold, à direita.
- Sumário do relatório (quando houver) segue o mesmo padrão de
  totalizadores.

## Rodapé (PageFooterBand)

- `Página N de M` no **canto inferior direito**, 8 pt.

## Regras gerais

- Margens, papel e unidades **não variam por relatório** — divergência só com
  aval, registrada aqui.
- Expressões usam nomes dos parâmetros/datasources registrados — contrato com
  o C# (`RegisterData`); nunca renomear sem sincronizar.
- Texto em pt-BR. Datas no formato `dd/mm/aaaa`.
- Layout vertical (A4 retrato) por padrão; horizontal (paisagem) quando o
  conteúdo da tabela exigir.