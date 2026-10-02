# Padroes de interface Sky Sistemas

Regras corporativas de nomenclatura e organização: menus e ações (salvar, cancelar, fechar, exportar, importar, imprimir, anexo), ícones Axialis Universal Pro, campos obrigatórios, filtros, grids e rodapés com seus estados, cadastros de serventia e tags.

Completam `geometria.md`. Em caso de conflito entre as duas, prevalece o padrão corporativo explicitamente documentado neste arquivo.

Leia ao criar ou revisar telas de manutenção, cadastro, consulta e grids.

# PADRÕES DE INTERFACE SKY SISTEMAS

> Este documento complementa as regras de geometria, Align, Anchors e TabOrder de
> `geometria.md`. Em caso de conflito, prevalece o padrão corporativo explicitamente
> documentado aqui.

# OBJETIVO

Ao criar ou alterar uma interface Delphi, siga rigorosamente os padrões
visuais e comportamentais definidos pela documentação de padrões de
interface da Sky Sistemas.

A prioridade é:

1. Manter consistência entre sistemas.
2. Manter consistência entre telas do mesmo sistema.
3. Evitar que a mesma ação possua nomenclaturas ou comportamentos diferentes.
4. Manter a interface visualmente limpa.
5. Aproximar as telas desktop do padrão visual do sistema web.
6. Utilizar alinhamento e espaçamento consistentes.
7. Evitar decisões visuais arbitrárias.
8. Não inventar padrões que não estejam documentados.

---

# 1. PRINCÍPIO GERAL

A interface deve ser tratada como parte de um padrão corporativo.

Não criar uma tela apenas porque "funciona".

Uma tela deve ser analisada também quanto a:

- posicionamento;
- alinhamento;
- espaçamento;
- nomenclatura;
- agrupamento;
- comportamento dos botões;
- estado dos controles;
- ícones;
- filtros;
- grids;
- rodapé;
- ações de manutenção;
- consistência com outras telas.

A documentação identifica como problema situações em que:

- um sistema possui uma determinada forma de fazer algo e outro sistema
  utiliza outra;
- a mesma opção aparece de maneiras diferentes em telas diferentes;
- a mesma configuração existe em mais de um lugar sem definição clara
  de onde deve ser configurada.

Portanto, consistência entre telas é requisito.

---

# 2. ESCOPO VISUAL

A documentação define que as novas interfaces devem possuir:

- aparência "Clean";
- proximidade visual com o sistema web;
- alinhamento das opções à esquerda.

O motivo apresentado é que, durante um período, o cliente utilizará
sistema desktop e sistema web em paralelo.

Aplicar principalmente em telas novas.

Nunca introduzir elementos visuais desnecessários apenas para
"embelezar" a tela.

A interface deve ser simples, organizada e limpa.

---

# 3. DIMENSÃO BASE DA INTERFACE

A referência documentada é:

100% = 1024 x 768.

Utilizar essa resolução como referência para avaliar a composição
da tela.

Regra de espaçamento/tamanho:

- quando houver necessidade de dimensionamento, considerar múltiplos
  de 8.

Exemplo conceitual:

8
16
24
32
40
48
56
64
...

Evitar dimensões arbitrárias quando o elemento puder seguir o
espaçamento baseado em múltiplos de 8.

IMPORTANTE:

O documento não define que absolutamente todas as propriedades Delphi
devam ter valores múltiplos de 8.

O padrão documentado é utilizar múltiplos de 8 como referência para
tamanho/espaçamento.

Não inventar outras regras.

---

# 4. ALINHAMENTO

O alinhamento das opções deve ser feito preferencialmente à esquerda.

Ao organizar:

- Labels;
- Edit;
- ComboBox;
- CheckBox;
- RadioButton;
- botões;
- filtros;
- grupos de informações;

buscar alinhamento visual consistente.

Não posicionar controles individualmente de maneira aparentemente
aleatória.

Quando vários campos pertencem à mesma estrutura, eles devem formar
uma linha/coluna visual organizada.

---

# 5. CAMPOS E FORMULÁRIOS

Os campos devem possuir organização lógica.

Quando uma tela possui muitos dados, agrupar informações relacionadas.

Exemplo de organização documentada para dados de serventia:

## Identificação da serventia

Ordem:

1. Identificação da serventia.
2. CNS.
3. Código TJ.
4. Código SkyUpdate.
5. Código balcão digital.
6. CPF do titular.
7. CNPJ da serventia.
8. Razão social.

## Dados do responsável

1. Nome do responsável.
2. Atribuição.

Onde:

- Nome do responsável corresponde ao nome do titular da serventia.
- Atribuição corresponde ao cargo do titular.

## Endereço

Ordem:

1. CEP.
2. Rua.
3. Cidade.
4. Estado.
5. Comarca.

Ao lado da Comarca:

- RI;
- Zona.

## Dados complementares

1. Telefone.
2. E-mail.
3. Site.

## Outras informações

Informações específicas de cada sistema.

As demais opções da serventia devem ser organizadas separadamente
quando necessário.

---

# 6. CONFIGURAÇÕES DE MÓDULOS

Quando houver configurações referentes aos módulos do sistema,
utilizar uma aba separada quando houver muitas opções.

A nomenclatura definida é:

"Módulos do sistema"

A documentação cita módulos como:

- TED;
- Civil;
- Imóveis;
- Protesto;
- Notar;
- Financeiro.

A documentação também registra que somente o módulo Imóveis teria
necessidade específica de alteração dessas configurações naquele
contexto; nos demais casos, a aba separada deve ser utilizada quando
houver muitas opções.

Não criar múltiplos locais diferentes para a mesma configuração.

---

# 7. NOMENCLATURA PADRONIZADA

## Menu de manutenção

Utilizar:

"Manutenções"

No plural.

Não utilizar arbitrariamente:

"Manutenção"

quando o padrão corporativo estiver sendo aplicado.

---

# 8. TROCA DE USUÁRIO

A opção para trocar usuário deve:

- aparecer próxima ao final do menu;
- ficar imediatamente antes da opção de sair;
- possuir separadores conforme o padrão apresentado;
- utilizar o nome:

"Usuário"

Não criar nomenclaturas alternativas como:

- Trocar usuário;
- Alterar usuário;
- Login;
- Mudar usuário;

quando a opção estiver representando a ação padronizada de troca
de usuário.

---

# 9. SAIR

O ícone da opção de sair utiliza:

"S"

Seguir o padrão documentado para essa opção.

Não substituir arbitrariamente por outro símbolo sem motivo.

---

# 10. SUPORTE

O botão/opção de atendimento deve utilizar a nomenclatura:

"Solicitar suporte"

Essa nomenclatura deve ser utilizada nos sistemas de maneira
consistente.

Evitar variações como:

- Atendimento;
- Suporte;
- Abrir chamado;
- Solicitar atendimento;

quando a ação corresponder ao botão padronizado.

---

# 11. AVISOS

A opção:

"Avisos"

deve permanecer sempre habilitada quando houver configuração
relacionada a ela.

A documentação determina que, quando houver configuração, a opção
deve estar sempre habilitada para exibição.

---

# 12. CAMPOS OBRIGATÓRIOS

Quando um campo é obrigatório para permitir a inclusão no sistema,
ou seja, quando o usuário não consegue prosseguir sem preenchê-lo:

utilizar:

"*"

para indicar que o campo é obrigatório.

Exemplo conceitual:

Nome *

CPF *

Não depender exclusivamente de mensagem posterior para informar que
o campo era obrigatório.

---

# 13. NOMENCLATURA DOS FILTROS

Quando houver um nome de campo antes de um quadro de seleção/filtro,
utilizar dois pontos.

Exemplo:

"Situação:"

"Tipo:"

"Data inicial:"

"Data final:"

A regra documentada é:

Nome do campo antes do quadro de seleção + ":"

---

# 14. TEXTOS E MENSAGENS

Regras documentadas:

- revisar o português da tela;
- não permitir erros de português;
- frases explicativas devem possuir ponto final;
- mensagens devem ser revisadas.

Antes de considerar uma tela concluída:

REVISAR TODOS OS TEXTOS.

Não assumir que textos existentes estão corretos apenas porque
já existiam.

---

# 15. NOME DA JANELA

A documentação estabelece padrão para descrição/nome da janela:

Utilizar texto em capitular.

Exemplo documentado:

"Configurações gerais"

Ao criar uma nova tela, revisar:

- Caption;
- título da janela;
- nomenclatura utilizada no menu;
- nomenclatura utilizada nos botões.

Devem representar a mesma ação/entidade de forma consistente.

---

# 16. TAB ORDER

Tab Order não deve apresentar problemas.

Ao implementar ou revisar uma tela:

1. Percorrer os controles utilizando TAB.
2. Verificar se a ordem faz sentido.
3. Garantir que o foco passe pelos campos em ordem lógica.
4. Não permitir que o foco "salte" para uma área inesperada.
5. Revisar o Tab Order antes de concluir a tela.

A documentação coloca erro de português e Tab Order como problemas
que não devem ocorrer.

---

# 17. BOTÕES DE AÇÃO E VALIDAÇÕES

Quando um botão representa uma ação que o usuário possui permissão
para executar, mas a ação não pode ser executada devido a uma
validação:

o botão deve ficar bloqueado conforme o padrão/configuração
existente.

Quando existir configuração específica, seguir a configuração:

- bloquear;

OU

- permitir e apresentar mensagem.

Não inventar um terceiro comportamento.

A documentação apresenta especificamente essa decisão como regra
dependente da configuração existente.

---

# 18. BOTÃO SALVAR

O botão:

"Salvar"

representa a confirmação das alterações realizadas na tela.

Sua função é:

- salvar no banco o que foi alterado;
- confirmar a ação realizada.

Não utilizar "Cancelar" para representar salvamento.

Não utilizar "Gravar" quando o padrão da interface exigir
"Salvar".

---

# 19. BOTÃO CANCELAR

O termo "Cancelar" possui duas interpretações históricas nos sistemas:

A) alterar uma situação para "cancelado";

B) cancelar a ação que o usuário está realizando.

No padrão Sky Sistemas:

"Cancelar"

deve ser utilizado SOMENTE para o caso B:

cancelar a ação atualmente em execução.

Quando a intenção for alterar a situação de um registro para
"cancelado", utilizar a nomenclatura apropriada para essa operação,
não o botão genérico "Cancelar".

Essa distinção é obrigatória para evitar ambiguidade.

---

# 20. CONFIRMAÇÃO DE AÇÕES

Mensagens de confirmação continuam utilizando o botão:

"OK"

Não substituir arbitrariamente a confirmação por outros textos sem
que exista outro padrão documentado.

---

# 21. TELAS DE MANUTENÇÃO

Em telas de manutenção, utilizar como ações principais:

- Salvar;
- Cancelar.

Comportamento:

SALVAR
→ grava no banco as alterações realizadas.

CANCELAR
→ abandona/cancela a ação que está sendo realizada
→ não grava as alterações no banco.

Não confundir:

Cancelar ação

com:

Cancelar registro.

---

# 22. GRID

Quando houver grid:

- manter organização visual;
- utilizar filtro de maneira claramente separada;
- manter as opções da tela organizadas;
- respeitar o alinhamento geral da interface.

Quando houver mais de um grid:

UTILIZAR UM SEPARADOR VISUAL.

O documento apresenta uma linha/área com informação indicando
a que corresponde cada grid.

Exemplo conceitual:

---------------------------------
DADOS DO PAGAMENTO
---------------------------------

[ GRID ]

---------------------------------
DADOS DO DEPÓSITO
---------------------------------

[ GRID ]

Não colocar dois grids um imediatamente abaixo do outro sem
identificação quando não estiver visualmente claro a que cada um
pertence.

---

# 23. BORDA DE FILTRO, GRID E OPÇÕES

A documentação apresenta uma organização em que:

- filtro;
- grid;
- opções;

ficam visualmente delimitados.

A borda é utilizada para separar essas áreas.

O exemplo apresentado posiciona as opções na parte direita da tela.

Portanto, ao criar uma tela com:

[FILTRO]

[GRID]

[OPÇÕES]

deve existir separação visual suficiente para o usuário entender
cada área.

---

# 24. RODAPÉ DO GRID

O rodapé do grid possui diferentes estados.

A IA deve considerar pelo menos estes estados:

## Estado 1

Tela aberta pela primeira vez.

Nenhum filtro aplicado.

O rodapé deve representar que ainda não existe uma listagem resultante
de filtro.

## Estado 2

Filtro aplicado.

Existem registros listados.

Nenhum registro selecionado.

## Estado 3

Filtro aplicado.

Nenhum registro encontrado.

## Estado 4

Registros encontrados.

Alguns registros selecionados.

IMPORTANTE:

Não tratar o rodapé do grid como um elemento estático.

O estado visual/informacional deve mudar conforme:

- filtro aplicado;
- quantidade de registros;
- seleção de registros.

A documentação apresenta exemplos visuais específicos para esses
estados.

---

# 25. MÚLTIPLOS GRIDS

Quando uma tela possuir dois ou mais grids:

1. Separar visualmente os grids.
2. Informar claramente a finalidade de cada grid.
3. Utilizar um separador/identificação.
4. Não deixar o usuário depender apenas da posição para descobrir
   o que cada grid representa.

---

# 26. ÍCONES

Os ícones devem seguir a biblioteca/padrão utilizado pelo sistema.

A documentação referencia a biblioteca:

Axialis Universal Pro.

Também referencia o repositório:

SkyInformatica/Axialis.Icons

e o Axialis Icon Generator.

Quando necessário pesquisar um ícone:

- utilizar a biblioteca Axialis;
- pesquisar na pasta "Axialis Universal Pro";
- utilizar a opção "Find".

Não criar um ícone visualmente incompatível com os demais sem
necessidade.

---

# 27. BIBLIOTECA DE ÍCONES

A documentação apresenta exemplos utilizando:

dmInterfaceStyle16.ilBasic

A IA deve verificar se o projeto existente já possui uma
ImageList/estrutura de ícones padronizada antes de adicionar novos
recursos.

Não criar uma nova biblioteca de ícones se o projeto já possui uma
biblioteca padronizada.

Primeiro procurar os ícones existentes.

---

# 28. PADRÃO DE BOTÕES E ÍCONES

As ações devem possuir nomenclatura e significado padronizados.

## INCLUIR

Ação:

- Incluir;
- Adicionar;
- Novo item.

Ícone representa inclusão/adicionamento.

## ALTERAR

Ação:

- Alterar;
- Modificar;
- Atualizar.

Ícone representa edição.

## EXCLUIR

Ação:

- Excluir;
- Remover.

Utilizar para remover algo do sistema.

Quando houver um item selecionado, a ação representa remover/excluir
esse item.

---

# 29. SALVAR

Nome:

"Salvar"

Ação:

- gravar a ação realizada na tela;
- confirmar a ação;
- gravar no banco de dados as alterações.

Não confundir com "Exportar".

Salvar significa persistir a alteração realizada no sistema.

---

# 30. CANCELAR

Nome:

"Cancelar"

No padrão Sky Sistemas, representa:

cancelar a ação que está sendo realizada.

Não utilizar esse nome genericamente para "marcar algo como
cancelado".

---

# 31. EXPORTAR

Nome:

"Exportar"

Representa:

- download de arquivo;
- salvar arquivo no computador.

Exemplo conceitual:

EXPORTAR
→ gerar arquivo
→ usuário salva/obtém o arquivo no computador.

Não utilizar "Salvar" quando a ação for exportação de dados/arquivo.

---

# 32. IMPORTAR

Nome:

"Importar"

Representa:

- upload de arquivo;
- importar arquivo do computador para o sistema.

Não utilizar "Anexar" quando a ação efetivamente representar
importação de dados/arquivo.

---

# 33. IMPRIMIR

Nome:

"Imprimir"

Representa:

impressão de arquivo/documento.

Não utilizar "Exportar" para uma ação cujo objetivo principal
é impressão.

---

# 34. ASSINAR

Nome:

"Assinar"

Representa:

assinatura digital.

Utilizar o ícone correspondente ao padrão visual de assinatura.

---

# 35. RECARREGAR

Nome:

"Recarregar"

Representa:

processar novamente alguma informação/operação.

Não confundir necessariamente com abrir uma nova tela.

---

# 36. FECHAR

Nome:

"Fechar"

Uso:

EXCLUSIVAMENTE para fechar uma tela sem realizar uma ação.

Não utilizar "Fechar" para:

- cancelar uma alteração;
- excluir;
- salvar;
- confirmar.

Se a ação for cancelar alterações, utilizar "Cancelar".

Se a ação for persistir alterações, utilizar "Salvar".

Se for simplesmente abandonar/fechar a janela sem executar uma ação,
utilizar "Fechar".

---

# 37. ANEXO

Nome:

"Anexo"

Representa:

adicionar arquivo externo.

Não confundir:

ANEXO
→ adicionar arquivo externo.

IMPORTAR
→ trazer arquivo do computador para o sistema como processo de
importação.

EXPORTAR
→ retirar/gerar arquivo para o computador.

---

# 38. PESQUISAR / LOCALIZAR

As ações:

"Pesquisar"

e

"Localizar"

representam:

realizar uma busca.

Utilizar o ícone correspondente ao padrão de pesquisa.

---

# 39. CONFIGURAÇÕES

A documentação identifica dois usos históricos para "Configurações":

A) configurar informações do sistema;

B) configurar opções de exibição da tela.

No padrão Sky Sistemas:

o ícone de configurações deve ser utilizado somente para o caso B:

configurar opções de exibição da tela.

Não utilizar indiscriminadamente o ícone de configurações para
qualquer tipo de configuração de dados do sistema.

---

# 40. TAGS

A documentação possui uma seção específica:

"Utilização de tags"

e apresenta exemplos visuais de utilização.

Quando uma tela possuir tags:

- seguir o padrão visual apresentado nos exemplos;
- não inventar uma representação visual diferente sem necessidade;
- preservar o significado visual existente no projeto.

IMPORTANTE:

O documento apresenta os exemplos visualmente, mas não fornece no
texto uma especificação completa dizendo que determinada cor
corresponde obrigatoriamente a determinado estado.

Portanto:

NÃO INVENTAR SEMÂNTICA DE CORES.

Se o código/projeto já possuir a regra das tags, preservá-la.

---

# 41. CONSISTÊNCIA ENTRE TELAS

Antes de criar uma nova tela, verificar telas existentes que possuem
função semelhante.

Pesquisar:

- outras telas de manutenção;
- outros filtros;
- outros grids;
- outros botões;
- outros menus;
- outras telas com ações semelhantes.

Se existir um padrão já utilizado:

REUTILIZAR.

Não criar uma nova solução visual simplesmente porque é possível.

---

# 42. REGRA DE NÃO-INVENÇÃO

Quando o padrão não estiver documentado:

NÃO INVENTAR.

Exemplos de coisas que não devem ser inventadas pela IA sem referência
no projeto/documentação:

- cores corporativas específicas;
- fonte específica;
- tamanho exato de fonte;
- cor obrigatória de botão;
- tamanho obrigatório de botão;
- cor obrigatória de tag;
- estilo obrigatório de borda além do exemplo documentado;
- distância exata entre todos os controles;
- componente Delphi específico obrigatório;
- BorderStyle específico;
- Bevel específico;
- Flat específico;
- Anchors específicos;
- Align específico;
- fonte Arial/Segoe UI/etc.;
- DPI específico;
- escala específica.

Se uma dessas propriedades precisar ser decidida, procurar primeiro
um padrão existente no próprio projeto.

---

# 43. REGRA PARA MODIFICAÇÃO DE TELA EXISTENTE

Antes de alterar uma tela existente:

1. Identificar o padrão visual atual.
2. Identificar componentes já padronizados.
3. Procurar telas equivalentes.
4. Verificar ImageList existente.
5. Verificar padrão de botões.
6. Verificar padrão de filtros.
7. Verificar padrão de grids.
8. Verificar Tab Order.
9. Verificar nomenclaturas.
10. Só então realizar a alteração.

Não redesenhar uma tela inteira quando a tarefa solicita apenas
uma alteração pontual.

---

# 44. REGRA PARA CRIAÇÃO DE NOVA TELA

Ao criar uma nova tela:

1. Usar 1024x768 como referência.
2. Utilizar espaçamentos baseados em múltiplos de 8.
3. Manter aparência Clean.
4. Aproximar a experiência visual do sistema web.
5. Alinhar opções à esquerda.
6. Agrupar campos relacionados.
7. Utilizar nomenclatura padronizada.
8. Identificar campos obrigatórios com "*".
9. Revisar textos.
10. Configurar Tab Order.
11. Utilizar botões padronizados.
12. Utilizar ícones da biblioteca existente.
13. Se houver grid, organizar filtro/grid/opções.
14. Se houver múltiplos grids, utilizar separadores.
15. Verificar o estado do rodapé do grid.
16. Verificar comportamento dos botões.
17. Verificar mensagens de confirmação.
18. Comparar visualmente com telas semelhantes.

---

# 45. CHECKLIST AUTOMÁTICO DA IA

Antes de considerar a interface pronta, executar esta verificação:

## DIMENSIONAMENTO

[ ] A tela foi considerada na referência 1024x768?

[ ] Os espaçamentos relevantes seguem múltiplos de 8?

## ORGANIZAÇÃO

[ ] Os controles estão alinhados?

[ ] As opções estão alinhadas à esquerda?

[ ] Os campos relacionados estão agrupados?

[ ] Existe separação visual adequada entre áreas?

## TEXTO

[ ] O português foi revisado?

[ ] Os títulos estão padronizados?

[ ] As frases explicativas possuem ponto final?

[ ] O nome da janela está em capitular?

## CAMPOS

[ ] Campos obrigatórios estão marcados com "*"?

[ ] Os nomes dos filtros utilizam ":" antes do controle?

## NAVEGAÇÃO

[ ] O Tab Order está correto?

[ ] O usuário consegue navegar pela tela em ordem lógica?

## BOTÕES

[ ] "Salvar" está sendo usado para persistir alterações?

[ ] "Cancelar" está sendo usado somente para cancelar a ação?

[ ] "Fechar" está sendo usado somente para fechar a tela?

[ ] "Excluir" representa exclusão?

[ ] "Alterar" representa edição?

[ ] "Incluir" representa inclusão?

[ ] "Exportar" representa saída de arquivo?

[ ] "Importar" representa entrada de arquivo?

[ ] "Imprimir" representa impressão?

[ ] "Assinar" representa assinatura digital?

[ ] "Recarregar" representa processamento novamente?

[ ] "Pesquisar/Localizar" representa busca?

[ ] "Anexo" representa adição de arquivo externo?

## GRID

[ ] O filtro está visualmente separado?

[ ] O grid está visualmente separado?

[ ] As opções estão organizadas?

[ ] Se houver mais de um grid, existe separador/identificação?

[ ] O rodapé representa corretamente o estado da listagem?

[ ] Foram considerados os estados:
    - primeira abertura;
    - filtro com registros;
    - filtro sem registros;
    - registros selecionados?

## ÍCONES

[ ] Foi procurado um ícone existente antes de criar/adicionar outro?

[ ] A biblioteca existente foi respeitada?

[ ] O ícone corresponde à ação?

[ ] Não foi criado um estilo visual incompatível?

## CONSISTÊNCIA

[ ] A tela segue o padrão de telas semelhantes?

[ ] A mesma ação possui a mesma nomenclatura utilizada em outras telas?

[ ] A mesma configuração não foi duplicada em outro local?

[ ] A interface não criou uma solução visual isolada?

---

# 46. COMPORTAMENTO DA IA DURANTE O DESENVOLVIMENTO

Ao receber uma tarefa como:

"Crie uma tela de manutenção"

a IA NÃO deve simplesmente criar os componentes.

Deve primeiro raciocinar:

1. Qual é o tipo da tela?
2. É manutenção, consulta, configuração ou outra?
3. Existem telas semelhantes no projeto?
4. Existem padrões de componentes reutilizáveis?
5. Quais ações existem?
6. Quais ações possuem ícones padronizados?
7. Existem filtros?
8. Existem grids?
9. Existem múltiplos grids?
10. Existem campos obrigatórios?
11. Qual deve ser o Tab Order?
12. Qual deve ser a disposição dos campos?
13. Existe uma nomenclatura já padronizada?
14. Existe ImageList existente?
15. A tela cabe adequadamente na referência 1024x768?
16. Os espaçamentos estão coerentes com múltiplos de 8?
17. A interface está Clean?
18. A interface está visualmente próxima do padrão web?
19. As opções estão alinhadas à esquerda?
20. O comportamento dos botões está de acordo com o padrão?

---

# 47. PRIORIDADE DAS REGRAS

Quando houver conflito entre decisões visuais:

PRIORIDADE 1
→ padrão explicitamente documentado.

PRIORIDADE 2
→ padrão já existente no projeto.

PRIORIDADE 3
→ padrão de outra tela equivalente do mesmo sistema.

PRIORIDADE 4
→ padrão visual geral da aplicação.

PRIORIDADE 5
→ decisão nova somente quando não existir referência.

Nunca substituir uma regra documentada por uma preferência estética
da IA.

---

# 48. PRINCÍPIO FINAL

A interface não deve ser considerada correta apenas porque:

- compila;
- abre;
- executa;
- grava no banco;
- possui todos os campos.

Uma interface também precisa estar correta visual e
comportamentalmente.

A IA deve avaliar:

FUNCIONALIDADE
+
CONSISTÊNCIA
+
USABILIDADE
+
PADRONIZAÇÃO VISUAL

antes de considerar a implementação concluída.

---
---

