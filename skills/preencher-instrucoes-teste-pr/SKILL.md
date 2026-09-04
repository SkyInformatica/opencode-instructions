---
name: preencher-instrucoes-teste-pr
description: "Gera as instruções de teste para a descrição do PR no Azure DevOps, respondendo as 5 perguntas padrão da Sky."
---

# preencher-instrucoes-teste-pr

## Quando usar

Ative esta skill quando o usuário pedir para escrever instruções de teste, preencher descrição de PR, responder perguntas de teste, ou quando mencionar `!` seguido de número (ex.: `!123`), ou branch no formato `tarefa/<numero>` ou `entrega/<numero>`.

## Input aceito

Consulte `skills/references/input-pr-branch.md` para os formatos de entrada aceitos (`!<numero>`, `tarefa/<numero>`, `entrega/<numero>`).

## Workflow

### Fase 1 — Localizar o PR

Siga o fluxo definido em `skills/references/input-pr-branch.md` para identificar o PR.

### Fase 2 — Coletar dados

1. Com o PR identificado, chame `azure-devops_repo_pull_request` com `action: "get"` e `includeChangedFiles: true` para obter:
   - Título e descrição do PR
   - Lista de arquivos alterados (nomes e caminhos)
   - Branch fonte e branch destino

2. Para cada arquivo `.cs` alterado, chame `azure-devops_repo_file` com `action: "get_content"` para entender o que mudou.

3. Identifique:
   - Projetos afetados (pela estrutura de pastas dos arquivos alterados)
   - Comportamentos criados/alterados/corrigidos (pela análise do código)
   - Configurações novas ou alteradas (appsettings, web.config, variáveis de ambiente, endpoints)

### Fase 3 — Responder as 5 perguntas

Gere as respostas para cada uma das perguntas abaixo, baseando-se nos dados coletados:

---

**Pergunta 1: Qual estado (RS/PR/Ambos) é afetado com este PR?**

- Analise se o código afeta domínios regionais (`Rs`, `Pr`) ou é genérico/ambos
- Verifique se há variantes regionais nos arquivos alterados
- Se não houver distinção regional, responda "Ambos" ou "Não se aplica — código genérico"

---

**Pergunta 2: Quais comportamentos foram criados, alterados ou corrigidos? O comportamento padrão/atual foi alterado?**

- Liste cada mudança de comportamento observada no código
- Indique se é criação, alteração ou correção
- Especifique se o comportamento padrão/atual foi alterado e como
- Use linguagem clara e objetiva em pt-BR

---

**Pergunta 3: Quais projetos foram criados, alterados ou corrigidos?**

- Liste os nomes dos projetos (`.csproj`) afetados
- Indique para cada um se foi criado, alterado ou corrigido
- Extraia os nomes dos caminhos dos arquivos (ex.: `SkyInfo.Core.Dominio.Cartorio.Livros`)

---

**Pergunta 4: Existe alguma configuração para habilitar a opção? Qual o endpoint?**

- Verifique se há configurações novas ou alteradas em `appsettings.json`, `web.config`, variáveis de ambiente, ou classes de configuração
- Se houver endpoint novo ou alterado, informe o caminho/URL
- Se não houver configuração, responda "Nenhuma configuração adicional necessária"

---

**Pergunta 5: Descreva o procedimento de teste realizado antes de fazer o post da tarefa:**

- Descreva os passos que o desenvolvedor deveria seguir para testar a mudança
- Inclua: como acessar a funcionalidade, dados de entrada esperados, resultado esperado
- Seja específico e passo-a-passo

---

### Fase 4 — Apresentação

Apresente as 5 respostas no formato:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Instruções de teste — PR !{numero}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Qual estado (RS/PR/Ambos) é afetado com este PR?
[resposta]

2. Quais comportamentos foram criados, alterados ou corrigidos?
O comportamento padrão/atual foi alterado?
[resposta]

3. Quais projetos foram criados, alterados ou corrigidos?
[resposta]

4. Existe alguma configuração para habilitar a opção?
Qual o endpoint?
[resposta]

5. Descreva o procedimento de teste realizado antes de fazer
o post da tarefa:
[resposta]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Fase 5 — Validação e ajustes

Apresente as 5 respostas de uma vez e pergunte se há ajustes:

> Se quiser ajustar algo, cite o número da pergunta. Caso contrário, deseja publicar na descrição do PR?

**Respostas aceitas:**

| Resposta | Ação |
|---|---|
| `não publique`, `n`, `nao` | Não publica — encerra |
| `publique`, `sim`, `s`, `pode ser` | Publica na descrição do PR (Fase 6) |
| Texto com número da pergunta (ex.: `3 SkyInfo.Core.Dominio.Cartorio.LivroCaixa`) | Atualiza a resposta indicada e reapresenta as 5 respostas |
| Qualquer outro texto sem número | Trata como nova resposta para a última pergunta mencionada |

### Fase 6 — Publicação

Somente após confirmação explícita do usuário, atualize a descrição do PR usando `azure-devops_repo_pull_request_write` com:
- `action: "update"`
- `repositoryId`: repositório do PR
- `pullRequestId`: número do PR
- `project`: projeto do Azure DevOps
- `description`: as 5 respostas formatadas

**Após publicar:**
- Informe ao usuário que as instruções foram publicadas
- Forneça o link direto para o PR no Azure DevOps

## Notas importantes

- **Nunca publique sem confirmação explícita do usuário.**
- Apresente todas as respostas de uma vez; o usuário ajusta por número da pergunta.
- As respostas devem ser baseadas no código efetivamente alterado — não inventar comportamentos.
- Se o PR não existir ou não estiver acessível, informe o usuário claramente.
