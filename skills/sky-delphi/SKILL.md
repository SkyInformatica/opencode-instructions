---
name: sky-delphi
description: "Regras e convenções da Sky para código Delphi/Pascal (.pas, .dpr): nomenclatura pt-BR, POO/memória, exceções, compatibilidade D5/D7 ↔ D10.2 via DLL, encoding ANSI/UTF-8."
---

# sky-delphi

## Quando usar

Ative esta skill ao escrever, editar ou revisar código Delphi em projetos da Sky Informática. Aplica-se a arquivos `.pas` e `.dpr`, incluindo regras de compatibilidade entre versões (D5/D7 ↔ D10.2) na fronteira de DLLs e encoding de arquivos.

## Nomenclatura
- Procedimentos, funções e métodos em pt-BR, PascalCase, padrão verbo+objeto (ObterCliente, AssinarDocumento, ValidarEndereco).
- Classes com prefixo T (TRepositorio), interfaces com I (IRepositorio), exceções com E (EClienteNaoEncontrado).
- Campos privados com prefixo F (FCliente); propriedades PascalCase sem prefixo.
- Parâmetros em pt-BR, lowerCamelCase (nomeArquivoOrigem, clienteAtual); variáveis locais igual.
- Units e tipos: PascalCase; const/enum com nomes descritivos (nunca mágicos).

## Estrutura de units
- Uma unit por arquivo, nome do arquivo = nome da unit; uses organizados por categoria (System, Winapi, Vcl, terceiros, projeto).
- Evitar uses circulares; separar interface/implementation corretamente; tipos de contrato só na interface.
- Sem variáveis globais mutáveis; estado encapsulado na classe.

## POO e memória
- Encapsulamento: campos F privados, exposição via propriedades; interface pública mínima.
- Criação/liberação simétricas: criar no constructor/Create, liberar no Destroy com try/finally e FreeAndNil.
- Coleções com ownership explícito (TObjectList.OwnsObjects); nunca liberar duas vezes o mesmo objeto.
- Preferir interfaces para acoplamento fraco (provider/adapters); injeção de dependência simples (constructor).

## Exceções
- Mensagens em pt-BR, claras e específicas; raise de exceções tipadas (E*, nunca genérica sem necessidade).
- Proibido capturar exceção genérica na UI sem tratar (madExcept/debug é para erros inesperados, não fluxo esperado).
- finally obrigatório para liberar recursos e restaurar estado; não usar on E do nothing.

## Arquitetura de versões e fronteira de DLLs
- Ambiente: aplicativos em Delphi 5 e 7 consomem DLLs compiladas em Delphi 10.2 (Win32).
- Os fontes são SEPARADOS por versão: código de D5/D7 e de D10 nunca se misturam;
  não usar $IFDEF para "unificar" fontes de versões diferentes — a DLL é a fronteira.
- Uma única build da DLL 10.2 serve os apps D5/D7: exports públicos estáveis e
  aditivos (nunca quebrar os existentes).
- Na fronteira da DLL, usar somente tipos com ABI estável entre as versões:
  WideString (BSTR), Variant/OleVariant, COM IDispatch ou PAnsiChar/PWideChar com
  encoding e tamanho explícitos.
- NUNCA expor `string` cru (AnsiString no D7 vs UnicodeString no 10.2 é incompatível),
  `TBytes`, records com string internos nem tipos cuja memória mude entre versões.
- Texto/records que cruzam a fronteira: escalares com contagem explícita ou
  codificação documentada (ex.: WideString para Unicode; PAnsiChar com encoding do app).
- Retorno de exports: quando possível e viável, retornar JSON estruturado
  (WideString/PAnsiChar) em vez de múltiplos parâmetros out ou records.
  Envelope padrão: { "success": ..., "data": ..., "error": ... } — consistente
  entre versões de Delphi e fácil de estender sem quebrar os consumidores D5/D7.
- Cada lado usa os recursos da sua versão sem condicionais: generics e coleções novas
  são livres no D10; D5/D7 usam coleções clássicas (TList, TObjectList/Contnrs,
  TStringList) — sem necessidade de sintaxe comum.

## Codificação de arquivos (encoding)
- Preservar SEMPRE a codificação original do arquivo editado; nunca reescrever
  um arquivo em encoding diferente do que ele já tinha.
- Usar somente formatos aceitos pelo Delphi: ANSI/LATIN1 (Windows-1252) sem BOM,
  ou UTF-8 COM BOM (EF BB BF). NUNCA gravar UTF-8 sem BOM: o IDE lê o arquivo
  como ANSI e quebra a acentuação ("MÃ©todo" em vez de "Método").
- Convenção dos projetos SkySigner: fontes do executável (fontesD10) em
  ANSI/LATIN1 sem BOM; fontes da SignerDLL com acentos em UTF-8 com BOM.
- Ao adicionar strings com acentos, preferir escapes de códigos Delphi
  ('Informa'#231#245'es') quando o arquivo for ASCII/LATIN1, evitando introduzir
  bytes multibyte acidentalmente.
- Confirmar o encoding do arquivo antes de editar (leitura de bytes/BOM) e, ao
  salvar, regravar com o mesmo encoding; verificar o resultado após salvar.
- Não alterar a codificação de arquivos pré-existentes mesmo ao convertê-los de
  volta ao encoding correto — corrigir a gravação, não o formato do arquivo.

## Qualidade geral
- Strings Unicode nativo só no lado 10.2; em D5/D7, dados Unicode via WideString.
- Evitar `with` que prejudique a leitura; evitar chamadas repetidas de propriedades
  pesadas (certificate.Handle etc.) — guardar em variável local.
- Warnings: código legado não precisa zerar os warnings pré-existentes; nas
  linhas novas ou alteradas, não introduzir warnings novos; supressão seletiva
  ({$WARN ... OFF} / pragma) somente com justificativa e escopo restrito.
- Testes: nomes de casos em pt-BR no padrão Unidade_DeveResultadoEsperado.

## Referências e origem
- Convenções Object Pascal (bibliotecas RTL/VCL da Embarcadero e style guides)
  para prefixos T/I/E/F e campos F.
- Compatibilidade Delphi 5/7 ↔ 10.2 via DLL (ABI estável, sem $IFDEF e retorno
  JSON): decisão interna da equipe, registrada em 12/08/2026.
- Código legado e política de warnings: ajuste para lidar com fontes legados
  D5/D7, registrado em 12/08/2026.
- Padrão de nomes em pt-BR: convenção interna da equipe de desenvolvimento.
- Codificação somente em formatos aceitos pelo Delphi (ANSI/LATIN1 sem BOM ou
  UTF-8 com BOM), sem UTF-8 sem BOM: regra registrada em 14/08/2026 após caso de
  acentuação quebrada em SignerDLL.Api.InformacoesAssinatura.pas.