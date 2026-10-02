# Padrão Visual de Relatórios — Sky (.frx)

Guia de **visual**: tipografia, margem, cabeçalho, grupos, linhas de detalhe,
totalizadores e sumário usados nos relatórios FastReport da Sky.

> Padrão em **preto e branco**, validado contra os relatórios de referência em
> `skills/sky-dotnet-relatorios-padrao/examples/`:
> `Exemplo01-Grupo-Subgrupo-Totais.pdf`, `Exemplo01-Grupo-Totais.pdf`,
> `Exemplo01-Somente-Detalhe-SemGrupo.pdf`.
> Revisões futuras ajustam valores aqui, não em cada template.
> Para a mecânica do FastReport (lifecycle, `RegisterData`, export) ver a
> skill `fastreport-dotnet`.

### STOP — leia antes de gerar qualquer relatório

Antes de escrever UMA linha de template (.frx) ou código, verificar:

1. Margens 15 mm (42.6 pt) nos 4 lados — nunca violar.
2. Fonte base **Arial** (regular/bold); sem outra família.
3. Tamanhos da tabela de tipografia — não inventar tamanho.
4. Alturas de banda **múltiplos de 8 pt** — não usar altura "quebrada".
5. Linha divisória sempre na **borda da banda**, não solto no layout.
6. Alinhamento de números pelo **último dígito** (sinal não desloca).
7. Variante de layout escolhida entre as 3 padrão (grupo+subgrupo / só grupo / sem grupo).
8. Nomes de datasource/parâmetros = contrato com o C# (`RegisterData`).

## Folha e margens

| Item | Valor |
|---|---|
| Folha | A4 retrato; paisagem quando a tabela de colunas for larga |
| Margens | 15 mm (≈42.6 pt) nos 4 lados — confirmado no PDF de referência |
| Cor | preto + cinza (divisórias), sem cor de fundo |

## Tipografia (fonte base: Arial)

| Elemento | Tamanho | Estilo | Alinh. |
|---|---|---|---|
| Título do relatório | 14 pt | bold | esquerda |
| Subtítulo | 9 pt | regular | esquerda |
| Linha de filtros selecionados | 7.5 pt | regular (rótulo bold), cinza 50% | esquerda |
| Moeda / classificação (topo dir.) | 7.5 pt | regular | direita |
| Cabeçalho de colunas | 7.5 pt | bold | por tipo de coluna |
| Mini-cabeçalho de totais (ORÇADO/REALIZADO/DESVIO) | 7 pt | bold | por tipo de coluna |
| Grupo | 10.5 pt | bold | esquerda |
| Subgrupo | 9 pt | bold | esquerda |
| Linha de detalhe | 8 pt (faixa 8–10 conforme conteúdo) | regular | por tipo de coluna |
| Nº de documento (NF-e/CT-e…) | 7.5 pt | monoespaçada (Menlo) | esquerda |
| Totalizador de subgrupo — rótulo | 8 pt | bold–itálico | esquerda |
| Totalizador de subgrupo — valores | 8 pt | bold | direita |
| Totalizador de grupo — rótulo | 8.5 pt | bold | esquerda |
| Totalizador de grupo — valores | 8 pt | bold | direita |
| Total geral — rótulo | 9.5 pt | bold | esquerda |
| Total geral — valores | 10 pt | bold | direita |
| Rodapé | 8 pt | regular, **cinza 50%** | esq / centro / dir |

Detalhe: 8 pt padrão; 9–10 pt apenas em linhas curtas; 7.5–8 pt em colunas
com conteúdo extenso.

## Alturas de banda (padrão)

Cada banda tem **altura fixa** — o texto é centralizado verticalmente dentro
da banda e a linha divisória fica na **borda** (superior/inferior) da própria
banda, não solta no layout.

**Centralização vertical obrigatória:** o texto da banda deve ficar com o
mesmo espaço visual acima e abaixo (padding vertical simétrico). Em
FastReport: objeto de texto com `VertAlign = Center` e altura do objeto =
altura da banda. Em geração direta (sem FastReport), o baseline é calculado
para centralizar o **bloco de glifos** (ascendente/descendente), não a linha
de base — senão o texto "flutua" alto na banda.

**Grid de espaçamento: múltiplos de 8 pt** (16 / 24 / 32 / 48). Valores
originais medidos no `Exemplo01` (pitch grupo→subgrupo 21.7, detalhe 29.3,
bloco total grupo 33, bloco total geral 48) foram arredondados para o grid —
o padrão usa o valor de grid, não o medido.

| Banda | Altura (grid) | Medida de origem |
|---|---|---|
| Grupo | 24 pt | ~21.7 pt medido |
| Subgrupo | 24 pt | igual ao grupo |
| Cabeçalho de colunas | 16 pt | 3 linhas de 7.5 pt + respiro |
| Detalhe (1 linha) | 16 pt | linha simples |
| Detalhe (2 linhas — descrição quebra) | 32 pt | pitch da linha = 29.3 pt |
| Totalizador de subgrupo | 16 pt | ~19 pt medido |
| Totalizador de grupo (bloco) | 32 pt | linhas 430.5→463.5 (~33) |
| Total geral (bloco) | 48 pt | linhas 480.8→528.8 |
| Respiro entre blocos de grupo | 8 pt | — |

Regra: a altura **não varia por relatório** e **sempre múltiplo de 8 pt**.
Conteúdo maior que 1 linha quebra dentro da banda (altura 2 linhas de 32 pt);
nunca "empurrar" a banda para acomodar texto. Variantes com coluna única de
valor (sem mini-cabeçalho de totais) usam bloco reduzido: total grupo 24 pt,
total geral 24 pt.

## Divisórias

| Local | Linha |
|---|---|
| Sob o subtítulo e sob a linha de filtros | cinza 50%, 0.75 pt, largura útil |
| Grupo → conteúdo (subgrupo/detalhe) | preta fina (~0.7 pt), da margem esq. |
| Cabeçalho de colunas | preta fina ~0.7 pt **antes e depois** do bloco |
| Totalizador (subgrupo/grupo) | cinza acima e abaixo do bloco |
| Total geral | preta acima; base reforçada (dupla) |
| Rodapé | cinza acima do texto |

> **Subgrupo não recebe divisória** — apenas o grupo principal traça a linha
> (conforme os exemplos de referência).

## Cabeçalho (PageHeaderBand)

- Tudo alinhado à esquerda, na ordem:
  1. `Título do relatório` — 14 pt bold
  2. `Subtítulo` — 9 pt
  3. `Filtros: Período ... │ Cliente: X │ Filial: Y` — 7.5 pt, cinza 50%
- Topo direito: `CLASSIFICAÇÃO CONTÁBIL: 3.1.00` / `BRL (R$)` — 7.5 pt.
- Divisória cinza sob o subtítulo e sob os filtros.
- Cabeçalho de colunas 7.5 pt bold; colunas compostas em **2 linhas**
  (ex.: `FORNECEDOR /` + `BENEFICIÁRIO`).

## Alinhamento de colunas (regra fixa)

| Tipo de coluna | Alinhamento |
|---|---|
| Descrição / texto | esquerda |
| Código | esquerda |
| Data | esquerda |
| Nº de documento | esquerda |
| Quantidade | direita |
| Valor unitário | direita |
| Valor total / orçado / realizado / desvio | direita |

- Números alinhados **pelo último dígito** (mesma precisão decimal).
- Sinal negativo à **esquerda do número**, sem deslocar os dígitos
  (ex.: `-58,03` alinha o `3` com `58,03`).
- Moeda: **sem `R$` nas linhas de detalhe**; `R$` presente nos totalizadores
  (grupo/geral); `BRL (R$)`: apenas no topo direito / cabeçalho.

## Grupos (GroupHeaderBand / GroupFooterBand)

- Grupo: **10.5 pt bold**, rótulo à esquerda.
- Subgrupo: **9 pt bold**, rótulo à esquerda.
- Divisória preta fina da margem esq. apenas **sob o grupo principal**;
  subgrupo segue direto para o cabeçalho de colunas, sem divisória.
- Subtotais ao final de cada nível, hierarquia `grupo + subgrupo + detalhe`.

## Linhas de detalhe (DataBand)

- Fonte 8 pt (7.5–8 pt para conteúdo extenso); nº doc em monoespaçada 7.5 pt.
- Descrição pode quebrar em 2 linhas; altura da linha acompanha o conteúdo
  (pitch ≈ 29 pt com 2 linhas no exemplo de referência).
- Sem cor alternada (zebra) por padrão.

## Variações de layout (3 formas padrão)

A estrutura muda conforme agregação — os três exemplos de referência:

### 1. Grupo + Subgrupo — `Exemplo01-Grupo-Subgrupo-Totais.pdf`

```
Cabeçalho (título/subtítulo/filtros + divisórias)
Grupo           10.5 bold, esq        + divisória abaixo
  Subgrupo      9 bold, esq           (sem divisória)
  Cabeçalho de colunas                (repete a cada subgrupo)
  Detalhe
  TOTAL SUBGRUPO        linha única 8 bold-itálico
  (próximo subgrupo: repete cabeçalho + detalhe + total)
TOTAL GRUPO            bloco: rótulo 8.5 + mini-cabeçalho + valores R$ 8
TOTAL GERAL            bloco: rótulo 9.5 + mini-cabeçalho + valores R$ 10
```

### 2. Somente Grupo — `Exemplo01-Grupo-Totais.pdf`

```
Cabeçalho
Grupo           10.5 bold, esq        + divisória abaixo
Cabeçalho de colunas
Detalhe                              (sem subgrupo)
TOTAL GRUPO            linha única 8: rótulo + valores R$
TOTAL GERAL            bloco: rótulo 9.5 + mini-cabeçalho + valores R$ 10
```

### 3. Sem grupo (só detalhe) — `Exemplo01-Somente-Detalhe-SemGrupo.pdf`

```
Cabeçalho
Cabeçalho de colunas
Detalhe
TOTAL GERAL            bloco: rótulo 9.5 + mini-cabeçalho + valores R$ 10
```

### Diferenças-chave

| Elemento | Grupo+Subgrupo | Somente Grupo | Sem grupo |
|---|---|---|---|
| Grupo (10.5 bold + divisória) | sim | sim | — |
| Subgrupo (9 bold, sem divisória) | sim | — | — |
| Cabeçalho de colunas | repete por subgrupo | 1 por grupo | 1 |
| TOTAL SUBGRUPO (linha única) | sim | — | — |
| TOTAL GRUPO | bloco (mini-cabeçalho) | linha única | — |
| TOTAL GERAL | bloco completo | bloco completo | bloco completo |

Regra: o **cabeçalho de colunas repete antes de cada bloco de detalhe** (após
cada subgrupo e após cada grupo). Total geral sempre presente, sempre bloco
completo.

## Totalizadores e sumário

**Bloco de totais:** quando os valores formam múltiplas colunas
(orçado/realizado/desvio), o bloco traz **mini-cabeçalho 7 pt** acima dos
valores (`TOTAL ORÇADO ... TOTAL REALIZADO ... DESVIO ...`). Quando existe
**uma única linha de total**, sem mini-cabeçalho (linha única 8 pt).

- **Subgrupo**: linha única — rótulo `TOTAL SUBGRUPO x.y` 8 pt bold–itálico
  à esquerda; valores 8 pt bold à direita.
- **Grupo com subgrupo**: bloco 2 linhas — rótulo `TOTAL GRUPO ...` 8.5 pt
  bold + mini-cabeçalho das colunas de valores (7 pt) + valores 8 pt bold com
  `R$`. Linhas cinza acima e abaixo do bloco.
- **Grupo sem subgrupo**: linha única 8 pt — rótulo `TOTAL GRUPO ...` +
  valores com `R$` à direita.
- **Total geral**: sempre bloco completo — rótulo `TOTAL GERAL DO RELATÓRIO`
  9.5 pt bold + mini-cabeçalho (7 pt) + valores 10 pt bold com `R$`. Linha
  preta acima; base reforçada (dupla).
- Texto auxiliar opcional (`Espaço para detalhamento se necessário`): 7 pt.

**Resumo da regra:** total geral = bloco com mini-cabeçalho sempre; total de
grupo = bloco com mini-cabeçalho **apenas quando há subgrupos**, senão linha
única; total de subgrupo = linha única sempre.

## Rodapé (PageFooterBand)

Presente **no final de todas as páginas**, sempre com divisória:

- **Linha divisória cinza** acima do texto, largura útil.
- Texto **8 pt, cinza 50%** — detalhe sutil, sem competir com o conteúdo.
- Texto recuado **3 espaços** das margens laterais.
- Três posições fixas:
  - **esquerda**: data de impressão (`dd/mm/aaaa hh:mm`)
  - **centro**: usuário que gerou o relatório
  - **direita**: `Página N de M`

## Regras gerais

- Margens, papel e unidades **não variam por relatório** — divergência só com
  aval, registrada aqui.
- Expressões usam nomes dos parâmetros/datasources registrados — contrato com
  o C# (`RegisterData`); nunca renomear sem sincronizar.
- Texto em pt-BR. Datas no formato `dd/mm/aaaa`.
- Layout vertical (A4 retrato) por padrão; horizontal (paisagem) quando o
  conteúdo da tabela exigir.

## Proibidos

| Item | Por quê |
|---|---|
| Fonte fora de Arial (Calibri, Segoe UI, Times, etc.) | famílias diferentes quebram a identidade |
| Negrito nas linhas de detalhe | só cabeçalho, grupo/subgrupo e totalizadores são bold |
| Cor fora do preto/cinza (inclusive nas divisórias) | relatório é B&W |
| Altura de banda fora do grid de 8 pt | espaçamento inconsistente entre relatórios |
| Texto deslocado verticalmente na banda (não centralizado) | quebra o alinhamento visual — usar `VertAlign=Center` |
| Linha divisória solta (fora da borda da banda) | desalinha quando conteúdo muda |
| Número sem alinhamento pelo último dígito | coluna fica "tremida" |
| `R$` nas linhas de detalhe | só em totalizadores (grupo/geral) |
| Texto centralizado no corpo | alinhamento padrão é esquerda (números: direita) |
| Mudar margem/papel/unidades por relatório | divergência só com aval, registrada aqui |

## Checklist pré-geração

Antes de entregar/exportar o relatório, conferir:

- [ ] Margens 15 mm nos 4 lados
- [ ] Tipografia conforme tabela (Arial, tamanhos exatos)
- [ ] Bandas com altura múltiplo de 8 pt, texto **centralizado verticalmente** (padding simétrico / `VertAlign=Center`)
- [ ] Divisórias na borda das bandas (cabeçalho de colunas: antes e depois;
      totalizadores: cinza antes e depois; total geral: preta + base dupla)
- [ ] Alinhamento de colunas: texto/código/data esq, números dir pelo último dígito
- [ ] Sinal negativo à esquerda, sem deslocar dígitos
- [ ] Moeda: sem `R$` no detalhe, com `R$` nos totalizadores
- [ ] Rodapé com divisória cinza, data impressão (esq) / usuário (centro) / `Página N de M` (dir)
- [ ] Variante de layout correta (grupo+subgrupo / só grupo / sem grupo)
- [ ] Datas `dd/mm/aaaa`, texto pt-BR
- [ ] Nomes de datasource/parâmetros sincronizados com o C#