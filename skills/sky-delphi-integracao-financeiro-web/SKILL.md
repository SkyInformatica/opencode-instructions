---
name: sky-delphi-integracao-financeiro-web
description: "Facilita a implementação em sistemas Delphi das chamadas do Financeiro.dll para comunicação com o Financeiro Web (SkySistemas): gera o código de integração via TIntegracaoFinanceiroEM / Financeiro.Web.*, orienta sobre as configurações (ativar integração, ambiente, token) e onde elas devem ser salvas (padrão: banco Financeiro). Use quando o usuário quiser integrar um sistema Sky ao Financeiro Web ou criar/ajustar as telas dessas configurações."
---

# sky-delphi-integracao-financeiro-web

## Quando usar

- Implementar chamadas do `Financeiro.dll` (exports `FinanceiroWeb*`) em um sistema Delphi
  (D5/D7 ou D10) para comunicação com o **Financeiro Web** (SkySistemas).
- Criar ou ajustar a tela/edição das **configurações de integração** (ativar integração,
  ambiente, token).
- Revisar ou corrigir integrações já existentes nos sistemas.

## Referências

- **SEMPRE ler primeiro:** `references/delphi/integracao-financeiro-web.md` —
  documentação técnica completa das chamadas, parâmetros, configurações (onde/como são salvas),
  rotinas internas e checklist. Use-a como fonte da verdade para gerar qualquer código.
- Este arquivo fica em `skills/references/delphi/` do repositório de compartilhamento
  (`D:\SkySistemas\opencode-instructions\skills\references\delphi\`).

## Fluxo de trabalho

1. Ler o arquivo de referência (acima).
2. Identificar qual(is) operação(ões) o sistema precisa, entre:
   `GerarRecibo`, `CancelarRecibo`, `EstornarRecibo`, `PagarRecibo`, `CancelarPagamento`,
   `ProcessarEncaminhamentos`, `SincronizarEncaminhamento`, `GerarComprovanteDeposito`.
3. **Se a operação for gerar e/ou pagar recibo — VALIDAR O PROJETO ANTES de escrever código.**
   Procurar (grep) se já existe uma chamada de recibo + pagamento via `Financeiro.dll`
   (`RegistrarReciboPagamento`, `RegistrarRecibo`, `RegistrarPagamento`,
   `GetProcAddress`/`LoadLibrary` de export `FinanceiroWeb*`):
   - **Já existe:** **PERGUNTAR ao programador** (tool de pergunta) qual caminho usar:
     - **A — Manter a chamada atual, e integrar só por configuração.** É o caminho mais
       barato: as rotinas internas já testam `IntegracaoFinanceiroWeb` (seção 5 da referência)
       e passam a usar a API do Financeiro Web **sem nenhuma alteração de código**. Só é
       preciso garantir a persistência no banco Financeiro (tabela `FINANCEIRO`, seção
       `SKYAPI`) de `INTEGRACAOFINANCEIROWEB = True`, `AMBIENTE` e `Token` — seção 4.2 da
       referência. **Não gerar código de chamada novo.**
     - **B — Usar as rotinas exportadas separadas** (`Financeiro.Web.GerarRecibo` +
       `Financeiro.Web.PagarRecibo` via `TIntegracaoFinanceiroEM`), conforme o boilerplate
       abaixo. Dá controle explícito de cada passo e do tratamento de erro, ao custo de código
       novo no sistema chamador.
     - Perguntar também se as duas coisas devem **conviver** (a atual mantida como fluxo
       legado + a nova como integração web) ou se uma substitui a outra.
   - **Não existe:** seguir direto para o boilerplate abaixo (caminho B).
4. **Configurações de integração — PERGUNTAR ao programador** (use a tool de pergunta)
   se o projeto **já possui uma tela** onde são feitas essas definições (ativar a integração,
   selecionar ambiente, informar token):
   - **Já existe:** pedir o **nome do arquivo/unit** da tela e reutilizá-la — ler/integrar as
     configurações por ela. **Nunca criar outra tela duplicada.**
   - **Não existe:** sugerir **criar a configuração** e indicar onde criar (Painel de Controle
     do próprio sistema ou form equivalente), explicando que as configurações **DEVEM ser
     salvas da mesma forma e no mesmo local da documentação** — banco **Financeiro**
     (`dbFinanceiro`), tabela `FINANCEIRO`, seção `SKYAPI` — para que **todos os sistemas
     gravem em um único lugar**.
   - **Já existe, mas cada sistema grava hoje em lugares/banco diferentes:** apenas
     **reportar ao desenvolvedor** qual é o padrão de salvamento e em qual banco salvar
     (padrão oficial = banco Financeiro), para ciência. **Não alterar** código de outros
     sistemas sem que o usuário peça.
5. Gerar o código da chamada conforme o padrão abaixo.

## Como gerar a chamada (padrão obrigatório)

**Regra de ouro:** SEMPRE usar o facade `TIntegracaoFinanceiroEM` (padrão
`SkyExternalModules`) — **nunca** chamar as exports da DLL diretamente via
`GetProcAddress`/`LoadLibrary`. O facade cuida do carregamento da `Financeiro.dll`
(de `.\dll\` junto ao executável) e da passagem de objetos como parâmetro.

### Boilerplate de uma chamada

Template a copiar/adaptar — as duas units do `uses` são obrigatórias:

```pascal
uses
  SkyLibSysFinanceiroExternalModulesIntegracao,   // TIntegracaoFinanceiroEM
  SkyLibSysFinanceiroParametrosDLL;               // TFinanceiroPagamentosParametrosDLL

function IntegrarFinanceiroWebGerarRecibo(): Boolean;
var
  FModulosExternos: TIntegracaoFinanceiroEM;
  ParametrosRecibo: TFinanceiroPagamentosParametrosDLL;
begin
  Result := False;
  FModulosExternos := TIntegracaoFinanceiroEM.Create(ParametrosSistema); // var TParametrosSistema
  try
    ParametrosRecibo := TFinanceiroPagamentosParametrosDLL.Create;
    try
      // --- preencher os parâmetros (ver fonte SkyLibSysFinanceiroParametrosDLL.pas) ---
      ParametrosRecibo.Sistema             := Sistema;
      ParametrosRecibo.ListaEncaminhamentos := '11155-1,11155-2';  // formato num-talão
      ParametrosRecibo.GerarRecibo         := True;
      ParametrosRecibo.TalaoRecibo         := 'A';
      ParametrosRecibo.GerarPagamento      := True;
      ParametrosRecibo.NomeCaixa           := 'CAIXA 1';

      Result := FModulosExternos.Financeiro.Web.GerarRecibo(ParametrosRecibo);
      if not Result then
        ShowMessage(ObterUltimoErroJson);
    finally
      ParametrosRecibo.Free;
    end;
  finally
    FModulosExternos.Free;
  end;
end;
```

### Tratamento de erro

- Toda rotina retorna `Boolean` (`True` = sucesso). Em `False`, exibir o detalhe com
  `ObterUltimoErroJson` (`SkyLibSysFinanceiroParametrosDLL`).
- Formato do JSON, `SetUltimoErroJson`, `EAbort`/`MessageDlg` e a tabela de assinaturas:
  seção 3.2 da referência.

### Compatibilidade Delphi 5/7 ↔ 10.2

- O sistema (D5/D7) chama a `Financeiro.dll` (D10.2, Win32) — seguem as regras da skill
  `sky-delphi-codigo` para fronteira de DLL: usar somente o padrão `SkyExternalModules`
  (objetos/Variant via facade), `WideString` para texto e nunca expor tipos com ABI
  incompatível entre versões.

## Configurações de integração — como e onde salvar (padrão oficial)

Quando for criar/alterar a tela de configurações (ou apenas informar o padrão), grave **no mesmo
local para todos os sistemas**: banco **Financeiro** (`ParametrosSistema.Database[dbFinanceiro]`),
tabela **`FINANCEIRO`**, seção **`SKYAPI`** (via `TIniFileFD`). A tabela de chaves
(`AMBIENTE`, `INTEGRACAOFINANCEIROWEB`, `TIPOACESSOFRONT`, `TOKEN`, `TOKENQALOCAL`, `TOKENPOC`),
seus defaults e a criptografia dos tokens estão na seção 4.2 da referência.

- **Leitura/gravação em código (usar em qualquer sistema):**

```pascal
uses
  FinanceiroDll.Parametros; // TFinanceiroDllParametros

var
  FinanceiroParametros: TFinanceiroDllParametros;
begin
  FinanceiroParametros := TFinanceiroDllParametros.Create(ParametrosSistema.Database[dbFinanceiro]);
  try
    // LER:
    if FinanceiroParametros.SkySistemas.IntegracaoFinanceiroWeb then ...
    Ambiente := FinanceiroParametros.SkySistemas.Ambiente;
    Token    := FinanceiroParametros.SkySistemas.Token[Ambiente];
    // GRAVAR:
    FinanceiroParametros.SkySistemas.IntegracaoFinanceiroWeb := True;
    FinanceiroParametros.SkySistemas.Ambiente := taPROD; // ou ambiente desejado
    FinanceiroParametros.SkySistemas.Token[Ambiente] := 'token-do-sistema';
  finally
    FinanceiroParametros.Free;
  end;
end;
```

> Observação: a integração só tem efeito nas rotinas internas que testam
> `IntegracaoFinanceiroWeb` (ver lista na seção 5 da referência). As demais rotinas seguem
> o fluxo legado.

## Checklist final

- [ ] Usou o facade `TIntegracaoFinanceiroEM` (nunca `GetProcAddress` na DLL).
- [ ] `uses` com `SkyLibSysFinanceiroExternalModulesIntegracao` e `SkyLibSysFinanceiroParametrosDLL`.
- [ ] `try/finally` com `Free` do facade e dos parâmetros.
- [ ] Retorno `Boolean` tratado; em `False`, `ObterUltimoErroJson` exibido/logado.
- [ ] Parâmetros preenchidos conforme formatos (listas `num-talão`).
- [ ] Se já existia chamada de recibo/pagamento via DLL: a opção foi **decidida com o
      programador** (A = manter e integrar por configuração, B = rotinas exportadas separadas,
      ou as duas convivendo) — nada de troca de chamada sem pergunta.
- [ ] Configurações salvas no padrão oficial (banco Financeiro, tabela `FINANCEIRO`, seção `SKYAPI`).
- [ ] Integração **habilitada** e com **ambiente/token** preenchidos (seção 4.1/4.4 da
      referência) — do lado do Financeiro, não do sistema chamador.
- [ ] `Financeiro.dll` presente em `.\dll\` junto ao executável do sistema.
