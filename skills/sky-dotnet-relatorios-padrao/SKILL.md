---
name: sky-dotnet-relatorios-padrao
description: "Aplica o padrão visual de relatórios da Sky (fonte Open Sans, espaçamento, alinhamento do texto, cabeçalho, banda de dados, grupos, rodapé) em templates FastReport .frx. Use ao criar, ajustar ou revisar o visual de um relatório. Complementa a skill fastreport-dotnet, que cobre a mecânica (RegisterData, Prepare, export)."
---

# sky-dotnet-relatorios-padrao

## Quando usar

Ative esta skill quando o usuário quiser **criar ou ajustar o visual** de um
relatório (.frx) seguindo o padrão da Sky — por exemplo: "monte o relatório X
no padrão da Sky", "ajuste o cabeçalho deste relatório", "padronize a fonte
dos relatórios".

## Contexto

**Divisão de trabalho (importante):**
- **`sky-dotnet-relatorios-padrao` (esta skill)** = define o **VISUAL**: fonte,
  alturas de banda, divisórias, cabeçalho, grupos, totalizadores, rodapé.
- **`fastreport-dotnet`** = define a **MECÂNICA**: gerar/editar o template
  `.frx`, `RegisterData`, `Prepare`, export, segurança, diagnóstico.
- **Gerar ou editar um `.frx` = ativar (ou delegar a) skill
  `fastreport-dotnet` obrigatoriamente.** Esta skill sozinha não gera
  `.frx` — ela define as regras visuais que o template deve seguir.

1. **Padrão visual (OBRIGATÓRIO ler primeiro):** `references/padrao-visual-relatorios.md`
   — fonte (**Open Sans**), unidades do `.frx` (**px a 96 dpi**), cabeçalho,
   banda de dados, grupo, rodapé e regras gerais.
2. **Alinhamento do texto (Padding):** `references/padding-alinhamento-texto.md`
   — por que `Left` igual **não** alinha o texto, a tabela de deslocamento por
   tamanho/peso de fonte e a regra de compensação (`Padding` inteiro + o resto no
   `Left`/`Width`). Ler sempre que a tarefa envolver alinhar texto, colunas ou
   divisórias. Ferramentas em `tools/` (medir o deslocamento a 600 dpi e aplicar
   a compensação num `.frx`).
3. **Exemplos (PDF):**
   - `examples/Exemplo01-Ocorrencias-LDP-SomenteGrupo-GeradoPelaSkill.pdf/.frx`
     — **somente grupo, sem subgrupo** (gerado pela skill);
   - `examples/Exemplo02-Depositos-LDP-SomenteGrupo-GeradoPelaSkill.pdf/.frx`
     — **somente grupo, sem subgrupo** (gerado pela skill);
   - `examples/Exemplo03-Ocorrencias-LDP-GrupoSubgrupo-GeradoPelaSkill.pdf/.frx`
     — **grupo + subgrupo** (gerado pela skill);
   - `examples/Exemplo04-Ocorrencias-LDP-SemGrupo-GeradoPelaSkill.pdf/.frx`
     — **sem grupo e sem subgrupo** (listagem simples, sem colunas vazias,
     gerado pela skill);
   - `examples/Exemplo05-Depositos-LDP-Totais-GeradoPelaSkill.pdf/.frx`
     — **totais com label identificando o total + cabeçalho** (gerado pela
     skill; sem texto é variação permitida, só omitir). Os totais usam
     **grade própria de slots**, independente das colunas do detalhe.
4. **Mecânica FastReport:** skill `fastreport-dotnet` — lifecycle,
   `RegisterData`, `Prepare`, export, segurança, diagnóstico.

> O arquivo do padrão fica em `references/` desta skill no repositório de
> compartilhamento. Todo relatório produzido deve obedecê-lo.

## Regras

- **Padrão primeiro, mecânica depois.** Definir layout conforme o
  `padrao-visual-relatorios.md`; **a geração/edição do `.frx` usa a skill
  `fastreport-dotnet`** (bandas, expressões, datasource, export) — ative-a
  para qualquer mudança de template.
- **Fonte obrigatória: `Open Sans` (TTF estática).** Todo `Font` do `.frx` —
  objetos, bandas, `Watermark.Font` e coleções de estilo — usa **Open Sans**;
  **Arial é proibida** (apresentou falha em alguns ambientes/SO). Tamanhos e
  estilos existentes **não mudam**: troca-se apenas a família. Exigir os
  arquivos **estáticos** (`OpenSans-Regular.ttf`, `OpenSans-Bold.ttf`; itálico
  idem), **nunca** fonte variável (`*VariableFont*.ttf`), e garantir a família
  instalada em **todo** ambiente que gera ou exporta — o `.frx` não carrega a
  fonte junto.
- **Geometria do `.frx` é em px (96 dpi), não em pt.** O padrão é escrito em
  pt; no XML, `Left`/`Width`/`Top`/`Height` são **px a 96 dpi** e
  `LeftMargin`/`RightMargin`/`TopMargin`/`BottomMargin`/`Paper*` são **mm**
  (`Font` continua em **pt**). Converter antes de escrever — geometria em pt
  direto ocupa ~75% da folha, sem erro visível.
- **Macros de página com sufixo `#`.** No rodapé, usar `[Page#]` e
  `[TotalPages#]`; sem o `#` não resolve e `[PageNumber]` gera erro de
  compilação (`CS0103`).
- **Alinhamento do texto não vem do `Left`.** Objetos com o mesmo `Left` e fontes
  de tamanhos ou pesos diferentes **não** começam o texto no mesmo ponto: o motor
  recua o texto proporcionalmente ao tamanho da fonte, e o negrito recua um pouco
  mais. Compensar conforme `references/padding-alinhamento-texto.md`. Atenção:
  **`Padding` do FastReport é inteiro** (`System.Windows.Forms.Padding`, membros
  `Int32`) — fração no XML é descartada sem erro, então a parte sub-pixel vai no
  `Left`/`Width`. As divisórias acompanham a borda do **texto**, não a do objeto.
  Medir o deslocamento a **600 dpi**; a 96 dpi a granularidade de 1 px esconde as
  diferenças.
- **Não mudar valor marcado como `[TODO: extrair de .frx]`** no padrão sem
  antes extrair o valor real de um relatório consolidado e atualizar o doc.
- **Não inventar padrão.** Se a seção não estiver definida, apontar o `TODO`
  ao usuário e seguir o comportamento dos relatórios existentes, sinalizando
  a pendência — nunca escolher fonte/espaçamento por conta própria.
- **Mínimo diff no .frx.** Alterar só o necessário; preservar papel, margens,
  unidades e nomes de datasource/parâmetros (contrato com o C#).

## Fluxo

1. Ler `padrao-visual-relatorios.md` (e o bloco STOP antes de qualquer código);
   se a tarefa envolver alinhar texto, colunas ou divisórias, ler também
   `padding-alinhamento-texto.md`.
2. Localizar `.frx` de referência (relatório consolidado) se o padrão tiver `TODO` pendente.
3. Aplicar o padrão ao layout; a **mecânica do `.frx` (gerar/editar) fica com
   a skill `fastreport-dotnet`** — ativar/delegar ao mexer no template.
4. Rodar o **checklist pré-geração** do padrão antes de exportar.
5. Validar: `report.Load` → `RegisterData` → `Prepare` → export (skill `fastreport-dotnet`).
6. Conferência visual: comparar com os PDFs de `examples/` (a skill não "vê" o PDF final — extrair textos/posições pode ser necessário).
