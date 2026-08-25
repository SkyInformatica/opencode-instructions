# README

Repositório global de regras e configuração do [OpenCode](https://opencode.ai) para a **Sky Informática**.

## Instalação

### OpenChamber (IDE desktop)

Instale o [OpenChamber](https://github.com/openchamber/openchamber/releases) (IDE desktop para OpenCode)

### Autenticar no OpenCode Zen

1. `opencode auth login`
2. Selecione **opencode zen**
3. Insira sua chave de API (da conta `@skyinformatica.com.br`)

### Configurar skills e regras

Após instalado, configure com o prompt abaixo.

## Configurar o OpenCode global

Em uma sessão do OpenCode, use o prompt abaixo:

```
siga as instrucoes do arquivo https://github.com/SkyInformatica/opencode-instructions/blob/main/prompt-configurar-opencode.md para configurar meu opencode
```

Isso configurará automaticamente:

- **`%USERPROFILE%\.config\opencode\opencode.json`** — modelo e small_model do agente, `instructions` apontando para todas as regras em `rules/` deste repositório
- **`%USERPROFILE%\.config\opencode\rules\`** — regras da Sky (principios, svn, Delphi)
- **`%USERPROFILE%\.config\opencode\skills\`** — skills da Sky (C#, Delphi)

Tudo carregado remotamente, sem copiar arquivos para cada projeto. O prompt é seguro para executar múltiplas vezes: nunca duplica nem sobrescreve configurações existentes.

## Instalar plugins

### Secret Redactor (proteção contra vazamento de segredos)

Plugin que anonimiza chaves, tokens e strings de conexão antes de enviar ao LLM, prevenindo vazamento de dados sensíveis. Zero configuração após instalação.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://github.com/SkyInformatica/opencode-instructions/blob/main/prompt-instalar-secret-redactor-opencode.md para instalar o plugin
```

### Rehydra (anonimização de PII e secrets)

Plugin oficial que detecta e anonimiza PII (emails, telefones, CPFs, cartões) e secrets (API keys, JWTs, connection strings) antes de enviar ao LLM. Também detecta valores reais de variáveis de ambiente em arquivos `.env`.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://github.com/SkyInformatica/opencode-instructions/blob/main/prompt-instalar-rehydra-opencode.md para instalar o plugin
```

### Caveman (respostas compactas)

Skill que comprime respostas do agente em formato terse/caveman, reduzindo tokens em ~65%.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://github.com/SkyInformatica/opencode-instructions/blob/main/prompt-instalar-caveman-opencode.md para instalar o caveman
```

### RTK (compressão de output de bash)

Proxy CLI que intercepta comandos shell e comprime a saída antes do agente ler, reduzindo até 90% do output de bash (git, cargo, npm, docker, etc.).

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://github.com/SkyInformatica/opencode-instructions/blob/main/prompt-instalar-rtk-opencode.md para instalar o RTK
```

### PonyTail (código mínimo)

Skill que força o agente a escrever apenas o necessário — YAGNI, stdlib primeiro, KISS. Reduz ~54% de código gerado (ate 94%) e ~20% de custo.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://github.com/SkyInformatica/opencode-instructions/blob/main/prompt-instalar-ponytail-opencode.md para instalar o PonyTail
```

## Projetos Sky

Cada projeto mantém seu `AGENTS.md` (contexto de produto) e `.opencode/skills/` (playbooks). As regras globais vêm do repositório central automaticamente.

## Estrutura

- `global/` — modelos de referência para config global do OpenCode (`opencode.json`)
- `rules/` — regras de engenharia carregadas remotamente via `instructions`
- `skills/` — skills globais da Sky (C#, Delphi)
- `OPENCODE.md` — guia completo de setup OpenCode
