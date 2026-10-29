---
name: proposta-da-semana
description: "Use quando a tarefa agendada Proposta da semana disparar (domingo 18h) ou a pessoa pedir \"monte a semana\", \"rode a proposta da semana\" ou a triagem de domingo: triagem e revisão da agenda, proposta de 2 semanas para validar, caixa de ideias para o Mapa."
---

<!-- Versão pública da skill (v1.2, 27/10/2026). IDs de agendas e planilhas, e-mail, endereços, nomes de disciplinas e tudo o que é de saúde foram removidos ou trocados por nomes genéricos. -->

> **O que esta skill mostra:** planejamento semanal com humano no loop. Ela limpa o que venceu, registra o que não foi feito (para achar padrões), propõe duas semanas e **só cria eventos depois do ok**. A tarefa agendada só dispara esta skill; o procedimento mora aqui, num lugar só.

# Proposta da semana (v1.2)

Papel: arquiteto de produtividade de uma estudante de engenharia que busca estágio. Domingo à noite.

Tarefa: montar a proposta das **próximas duas semanas** (semana 1 detalhada, semana 2 em esboço) e mandar para validar. **Não criar, editar nem apagar evento nesta rodada, exceto a triagem (passo 0).** Só depois do "ok" (ou dos ajustes) os eventos aprovados são criados.

## Fontes (ler, não copiar regras para cá)
- Doc de rotina: prioridade, durações, deslocamentos, sono, refeições, treino.
- Blocos 🎯 de carreira: skill `radar-estagios`, seção 2 (vale sobre o doc se divergir).
- Cores e agendas: skill `nomear-e-arquivar`, seção 6, com carimbo ⟦CORES AAAA-MM-DD⟧. Se um doc tiver carimbo mais velho, vale a skill.

## 0. Triagem e revisão da agenda (antes de tudo, sem perguntar)
a. **Visualização:** apagar os ◦ (rotina) e deslocamentos que terminaram antes de hoje. Não tocar em outros eventos.
b. **Claude - sugestões:** cada sugestão não validada (sem cor, criada pelo Claude: estudo, "Disciplina — Lista X", 🎯, lembrete de ação) cujo horário passou:
   - ainda dá para fazer → recriar como sugestão em horário livre antes do prazo e apagar a antiga;
   - a oportunidade passou (prova feita, prazo vencido, vaga fechada) → apagar.
   Lembretes recorrentes sem IA (faxina, coleta de materiais, passagem do Diário) não são sugestões: não mexer.
c. **Registro dos não feitos:** toda sugestão que passou sem ser feita ganha uma linha na planilha "Não feitos - triagem semanal": Data da triagem · Evento · Tipo (estudo, carreira, rotina, ação) · Prazo original · Destino · Motivo · Padrão. Nunca reescrever linhas antigas.
d. **Revisão das próximas 2 semanas:** aula em feriado, conflito de horário, compromisso sem endereço, prova sem bloco de revisão nos 7 dias antes, social sem confirmação. **Corrigir só o simples** (endereço de lugar conhecido em evento criado pelo Claude); o resto vira linha nos riscos.
e. Na proposta, 1 a 3 linhas: quantos ◦ e deslocamentos apagou, quantas sugestões remanejou e apagou, o que a revisão achou. Se houver 3 ou mais não feitos do mesmo tipo em 2 semanas, apontar o padrão em uma frase e sugerir um ajuste.

## 1. Contexto antes de propor
1. Ler o doc de rotina.
2. Eventos dos próximos 15 dias de **todas** as agendas: Claude - sugestões, Faculdade, Carreira, Bem-estar, Social e Lazer, Projetos, Feriados e férias, Visualização.
3. E-mail dos últimos 7 dias: prazos de processos seletivos, avisos da faculdade. Anotar o **prazo real** de cada etapa.
4. Radar de estágios (planilha de prioridade, aba Fila), só leitura: etapas abertas pelo prazo; inscrições novas só com nota ≥ 60, no máximo 3 por semana, a pessoa escolhe.
5. "Próxima decisão sugerida" do registro do sistema (ou o próximo passo não feito da aba Ordem do Mapa).
6. **Pendências da faculdade** (doc de provas e pendências): datas nos próximos 14 dias e decisões que só a pessoa pode dar. Listas com prazo viram sugestões "Disciplina — Lista X". Prova nos próximos 14 dias → risco + blocos de estudo propostos.
7. **Prever disposição:** evento que termina depois das 23h = noite longa; na manhã seguinte, nada de estudo antes das 10h.

## 2. Caixa de ideias e propostas do Mapa
a. Doc "Caixa de ideias": ler só a primeira seção "Ideias novas".
b. Para cada ideia, preparar uma proposta do Mapa: título curto, descrição com as palavras da pessoa, área, tipo, onde, situação "ideia". Mostrar só a contagem e até 3 exemplos. **Depois do ok:** gravar no Mapa num batch só, marcar a seção como lida e criar acima dela uma seção nova vazia. Nunca apagar nada do doc.
c. **Menu da semana:** sugerir 1 ou 2 propostas do Mapa que caibam na semana (impacto alto e esforço baixo primeiro). Não repetir uma recusada na semana anterior.
   **Limite de projetos ativos:** no máximo 1 projeto pessoal e 1 em grupo ao mesmo tempo, exceto com prazo externo. Antes de sugerir algo que abre projeto novo, conferir quantos estão ativos; se não couber, dizer qual teria de pausar. Filtro: prazo ou alguém depende → destrava outros → ajuda estágio ou faculdade → faz bem.
d. **Pela metade:** contar as propostas "em andamento" e dizer quantas são e a mais antiga.

## 3. Faxina (só contar)
Contar os arquivos modificados nos últimos 7 dias na raiz do Drive ou na `01 - Inbox`. Não abrir nenhum. A faxina em si roda só quando a pessoa pedir (skill `faxina-arquivos`).

## 4. Regras fixas
- Ordem única quando algo colide: prazo avaliativo da faculdade > etapa de processo com prazo > blocos de estudo > inscrições novas > o resto. Sono, refeição e treino são **piso**, não sobra.
- Sono: 9h ideal, 8h mínimo, 7h em dia corrido.
- **Carreira:** até 2h de 🎯 por dia útil, em blocos de 25 min (50 min para case cronometrado), um evento e um foco por bloco, sempre como sugestão sem cor. Etapa pendente vence inscrição nova. Vaga sem fit não vira bloco: vai para os não feitos como "descartada", com o motivo.
- Prova ocupa 2h40 a partir do início (atraso + prova + tempo extra).
- Horário livre = sem evento com horário em nenhuma agenda (◦ e deslocamentos ocupam; dia inteiro e "disponível" não).
- Nada de saúde vai para o Mapa nem para página publicada.

## 5. A proposta (visão geral primeiro, tópicos curtos, uma ideia por linha)
Nesta ordem:
- Linhas da triagem e da revisão (passo 0e).
- Conflitos e riscos das duas semanas, no máximo 5 linhas.
- **Semana 1, dia a dia**, com hora e duração: entregas da faculdade, blocos 🎯, estudo, treino, refeições, deslocamentos e dois descansos sem nada. **Semana 2 em esboço.**
- Sem compromisso social na semana: perguntar se quer marcar um; não inventar.
- Uma pergunta só, a mais útil da semana.
- "Faculdade pendente: [até 3 itens] · [N] no total".
- "Ideias: [N novas] → Mapa · Menu da semana: [1 ou 2 propostas, com o #] · Pela metade: [N]".
- "Faxina: [N] arquivos novos na raiz e na Inbox. Quer rodar a faxina rápida?" (omitir se 0).
- Por último: "Organização: [próxima decisão do passo 1.5]". Se a pessoa responder, anotar uma linha no fim do Diário do sistema.

## 6. Depois do "ok": onde e como criar
O conector da agenda não move evento entre agendas: para "mover", recriar na agenda certa e apagar o original (só eventos criados pelo Claude). Rotina e deslocamentos para 14 dias; estudo e 🎯 só para a semana 1.
- **Deslocamentos:** Visualização, "Deslocamento — [origem] → [destino]", Grafite (colorId 8), ocupado, sem lembrete.
- **Rotina** (◦ Almoço, ◦ Jantar, ◦ Rotina da noite, ◦ Acordar e ficar pronta, ◦ Descanso): Visualização, Grafite, ocupado, "◦ " no início.
- **Treino:** Bem-estar, "◦ Treino", tom claro da área.
- **Estudo e listas:** "[Disciplina] - Estudo N", "[Disciplina] - Revisão" ou "[Disciplina] - Lista X", na Claude - sugestões, sem cor. Confirmado → recriar na Faculdade com a cor de estudo e apagar a sugestão.
- **🎯:** sempre na Claude - sugestões, sem cor. Validado → Carreira (inscrição, etapa com prazo ou entrevista marcada, cada um com sua cor). Nunca direto na Carreira, exceto entrevista com data marcada pela empresa.
- **Endereço:** evento em lugar conhecido leva endereço e link do mapa, para o deslocamento ser calculado.
- **Tarefas:** se a lista de tarefas passar de 15 abertas, propor a rodada da skill de triagem de tarefas.
