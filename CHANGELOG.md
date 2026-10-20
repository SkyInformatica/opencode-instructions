# CHANGELOG

Novidades deste repositório para quem usa as regras, skills e plugins da Sky.
Texto em linguagem de usuário final, gerado a partir dos diffs (padrão da skill `sky-oquehadenovo`).
O que não muda a forma de trabalhar de quem usa o repo (renomeação interna, refatoração, CI, docs de estrutura) não entra.

## 2026-10-19

### Novos recursos e melhorias

- Skill `sky-dotnet-relatorios-padrao`: o alinhamento do texto entre fontes de tamanhos diferentes passou a ser tratado. O motor do FastReport recua o texto proporcionalmente ao tamanho da fonte — e o negrito recua um pouco mais — então um cabeçalho de 7 pt e o detalhe de 8 pt da mesma coluna começavam em pontos diferentes mesmo com a posição declarada idêntica. A skill agora traz a tabela de deslocamento medida e a regra de compensação, e as divisórias passam a começar e terminar junto com o texto. (hash)
- Skill `sky-dotnet-relatorios-padrao`: a propriedade de preenchimento (`Padding`) do FastReport aceita apenas números inteiros — valor com casas decimais é descartado **sem erro** e volta ao padrão, o que fazia o ajuste desaparecer silenciosamente. Quando a diferença entre dois tamanhos de fonte é menor que 1 px (o caso do cabeçalho de 7 pt contra o detalhe de 8 pt), a compensação vai em parte no preenchimento e em parte na posição do objeto. (hash)
- Skill `sky-dotnet-relatorios-padrao`: duas ferramentas novas — uma que mede o deslocamento do texto por tamanho e peso de fonte, exportando a 600 dpi (a 96 dpi a diferença não aparece), e um script que aplica a compensação num `.frx` em modo de simulação, gravando só quando pedido. (hash)

### Soluções de problemas

- Skill `sky-dotnet-relatorios-padrao`: o guia rápido citava a fonte **Arial**, que o padrão proíbe; corrigido para **Open Sans**. As margens citadas (15 mm) foram mantidas. (hash)

## 2026-10-20

### Novos recursos e melhorias

- Instalação do Caveman no OpenCode V2: o prompt passou a usar a versão estável oficial (`v4.0.1`), que já instala o plugin no formato do V2 — junto com 9 skills, 8 comandos e 3 subagentes — sem precisar aplicar um port manual. Quem tinha a instalação manual antiga (`index.js`) migra com `--force`, que faz backup da pasta antes de substituir. O port que ficava em `v2/plugins/caveman/` foi removido.

### Soluções de problemas

- Instalação do RTK no OpenCode V2: o prompt deixou de mandar instalar um build de desenvolvimento e baixar o plugin de um PR. O suporte ao V2 chegou na versão estável oficial (`v1.0.0`) e o próprio `rtk init` já instala o plugin no formato que o V2 carrega — a instalação volta a ser só baixar o binário e rodar o comando, sem conversão manual. O comando usa `--hook-only --no-patch` para não configurar outros agentes por engano, e o caminho do `config.toml` no Windows (`%APPDATA%\rtk\`) e a validação foram corrigidos (o `rtk init --show` não mostra o plugin do OpenCode).

## 2026-10-06

### Novos recursos e melhorias

- MCP do SkyNet: lançada a instalação oficial do MCP do sistema de atendimentos, com prompt próprio e instruções de contexto, no mesmo padrão dos MCPs de Redmine e Azure DevOps. O servidor e o script de renovação do token (~8h) ficam em `%USERPROFILE%\.config\opencode\mcp\skynet\` e as instruções na raiz do `.config\opencode\`; o README ganhou a seção "Instalar MCP SkyNet".
- MCPs: os arquivos de instalação de Redmine e Azure DevOps (prompts e instruções de contexto) foram organizados na pasta `mcp/`, com uma subpasta exclusiva por servidor (`mcp/redmine/` e `mcp/azuredevops/`) — os comandos do README e os downloads das instruções já usam os novos caminhos, sem mudança na instalação para quem usa os prompts.
- MCP do Redmine: as instruções de contexto ficaram mais completas sobre o fluxo das tarefas — o que conta como liberar versão (sair de Resolvida para Fechada ou preencher a Versão estável), que fechar a tarefa de desenvolvimento não fecha a tarefa de testes quando ela ainda está no estoque do QS, e em quais tarefas o teste é dispensado. Também entrou a referência da API de indicadores do plugin, que devolve o fluxo de desenvolvimento já consolidado (datas e tempos em dias de todas as tarefas encadeadas, horas somadas, etapa atual e flags como "versão liberada antes dos testes"), com o significado de cada campo.

## 2026-09-30 — semana de 24 a 30/09/2026

### Novos recursos e melhorias

- OpenCode V2: a configuração, os agents e os prompts de instalação passaram a ter uma pasta própria, e o V2 virou o padrão dos comandos de instalação; o V1 continua disponível em pasta separada para as máquinas que ainda não migraram. (25c449e, 6991eeb)
- OpenCode V2: o plugin que corrige a acentuação de arquivos Delphi legados foi adaptado para a nova versão, mantendo a correção de leitura e gravação. (6991eeb)
- Plugins Caveman e Ponytail: ganharam versão compatível com o OpenCode V2, com os comandos de escolha de modo funcionando na nova versão. (85b2a09, 41a7f3d)
- Instalação: a instalação de plugins no V2 passou a usar a descoberta automática de plugins, sem precisar declarar o plugin na configuração — quem já tinha a entrada declarada pode removê-la. (82f31e1)
- Instalação: agora é possível pedir as regras e skills por time, basta informar "somente delphi" ou "somente dotnet" em vez de citar item por item; os itens compartilhados entram junto, avisando o usuário. (1863e68)
- Skills Delphi: adicionada a skill de padrão de interfaces, que orienta a criação e modernização de telas Delphi com regras de layout visual e geométrico (alinhamento, posicionamento, espaçamento, sobreposição de componentes). (97afb97)
- Regras Delphi: a regra de encoding ganhou item próprio e o controle de versão passou a fazer parte da regra de SVN — agora dá para instalar só a regra de SVN ou só a de encoding. (fa124fe, 58d0ea2)
- "O que há de novo": a geração do texto passou a considerar só defeitos que já existiam na versão publicada, descartando correções de problemas que surgiram durante o próprio desenvolvimento da branch. (ba28ff1)
- "O que há de novo" (Sk.AI): a configuração específica do Sk.AI saiu da skill genérica e passou a ser uma skill do time .NET, com a área "Chat" como nome padronizado para o domínio de agentes de IA. (599fda5, ba28ff1)
- Autenticação: o OpenCode Zen agora autentica por login no navegador, com autorização de acesso, sem necessidade de digitar chave de API. (ef743f0)
- Acompanhamento: criado este CHANGELOG, para acompanhar as evoluções do repositório sem ler os commits. (ba28ff1)

### Soluções de problemas

- Instalação: as instruções de instalação dos plugins passaram a dizer com precisão em que situação cada um funciona ou não no OpenCode V2 (Caveman, RTK, Rehydra e Secret Redactor), evitando instalar em máquina V2 uma versão que simplesmente não carrega. (cf55cbb, 88e3d39)
- Instalação do RTK: a instalação no OpenCode V2 deixa de descartar o plugin logo após instalar — a conversão exigida pelo carregador da nova versão virou passo obrigatório das instruções, com validação pelo log. (5ba3d24)
- Instalação: o Secret Redactor deixou de ser sugerido como alternativa ao Rehydra no OpenCode V2, já que os dois falham pelo mesmo motivo; o caminho agora é aguardar a versão compatível. (88e3d39)
- Instalação: as regras e skills receberam nomes padronizados por time (ex.: `sky-delphi-*`, `sky-dotnet-*`). Quem instalou a versão anterior precisa rodar a instalação de novo, senão fica com regras antigas de encoding e SVN ativas. (1863e68, 25c449e)
