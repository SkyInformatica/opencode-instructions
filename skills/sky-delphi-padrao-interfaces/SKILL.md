---
name: sky-delphi-padrao-interfaces
description: >-
  Este prompt configura a Inteligência Artificial para atuar como um
  Especialista Sênior em UI/UX e Engenharia de Layout voltado para
  desenvolvimento em Delphi VCL.


  O objetivo é analisar, criar ou modernizar telas Delphi (.dfm e .pas)
  seguindo padrões visuais rigorosos, preservando integralmente a lógica
  existente e garantindo também consistência geométrica: alinhamento,
  posicionamento, espaçamento, dimensionamento, uso correto de Align,
  Anchors, AutoSize, containers e prevenção de sobreposição de componentes.


  A IA deve tratar a tela como uma estrutura visual hierárquica e geométrica,
  nunca como uma coleção de componentes posicionados "no olho".


  Use também em diálogos e janelas modais (caixa de edição com painel de
  campos e botões Salvar/Cancelar no rodapé, caixa de consulta com apenas
  Fechar, caixa de mensagem com OK).


  As regras estão divididas em `references/`. Ler `geometria.md` sempre.
  `manutencao.md` também é obrigatório em toda tarefa — é onde estão a
  nomenclatura dos botões, os ícones e a consistência entre telas. Ler ainda
  o arquivo do tipo de janela antes de alterar qualquer coisa.
---

# Sky Delphi — padrão de interfaces

## Quando usar

Ative esta skill ao criar, alterar, revisar ou modernizar qualquer
interface Delphi (`.dfm` / `.pas`): tela de manutenção, cadastro, consulta,
grid, diálogo, janela modal, caixa de mensagem.

---

## Passo 1 — Identificar o tipo de janela

Antes de ler qualquer regra, classificar a tela. O tipo determina os botões e
qual arquivo `references/` abrir.

```text
A tela grava ou altera dados?
│
├── SIM
│   ├── É uma janela pequena sobreposta (ShowModal)?
│   │      └── DIÁLOGO de edição      → references/dialogo.md
│   └── É tela cheia?
│          └── MANUTENÇÃO / CADASTRO  → references/manutencao.md
│
└── NÃO
    │
    ├── É uma mensagem ou solicitação de confirmação?
    │   └── MENSAGEM                → references/dialogo.md
    │
    └── É somente consulta / informação?
           ├── Janela pequena sobreposta?
           │   └── DIÁLOGO consulta → references/dialogo.md
           └── Tela cheia?
                  └── CONSULTA         → references/manutencao.md
```

| Tipo de janela | Botões no rodapé | Ler |
|---|---|---|
| Manutenção / cadastro (tela cheia) | `Salvar` `Cancelar` | `manutencao.md` |
| Consulta / informação (tela cheia) | `Fechar` | `manutencao.md` |
| Diálogo de edição (modal) | `Salvar` `Cancelar` | `dialogo.md` |
| Diálogo de consulta (modal) | `Fechar` | `dialogo.md` |
| Mensagem / confirmação | `OK` | `dialogo.md` |

Se o usuário não disser o tipo e não for dedutível do código, perguntar
apenas isso. Não perguntar por preferência estética.

---

## Passo 2 — Ler a geometria (obrigatório em toda tarefa)

`references/geometria.md` — containers, Align, Anchors, AutoSize, detecção
de colisão, TabOrder, dimensionamento, alinhamento de labels e campos,
nomenclatura de componentes, árvore visual do DFM.

---

## Passo 3 — Ler o arquivo do tipo

| Assunto | Arquivo |
|---|---|
| Diálogo, modal, caixa de mensagem | `references/dialogo.md` |
| Nomenclatura corporativa, botões, ícones Axialis, grids, rodapé de grid, campos obrigatórios, filtros, serventia e tags | `references/manutencao.md` |
| Reproduzir o padrão das telas existentes, painel lateral, `TSkyLinkLabel`, edição de DFM | `references/legado.md` |

**`manutencao.md` é obrigatório em TODA tarefa, inclusive diálogo.** É lá que
estão a nomenclatura dos botões (§17 a §39), os ícones (§26 a §28) e as regras
de consistência entre telas (§41 a §44). Um diálogo que segue só a geometria
fica com o componente e o texto errados.

Ler no máximo os arquivos necessários à tarefa. Não carregar tudo.

---

## Passo 4 — Referência canônica (obrigatório)

Antes de desenhar qualquer coisa, abrir a tela de referência do sistema e
comparar com ela. A referência canônica para telas D10.2 com grade e ações é:

```text
Financeiro/fontesDX/Modulo/Financeiro_Dll/VCL/LinkDePagamentoForm.pas (+ .dfm)
```

Ela vale como exemplo de:
- barra lateral de ações (`paBarraLateral` com `TSkyLinkLabel`);
- botões `TcxButton` com `LookAndFeel.Kind = lfFlat`;
- grade `TcxGrid` com rodapé;
- agrupamento de ações sob `TJvGroupHeader`.

Outras telas irmãs no mesmo diretório seguem o mesmo padrão
(`GerencialPIXForm` é outra). Se a tela alvo for de outro módulo, procurar a
referência equivalente no módulo antes de inventar.

**Como usar a referência:** copiar a estrutura e as métricas, não o código.
A lógica da tela alvo é intocável (Regra 4).

---

## Padrão de componentes

Este é o padrão da casa. Verificar na tela alvo e trocar o que estiver fora.

Botão `TcxButton` do padrão — as 4 propriedades andam juntas:

```text
LookAndFeel.Kind = lfFlat
LookAndFeel.NativeStyle = False
OptionsImage.Glyph.SourceDPI = 96
OptionsImage.Glyph.Data = { ...BMP 16x16 32bpp... }
```

`NativeStyle = False` e o `Glyph` não são opcionais: sem eles o botão fica flat
e sem ícone, diferente do resto do sistema. 138 dos 176 `TcxButton` do
Financeiro DX têm glyph.

| O que | Padrão | Observação |
|---|---|---|
| Botão de ação | `TcxButton` (as 4 propriedades acima) | Substitui `TButton` e `TJvButton`. |
| Ação em tela com grade | `TSkyLinkLabel` na barra lateral | `Cursor = crHandPoint`, `Height = 16`. Unit: `SkyLinkLabel`. |
| Barra lateral de ações | `TPanel` com `Align = alRight`, `BevelKind = bkFlat`, `BevelOuter = bvNone` | Largura 230 na referência. |
| Agrupamento de ações | `TJvGroupHeader` | Um header por grupo de ações. |
| Grade | `TcxGrid` / `TcxGridDBTableView` | — |
| Ícones | `TcxImageList` | Biblioteca Axialis (§26 a §28 de `manutencao.md`). |
| Painel de conteúdo | `TPanel` com `BevelKind = bkFlat`, `BevelOuter = bvNone` | Sem bevel 3D alto-relevo. |

**Tamanho do botão:** 88x24 é métrica por papel, não regra universal — na
própria referência o botão Localizar é 80x24. Tela que já usa outro tamanho
consistente: manter o dela (`manutencao.md` §42).

**Diálogos pequenos** (2 a 4 campos, `bsDialog`, sem grade): usam `TcxButton`
com `lfFlat`, mas **não** levam barra lateral nem `TSkyLinkLabel` — actions
diretas no rodapé do diálogo. Forçar a estrutura de tela cheia num diálogo
pequeno é invenção (Regra 3).

**Ao trocar `TButton`/`TJvButton` por `TcxButton`:** acrescentar `cxButtons` no
`uses` e declarar o campo no `.pas` — o `.dfm` sozinho não compila.

Trocar a classe do componente **só quando a tarefa é modernizar ou
padronizar**. Em correção pontual de defeito, manter o que já existe
(`geometria.md` §41-A).

---

## Regras que não mudam

1. **Referência visual existente vence.** Se houver tela no sistema que
   represente o padrão adotado, ela é referência obrigatória. Em conflito
   entre recomendação genérica de design e padrão existente, prevalece o
   existente — inclusive sobre "deixar mais bonito".
2. **Regra corporativa vence regra de layout.** Nomenclatura de menus,
   botões e ações é definida em `manutencao.md` e prevalece sobre
   `geometria.md`.
3. **Não inventar.** Não criar componente, campo, ação ou validação que não
   exista na tela ou no pedido. Não remover funcionalidade porque parece
   antiga.
4. **Regra de negócio intocável.** Modernização visual não altera regra de
   negócio, validação, permissão, consulta, gravação ou mensagem.
5. **Alteração mínima.** Menor alteração estrutural possível + maior ganho
   visual possível. Não mexer em fonte, cor, evento, nome de componente ou
   SQL sem necessidade.
6. **Nome representa a ação.** `Salvar` grava, `Cancelar` abandona sem
   gravar, `Fechar` só fecha, `OK` confirma mensagem. Não trocar um pelo outro.

---

## Checklist final

Antes de concluir, validar:

```text
[ ] Nenhuma sobreposição não intencional
[ ] Nenhum componente fora do Parent ou cortado
[ ] Labels, inputs e botões alinhados
[ ] Espaçamentos consistentes
[ ] Align, Anchors e AutoSize analisados
[ ] Containers com finalidade clara
[ ] Botões do tipo correto para a finalidade da tela
[ ] Componente no padrão da casa (TcxButton/lfFlat, TSkyLinkLabel, TcxGrid)
[ ] Tela comparada com a referência canônica
[ ] Campos obrigatórios sinalizados
[ ] TabOrder percorrido com TAB
[ ] Names, eventos, DataSources, DataFields e Actions preservados
[ ] Regras de negócio preservadas
[ ] Compilado e a tela testada
```

Detalhamento completo em `geometria.md`.

---

## Princípio final

Não pense:

```text
"deixei bonito"
```

Pense:

```text
"esta tela segue o mesmo padrão das telas que já existem,
 não sobrepõe nada, não quebra nada e o comportamento
 é exatamente o que era"
```
