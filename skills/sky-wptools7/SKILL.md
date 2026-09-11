---
name: sky-wptools7
description: "Regras e padrões de uso do componente WPTools 7 para Delphi 7: TWPRichText, cursor e texto (CPPosition, MovePosition, InputString), seleção e formatação (SelectedTextAttr/WPAT_*), objetos de texto (TextObjects.Insert, wpobj*), load/save de RTF (streams e arquivos) e impressão (PrintPageOnCanvas/PaintPageOnCanvas)."
---

# sky-wptools7

## Quando usar

Ative esta skill ao escrever, editar ou revisar código Delphi 7 que manipula o
componente WPTools — especificamente `TWPRichText` e a API de `WPRTEDefs`.
Cobre: edição de texto rico, navegação por cursor, formatação da seleção,
inserção de imagens/objetos, persistência de RTF e impressão em canvas.

## Fonte da verdade

A API documentada aqui segue o **código-fonte oficial do componente**:

`<raiz>/delphi/7/lib/WPTools7/Source`

Unidades centrais:
- `WPRTEDefs.pas` — tipos e classes principais (TWPRichTextData, TWPTextObj,
  atributos de texto, coleções de objetos).
- `WPCTRMemo.pas` — `TWPCustomRtfEdit` (base de `TWPRichText`): cursor,
  input, impressão em canvas.
- `WPCTRRICH.pas` — `TWPRichText` (controle rico completo).
- `WPIOWPTools.pas`, `WPIOReadRTF.pas`, `WPIOWriteRTF.pas` — persistência.
- `WPUtil.pas` — utilitários.

## Tipos centrais

| Tipo | Papel |
|---|---|
| `TWPRichText` | Controle de texto rico (herda `TWPCustomRtfEdit`). |
| `TWPCustomRtfEdit` | Base: cursor, seleção, input, `PrintPageOnCanvas`. |
| `TWPTextObj` | Objeto embutido no texto (imagem, caixa de texto, merge field, etc.). |
| `TWPTextObjType` | Tipo do objeto: `wpobjCustom`, `wpobjMergeField`, `wpobjHyperlink`, `wpobjBookmark`, `wpobjTextObject`, `wpobjImage`, `wpobjTextBox`, `wpobjContainer`, `wpobjHorizontalLine`, `wpobjPageSize`, `wpobjPageProps`, `wpobjFootnote`, `wpobjAnnotation`, `wpobjCode`, `wpobjSPANStyle`, `wpobjReference`, `wpobjTextProtection`. |
| `TTextObjType` | Modo de posicionamento do objeto: `wpotChar`, `wpotPar`, `wpotPage`. |
| `TTextObjWrap` | Modo de quebra: `wpwrAutomatic`, entre outros. |
| `TTextHeader` | Cabeçalho/rodapé da página. |

## Padrões de código por operação

### Abrir e salvar RTF

Usar streams para fluxos de memória/blob e arquivos para RTF em disco.
O modo de escrita é controlado por `WriteRTFMode` (`wobAutomatic` recomendado).

```pascal
// A partir de um stream
RichEdit.LoadFromStream(msTexto);
RichEdit.SaveToStream(msTexto);

// A partir de arquivo
RichEdit.LoadFromFile('documento.rtf');
RichEdit.SaveToFile('documento.rtf');
```

`LoadFromString` / `SaveToString` aceitam um `FormatString` (ex.: `'RTF'`):

```pascal
RichEdit.LoadFromString(sTextoRTF, 'RTF');
sTextoRTF := RichEdit.SaveToString('RTF');
```

### Cursor e inserção de texto

O cursor é acessado por `CPPosition` (posição de caractere). Navegar com
`MovePosition(Modo, DoSelection)` — passar `True` em `DoSelection` estende a
seleção. Inserir texto no cursor com `InputString`.

```pascal
RichEdit.CPPosition := 0;                       // ir ao início
RichEdit.MovePosition(wpmHome, False);          // início do documento
RichEdit.MovePosition(wpmEnd, False);           // fim do documento
RichEdit.InputString('Texto no cursor');
RichEdit.InputString(#13);                      // nova linha
```

Modos de `MovePosition` (em `WPCTRMemo.pas`): `wpmHome`, `wpmEnd`,
`wpmCLeft`, `wpmCRight`, `wpmCUp`, `wpmCDown`, `wpmWLeft`, `wpmWRight`,
`wpmLStart`, `wpmLEnd`, `wpmPagUp`, `wpmPagDown`, `wpmColumnLeft`,
`wpmRowUp`, `wpmStartOfSelection`, `wpmNextLayer`, `wpmPrevLayer`.

### Seleção e formatação

`SelStart` / `SelLength` delimitam a seleção. A formatação do texto selecionado
usa `SelectedTextAttr` com o conjunto `ASet`/`ADel` e constantes `WPAT_*`.

```pascal
RichEdit.SelStart := RichEdit.CPPosition;
RichEdit.SelLength := n;

// Definir/remover atributo na seleção
RichEdit.SelectedTextAttr.ADel(WPAT_LineHeight);
RichEdit.SelectedTextAttr.ASet(WPAT_LineHeight, 0);
RichEdit.SelectedTextAttr.ADel(WPAT_SpaceBetween);
RichEdit.SelectedTextAttr.ASet(WPAT_SpaceBetween, -4);
```

### Imagem e objetos de texto

Objetos são manipulados pela coleção `TextObjects`. O tipo de objeto é
`wpobjImage` (para imagens), `wpobjTextBox`, `wpobjContainer`, etc. — não usar
nomes antigos/legados. Modos padrão de posicionamento e quebra são definidos
antes da inserção.

```pascal
// Configurar comportamento padrão dos objetos
RichEdit.TextObjects.DefaultWrapMode := wpwrAutomatic;
RichEdit.TextObjects.DefaultPositionMode := wpotChar;

// Inserir uma imagem a partir de um TGraphic/TPersistent
var
  NovoObj: TWPTextObj;
begin
  NovoObj := RichEdit.TextObjects.Insert(imgGraphic, imgGraphic.Width, imgGraphic.Height);
  // Posicionar e dimensionar o objeto criado
end;
```

Métodos relevantes da coleção (`TWPRTFTextObjects`):
- `Insert(data: TPersistent; w, h: Integer; ...): TWPTextObj` — insere objeto
  a partir de um `TPersistent` (ex.: `TGraphic`).
- `InsertNewObject(ObjType: TWPTextObjType): TWPTextObj` — insere pelo tipo.
- `InsertTextBox(w, h: Integer; par: TParagraph): TWPTextObj` — caixa de texto.
- `ObjCount` / `Count` — número de objetos.
- Propriedades: `AtCP`, `Selected`, `SelectedObj`, `DefaultWrapMode`,
  `DefaultPositionMode`, `DefaultRelX`, `DefaultRelY`.

### Impressão em canvas

Para renderizar uma página em um canvas (ex.: `Printer.Canvas`), o método
recomendado do componente é `PaintPageOnCanvas`. `PrintPageOnCanvas` é
deprecated (compatibilidade com WPTools 4) — preferir o novo.

```pascal
// Recomendado (WPTools 7)
RichEdit.PaintPageOnCanvas(PaginaNum, X, Y, Largura, Altura, DestCanvas);

// Compatibilidade (deprecated, herança WPTools 4)
RichEdit.PrintPageOnCanvas(DestCanvas, Rect(0, 0, Largura, Altura), PaginaNum, [ppmUseBorders], 100);
```

### Diálogos embutidos

O WPTools oferece diálogos nativos: `ReplaceDialog`, `WPSymbolDlg`,
`WPTabDlg`, `WPBulletDlg`, `WPParagraphPropDlg`, `WPPagePropDlg`,
`WPParagraphBorderDlg`, `WPStyleScroller`, `WPRuler`.

```pascal
RichEdit.ReplaceDialog;  // substituição de texto
```

## Armadilhas

- **`PrintPageOnCanvas` é deprecated** no WPTools 7. Em código novo usar
  `PaintPageOnCanvas`.
- **Nomes de objetos**: o tipo de objeto embutido é `wpobjImage` /
  `wpobjTextBox` etc. — não usar identificadores legados.
- **Delphi 7 = ANSI string**. Texto com acento: preferir escapes de código
  Delphi (`#231`, `#245`) ou cuidar da codificação do arquivo; `InputStringW`
  e `LoadFromString(WideString)` existem para texto Unicode quando necessário.
- Preservar o encoding original de arquivos `.pas` editados (ANSI/LATIN1 sem
  BOM ou UTF-8 com BOM) — nunca gravar UTF-8 sem BOM.
- `WriteRTFMode := wobAutomatic` evita duplicar atributos ao salvar RTF.

## Referências

- Fonte oficial do componente: `<raiz>/delphi/7/lib/WPTools7/Source`.
- Convenções gerais Delphi da Sky: ative a skill `sky-delphi`.
