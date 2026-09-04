---
name: "gerar-oquehadenovo-skai"
description: "gera o texto 'O que há de novo' para o sistema Sk.AI, em linguagem para o usuário final. Delega à skill genérica `gerar-oquehadenovo` e adiciona apenas as regras específicas do Sk.AI: como definir a área (domínios → área de usuário final) e como gravar o resultado em arquivo markdown."
---

# Gerar "O que há de novo" — Sk.AI

Esta skill é a versão do **sistema Sk.AI** da skill genérica `gerar-oquehadenovo`. Não repete o conteúdo dela: apenas **chama** a skill genérica e **adiciona** o contexto específico do Sk.AI (área e gravação em arquivo).

## Como executar

1. **Carregar e executar a skill genérica** `gerar-oquehadenovo` seguindo todo o fluxo dela (levantar mudanças, filtrar, escrever em linguagem de usuário final, gerar as seções "Novos recursos e melhorias" / "Soluções de problemas").
2. **Aplicar as regras específicas do Sk.AI** abaixo, no que a skill genérica diferencia por sistema: **definir a área** da linha e **gravar o resultado em arquivo** em vez de apenas exibir o bloco.

O restante (formato das linhas, seções, filtros) segue a skill genérica — não reescrever aqui.

O Sk.AI **não usa Redmine**: nunca buscar tarefa no Redmine, nunca usar o MCP do Redmine, e **não** adicionar o id da tarefa entre parênteses no final das frases — as linhas seguem `Área: frase descrevendo o que mudou para o usuário.`, sem `(#id)`.

## Sistema

- Nome do sistema: **Sk.AI**

## Gravação do resultado em arquivo

Diferente do padrão da skill `gerar-oquehadenovo` (que exibe o resultado como bloco de texto), o **Sk.AI grava o resultado em um arquivo** na pasta de branches:

```
backend/src/app/data/o-que-ha-de-novo/branchs/<nome-da-branch>.md
```

O nome do arquivo leva o nome da branch analisada. Barras no nome da branch viram `-`. Exemplo: a branch `restaurar-sessao-agno-chat` gera `branchs/restaurar-sessao-agno-chat.md`.

```bash
DIR=backend/src/app/data/o-que-ha-de-novo/branchs
BRANCH=$(git rev-parse --abbrev-ref HEAD)
mkdir -p "$DIR"
echo "$DIR/${BRANCH//\//-}.md"
```

Se o arquivo da branch já existir, atualizar o próprio arquivo em vez de criar outro.

### Publicação

Os arquivos em `branchs/` ficam pendentes até a skill `deploy-backend-frontend` compilá-los no arquivo da versão (`v<AAAA.MM.DD>.md`, na raiz de `o-que-ha-de-novo`) e movê-los para `branchs/publicadas/`. Nunca escrever direto na raiz nem nomear arquivo por versão.

### Regras de gravação

- Um arquivo por branch; não editar arquivos de versão já publicados nem os movidos para `branchs/publicadas/`.
- O arquivo deve ser commitado na branch antes do merge, senão a validação de merge do sistema não o encontra.

## Domínios e áreas de usuário final

A área da linha é o nome de usuário final derivado da taxonomia de domínios das skills `sky-ia-backend-playbook` e `sky-ia-frontend-playbook`: ler a tabela de domínios dessas skills para descobrir os domínios existentes e nomear a área a partir deles. Não inventar área que não exista na taxonomia.

Regra de mapeamento domínio → área de usuário final:

- O domínio `processamento` vira `Processamentos`, ou o tipo específico (`Qualificação`, `Escritura pública`, `Matrícula`, `Transcrição de áudio`) quando a novidade for só daquele tipo.
- Os demais domínios usam o nome de negócio que o usuário reconhece (ex.: `Acesso`, `Serventias`, `Tarifação`, `Checklist`, `Chat com agentes de IA`, `Base de conhecimento`, `Sistema`). A taxonomia pode evoluir; consultar as skills em vez de memorizar a lista.
- Gestão administrativa (usuários, serventias, planos, preços, tokens, permissões) usa a área `Administração` — o que define `Administração` é o público (somente administradores), não o domínio.

## Terminologia de produto

- O termo interno "SkyNET" não aparece em texto de usuário final; o serviço de autenticação é sempre "portal do cliente".
- "Login" é tela/fluxo, não área — tudo de autenticação entra como `Acesso`.

## Saída final

Escrever o texto do resultado (montado pela skill genérica `gerar-oquehadenovo`) no arquivo markdown da branch conforme "Gravação do resultado em arquivo", mostrar o conteúdo ao usuário e confirmar antes de encerrar.
