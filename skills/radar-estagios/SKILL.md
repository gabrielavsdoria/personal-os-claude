---
name: radar-estagios
description: "Use quando eu pedir o radar de estágios, a varredura de vagas (domingo completa, quarta só novidades), quiser priorizar vagas, registrar uma etapa ou quando o resumo da manhã apontar etapa pendente."
---

<!-- Versão pública da skill (v5). Dados pessoais, IDs de arquivos e notas reais de empresas foram removidos. -->

# Radar de estágios (v5)

Objetivo: escolher bem onde gastar tempo, não aplicar para tudo; registrar o que aprendo em cada etapa; e **não sobrecarregar a agenda**. O radar segura o backlog, a agenda mostra pouco.

Prioridade: prazo avaliativo da faculdade > etapa de processo com prazo > estudo > inscrições novas. Em semana de prova, o radar só lista prazos.

## 0. Fontes (ler antes; não duplicar)

- **Planilha "Radar de estágios - prioridade"**: fonte da nota e da fila.
  - Aba **Notas**: uma linha por processo, critérios de 0 a 5, pesos na linha 3, nota calculada por `ARRAYFORMULA`.
  - Aba **Fila**: se ordena sozinha (etapas abertas pelo prazo; inscrições novas pela nota).
  - Aba **Critérios**: régua de 0 a 5 de cada critério.
- **Doc "Radar de estágios"**: histórico (Vagas · Etapas e aprendizados · Encerrados).
- **Banco de histórias STAR**: recebe o aprendizado de cada etapa (escrito pela skill `preparar-processo-seletivo`).
- **Agenda "Carreira"** e **Gmail** (remetentes dos portais e nomes das empresas da aba Notas).
- **Portais com login**: Gupy, Cia de Talentos, Kolab, Companhia de Estágios, JobConvo, InHire, LinkedIn Jobs.

## 1. Critérios e nota

**Filtros eliminatórios** (a vaga sai sem nota): 100% remota; presencial fora da cidade; empresas já descartadas por fit.

**Nota de 0 a 100** = soma de (critério de 0 a 5 ÷ 5 × peso).

| Critério | Peso |
|---|---|
| Fit de longo prazo | 15 |
| Aprendizado (rotação, mentoria, escopo) | 15 |
| Etapa atual (chance) | 15 |
| Efetivação | 12 |
| Prestígio da empresa e da área | 10 |
| Bolsa e benefícios | 10 |
| Esforço que falta até a próxima etapa | 10 |
| Local e deslocamento | 7 |
| Data de início | 6 |

- **Prazo não entra na nota**: só ordena a fila.
- **Dado desconhecido vale 3** e vai para a coluna "A confirmar".

## 1b. Regra da fila

1. **Etapas abertas** entram todas, pelo prazo e depois pela nota. Nota abaixo de 40: propor desistir e esperar meu ok.
2. **Inscrições novas**: no máximo **3 por semana**, só com **nota ≥ 60**, da maior para a menor; o prazo desempata. Contar as já feitas na semana antes de propor.
3. **Recalcular** quando a etapa muda ou chega informação nova. Mudar só as células de critério; a nota é fórmula.

## 2. Agenda em blocos de 25 minutos

- Carreira nunca vira tarefa solta: toda ação entra num bloco 🎯 com duração real.
- Sugestões nascem numa agenda separada ("Claude - sugestões"). Só depois do meu ok viram evento na agenda Carreira.
- **Até 2h de 🎯 por dia útil**, um evento por bloco de 25 min, um foco por bloco. Título: `🎯 <Empresa> - <N> - <foco>`; descrição com o primeiro passo e o link.
- Etapa (teste, case, painel, entrevista) → chamar `preparar-processo-seletivo`.
- Nunca criar bloco sobre deslocamento, refeição, aula ou evento de outra agenda.

## 3. Modos

**a) Varredura** (domingo completa ~40 min; quarta só novidades)
1. Ler as abas Fila e Notas e a agenda Carreira.
2. Ler o Gmail desde a última varredura (thread inteira antes de concluir).
3. Abrir cada portal no navegador: status, etapa pendente, prazo real, vagas recomendadas. Login caído ou captcha: pular e anotar. **Nunca digitar senha.**
4. Atualizar a aba Notas. Vaga nova que passa nos filtros ganha linha com nota.
5. Entregar: prazos da semana, inscrições novas pela regra 1b (com nota), o que sai e por quê, portais não vistos e a proposta de blocos 🎯.

**b) Priorizar** ("qual eu faço primeiro?"): mostrar a fila e a conta das notas. Depois, uma provocação por vez:
- "Se só uma dessas sair, qual você escolheria? Por quê?" (se contrariar a nota, revisar critério ou peso)
- "O que essa vaga ensina que o seu primeiro estágio precisa ensinar?"
- "Você confirmou esse benefício ou está supondo?"
- "Quantas horas o processo custa até a próxima etapa, e de onde saem?"

**c) Registrar etapa**: chamar `preparar-processo-seletivo` (passo "depois da etapa"), registrar data · empresa · etapa · resultado no doc e atualizar a linha na planilha.

## 4. Limites

- Não aplica, não envia, não preenche formulário, não faz teste: **prepara**.
- Só esta skill escreve na planilha; o resumo da manhã apenas lê.
- No fim: uma linha por coisa gravada e registro das decisões no Diário do sistema.
