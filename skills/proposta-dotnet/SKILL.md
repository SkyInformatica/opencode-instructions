---
name: proposta-dotnet
description: "Cria uma proposta de mudança OpenSpec para projetos .NET, carregando os princípios de engenharia e a arquitetura do domínio como contexto. Use quando o usuário quiser propor/planejar uma mudança antes de implementar."
---

# proposta-dotnet

## Quando usar

Ative esta skill quando o usuário quiser **propor** ou **planejar** uma mudança em um projeto .NET antes de implementar — por exemplo: "quero propor X", "planeje uma mudança para Y", "crie uma proposta de Z". Ela encapsula o fluxo `openspec-propose` adicionando o contexto de engenharia e arquitetura .NET.

## Objetivo

Gerar uma proposta OpenSpec (proposal.md, specs, design.md, tasks.md) alinhada aos princípios e à arquitetura .NET, sem editar código.

## Prerequisito — inicializar OpenSpec no projeto

Se o OpenSpec ainda não estiver configurado no projeto atual (não existir `openspec/` na raiz nem `.openspec.yaml`), inicialize-o antes de prosseguir:

```bash
openspec init --tools opencode
```

Execute a partir da raiz do projeto. Após o init, confirme que `openspec/` existe.

## Contexto — carregar regras de referência

Antes de executar o `openspec-propose`, carregue e considere estes arquivos como contexto obrigatório:

1. `../../rules/principios.md` — princípios de engenharia: Library First, DDD, DRY, SOLID, KISS/YAGNI, tipagem forte, segurança
2. `../references/arquitetura-dotnet.md` — estrutura de projetos .NET: camadas (Dominio/Aplicacao/Infraestrutura/Servico), organização de domínios, MediatR, repositórios, multi-tenant

> Estes arquivos ficam em `rules/` e `skills/references/` do repositório de compartilhamento. A proposta deve respeitar os princípios e adaptar a arquitetura de referência ao projeto concreto.

## Workflow

1. **Inicialize o OpenSpec** se necessário (seção acima)
2. **Carregue o contexto** — leia `principios.md` e `arquitetura-dotnet.md` e aplique-os ao desenho da proposta
3. **Invoque a skill `openspec-propose`** com o input do usuário
4. Quando o `openspec-propose` pedir contexto, use os princípios e a arquitetura carregados para guiar o design, specs e tasks

## Entregável

Após concluir, informe:
- Nome e localização da change OpenSpec
- Lista de artefatos criados (proposal, specs, design, tasks)
- "Todos os artefatos necessários para a implementação estão prontos."
- Prompt: "Quando quiser implementar, use a skill `implementar-proposta-dotnet`."

## Limites

- Esta skill **apenas planeja** — nunca edita código do projeto.
- Não implemente a mudança nesta skill; a implementação é responsabilidade da skill `implementar-proposta-dotnet`.
