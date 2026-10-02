# Diálogos e janelas modais

Padrão para janelas de diálogo: caixa de edição com painel de campos e botões
no rodapé, caixa de consulta com apenas **Fechar**, e caixa de mensagem com
**OK**.

 complements `geometria.md` (mecânica de layout) e `manutencao.md`
(nomenclatura corporativa). Em caso de conflito, prevalece o padrão
corporativo de `manutencao.md`.

Leia ao criar ou revisar um diálogo, uma `ShowModal`, uma caixa de seleção,
uma tela de confirmação ou qualquer janela pequena sobreposta à principal.

---

## 1. IDENTIFICAR A FINALIDADE DO DIÁLOGO

Antes de montar o diálogo, identificar o que ele faz. O tipo determina os
botões.

| Finalidade | Botões | Exemplos |
|---|---|---|
| Edição / inclusão | `Salvar` + `Cancelar` | incluir, alterar, cadastro, configuração |
| Consulta / informação | `Fechar` | exibição de dados, detalhe sem gravação |
| Mensagem / confirmação | `OK` ou a ação correspondente | "deseja realmente excluir?" |

Não utilizar `Salvar` ou `Cancelar` apenas porque estão disponíveis
visualmente. O nome do botão representa a ação executada.

### Regra de decisão rápida

```text
A tela grava ou altera dados?
│
├── SIM
│   └── [Salvar] [Cancelar]
│
└── NÃO
    │
    ├── É uma mensagem ou solicitação de confirmação?
    │      └── [OK]
    │
    └── É somente consulta / informação?
           └── [Fechar]
```

---

## 2. NOMENCLATURA DOS BOTÕES

O nome deve representar exatamente o comportamento executado.

### Salvar

Utilizar quando o botão confirma uma inclusão, confirma uma alteração, grava
dados no banco ou confirma as alterações realizadas na tela.

> Salvar grava no banco de dados o que foi alterado na tela.

### Cancelar

Utilizar quando o botão abandona uma inclusão, abandona uma alteração,
descarta alterações ainda não gravadas ou encerra a operação sem salvar.

> Cancelar não grava no banco de dados as alterações realizadas.

Não utilizar `Cancelar` como sinônimo de `Fechar`. O padrão dos sistemas
diferencia as duas ações.

### Fechar

Utilizar **exclusivamente** quando a ação consiste em fechar a tela sem
qualquer gravação ou alteração: tela de consulta, tela informativa, janela
que apenas apresenta dados, diálogo sem edição.

Não utilizar "Fechar" para cancelar alteração, excluir, salvar ou confirmar.

### OK

Utilizar em mensagens e confirmações quando o objetivo é apenas confirmar,
fechar a mensagem ou prosseguir com a ação apresentada.

Não substituir automaticamente `OK` por `Salvar`.

---

## 3. ESTRUTURA DO DIÁLOGO

Um diálogo de edição deve ser organizado em três regiões conceituais:

```text
┌──────────────────────────────────────────────┐
│ Título                                       │
├──────────────────────────────────────────────┤
│                                              │
│              ÁREA DE CONTEÚDO                │
│                                              │
│  Label                                       │
│  [Edit]                                      │
│                                              │
│  Label                                       │
│  [Edit]                                      │
│                                              │
├──────────────────────────────────────────────┤
│                     [Salvar] [Cancelar]       │
└──────────────────────────────────────────────┘
```

A implementação Delphi pode utilizar `TPanel` ou outro container equivalente
para separar visualmente conteúdo e rodapé de ações.

A utilização de `TPanel` **não** é regra funcional obrigatória quando a
estrutura existente da aplicação utilizar outro mecanismo. O que importa é
preservar a separação entre conteúdo e ações, na ordem da hierarquia de
containers definida em `geometria.md` — corrigir o container antes dos filhos.

---

## 4. RODAPÉ

O rodapé concentra as ações principais do diálogo.

```text
Edição:       [Salvar] [Cancelar]
Consulta:                            [Fechar]
Mensagem:                            [OK]
```

Evitar espalhar os botões de confirmação em diferentes áreas quando eles
podem ficar agrupados no rodapé. A disposição deve ser consistente entre os
diálogos.

O grupo de botões é alinhado como um conjunto único (mesma altura, mesmo eixo,
espaçamento uniforme), nunca posicionado botão a botão. Regras completas em
`manutencao.md`.

---

## 5. ORDEM DOS BOTÕES

Quando houver confirmação e cancelamento, a ordem é:

```text
[Salvar] [Cancelar]
```

O botão de confirmação fica à direita do botão de cancelamento.

Quando houver somente uma ação:

```text
[Fechar]
```

A ordem segue o padrão já existente no sistema, alinhada à direita do
rodapé.

---

## 6. ÁREA DE CONTEÚDO

Os campos devem ser organizados de forma limpa e consistente:

* alinhamento à esquerda;
* espaçamento uniforme;
* agrupamento lógico dos campos;
* distância visual consistente entre labels e controles;
* evitar componentes desalinhados;
* evitar sobreposição;
* evitar espaços excessivos;
* manter os campos dentro da área útil da tela.

Em diálogo **novo**, a aparência deve ser mais limpa e próxima da interface web
utilizada pela empresa. Em diálogo **existente**, prevalece o padrão visual da
própria tela e do restante do sistema — ver `legado.md`.

---

## 7. LABELS E CAMPOS

O label identifica claramente o campo correspondente.

```text
Nome:
[________________________________________]

CPF:
[________________________________________]

Cidade:
[________________________________________]
```

Para filtros, o nome do campo antes do quadro de seleção possui dois pontos:

```text
Situação:
[ Ativo ▼ ]
```

---

## 8. CAMPOS OBRIGATÓRIOS

Quando o campo for obrigatório para o usuário concluir a operação, sinalizar
com `*`:

```text
Nome *:
[________________________________]
```

Não adicionar `*` indiscriminadamente. Usar somente quando o campo for
realmente obrigatório para a operação.

---

## 9. ESTADO DOS BOTÕES

Quando a ação não puder ser executada naquele momento por validação ou
configuração, o botão pode permanecer visível porém bloqueado:

```text
[Salvar] [Cancelar]
  ↑
 bloqueado
```

Aplicável especialmente quando o usuário possui permissão para realizar a
ação, mas alguma condição impede sua execução.

Quando existir configuração específica do sistema determinando outro
comportamento, respeitar essa configuração.

---

## 10. VALIDAÇÃO ANTES DO SALVAR

O botão `Salvar` representa uma ação real de confirmação. Verificar:

1. quais campos são obrigatórios;
2. quais validações já existem;
3. quais regras de negócio já existem;
4. quais mensagens são apresentadas atualmente;
5. quais operações são realizadas no banco;
6. se existem confirmações antes da gravação.

Não alterar essas regras durante a modernização visual. A mudança de interface
não deve modificar a regra de negócio.

---

## 11. CANCELAMENTO

Ao clicar em `Cancelar`:

* não gravar alterações;
* abandonar a operação atual;
* retornar ao estado anterior da tela;
* fechar o diálogo quando esse for o comportamento existente.

Preservar o comportamento original do sistema. Se a tela já confirma antes de
descartar alterações, essa confirmação deve ser preservada.

---

## 12. FECHAMENTO DA JANELA

O botão `Fechar` é usado somente quando a finalidade é fechar a tela.

Não transformar automaticamente `Fechar` em `Cancelar`, nem `Cancelar` em
`Fechar`. São significados diferentes no padrão da aplicação.

---

## 13. MODELO — TELA DE EDIÇÃO

```text
┌──────────────────────────────────────────────┐
│ Cadastro de Cliente                          │
├──────────────────────────────────────────────┤
│                                              │
│ Nome *:                                      │
│ [________________________________________]   │
│                                              │
│ CPF *:                                       │
│ [________________________________________]   │
│                                              │
│ Cidade:                                      │
│ [________________________________________]   │
│                                              │
├──────────────────────────────────────────────┤
│                    [Salvar] [Cancelar]       │
└──────────────────────────────────────────────┘
```

---

## 14. MODELO — TELA DE CONSULTA

```text
┌──────────────────────────────────────────────┐
│ Dados do cliente                             │
├──────────────────────────────────────────────┤
│                                              │
│ Nome:                                        │
│ João da Silva                                │
│                                              │
│ CPF:                                         │
│ 000.000.000-00                               │
│                                              │
│ Cidade:                                      │
│ Montenegro                                   │
│                                              │
├──────────────────────────────────────────────┤
│                                        [Fechar] │
└──────────────────────────────────────────────┘
```

---

## 15. MODELO — MENSAGEM / CONFIRMAÇÃO

```text
┌──────────────────────────────────────────────┐
│ Confirmação                                  │
├──────────────────────────────────────────────┤
│                                              │
│ Deseja realmente realizar esta operação?     │
│                                              │
├──────────────────────────────────────────────┤
│                                          [OK] │
└──────────────────────────────────────────────┘
```

A existência de outros botões depende da finalidade da mensagem.

---

## 16. DIMENSIONAMENTO E ESPAÇAMENTO

Usar a grade visual já definida em `geometria.md`:

* 1024x768 como tamanho de referência;
* múltiplos de 8 para dimensões e espaçamentos quando aplicável;
* alinhamento das opções à esquerda;
* evitar posicionamento arbitrário dos componentes;
* distância consistente entre campos;
* alinhamento vertical de labels e controles equivalentes.

Ao modernizar um diálogo antigo, corrigir componentes sobrepostos,
espaçamentos inconsistentes, alinhamentos incorretos, campos desalinhados,
botões posicionados de maneira inconsistente e áreas vazias desnecessárias.

---

## 17. REGRAS PARA MODERNIZAR DIÁLOGO EXISTENTE

**DEVE preservar:** funcionalidades, regras de negócio, validações,
mensagens importantes, campos existentes, operações realizadas, permissões,
comportamento esperado, integrações, consultas, gravações, relatórios e
atalhos existentes quando ainda aplicáveis.

**PODE modernizar:** posicionamento, espaçamento, alinhamento, agrupamento
visual, tamanho dos componentes, organização dos painéis, aparência dos botões,
organização do rodapé, hierarquia visual e consistência entre telas.

**NÃO fazer:** não remover funcionalidade por parecer antiga; não alterar
regra de negócio para deixar a interface mais bonita; não trocar o significado
de um botão por preferência visual.

---

## 18. PROCESSO

**Antes de modificar:**

1. Identificar a finalidade do diálogo.
2. Identificar se é inclusão, alteração, consulta ou informação.
3. Identificar os botões existentes.
4. Identificar o comportamento de cada botão.
5. Identificar os campos obrigatórios.
6. Identificar validações.
7. Identificar regras de negócio.
8. Identificar componentes existentes.
9. Identificar dependências do diálogo.
10. Só então propor a reorganização visual.

**Após a reorganização:**

1. Verificar alinhamento.
2. Verificar espaçamento.
3. Verificar TabOrder.
4. Verificar campos obrigatórios.
5. Verificar habilitação e desabilitação dos botões.
6. Verificar comportamento de Salvar.
7. Verificar comportamento de Cancelar.
8. Verificar comportamento de Fechar.
9. Verificar mensagens.
10. Compilar.
11. Executar testes da tela.
12. Garantir que nenhuma funcionalidade existente foi perdida.

---

## 19. PRINCÍPIO FINAL

> **Salvar confirma e grava.**
>
> **Cancelar abandona a operação sem gravar.**
>
> **Fechar somente fecha a tela.**
>
> **OK confirma uma mensagem ou diálogo.**

Essas diferenças devem ser mantidas mesmo durante a modernização visual das
telas.