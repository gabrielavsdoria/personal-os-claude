# Linha do Diário do sistema · System log line

O **Diário do sistema** é um Google Doc onde cada conversa que muda o sistema deixa no máximo 5 linhas. Ele é a memória das decisões; o [Mapa](mapa-schema.md) é a memória das peças.

*The system log is a Google Doc where each conversation that changes the system appends at most 5 lines. It records decisions; the System Map records parts.*

## Formato

```
DD/MM · tipo · texto · seção do registro · projeto
```

| Parte | Valores |
|---|---|
| `DD/MM` | data do chat |
| `tipo` | `decisão` · `demanda` · `dúvida` · `princípio` · `lembre` |
| `texto` | curto, mas completo para quem não viu o chat; cita ids e links que importam |
| `seção do registro` | para onde a linha vai na passagem: `2 princípios` · `3 decisões` · `4 demandas` · `5 dúvidas` |
| `projeto` | prefixo do projeto (ex.: `ORG`, `CAR`) |

## Regras

- **No máximo 5 linhas por chat.** Se passar, juntar itens do mesmo assunto ou cortar nesta ordem: decisão > princípio > demanda > dúvida > lembre.
- **Só acrescentar no fim.** Nunca editar uma linha antiga.
- **Correção = linha nova** que cita a antiga.
- **Dúvida** = algo que só a pessoa decide; sugestão do Claude não aceita também vira dúvida.
- **Achado de conteúdo** (nota, resultado de exercício, número de uma análise) não entra: fica no doc do assunto.
- **Peça que mudou** não vira linha: vai para o log do Mapa.
- **Passagem curta aos domingos:** as linhas novas são levadas para o registro do sistema (princípios, decisões, demandas e dúvidas abertas) e uma linha marca até onde foi a passagem.

## Exemplos (fictícios)

```
25/10 · decisão · Blocos de carreira passam a ter 25 min, um foco por bloco, até 2h por dia útil · 3 decisões · CAR
25/10 · princípio · Tarefa agendada só manda rodar a skill; o procedimento mora na skill · 2 princípios · ORG
26/10 · dúvida · Ligar o vigia de cores em modo "corrige" ou esperar mais uma semana em "avisa"? · 5 dúvidas · ORG
27/10 · correção da linha de 26/10 · vigia continua em "avisa" até conferir os avisos da regra nova · 3 decisões · ORG
```
