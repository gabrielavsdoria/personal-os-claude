---
name: encerrar-chat
description: "Use quando a pessoa pedir para encerrar o chat (\"encerra\", \"fecha o chat\", \"vou sair\", /encerrar-chat), aceitar a oferta de encerrar ou segmentar um chat longo, pedir \"separa esse subtópico\" ou pedir \"atualize o mapa\", em qualquer projeto."
---

<!-- Versão pública da skill (v5, 25/10/2026). IDs de documentos, URLs privadas, nomes de projetos e de pessoas foram removidos ou trocados por exemplos. -->

> **O que esta skill mostra:** governança e registro de mudanças. Cada conversa termina deixando rastro em lugares fixos (diário de decisões, banco de peças do sistema, prompt de continuação), com teto de linhas e de chamadas para o registro não virar trabalho.

# Encerrar chat (v5)

Fecha o chat sem perder nada e **gastando pouco**: no máximo 5 chamadas de ferramenta (registro do projeto ou Diário, banco de evidências se houver, 1 leitura e 1 batch no Mapa). Também separa um subtópico para outro chat sem encerrar (seção 4). Vale em qualquer projeto.

Um lugar por tipo de informação (nada repetido em dois lugares):
- **Registro do próprio projeto** (`claude/registro-<projeto>.md`, seção "Diário do projeto" no fim) = decisões, demandas, dúvidas, princípios e achados que só valem para aquele projeto.
- **Diário do sistema** (Google Doc) = só o que muda o sistema: skill, regra de agenda ou de cor, tarefa agendada, regra de registro, instrução de projeto, arquivo ou pasta, Mapa. No projeto de organização, tudo vai para o Diário.
- **Mapa do Sistema** (banco de dados de uma página) = peças, propostas, log de mudanças, resumo de cada chat.
- **Banco de evidências de carreira** = entregas e resultados que podem virar portfólio ou CV.

## 0. Quando rodar

- A pessoa pede ("encerra", "vou sair", /encerrar-chat) ou aceita a oferta.
- **Oferta (uma vez por chat, uma linha):** o Claude não vê tokens nem cota; estima por sinais: ~15 trocas, leitura grande, muitas ferramentas ou assunto novo. Texto: "O chat ficou longo; só [X] importa para seguir. Encerro (registro, Mapa e prompt)?". Se a resposta for não, só volta a oferecer se ela pedir.
- **Várias perguntas de uma vez:** antes de mandá-las, rode a seção 4.
- "Atualize o mapa": só a seção 2.

## 1. Linhas e evidências (direto, sem pedir ok)

Relendo o chat, separe: decisão (inclui escolher uma opção do Claude) · demanda · dúvida (só a pessoa decide; sugestão não aceita = dúvida) · princípio · achado · lembre · evidência de carreira · peças que mudaram. Conversa trivial não entra.

**Teto: no máximo 5 linhas por chat**, somando Diário e registro do projeto. Se passar, junte itens do mesmo assunto ou corte nesta ordem: decisão > princípio > demanda > dúvida > lembre > achado.

- **Achado** só entra se muda como o sistema ou uma ferramenta funciona (ex.: limite de um conector). Achado de conteúdo (resultado de exercício, nota, número de uma análise) fica no doc do assunto.
- Peças mudadas não viram linha: vão para o Mapa.
- Formato: `DD/MM · tipo · texto · seção do registro · projeto` (ver [`templates/diario-linha.md`](../../templates/diario-linha.md)). Só acrescentar; correção = linha nova que cita a antiga.

Onde cada linha vai:
- **Diário:** uma única chamada que insere o texto no fim do documento, começando com quebra de linha, uma linha por item.
- **Registro do projeto:** ler o arquivo, acrescentar as linhas no fim da seção `## Diário do projeto` e gravar o texto inteiro. Nunca reescrever nem apagar o que já está lá. Se o projeto não tiver registro, criar com o cabeçalho de 6 linhas (Função · Assunto · Fonte de · Quem lê · Quem escreve · Atualizado) e avisar numa linha.
- **Evidência de carreira** (entrega, ferramenta, habilidade, resultado com número): uma linha no fim da seção de evidências: `DD/MM · origem · entrega ou aprendizado · resultado · usa em: portfólio / CV / entrevista`. Não conta no teto de 5.
- Sem o conector de documentos: mostrar as linhas prontas em bloco de copiar.

## 2. Mapa (1 leitura + 1 batch)

1. **Uma leitura** só dos documentos que vão mudar (`query` por id ou nome), para pegar as versões. Não ler coleções inteiras.
2. **Um batch** com tudo:
   - `update` (com a versão lida) das peças que mudaram: só os campos alterados + `atualizado_em` e `por`. Proposta implementada: situação nova (ideia, proposta, aprovada, em andamento, em uso, decidido, feita, descartada).
   - `set` de peça nova, com id no padrão do tipo (`sk-` skill, `t-` tarefa, `d-` doc, `md-` arquivo .md, `pag-` página) e o grupo-pai certo.
   - `set` de uma linha por mudança no `log`: {quando, chat, projeto, peça, tipo, texto, afeta[]}.
   - `set` do resumo do chat em `chats`: {quando, projeto, título, resumo de 2 a 4 frases, decisões[], mudou[], continuação, por}.
3. Regras: **nunca apagar** (saída de uso = situação "aposentado" + motivo); `update`, nunca `set`, em documento que existe; versão recusada = reler só aquele documento e refazer só a sua parte. Regra mudou: atualizar a lista de lugares onde ela aparece.
4. **Modo leve:** nenhuma peça mudou → o batch só grava o resumo do chat.
5. Mudança que afeta outras peças: perguntar antes, uma linha por peça, sim/não; o que não for confirmado vira dúvida.
6. Instruções de projeto afetadas: dizer "atualize o projeto X" e entregar o texto completo novo (antigo + novo), pronto para colar.

Esquema das coleções: [`templates/mapa-schema.md`](../../templates/mapa-schema.md). Chat novo lê o contexto pelos últimos 5 resumos de `chats`, não pelo Diário inteiro.

## 3. Prompt de continuação

Bloco final (o mesmo texto vai no campo `continuacao` do resumo):
- **Finalizado neste chat:** uma linha por entrega: o que foi feito, onde está e o que foi decidido. O que ficou pela metade vira tarefa nova.
- **Cada tarefa nova**, em bloco separado:
  - prompt pronto em bloco de copiar, começando com o prefixo do projeto entre colchetes (ex.: `[ORG] Faxina profunda de novembro: ...`), dizendo o que já foi decidido (para não reabrir), o que a tarefa pede e onde ler o resto. Completo: nunca "troque o trecho X";
  - modelo e esforço (modelo pequeno = mecânico curto; médio = padrão; grande = decisão ou desenho de sistema) · projeto · anexos · computador, navegador ou login · peso: leve/pesada × urgente/pode esperar.
- Contexto para o próximo chat vai **dentro do prompt**, não num arquivo novo.
- Nada sobrou: "Nada pendente".

Prefixos: um por projeto (ex.: ORG, CAR, um por disciplina: MAT1, MAT2...).

## 4. Segmentar sem encerrar

Quando ia mandar várias perguntas ou surgiu um subtópico independente:
1. Uma linha: "As perguntas X e Y são de [subtópico]; melhor em outro chat."
2. Prompt pronto do subtópico, no formato de tarefa nova (seção 3).
3. Uma linha sobre o resto: resolve rápido → "Ficamos aqui e encerramos"; vai puxar muito → "Vale outro chat também" + prompt.
4. Não grava registro, Diário nem Mapa aqui.

## 5. Passagem curta de domingo

Só no projeto de organização e só aos domingos: se houver linhas no Diário depois da última passagem, oferecer em uma linha a passagem curta do Diário para o registro (há um lembrete recorrente na agenda).

## 6. Não faz

Não mexe na memória do Claude. Não reescreve o registro do projeto de organização (só na passagem, quando pedido). Não republica a página do Mapa. Não cria skill, doc ou tarefa agendada (é proposta e precisa de ok), exceto o registro do projeto descrito na seção 1.

## Resposta

Curta: 1 frase de visão geral · "Registro: N linhas" e/ou "Diário: N linhas" · evidências (se houver) · perguntas do Mapa e das instruções (se houver) · prompt de continuação · `Mapa: [peças · N no log]` ou `Mapa: só o chat`.
