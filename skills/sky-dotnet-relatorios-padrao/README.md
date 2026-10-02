# Padrão Visual de Relatórios Sky — FastReport (.frx)

Guia de leitura rápida do padrão visual usado nos relatórios da Sky
(templates FastReport `.frx`). Para a especificação técnica completa
(tipografia, alturas de banda, grid, checklist, proibidos) veja
[references/padrao-visual-relatorios.md](references/padrao-visual-relatorios.md).
Para a mecânica do FastReport (`RegisterData`, `Prepare`, export) use a skill
`fastreport-dotnet`.

> Padrão em **preto e branco**, fonte **Arial**, A4, margens **15 mm** nos 4
> lados. Exemplos nas duas extremidades: `examples/` tem os gerados pela
> skill e as referências (não geradas) — ver catálogo na SKILL.md.

---

## 1. Cabeçalho

```
┌────────────────────────────────────────────────────┐
│  TÍTULO DO RELATÓRIO                 14 pt bold    │
│  Subtítulo do relatório               9 pt         │
│  ───────────────────────────────────────────────── │  ← divisória cinza
│  Período: ... │ Cliente: X │ Filial: Y   7.5 pt    │  ← área de filtros
│  ───────────────────────────────────────────────── │  ← divisória cinza
└────────────────────────────────────────────────────┘
```

- **Título** — 14 pt bold, alinhado à esquerda.
- **Subtítulo** — 9 pt regular, esquerda.
- **Divisória cinza** após o subtítulo e após a linha de filtros.
- **Área de filtros selecionados** — linha própria entre as duas divisórias:
  7.5 pt, rótulos em bold e valores em regular, **cinza 50%* (ex.:
  `Período: 01/01 a 31/01 │ Cliente: X │ Filial: Y`).
- **Opcional no topo direito** — moeda/classificação (`BRL (R$)`) 7.5 pt.

## 2. Cabeçalho de colunas (linha de detalhe do cabeçalho)

```
│  DATA | ORIGEM | PROTOCOLO | RECIBO | VALOR      │  7.5 pt bold
│  ──────────────────────────────────────────────── │  ← fechado com divisórias
```

- 7.5 pt **bold**, alinhamento por tipo de coluna.
- **Fechado com divisórias pretas finas antes e depois** (na borda da banda).
- Colunas compostas podem ter 2 linhas (ex.: `FORNECEDOR /` + `BENEFICIÁRIO`).
- Alinhamento fixo: texto/código/data **esquerda**; números **direita**
  (alinhados pelo último dígito; sinal negativo não desloca).

## 3. Área do filtro selecionado

A linha `Período: ... │ Cliente: X │ Filial: Y` (item do cabeçalho) é o local
padrão de **filtros selecionados** no relatório: sempre entre o subtítulo e o
cabeçalho de colunas, separada por divisórias cinzas. Parâmetros de relatório
vêm do C# (`SetParameterValue`) — nomes são contrato com o template.

## 4. As 3 versões de layout

O corpo do relatório muda conforme a agregação dos dados:

### Versão A — Sem grupo (listagem simples) — `Exemplo05`

```
Cabeçalho
Cabeçalho de colunas
Linhas de detalhe            (8 pt regular, na margem)
TOTAL GERAL DO RELATÓRIO     (preta acima e abaixo)
```

Quando usar: listagem pura de registros, sem agrupamento.

### Versão B — Somente grupo — `Exemplo02` / `Exemplo03`

```
Cabeçalho
Grupo                        10.5 pt bold + divisória preta abaixo
Cabeçalho de colunas         (1 por grupo)
Linhas de detalhe
── cinza ──  TOTAL GRUPO ... R$  (linha única 8 pt)
TOTAL GERAL DO RELATÓRIO
```

Quando usar: um nível de agrupamento (ex.: por tipo, por nota).

### Versão C — Grupo + Subgrupo — `Exemplo04`

```
Cabeçalho
Grupo                        10.5 pt bold, na margem + divisória abaixo
  Subgrupo                   9 pt bold
  Cabeçalho de colunas       (repete a cada subgrupo)
  Linhas de detalhe
  ── cinza ──  TOTAL SUBGRUPO
  (próximo subgrupo: repete cabeçalho + detalhe + total)
── cinza ──  TOTAL GRUPO  (bloco)
TOTAL GERAL DO RELATÓRIO
```

Quando usar: dois níveis de agrupamento (ex.: nota de entrega → tipo de
ocorrência).

**Indentação (versão C):** o grupo fica na margem e **todo o conteúdo sob
ele** (subgrupo, colunas, detalhe e totais) é indentado em **+13.5 pt**; as
linhas de borda das bandas de conteúdo acompanham a indentação.

## 5. Totalizadores

- **TOTAL SUBGRUPO** — linha única, 8 pt bold–itálico, cinza acima/abaixo.
- **TOTAL GRUPO** — bloco (rótulo 8.5 + valores 8 bold com `R$`), cinza
  acima/abaixo; sem subgrupo = linha única.
- **TOTAL GERAL DO RELATÓRIO** — bloco: rótulo 9.5 / valores 10 bold com
  `R$`, pretas acima e abaixo.
- `R$` aparece **só nos totalizadores** (linhas de detalhe sem símbolo).
- Quando há múltiplas colunas de valor (orçado/realizado/desvio), o bloco
  ganha mini-cabeçalho 7 pt.

## 6. Rodapé

```
│ ───────────────────────────────────────────────── │  ← divisória cinza
│  Emissão: 02/10/2026 16:00   Operador: SISTEMA    │  Página 1 de 1
│  (esquerda)                   (centro)            │  (direita)
```

- Toda página, **divisória cinza** no topo.
- Texto **8 pt, cinza 50%** — detalhe sutil.
- Três posições fixas: **data de impressão** (esquerda), **usuário**
  (centro), **`Página N de M`** (direita).

---

## Mais

- **Alturas de banda em grid de 8 pt**, texto centralizado verticalmente na
  banda (`VertAlign=Center`).
- **Conteúdo longo:** `WordWrap` + respiro na coluna seguinte + banda cresce
  (`CanGrow`).
- **Checklist pré-geração e lista de proibidos** no reference.
- **Divisão de trabalho:** este padrão define o visual; gerar/editar o `.frx`
  é da skill `fastreport-dotnet`.