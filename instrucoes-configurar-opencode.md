# Instruções: Configurar OpenCode com regras globais da Sky Informática

Use este arquivo como prompt para o OpenCode agente configurar o `opencode.json` global na máquina do desenvolvedor.

## Como usar

Copie e cole o prompt abaixo em uma sessão do OpenCode (TUI ou OpenChamber) na máquina que deseja configurar.

## Prompt para o agente

```
Configure o OpenCode global na minha máquina Windows com as regras da Sky Informática.

Passos:

1. Verifique se a pasta %USERPROFILE%\.config\opencode\ existe. Se não existir, crie-a.

2. Crie o arquivo %USERPROFILE%\.config\opencode\opencode.json com o conteúdo abaixo.
   ATENÇÃO: mantenha o $schema exato, incluindo o cifrão — é um identificador do schema, não variável.

   Conteúdo do arquivo:
   {
     "$schema": "https://opencode.ai/config.json",
     "instructions": [
       "https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/rules/principios.md"
     ]
   }

3. Verifique se o arquivo foi criado corretamente lendo seu conteúdo.

4. Confirme que a URL raw dos principios.md está acessível (não precisa baixar, só validar que o repositório é público).

Pronto. A partir da próxima sessão do OpenCode em qualquer projeto, os principios.md serão carregados automaticamente.
```

## O que esse setup faz

Toda sessão do OpenCode carregará automaticamente os princípios de engenharia da Sky Informática (`rules/principios.md`) de forma remota, SEM precisar copiar arquivos para cada projeto.

## Pré-requisitos

- OpenCode instalado na máquina (qualquer versão recente)
- Acesso à internet para carregar as regras remotas
- Git (opcional, apenas para contribuir com este repositório)

## Verificação

Para confirmar que funcionou, abra uma sessão OpenCode em qualquer projeto e peça:

```
Liste as regras globais que estão ativas nesta sessão.
```

O agente deve responder citando os principios.md carregados do repositório Sky Informatica.