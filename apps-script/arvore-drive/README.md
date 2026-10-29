# Árvore do Drive (módulo D3)

**O que faz.** Grava as pastas do Meu Drive, até o 4º nível, numa aba `D3 - árvore` da planilha de registro: nível, caminho completo, nome, cor, se a pasta é da pessoa, id e pai. Na instalação (21/10/2026) eram 160 pastas.

**Para que serve.** O Claude lê uma planilha em vez de navegar pasta por pasta pelo conector (mais barato e mais rápido), e a faxina mensal compara a árvore de uma semana com a outra. Uma tarefa do Windows faz o mesmo com as pastas do computador.

**Gatilho.** Domingo, 16h (`D3_instalarGatilho`, roda uma vez).

**Permissões.** Drive API (serviço avançado; funciona com a v2 que o editor oferece e com a v3) e Planilhas.

**Sempre simula antes?** Não precisa: o módulo **só lê** o Drive.

**Nunca faz.** Não move, renomeia, pinta nem apaga pasta ou arquivo. Pasta de outra pessoa entra na lista marcada "é minha? não", para ninguém mexer nela por engano.
