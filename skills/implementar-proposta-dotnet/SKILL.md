---
name: implementar-proposta-dotnet
description: "Implementa uma proposta de mudança OpenSpec em projetos .NET, executando as tasks do apply e carregando as regras de codificação como contexto. Use quando o usuário quiser implementar uma proposta já aprovada ou aplicar as tasks de uma change OpenSpec."
---

# implementar-proposta-dotnet

## Quando usar

Ative esta skill quando o usuário quiser **implementar** uma proposta de mudança em um projeto .NET já planejada via OpenSpec — por exemplo: "aplique a proposta X", "implemente a change Y", "execute as tasks da proposta Z". Ela encapsula o fluxo `openspec-apply-change` adicionando as regras de codificação como contexto.

## Objetivo

Executar as tasks de uma change OpenSpec produzindo código que siga as regras de codificação da Sky, sem desviar da especificação aprovada.

## Prerequisito — inicializar OpenSpec no projeto

Se o OpenSpec ainda não estiver configurado no projeto atual (não existir `openspec/` na raiz nem `.openspec.yaml`), inicialize-o antes de prosseguir:

```bash
openspec init --tools opencode
```

Execute a partir da raiz do projeto. Após o init, confirme que `openspec/` existe.

## Contexto — carregar regras de codificação

Antes de executar o `openspec-apply-change`, carregue e considere este arquivo como contexto obrigatório:

1. `../references/regras-de-codificacao-dotnet.md` — como escrever código em projetos .NET: nomenclatura pt-BR, padrões MediatR, organização de arquivos, validadores, repositórios, controllers, tratamento de erros, null handling, async/cancellation, enums, comentários, acesso, complexidade

> Este arquivo fica em `skills/references/` do repositório de compartilhamento. Todo código produzido deve obedecê-lo.

## Workflow

1. **Inicialize o OpenSpec** se necessário (seção acima)
2. **Carregue o contexto** — leia `regras-de-codificacao-dotnet.md` e aplique-o a todo código gerado
3. **Invoque a skill `openspec-apply-change`** com o nome da change
4. Durante a implementação, use as regras de codificação carregadas para escrever cada arquivo (nomenclatura, MediatR, validadores `internal`, repositórios base, etc.)
5. Ao concluir, confirme o estado final das tasks

## Entregável

Após concluir, informe:
- Tasks completadas nesta sessão
- Progresso geral ("N/M tarefas concluídas")
- Se todas concluídas: "Todas as tarefas concluídas! Você pode arquivar esta change."

## Limites

- Não altere o escopo das tasks da change; se uma task exigir trabalho além do especificado, pause e pergunte.
- Sugestões de código seguem apenas mudanças que respeitam a lógica da spec — não reimplemente comportamento não especificado.
