---
name: faxina-arquivos
description: "Use quando a pessoa pedir faxina de arquivos (rápida ou profunda), quando a Proposta da semana sugerir a faxina, ou nos eventos 'Faxina rápida' e 'Faxina profunda' da agenda."
---

<!-- Versão pública da skill (versão de 25/10/2026). Nomes reais de pastas, arquivos e documentos pessoais foram trocados por exemplos. -->

> **O que esta skill mostra:** segurança na exclusão. A faxina **propõe primeiro** (mover, juntar, apagar, arquivar), espera o ok e só apaga o que comprovadamente existe em outro lugar. Pergunta do Claude não é permissão; dúvida vira `· descartável` e a pessoa decide.

# Faxina de arquivos (Drive + computador)

Arruma o que escapou da prevenção: mover e renomear, juntar em guia, propor o que apagar. Regras de nome e pasta: skill `nomear-e-arquivar` (ler antes). Gasta tokens: só roda quando a pessoa pede.

## Visão geral

| Modo | Quando | Onde olha |
|---|---|---|
| **Rápida** | domingo 17h (evento na agenda; a Proposta da semana conta os arquivos e pergunta) | entradas + cópias com cara de duplicata, só o que é novo desde a última faxina |
| **Profunda** | 1º domingo do mês, 15h, só com folga no limite semanal | uma pasta antiga por vez, da fila |

Precisa de chat ligado ao computador para as pastas locais. Sem computador: faz só a parte do Drive e avisa.

## 1. Ler o estado

- Doc "Arquitetura do Drive", seção "Faxina": datas da última rápida e da última profunda, e a fila.
- Critérios de exclusão da pessoa (memória do projeto).

## 2. Levantar (barato: decidir por nome, data e tamanho)

**Rápida:**
- Drive: raiz e `01 - Inbox` (só modificados depois da última faxina).
- Computador: Downloads, Área de Trabalho, raiz de Documentos e a Inbox local.
- Duplicatas no Drive inteiro: 3 buscas por título (`(1)`, `Cópia de`, `v2`/`versão`/`final`). No computador, um `find` pelos mesmos padrões. Se ficar caro, passar só para a profunda e avisar.

**Profunda:** só a próxima pasta da fila. Exemplo de fila:
1. Drive: pasta antiga "sem organizar ainda".
2. Drive: `32.03 - Preparar` (temas repetidos entre docs de preparação) e os `· juntado em guia` antigos nas `.80`.
3. Drive: `80 - Arquivo` (documentos oficiais que deveriam estar na 99).
4. Computador: a subpasta "ainda não organizados" da Inbox local.
5. Uma estrutura de notas antiga × a organização atual.

Abrir conteúdo só para confirmar se está em outro lugar. Para comparar planilhas, ver primeiro os nomes das abas e o tamanho.

## 3. Propor (curto, visão geral no topo)

- **A. Mover / renomear:** arquivo → nome novo → pasta.
- **B. Juntar em guia:** arquivo → doc de destino (só se a pessoa abriria os dois juntos).
- **C. Apagar:** arquivo → onde o conteúdo já está.
- **D. Arquivar na .80:** só versão antiga com conteúdo único, dizendo qual é esse conteúdo.
- **Não mexi:** dúvidas, com a pergunta.

**Esperar o ok. Nada é executado antes.**

## 4. Critérios

Só apagar depois de garantir que o conteúdo está em outro lugar. Pode sair:
- Arquivo que alimentou uma IA, quando o resultado guarda o que importa (o PDF da vaga sai; o doc de preparação fica).
- Cópia local que não vai mais ser enviada, se há cópia no Drive.
- Fácil de baixar de novo (histórico escolar do portal, instaladores já usados).
- Gravação de tela e mapa mental já aproveitados.
- Arquivos gerados pelo Claude (zip, .skill, .md, .html) só se o conteúdo está registrado em outro lugar.
- CV antigo do computador só se a versão está no Drive.
- Cópia quase idêntica e original já juntado em guia: lixeira, não `.80`.

Fica: o que é útil a longo prazo, documento oficial (99 geral ou `.99` da área), arquivo de outra pessoa e qualquer coisa sem certeza (marcar `· descartável` e perguntar).

## 5. Executar (depois do ok)

- Drive: mover e renomear pelo conector (mesmo link). Apagar = lixeira (30 dias para recuperar).
- Computador: conferir caminhos de programas antes de mover. Arquivo que vai para o Drive: gravar na pasta sincronizada, conferir que chegou, depois apagar o local. Apagar = pedir permissão de exclusão uma vez.

## 6. Fechar

- Atualizar o doc "Arquitetura do Drive" sem apagar o que já está lá: data da faxina e, na profunda, tirar a pasta feita da fila.
- Resposta: visão geral em 3 linhas + pendências.
- Se a mesma bagunça se repetiu (ex.: docs na raiz criados por chats), propor uma regra nova na skill de nomes e pastas.
