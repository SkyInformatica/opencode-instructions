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

1. **Padrão visual (OBRIGATÓRIO ler primeiro):** `../references/dotnet/padrao-visual-relatorios.md`
   — fonte, cabeçalho, banda de dados, grupo, rodapé e regras gerais.
2. **Exemplos de referência (PDF):** `examples/Exemplo01-Grupo-Subgrupo-Totais.pdf`,
   `examples/Exemplo01-Grupo-Totais.pdf`, `examples/Exemplo01-Somente-Detalhe-SemGrupo.pdf`
   — layouts válidos para conferência visual (grupo+subgrupo, só grupo, só detalhe).
3. **Mecânica FastReport:** skill `fastreport-dotnet` — lifecycle,
   `RegisterData`, `Prepare`, export, segurança, diagnóstico.

> O arquivo do padrão fica em `skills/references/dotnet/` do repositório de
> compartilhamento. Todo relatório produzido deve obedecê-lo.

## Regras

- **Padrão primeiro, mecânica depois.** Definir layout conforme o
  `padrao-visual-relatorios.md`; usar `fastreport-dotnet` só para a
  implementação técnica (bandas, expressões, datasource, export).
- **Não mudar valor marcado como `[TODO: extrair de .frx]`** no padrão sem
  antes extrair o valor real de um relatório consolidado e atualizar o doc.
- **Não inventar padrão.** Se a seção não estiver definida, apontar o `TODO`
  ao usuário e seguir o comportamento dos relatórios existentes, sinalizando
  a pendência — nunca escolher fonte/espaçamento por conta própria.
- **Mínimo diff no .frx.** Alterar só o necessário; preservar papel, margens,
  unidades e nomes de datasource/parâmetros (contrato com o C#).

## Fluxo

1. Ler `padrao-visual-relatorios.md`.
2. Localizar `.frx` de referência (relatório consolidado) se o padrão tiver `TODO` pendente.
3. Aplicar o padrão ao template, sincronizando datasource/parâmetros com o C#.
4. Validar: `report.Load` → `RegisterData` → `Prepare` → export (ver skill `fastreport-dotnet`).