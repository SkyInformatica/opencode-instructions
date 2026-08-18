---
name: sky-csharp
description: "Regras e convenções da Sky para código C# (.cs): nomenclatura pt-BR, POO/SOLID, exceções, interop COM, arquitetura DLL+Backend."
---

# sky-csharp

## Quando usar

Ative esta skill ao escrever, editar ou revisar código C# em projetos da Sky Informática. Aplica-se a qualquer arquivo `.cs`, seja DLL local (COM), backend HTTP ou biblioteca compartilhada.

## Nomenclatura
- Métodos em pt-BR, PascalCase, padrão verbo+objeto (ObterCliente, AssinarDocumento, ValidarEndereco).
- Variáveis, parâmetros e campos privados em pt-BR, camelCase (arquivoOrigem, clienteAtual).
- Classes, interfaces, enums e namespaces: PascalCase (Repositorio, ICliente, ServicoDePagamento).
- Interfaces com prefixo I (IRepositorioDeClientes); arquivo com o mesmo nome do tipo principal.
- Constantes e propriedades estáticas: PascalCase; enums com valores PascalCase, nunca ordinais implícitos como contrato.

## Orientação a objetos
- Encapsulamento: campos privados, propriedades somente-leitura quando possível; expor o mínimo necessário.
- Preferir composição a herança; programar contra interfaces e injeção de dependência.
- Responsabilidade única e classes pequenas; resultados/opções imutáveis (Options, Result) quando fizer sentido.
- Objetos criados pela Composition Root; nunca instanciar dependências pesadas dentro de classes de operação.

## Exceções
- Mensagens claras em pt-BR, explicando o problema e (quando útil) a ação esperada.
- Lançar o tipo adequado (ArgumentOutOfRangeException, NotSupportedException, CryptographicException, InvalidDataException...).
- Nunca com catch silencioso, nunca engolir exceção; relançar preservando o HRESULT.
- Em fronteiras COM/API: converter em exceção com código (COMException) e mensagem segura; não expor stack trace nem dados sensíveis.
- Usar try/finally (ou using) para liberar recursos; using para IDisposable.

## Interoperabilidade COM
- ComVisible(false) por padrão no assembly; expor via COM somente interfaces/coclasses do contrato.
- ClassInterfaceType.None nas coclasses; interfaces com DISPIDs explícitos e GUIDs estáveis quando o método não muda.
- Fronteira COM fina: tipos simples compatíveis com os consumidores (ex.: Delphi antigo), sem regra de negócio na fachada.

## Arquitetura: DLL local + Backend
- O código C# pode ser dividido em dois tipos de artefato:
  - **DLL** (biblioteca local consumida por aplicações legadas, ex.: COM/Delphi);
  - **Backend** (serviço HTTP/API remoto).
- Onde colocar cada responsabilidade:
  - DLL: operações que exigem recursos locais — certificados digitais, chave
    privada (CSP/CNG/token), arquivos do usuário — e a integração com
    consumidores legados;
  - Backend: processamento centralizado, armazenamento, orquestração com
    estado, e tudo que não depende de recursos locais.
- Fronteira DLL ↔ Backend:
  - JSON estável no envelope success/data/error;
  - HTTPS obrigatório e host autorizado (nunca configurável livre);
  - tokens e segredos jamais em logs, URLs ou documentos retornados.
- Assinatura híbrida (ex.: backend envia hash e a DLL assina com a chave
  local): o lado da DLL deve validar o vínculo com os dados/contrato
  criptográfico — nunca assinar hash cego.

## Qualidade geral
- Código legível primeiro; comentários apenas quando explicam o "porquê" — nunca repetir o que o código já diz.
- Preferir LINQ quando tornar o código mais claro; evitar loops aninhados desnecessários.
- Arquivos/streams: Fechar no finally; escrita atômica (temp + Move) para publicações.
- Data/hora e números: usar CultureInfo.InvariantCulture em serializações; formatos ISO (yyyy-MM-ddTHH:mm:sszzz) para contratos.
- Resultados estruturados que cruzam fronteira (COM/API/arquivo): JSON neutro no envelope success/data/error, com mensagens seguras e sem dados sensíveis.
- Respeitar o TargetFramework do projeto (ex.: SignerCOM é net481/C# 7.3); não usar sintaxe acima da versão configurada.
- Testes: nomes de métodos em pt-BR no padrão Metodo_DeveResultadoEsperado (ex.: ObterCliente_DeveRetornarNullQuandoNaoExistir).

## Referências e origem
- Convenções da Microsoft .NET (naming guidelines oficiais): classes PascalCase,
  métodos PascalCase, parâmetros camelCase, prefixo I, arquivo = tipo.
  (https://learn.microsoft.com/pt-br/dotnet/standard/design-guidelines/)
- Interoperabilidade COM: práticas de exposição .NET para COM (ComVisible,
  ClassInterfaceType.None, DISPID).
- Arquitetura DLL local + Backend e retorno JSON success/data/error: decisão
  interna da equipe, registrada em 12/08/2026.
- Padrão de nomes em pt-BR: convenção interna da equipe de desenvolvimento.