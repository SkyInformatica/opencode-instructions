---
name: sky-dotnet-relatorios-padrao
description: "Aplica o padrão visual de relatórios da Sky (fonte, espaçamento, cabeçalho, banda de dados, grupos, rodapé) em templates FastReport .frx. Use ao criar, ajustar ou revisar o visual de um relatório. Complementa a skill fastreport-dotnet, que cobre a mecânica (RegisterData, Prepare, export)."
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
   — fonte, cabeçalho, banda de dados, grupo, rodapé e regras gerais.
2. **Exemplos (PDF):**
   - `examples/Exemplo01-Referencia-Grupo-Subgrupo-Totais.pdf`,
     `examples/Exemplo01-Referencia-Grupo-Totais.pdf`,
     `examples/Exemplo01-Referencia-Somente-Detalhe-SemGrupo.pdf` —
     **referência genérica, NÃO gerada pela skill** (apenas origem das medidas);
   - `examples/Exemplo02-Ocorrencias-LDP-SomenteGrupo-GeradoPelaSkill.pdf/.frx`
     — **somente grupo, sem subgrupo** (gerado pela skill);
   - `examples/Exemplo03-Depositos-LDP-SomenteGrupo-GeradoPelaSkill.pdf/.frx`
     — **somente grupo, sem subgrupo** (gerado pela skill);
   - `examples/Exemplo04-Ocorrencias-LDP-GrupoSubgrupo-GeradoPelaSkill.pdf/.frx`
     — **grupo + subgrupo** (gerado pela skill);
   - `examples/Exemplo05-Ocorrencias-LDP-SemGrupo-GeradoPelaSkill.pdf/.frx`
     — **sem grupo e sem subgrupo** (listagem simples, gerado pela skill).
3. **Mecânica FastReport:** skill `fastreport-dotnet` — lifecycle,
   `RegisterData`, `Prepare`, export, segurança, diagnóstico.

> O arquivo do padrão fica em `references/` desta skill no repositório de
> compartilhamento. Todo relatório produzido deve obedecê-lo.

## Regras

- **Padrão primeiro, mecânica depois.** Definir layout conforme o
  `padrao-visual-relatorios.md`; **a geração/edição do `.frx` usa a skill
  `fastreport-dotnet`** (bandas, expressões, datasource, export) — ative-a
  para qualquer mudança de template.
- **Não mudar valor marcado como `[TODO: extrair de .frx]`** no padrão sem
  antes extrair o valor real de um relatório consolidado e atualizar o doc.
- **Não inventar padrão.** Se a seção não estiver definida, apontar o `TODO`
  ao usuário e seguir o comportamento dos relatórios existentes, sinalizando
  a pendência — nunca escolher fonte/espaçamento por conta própria.
- **Mínimo diff no .frx.** Alterar só o necessário; preservar papel, margens,
  unidades e nomes de datasource/parâmetros (contrato com o C#).

## Fluxo

1. Ler `padrao-visual-relatorios.md` (e o bloco STOP antes de qualquer código).
2. Localizar `.frx` de referência (relatório consolidado) se o padrão tiver `TODO` pendente.
3. Aplicar o padrão ao layout; a **mecânica do `.frx` (gerar/editar) fica com
   a skill `fastreport-dotnet`** — ativar/delegar ao mexer no template.
4. Rodar o **checklist pré-geração** do padrão antes de exportar.
5. Validar: `report.Load` → `RegisterData` → `Prepare` → export (skill `fastreport-dotnet`).
6. Conferência visual: comparar com os PDFs de `examples/` (a skill não "vê" o PDF final — extrair textos/posições pode ser necessário).