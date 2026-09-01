---
name: "preencher-instrucoes-teste"
description: "Preenche o campo 'Instruções para testes' de tarefas do Redmine respondendo às perguntas pré-definidas da própria tarefa, sem alterar as perguntas. Sempre referencia formulários pelo caminho de navegação do usuário (ex.: 'Encaminhamento > Emitir'), nunca pelo nome interno do fonte. Usa arquivo de referência de módulos por projeto em <config opencode global>/.opencode/skills/refs/<projeto>.md; quando não sabe o caminho, pergunta ao usuário e salva no arquivo. Use quando pedirem para preencher instruções de teste, instruções para testes, campo Instruções para testes, ou completar o campo 43 de uma tarefa do Redmine"
---

# Preencher Instruções para Testes

## Contexto

Tarefas do Redmine possuem o campo **"Instruções para testes"** com perguntas pré-definidas. A tarefa já vem com essas perguntas — **nunca alterar, remover ou reordenar as perguntas**. O trabalho é apenas responder cada uma.

## Regras

1. **Proibido nome interno de fonte.** Nunca cite `.pas`, `.dfm`, `Tfm...`, `UDF...` etc. para referenciar uma tela.
2. Formulário/tela sempre referenciado pelo **caminho de navegação do usuário** no sistema. Ex.: `Reconhecimento > Imprimir`, `Encaminhamento > Emitir`.
3. Respostas em pt-BR, curtas, técnicas e objetivas. Quando algo não se aplicar, diga explicitamente (ex.: "Não foram criadas ou alteradas configurações do sistema.").
4. **Formato da resposta:** sempre `> texto da resposta` (estilo citação do Redmine), logo abaixo da pergunta. Nunca usar prefixos como "R:" ou "Resposta:".
5. Não inventar caminhos de navegação. Caminho incerto = perguntar ao usuário.

## Arquivo de referência de módulos (por projeto)

Mapeia fonte interna → caminho de navegação do usuário.

- **Local:** `<config opencode global>/.opencode/skills/refs/<projeto>.md`, um arquivo por projeto, nome = nome do projeto (ex.: `notar.md`). Não fica dentro do projeto.
- **Formato:** tabela `| Form (interno) | Caminho do usuário |`

### Fluxo

1. Para cada tela/formulário afetado no desenvolvimento, procurar o form no arquivo de referência.
2. **Encontrou** → usar o caminho.
3. **Não encontrou** → perguntar ao usuário o caminho de navegação; **adicionar a linha no arquivo de referência**; usar o caminho informado.
4. Se o arquivo não existir, criar com cabeçalho explicativo e as linhas dos caminhos confirmados.
5. Se o arquivo de referência não existir para o projeto, criar `<projeto>.md` em `<config opencode global>/.opencode/skills/refs/` com cabeçalho explicativo e as linhas dos caminhos confirmados. O `.opencode` global não é versionado pelo SVN do projeto, então não há `svn add` a fazer nesse local.

## Como preencher

1. Ler a descrição da tarefa e o diff/implementação do desenvolvimento.
2. Para cada formulário tocado, resolver o caminho de navegação via arquivo de referência (perguntando quando faltar).
3. Escrever a resposta de cada pergunta logo abaixo dela, preservando o texto original da pergunta, no formato `> resposta`.
4. Revisar: nenhum nome interno de fonte deve aparecer nas respostas.

## Perguntas típicas (o texto real está na tarefa — sempre ler da tarefa)

1. Quais comportamentos foram alterados ou corrigidos? O comportamento padrão/atual foi alterado?
2. Quais telas/menus foram alteradas ou corrigidas?
3. Foram criadas ou alteradas configurações do sistema, se sim, e onde elas estão localizadas?
4. Foram criadas ou alteradas estrutura do banco de dados, se sim, quais foram as alterações?
5. Foram criados ou alterados relatórios, se sim, onde eles estão localizados?
6. As alterações ou correções são específicas de algum estado?
7. Possui informações adicionais importantes para condução dos testes (webservice, login, senhas, certificado digital, programas auxiliares, impressora, scanner, banco de dados)
8. Descreva qual é o comportamento ou resultado esperado?
