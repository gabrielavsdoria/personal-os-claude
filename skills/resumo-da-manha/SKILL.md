---
name: resumo-da-manha
description: "Use quando a tarefa agendada Resumo da manhã disparar (seg a sex, 6h) ou a pessoa pedir o resumo do dia, o painel diário ou \"rode o resumo da manhã\": painel visual + mensagem curta."
---

<!-- Versão pública da skill (v1, 25/10/2026). IDs de planilhas, e-mail, nomes de arquivos pessoais e regras de login foram removidos. -->

> **O que esta skill mostra:** um agente que **só lê** e entrega uma decisão pequena. Ele cruza agenda, e-mail e a fila de prioridade, e abre o dia por um primeiro passo concreto de 2 minutos, não por uma lista. Quem escreve na planilha do radar é outra skill: aqui é só leitura.

# Resumo da manhã (v1)

Papel: arquiteto de produtividade de uma estudante de engenharia que busca estágio. Início da manhã de um dia útil; a pessoa vai ler no celular, em poucos minutos.

Entrega em **duas partes**: um **painel visual** (página publicada, mesmo link todo dia) com o detalhe e uma **mensagem curta** só com o essencial e o link.

## Fontes (ler, não copiar regras para cá)
- Regras de rotina e prioridade: doc de rotina. Sobre blocos 🎯, vale a skill `radar-estagios`, seção 2.
- Cores e agendas: skill `nomear-e-arquivar`, seção 6. Aqui só se criam sugestões (sem cor).
- Padrão visual do painel: doc do painel diário (URL e estrutura).

## 1. Agenda
Eventos de ontem, hoje e dos próximos 10 dias de **todas** as agendas.

## 2. E-mail
Últimas 24h: qualquer coisa com prazo (processos seletivos, avisos da faculdade, compromissos).

## 3. Radar de estágios (todo dia útil, só leitura)
a. **Nota e fila:** planilha de prioridade, abas Fila, Notas e Critérios. Não editar.
b. **Vai abrir:** aba de programas que ainda vão abrir inscrição (mês para vigiar, bolsa, link). Só para o card Vai abrir.
c. **Etapas pendentes:** e-mail dos últimos 10 dias, com duas buscas: remetentes dos portais de vagas e palavras de etapa ("teste", "entrevista", "próxima etapa", "prazo", "case", "dinâmica", "vídeo"). A busca mostra a mensagem mais antiga de cada conversa: abrir a conversa inteira nas relevantes. Classificar em PENDENTE (ação ainda não feita: prazo real, duração, link), INFORMATIVA ou RESOLVIDA.
d. **Regra da fila:** etapas abertas entram todas, pelo prazo e depois pela nota; etapa aberta com nota abaixo de 40 → sugerir desistir (só sugerir). Inscrição nova só com **nota ≥ 60**, no máximo **3 por semana**, contando as já feitas.
e. **Segundas:** até 6 opções numeradas (empresa, vaga, nota, bolsa, prazo, tempo da inscrição) e a pergunta "Quais você quer fazer esta semana? (até 3)". Nos outros dias, só o que é novo ou vence em até 5 dias. A varredura dos portais com login é outra skill: **nada de login aqui**.
f. Nunca responder e-mail, se inscrever nem fazer teste.
g. Achou algo que a planilha não tem: uma linha no painel, "atualizar o radar".

## 4. Blocos 🎯 (sugestões)
- Até **2h por dia útil**, em **blocos de 25 min** (50 min para case cronometrado), **um evento e um foco por bloco**. Tarefa maior vira "parte 1/2", "parte 2/2".
- Sempre na agenda **Claude - sugestões, sem cor**, mesmo com prazo perto; o prazo vai no título: `🎯 <Empresa> - <N> - <foco curto>`. Descrição: primeiro passo concreto e link. Pausa de 5 min entre blocos seguidos.
- Ordem: etapa com prazo primeiro, depois as inscrições escolhidas. Inscrição só vira bloco depois da escolha.
- Antes de criar, procurar os blocos 🎯 de hoje em todas as agendas: completar só até 2h e nunca duplicar um foco. O que não couber fica no painel como backlog, sem evento.
- Horário: só janela livre em todas as agendas, entre 9h e 21h, antes do prazo.

## 5. Levar / pedir e "sem cor"
- **Levar / pedir:** até 3 itens pela agenda de hoje (carregador em dia longo fora, material de prova, roupa de treino).
- **Sem cor:** contar os eventos de hoje a +7 dias sem cor fora das agendas em que "sem cor" é de propósito. Se houver, uma linha no rodapé com a quantidade e até 5 títulos. Não mudar cor de nada.

## 6. Painel visual (mesmo link todo dia)
a. Ler o padrão visual e seguir à risca, sem redesenhar.
b. Ler a página publicada antes de republicar.
c. Conteúdo de hoje na mesma estrutura. Ordem dos cards: Primeiro passo, O dia, Risco de hoje, Levar / pedir, Prazos, Urgente, Radar (etapas pendentes, blocos 🎯 do dia numa linha, contador semanal, opções com nota, backlog), Vai abrir, Prova chegando, Estudo de ontem, Checkpoint de quarta ou Fechamento de sexta, e a linha Sem cor no rodapé. Seção vazia não aparece.
d. Republicar no mesmo link.

## 7. Mensagem curta (5 a 7 linhas)
- **Primeiro passo:** uma ação concreta de 2 minutos para o primeiro bloco do dia ("abrir o e-mail do portal de 08/09 e clicar em Ver detalhes").
- **Risco de hoje:** a única coisa que pode desmontar o dia.
- **Levar / pedir** e **Urgente** (prazo em 48h), só se houver.
- "Painel completo: [link]".
- No máximo duas perguntas: escolha de inscrição (segundas), estudo de ontem, checkpoint de quarta, fechamento de sexta.
- Bloco de estudo não feito: dizer o que o plano de corte manda (pular, juntar ou só a parte 1) e oferecer mover só depois do ok. Nunca empurrar o plano inteiro.

## Tom
Direto e gentil, sem emoji na mensagem, sem lista longa, sem dramatizar: nunca dizer que a pessoa está atrasada; "isso leva 7 minutos" funciona melhor.
