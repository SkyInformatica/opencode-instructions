# Documentação Técnica — Integração Financeiro Web (SkySistemas)

> **Objetivo:** orientar os demais sistemas Sky a utilizarem as novas chamadas disponibilizadas
> pela DLL do Financeiro (`Financeiro.dll`), cujos exports foram definidos no fonte
> `Financeiro.Web.DLLExports.pas`, bem como documentar as configurações da aba **SkySistemas**
> do Painel de Controle (onde ficam e onde são salvas) e as rotinas internas que as consomem.
>
> **Nenhum fonte foi alterado:** este documento é apenas referência técnica.
>
> **Escopo de leitura:**
> - **Só consumir a integração** (sistema Delphi/D5/D7 chamando o Financeiro): seções
>   **1, 2 e 3**. Pule as seções 4 e 5.
> - **Alterar o `Financeiro.dll`** (aba SkySistemas do Painel de Controle e rotinas internas):
>   seções **4 e 5** também.
> - O template de código a copiar e o checklist de entrega ficam na skill
>   `sky-delphi-integracao-financeiro-web`.

---

## 1. Visão geral — como a chamada flui

```
Sistema externo (Delphi 7 / outro sistema Sky)
   │
   └─ TIntegracaoFinanceiroEM.Create(var ParametrosSistema)
        │
        └─ Financeiro.Web.<Metodo>(Parametros)          ← facade (TFinanceiroWebEM)
             │
             ▼
        TControlEM.executeFunction* (SkyExternalModules)
             │
             ▼
   Financeiro.dll  (módulo carregado pelas External Modules)
        │
        ├─ FinanceiroWebGerarRecibo               │
        ├─ FinanceiroWebCancelarRecibo            │  exports  (Financeiro.Web.DLLExports.pas)
        ├─ FinanceiroWebEstornarRecibo            │
        ├─ FinanceiroWebPagarRecibo               │
        ├─ FinanceiroWebCancelarPagamento         │
        ├─ FinanceiroWebProcessarEncaminhamentos  │
        ├─ FinanceiroWebSincronizarEncaminhamento │
        └─ FinanceiroWebGerarComprovanteDeposito  │
             │
             ▼
   Rotinas internas (TSkySistemasRecibos / TSkySistemasPagamentos /
                      TSkySistemasEncaminhamentos / TSkySistemasDepositosAntecipados)
             │
             ▼
   Dll.ApiSkySistemas (RESTClient)  →  API SkySistemas
             │                          (ambiente conforme configuração: QA/Produção/Local/POC)
             └─ callback para o legado na porta local (ex.: /RegistrarPagamento)
```

- A configuração **"Usar integração Financeiro Web"** (Painel de Controle → aba **SkySistemas**,
  ver seção 4) **não altera o comportamento de todo o Financeiro**: ela só é **testada
  internamente** por rotinas específicas, que passam a usar a API SkySistemas quando habilitada.
  As demais rotinas continuam no fluxo legado normalmente.
- Rotinas que **respeitam/dependem** dessa configuração (caminho completo):
  - `Financeiro.Recibos.FinanceiroGerarRecibos` — escolhe `TSkySistemasRecibos.Gerar` (web) ou `GerarReciboViaExe` (legado);
  - `Financeiro.Classes.TFinanceiroPagamento.RegistrarPagamento` — escolhe `TSkySistemasPagamentos.Pagar` (web) ou `RegistrarPagamentoViaExe` (legado);
  - `Financeiro.Classes.TFinanceiroParametrosRecibo.SetShowFormularioGerarPagamento` — com a integração ativa, força o formulário de pagamento desativado;
  - `Financeiro.Pagamentos.ValidarParametros` e `Financeiro.Pagamentos.ValidarConsistencia` — com a integração ativa, dispensam caixa e permissões locais;
  - `Financeiro.SkySistemas.Recibos.TSkySistemasRecibos.*`, `Financeiro.SkySistemas.Pagamentos.TSkySistemasPagamentos.*`,
    `Financeiro.SkySistemas.Encaminhamentos.TSkySistemasEncaminhamentos.*` e
    `Financeiro.SkySistemas.DepositosAntecipados.TSkySistemasDepositosAntecipados.*` — rotinas executadas
    pela DLL quando a integração está ativa (chamam a API SkySistemas).
- Quando desabilitada, essas mesmas rotinas seguem o fluxo legado (`GerarReciboViaExe`,
  `RegistrarPagamentoViaExe`, etc.).

---

## 2. Como os sistemas externos devem chamar (facade)

### 2.1 Classes envolvidas (units de `Sky.Lib.Sys.Financeiro`)

| Classe | Unit | Papel |
|---|---|---|
| `TIntegracaoFinanceiroEM` | `SkyLibSysFinanceiroExternalModulesIntegracao.pas` | Ponto de entrada principal. Recebe `var ParametrosSistema` e expõe `.Financeiro`, `.Auditoria`, `.SkyTools`, etc. |
| `TFinanceiroEM` | `SkyLibSysFinanceiroExternalModulesIntegracao.pas` | Facade do módulo Financeiro. Expõe `.Web`, `.Recibos`, `.Caixas`, `.Depositos`, etc. |
| `TFinanceiroWebEM` | `SkyLibSysFinanceiroExternalModulesWeb.pas` | Métodos `FinanceiroWeb*` (ver seção 3). |
| `TModulosFinanceiroDLLDelphi7` | `SkyLibSysFinanceiroExternalModulesDelphi7Modulos.pas` | Carrega a DLL `Financeiro.dll` de `.\dll\` via `TControlEM` (`SkyExternalModules`). |
| `TFinanceiroPagamentosParametrosDLL` | `SkyLibSysFinanceiroParametrosDLL.pas` | Parâmetros transportados (objeto → chamada da DLL). |

> **Atenção:** o parâmetro de objetos (`TFinanceiroPagamentosParametrosDLL`) trafega como
> **objeto Variant** no padrão `SkyExternalModules` (`executeFunctionBooleanObj2`). Os dois lados
> (chamador e DLL) precisam usar o mesmo mecanismo — por isso o caminho recomendado é sempre o
> facade `TIntegracaoFinanceiroEM`, que já encapsula isso.

### 2.2 Exemplo de código (Delphi 7)

O boilerplate da chamada (criar o facade, `try/finally`, tratar o `Boolean`) está na skill
`sky-delphi-integracao-financeiro-web`, em **"Boilerplate de uma chamada"** — é dali que o
código deve ser copiado/adaptado. Não é repetido aqui.

> **Nota sobre o `Application.Handle`:** as rotinas exportadas recebem `AppHandle` (o handle da
> janela principal do sistema chamador) e, internamente, trocam o `Application.Handle` da DLL
> durante a execução, restaurando ao final. Nos métodos do facade `TFinanceiroWebEM` isso já é
> feito automaticamente com `Application.Handle` do chamador.

### 2.3 Sequência de métodos disponíveis no facade

| Método (`Financeiro.Web.*`) | Export da DLL correspondente |
|---|---|
| `GerarRecibo(ParametrosRecibo): Boolean` | `FinanceiroWebGerarRecibo` |
| `CancelarRecibo(NumeroRecibo, TalaoRecibo, MotivoCancelamento): Boolean` | `FinanceiroWebCancelarRecibo` |
| `EstornarRecibo(NumeroRecibo, TalaoRecibo): Boolean` | `FinanceiroWebEstornarRecibo` |
| `PagarRecibo(ParametrosPagamentoRecibo): Boolean` | `FinanceiroWebPagarRecibo` |
| `CancelarPagamento(NumeroRecibo, TalaoRecibo, MotivoCancelamento): Boolean` | `FinanceiroWebCancelarPagamento` |
| `ProcessarEncaminhamentos(ParametrosEncaminhamento): Boolean` | `FinanceiroWebProcessarEncaminhamentos` |
| `SincronizarEncaminhamento(NumeroEncaminhaRecibo)` | `FinanceiroWebSincronizarEncaminhamento` |
| `GerarComprovanteDeposito(ParametrosDeposito): Boolean` | `FinanceiroWebGerarComprovanteDeposito` |

---

## 3. Rotinas exportadas (fonte `Financeiro.Web.DLLExports.pas`)

Todas são `stdcall`. Convenções comuns:

- **`AppHandle`** — handle da janela do sistema chamador (passe `Application.Handle`).
- **Retorno `Boolean`** — `True` = sucesso; `False` = falha (detalhes em `ObterUltimoErroJson`).
- **Erros** — `ExibirErroFinanceiroWeb` grava a mensagem (`SetUltimoErroJson`) e exibe
  `MessageDlg` de erro, exceto para `EAbort` (abort silencioso).

### 3.1 Assinaturas das rotinas

```pascal
function  FinanceiroWebGerarRecibo(AppHandle: Variant; ParametrosRecibo: TFinanceiroPagamentosParametrosDLL): Boolean; stdcall;
function  FinanceiroWebCancelarRecibo(AppHandle, ANumeroRecibo, ATalaoRecibo, AMotivoCancelamento: Variant): Boolean; stdcall;
function  FinanceiroWebEstornarRecibo(AppHandle, ANumeroRecibo, ATalaoRecibo: Variant): Boolean; stdcall;

function  FinanceiroWebPagarRecibo(AppHandle: Variant; ParametrosPagamentoRecibo: TFinanceiroPagamentosParametrosDLL): Boolean; stdcall;
function  FinanceiroWebCancelarPagamento(AppHandle, ANumeroRecibo, ATalaoRecibo, AMotivoCancelamento: Variant): Boolean; stdcall;

function  FinanceiroWebProcessarEncaminhamentos(AppHandle: Variant; ParametrosEncaminhamento: TFinanceiroPagamentosParametrosDLL): Boolean; stdcall;
procedure FinanceiroWebSincronizarEncaminhamento(AppHandle, ANumeroEncaminhaRecibo: Variant); stdcall;

function  FinanceiroWebGerarComprovanteDeposito(AppHandle: Variant; ParametrosDeposito: TFinanceiroPagamentosParametrosDLL): Boolean; stdcall;
```

| Rotina | O que faz (implementação) |
|---|---|
| `FinanceiroWebGerarRecibo` | Mapeia parâmetros via `Dll.MapParametros...ObterParametrosReciboPagamentoCancelamentoRecibo` e chama `TSkySistemasRecibos.Gerar`. Abre wait "Verificando dados para o recibo..." e, ao final, **sempre fecha o Wait global** (`WaitClose`). |
| `FinanceiroWebCancelarRecibo` | `TSkySistemasRecibos.Cancelar(NumeroRecibo, Talao, MotivoCancelamento)`. |
| `FinanceiroWebEstornarRecibo` | `TSkySistemasRecibos.Estornar(NumeroRecibo, Talao)`. |
| `FinanceiroWebPagarRecibo` | `TSkySistemasPagamentos.Pagar(ParametrosRecibo)` — obtém rota de pagamento na API e executa. |
| `FinanceiroWebCancelarPagamento` | `TSkySistemasPagamentos.Cancelar(NumeroRecibo, Talao, MotivoCancelamento)`. |
| `FinanceiroWebProcessarEncaminhamentos` | `TSkySistemasEncaminhamentos.Processar(Parametros)` — valida/obtém selos quando necessário e processa os encaminhamentos na API. |
| `FinanceiroWebSincronizarEncaminhamento` | `TSkySistemasEncaminhamentos.Sincronizar(NumeroEncaminhaRecibo)`. |
| `FinanceiroWebGerarComprovanteDeposito` | `TSkySistemasDepositosAntecipados.GerarComprovante(Parametros)`. |

> **Regras/validações internas relevantes (pagamento):**
> - Permitido apenas **um** encaminhamento por vez (origem encaminhamento) ou **um** recibo por vez (origem recibo).
> - Com integração Financeiro Web ativa, **não** são exigidos caixa preenchido nem validação
>   de permissões de caixa (esses checks ficam a cargo do front/SkySistemas).
> - No fluxo de pagamento com integração ativa, o **comprovante de depósito** é gerado via
>   `FinanceiroGerarComprovanteDepositoFinanceiroWeb`.

### 3.2 Tratamento de erro (JSON)

```pascal
procedure SetUltimoErroJson(const AJson: WideString);   // grava na DLL
function  ObterUltimoErroJson: WideString;              // lê no chamador
```

- Toda exceção nas rotinas `FinanceiroWeb*` é capturada, registrada via `SetUltimoErroJson`
  (inclusive erros de validação devolvidos pela API) e exibida em `MessageDlg` (exceto `EAbort`).
- O sistema chamador pode ler o detalhe com `ObterUltimoErroJson` após um retorno `False`.
- Validações de parâmetros devolvem JSON no formato:
  `{"errors":[{"field":"<campo>","message":"<mensagem>"}, ...]}`.

---

## 4. Configurações do Painel de Controle — aba **SkySistemas**

> **Seção interna do Financeiro.dll.** Somente para quem altera o Financeiro. Se o sistema
> Delphi só **consome** a integração, a única informação necessária daqui é o **padrão de
> salvamento** (seção 4.2): banco **Financeiro**, tabela `FINANCEIRO`, seção `SKYAPI` — para que
> todos os sistemas gravem no mesmo lugar. Para consumir, volte à seção 2 e use o checklist
> da skill.

### 4.1 Onde ficam (tela)

Painel de Controle do financeiro → **Opções** → aba **SkySistemas** (`tsSkySistemas`, dentro de
`pgFinanceiroDll`), no form `TfmPainelControleOpcoes`
(`Modulo\Financeiro_Dll\VCL\PainelControleOpcoesForm.pas`).

| Controle na tela | Configuração | Observação |
|---|---|---|
| `cbUsarIntegracaoFinanceiroWeb` (checkbox "Usar integração Financeiro Web") | `IntegracaoFinanceiroWeb` | Habilita/desabilita todo o fluxo web descrito neste documento. |
| `cbAmbienteSkySistemas` (combo: QA / Produção / Local / POC) | `Ambiente` | Ambiente da API. |
| `edToken` (edit, um por ambiente) | `Token[Ambiente]` | Token de acesso da API no ambiente selecionado. Ao trocar o ambiente no combo, o token exibido/gravado é o daquele ambiente. |
| `cbTipoAberturaFrontEnd` (combo: WebView4Delphi / Navegador padrão) | `TipoAcessoFront` | **Hoje, ao salvar, é sempre gravado `WebView`** (`ObterTipoAcessoFrontPorDescricao(tafWebView)`), independente da escolha. |

### 4.2 Onde são salvas (banco/tabela/seção)

Todas as configurações da aba SkySistemas são persistidas via `TIniFileFD`
(`Sky.Lib.Gen.IniFileFD`) — um "INI" dentro do **banco de dados Financeiro** (`dbFinanceiro`):

- **Banco:** `ParametrosSistema.Database[dbFinanceiro]` (banco do financeiro do cartório/entidade).
- **Tabela:** `FINANCEIRO` (criada automaticamente se não existir, com campos
  `SECAO`, `IDENTIFICADOR`, `VALOR` e `VALORBLOB`).
- **Seção:** `SKYAPI` (constante `SECAOSKYAPI`).
- **Chaves (identificadores, gravados em maiúsculas):**

| Chave | Tipo | Default | Conteúdo |
|---|---|---|---|
| `AMBIENTE` | string | `PROD` | `QA`, `PROD`, `LOCAL` ou `POC` |
| `INTEGRACAOFINANCEIROWEB` | bool | `False` | Usar integração Financeiro Web |
| `TIPOACESSOFRONT` | string | `WEBVIEW` | `WEBVIEW` ou `NAVEGADOR` |
| `TOKEN` | BLOB (`VALORBLOB`) | — | Token do ambiente **Produção** |
| `TOKENQALOCAL` | BLOB (`VALORBLOB`) | — | Token dos ambientes **QA** e **Local** |
| `TOKENPOC` | BLOB (`VALORBLOB`) | — | Token do ambiente **POC** |

- Os tokens são gravados como BLOB (UTF-8) e **criptografados com `TCrypto`** usando a
  `CryptoKey` do `Security` do sistema
  (`FCrypto.InitialiseString(Dll.ParametrosSistema.Security.CryptoKey)`).
- Toda escrita faz `Commit` da transação imediatamente.

### 4.3 Quando são gravadas

- **Somente se o usuário visitou a aba** SkySistemas no Painel de Controle no momento do `Ok`
  (flag interna `bSalvarSkySistemas`, setada em `pgFinanceiroDllChange`).
- A gravação ocorre no `btOkClick`, dentro do bloco
  `with FinanceiroParametros.SkySistemas do ...`:
  1. `IntegracaoFinanceiroWeb := cbUsarIntegracaoFinanceiroWeb.Checked`
  2. `Ambiente := ObterAmbientePorDescricao(cbAmbienteSkySistemas.Text)`
  3. `Token[Ambiente] := edToken.Text`
  4. `TipoAcessoFront := tafWebView` (fixo hoje)

### 4.4 Ambientes e URLs (unit `Sky.Lib.Sys.SkySistemasAPI.ConstTypes`)

| Ambiente | Código (chave `AMBIENTE`) | URL da API |
|---|---|---|
| QA | `QA` | `https://api.skyinfo.co/` |
| Produção | `PROD` | `https://api.skyinfo.com.br/` |
| Local | `LOCAL` | `http://localhost:5000/` |
| POC | `POC` | `https://api.poc.skyinfo.co/` |

---

## 5. Rotinas internas que utilizam essas configurações

> **Seção interna do Financeiro.dll.** Não é necessária para integrar um sistema externo.

> A leitura central é `FinanceiroParametros.SkySistemas.<propriedade>`, onde
> `FinanceiroParametros = TFinanceiroDllParametros.Create(Database[dbFinanceiro])`
> (`TFinanceiroDllParametros.SkySistemas` — unit `FinanceiroDll.Parametros.pas`).
>
> Localize cada rotina por **unit + classe/método** (a numeração de linhas muda a cada branch e
> não é usada aqui de propósito).

| Rotina / fluxo | Onde está | Como usa a configuração |
|---|---|---|
| `FinanceiroGerarRecibos` | `Financeiro.Recibos.FinanceiroGerarRecibos` (`Modulo\Financeiro_Dll\Recibos\Financeiro.Recibos.pas`) | Se `SkySistemas.IntegracaoFinanceiroWeb = True` → `TSkySistemasRecibos.Gerar(Parametros)` (via API SkySistemas); senão → `GerarReciboViaExe()` (fluxo legado). |
| `TFinanceiroPagamento.RegistrarPagamento` | `TFinanceiroPagamento.RegistrarPagamento` (`Share\Financeiro.Classes.pas`) | Se `IntegracaoFinanceiroWeb = True` → `TSkySistemasPagamentos.Pagar(rParametros)`; senão → `RegistrarPagamentoViaExe()`. |
| `TFinanceiroParametrosRecibo.SetShowFormularioGerarPagamento` | `TFinanceiroParametrosRecibo.SetShowFormularioGerarPagamento` (`Share\Financeiro.Classes.pas`) | Com `IntegracaoFinanceiroWeb` ativo, `ShowFormularioGerarPagamento` é **forçado a `False`** (fluxo automático, sem formulário local). |
| `ValidarParametros` / `ValidarConsistencia` (pagamento) | `ValidarParametros` / `ValidarConsistencia` (`Modulo\Financeiro_Dll\Pagamentos\Financeiro.Pagamentos.pas`) | Com `IntegracaoFinanceiroWeb` ativo, **não exige** `NomeCaixa` preenchido (**nem** `EscolherCaixa`) e **não executa** `ValidarPermissoesCaixa` (quem valida é o front/SkySistemas). |
| Fluxo de pagamento (pós-registro) | `Modulo\Financeiro_Dll\Pagamentos\Financeiro.Pagamentos.pas` | Com `IntegracaoFinanceiroWeb` ativo, gera o **comprovante de depósito** via `FinanceiroGerarComprovanteDepositoFinanceiroWeb` dentro do mesmo fluxo. |
| Cópia da flag para o recibo | `TFinanceiroParametrosRecibo.IntegracaoFinanceiroWeb` (`Share\Financeiro.Classes.pas`) | O valor de `IntegracaoFinanceiroWeb` é copiado para `TFinanceiroParametrosRecibo.IntegracaoFinanceiroWeb`, usado pelas rotinas internas de recibo/pagamento. |
| Selos antes da geração | `TSkySistemasRecibos.Gerar` / `TSkySistemasEncaminhamentos.Processar` | Quando a integração está ativa, chamam `ValidarEObterSelosAntesDaGeracaoDoReciboSeNecessario` (consulta à API SkySistemas) e encerram com `WaitClose`. |
| Autenticação nas chamadas REST | `Dll.ApiSkySistemas` (RESTClient: `Financeiro.RESTClient.*`) | Usa o `Token[Ambiente]` do ambiente configurado para autenticar nas chamadas à API SkySistemas. |

---

> O **checklist de entrega** da integração (o que conferir antes de fechar a tarefa) fica na
> skill `sky-delphi-integracao-financeiro-web`, em "Checklist final". As etapas de habilitação
> da integração no Painel de Controle estão na seção 4.