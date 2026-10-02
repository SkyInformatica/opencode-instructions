# Agentman PDF Style Guide — referência de skill de estilo

> **Origem:** skill pública da plataforma Agentman
> (`https://agentman.ai/agentskills/skill/agentman-pdf-style`, v1.0.0, ~6.4k tokens).
> Baixada como **referência estrutural** para evolução da skill Sky
> `sky-dotnet-relatorios-padrao`. O conteúdo de marca (cores terracota/carvão,
> autor fixo) NÃO se aplica à Sky — usamos apenas o formato: checklist
> obrigatório, tabelas de tipografia, lista de proibidos, pré-generation
> checklist.
>
> Extraído e adaptado na nossa skill: blocos **STOP**, **Proibidos** e
> **Checklist pré-geração** do `padrao-visual-relatorios.md`.

<!--
Conteúdo original abaixo preservado como registro. Usa reportlab/fpdf2/
weasyprint (não FastReport) — irrelevante para a mecânica, relevante como
molde de skill de estilo visual.
-->

---

# Agentman PDF Style Guide (conteúdo original)

## When to Use

Load this skill **before writing any PDF generation code** — whether using `reportlab`, `fpdf2`, or `weasyprint`. This skill provides the complete Agentman brand implementation for PDF output.

**The brand identity is quiet confidence** — charcoal suits, not fire trucks. Carbon and warm neutrals do the heavy lifting. Terracotta appears as a rare, deliberate accent.

### STOP — Read Before Writing Any Code

Before writing a SINGLE line of PDF generation code, you MUST:

1. **Define ALL color constants below** as the first lines of your script
2. **Set document author** to `"Agentman Equity Research Assistant"`
3. **Set document title** to `"Agentman — {Report Title}"`
4. **Display author on page 1** immediately after the report title: `"Author: Agentman Equity Research Assistant"`
5. **NEVER use library default colors** — override every color explicitly
6. **NEVER import** `colors.black`, `colors.grey`, `colors.blue`, `colors.navy`, `colors.darkblue`, `colors.lightgrey` from reportlab
7. **NEVER use** `getSampleStyleSheet()` without overriding every color

### Visual Weight Distribution

Every report must maintain this ratio:

- **70% Carbon/Charcoal** (`#141413`, `#292322`, `#3D3735`) — the backbone
- **20% Warm Neutrals** (`#F0EEE6`, `#F6EAE6`, `#E3DACC`, `#FAF9F5`, `#FFFFFF`) — warmth without color
- **10% Terracotta Accent** (`#CC785C`, `#D97757`, `#A65945`) — sparingly, max 3 per section

### reportlab Implementation

#### Color Constants (Copy-Paste This Exactly)

```python
from reportlab.lib.colors import HexColor

AGENTMAN_800 = HexColor('#703B2D')   # Badge text, deep emphasis (rare)
AGENTMAN_700 = HexColor('#8B4A38')   # Cover accent, metric box values (rare)
AGENTMAN_600 = HexColor('#A65945')   # Negative emphasis text
AGENTMAN_500 = HexColor('#CC785C')   # PRIMARY ACCENT — stat numbers, table header text, accent lines
AGENTMAN_400 = HexColor('#D97757')   # Highlight/caution text
AGENTMAN_200 = HexColor('#E6A890')   # Badge borders
AGENTMAN_150 = HexColor('#E3DACC')   # TABLE BORDERS, separators
AGENTMAN_100 = HexColor('#F6EAE6')   # TABLE HEADER FILL (light warm tint)
AGENTMAN_75  = HexColor('#F0EEE6')   # Highlight row bg, callout blocks
AGENTMAN_50  = HexColor('#FAF9F5')   # Alternate row bg (cream)

CHARCOAL_950 = HexColor('#141413')   # PRIMARY BODY TEXT
CHARCOAL_900 = HexColor('#292322')   # Section titles, cover title
CHARCOAL_800 = HexColor('#3D3735')   # Secondary text

SLATE_700    = HexColor('#334155')
SLATE_600    = HexColor('#475569')
SLATE_500    = HexColor('#64748B')   # Footer, muted captions
SLATE_400    = HexColor('#94A3B8')
WHITE        = HexColor('#FFFFFF')
```

#### Table Style (Copy-Paste This Exactly)

```python
from reportlab.platypus import Table, TableStyle

def agentman_table_style():
    return TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), AGENTMAN_100),
        ('TEXTCOLOR',  (0, 0), (-1, 0), AGENTMAN_500),
        ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE',   (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING',    (0, 0), (-1, 0), 8),
        ('TEXTCOLOR',  (0, 1), (-1, -1), CHARCOAL_950),
        ('FONTNAME',   (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE',   (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('TOPPADDING',    (0, 1), (-1, -1), 6),
        ('FONTNAME',   (0, 1), (0, -1), 'Helvetica-Bold'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, AGENTMAN_50]),
        ('GRID',       (0, 0), (-1, -1), 0.5, AGENTMAN_150),
        ('ALIGN',      (0, 0), (-1, 0), 'CENTER'),
        ('ALIGN',      (0, 1), (0, -1), 'LEFT'),
        ('ALIGN',      (1, 1), (-1, -1), 'CENTER'),
        ('VALIGN',     (0, 0), (-1, -1), 'MIDDLE'),
    ])
```

#### Document Setup

```python
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate

doc = SimpleDocTemplate(filename, pagesize=letter,
                        leftMargin=0.75*inch, rightMargin=0.75*inch,
                        topMargin=0.75*inch, bottomMargin=0.75*inch,
                        title=f"Agentman — {title}",
                        author="Agentman Equity Research Assistant")
```

#### Typography (resumo — tabela de estilos)

| Elemento | Tamanho | Peso | Alinhamento |
| --- | --- | --- | --- |
| Report title | 24pt (leading 30) | Bold | Left |
| Subtitle | 13pt (leading 17) | Regular | Left |
| Section heading (h2) | 16–18pt | Bold | Left |
| Subsection heading (h3) | 13–14pt | Bold | Left |
| Body text | 10.5–11pt (leading 15) | Regular | Left |
| Stat number | 28pt (leading 34) | Bold | Center (em célula de tabela) |
| Stat label | 10pt (leading 13) | Regular | Center |
| Table header | 11pt | Bold (600) | Center |
| Table body | 10pt | Regular | Center (dados), Left (labels) |
| Footer | 8pt | Italic | Center |

**NEVER center body paragraphs.** Left-align all body text.

### Overlap Prevention Rules

1. Stat blocks MUST use table layout (`agentman_stat_row()`). Never stack large number + label sequentially.
2. Every ParagraphStyle MUST have explicit `leading` ≥ 1.2× the `fontSize`.
3. Title + subtitle never share the same style.
4. Use `Spacer(1, 12)` between unrelated content blocks.
5. Side-by-side content MUST use a Table.
6. Set `spaceBefore` and `spaceAfter` on every style — never rely on implicit spacing.

### Pre-Generation Checklist

- No text overlap (stat blocks em Table; title/subtitle com leading adequado)
- Color constants defined — ALL
- No library defaults (`colors.black`, `getSampleStyleSheet()`, default table styles)
- Document author set
- Page 1 author line displayed
- Title starts with brand prefix
- Table headers LIGHT, never dark
- No banned colors (green/red/amber/blue/navy/generic grays)
- Warm borders, not black/gray
- Alternating rows (white/cream)
- Accent budget: max 3 accent elements per section
- Footer on every page
- No gradients, shadows, or opacity
- Charts use brand palette

### Banned Colors (exemplo do conceito "lista de proibidos")

| Cor | Hex | Por que bane |
| --- | --- | --- |
| Green | #10B981 | estética de semáforo |
| Amber | #F59E0B | alerta de dashboard |
| Red | #EF4444 | alarme |
| Blue | #3B82F6 | corporativo genérico |
| Navy | #1B3A5C | default corporativo |
| Cyan | #0891B2 | demasiado "tech" |
| Pure black | #000000 | usar #141413 |
| Generic grays | #333/#666/#999/#ccc | usar paleta própria |

---

*Fim da referência. Estrutura adaptada ao padrão Sky em
`padrao-visual-relatorios.md` (STOP, Proibidos, Checklist pré-geração).*