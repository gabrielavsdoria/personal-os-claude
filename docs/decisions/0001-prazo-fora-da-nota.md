# 0001 · Prazo não entra na nota de prioridade

- **Data:** 25/10/2026
- **Status:** aceita
- **Peça:** `radar-estagios` v5

## Contexto
Se o prazo entrasse na nota (quanto mais perto, maior a nota), vagas urgentes mas pouco alinhadas passariam na frente de vagas importantes.

## Decisão
A nota (0 a 100) mede só **quanto a vaga vale** (fit, aprendizado, chance, efetivação, prestígio, bolsa, esforço, local, início). O prazo **só ordena a fila** e desempata.

## Consequências
- Urgência e importância ficam separadas.
- Uma vaga com nota abaixo de 60 não vira inscrição, por mais perto que esteja o prazo.
- Etapas de processos já abertos entram todas na fila, ordenadas pelo prazo.
