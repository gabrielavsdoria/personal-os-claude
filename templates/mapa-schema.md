# Esquema do Mapa do Sistema · System Map schema

O **Mapa do Sistema** é uma página publicada no Claude com um pequeno banco de dados próprio. A página só desenha; os dados moram no banco, em coleções de documentos JSON. Os agentes leem e escrevem pelo Claude (skill [`encerrar-chat`](../skills/encerrar-chat/SKILL.md)), sempre com controle de versão.

*The System Map is a published Claude page backed by its own small document database. The page only renders; agents read and write the data, always with optimistic version checks.*

Os exemplos abaixo são **fictícios**: só o formato é real.

## Regras de escrita

- **Nunca apagar.** Peça que sai de uso ganha a situação `aposentado` e o motivo em `pn`.
- **Escrita com versão** (`if_version`): se alguém mudou o documento depois da leitura, a escrita falha e o agente relê só aquele documento.
- **`update`, nunca `set`,** em documento que já existe.
- **Uma leitura + um batch** por conversa: ler só os documentos que vão mudar e gravar tudo de uma vez.
- **Nada de saúde:** peça sensível existe só pelo nome, com `sens: true`.

## `pecas` · as partes do sistema

Uma linha por skill, tarefa agendada, script, doc, arquivo .md, página, planilha, projeto, grupo ou frente de trabalho.

| Campo | O que é |
|---|---|
| `id` | identificador com prefixo do tipo: `sk-` skill, `t-` tarefa agendada, `as` + módulo (script), `d-` doc, `md-` arquivo .md, `pag-` página, `g-` grupo, `f-` frente |
| `k` | tipo da peça (skill, script, doc, página…) |
| `nm` | nome |
| `fn` | função: o que faz, em uma ou duas frases |
| `a` | projeto a que pertence |
| `par` | peça-pai (grupo ou frente) |
| `onde` | onde mora (pasta, projeto) |
| `url` | link, quando há |
| `st` | situação: `ativo`, `em construção`, `a criar`, `aposentado` |
| `sens` | `true` se o conteúdo é sensível (aparece só o nome) |
| `q` | quando ler esta peça |
| `pn` | pendência aberta ou motivo da aposentadoria |
| `ord` | ordem dentro do pai |
| `por` | qual chat escreveu por último (`PROJETO · chat assunto (data)`) |
| `atualizado_em` | data e hora ISO |

```json
{
  "id": "sk-exemplo",
  "k": "skill",
  "nm": "Exemplo de skill",
  "fn": "Lê a agenda e propõe blocos de estudo para a próxima prova.",
  "a": "org",
  "par": "g-faculdade",
  "onde": "skills da conta",
  "url": "",
  "st": "ativo",
  "sens": false,
  "q": "antes de mudar regra de estudo",
  "pn": "",
  "ord": 3,
  "por": "ORG · chat plano de estudo (23/10)",
  "atualizado_em": "2026-10-23T18:00:00-03:00"
}
```

## `log` · uma linha por mudança

Id no formato `AAAAMMDDTHHMM-xxxx`.

| Campo | O que é |
|---|---|
| `quando` | data e hora ISO |
| `chat` | id do resumo do chat em `chats` |
| `projeto` | projeto do chat |
| `peca` | id da peça que mudou |
| `tipo` | tipo da mudança (skill, tarefa, regra, doc…) |
| `texto` | o que mudou, em uma frase completa para quem não viu o chat |
| `afeta` | ids de outras peças afetadas |

```json
{
  "quando": "2026-10-25T14:10:00-03:00",
  "chat": "2026-10-25-org-blocos-de-25-min",
  "projeto": "ORG",
  "peca": "sk-exemplo",
  "tipo": "skill",
  "texto": "Blocos de estudo passam a ter 25 minutos, um foco por bloco.",
  "afeta": ["t-resumo", "t-proposta"]
}
```

## `chats` · resumo de cada conversa

Id no formato `AAAA-MM-DD-projeto-assunto`. **Todo chat novo lê os últimos 5** (por `quando`, do mais novo para o mais velho) em vez de ler o Diário inteiro.

| Campo | O que é |
|---|---|
| `quando`, `projeto`, `titulo` | quando, onde e sobre o quê |
| `resumo` | 2 a 4 frases |
| `decisoes` | lista de decisões |
| `mudou` | lista de peças que mudaram |
| `continuacao` | o prompt de continuação entregue no fim |
| `por` | quem escreveu |

## `propostas` · ideias e melhorias com mini-PRD

Id = número da proposta (`n`).

| Campo | O que é |
|---|---|
| `n` | número |
| `t` | título curto |
| `d` | descrição, com as palavras da pessoa |
| `st` | situação: `ideia`, `proposta`, `aprovada`, `em andamento`, `em uso`, `decidido`, `feita`, `descartada` |
| `tipo` | tipo (setup, skill, automação, regra…) |
| `fl` | área ou frente |
| `onde` | onde a mudança vai morar |
| `prd` | mini-PRD: `{porque, pronto, reversivel, risco}` (por quê; pronto quando; dá para desfazer?; o que pode dar errado) |
| `por`, `atualizado_em` | quem e quando |

```json
{
  "n": 42,
  "t": "Aviso de prova sem revisão",
  "d": "Quero saber no domingo se alguma prova das próximas 2 semanas está sem bloco de revisão.",
  "st": "proposta",
  "tipo": "automação",
  "fl": "faculdade",
  "onde": "Apps Script",
  "prd": {
    "porque": "Prova sem revisão só aparece na véspera.",
    "pronto": "A Proposta da semana lista as provas sem revisão.",
    "reversivel": "sim: é só desligar o gatilho",
    "risco": "criar sugestão em cima de outro evento"
  },
  "por": "ORG · chat caixa de ideias (26/10)",
  "atualizado_em": "2026-10-26T20:00:00-03:00"
}
```

## `regras` · fonte única e onde cada regra aparece

| Campo | O que é |
|---|---|
| `id`, `nm` | a regra |
| `tag` | carimbo de versão que as cópias levam, ex.: `⟦CORES 2026-10-27⟧` |
| `why` | qual é a fonte e por que a regra existe |
| `lugares` | lista `{id, s, t}`: peça onde a regra aparece, situação (`fonte`, `copia`, `aponta`, `ok`, `velho`, `conferir`) e nota |

Quem muda uma regra atualiza a fonte, o carimbo e cada lugar da lista na mesma hora.

## `ordem` · plano de implantação

Passos em ondas, com dependência.

| Campo | O que é |
|---|---|
| `id`, `t`, `d` | passo, título e detalhe |
| `onda`, `ord` | onda e ordem dentro da onda |
| `ok` | feito ou não |
| `p` | propostas ligadas |
| `dep` | passo de que depende |
| `w` | tipo do passo (ex.: decidir, fazer) |

A Proposta da semana mostra o primeiro passo com `ok: false` (menor onda, menor ordem) como "próxima decisão".

## `dispositivos` · configuração de cada aparelho

| Campo | O que é |
|---|---|
| `id`, `nm`, `papel` | aparelho e para que serve no sistema |
| `atual`, `ideal` | configuração de hoje e a desejada |
| `perguntas` | o que falta a pessoa responder |
| `fonte` | de onde veio a informação |
