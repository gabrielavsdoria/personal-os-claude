/**
 * Árvore do Drive (módulo D3) · versão pública
 * Original de 21/10/2026.
 *
 * Todo domingo às 16h grava as pastas do Meu Drive, até o 4º nível, numa aba
 * "D3 - árvore" da planilha de registro: nível, caminho, nome, cor, se a pasta é sua, id e pai.
 * Serve de retrato do Drive para o Claude ler (em vez de navegar pasta por pasta)
 * e de histórico para comparar uma semana com a outra.
 *
 * Só lê o Drive. Nunca move, renomeia nem apaga nada.
 * Serviço avançado: Drive API (Drive; funciona com v2, o que o editor oferece, e com v3).
 */

var D3_REGISTRO_NOME = 'Apps Script - registro';
var D3_REGISTRO_PASTA = '40 - Recursos';
var D3_NIVEL_MAX = 4;

function D3_arvore() {
  var ss = d3Registro_();
  var linhas = [];
  function filhos(id, caminho, nivel) {
    if (nivel > D3_NIVEL_MAX) return;
    var tk = null;
    do {
      var r = d3ListaPastas_(id, tk);
      r.pastas.forEach(function (f) {
        var cam = caminho ? caminho + ' / ' + f.nome : f.nome;
        linhas.push([nivel, cam, f.nome, f.cor, f.meu ? 'sim' : 'não', f.id, id]);
        filhos(f.id, cam, nivel + 1);
      });
      tk = r.token;
    } while (tk);
  }
  filhos('root', '', 1);
  d3Aba_(ss, 'D3 - árvore', ['nível', 'caminho', 'pasta', 'cor', 'é minha?', 'id', 'pai'], linhas);
  var sh = ss.getSheetByName('D3 - árvore');
  sh.getRange('I1').setValue('gerado em');
  sh.getRange('J1').setValue(new Date());
  var resumo = 'D3: ' + linhas.length + ' pastas até o ' + D3_NIVEL_MAX + 'º nível';
  d3Execucao_(ss, 'D3_arvore', resumo);
  Logger.log(resumo);
}

// Lista as subpastas de uma pasta (Drive v2 ou v3).
function d3ListaPastas_(id, tk) {
  var q = "'" + id + "' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
  var r;
  try { // v2
    r = Drive.Files.list({ q: q, maxResults: 1000, pageToken: tk, orderBy: 'title',
      fields: 'nextPageToken, items(id,title,folderColorRgb,owners(isAuthenticatedUser))' });
  } catch (e2) { // v3
    r = Drive.Files.list({ q: q, pageSize: 1000, pageToken: tk, orderBy: 'name',
      fields: 'nextPageToken, files(id,name,folderColorRgb,ownedByMe)' });
  }
  var lista = r.items || r.files || [];
  return {
    token: r.nextPageToken || null,
    pastas: lista.map(function (f) {
      var meu = f.ownedByMe !== undefined ? f.ownedByMe
        : (f.owners || []).some(function (o) { return o.isAuthenticatedUser; });
      return { id: f.id, nome: f.title || f.name, cor: f.folderColorRgb || '', meu: !!meu };
    })
  };
}

function d3Registro_() {
  var it = DriveApp.getFilesByName(D3_REGISTRO_NOME);
  while (it.hasNext()) {
    var f = it.next();
    if (!f.isTrashed() && f.getMimeType() === MimeType.GOOGLE_SHEETS) return SpreadsheetApp.open(f);
  }
  var ss = SpreadsheetApp.create(D3_REGISTRO_NOME);
  var pastas = DriveApp.getFoldersByName(D3_REGISTRO_PASTA);
  if (pastas.hasNext()) DriveApp.getFileById(ss.getId()).moveTo(pastas.next());
  return ss;
}

function d3Aba_(ss, nome, cab, linhas) {
  var sh = ss.getSheetByName(nome) || ss.insertSheet(nome);
  sh.clear();
  var dados = [cab].concat(linhas.map(function (l) { while (l.length < cab.length) l.push(''); return l.slice(0, cab.length); }));
  sh.getRange(1, 1, dados.length, cab.length).setValues(dados);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, cab.length).setFontWeight('bold');
}

function d3Execucao_(ss, funcao, resumo) {
  var sh = ss.getSheetByName('Execuções') || ss.insertSheet('Execuções');
  if (sh.getLastRow() === 0) sh.appendRow(['quando', 'função', 'modo', 'resumo']);
  sh.appendRow([new Date(), funcao, 'só leitura', resumo]);
}

function D3_instalarGatilho() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'D3_arvore') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('D3_arvore').timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(16).inTimezone('America/Sao_Paulo').create();
  Logger.log('Gatilho instalado: D3_arvore domingo 16h.');
}
