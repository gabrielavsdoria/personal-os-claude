# Vigia de cores e agendas (módulo B)

**O que faz.** De hora em hora, olha o que mudou nas agendas desde a última rodada:
1. **Evento novo na agenda principal** → uma regra pelo título (ex.: `🎯` → Carreira; `P1 - MAT1` → Faculdade) diz para qual agenda de área ele vai e com que cor.
2. **Evento sem cor numa agenda de área** (criado com pressa ou convite aceito) → recebe a cor padrão da área.

Assim os agentes (e a pessoa) só precisam acertar o título: o vigia arruma agenda e cor.

**Modos.** `B_MODO = 'avisa'` só anota numa aba `B - avisos` da planilha de registro (quando, agenda, ação, agenda e cor propostas, regra, motivo). `'corrige'` move e pinta. O sistema real ficou em `avisa` na primeira semana e continuou em `avisa` depois de uma mudança na regra de cores (25/10), até a pessoa conferir os avisos.

**Gatilho.** A cada hora (`B_instalarGatilho`, roda uma vez).

**Permissões.** Google Calendar API (serviço avançado), Planilhas e Drive (para achar a planilha de registro pelo nome).

**Configurar.** Propriedades do script › `AGENDAS_JSON` com o id de cada agenda (ver o topo do `Vigia.gs`).

**Regras de cor que o código segue** (fonte: seção 6 da skill [`nomear-e-arquivar`](../../skills/nomear-e-arquivar/SKILL.md)):
- a cor da área **não sai** quando o evento muda de agenda;
- Tomate (muito importante) e Tangerina (não pode atrasar) **ficam por cima** da cor da área;
- em algumas agendas, "sem cor" é de propósito (o evento herda a cor da agenda);
- sugestão de estudo do Claude **fica** na principal até a pessoa aceitar.

**Nunca faz.** Não apaga evento. Não muda de agenda um convite de outra pessoa nem tira a cor dele. Não age sobre tipos de evento que a API não move (aniversários, eventos criados pelo Gmail).

**Testar sem a agenda.** As regras são funções puras; dá para rodar `egProposta_` em Node com títulos fictícios:

```
🎯 Empresa A - 1 - pitch     → mover | Carreira | Banana
P1 - MAT1 - Sala 10 (Tomate) → mover | Faculdade | Tomate
Entrevista (convite)         → só cor | Claude - sugestões | Banana
Comprar pão                  → você classifica
```
