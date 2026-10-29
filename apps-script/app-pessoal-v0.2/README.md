# App pessoal (v0.2)

**O que faz.** Um web app do Apps Script, aberto no celular como atalho na tela inicial, com duas coisas:
- **Hoje:** o que está acontecendo agora, o próximo compromisso, os cards que o Resumo da manhã escreveu numa planilha e a lista do dia de todas as agendas, com um alerta quando o dia passa de 85% ocupado.
- **Validar sugestões:** cada sugestão dos agentes pode ser **aceita** (vai para a agenda da área, com a cor da área), **recusada** com um motivo (vai para a planilha de não feitos) ou **movida** para um dos 3 próximos horários livres em todas as agendas.

Hoje isso é feito no chat. O app tira esse passo do Claude (zero tokens) e põe no celular. A escolha de Apps Script veio de uma comparação de 5 caminhos ([decisão 0004](../../docs/decisions/0004-app-em-apps-script.md)).

**Estado.** v0.2 de 27/10/2026, com as correções de uma auditoria de segurança feita antes de instalar. Testado fora do Google; **ainda não instalado**.

**Gatilho.** Nenhum: abre quando a pessoa abre.

**Permissões.** Eventos só das agendas de que ela é **dona**, lista de agendas (leitura), planilhas e o próprio e-mail. Implantação "Executar como: Eu" e "Quem pode acessar: Somente eu".

**Sempre simula antes.** Começa em `MODO = simular`: aceitar, recusar e mover só escrevem no Log o que fariam. O modo real só depois de uma semana olhando o Log.

**Defesas no código.**
- Toda função confere quem chama (`OWNER_EMAIL`) e valida cada entrada.
- Só mexe em evento com a marca `#sugestao-claude`, sem convidados, sem cor, não recorrente, organizado pela dona e que **não mudou desde que a tela leu** (compara a versão).
- Toda agenda e planilha de destino tem de ser da dona; se não for, o app para.
- Se uma agenda não carrega, não oferece horário livre (falha fechada).
- Nada vira fórmula na planilha (`celula_`); a tela só insere texto (`textContent`); links só de domínios permitidos.
- Aceitar cria na agenda nova e apaga a sugestão; se apagar falhar, desfaz a criação.
- Saúde não passa pelo app.

**Nunca faz.** Não mexe em evento que não seja sugestão, não toca convites, não escreve na planilha de dados pelo Claude, não guarda chave ou senha.
