# Configuração Sk.AI — "O que há de novo"

Configuração específica do sistema **Sk.AI** para a skill `gerar-oquehadenovo`.

## Sistema

- Nome do sistema: **Sk.AI**

## Gravação do resultado em arquivo

Diferente do padrão da skill (que exibe o resultado como bloco de texto), o **Sk.AI grava o resultado em um arquivo** na pasta de branches:

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

## Publicação

Os arquivos em `branchs/` ficam pendentes até a skill `deploy-backend-frontend` compilá-los no arquivo da versão (`v<AAAA.MM.DD>.md`, na raiz de `o-que-ha-de-novo`) e movê-los para `branchs/publicadas/`. Nunca escrever direto na raiz nem nomear arquivo por versão.

## Regras de gravação

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
