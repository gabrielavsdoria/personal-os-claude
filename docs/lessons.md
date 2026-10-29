# Aprendizados sobre as ferramentas · Tool lessons

Limites e comportamentos descobertos na prática, entre setembro e outubro de 2026, ao montar o sistema com Claude, conectores do Google e Apps Script. Ficam registrados para que nenhum chat precise descobrir de novo. Ferramentas mudam: cada item vale para a data em que foi observado.

*Limits and quirks found in practice (Sep–Oct 2026) while building the system with Claude, Google connectors and Apps Script. Tools change; each item reflects what was observed at the time.*

## Google Drive (conector)

- Só sobe arquivo em **base64**: inviável para PDF grande, apresentação com imagens ou binário. Para esses, gravar na pasta sincronizada do computador.
- Não lê `.zip`.
- `update_file` só muda **título, pasta e descrição**: não muda a cor de pasta nem o conteúdo de um Doc (para o conteúdo, o conector do Google Docs).
- Quem cria a pasta ou faz a cópia vira o dono; não há transferência de propriedade entre organizações (conta institucional → conta pessoal).
- A API arredonda a cor das pastas para a própria paleta.

## Google Docs (conector)

- Cria guias (`addDocumentTab`) sem precisar de navegador.
- Docs grandes (o Diário, o manual do Drive, o banco de histórias): baixar como texto e ler pelo arquivo com Python, recortando pelos títulos, em vez de trazer o doc inteiro para a conversa.
- A leitura falhou várias vezes seguidas num Doc importado de HTML com tabelas aninhadas.

## Google Agenda (conector)

- Só aceita `colorId` de **1 a 11**; as outras cores do app só a pessoa aplica.
- Cria e apaga eventos, mas **não cria agendas** nem **move** evento entre agendas: para "mover", recriar na agenda certa e apagar o original.
- A API não move séries anuais antigas, convites de outras pessoas nem eventos criados pelo Gmail.
- Mover um evento recorrente leva a série inteira: mover pelo mestre e reaplicar as cores de urgência nas exceções depois.
- A tabela colorId → nome no app (1 Lavanda … 11 Tomate) precisou de um teste próprio: documentação antiga chamava a cor 1 por outro nome.

## Planilhas

- Google Sheets em pt_BR, pela API: **";"** como separador de argumentos e vírgula como decimal.
- Validação por fórmula personalizada é recusada pela API.
- `.xlsx` aberto no Sheets pelo conector só entrega valores.
- Antes de escrever fórmula, confirmar se é Sheets ou Excel e em que idioma.

## Gmail

- A API limita leituras por minuto: ler com pausa curta entre mensagens, tentar de novo com espera crescente e salvar o progresso para continuar na rodada seguinte.
- Descadastro de um clique só é seguro quando o **DKIM** confirma o domínio do remetente; sem isso, a pessoa clica.
- O conector pode perder a permissão de escrita: o trabalho de rótulos foi para um Apps Script próprio, com permissões explícitas.

## Google Apps Script

- O botão Executar roda **a função escolhida no seletor**: com o `myFunction` padrão, a execução termina em um segundo sem fazer nada.
- O editor só oferece o serviço avançado do Drive na **v2**: o código precisa funcionar com v2 e v3.
- Cotas de conta pessoal (documentação oficial, consultada em 26/10/2026): 90 min por dia de gatilhos, 6 min por execução, 20 gatilhos por script. Rotinas longas rodam em partes e guardam o estado entre uma parte e outra.
- Permissão de um web app: "Executar como: Eu" e "Somente eu"; testar a URL numa janela anônima (tem de pedir login ou negar).

## Arquivos e computador

- **Comparar cópias por hash** (md5 ou SHA-256) antes de chamar algo de duplicata; nome igual não prova arquivo igual.
- Renomeação em lote: plano em script, validação, rodada de simulação antes de mover, atenção a nomes em NFD (acentos decompostos), uma única permissão de exclusão no fim.
- Pasta com espaço no fim do nome não é acessível pelo shell.
- Não há conector de OneDrive para conta pessoal: só pelas pastas do computador.
- "Mover pasta para a nuvem" sobe uma cópia e desvincula a pasta local: matéria em semestre ativo fica vinculada.

## Moodle (e-Disciplinas)

- As seções do curso carregam por AJAX: listar pela API, não pelo HTML da página.
- Uma varredura só vale com cobertura completa (recursos, pastas, tarefas, fóruns com anexo, links, questionários, rótulos, subseções) e uma linha de "cobertura" no resumo.
- Arquivo com tamanho diferente do local: comparar o conteúdo antes de baixar de novo. Vídeo e áudio nunca baixam sem perguntar.

## Claude

- O Claude só lê as instruções vivas do projeto em que está; para os outros, vale uma cópia num arquivo, atualizada quando a pessoa cola o texto novo.
- Uma sessão remota não recebe aviso de mudanças numa página publicada: reler antes de escrever.
- Exclusões podem ser barradas por uma checagem de segurança da própria sessão (não é o Drive): marcar `· descartável` e virar tarefa da pessoa.
- Uma skill salva pelo cartão é um arquivo único: o corpo leva a receita essencial e manda ler um doc do projeto quando precisa do detalhe.
- No navegador do app, clicar por referência do elemento, nunca por coordenada, e conferir pelo rótulo depois.
