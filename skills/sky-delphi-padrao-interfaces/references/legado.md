# Reprodução do padrão visual existente

Referência visual obrigatória das telas do sistema, mais a ficha técnica extraída dos DFMs `LinkDePagamentoForm` e `GerencialPIXForm` (esqueleto, grade de posições do painel lateral, propriedades canônicas do `TSkyLinkLabel`, `TcxImageList` de ícones, macetes de edição de DFM e a receita passo a passo).

Em conflito entre uma recomendação genérica de design moderno e o padrão visual das telas existentes, prevalece o padrão das telas existentes.

Leia sempre que a tarefa envolver tela existente, painel lateral, `TSkyLinkLabel` ou edição de DFM.

## REPRODUÇÃO FIEL DO PADRÃO VISUAL EXISTENTE

> Este documento complementa `geometria.md` e `manutencao.md`. Em caso de
> conflito entre uma recomendação genérica de design moderno e o padrão visual
> das telas existentes do sistema, prevalece o padrão existente.

Quando houver uma tela existente no sistema que represente o padrão visual adotado pela aplicação, ela deve ser tratada como REFERÊNCIA VISUAL OBRIGATÓRIA.

A IA NÃO deve modernizar, redesenhar ou reinterpretar livremente a interface.

O objetivo é manter a identidade visual e estrutural do sistema legado.

## 1. REGRA PRINCIPAL

Antes de criar ou alterar uma tela Delphi:

1. Procurar telas existentes semelhantes no projeto.
2. Identificar o padrão visual utilizado nessas telas.
3. Reproduzir esse padrão na nova tela.
4. Alterar somente o conteúdo necessário para atender à funcionalidade.
5. Não introduzir padrões visuais de outros projetos ou frameworks sem necessidade.

A aparência de uma tela existente tem prioridade sobre preferências genéricas de UI.

---

# 2. PADRÃO DE REFERÊNCIA — TELA LEGADA DELPHI

A tela de referência apresenta uma estrutura típica de aplicações Delphi legadas:

- formulário compacto;
- conteúdo densamente organizado;
- componentes alinhados por linhas e colunas;
- áreas funcionais claramente delimitadas;
- abas na parte superior;
- área de filtros antes da listagem;
- grid ocupando a maior parte da área central;
- painel lateral direito para ações;
- área inferior para informações auxiliares/status;
- botões e ações agrupados por finalidade;
- utilização consistente de bordas, separadores e GroupBox;
- textos pequenos e objetivos;
- pouco espaço vazio;
- controles visualmente próximos uns dos outros;
- hierarquia visual baseada principalmente em posição, agrupamento e separadores.

Esse padrão deve ser preservado em telas equivalentes.

---

# 3. ESTRUTURA ESPACIAL

Quando a tela possuir uma estrutura semelhante à referência, respeitar a seguinte organização:

```text
┌─────────────────────────────────────────────────────────────┐
│ Abas                                                        │
├─────────────────────────────────────────────────────────────┤
│ Área de filtros / informações para seleção                  │
├─────────────────────────────────────────────────────┬───────┤
│                                                     │       │
│                                                     │ Ações │
│                    GRID / LISTAGEM                  │       │
│                                                     │       │
│                                                     │       │
├─────────────────────────────────────────────────────┴───────┤
│ Informações auxiliares / legenda / status                   │
└─────────────────────────────────────────────────────────────┘
```

Não mover arbitrariamente o painel de ações para cima, para baixo ou para dentro do grid.

Não transformar o painel lateral em uma toolbar horizontal sem que exista uma necessidade explícita.

---

# 4. ÁREA SUPERIOR

A área superior deve concentrar:

- abas;
- filtros;
- campos de pesquisa;
- informações necessárias para localizar registros.

Os campos devem permanecer visualmente alinhados.

Quando vários campos estiverem na mesma linha:

- labels devem possuir alinhamento consistente;
- campos devem possuir alturas semelhantes;
- comboboxes devem possuir larguras proporcionais ao conteúdo;
- campos de texto maiores devem receber o espaço restante;
- botões de pesquisa/localização devem ficar próximos ao último campo;
- evitar espaçamentos diferentes entre controles equivalentes.

Não distribuir os campos pela tela apenas para "preencher espaço".

---

# 5. GRID PRINCIPAL

Quando a tela utilizar um grid:

- o grid deve ocupar a maior área disponível;
- deve possuir alinhamento consistente com os elementos acima;
- colunas devem ser dimensionadas de acordo com seu conteúdo;
- não criar colunas excessivamente largas;
- não deixar grandes áreas vazias;
- informações importantes devem aparecer primeiro;
- colunas secundárias podem utilizar menos espaço;
- manter a densidade visual típica do sistema.

Se o projeto utilizar DevExpress, respeitar os padrões já utilizados pelos demais TcxGrid/TcxGridDBTableView do projeto.

Não substituir um TcxGrid por outro componente apenas por preferência.

---

# 6. PAINEL DE AÇÕES

Quando existir um painel lateral de ações, ele deve permanecer separado visualmente do grid.

As ações devem ser agrupadas por finalidade.

Exemplo:

```text
Ações
------
Pagar
Pagar todos
Cancelar link
Regerar link

Opções
------
Visualizar link
Arquivo envio
Arquivo retorno
Arquivo consulta
Arquivo erro consulta

Relatórios
----------
Imprimir
Imprimir listagem
```

Regras:

- manter agrupamento lógico;
- manter espaçamento pequeno e uniforme;
- ações relacionadas devem ficar próximas;
- títulos de grupos devem possuir hierarquia visual;
- não transformar cada ação em um botão grande e chamativo;
- preservar a aparência compacta característica do sistema.

Quando a ação não estiver disponível, utilizar o mecanismo de habilitação/desabilitação já adotado pelo projeto.

Não substituir automaticamente ações desabilitadas por ocultação.

---

# 7. DENSIDADE VISUAL

O sistema possui uma interface de alta densidade de informação.

Portanto:

NÃO:

- aumentar excessivamente margens;
- adicionar grandes espaços vazios;
- transformar controles pequenos em controles gigantes;
- aumentar fontes sem necessidade;
- criar cards modernos;
- utilizar sombras, gradientes ou efeitos decorativos;
- arredondar todos os componentes;
- utilizar espaçamento típico de interfaces mobile/web modernas.

SIM:

- aproveitar o espaço disponível;
- manter controles próximos;
- preservar alinhamento;
- utilizar separadores;
- utilizar GroupBox quando esse for o padrão;
- manter tamanho de fonte compatível com as telas existentes;
- priorizar quantidade de informação visível.

A interface deve parecer pertencente ao mesmo sistema das telas existentes.

---

# 8. POSICIONAMENTO E ALINHAMENTO

A posição dos componentes deve ser determinada pela relação entre eles, não por coordenadas isoladas.

Ao alterar uma tela:

- preservar margens existentes;
- preservar alinhamentos verticais;
- preservar alinhamentos horizontais;
- manter controles da mesma categoria na mesma linha;
- manter larguras semelhantes para controles equivalentes;
- manter espaçamento consistente.

Se um componente for movido, verificar os componentes vizinhos.

Nunca corrigir somente um componente deixando os demais desalinhados.

---

# 9. REDIMENSIONAMENTO

Quando a tela permitir redimensionamento:

- definir claramente quais áreas crescem;
- o grid normalmente deve absorver o espaço adicional;
- o painel lateral deve manter largura estável, salvo se o padrão existente indicar o contrário;
- a área superior deve manter sua estrutura;
- a área inferior deve permanecer ancorada;
- evitar componentes sobrepostos durante o resize.

Preferir Anchor/Align apropriados ao projeto em vez de depender exclusivamente de coordenadas fixas.

---

# 10. COMPONENTES VISUAIS E NÃO VISUAIS

Não interpretar componentes não visuais como elementos que precisam ser reorganizados visualmente.

Por exemplo:

- TFDQuery;
- TDataSource;
- TPopupMenu;
- TNotificationCenter;
- TcxStyleRepository;
- componentes de relatório;
- componentes de impressão;
- componentes de conexão.

Eles fazem parte da estrutura da tela, mas não devem interferir na composição visual.

Ao modificar o layout, preservar a organização desses componentes no Designer quando possível.

---

# 11. MENUS POPUP E CONTEXT MENU

Se a tela utilizar menus de contexto, preservar:

- hierarquia;
- nomes;
- agrupamentos;
- posição lógica das opções;
- estilo visual;
- relação entre menu e componente que o utiliza.

Não substituir automaticamente um PopupMenu por botões visíveis.

Se o menu existente já resolver a interação, mantê-lo.

---

# 12. REFERÊNCIA VISUAL TEM PRIORIDADE

Se houver conflito entre:

A) uma recomendação genérica de design moderno

e

B) o padrão visual das telas existentes do sistema,

seguir B.

A IA deve perguntar somente quando houver ambiguidade funcional.

Não perguntar simplesmente porque a interface é antiga ou diferente dos padrões modernos.

O objetivo é CONSISTÊNCIA COM O SISTEMA EXISTENTE.

---

# 13. ANÁLISE VISUAL ANTES DA IMPLEMENTAÇÃO

Ao receber uma imagem de uma tela de referência, analisar explicitamente:

1. estrutura geral do formulário;
2. posição das abas;
3. altura das áreas;
4. margens;
5. espaçamento entre controles;
6. alinhamento dos labels;
7. largura dos campos;
8. posição dos botões;
9. tamanho e posição do grid;
10. largura do painel lateral;
11. agrupamento das ações;
12. área inferior;
13. fontes;
14. densidade visual;
15. bordas e separadores;
16. comportamento esperado no redimensionamento.

Depois dessa análise, reproduzir a estrutura.

Não simplesmente "criar uma tela parecida".

---

# 14. REGRA PARA TELAS NOVAS

Se for criada uma tela nova que pertença ao mesmo módulo:

A nova tela deve parecer uma continuação natural das telas existentes.

Exemplo:

Se as telas existentes utilizam:

- GroupBox;
- TcxGrid;
- abas;
- painel lateral;
- botões pequenos;
- fonte compacta;
- campos alinhados;
- bordas simples;

a nova tela deve utilizar o mesmo conjunto de padrões.

Não criar uma tela com:

- cards;
- menus modernos;
- botões grandes;
- ícones gigantes;
- sombras;
- cantos excessivamente arredondados;
- espaçamentos exagerados;

apenas porque esses elementos são considerados modernos.

---

# 15. REGRA DE OURO

"Não redesenhe o sistema. Continue o sistema."

Ao alterar uma tela Delphi existente, a pergunta principal não deve ser:

"Como eu faria essa interface hoje?"

Deve ser:

"Como essa funcionalidade seria implementada visualmente se tivesse sido criada originalmente pelos mesmos desenvolvedores deste sistema?"

A resposta deve determinar o layout.

---
---

# FICHA TÉCNICA DA REFERÊNCIA E RECEITA DE APLICAÇÃO (DFM)

> Extraída dos DFMs `Financeiro/fontesDX/Modulo/Financeiro_Dll/VCL/LinkDePagamentoForm.dfm`
> e `GerencialPIXForm.dfm`. É a seção anterior deste arquivo tornada executável:
> medidas, propriedades e macetes de edição de DFM. Sem esta ficha,
> "reproduzir a referência" vira adivinhação.

## 1. COMO ENCONTRAR A TELA DE REFERÊNCIA

No projeto Financeiro DLL:

```text
grep -l "Align = alRight" *.dfm          → painéis laterais
grep -l "TSkyLinkLabel"  *.dfm           → telas com ações em link
interseção = telas no padrão de painel lateral
```

Telas de referência atuais: `LinkDePagamentoForm` e `GerencialPIXForm`.
`GED.Origem.Manutencao.Form` usa link labels soltos no rodapé (Salvar/Cancelar), não painel.

## 2. ESQUELETO CANÔNICO

```text
Form (BorderWidth 8, Font Tahoma, ClientWidth >= ~1000)
├── pnBotoes      alBottom  h33   BevelOuter bvNone, AlignWithMargins + Margins 0
│   └── btFechar  88x24, Top 5, Left = Width - 88 - 4, Cancel + ModalResult 2
└── paGeral       alTop (h = ClientHeight - 33), BevelOuter bvNone, BorderWidth 1
    ├── paFiltros            alTop     AlignWithMargins, BevelKind bkFlat   TabOrder 0
    │   ├── jvgrphdrFiltro   'Informe os dados para seleção:'  (8, 8..36)
    │   ├── labels           Left 16
    │   ├── campos           Left 64
    │   └── btLocalizar      akTop+akRight, Top centralizado na linha, margem ~8
    ├── paResultados         alClient  AlignWithMargins, bkFlat + bvNone    TabOrder 1
    │   ├── jvgrphdrResult   '<entidade> encontrados:'  (8, 7)
    │   └── grid             Left ~7, Top ~29, alClient ou Anchors LTRB
    └── paBarraLateral       alRight W230, AlignWithMargins, bkFlat+bvNone  TabOrder 2
        └── ver item 3
```

- Filhos de `paGeral` usam `AlignWithMargins = True` com **Margins default (3)** — não declarar `Margins.*`.
- `BorderWidth` do container **desloca** os filhos: `Left/Top = BorderWidth + Margins` (paGeral com `BorderWidth 1` → `Left = 4`). No **Form** o `ClientWidth/ClientHeight` já excluem o `BorderWidth`, então os filhos começam em 0.
- **Margens de irmãos alinhados SOMAM**: gap entre duas áreas = `3 + 3 = 6`. Na referência: filtro ocupa 4..128 e o conteúdo começa em 134.
- `DesignSize` de painel com `BevelKind = bkFlat` = `Width - 4` / `Height - 4`.
- **Rodapé**: `pnBotoes` h33; botão `88x24` em `Top = 5` (centraliza 24 em 33) e **margem direita = 4**:
  `Left = Width_do_painel - 88 - 4`. Na referência: 1002 num client de 1094.
  **Não usar 8 nem 6** — é 4 (o botão fica a 12px da moldura da janela, alinhado com a borda interna das áreas).
- Áreas: `Left/Top` do primeiro filho = `BorderWidth + 3`; o `alClient`/`alRight` começa após a última área `alTop`/`alBottom` **+ 6**.
- Em telas pequenas, encolher a faixa de filtros (ex.: 64) em vez de inchar margens.
- Calcular isso na mão é fonte de erro: ao final, **abrir o form no IDE e salvar** deixa o IDE recalcular `Left/Top/Width/Height` dos controles alinhados — ou confira cada valor com as contas acima.

## 3. PAINEL LATERAL — GRADE DE POSIÇÕES

`paBarraLateral`: `Width = 230`, `Align = alRight`, `BevelKind = bkFlat`, `BevelOuter = bvNone`, `AlignWithMargins = True`.
Headers (`TJvGroupHeader`): `Left 8`, `Height 17`, `Width = 207` (= 230 - 23), `Anchors [akLeft,akTop,akRight]`, `BevelSpace 8`, `Font Tahoma` + `fsBold`.
Links (`TSkyLinkLabel`): `Left 16`, `Height 16`, `Width` ≈ `(caracteres x 6) + 8` (AutoSize recalcula).

Ritmo: itens a cada **21-22 px**; header → 1º item **+19 a +23**; último item → próximo header **+22 a +29**.
Copiar uma das grades abaixo e manter o ritmo:

```text
LinkDePagamentoForm (grupos grandes)      GerencialPIXForm (grupos curtos)
Ações            17                       Ações            17
  item           40  (+23)                  item           40  (+23)
  item           62  (+22)                  item           62  (+22)
  item           83  (+21)                  item           83  (+21)
  item          105  (+22)                Opções          112  (+29)
Opções          127  (+22)                  item          131  (+19)
  item          146  (+19)                Relatórios      160  (+29)
  ...           168, 190, 212, 234         item          183  (+23)
Relatórios      263  (+29)                  item          205  (+22)
  item          286  (+23)
  item          308  (+22)
```

Nomes de grupo: **Ações** (operar o registro), **Opções** (recursos auxiliares: importar, visualizar arquivo/link), **Relatórios** (impressões).

## 4. PROPRIEDADES DO `TSkyLinkLabel` (conjunto canônico)

```text
Left = 16          Top = <grade>       Height = 16
Cursor = crHandPoint
Caption = '<ação>'                    Enabled / Visible quando aplicável
Color = clBtnFace
Font.Charset = DEFAULT_CHARSET
Font.Color = 12147712
Font.Height = -11
Font.Name = 'Tahoma'
Font.Style = []
ParentColor = False
ParentFont = False
Transparent = True
OnClick = <handler>
AutoOpenURL = False
HotTrackFont.Charset = DEFAULT_CHARSET
HotTrackFont.Color = clWindowText
HotTrackFont.Height = -11
HotTrackFont.Name = 'Tahoma'
HotTrackFont.Style = []
Images = ilImagensIcones
ImageIndex = <n>
LinkLabelUseManager = True
```

`LinkLabelUseManager = True` só tem efeito se houver `TSkyLinkLabelManager` atribuído; manter a propriedade por paridade.

## 5. ÍCONES — `ilImagensIcones` LOCAL

O padrão do projeto é **`TcxImageList` local na tela** (não `dmInterfaceStyle16.ilBasic`):

```text
object ilImagensIcones: TcxImageList
  SourceDPI = 96
  FormatVersion = 1
  DesignInfo = <int>
  ImageInfo = <
    item
      Image.Data = {
        36040000424D...}          // 64 chars hex por linha, indent 10
    end
    item
      ...
    end>                          // ATENÇÃO: o último item fecha com `end>`
end
```

- Item = **4 bytes de tamanho (little-endian) + BMP**. Para 16x16x32bpp: BMP = 1078 bytes = `0x436` → prefixo hex `36040000`. Para 32x32: `36100000`.
- Reaproveitar ícone existente: `TcxButton.OptionsImage.Glyph.Data` já é o BMP (`424D...`); basta prefixar o tamanho.
- Validar: `len(hex) == 2164` (16x16) e prefixo `36040000424D`.

## 6. MACETES DE EDIÇÃO DO DFM (erros que quebram a tela)

```text
[ ] Encoding: .pas e .dfm em Windows-1252 (ANSI), CRLF, SEM BOM.
    Acentos em string de DFM: 'padr'#227'o' (nunca byte cru).
[ ] NUNCA renomear componente existente, perder OnClick/DataSet/DataField
    nem mover componente não visual.
[ ] Blocos `< ... >` (Bands, ImageInfo, PopupMenus) fecham com `end>`
    colado no último `end` — nunca `>` em linha própria.
[ ] `DesignSize` é bloco de 3 linhas: substituir o bloco inteiro
    (trocar só a 1ª linha deixa lixo de 2 linhas e corrompe o DFM).
[ ] Ao aninhar/mover um bloco, reindentar TODAS as linhas (inclusive o hex
    do glyph) pelo mesmo delta.
[ ] Ao mover bloco entre pais, ajustar Left/Top e TabOrder do pai.
[ ] Controles com Align têm Left/Top/Width/Height recalculados em runtime;
    manter os valores do DFM coerentes mesmo assim.
[ ] TabOrder lógico: filtro → grid → painel lateral → rodapé.
[ ] Validar estrutura: balancear `object`/`end` por indentação IGNORANDO
    pares `item ... end`; conferir `{` == `}`.
[ ] Balancear `( )`, `[ ]`, `< >` e `{ }` no arquivo TODO (contando por linha,
    ignorando o conteúdo de strings). Um único `)` órfão (ex.: `DesignSize`
    substituído linha a linha em vez do bloco) faz o build falhar com
    `RLINK32: Error opening file "<form>.dfm"` — mensagem que NÃO aponta a linha.
    Trate esse erro como "DFM sintaticamente inválido" e rode o balanceador.
[ ] Geometria de container: `BorderWidth` desloca os filhos; margens de irmãos
    alinhados SOMAM (3+3=6); rodapé com margem direita 4. Depois de mexer,
    abrir o form no IDE e salvar (ou refazer cada conta) para os valores de
    `Left/Top/Width/Height` baterem com o que o alinhamento calcula.
[ ] Não alterar fontes/cores/bevel fora do padrão da referência.
```

## 7. RECEITA — APLICAR O PADRÃO EM UMA TELA EXISTENTE

1. Ler o `.dfm` inteiro e o `.pas` (eventos, datasources, componentes usados no código).
2. Identificar a tela de referência mais próxima (item 1) e extrair dela as medidas reais.
3. Listar as ações da tela e classificá-las em Ações / Opções / Relatórios.
4. Montar o esqueleto do item 2; criar `paGeral` e `paBarraLateral`.
5. Migrar cada ação para `TSkyLinkLabel` reaproveitando o glyph que já existia.
6. Deixar no rodapé apenas `Fechar`; manter `Localizar` na área de filtros.
7. Renomear handlers `bt*Click`/`ac*Execute` → `lb*Click` (mesma lógica).
8. Estado indisponível = `Enabled` (dataset/permissão); não ocultar o que era desabilitado.
9. Revisar textos (acentos, ponto final, singular/plural) e hints.
10. Validar o DFM (item 6) e compilar com SkyBuilder antes de entregar.

## 8. O QUE AINDA EXIGE PERGUNTA (só ambiguidade funcional)

- Em qual grupo cada ação entra (quando o nome não deixa claro).
- Alargar o form quando o painel de 230 px comprime demais o grid.
- Trocar comportamento sempre-habilitado por Enabled controlado.
