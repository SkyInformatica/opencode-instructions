# README

> **Novo no OpenCode?** Leia o [guia completo de setup OPENCODE.md](OPENCODE.md) antes de prosseguir.

Repositório global de regras e configuração do [OpenCode](https://opencode.ai) para a **Sky Informática**.

## Instalação

### OpenCode Desktop (Windows)

Baixe e instale a versão desktop do OpenCode para Windows — não precisa de WSL:

- Instalador NSIS (64-bit): [opencode.ai/br/download/stable/windows-x64-nsis](https://opencode.ai/br/download/stable/windows-x64-nsis)
- Demais plataformas: [opencode.ai/br/download](https://opencode.ai/br/download)

### OpenChamber (IDE desktop — recomendado)

O [OpenChamber](https://github.com/openchamber/openchamber/releases) é a IDE desktop para OpenCode e o padrão sugerido pela Sky por ser bem mais completo que o OpenCode Desktop. Ele usa o OpenCode instalado no passo anterior como backend.

### Autenticar no OpenCode Zen

1. Abra o OpenCode Desktop ou OpenChamber
2. No menu **Settings**, procure a opção **Providers**
3. Adicione o provider **opencode zen**
4. Insira sua chave de API (da conta `@skyinformatica.com.br`)

### Configurar skills e regras

Após instalado, configure com o prompt abaixo.

### Configurar Ambiente Windows (Git, Node.js)

Antes de instalar plugins ou configurar regras, garanta que as ferramentas essenciais estão disponíveis. Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-configurar-ambiente-windows.md para configurar o ambiente
```

Isso instalará (se necessário) e configurará no PATH:
- **Node.js 18+** (necessário para plugins)
- **Git** (necessário para npm/npx e versionamento)
- **Microsoft Coreutils** (ls, cat, cp, mv, rm, find, grep etc. — necessário para shell e RTK no Windows)

## Configurar o OpenCode global

A configuração pode ser feita via **OpenCode Desktop** ou **OpenChamber** — ambos usam o mesmo arquivo `opencode.json` global. Em uma sessão do OpenCode, use o prompt abaixo:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-configurar-opencode.md para configurar meu opencode
```

O prompt é interativo e perguntará o escopo desejado. Você pode personalizar a instalação de diversas formas:

#### Exemplos de uso

**Instalação completa (regras + skills + modelos):**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-configurar-opencode.md para instalar todas as regras e skills da Sky
```

**Somente skills (todas):**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-configurar-opencode.md para instalar somente as skills da Sky
```

**Somente regras (todas):**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-configurar-opencode.md para instalar somente as regras da Sky
```

**Somente regras Delphi e SVN:**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-configurar-opencode.md para instalar somente as regras delphi e svn da Sky
```

**Somente regras de princípios:**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-configurar-opencode.md para instalar somente a regra principios da Sky
```

**Somente regras C# e Delphi:**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-configurar-opencode.md para instalar somente as regras csharp e delphi da Sky
```

**Somente configurar modelos (whitelist do Zen):**
```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-configurar-opencode.md para configurar somente os modelos do OpenCode Zen
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
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-instalar-secret-redactor-opencode.md para instalar o plugin
```

### Rehydra (anonimização de PII e secrets)

Plugin oficial que detecta e anonimiza PII (emails, telefones, CPFs, cartões) e secrets (API keys, JWTs, connection strings) antes de enviar ao LLM. Também detecta valores reais de variáveis de ambiente em arquivos `.env`.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-instalar-rehydra-opencode.md para instalar o plugin
```

### Caveman (respostas compactas)

Skill que comprime respostas do agente em formato terse/caveman, reduzindo tokens em ~65%.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-instalar-caveman-opencode.md para instalar o caveman
```

### RTK (compressão de output de bash)

Proxy CLI que intercepta comandos shell e comprime a saída antes do agente ler, reduzindo até 90% do output de bash (git, cargo, npm, docker, etc.).

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-instalar-rtk-opencode.md para instalar o RTK
```

### PonyTail (código mínimo)

Skill que força o agente a escrever apenas o necessário — YAGNI, stdlib primeiro, KISS. Reduz ~54% de código gerado (ate 94%) e ~20% de custo.

Em uma sessão do OpenCode, use o prompt:

```
siga as instrucoes do arquivo https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/refs/heads/main/prompt-instalar-ponytail-opencode.md para instalar o PonyTail
```

## Projetos Sky

Cada projeto mantém seu `AGENTS.md` (contexto de produto) e `.opencode/skills/` (playbooks). As regras globais vêm do repositório central automaticamente.

## Estrutura

- `global/` — modelos de referência para config global do OpenCode (`opencode.json`)
- `rules/` — regras de engenharia carregadas remotamente via `instructions`
- `skills/` — skills globais da Sky (C#, Delphi)
- `OPENCODE.md` — guia completo de setup OpenCode
