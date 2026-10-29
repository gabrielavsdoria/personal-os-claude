# Nomes de arquivo e pastas · File and folder naming

Padrão usado em todo o Drive e no computador. A regra completa (com cores e agendas) está na skill [`nomear-e-arquivar`](../skills/nomear-e-arquivar/SKILL.md); aqui fica o essencial para copiar.

*Area-first file names, Johnny Decimal folders up to 3 levels, status in the name (never in a folder) and a 6-line header on every Markdown file.*

## 1. Nome do arquivo

```
ÁREA - [ciclo] - Assunto - descrição [(AAAAMMDD)] [· tipo]
```

- **Área primeiro**, em maiúsculas: é o que aparece na aba do navegador, então dá para achar o arquivo certo entre dez abas abertas.
- **Ciclo `AA.S`** (ex.: `26.2`) só no que perde a utilidade no fim do semestre. Ano (`2026`) no que vence no fim do ano.
- **`AAAAMMDD`** só em registro de um evento de um dia (entrevista, envio, reunião).
- **Status no nome, nunca em pasta:** `(enviado 20260927)`, `· rascunho`, `· descartável`, `· versão antiga (AAAAMMDD)`.
- Separador sempre ` - `. Sem underline, sem colchetes, sem "final", "novo" ou "(1)".

| Exemplo fictício | Por quê |
|---|---|
| `CAR - Plano de carreira` | consulta que a pessoa atualiza: sem ciclo, sem data |
| `USP - 26.2 - Semestre` | pasta de projeto que acaba no semestre |
| `USP - MAT1 - P1 - A04 - slides - Balanço de massa.pdf` | material de aula: disciplina, prova, aula, tipo, assunto |
| `CAR - 26.2 - Empresa A - Prep - painel (20261030)` | registro de uma etapa com data |
| `ORG - Nomenclatura dos arquivos · fleet` | nota de pensamento (zettelkasten) |
| `CAR - CV - Empresa A (20261020) · rascunho` | status no nome |

## 2. Pastas (Johnny Decimal, até 3 níveis a partir da área)

```
01 - Inbox                  o que chegou sem casa (sai na faxina)
10 - Notas                  11 MOCs · 12 Fleeting · 13 Literature · 14 Permanent
20 - Projetos ativos        o que tem começo, meio e fim  →  vai para 80 quando acaba
30 - Áreas                  o que continua
   31 - Estudo
   32 - Carreira
      CAR - 32.01 - Buscar e avaliar
      CAR - 32.02 - Candidatar
      CAR - 32.03 - Preparar
      CAR - 32.04 - Processos do semestre
      CAR - 32.80 - Arquivo          ← .80 = arquivo da área
      CAR - 32.99 - Oficiais         ← .99 = documentos oficiais da área
   33 ... 38
40 - Recursos               templates, prompts, métodos
80 - Arquivo                projetos e áreas encerrados
99 - Documentos oficiais
```

- **Área** = o que continua; **projeto** = o que acaba.
- Dentro de cada área: `.01` a `.0n` por tipo de uso, **`.80` arquivo** (versão antiga só se tiver conteúdo que a nova não tem) e **`.99` oficiais** (nunca versão antiga).

## 3. Cabeçalho de 6 linhas em todo `.md`

Todo arquivo Markdown que o sistema mantém abre com este bloco, para qualquer agente saber em segundos se deve ler, confiar ou escrever nele:

```markdown
> **Função:** estado | referência | registro | prompt
> **Assunto:** do que o arquivo trata, em uma linha
> **Fonte de:** de que informação este arquivo é a fonte única
> **Quem lê:** quais chats ou skills leem
> **Quem escreve:** quem pode escrever (e em que condição)
> **Atualizado:** DD/MM/AAAA (o que mudou)
```

## 4. Antes de criar, mover ou apagar

1. Procurar um arquivo do mesmo tema e ciclo. Se existir, **editar o mesmo** (mesmo link) ou propor uma guia nele.
2. Nascer na pasta certa; sem saber a pasta, `01 - Inbox`.
3. Antes de mover: algum programa depende do caminho?
4. Duplicata só depois de conferir que é idêntica (hash e byte a byte).
5. Fora da faxina, nunca apagar: o descartável vira lista para a pessoa decidir.
