---
name: nomear-e-arquivar
description: "Use ao criar, salvar, mover ou renomear arquivo, doc ou pasta (Drive, computador, doc para ler) e ao criar ou colorir evento na agenda: nomes, pastas, anti-duplicata, formato, cores e agendas."
---

<!-- Versão pública da skill (versão de 27/10/2026). Nomes de pessoas, projetos de terceiros, áreas de saúde em detalhe, URLs e e-mail foram removidos; exemplos de nomes de arquivo são fictícios. -->

> **O que esta skill mostra:** padrão de dados e **fonte única de regra**. Ela define como todo arquivo e todo evento nascem (nome, pasta, cor), e as outras skills apontam para cá em vez de copiar a regra. Quando a seção de cores muda, o carimbo `⟦CORES AAAA-MM-DD⟧` mostra quais cópias ficaram para trás.

# Regras de nomes, pastas e cores

Objetivo central: cada informação num lugar só, fácil de achar, sem duplicatas. Antes de criar, salvar, mover ou renomear qualquer arquivo, seguir estas regras. Manual completo: Google Doc "Arquitetura do Drive" (40 - Recursos).

Toda skill ou chat que cria arquivo segue esta skill. Toda skill, tarefa ou chat que cria ou colore evento na agenda segue a seção 6.

## 0. Que tipo de documento criar

- **Padrão: Google Doc** (ou Planilha), já na pasta certa.
- Rascunho comentável só quando a pessoa pedir; no fim, o conteúdo final vai para um Google Doc na pasta certa.
- Arquivo .docx, .pptx, .xlsx só se a pessoa pedir o formato.
- Resposta para ler uma vez fica no chat, sem criar arquivo.

## 0.1 Onde fica cada anotação

- Agenda: eventos e tarefas com data.
- Lista de tarefas: matriz de Eisenhower e lembretes.
- App de notas rápidas: listas e notas fixadas (não sincroniza com o Drive; migração só na faxina profunda).
- Google Docs: linha do tempo e registro (Caixa de ideias, Diário). É o que o Claude lê.
- Notas manuscritas no tablet: equações e diagramas, uma pasta por disciplina. O Claude não lê; o que importa passa para Docs.
- Na dúvida de onde uma nota vai, perguntar uma vez.

## 1. Nome do arquivo

`ÁREA - [ciclo] - Assunto - descrição [(AAAAMMDD)] [· tipo]`

- Separador sempre ` - ` (espaço, hífen, espaço). Sem underline, sem colchetes.
- **ÁREA é obrigatória, em maiúsculas, e vem primeiro** (é o que aparece na aba do navegador): USP, CAR, BEM, DP, FIN, LAZ, CRI, MOD, ORG, DOC, IDI...
  - Na faculdade, a disciplina vem logo depois: `USP - MAT1 - Ativ Relatório`.
- Ciclo só se o arquivo perde a utilidade no fim do semestre (`26.2`) ou do ano (`2026`). Em pasta de arquivo, o período: `2023-2025`.
- Data `(AAAAMMDD)` no fim, só em registro de um evento de um dia (entrevista, envio, reunião). Só mês ou ano: `(2026-09)`, `(2023)`.
- **Status no nome, nunca em pasta:** `(enviado 20260927)`, `· rascunho`, `· descartável`, `· versão antiga (AAAAMMDD)`.
- Versões de arquivo que vem de fora e muda (slides, cronograma): `V1`, `V2`… no fim; a maior é a mais recente.
- Na faculdade, `AtivN` = atividade n (não confundir com `A0n` = aula n); `gabarito` no nome = feito por IA.
- Zip: extrair, conferir, manter só os arquivos nomeados e apagar o zip (com ok, fora da faxina).
- Tipo zettelkasten (`· fleet`, `· perm`, `· lit`, `· moc`) só em notas de pensamento, no fim.

| Tipo | Padrão | Exemplo fictício |
|---|---|---|
| Consulta que a pessoa atualiza | `ÁREA - Assunto` | `CAR - Plano de carreira` |
| Documento de um ciclo | `ÁREA - ciclo - Assunto` | `ORG - 2026 - Diário do sistema` |
| Registro de um dia | `ÁREA - Assunto - descrição (AAAAMMDD)` | `CAR - 26.2 - Empresa A - entrevista - notas (20260904)` |
| Material da faculdade | `USP - Disciplina - P[n] - A[nn] - tipo - Assunto` | `USP - MAT1 - P1 - A04 - slides - Balanço de massa.pdf` |
| Teste reutilizável | `CAR - Testes - Tipo - descrição (data)` | `CAR - Testes - Excel - base para treinar (2026-10)` |
| Nota de pensamento | `ÁREA - Ideia · tipo` | `ORG - Nomenclatura dos arquivos · fleet` |
| CV | `CAR - CV - Empresa ou vaga (AAAAMMDD)`; a cópia que vai para fora usa nome externo | `Nome_Sobrenome_CV_EN.pdf` |
| Arquivo de outra pessoa compartilhado | não renomear | — |
| Pasta dentro de área | `ÁREA - ID - Nome` | `CAR - 32.03 - Preparar` |
| Pasta de projeto | `ÁREA - ciclo - Projeto` | `USP - 26.2 - Semestre` |
| Pasta em 80 - Arquivo | `ÁREA - período - Assunto` | `CAR - 2023-2025 - Projeto de extensão` |

Material da faculdade: aula sempre com 2 dígitos (`A04`). Nunca `P?`: sem prova identificável, o arquivo fica na raiz da disciplina. Na dúvida, perguntar.

Mais detalhe em [`templates/nomes-de-arquivo.md`](../../templates/nomes-de-arquivo.md).

## 2. Pasta (Johnny Decimal; no máximo 3 níveis a partir da área)

| Zona | Conteúdo |
|---|---|
| 01 - Inbox | o que chegou sem casa (resolvido na faxina) |
| 10 - Notas | notas de pensamento de qualquer área (11 MOCs · 12 Fleeting · 13 Literature · 14 Permanent) |
| 20 - Projetos ativos | o que tem começo, meio e fim: `ÁREA - ciclo - Projeto` |
| 30 - Áreas | responsabilidades que continuam (abaixo) |
| 40 - Recursos | templates, prompts, métodos e material de consulta de várias áreas |
| 80 - Arquivo | projetos e áreas encerrados, registros gerais, versões antigas com conteúdo único |
| 99 - Documentos oficiais | documentos oficiais e de uso recorrente |

**Dentro de cada área, o mesmo desenho:** `.01` a `.0n` por tipo de uso · **`.80` Arquivo** (registros e versões antigas com conteúdo que a nova não tem) · **`.99` Documentos oficiais da área** (entregas finais). Nunca usar uma `.99` para versão antiga.

| Nº | Área | Prefixo | Subpastas (exemplo) |
|---|---|---|---|
| 31 | Estudo | USP, IDI | 31.99 documentos oficiais da graduação |
| 32 | Carreira | CAR | 32.01 Buscar e avaliar · 32.02 Candidatar · 32.03 Preparar (reutilizável) · 32.04 Processos do semestre (uma pasta por empresa) · 32.80 Arquivo |
| 33 | Bem-estar | BEM | (privado) |
| 34 | Desenvolvimento pessoal | DP | (privado) |
| 35 | Finanças | FIN | — |
| 36 | Lazer | LAZ | — |
| 37 | Criativo | CRI | — |
| 38 | Moda e compras | MOD | — |

- Área = o que continua; projeto = o que acaba (sai de 20 para 80). Iniciativas em grupo são projetos em 20, não áreas.
- Carreira: teste de plataforma que se repete entre empresas → 32.03; entrevista de uma empresa → pasta da empresa em 32.04.
- Computador: arquivo local existe para fazer upload. Guardar de vez = Drive. Instalador não é guardado: depois de instalar, apagar.

## 3. Prevenir em vez de remediar (anti-duplicata)

- **Atualizar = editar o mesmo arquivo** (mesmo link). Nunca criar "v2", "(1)", "Cópia de", "novo" ou "final" para atualizar.
- **Versão nova só se a pessoa pedir.** A antiga só fica se tiver informação que a nova não tem: vai para a `.80` com `· versão antiga (AAAAMMDD)`. Melhor: levar a parte única para a versão nova (uma guia) e mandar a antiga para a lixeira.
- **Antes de criar**, procurar no Drive um doc do mesmo tema e ciclo. Se existir, propor uma **guia** nele em vez de arquivo novo (teste: a pessoa abriria os dois juntos para consultar?).
- **Duplicata só depois de conferir duas vezes que é idêntica** (hash e comparação byte a byte).
- **Juntar em guia:** copiar, conferir que todo o conteúdo está no destino, conferir o compartilhamento do original (arquivo com outras pessoas fica) e só então propor a lixeira.
- **Nascer na pasta certa:** pelo conector do Drive, sempre passar a pasta-pai; sem saber a pasta, `01 - Inbox` e avisar. Nunca a raiz.
- **Antes de mover**, conferir se algum programa depende do caminho (projeto de SIG com caminho relativo, projeto de R, manifesto de outra skill) e se o Claude continua alcançando o arquivo.
- **Fora da faxina, nunca apagar nada**: o descartável vai para uma lista para a pessoa decidir (skill `faxina-arquivos`).

## 4. Formato do conteúdo (docs e respostas no chat)

- **Visão geral no topo**, em 3 a 5 linhas: o que é, o que decidir, o que fazer.
- **Tópicos curtos**, uma ideia por linha. Texto corrido só se pedido.
- **Tabela curta** para comparar; passos numerados para procedimento.
- No Google Doc, usar Título 1, 2 e 3 de verdade: alimentam a estrutura lateral, que mostra onde se está no todo.
- Guias para separar assuntos grandes.
- **Texto que a pessoa vai colar** (prompt, instrução, skill): sempre completo, em bloco de copiar. Nunca "troque o trecho X".

## 5. No fim

Dizer o nome exato e a pasta onde salvou, com o link. Se salvou na Inbox, dizer para onde deveria ir. Se mudou a arquitetura (pasta nova, regra nova), registrar no doc "Arquitetura do Drive" sem apagar o que já está lá.

## 6. Cores e agendas ⟦CORES 2026-10-27⟧

**Esta seção é a fonte da regra de cores.** Cópias levam o carimbo `⟦CORES AAAA-MM-DD⟧`; quem tiver data mais velha ficou para trás.

**Lógica.** Matiz = área da vida. Tom = peso: forte = com outras pessoas ou difícil de remarcar; claro = só a pessoa ou fácil de remarcar. Cinza e marrom = só para ver. Vermelho (Tomate) = muito importante. Laranja (Tangerina) = atenção, não pode atrasar. **Status vai por forma** (concluído = cinza + tachado), nunca por cor.

| Uso | Cor | colorId |
|---|---|---|
| Muito importante: prova, entrevista, painel de processo seletivo | Tomate | 11 |
| Atenção: prazo inadiável, etapa de processo com prazo | Tangerina | 6 |
| Social forte (com outras pessoas) | cor da agenda Social | sem colorId |
| Social leve e lazer | Flamingo | 4 |
| Bem-estar forte / claro | Uva / Lavanda | 3 / 1 |
| Projetos forte (com o grupo) | cor da agenda Projetos | sem colorId |
| Projetos claro (só a pessoa) | Pavão | 7 |
| Faculdade: aula, período e prazo | Manjericão | 10 |
| Estudo (blocos na agenda Faculdade) | Sálvia | 2 |
| Carreira (🎯 inscrição, networking) | Banana | 5 |
| Visualização: rotina, deslocamento | Grafite | 8 |
| Agenda "Claude - sugestões" | cor da agenda (neutra) | sem colorId |
| Agenda "Feriados e férias" | cor da agenda (marrom) | sem colorId |

Tabela colorId → nome no app (testada em 17/10/2026):

| colorId | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Nome | Lavanda | Sálvia | Uva | Flamingo | Banana | Tangerina | Pavão | Grafite | Mirtilo | Manjericão | Tomate |

**Limites do conector da agenda.** Só aceita `colorId` 1 a 11; as outras cores do app, só a pessoa aplica. O conector **não muda o evento de agenda**: para "mover", recriar o evento na agenda certa (mesmo título, horário, descrição, lembretes e cor) e apagar o original, só em evento criado pelo Claude; convite de outra pessoa não é recriado. Com o vigia do Apps Script ligado ([`apps-script/vigia-cores`](../../apps-script/vigia-cores/)), basta pôr a cor e o título certos: o script move.

**Agendas (8).**

| Agenda | O que vai | Observação |
|---|---|---|
| Claude - sugestões (principal) | sugestões do Claude antes do ok (estudo e 🎯); lembretes recorrentes sem IA | **sugestão sempre sem cor, inclusive com prazo perto: o prazo vai no título** |
| Faculdade | aula, prova, prazo, períodos, estudo | |
| Carreira | 🎯 inscrição escolhida, 🎯 etapa com prazo, entrevista | blocos de 25 min, até 2h por dia útil (regra completa na `radar-estagios`) |
| Bem-estar | treino e compromissos pessoais | detalhes fora desta versão |
| Projetos | reuniões e entregas de projetos em grupo | |
| Social e Lazer | festas, amigos, passeios; viagem com ✈️ no título | |
| Feriados e férias | feriados e férias juntos | sem colorId, "disponível" |
| Visualização | ◦ refeição, ◦ descanso, ◦ rotina, deslocamentos | Grafite; ◦ e deslocamentos ocupam horário |

**Regras de cor de um evento.**
- O evento tem a **cor da área verdadeira**. Ao mudar de agenda, **a cor não sai**.
- **Tomate e Tangerina vão por cima** da cor da área e nunca saem.
- **Horário livre** = sem evento com horário em nenhuma agenda; eventos de dia inteiro e "disponível" não ocupam.
- **Evento sem cor** fora das agendas em que "sem cor" é de propósito (sugestões, feriados, social, projetos) = criado com pressa ou convite aceito: avisar.
- Sugestão aceita: vai para a agenda da área com a cor da área, recriando e apagando a sugestão.
- Mudança de data de prova ou remoção de aula: primeiro como sugestão; só grava na agenda da faculdade depois do "ok".
- Ordem para escolher a cor (critérios de 0 a 3; pesos: importância 35%, não posso atrasar 25%, preparação 20%, difícil de remarcar 20%):
  1. Tomate se importância = 3 e preparação ≥ 2.
  2. Tangerina se "não posso atrasar" = 3.
  3. Tom forte da área se "difícil de remarcar" ≥ 2.
  4. Tom claro da área se é fácil de remarcar.
  5. Grafite se é só para olhar.

**Pastas do Drive.** A pasta herda a cor da área (ex.: Estudo verde, Carreira mostarda, Inbox cinza, Notas e Recursos marrom, Arquivo e 99 na cor padrão). Abaixo do 3º nível, segue a cor do pai. Pasta de outra pessoa compartilhada não é pintada (conferir o dono pela API antes). Atalho não se pinta.

**Docs e páginas que o Claude cria.**
- A identificação principal é o prefixo da área no nome. Não pintar o documento todo.
- Página HTML: faixa fina de 6 px no topo na cor da área e a mesma cor como destaque único. Neutros quentes, sem branco puro.
- Doc para mandar a outras pessoas usa o modelo neutro, sem as cores pessoais.
- No máximo 3 a 5 cores por material.
- Mapas e diagramas técnicos **não usam as cores de área**: seguem as convenções do assunto (azul água, verde vegetação, sequencial para valores, divergente com ponto neutro, legenda sempre).

**Cópias com carimbo.** Planejamento de estudo, coleta de materiais da faculdade, radar e preparação de processo seletivo, marcar compromisso, resumo da manhã, proposta da semana e as regras do Apps Script. Ao mudar esta seção, atualizar a data do carimbo e avisar quais cópias ficaram velhas.
