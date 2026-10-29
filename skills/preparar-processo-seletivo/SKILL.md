---
name: preparar-processo-seletivo
description: "Use no projeto Carreira sempre que houver uma etapa de processo seletivo para preparar (teste online, vídeo com IA, dinâmica, case, painel, entrevista final), quando a radar-estagios criar um bloco 🎯 de etapa, e depois da etapa, para registrar o aprendizado."
---

<!-- Versão pública resumida da skill (v1.2, 25/10/2026). Empresas reais, nomes de pessoas, IDs de documentos e o resultado dos processos foram removidos; os exemplos usam "Empresa A". -->

> **O que esta skill mostra:** preparação com método e **aprendizado que volta para o sistema**. Cada etapa vira pesquisa com fonte, plano em blocos de 25 min, uma página de foco e, depois, uma linha no banco de evidências. Os critérios de avaliação de etapas anteriores viram checklist fixo das próximas.

# Preparar processo seletivo (v1.2)

Para cada etapa, a skill entrega quatro coisas:
- um plano com algo para **Ler**, **Fazer** e **Praticar**, em **blocos de 25 min**;
- um Google Doc de preparação na pasta do processo (pesquisa e registro);
- uma **página de foco** publicada (plano, timer, marcação e cola do dia);
- um evento sugerido na agenda para cada bloco, até a data da etapa.

Depois da etapa, ela registra o que foi aprendido.

**Limites.** A skill não envia nada: mensagem, e-mail e convite de conexão saem só como rascunho, para o ok da pessoa. Não reescreve o CV.

## 0. Antes de começar

1. **Entrada.** Confirmar empresa, tipo de etapa e data e hora. Buscar nesta ordem: o e-mail do processo; a memória do projeto; a linha da planilha de prioridade (pode estar desatualizada: o e-mail vale mais); a agenda Carreira. Perguntar só o que faltar. Do e-mail, anotar:
   - **ações pendentes com prazo** (formulário, confirmação, envio de documento);
   - formato, duração e plataforma;
   - quem participa;
   - a área para a qual a pessoa está sendo direcionada;
   - material pedido e regras (pode usar IA? câmera? calculadora?).
2. **Aviso inicial**, em um bloco curto: primeira linha = ações pendentes com prazo; quanto tempo o trabalho deve levar; se vai precisar de navegador e computador; quantas aprovações de site serão pedidas. Etapa leve: avisar e começar. Pesada e sem prazo curto: esperar o ok.
3. **Leituras fixas** (só as seções indicadas, para poupar contexto): o banco de histórias STAR (histórias, "por empresa", "o que não funcionou", cartão de números, evidências), lido como arquivo e recortado por título; o doc de treino de lógica, se a etapa tiver teste de lógica; o doc de preparação anterior do mesmo processo.
4. **Anti-duplicata** (skill `nomear-e-arquivar`): se já existe um doc de preparação desta etapa, atualizar esse doc.

## 1. Classificar a etapa e definir a profundidade

| Etapa | Pesquisa | O que mais pesa |
|---|---|---|
| Teste online (lógica, inglês, fit) | 1 página | treino de lógica obrigatório; no fit, coerência com os valores da empresa |
| Vídeo com IA | 1 página | histórias STAR com número |
| Dinâmica | completa | postura em grupo; opinião de mercado pronta |
| Case | completa | método (dados, hipóteses, plano de ataque); contas; uso de IA, se permitido |
| Painel com gestores | completa + pessoas | os 3 critérios fixos (fim do arquivo); pitch de 2 min; perguntas por gestor |
| Final presencial | completa + pessoas | conexão com o time; logística |

- **Pesquisa de 1 página:** empresa (o que faz, 3 números, 3 notícias) + mercado em 3 linhas.
- **Pesquisa completa:** passos 2 a 4, com no máximo 1 página para a empresa e meia para o mercado. Enxuto é melhor: vai ser lido na véspera.
- **Etapa que junta formatos:** usar o plano do mais pesado e acrescentar só o treino específico dos outros. Não somar os planos inteiros.

## 2. Pesquisar a empresa (obrigatório)

Sempre com fonte e data: história e controladores; marcas e produtos; modelo de negócio; **números recentes** (receita, margem, participação de mercado, funcionários, investimento); **notícias dos últimos 6 meses**; estratégia declarada; ESG; cultura e vocabulário interno.

**Ordem de busca:** primeiro as fontes primárias (relações com investidores, página de carreiras); depois busca na web para notícias e o que faltar, abrindo só o que vai usar.

**Regras de número:**
- Todo número leva fonte e data. Sem fonte, não entra.
- Fontes divergentes: mostrar a faixa e dizer que não há número único.
- Empresa de capital fechado: dizer que é estimativa e de quem.
- Separar fato de interpretação ("leitura minha:").

Fechar com **3 fatos para citar** na etapa.

## 3. Pesquisar o mercado (obrigatório)

Concorrentes (3 a 5, com um número que compare); 3 tendências globais e 3 no Brasil; regulação; principal risco e oportunidade ESG do setor; **opinião de mercado pronta** (tese, dado e consequência para a empresa, em 3 a 4 frases).

## 4. Pesquisar as pessoas (quando identificadas)

Só informação profissional e pública: cargo, área, tempo de casa, trajetória, temas de posts recentes. **Pontos em comum genuínos**, nunca forçados. Recrutador pode receber convite antes, com nota curta; gestores, depois da etapa, com agradecimento que cite a conversa. Rascunho com até 300 caracteres. **Nunca enviar nem conectar sem ok.**

## 5. Perguntas para o fim da entrevista

3 a 5 por entrevistador, cada uma nascida de um dado da pesquisa ou do trabalho da pessoa: uma frase de contexto + uma pergunta sobre como ela decide, mede ou vive aquilo. Duas de reserva: "Qual decisão recente da área mudou por causa de um dado?" e "Nos primeiros 90 dias, o que mostra que um estagiário está indo bem?". **Não perguntar** bolsa, benefícios, férias, efetivação, nem nada que esteja no site.

## 6. Perguntas prováveis ligadas às histórias STAR

Listar 8 a 12 perguntas prováveis (típicas da etapa, da empresa, as anunciadas no e-mail) numa tabela: **Pergunta · História · Número-chave · Gancho com a empresa · "Aprendi que…"**. Usar sempre os números do cartão de números; divergência entre docs → avisar e usar o do cartão. Pergunta sem história boa: dizer e sugerir qual experiência poderia virar história.

## 7. Treino

- **Lógica:** obrigatório, plano de 3 sessões (diagnóstico, foco no tipo mais fraco, simulado). Com menos de 3 dias: só diagnóstico e simulado.
- **Inglês:** um simulado de 30 min no formato do teste.
- **Vídeo com IA:** gravar 3 respostas de 2 min e ouvir: contexto, o que **eu** fiz, número, "aprendi que".
- **Dinâmica:** 2 falas de entrada e a opinião de mercado; construir sobre o outro, não moderar, discordar com respeito.
- **Case:** 2 cases cronometrados no setor; se permitido, um com IA, mostrando onde ela errou e onde ajudou.
- **Painel e final:** pitch de 2 min e as 5 perguntas mais prováveis, em voz alta, até 1 min cada.

## 8. Plano em blocos de 25 minutos

Mesmas regras de foco da skill de plano de estudo para prova (não copiar para cá).

| Etapa | Ler | Fazer | Praticar | Total |
|---|---|---|---|---|
| Teste online | 30 min | 15 min | 1h30–2h15 (lógica) ou 30 min | 2h15–3h |
| Vídeo com IA | 30 min | 30 min | 45 min | 1h45 |
| Dinâmica | 1h | 45 min | 30–45 min | 2h15–2h30 |
| Case | 1h | 1h | 1h30 | 3h30 |
| Painel com gestores | 1h30 | 1h30 | 1h | 4h |
| Final presencial | 1h30 | 1h | 1h | 3h30 |

1. Blocos de **25 min** (case cronometrado e simulado podem ter 50).
2. **Conteúdo pela metade do tempo:** um bloco de 25 min leva trabalho para uns 12 min no cálculo (os blocos reais levam o dobro do previsto). Se não couber até a data, cortar conteúdo em vez de apertar.
3. Cada bloco: **foco** (uma coisa), **primeiro passo** minúsculo e concreto, **como** (2 a 3 linhas), **se perder** (a versão de 10 min), **chip do tema**.
4. Pausa de movimento de 5 min entre blocos seguidos.
5. No máximo **2h de 🎯 por dia** somando a carreira inteira, nunca sobre aula, deslocamento, refeição, treino ou evento de outra agenda.
6. Faculdade antes de estágio: em semana de prova, avisar o conflito e propor o mínimo.
7. Vários processos: a etapa mais próxima tem prioridade no dia.
8. **Plano de corte** (ordem): pessoas; mercado detalhado; perguntas extras. Nunca cortar o treino obrigatório nem a tabela de histórias.

**Agenda:** um evento por bloco, na **Claude - sugestões**, sem cor, título `🎯 <Empresa> - <N> - <foco curto>`, descrição com primeiro passo, como e link da página de foco. Validado → recriado na Carreira. Bloco perdido: seguir para o próximo e aplicar o plano de corte; o plano segue a ordem dos blocos, não o horário.

## 9. Doc de preparação

- **Nome:** `CAR - 26.2 - <Empresa> - Prep - <etapa> (AAAAMMDD)`, com a data da etapa. Ex.: `CAR - 26.2 - Empresa A - Prep - final presencial (20261030)`.
- **Pasta:** a do processo, dentro de `32.04 - Processos do semestre`.
- **Guias:** teste e vídeo = Visão geral · Empresa · Treino · Depois. Dinâmica, case, painel e final = Visão geral · Empresa e mercado · Pessoas · Perguntas e histórias · Treino · Depois.

## 9b. Página de foco

Uma página publicada por etapa (replanejar republica a mesma URL), que abre no celular e no computador. Abas: **Agora** (próximo bloco, timer de 25 min, conta real do tempo que falta), **Plano** (linha do tempo até a etapa), **Cola do dia** (checklist técnico, 3 números, 3 falas-chave, postura, imprevistos, perguntas finais), **Treino** e **Ajustar** (plano de corte, plano mínimo, quando travar). Uma cor suave por tema (Empresa, Mercado, Pessoas, Histórias, Treino), coluna estreita, nada de rolagem lateral.

## 10. Depois da etapa (registro)

1. No máximo 3 perguntas: como foi; o que perguntaram de inesperado; o que faria diferente.
2. Preencher a guia **Depois** do doc: o que funcionou, o que mudaria, perguntas inesperadas, resultado quando sair.
3. **Banco de evidências:** uma linha no fim da seção, `DD/MM · origem · entrega ou aprendizado · resultado · usa em`. É o único lugar do aprendizado.
4. História nova: propor o texto para o banco de histórias e gravar só com ok.
5. Radar: data · empresa · etapa · resultado · link no histórico; atualizar a linha na planilha (pela `radar-estagios`).
6. Próximos contatos como rascunho, nunca enviados: agradecimento no mesmo dia; convite de conexão para os gestores; sem resposta uma semana depois do prazo, perguntar dos próximos passos.

## Aprendizados fixos (aplicar em toda preparação)

**Painel com gestores (out/2026).** Os três critérios de avaliação de um painel viraram checklist para dinâmica, case, painel e final:
1. Profundidade no mercado da empresa e na relação dele com ela.
2. Case com IA: método (dados, hipóteses, plano de ataque, protótipo), fluência e profundidade no uso de IA, storytelling.
3. Respostas: contexto da empresa e do mercado, ligar as experiências à pergunta, linha de raciocínio, ambição e perfil empreendedor.

**Lógica:** os testes de raciocínio lógico foram o ponto mais fraco em vários processos. Toda etapa com teste de lógica tem treino no plano, mesmo com pouco tempo.

**Dinâmicas e painéis:** não moderar ninguém, construir sobre o outro, mudar de ideia em voz alta quando um gestor aponta um furo ("faz sentido, ajustando…").

Aprendizados novos ficam no banco de evidências e são lidos no passo 0 de cada preparação.

## No fim

Uma linha por coisa criada ou gravada (doc com link e pasta, blocos sugeridos com data, linhas gravadas), o que ficou pendente (rascunhos para aprovar) e, se mudou algo no sistema, rodar a skill `encerrar-chat`.
