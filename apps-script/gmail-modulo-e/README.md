# Módulo E do Gmail

**O que faz.** Arruma a caixa de entrada em cinco passos, cada um com uma função `_simular` (só lê e escreve na planilha) e uma `_executar` (muda o Gmail):

| Passo | O que faz |
|---|---|
| **E1** Mapa de remetentes | Lê os e-mails dos últimos 60 dias e monta uma aba com cada remetente: quantidade, não lidos, se tem descadastro, se tem descadastro de um clique e a **categoria proposta**. A pessoa corrige a coluna "categoria final". |
| **E2** Rótulos | Cria os rótulos que faltam (7 no sistema real) e aplica por remetente nos últimos 60 dias, usando a categoria final aprovada. |
| **E3** Filtros | Cria filtros que **só põem rótulo** (não tiram da caixa de entrada). |
| **E4** Descadastro | Descadastra com um clique **só quando o DKIM confirma o domínio do remetente** e a pessoa marcou "sim". O resto vira lista para ela clicar. |
| **E5** Arquivar | Tira da caixa de entrada só Newsletters e Compras **sem estrela e com mais de 7 dias**. Eles continuam no rótulo. |

Primeira rodada (25/10/2026): 273 e-mails arquivados.

**Gatilho.** Nenhum: só roda quando a pessoa chama, passo a passo, conferindo a planilha entre um e outro.

**Permissões (4).** `gmail.modify`, `gmail.settings.basic` (filtros), `spreadsheets` (registro) e `script.external_request` (o POST do descadastro de um clique). Usa só o serviço avançado do Gmail, sem `GmailApp`.

**Configurar.** Propriedades do script › `REGISTRO_ID` = id da planilha de registro.

**Nunca faz.** Não envia, não encaminha, não apaga e não manda nada para a lixeira. E-mail de serviço (compra, comprovante) nunca é descadastrado. Alertas de conta e de banco ficam sem rótulo.

**Na versão publicada.** Os remetentes, as empresas e os padrões reais de cada categoria foram trocados por exemplos (`loja-exemplo`, `universidade.edu`); a lógica é a mesma.
