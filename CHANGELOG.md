# CHANGELOG

Novidades deste repositório para quem usa as regras, skills e plugins da Sky.
Texto em linguagem de usuário final, gerado a partir dos diffs (padrão da skill `sky-oquehadenovo`).
O que não muda a forma de trabalhar de quem usa o repo (renomeação interna, refatoração, CI, docs de estrutura) não entra.

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
