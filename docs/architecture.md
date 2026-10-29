# Arquitetura · Architecture

## Camadas

```mermaid
flowchart TB
    subgraph L1["1 · Fontes (onde a informação nasce)"]
        GM[Gmail]
        CAL[Google Agenda<br/>agendas por área + agenda de sugestões]
        DR[Drive · Docs · Sheets<br/>pastas no padrão Johnny Decimal]
        LMS[Moodle · Classroom]
        JOBS[Portais de vagas]
    end

    subgraph L2["2 · Agentes (skills do Claude)"]
        direction LR
        SCHED[Tarefas agendadas<br/>Resumo da manhã · Proposta da semana]
        SK[Skills sob demanda<br/>radar, preparação, moodle, faxina...]
        AS[Google Apps Script<br/>rótulos de e-mail e manutenção]
    end

    subgraph L3["3 · Governança"]
        MAP[(Mapa do Sistema<br/>banco de dados de peças)]
        LOG[Diário do sistema<br/>uma linha por mudança]
        RULES[Regras: uma informação,<br/>um lugar · dono de cada dado]
    end

    subgraph L4["4 · Saídas para mim"]
        Q[Fila de prioridade]
        B[Blocos de 25 min na agenda]
        DOCS[Docs de preparação e estudo]
        DASH[Painel diário]
    end

    L1 --> L2
    L2 --> L4
    L2 <--> L3
    ME((Eu)) -->|valida| L4
```

## Fluxo de uma semana típica

```mermaid
sequenceDiagram
    participant Eu
    participant PS as Proposta da semana (dom 18h)
    participant R as Radar de estágios
    participant RM as Resumo da manhã (seg–sex 6h)
    participant Ag as Agenda
    PS->>Ag: lê a agenda e os prazos
    PS->>Eu: proposta das próximas 2 semanas
    Eu-->>PS: ok / ajustes
    PS->>Ag: cria os blocos validados
    R->>Eu: fila (etapas + até 3 inscrições)
    Eu-->>R: ok
    R->>Ag: blocos 🎯 como sugestão
    RM->>Eu: painel do dia + o que fazer primeiro
```

## Quem escreve onde

| Lugar | Quem escreve | Quem só lê |
|---|---|---|
| Planilha de prioridade de estágios | `radar-estagios` | `resumo-da-manha`, `proposta-da-semana` |
| Docs de preparação de etapa | `preparar-processo-seletivo` | `radar-estagios` |
| Agenda de sugestões | qualquer agente | — |
| Agendas por área | só depois do meu ok | todos |
| Mapa do Sistema e Diário | `encerrar-chat` | todos |
