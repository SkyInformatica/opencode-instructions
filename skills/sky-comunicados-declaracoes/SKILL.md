---
name: sky-comunicados-declaracoes
description: "Criação de comunicados (e-mail institucional para vários clientes) e declarações (documento nominal para um cliente específico) da Sky Informática, conforme modelos oficiais. Use quando pedirem 'comunicado' ou 'declaração'."
---

# sky-comunicados-declaracoes

## Quando usar

Ative esta skill ao redigir um comunicado ou uma declaração para clientes da Sky Informática (cartórios, serventias ou usuários).

### Como escolher o formato

- Pedido de **comunicado** → Formato A (e-mail, público amplo).
- Pedido de **declaração** → Formato B (documento nominal, um cliente/oficial).
- Sem palavra-chave esclarecedora → perguntar ao usuário qual dos dois formatos deseja antes de gerar.

---

## Formato A — Comunicado (e-mail, público amplo)

### Modelo obrigatório

```text
Assunto: [assunto do comunicado]

Prezados(as) Usuários(as),

A Sky Informática, no exercício de suas atribuições como Software House especializada na automação de Serventias Extrajudiciais, vem por meio deste comunicado esclarecer

[texto do comunicado]

Agradecemos pela atenção e permanecemos à disposição para quaisquer esclarecimentos adicionais.

Atenciosamente,
Equipe Sky Informática
```

### Regras — comunicado

- **Canal**: Apenas e-mail (assunto + corpo). Outros canais não são contemplados por esta skill.
- **Saudação**: Manter sempre `Prezados(as) Usuários(as),`. Não personalizar com nome de cartório, comarca ou cliente específico.
- **Assunto**: Obrigatório. Objetivo, claro, identificando o motivo. Quando houver código/identificador do novo item (tipo de cobrança, versão, serviço), incluir no assunto o código e sua descrição resumida, separados por hífen: `Assunto: Novo tipo de cobrança 76 - Isento - Provimento CNJ n. 221/2026 - Alteração de prenome e/ou gênero`.
- **Texto principal**: Conteúdo completo em `[texto do comunicado]`, pt-BR, objetivo, direto e sem ambiguidades.
- **Fechamento**: Manter exatamente `Agradecemos pela atenção e permanecemos à disposição para quaisquer esclarecimentos adicionais.`
- **Assinatura**: Fixa e inalterável: `Atenciosamente,` seguido de `Equipe Sky Informática`.

### Diretrizes de preenchimento — comunicado

1. **Assunto**: Resumir o motivo em poucas palavras (ex.: "Atualização da versão do sistema", "Manutenção programada", "Esclarecimento sobre integração").
2. **Texto do comunicado**: Frases curtas, parágrafos organizados, fatos objetivos. Explicar o que ocorre, quando (se aplicável), impacto esperado e orientação clara, quando houver.
3. **Sem redundância**: Não repetir o assunto no corpo do texto desnecessariamente.
4. **Clareza**: Termos técnicos apenas quando necessários, explicando de forma objetiva quando o público for diverso.

### Estrutura recomendada (novo item no sistema)

Quando o comunicado avisar sobre disponibilização de item novo (tipo de cobrança, serviço, funcionalidade), usar a sequência abaixo, um parágrafo por ideia:

1. **Aviso**: informar que o item já foi disponibilizado automaticamente no sistema, citando código, nome e a norma que fundamenta (`conforme a Circular ...`).
2. **O que é**: explicar o que o código significa e o que representa, em linguagem de negócio.
3. **Base legal**: citar o artigo/provimento que fundamenta a regra, explicando de forma resumida o que a norma disciplina.
4. **Onde usar**: indicar para quais atos ou situações o item deve ser usado. Preferir frase corrida (`passa a ser a opção correta para uso nos atos de...`) a lista de itens.
5. **Disponibilidade**: confirmar que o item já está vinculado às regras aplicáveis, garantindo o reconhecimento automático no momento do ato.

Evitar negrito, itálico e listas com marcador. Um parágrafo por ideia, sem repetição do mesmo conceito.

### Exemplo prático — comunicado simples

```text
Assunto: Manutenção programada

Prezados(as) Usuários(as),

A Sky Informática, no exercício de suas atribuições como Software House especializada na automação de Serventias Extrajudiciais, vem por meio deste comunicado esclarecer

Será realizada manutenção programada no sistema no dia 05/11/2026, das 22h às 06h, com possível indisponibilidade durante esse período.

Agradecemos pela atenção e permanecemos à disposição para quaisquer esclarecimentos adicionais.

Atenciosamente,
Equipe Sky Informática
```

### Exemplo prático — novo item no sistema

```text
Assunto: Novo tipo de cobrança 76 - Isento - Provimento CNJ n. 221/2026 - Alteração de prenome e/ou gênero

Prezados(as) Usuários(as),

A Sky Informática, no exercício de suas atribuições como Software House especializada na automação de Serventias Extrajudiciais, vem por meio deste comunicado esclarecer

Informamos que já foi disponibilizado automaticamente no sistema o novo tipo de cobrança 76 - Isento (Provimento CNJ n. 221/2026 - Alteração de prenome e/ou gênero), conforme a Circular 432 de 2026.

O código 76 é um novo tipo de cobrança criado para os atos de alteração de prenome e/ou gênero. A utilização desse código representa que o ato é isento de emolumentos, ou seja, não há cobrança de taxa pelo serviço, conforme o artigo 4º do Provimento nº 199/2025 do Conselho Nacional de Justiça, que disciplina os atos gratuitos de registro civil.

Na prática, o código 76 passa a ser a opção correta para uso nos atos de alteração de prenome e/ou alteração de gênero.

O novo tipo já está disponível vinculado às regras de ressarcimento aplicáveis a esse procedimento, garantindo que o sistema reconheça corretamente a isenção no momento do ato.

Agradecemos pela atenção e permanecemos à disposição para quaisquer esclarecimentos adicionais.

Atenciosamente,
Equipe Sky Informática
```

---

## Formato B — Declaração (documento nominal, um cliente)

### Modelo obrigatório

```text
Declaração n° [número]

[cidade], [dia] de [mês] de [ano].

AO
[nome do cartório, exemplo: TABELIONATO DE NOVA ESPERANÇA/RS]
[número do CNS, exemplo: CNS n° 12.345-6]
[nome completo do oficial, exemplo: FULANO DE ARAÚJO]
[cidade - estado, exemplo: NOVA ESPERANÇA - RS]

Prezado [nome do oficial ou oficiala],
A Sky Informática, no exercício de suas atribuições como Software House especializada em automação de Serventias Extrajudiciais, declara, para os devidos fins, [conteúdo da declaração]

Colocamo-nos à disposição para quaisquer esclarecimentos que se façam necessários e reiteramos nosso compromisso com a qualidade dos serviços prestados e com a relação de confiança estabelecida com nossos clientes.

Cordialmente,
JOEL LENHARDT
DIRETOR ADMINISTRATIVO
```

### Regras — declaração

- **Canal**: Documento nominal (não é e-mail, não tem assunto). Pode ser enviado por e-mail ou impresso.
- **Destinatário**: Sempre um cliente/oficial específico. Bloco `AO` com cartório, CNS, oficial e cidade-estado, exatamente nessa ordem e em CAIXA ALTA (como no modelo do usuário).
- **Cabeçalho**: `Declaração n° [número]` na primeira linha, linha em branco, depois `cidade, dia de mês de ano.` — usar a data de emissão por extenso.
- **Saudação**: `Prezado [nome],` com vírgula. Nome completo do oficial, com título quando conhecido (ex.: `Dr. Fulano de Tal,`). Nunca usar `Prezados(as)` — é declaração para uma pessoa.
- **Frase de abertura**: Fixa: `A Sky Informática, no exercício de suas atribuições como Software House especializada em automação de Serventias Extrajudiciais, declara, para os devidos fins, ` seguida do conteúdo.
- **Conteúdo**: pt-BR, objetivo, sem ambiguidades, em terceira pessoa, começando por verbo (`... declara que ...`). Sem jargão técnico.
- **Fechamento**: Manter exatamente `Colocamo-nos à disposição para quaisquer esclarecimentos que se façam necessários e reiteramos nosso compromisso com a qualidade dos serviços prestados e com a relação de confiança estabelecida com nossos clientes.`
- **Assinatura**: Fixa e inalterável: `Cordialmente,` seguido de `JOEL LENHARDT` e `DIRETOR ADMINISTRATIVO`.
- **Número**: Usar o número informado pelo usuário. Se não informar, perguntar (não inventar).

### Campos a solicitar quando faltarem

1. Número da declaração
2. Cidade e data de emissão
3. Nome do cartório
4. Número do CNS
5. Nome completo do oficial
6. Cidade - estado do cartório
7. Nome de tratamento do oficial (saudação)
8. Conteúdo da declaração (o que se declara)

Se o pedido vier colado de um e-mail técnico (com SQL, scripts ou nomes de tabela), extrair só o essencial. Se faltar informação relevante, perguntar antes de gerar.

### Exemplo prático — declaração

```text
Declaração n° 12

Cidade Exemplo, 06 de outubro de 2026.

AO
TABELIONATO DE NOVA ESPERANÇA/RS
CNS n° 12.345-6
FULANO DE ARAÚJO
NOVA ESPERANÇA - RS

Prezado Dr. Fulano de Araújo,
A Sky Informática, no exercício de suas atribuições como Software House especializada em automação de Serventias Extrajudiciais, declara, para os devidos fins, que o cliente [nome do cartório] encontra-se regularmente cadastrado no sistema, com acesso vigente e configurações atualizadas conforme a normativa vigente.

Colocamo-nos à disposição para quaisquer esclarecimentos que se façam necessários e reiteramos nosso compromisso com a qualidade dos serviços prestados e com a relação de confiança estabelecida com nossos clientes.

Cordialmente,
JOEL LENHARDT
DIRETOR ADMINISTRATIVO
```

---

## Regras comuns aos dois formatos

- **Tom**: Institucional e neutro. Evitar expressões coloquiais, adjetivos desnecessários, emojis ou ironia.
- **Sem jargão técnico**: Não citar tabelas, colunas, scripts ou nomes de banco. Traduzir toda informação técnica em linguagem de negócio.
- **Dados sensíveis**: Nunca incluir CPFs/CNPJs, números de protocolo completos desnecessários, chaves, senhas, endereços IP ou dados sigilosos. Usar referências genéricas quando necessário.
- **Formatação**: Texto plano, sem negrito ou itálico. Respeitar as quebras de linha do modelo.
- **Precisão**: Não adicionar informações não solicitadas. Não inventar fatos. Se faltar informação relevante, perguntar antes de gerar.

## Instrução de uso

1. Identificar o formato pedido (comunicado = Formato A, declaração = Formato B). Na dúvida, perguntar.
2. Solicitar os campos mínimos: comunicado → assunto + texto; declaração → número, destinatário (cartório/CNS/oficial) + conteúdo.
3. Gerar **exatamente** no modelo do formato, preenchendo apenas os campos entre colchetes.
4. Não alterar saudação, fechamento ou assinatura.
5. Retornar o texto pronto para envio, sem comentários adicionais.
