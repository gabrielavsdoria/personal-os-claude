# 0003 · Tarefa agendada só manda rodar a skill (decisão #85)

- **Data:** 25/10/2026
- **Status:** aceita
- **Peças:** tarefas agendadas Resumo da manhã e Proposta da semana; skills `resumo-da-manha` e `proposta-da-semana`

## Contexto
As tarefas agendadas carregavam o procedimento inteiro no próprio texto. Mudar uma regra exigia editar a tarefa e a skill, e as duas versões podiam divergir.

## Decisão
O texto da tarefa agendada só diz **qual skill rodar**. O procedimento mora na skill, num lugar só.

## Consequências
- Uma regra muda num lugar e vale para a execução agendada e para a manual.
- A skill pode ser versionada e registrada no Mapa como qualquer outra peça.
