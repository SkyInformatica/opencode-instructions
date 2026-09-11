---
name: sky-devexpress
description: "Regras e padrões de uso dos componentes DevExpress VCL (linha cx*): TcxGrid/TcxGridDBTableView/TcxGridDBColumn, editores cxEdit (TcxTextEdit, TcxCurrencyEdit, TcxComboBox, TcxCheckBox), TcxButton, TcxPageControl/TcxTabSheet, TcxTreeList/TcxTreeListNode, TdxBarManager, look&feel e skins. Cobre Delphi 7 (ANSI string) e Delphi 10.2 (Unicode)."
---

# sky-devexpress

## Quando usar

Ative esta skill ao escrever, editar ou revisar código Delphi que manipula
componentes **DevExpress VCL da linha moderna `cx*`** — `TcxGrid`,
`TcxGridDBTableView`, `TcxGridDBColumn`, editores `Tcx*Edit`, `TcxButton`,
`TcxTabSheet`, `TcxTreeList`, `TdxBarManager`, look&feel/skins.

Vale para projetos com duas versões do componente:
- Delphi 7 (ANSI string) — usa `cxGrid`, `cxEdit`, `cxFilter`,
  `cxButtons`, `cxPC`/`cxPageControl`.
- Delphi 10.2 (Unicode) — mesma linha + `cxTL`/`TcxTreeList`,
  `cxStyles`, `TcxMultiComboBoxFD`.

**Não usar** para os componentes clássicos `TdxDBGrid`/`dx*` (ExpressQuantumGrid
antigo) — API diferente, ver armadilhas.

## Fonte da verdade

A API documentada aqui segue o **código-fonte oficial do componente**:

| Base | Versão | Estrutura esperada |
|---|---|---|
| D7 | DevExpress VCL vol 2.4 (2011) | `<raiz>/delphi/7/lib/__DevExpressVCL2011vol24/ExpressQuantumGrid/Sources/` (e demais `Express*\Sources/`) |
| D7 (alt.) | QuantumGrid 4 | `<raiz>/delphi/7/lib/devexpress/expressquantumgrid 4/delphi 7/copy of sources/` |
| D10.2 | DevExpress VCL 17.2.4 | `<raiz>/delphi/10.2/lib/3rd/DevExpress/17.2.4/Express*\Sources/` |

Unidades centrais (nomes idênticos nas duas versões, salvo nota):

- `cxGrid.pas` — `TcxGrid`, `TcxGridLevel`.
- `cxGridDBTableView.pas` — `TcxGridDBTableView`; `cxGridBandedTableView.pas` —
  `TcxGridDBBandedColumn`; `cxGridTableView.pas` — `TcxGridTableView` (não-DB).
- `cxGridCustomView.pas`, `cxGridCustomTableView.pas` — bases das views.
- `cxGridLevel.pas` — níveis do grid (data root).
- `cxEdit.pas` — base dos editores (`TcxCustomEdit`) + `TcxEditRepository`.
- Editores: `cxTextEdit.pas` (`TcxTextEdit`), `cxMaskEdit.pas`, `cxButtonEdit.pas`
  (`TcxButtonEdit`), `cxCurrencyEdit.pas` (`TcxCurrencyEdit`), `cxCalc.pas`,
  `cxCheckBox.pas`, `cxComboBox.pas`, `cxLookupComboBox.pas`, `cxDateEdit.pas`
  (`cxCalendar.pas`), `cxMemo.pas`, `cxBlobEdit.pas`, `cxSpinEdit.pas`.
- `cxButtons.pas` — `TcxButton`.
- `cxPC.pas` — `TcxPageControl`/`TcxTabSheet`.
- `cxTL.pas`, `cxTreeList.pas` — `TcxTreeList`, `TcxTreeListNode`,
  `TcxTreeListColumn`.
- `dxBar.pas` — `TdxBarManager`, `TdxBarButton`, `TdxBarLargeButton`,
  `TdxBarSeparator` (barras de menu/toolbar).
- `cxLookAndFeelPainters.pas`, `cxLookAndFeels.pas` — `TcxLookAndFeelController`.
- `dxSkins.pas` / `cxSkins.pas` — skin engine; `dxSkinController.pas` —
  `TdxSkinController`.
- `cxFilter.pas` — filtro por critérios (DataController.Filter).
- `cxExport.pas`, `cxExportGridToExcel.pas` — exportação.

## Tipos centrais

| Tipo | Papel |
|---|---|
| `TcxGrid` | Container do grid; contém níveis (`Levels`) e views. |
| `TcxGridLevel` | Nível do grid; `GridView` aponta a view. |
| `TcxGridDBTableView` | View principal com dados de um `DataSet` (via `DataController`). |
| `TcxGridDBColumn` | Coluna da view; `DataBinding.FieldName` liga ao campo. |
| `TcxGridDBBandedColumn` | Coluna de `TcxGridBandedTableView` (bandas/agrupamento visual). |
| `TcxEditRepositoryItem` | Item reutilizável de editor (combo, lookup, check...) atribuído à coluna via `RepositoryItem`. |
| `TcxTreeListNode` | Nó da tree (`TcxTreeList`): `KeyValue`, `Values[]`, `Parent`, `Count`, `GetChild`. |
| `TcxButton` | Botão visual compatível com o tema/look&feel. |
| `TcxEditRepository` | Repositório de editores compartilhados entre colunas. |

## Padrões de código por operação

### Bind de dataset ao grid

A view DB é ligada pelo `DataController`; `KeyFieldNames` define a chave para
navegação/sincronização.

```pascal
GridDBTableView1.DataController.DataSource := DataSource1;
GridDBTableView1.DataController.KeyFieldNames := 'ID';
```

### Colunas por código

```pascal
var
  Coluna: TcxGridDBColumn;
begin
  Coluna := GridDBTableView1.CreateColumn;
  Coluna.DataBinding.FieldName := 'NOME';
  Coluna.Caption := 'Nome';
  Coluna.Width := 200;
  Coluna.Visible := True;
end;
```

No `.dfm`, o vínculo é `DataBinding.FieldName = 'NOME'` — nunca alterar o nome do
campo sem sincronizar com o DataSet.

### Editor customizado por coluna (repository)

Para combo/lookup/check compartilhados entre colunas, usar `TcxEditRepository`
em vez de criar editor inline por coluna.

```pascal
// No form: EditRepository1: TcxEditRepository (dropar o componente)
// Item: TcxEditRepositoryComboBoxItem (criado no designer ou por código)

GridDBTableView1STATUS.RepositoryItem := EditRepository1ComboStatus;

// Preencher itens do combo em runtime
EditRepository1ComboStatus.Properties.Items.Add('ATIVO');
EditRepository1ComboStatus.Properties.Items.Add('CANCELADO');
```

### Seleção e navegação de nós (TcxTreeList)

```pascal
var
  No: TcxTreeListNode;
begin
  No := TreeList1.FocusedNode;      // nó corrente
  if No <> nil then
  begin
    Chave := No.KeyValue;           // valor da coluna de chave
    Valor := No.Values[0];          // valor da coluna 0
    No.Expanded := True;            // expandir
    for I := 0 to No.Count - 1 do   // filhos
      Processa(No.GetChild(I));
  end;
end;
```

`TcxTreeListNode` também existe no grid clássico — na linha moderna usar
sempre `TcxTreeList`/`cxTL`.

### Filtro

Filtro de runtime pelo `DataController.Filter` (unit `cxFilter`):

```pascal
GridDBTableView1.DataController.Filter.Options := [fcoCaseInsensitive];
// Filtro declarativo no designer: FilterBox / FilterRow
// Para critério por código, montar via TcxGridFilterCriteria ou
// GridDBTableView1.DataController.Filter.Root.AddItem(...)
```

Preferir a UI nativa (Filter Row / Filter Box) sempre que possível; critério por
código apenas quando o filtro for dinâmico.

### Exportação

```pascal
// D7 (vol 2.4) e D10.2 (17.2.4)
cxExportGridToExcel(Arquivo, Grid1);          // unit cxExportGridToExcel

// D10.2 (17.2.4) — XLSX nativo
cxExportGridToXLSX(Arquivo, Grid1);           // unit cxExportGridToXLSX
```

### Look & feel e skins

```pascal
// Por controle
Grid1.LookAndFeel.Kind := lfUltraFlat;
Grid1.LookAndFeel.SkinName := 'Office2013White';

// Global (toda a aplicação)
dxSkinController1.SkinName := 'Office2013White';   // TdxSkinController (dxSkinController.pas)
```

## Armadilhas

- **Linha `cx*` ≠ clássica `dx*`**: `TcxGrid`/`TcxGridDBColumn` NÃO é o antigo
  `TdxDBGrid`. Projeto usa só a moderna — não introduzir código `dx*`.
- **Duas versões de fonte**: vol 2.4 (D7) e 17.2.4 (D10.2) têm API quase
  idêntica, mas recursos novos (ex.: `cxExportGridToXLSX`, skins mais recentes)
  existem só na 17.2.4. Código compartilhado entre bases deve usar apenas a
  interseção (ex.: `cxExportGridToExcel`).
- **D7 = ANSI string**: texto com acento via escapes (`#231`, `#245`) ou
  cuidado com encoding do arquivo; D10.2 é Unicode (`string` nativa).
- **`DataBinding.FieldName`** no `.dfm` deve bater exatamente com o campo do
  DataSet — erro silencioso de bind é o sintoma mais comum.
- **Nunca gravar UTF-8 sem BOM** ao editar `.pas`/`.dfm` legados (D7 = ANSI/LATIN1
  sem BOM; D10.2 = UTF-8 com BOM). Preservar o encoding original.
- **Fontes de referência**: seguir a estrutura relativa da tabela acima.
  Caminhos variam por máquina — nunca hardcodar no código-fonte.

## Referências

- Fontes oficiais: seguir a estrutura relativa da tabela na seção "Fonte da verdade".
- Convenções gerais Delphi da Sky: ative a skill `sky-delphi`.