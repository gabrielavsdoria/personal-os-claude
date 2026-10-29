# Google Apps Script

Parte do sistema roda fora do Claude, em scripts do Google Apps Script. Eles fazem o trabalho **repetitivo e determinístico** (sem gastar tokens de IA) e deixam rastro numa planilha de registro que os agentes leem.

*Part of the system runs outside Claude, as Google Apps Script. These scripts do the repetitive, deterministic work (no AI tokens) and log everything to a spreadsheet the agents read.*

| Pasta | O que faz | Gatilho | Estado em 29/10/2026 |
|---|---|---|---|
| [`vigia-cores/`](vigia-cores/) | Põe cada evento novo na agenda e na cor certas, pela regra do título | a cada hora | rodando em modo `avisa` |
| [`arvore-drive/`](arvore-drive/) | Grava a árvore de pastas do Drive numa planilha | domingo 16h | rodando (160 pastas na instalação, 21/10) |
| [`gmail-modulo-e/`](gmail-modulo-e/) | Mapeia remetentes, cria rótulos e filtros, descadastra e arquiva | só quando chamado | rodado em 25/10 (273 e-mails arquivados) |
| [`app-pessoal-v0.2/`](app-pessoal-v0.2/) | Web app pessoal: tela "Hoje" e validar sugestões dos agentes | abrir no celular | código revisado, ainda não instalado |

## Regras que valem para todos

- **Sempre simula antes.** Toda ação que muda algo tem um modo de simulação (`avisa`, `_simular`, `MODO = simular`) que só anota o que faria. O modo real só é ligado depois que a pessoa confere o registro.
- **Nunca apaga** evento, e-mail ou arquivo.
- **Sem segredos no código.** IDs de agendas e planilhas e o e-mail da dona ficam nas Propriedades do script; nada de chave, token ou senha.
- **Só serviços nativos do Google**, autorizados por clique, com o menor conjunto de permissões que resolve.
- **Tudo é registrado** numa aba da planilha de registro (`Execuções` + uma aba por módulo).
- **Convite de outra pessoa não é mexido** (só a cor da cópia dela, quando é o caso).

## Por que Apps Script e não o Claude

O princípio P2 do sistema: automação só existe se o resultado é usado na hora. Tarefas que rodam toda hora (vigia) ou toda semana (árvore) custariam tokens sem ninguém olhando. No Apps Script elas custam zero e o Claude lê só o resultado. Ver também a [decisão 0004](../docs/decisions/0004-app-em-apps-script.md).

## Versão publicada × versão real

Os arquivos daqui são a **mesma lógica** do sistema real, com IDs, e-mail, nomes de disciplinas, empresas e remetentes trocados por exemplos. O vigia, que no sistema real usa funções de três arquivos, foi juntado num arquivo só para poder ser lido e instalado sozinho.
