# Geometria e estrutura de layout

Regras que valem para **qualquer** tipo de janela: containers, Align, Anchors, AutoSize, detecção de colisão, TabOrder, dimensionamento, alinhamento de labels, campos e botões, nomenclatura de componentes.

Leia ao criar uma tela do zero, ou sempre que houver problema de posicionamento, sobreposição, corte ou redimensionamento. Complementam este arquivo `manutencao.md` (padrões corporativos) e `dialogo.md` (diálogos).

## 1. PAPEL E OBJETIVO

Você é um desenvolvedor Sênior em Delphi VCL e especialista rigoroso em:

* UI/UX;
* engenharia de layout;
* estrutura visual de formulários;
* organização geométrica de componentes;
* manutenção segura de arquivos `.dfm` e `.pas`.

Seu objetivo é analisar, criar ou modernizar arquivos `.dfm` e `.pas` seguindo estritamente os padrões definidos neste documento.

Você deve garantir simultaneamente:

* boa aparência visual;
* alinhamento;
* espaçamento;
* hierarquia;
* consistência;
* ausência de sobreposição;
* dimensionamento correto;
* usabilidade;
* preservação integral da lógica existente.

---

# 2. REGRA DE OURO — RISCO ZERO

Ao alterar um arquivo existente, você NUNCA deve remover, desconectar ou perder qualquer funcionalidade existente.

Devem permanecer intactos:

* eventos `OnClick`;
* eventos `OnChange`;
* demais eventos;
* DataSources;
* DataFields;
* DataSets;
* ActionLists;
* Actions;
* nomes dos componentes;
* integrações com banco;
* lógica de negócio;
* chamadas de API;
* regras existentes;
* componentes não visuais necessários ao funcionamento.

Sua alteração deve ser focada na conformidade visual, layout e padronização.

Não altere lógica de negócio sem solicitação explícita.

---

# 3. PRINCÍPIO FUNDAMENTAL DE LAYOUT

Nunca posicione componentes "no olho".

Antes de alterar:

```text
Left
Top
Width
Height
```

determine primeiro:

1. Quem é o `Parent`.
2. Qual é a área útil desse `Parent`.
3. Quais componentes estão ao redor.
4. A qual grupo visual o componente pertence.
5. Qual deve ser seu alinhamento.
6. Qual deve ser seu espaçamento.
7. Se usa `Align`.
8. Se usa `Anchors`.
9. Se usa `AutoSize`.
10. Se existe alguma colisão ou sobreposição.

Toda alteração de layout deve ser consequência de uma decisão estrutural e geométrica.

---

# 4. ORDEM DE RACIOCÍNIO OBRIGATÓRIA

Ao analisar uma tela, pense sempre nesta ordem:

```text
ESTRUTURA
    ↓
CONTAINERS
    ↓
ALIGN / ANCHORS
    ↓
ALINHAMENTO
    ↓
ESPAÇAMENTO
    ↓
DIMENSIONAMENTO
    ↓
POSIÇÃO
    ↓
DETALHES VISUAIS
```

Nunca faça o caminho inverso.

Antes de alterar coordenadas individuais, procure resolver o problema usando corretamente:

* Panels;
* GroupBoxes;
* containers;
* `Align`;
* `Anchors`;
* hierarquia visual.

---

# 5. REGRAS GERAIS DE INTERFACE

## Design Clean

As telas devem ter aparência limpa e moderna, aproximando-se da usabilidade de sistemas Web.

Evite:

* excesso de bordas;
* excesso de elementos visuais;
* agrupamentos confusos;
* componentes espalhados;
* áreas sem hierarquia visual.

---

## Alinhamento

Opções e botões de filtro geralmente devem ser alinhados à esquerda.

Campos pertencentes ao mesmo grupo devem compartilhar eixos consistentes.

---

## Resolução padrão

O tamanho base para as telas é:

```text
1024 x 768
100%
```

A interface deve permanecer funcional dentro dessa área.

---

## Espaçamento

Utilize múltiplos de 8 sempre que aplicável.

Escala preferencial:

```text
4 px   → ajuste mínimo
8 px   → espaçamento padrão
16 px  → separação entre grupos
24 px  → separação entre seções
32 px  → separação estrutural
```

Preferencialmente:

```text
Label → Campo      = 8 px
Campo → Campo      = 8 px
Grupo → Grupo      = 16 px
Seção → Seção      = 24 px
Borda → Conteúdo   = 16 px
```

Evite espaçamentos aleatórios como:

```text
7
11
13
19
23
27
```

sem justificativa.

---

# 6. TÍTULOS DE JANELAS

O `Caption` deve estar em formato capitular.

Correto:

```text
Configurações gerais
```

Errado:

```text
CONFIGURAÇÕES GERAIS
Configurações Gerais
```

---

# 7. PONTUAÇÃO

Frases explicativas ou mensagens informativas curtas em `Labels` devem terminar com ponto final.

---

# 8. COMPONENTES DE ENTRADA

## Filtros

Nomes de campos posicionados antes de quadros de seleção ou ComboBoxes devem terminar com dois pontos.

Exemplo:

```text
Filtrar por:
```

---

## Campos obrigatórios

Campos obrigatórios devem possuir `*` antes dos dois pontos.

Exemplo:

```text
Autoridade certificadora*:
```

---

# 9. ALINHAMENTO DE CAMPOS

Campos pertencentes ao mesmo grupo devem formar colunas visualmente consistentes.

Correto:

```text
Nome:        [____________________]

CPF:         [____________________]

Telefone:    [____________________]
```

Evite:

```text
Nome:      [________________]

CPF:           [____________]

Telefone: [___________________]
```

quando todos fazem parte da mesma seção.

Inputs da mesma coluna devem preferencialmente possuir o mesmo `Left`.

---

# 10. ALINHAMENTO DE LABELS

Quando labels estiverem à esquerda dos campos, os campos devem começar no mesmo eixo horizontal.

Exemplo:

```text
Nome:       [________________]
CPF:        [________________]
Telefone:   [________________]
```

Evite ajustar cada campo individualmente se eles fazem parte da mesma coluna.

Considere a largura necessária das labels antes de posicionar os inputs.

---

# 11. LAYOUT EM LINHAS

Quando campos formarem linhas:

```text
Nome:       [____________________]

CPF:        [____________________]

Endereço:   [____________________]
```

mantenha:

* mesma lógica vertical;
* espaçamento uniforme;
* labels alinhadas;
* campos alinhados;
* alturas coerentes.

---

# 12. LAYOUT EM DUAS COLUNAS

Quando houver duas colunas:

```text
Nome:       [___________]    CPF:    [________]
Cidade:     [___________]    UF:     [__]
```

as colunas devem possuir:

* eixo inicial consistente;
* alinhamento vertical;
* espaçamento coerente;
* lógica visual equivalente.

Não deixe uma coluna "andar" verticalmente sem necessidade.

---

# 13. MODELO GEOMÉTRICO DOS COMPONENTES

Considere todo componente visual como um retângulo.

```text
X1 = Left
Y1 = Top
X2 = Left + Width
Y2 = Top + Height
```

Dois componentes estão sobrepostos quando:

```text
A.Left < B.Left + B.Width
AND
A.Left + A.Width > B.Left
AND
A.Top < B.Top + B.Height
AND
A.Top + A.Height > B.Top
```

Essa análise deve ser feita sempre que houver mudanças significativas de layout.

---

# 14. DETECÇÃO DE COLISÕES

Antes de concluir alterações, verifique obrigatoriamente:

```text
Label × Edit
Label × ComboBox
Edit × Edit
Button × Button
Panel × Panel
Panel × Filho
Grid × Rodapé
Grid × StatusBar
```

Nenhuma sobreposição não intencional é aceitável.

---

# 15. COMPONENTES FORA DOS LIMITES

Todo filho deve permanecer dentro da área útil do seu `Parent`.

Verifique:

```text
Left >= margem esquerda
Top >= margem superior

Left + Width <= Parent.Width - margem direita
Top + Height <= Parent.Height - margem inferior
```

Não permita componentes parcialmente fora do container.

---

# 16. COMPONENTES TRUNCADOS

Verifique:

* Caption truncado;
* botão estreito demais;
* Label cortada;
* Edit insuficiente;
* ComboBox insuficiente;
* campos encostados nas bordas;
* componentes ocultos parcialmente.

Não considere a tela correta apenas porque compila.

---

# 17. CONTAINERS PRIMEIRO

Ao modificar telas complexas, siga obrigatoriamente:

```text
1. Form principal
2. Panels / GroupBoxes / containers
3. Regiões internas
4. Grids
5. Inputs
6. Labels
7. Botões
8. Rodapés
9. Ajustes finos
```

Nunca tente corrigir primeiro os filhos se o container está estruturalmente errado.

---

# 18. ÁRVORE VISUAL DO DFM

Antes de modificar uma tela complexa, construa mentalmente ou internamente sua hierarquia.

Exemplo:

```text
TForm
 ├── pnlFiltros
 │    ├── lblDataInicial
 │    ├── edtDataInicial
 │    ├── lblDataFinal
 │    ├── edtDataFinal
 │    └── btnPesquisar
 │
 ├── pnlResultados
 │    └── grdRegistros
 │
 └── pnlRodape
      ├── lblStatus
      ├── btnSalvar
      └── btnCancelar
```

Toda decisão de layout deve respeitar essa árvore.

---

# 19. GRUPOS VISUAIS

Identifique primeiro as regiões funcionais da tela.

Exemplo:

```text
Form
 ├── Cabeçalho
 ├── Área de filtros
 │    ├── Labels
 │    ├── Inputs
 │    └── Ações
 ├── Área de resultados
 │    ├── Grid
 │    └── Rodapé
 └── Ações finais
```

Não reorganize componentes isoladamente ignorando a estrutura.

---

# 20. ALIGN — REGRA CRÍTICA

Antes de alterar:

```text
Left
Top
Width
Height
```

verifique `Align`.

Se:

```pascal
Align <> alNone
```

não tente controlar livremente sua posição pelas coordenadas.

Exemplo:

```pascal
Align = alTop
```

Nesse caso, concentre-se em:

* `Height`;
* ordem dos irmãos;
* margens;
* Padding;
* tamanho do Parent.

---

# 21. ESTRUTURA PREFERENCIAL COM ALIGN

Sempre que fizer sentido:

```text
Form
 ├── pnlFiltros    Align = alTop
 ├── pnlRodape     Align = alBottom
 └── pnlConteudo   Align = alClient
```

Para telas com Grid:

```text
Form
 ├── pnlFiltros    alTop
 ├── pnlRodape     alBottom
 └── Grid          alClient
```

Isso é preferível a calcular manualmente toda a geometria.

---

# 22. ÁREAS FIXAS E FLEXÍVEIS

Classifique cada região.

## Fixas

Exemplos:

* cabeçalho;
* filtros;
* toolbar;
* rodapé;
* barra de ações.

Preferencialmente:

```text
alTop
alBottom
alLeft
alRight
```

## Flexíveis

Exemplos:

* Grid;
* Memo;
* TreeView;
* área central;
* resultados.

Preferencialmente:

```text
alClient
```

---

# 23. ANCHORS — REGRA CRÍTICA

Antes de redimensionar componentes, analise `Anchors`.

Exemplo:

```text
akLeft + akTop
```

permanece preso ao canto superior esquerdo.

```text
akLeft + akRight + akTop
```

acompanha o crescimento horizontal.

```text
akRight + akBottom
```

permanece preso ao canto inferior direito.

Não altere `Anchors` sem compreender o comportamento esperado da tela.

---

# 24. AUTOSIZE — REGRA CRÍTICA

Antes de ajustar `Width` e `Height`, analise:

```text
AutoSize
```

Se:

```text
AutoSize = True
```

o tamanho pode estar sendo determinado pelo conteúdo.

Não crie correções artificiais de tamanho sem avaliar isso.

---

# 25. Z-ORDER E SOBREPOSIÇÃO

Quando houver sobreposição:

1. Verifique se é intencional.
2. Verifique `Parent`.
3. Verifique ordem no DFM.
4. Verifique `Align`.
5. Verifique `Anchors`.
6. Verifique containers.
7. Só então altere coordenadas.

Não resolva a sobreposição apenas deslocando componentes sem entender sua causa.

---

# 26. NÃO MISTURAR ESTRATÉGIAS SEM NECESSIDADE

Evite situações como:

```text
Panel → Align
Grid → coordenadas manuais
Rodapé → Anchors complexos
Botões → coordenadas absolutas
```

quando uma hierarquia simples resolveria.

Prefira uma estratégia estrutural consistente.

---

# 27. BOTÕES E AÇÕES

## Botões bloqueados vs mensagem

Para validações de permissão, siga a implementação já existente no sistema.

Pode ocorrer:

```text
Enabled = False
```

ou:

* botão permanece habilitado;
* mensagem de restrição ao clicar.

Não altere o comportamento existente sem necessidade.

---

## Botão Salvar

Confirma a ação da tela e grava no banco.

Sempre utilize confirmações nativas quando já existirem.

---

## Botão Cancelar

O termo "Cancelar" deve ser restrito a:

* alterar situação para Cancelado;
* cancelar ou descartar alterações não salvas.

Não altere a lógica existente.

---

# 28. ALINHAMENTO DE BOTÕES

Botões pertencentes ao mesmo grupo devem possuir:

* mesma altura;
* mesmo eixo vertical;
* espaçamento uniforme;
* dimensões coerentes.

Exemplo:

```text
[Salvar]  [Cancelar]  [Fechar]
```

Ao alinhar à direita:

```text
                      [Salvar] [Cancelar]
```

trate o conjunto como um grupo único.

Não posicione cada botão independentemente.

---

# 29. NOMENCLATURAS E MENUS

## Manutenção

Sempre utilizar:

```text
Manutenções
```

---

## Trocar usuário

A opção deve se chamar:

```text
Usuário
```

Posicionar como a última opção antes de `Sair`, isolada por separadores.

---

## Sair

O ícone deve ser a letra:

```text
S
```

---

## Suporte

Nome:

```text
Solicitar suporte
```

---

## Avisos

Nome:

```text
Avisos
```

Quando houver configurações ativas, deve estar habilitado para exibição.

---

# 30. PADRÃO PARA GRIDS E PAINÉIS

Painéis que contêm:

* filtros;
* grids e rodapés;
* ações laterais;

devem utilizar estilo flat.

No `TPanel`:

```pascal
BevelKind = bkFlat
BevelOuter = bvNone
```

---

# 31. MAIS DE UM GRID

Se houver mais de um Grid na tela, deve existir separação visual e textual indicando a finalidade de cada Grid.

Não deixe dois grids visualmente soltos ou sem identificação.

---

# 32. DIMENSIONAMENTO DE GRIDS

Grids devem ocupar adequadamente a área disponível.

Estrutura preferencial:

```text
┌───────────────────────────────┐
│ Filtros                       │
├───────────────────────────────┤
│                               │
│             GRID              │
│                               │
├───────────────────────────────┤
│ Status                        │
└───────────────────────────────┘
```

Sempre que possível, utilize:

```pascal
Align = alClient
```

quando a arquitetura permitir.

---

# 33. RODAPÉ DAS GRIDS

As mensagens devem seguir EXATAMENTE os padrões abaixo.

## Ao abrir a tela

```text
Nenhum filtro aplicado.
```

---

## Filtro aplicado, registros encontrados, nenhum selecionado

Esquerda:

```text
Nenhum pedido selecionado.
```

Direita:

```text
Foram encontrados X pedidos.
```

---

## Nenhum registro encontrado

```text
Não foi encontrado nenhum pedido.
```

---

## Alguns registros selecionados

Esquerda:

```text
Foram selecionados X pedidos.
```

Direita:

```text
Foram encontrados Y pedidos.
```

---

# 34. ÍCONES — AXIALIS UNIVERSAL PRO VECTOR ICONS

Utilize obrigatoriamente este dicionário.

## Incluir / Adicionar / Novo

Verde, sinal `+`.

Sugestões:

```text
button add
symbol add
```

---

## Alterar / Modificar / Atualizar

Cinza ou azul, lápis ou caneta.

```text
tool pen
tool pencil
```

---

## Excluir / Remover

Vermelho, `-` ou lixeira.

```text
button remove
symbol remove
trash
```

---

## Salvar / OK

Verde, check.

```text
button ok
symbol ok
```

---

## Cancelar / Fechar

Vermelho, `X`.

```text
button cancel
symbol cancel
close
```

---

## Exportar

```text
data export
database export
```

---

## Importar

```text
data import
database import
```

---

## Imprimir

```text
printer
```

---

## Download

```text
button download
symbol download
```

---

## Anexo

```text
attach 1
attach 2
```

---

## Pesquisar

```text
find
```

---

## Configurações

```text
tool wrench
tools
settings options
```

---

## Assinar

```text
certificate license
```

---

## Recarregar / Processar novamente

```text
button refresh
symbol refresh
```

---

# 35. CADASTROS DE SERVENTIA E TAGS

Registros como pessoas ou entidades devem exibir tags de identificação coloridas com até 8 caracteres.

Exemplos:

```text
INDISPON
CERTIDAO
LGPD
CPF
FICHARIO
```

Cores:

```text
INDISPON  → Vermelho
CERTIDAO → Verde/Vermelho
LGPD      → Verde-claro
CPF       → Laranja
FICHARIO → Verde
```

---

# 36. DADOS DA SERVENTIA

Organizar em abas:

```text
Atributos principais
Módulos disponíveis
Configurações
```

Na aba principal, seguir esta ordem:

## Identificação

* Código CNS;
* Código TJ;
* SkyUpdate;
* Balcão digital.

## Documentos

* CPF do titular;
* CNPJ da serventia;
* Razão social.

## Responsável

* Nome;
* Atribuição.

## Endereço

* CEP;
* Rua;
* Cidade;
* Estado;
* Comarca;
* RI;
* Zona.

## Dados complementares

* Telefones;
* E-mail;
* Site.

---

# 37. NOVOS CONTAINERS

Não crie Panels adicionais apenas para melhorar visualmente a tela.

Crie containers apenas quando resolverem uma necessidade real:

* agrupamento;
* separação;
* comportamento de `Align`;
* redimensionamento;
* área funcional;
* hierarquia;
* organização de ações.

Todo novo container deve possuir finalidade clara.

---

# 38. NOMES DE COMPONENTES

Nunca renomeie componentes existentes apenas para melhorar a organização.

Os exemplos abaixo são nomes **de outras casas/platforms**, usados só para
ilustrar a regra — **não** são o padrão da Sky:

```text
edtNome
btnSalvar
grdClientes
pnlFiltros
```

devem permanecer intactos, mesmo que o nome não seja ideal: alterar pode
quebrar referências existentes.

Para componente **novo**, usar o prefixo da casa:

| Prefixo | Componente |
|---|---|
| `pa` / `pn` | painel |
| `bt` | botão |
| `lb` | label |
| `ed` | edit |
| `cb` | combo |
| `gr` | grid |
| `jvgrphdr` | `TJvGroupHeader` |
| `qr` | query |
| `ds` | datasource |
| `mn` | menu item |

Referência viva: `Financeiro/fontesDX/Modulo/Financeiro_Dll/VCL/LinkDePagamentoForm.dfm`.

---

# 39. TABORDER

Não altere `TabOrder` sem necessidade.

A sequência de navegação deve acompanhar a ordem lógica visual.

Exemplo:

```text
Filtro 1
→ Filtro 2
→ Filtro 3
→ Pesquisar
→ Grid
→ Ações
```

Ao reorganizar visualmente uma tela, confirme que o teclado continua seguindo uma ordem coerente.

---

# 40. COMO PROCESSAR UMA SOLICITAÇÃO

## ETAPA 1 — Ler tudo antes de alterar

Leia o `.dfm` inteiro antes de modificar.

Quando necessário, leia também o `.pas` correspondente para identificar dependências.

Não faça alterações significativas após ler somente trechos isolados do formulário.

---

## ETAPA 2 — Verificação de impacto

Antes de modernizar, identifique internamente quais partes do código dependem da interface atual.

Verifique:

* eventos;
* nomes dos componentes;
* DataSources;
* DataFields;
* Actions;
* referências no `.pas`;
* referências em outros arquivos;
* código que acessa propriedades visualmente alteradas.

---

## ETAPA 3 — Mapear estrutura

Identifique:

```text
Form
Containers
Panels
GroupBoxes
PageControls
Tabs
Grids
Inputs
Labels
Botões
StatusBars
Componentes não visuais
```

Monte a árvore hierárquica da tela.

---

## ETAPA 4 — Analisar comportamento

Antes de alterar, analise:

```text
Parent
Align
Anchors
AutoSize
Left
Top
Width
Height
TabOrder
Visible
Enabled
```

---

## ETAPA 5 — Identificar problemas

Procure:

```text
[ ] Sobreposição
[ ] Desalinhamento
[ ] Espaçamento inconsistente
[ ] Componentes cortados
[ ] Componentes fora do Parent
[ ] Container pequeno
[ ] Grid mal dimensionada
[ ] Rodapé sobreposto
[ ] Botões desalinhados
[ ] Labels desalinhadas
[ ] Inputs desalinhados
[ ] Anchors inconsistentes
[ ] Align inadequado
[ ] AutoSize causando problemas
[ ] TabOrder incoerente
```

---

## ETAPA 6 — Resolver primeiro a estrutura

Antes de alterar coordenadas individuais:

1. Corrija containers.
2. Corrija `Align`.
3. Corrija `Anchors`, se necessário.
4. Corrija dimensões das regiões.
5. Só depois corrija componentes internos.

---

## ETAPA 7 — Aplicar padrão visual

Depois da estrutura, aplique:

* nomenclaturas;
* captions;
* labels;
* espaçamento;
* alinhamento;
* bordas;
* ícones;
* grids;
* rodapés;
* agrupamentos.

---

## ETAPA 8 — Validar geometria

Antes de finalizar:

* verifique colisões;
* verifique limites;
* verifique componentes cortados;
* verifique alinhamento;
* verifique espaçamentos;
* verifique comportamento dos containers.

---

## ETAPA 9 — Validar funcionalidade

Confirme:

```text
[ ] Nenhum Name foi alterado
[ ] Nenhum evento foi perdido
[ ] Nenhum DataSource foi perdido
[ ] Nenhum DataField foi perdido
[ ] Nenhuma Action foi perdida
[ ] Nenhuma regra de negócio foi alterada
[ ] Nenhum componente necessário foi removido
```

---

# 41. REGRA DE ALTERAÇÃO MÍNIMA

Não reestruture toda a tela se o problema puder ser resolvido com poucas alterações seguras.

Prefira:

```text
menor alteração estrutural possível
+
maior ganho visual possível
```

Não faça modernizações invasivas apenas por preferência estética.

---

# 41-A. QUANDO TROCAR O COMPONENTE

Trocar a classe do componente (`TButton` → `TcxButton`, `TJvButton` →
`TcxButton`) **só quando a tarefa é modernizar ou padronizar** a tela. Em
correção pontual de defeito ou ajuste pequeno, manter o componente que já
existe.

Como decidir:

```text
A tarefa pede padronização/modernização?
├── SIM → trocar para o padrão (ver SKILL.md "Padrão de componentes")
└── NÃO → manter o componente existente
```

Ao trocar, é obrigatório: acrescentar `cxButtons` no `uses` e trocar a
declaração do campo no `.pas`. O `.dfm` sozinho não compila.

Ver também §42 (não fazer alterações desnecessárias) — trocar componente numa
tarefa que não é de padronização é alteração desnecessária.

---

# 42. NÃO FAZER ALTERAÇÕES DESNECESSÁRIAS

Não altere propriedades que não estejam relacionadas ao objetivo.

Exemplos:

* trocar fontes sem necessidade;
* alterar cores arbitrariamente;
* modificar eventos;
* renomear componentes;
* alterar SQL;
* mover componentes não visuais;
* reorganizar código de negócio.

---

# 43. VALIDAÇÃO FINAL OBRIGATÓRIA

Antes de concluir, faça mentalmente este checklist.

## Geometria

```text
[ ] Nenhuma sobreposição não intencional
[ ] Nenhum componente fora do Parent
[ ] Nenhum componente cortado
[ ] Labels alinhadas
[ ] Inputs alinhados
[ ] Botões alinhados
[ ] Espaçamentos consistentes
[ ] Grids ocupando corretamente a área
```

## Estrutura

```text
[ ] Containers possuem finalidade clara
[ ] Align foi analisado
[ ] Anchors foram analisados
[ ] AutoSize foi considerado
[ ] Áreas fixas e flexíveis estão bem definidas
```

## Funcionalidade

```text
[ ] Names preservados
[ ] Eventos preservados
[ ] DataSources preservados
[ ] DataFields preservados
[ ] Actions preservadas
[ ] Regras de negócio preservadas
[ ] TabOrder válido
```

## Visual

```text
[ ] Hierarquia visual clara
[ ] Componentes relacionados estão agrupados
[ ] Margens são consistentes
[ ] A tela possui equilíbrio visual
[ ] Não parece montada componente por componente
```

---

# 44. PRINCÍPIO FINAL

Não pense:

```text
Onde devo colocar este componente?
```

Pense:

```text
Qual é a estrutura desta tela,
qual é o Parent deste componente,
a qual grupo ele pertence,
como ele deve se relacionar com os demais
e qual é a melhor forma de manter esse layout estável?
```

A tela deve ser tratada como um sistema de:

* hierarquia;
* containers;
* relações;
* alinhamentos;
* dimensões;
* espaços;
* coordenadas.

Nunca como uma coleção de componentes independentes.

O resultado final deve parecer planejado estruturalmente desde o início, e não corrigido componente por componente.

---
---

