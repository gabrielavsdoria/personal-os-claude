# Estudo de caso · Um sistema pessoal de operações com agentes de IA

[English](case-study.md) · **Português**

> Desenhei e opero um sistema pessoal de operações: agentes de IA especializados (skills do Claude), automações em Google Apps Script e um banco de dados das próprias peças do sistema, com regras de governança para ele continuar confiável enquanto cresce. Esta é a história de como ele funciona e do que produziu no primeiro mês.

---

## 1. Problema

Em outubro de 2026 eu era estudante de engenharia ambiental e tinha, ao mesmo tempo: disciplinas com materiais espalhados entre Moodle, Google Classroom e e-mail; mais de 12 processos seletivos de estágio em portais diferentes, cada um com etapas e prazos próprios; um projeto de extensão; e os compromissos pessoais de sempre.

Cada tarefa era factível. O gargalo era **coordenar**: saber o que vencia primeiro, onde estava cada arquivo, o que priorizar e não deixar nada cair entre uma ferramenta e outra. Eu também queria apoio para as funções executivas (planejar, começar, manter o foco) sem depender de força de vontade.

A primeira tentativa, deixar a IA ajudar caso a caso em chats separados, criou outro problema: regras repetidas em vários lugares ficavam diferentes, tarefas agendadas falhavam sozinhas quando precisavam de login, e ninguém (nem eu) conseguia dizer do que o sistema era feito.

## 2. Desenho

Quatro camadas, cada uma com uma função clara ([arquitetura](architecture.md)):

| Camada | O que é | Exemplo |
|---|---|---|
| **Fontes** | onde a informação nasce | Gmail, Google Agenda (8 agendas por área da vida), Drive em Johnny Decimal, Moodle, portais de vagas |
| **Agentes** | skills do Claude com uma responsabilidade cada, mais Apps Script para o trabalho determinístico | radar de estágios, preparação de etapa, resumo da manhã, proposta da semana, faxina; vigia de agenda de hora em hora, módulo do Gmail |
| **Governança** | o que mantém o sistema coerente | banco do Mapa do Sistema, Diário, regras com fonte única e carimbo de versão, princípios com data, registros de decisão |
| **Saídas** | o que chega até mim | fila de prioridade, blocos de 25 min na agenda, docs de preparação, painel diário |

Três escolhas de desenho moldaram o resto:

1. **O agente propõe, eu valido.** Todo bloco criado por um agente nasce numa agenda separada de "sugestões", sem cor, e só vira compromisso depois do meu ok ([decisão 0002](decisions/0002-sugestoes-em-agenda-separada.md)). Nenhum agente envia e-mail, se inscreve em vaga ou apaga arquivo sozinho.
2. **Uma informação, um lugar.** Cada dado tem um único dono: só a skill do radar escreve na planilha de prioridade; o resumo da manhã só lê. Regra que precisa aparecer em vários lugares leva um carimbo de versão (ex.: `⟦CORES 2026-10-27⟧`) e o Mapa lista cada lugar onde ela aparece, para atualizar todos juntos.
3. **IA só onde precisa de julgamento.** O que roda toda hora ou toda semana sem eu olhar foi para o Apps Script, que não gasta tokens ([P1, P2](principles.md)). Tarefa agendada de IA só manda rodar a skill; o procedimento mora na skill, num lugar só ([decisão 0003](decisions/0003-tarefa-agendada-so-roda-skill.md)).

## 3. Como funcionam um dia e uma semana

**Um dia útil**
- **6h** · O resumo da manhã lê todas as agendas, as últimas 24h de e-mail e a fila de prioridade, publica um painel e manda uma mensagem de 5 a 7 linhas. Abre sempre por um primeiro passo concreto de 2 minutos ("abrir o e-mail do portal de 08/09 e clicar em Ver detalhes"), nunca por uma lista.
- **Durante o dia** · Trabalho em blocos de 25 min, um foco por bloco, com o primeiro passo escrito no evento. Carreira tem teto de 2h por dia útil.
- **De hora em hora** · O vigia (Apps Script) põe cada evento novo na agenda e na cor certas, pelo título.
- **No fim de cada chat** · A skill `encerrar-chat` registra no máximo 5 linhas de decisão, atualiza no Mapa as peças que mudaram e me entrega o prompt pronto da próxima tarefa.

**Uma semana**
- **Domingo 16h** · O Apps Script grava a árvore de pastas do Drive.
- **Domingo 17h** · Faxina rápida de arquivos: o agente propõe mover e apagar; nada acontece antes do meu ok.
- **Domingo 18h** · A proposta da semana faz a triagem da agenda (sugestão vencida é remanejada ou apagada, e todo não feito é registrado para achar padrões) e propõe as próximas duas semanas. Os eventos só são criados depois do meu ok.
- **Domingo e quarta** · O radar varre portais e e-mail, recalcula a nota (0 a 100) de cada processo e propõe no máximo 3 inscrições novas por semana ([decisão 0001](decisions/0001-prazo-fora-da-nota.md)).
- **Antes de cada etapa** · A skill de preparação pesquisa empresa, mercado e pessoas com fonte, monta um plano em blocos e uma página de foco e, depois, registra o que eu aprendi.

## 4. Governança

| Mecanismo | O que faz |
|---|---|
| **Mapa do Sistema** | Banco de dados de todas as peças (skills, tarefas, scripts, docs, páginas), com dono, situação, peça-pai e pendências. Nada é apagado: peça aposentada mantém o histórico. Escrita com controle de versão. [Esquema](../templates/mapa-schema.md) |
| **Log de mudanças** | Uma linha por mudança, ligada ao chat que a fez e às peças que ela afeta. |
| **Diário do sistema** | No máximo 5 linhas de decisão por conversa, só acrescentando; correção é linha nova. Todo domingo as linhas novas passam para o registro do sistema. [Formato](../templates/diario-linha.md) |
| **Propostas com mini-PRD** | Toda ideia de melhoria ganha: por quê, pronto quando, dá para desfazer?, risco. A situação vai de ideia a em uso. |
| **Princípios com data** | 45 regras que guiam outras decisões, cada uma com a data e o problema de onde veio. [Seleção](principles.md) |
| **Skills versionadas** | Toda skill tem versão e o que mudou. Um chat por vez mexe numa skill ou tarefa agendada, sempre partindo da versão atual. |
| **Pesquisa antes de construir** | Antes de implementar uma proposta, revisar com fontes externas atuais e dizer o que mudou. O app pessoal foi escolhido depois de 115 fontes e 5 opções com nota ([decisão 0004](decisions/0004-app-em-apps-script.md)). |
| **Segurança desde o início** | Simular antes de executar; nunca apagar evento, e-mail ou arquivo; agente nunca digita senha (login caído ou captcha = pular e avisar); nada de segredo no código; dado de saúde nunca vai para página publicada. |

## 5. Resultados (outubro de 2026)

Todos os números foram contados em 29/10/2026, no banco do Mapa do Sistema e nos registros de execução. Nenhum é estimativa.

| O quê | Número | Fonte |
|---|---|---|
| Peças registradas no Mapa | **275** (52 docs do Drive, 43 arquivos .md, 39 ideias, 30 grupos, 25 páginas, 24 skills incluindo aposentadas e a criar, 21 frentes, 15 scripts, 10 projetos, 5 docs, 4 rotinas, 4 tarefas agendadas (2 ativas), 2 planilhas, 1 raiz); 11 marcadas como sensíveis | Mapa, `pecas` |
| Mudanças registradas | **252** entre 05/10 e 27/10 (134 em 22/10, dia da migração do Mapa para banco de dados) | Mapa, `log` |
| Propostas de melhoria, cada uma com mini-PRD | **101** (25 ideia, 21 proposta, 19 em andamento, 20 em uso, 11 feitas, 5 decididas) | Mapa, `propostas` |
| Princípios de desenho com data | **45** | registro do sistema |
| Skills próprias ativas | **16**, cerca de 2.675 linhas de instruções somadas | arquivos das skills |
| Iterações das skills principais | coleta do Moodle: 13 versões no Mapa · plano de estudo para prova: v4 · radar de estágios: v5 · encerrar chat: v5 | Mapa e cabeçalho das skills |
| Eventos de agenda reorganizados pelos scripts | lote 1: 47 + 5 (21/10) · lote 2: mais de 200 | registro do Apps Script |
| E-mails arquivados na 1ª rodada do módulo do Gmail | **273**, com 7 rótulos (nada enviado, encaminhado ou apagado) | registro do Apps Script |
| Arquivos de disciplinas renomeados para o padrão | **163** (13/10) | manifesto do Moodle |
| Pastas do Drive na árvore | **160** (21/10) | registro do Apps Script |
| Processos seletivos priorizados na 1ª rodada do radar | **12** | planilha do radar |
| Decisão do app pessoal | **115** fontes; 5 opções com nota (web app em Apps Script 25, AppSheet 23, PWA local 23, Firebase 19, página do Claude 16) | decisão 0004 |

Linha do tempo: organização do Drive com IA desde set/2026 · Diário desde 05/10 · Mapa com banco de dados desde 21/10.

## 6. O que aprendi

- **Agente bom tem escopo pequeno.** Cada skill tem uma responsabilidade e lê as outras como fonte, em vez de copiar as regras delas. Mudar uma regra é mudar um lugar.
- **O dado precisa de dono.** Um só escritor por lugar evita duas versões da mesma informação.
- **Automação também sobrecarrega.** A planilha segura o backlog e a agenda mostra pouco. Os limites (3 inscrições por semana, 2h de carreira por dia) protegem o tempo, não só organizam.
- **Tarefa agendada e login não combinam.** O que precisava de login ou do computador ligado falhava sozinho. Virou skill sob demanda, e só o que roda inteiro na nuvem continua agendado (P1).
- **Relatório que ninguém usa é custo.** Automações que gastavam tokens sem ninguém usar o resultado saíram ou foram para o Apps Script (P2).
- **Governança se paga cedo.** Com o Mapa e o log, uma mudança na regra de cores chegou de uma vez a todos os lugares onde ela aparece, e o carimbo de versão mostrou quais cópias ainda estavam atrás.

Aprendizados sobre os limites das ferramentas (conectores, APIs): [lessons.md](lessons.md).

## 7. Próximos passos

- **Instalar o app pessoal** (v0.2, já revisado em segurança): uma tela no celular para aceitar, recusar ou mover as sugestões dos agentes sem abrir um chat, começando uma semana em modo de simulação.
- Passar o vigia de agenda de "avisa" para "corrige" depois de conferir os avisos da regra de cores nova.
- Mais sete automações em Apps Script estão rascunhadas (tempo por área da vida, prova sem bloco de revisão, backup diário das planilhas do sistema), todas com modo de simulação e nenhuma instalada ainda.

---

Feito por [Gabriela Dória](https://github.com/gabrielavsdoria) · Engenharia Ambiental, Poli-USP
