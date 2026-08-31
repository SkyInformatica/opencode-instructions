---
name: "gerar-oquehadenovo"
description: "gera o texto 'O que há de novo' da branch, em linguagem para o usuário final, a partir do diff da branch, exibido como bloco de texto para copiar e colar (o sistema pode definir onde gravar)"
---

# Gerar "O que há de novo"

Objetivo: transformar o que foi desenvolvido em uma branch em um texto curto, em pt-BR e em linguagem de usuário final, exibido como um bloco de texto pronto para copiar e colar.

Esse conteúdo é conteúdo de produto (direcionado ao usuário final), não é documentação técnica.

## Quando invocar

- Antes de reintegrar a branch na `main` (o sistema pode exigir o resultado, conforme o arquivo de configuração).
- Quando o usuário pedir "o que há de novo", "novidades da versão", "release notes" ou "changelog do usuário".
- Depois de uma reintegração em que o arquivo foi esquecido, informando a branch já mesclada.

## Entrada

Tudo é opcional. Sem entrada, usar o alvo atual (branch ou arquivos pendentes).

- Nome de uma branch (ex.: `restaurar-sessao-agno-chat`).
- Id de um commit (no SVN, número da revisão) ou a faixa entre dois (ex.: `4dd3569`, `4dd3569..HEAD`, `1234`, `1000:1200`).
- Lista de arquivos alterados.
- Instruções livres do usuário descrevendo o que foi feito ou o que deve ser considerado.

Sempre confirmar com o usuário o que será analisado quando houver mais de uma leitura possível (ex.: branch atual já mesclada, entrada ambígua, mais de uma branch candidata).

## Identificar o sistema

A skill é genérica e serve para qualquer sistema (Sk.AI, Notar, TED, Imóveis, Civil, Protesto, Financeiro). Cada sistema tem um arquivo de configuração na subpasta `<pasta-da-skill>/<subpasta-do-arquivo-de-configuracao>/`.

O sistema em uso fica registrado em `<pasta-da-skill>/config.json`:

1. Ler `config.json` no início. Se existir e tiver o campo `sistema`, usar esse valor para localizar o arquivo do sistema.
2. Se `config.json` não existir (ou não tiver `sistema`), perguntar ao usuário **qual sistema** a branch pertence, entre as opções: Sk.AI, Notar, TED, Imóveis, Civil, Protesto, Financeiro. Criar `config.json` na raiz da skill com o campo `sistema` preenchido com o nome escolhido (formato do nome do arquivo, ex.: `sk_ai`) e persistir — assim as próximas execuções leem direto do arquivo.
3. Com o sistema definido, ler o arquivo de configuração do sistema (`<pasta-da-skill>/<subpasta-do-arquivo-de-configuracao>/<sistema>.md`) e seguir as definições dele (local dos arquivos, domínios e áreas de usuário final, terminologia de produto, publicação).
4. Trabalhar sempre com as definições do arquivo do sistema; nunca usar domínios, áreas, caminhos ou termos de um sistema em outro.

## Passo 1 — Levantar as mudanças

O VCS pode ser **Git** ou **SVN**. Detectar o VCS do projeto (existência de `.git` ou `.svn`, ou instrução do usuário). O alvo das mudanças pode ser definido de todas as formas (igual para Git e SVN):

- **Branch** — comparar com a base (no Git, a `main`; no SVN, o ponto de divergência da branch via `svn log --stop-on-copy`).
- **Id do commit** (no SVN, número da revisão) ou a faixa entre dois commits/revisões.
- **Arquivos pendentes para commit** — alterações ainda não commitadas da working copy.
- Formas já descritas na seção "Entrada" (lista de arquivos alterados, instruções livres).

Usar os comandos do VCS do projeto. No Git, `git log`/`git diff`; no SVN, os comandos equivalentes (`svn log`, `svn diff`, `svn diff --summarize`, etc.), conforme as regras de VCS já carregadas no ambiente.

Para uma branch já mesclada (Git), usar a faixa do merge commit (`git log --no-merges --oneline <merge>^1..<merge>^2`).

Não escrever a partir das mensagens de commit; ler o diff das mudanças candidatas para entender o que muda para quem usa o sistema.

## Passo 2 — Filtrar o que é relevante para o usuário

Entra no arquivo apenas o que o usuário percebe ou o que muda a forma de trabalhar dele.

**Entra:**

- Tela, aba, campo, botão, filtro ou opção nova ou removida.
- Mudança de comportamento visível (o que o usuário faz, vê ou recebe).
- Novo tipo de processamento ou mudança no que é extraído/exibido no resultado.
- Correção de problema que o usuário sentiu em produção.
- Mudança em cobrança, tarifação, limites, bloqueios ou permissão de acesso.
- Ganho de desempenho perceptível (ex.: tela que demorava a abrir).

**Não entra:**

- Refatoração, renomeação, tipagem, testes, lint, CI, dependências, Docker, variáveis de ambiente.
- Estrutura interna de banco: campo novo de controle, índice, migração, formato de armazenamento (ex.: guardar o arquivo compactado em vez de base64 — irrelevante para o usuário).
- Log, monitoramento, tratamento interno de erro, status HTTP, ajuste de contrato interno.
- Bug introduzido e corrigido dentro da própria branch (o usuário nunca viu).
- Otimização sem efeito perceptível.

Em caso de dúvida sobre relevância ou sobre qual é o benefício real, perguntar ao usuário. Nunca inventar novidade nem descrever mudança que não foi encontrada no código.

## Passo 3 — Escrever em linguagem de usuário final

- pt-BR natural, direto, sem jargão técnico.
- Proibido citar: nome de arquivo, função, tabela, coluna, endpoint, biblioteca, branch, commit, status HTTP, variável de ambiente.
- Uma linha por novidade, no máximo duas frases.
- Formato da linha: `Área: frase descrevendo o que mudou para o usuário.`
- Voz padrão das linhas: "Adicionada opção para…", "Adicionado campo…", "Ajustado o comportamento…", "Melhorada a…", "Corrigido…", "Solucionado um problema…".
- Área é o nome de usuário final. A taxonomia de domínios e a regra de mapeamento domínio → área, além da terminologia de produto, estão no arquivo de configuração do sistema identificado (ver "Identificar o sistema"). Usar as áreas definidas lá; não inventar área que não exista na taxonomia do sistema. Quando houver dúvida sobre o domínio da mudança, perguntar ao usuário.
- Referências a chamado/PR só entram se o usuário informar os números.

## Passo 4 — Gerar o resultado

Montar o texto usando este formato. Sem título; apenas as seções, omitindo a que ficar vazia.

```markdown
## Novas funcionalidades e melhorias

- Chat com agentes de IA: ao reabrir uma conversa, o histórico das mensagens anteriores é carregado automaticamente.
- Processamentos: a lista de processamentos passa a exibir mais registros por página e carrega mais rápido.

## Correções

- Qualificação: solucionado um problema que impedia a conclusão do processamento quando o documento enviado estava protegido por senha.
```

**Resultado padrão:** exibir o texto como um bloco `text` pronto para copiar e colar. Não gravar arquivo por padrão.

**Exceção por sistema:** se o arquivo de configuração do sistema (`<sistema>.md`, ver "Identificar o sistema") definir onde gravar o resultado em um arquivo, seguir essa regra do sistema em vez de apenas exibir o bloco — nome do arquivo, diretório e fluxo de publicação ficam a cargo do arquivo do sistema.

Mostrar o conteúdo ao usuário e confirmar se está adequado antes de encerrar. Ajustar o texto conforme o retorno dele.

## Publicar no Redmine (opcional)

Por padrão, **não** gravar nada no Redmine. Gravar somente quando o usuário pedir explicitamente, informando a tarefa Redmine na qual o "O que há de novo" deve ser escrito.

Habilitação (todas as condições):

1. Usuário pediu explicitamente e informou o id da tarefa.
2. O MCP do Redmine está disponível (tools `redmine_request` e `redmine_paths_list` respondendo). Se não estiver, avisar que o MCP não está instalado e encerrar essa etapa.

Procedimento:

1. Buscar a tarefa: `GET /issues/{id}.json` e confirmar que existe.
2. Validar que a tarefa usa o campo personalizado **"O que há de novo?"** (custom field id `42`). Conferir pelo `tracker` da tarefa — pelo padrão da Sky, os trackers que usam o campo são Defeito, Funcionalidade e Retorno de testes. Se o tracker não usar o campo, avisar que o campo 42 não se aplica àquela tarefa e não escrever.
3. Escrever o texto do resultado no campo: `PUT /issues/{id}.json` com body `{ "issue": { "custom_fields": [{ "id": 42, "value": "<texto>" }] } }`. O texto gravado é o mesmo resultado do Passo 4 (seções `## Novas funcionalidades e melhorias` / `## Correções`), sem cabeçalho de título. O campo é sobrescrito: o conteúdo anterior do campo 42 é substituído pelo novo texto.
4. Após gravar, confirmar ao usuário que o "O que há de novo" foi gravado na tarefa informada.

## Quando não gerar resultado

Se, depois do filtro, não sobrar nenhuma novidade relevante para o usuário final, **não gerar resultado**. Informar ao usuário que a branch não tem novidade para o usuário final e listar em uma linha o que foi descartado e por quê.

## Regras

- Conteúdo de produto em pt-BR: nunca citar nome de arquivo, função, tabela, coluna, endpoint, biblioteca, branch, commit, status HTTP ou variável de ambiente.
- Não alterar código nem outros arquivos do projeto nesta skill, exceto quando a regra do sistema exigir gravar o arquivo de resultado.
- Quando a regra do sistema grava o resultado em arquivo, seguir as regras de nomeação, diretório e commit definidas no arquivo de configuração do sistema.
- Só gravar no Redmine quando o usuário pedir explicitamente; nunca gravar por conta própria.
