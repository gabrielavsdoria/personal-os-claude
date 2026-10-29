/**
 * Vigia de cores e agendas (módulo B) · versão pública
 * ⟦CORES 2026-10-27⟧ · original de 21/10/2026, ajustado em 26/10/2026
 *
 * O que faz, de hora em hora:
 *   1. Agenda principal ("Claude - sugestões"): evento novo ou alterado → a regra pelo título
 *      diz para qual agenda de área ele vai e com que cor.
 *   2. Agendas de área: evento sem cor (criado com pressa ou convite aceito) → cor padrão da área.
 *
 * Dois modos (constante B_MODO):
 *   'avisa'   → só anota numa aba "B - avisos" da planilha de registro (padrão; 1ª semana)
 *   'corrige' → move o evento e aplica a cor
 *
 * Nunca apaga evento. Convite de outra pessoa nunca muda de agenda nem perde cor.
 *
 * Esta versão junta num arquivo só o que, no sistema real, está em três arquivos
 * (regras, mover e vigia). Os IDs das agendas ficam fora do código, em
 * Configurações do projeto › Propriedades do script:
 *   AGENDAS_JSON = {"Claude - sugestões":"primary","Faculdade":"<id>@group.calendar.google.com", ...}
 * Serviço avançado: Google Calendar API (Calendar, v3).
 */

var B_MODO = 'avisa';

var EG_REGISTRO_NOME = 'Apps Script - registro';   // planilha de log, achada pelo nome
var EG_REGISTRO_PASTA = '40 - Recursos';

var EG_COR = {
  '1': 'Lavanda', '2': 'Sálvia', '3': 'Uva', '4': 'Flamingo', '5': 'Banana', '6': 'Tangerina',
  '7': 'Pavão', '8': 'Grafite', '9': 'Mirtilo', '10': 'Manjericão', '11': 'Tomate'
};

// Urgência vai POR CIMA da cor da área e nunca sai.
var EG_URGENCIA = ['11', '6'];

// Cor de evento de cada agenda. A cor da área NÃO sai ao mudar de agenda:
// - se o evento já tem um tom aceito da área, fica;
// - se tem cor de outra área ou nenhuma, recebe a cor padrão da área;
// - padrao '' = sem cor no evento (herda a cor da agenda);
// - '' em aceitas = sem cor também está certo.
var EG_AREA = {
  'Faculdade':          { padrao: '10', aceitas: ['10', '2'] },   // aula Manjericão; estudo aceito em Sálvia
  'Carreira':           { padrao: '5',  aceitas: ['5'] },
  'Projetos':           { padrao: '',   aceitas: ['', '7', '9'] }, // com o grupo = cor da agenda; só a pessoa = Pavão
  'Bem-estar':          { padrao: '3',  aceitas: ['3', '1'] },    // forte / claro
  'Social e Lazer':     { padrao: '',   aceitas: ['', '4'] },     // festa = cor da agenda; leve = Flamingo
  'Feriados e férias':  { padrao: '',   aceitas: [] },
  'Visualização':       { padrao: '8',  aceitas: ['8'] },
  'Claude - sugestões': { padrao: '',   aceitas: [] }
};

// Regras por título (sem acento, minúsculo). A primeira que casar vale.
// agenda 'FICA' = continua na principal. cor 'semCor' = o evento herda a cor da agenda.
// Exemplos fictícios: MAT1, MAT2... no lugar das disciplinas reais.
var EG_REGRAS = [
  { id: 'R01 lembrete',   agenda: 'FICA', re: /pedir ao claude|faxina/, nota: 'lembrete de rotina: fica na principal' },
  { id: 'R02 voo',        agenda: 'FICA', re: /^voo\b|passagem|check-?in/, nota: 'voo: fica até a pessoa classificar' },
  { id: 'R03 carreira',   agenda: 'Carreira', re: /🎯|entrevista|processo seletivo|estagio|painel|dinamica/, nota: 'entrevista e painel mantêm Tomate' },
  { id: 'R04 estudo',     agenda: 'Faculdade', cor: '2', re: /lista \d|exercicio|revisao|\bestud|resolver|simulado/, nota: 'na principal é sugestão e fica; aceito = Faculdade em Sálvia' },
  { id: 'R05 aula/prova', agenda: 'Faculdade', re: /^(?:(?:p[123]|psub|prec)\s*-\s*)?mat\d\b/, nota: 'aula Manjericão; prova e sub mantêm Tomate/Tangerina' },
  { id: 'R06 período',    agenda: 'Faculdade', re: /^usp - |matricula|trancamento/, nota: 'último dia do período: Tangerina' },
  { id: 'R07 feriado',    agenda: 'Feriados e férias', cor: 'semCor', re: /feriad|recesso|ferias|carnaval/, nota: 'sem cor no evento' },
  { id: 'R08 visualizar', agenda: 'Visualização', re: /^◦?\s*deslocamento|^◦\s*(almoco|jantar|rotina|descanso|acordar)/, nota: 'só para olhar' },
  { id: 'R09 viagem',     agenda: 'Social e Lazer', re: /✈|viagem|camping/, nota: 'pôr ✈️ no título se faltar' },
  { id: 'R10 bem-estar',  agenda: 'Bem-estar', re: /treino|academia|corrida/, nota: '' },
  { id: 'R11 social',     agenda: 'Social e Lazer', re: /festa|aniver|show|cinema|teatro|happy hour|churras/, nota: '' },
  { id: 'R12 projetos',   agenda: 'Projetos', re: /projeto de extensao|voluntar|reuniao do grupo/, nota: '' }
];

// ===================== B · VIGIA =====================

function B_vigiar() {
  var props = PropertiesService.getScriptProperties();
  var agendas = egAgendas_();
  var principal = agendas['Claude - sugestões'];
  var desde = props.getProperty('B_ultimo') || new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  var agora = new Date().toISOString();
  var ss = egRegistro_();
  var linhas = [];

  // 1. Principal: evento novo ou alterado → qual agenda e cor a regra propõe
  egPercorre_(principal, desde, function (e) {
    if (e.eventType && e.eventType !== 'default') return;
    var titulo = e.summary || '(sem título)';
    var g = { cores: {}, meu: !!(e.organizer && e.organizer.self), tipo: 'default' };
    g.cores[e.colorId || ''] = 1;
    var p = egProposta_(g, titulo);
    if (p.acao === 'fica') return;
    if (p.acao === 'só cor' && p.motivo === 'cor da área fica') return; // já está certo
    if (p.regra && p.regra.indexOf('R04') === 0) {
      // estudo na principal é sugestão do Claude: fica até a pessoa aceitar
      linhas.push([new Date(), 'Claude - sugestões', 'fica', 'Claude - sugestões', '', titulo, p.regra, 'sugestão de estudo: aceitar = recriar na Faculdade em Sálvia', 'anotado', e.id]);
      return;
    }
    var res = 'anotado';
    if (B_MODO === 'corrige' && (p.acao === 'mover' || p.acao === 'só cor')) {
      try {
        var dest = p.acao === 'mover' ? agendas[p.agenda] : principal;
        if (p.acao === 'mover') Calendar.Events.move(principal, e.id, dest);
        egAplicaCor_(dest, e.id, egIdCor_(p.cor), g.meu);
        res = 'ok';
      } catch (err) { res = 'ERRO: ' + err.message; }
    }
    linhas.push([new Date(), 'Claude - sugestões', p.acao, p.agenda, p.cor, titulo, p.regra, p.motivo, res, e.id]);
  });

  // 2. Agendas de área: evento sem cor → cor padrão da área
  Object.keys(agendas).forEach(function (nome) {
    if (nome === 'Claude - sugestões') return;
    var area = EG_AREA[nome];
    if (!area || !area.padrao) return; // nessas agendas, sem cor é o certo
    var cal = agendas[nome];
    egPercorre_(cal, desde, function (e) {
      if (e.colorId) return;
      var titulo = e.summary || '(sem título)';
      var res = 'anotado';
      if (B_MODO === 'corrige' && e.organizer && e.organizer.self) {
        try { Calendar.Events.patch({ colorId: area.padrao }, cal, e.id); res = 'ok'; }
        catch (err) { res = 'ERRO: ' + err.message; }
      }
      linhas.push([new Date(), nome, 'sem cor', nome, egNomeCor_(area.padrao), titulo, 'cor da área', 'evento sem cor na agenda da área', res, e.id]);
    });
  });

  var sh = ss.getSheetByName('B - avisos') || ss.insertSheet('B - avisos');
  if (sh.getLastRow() === 0) {
    sh.appendRow(['quando', 'agenda', 'ação', 'agenda proposta', 'cor proposta', 'título', 'regra', 'por quê', 'resultado', 'id']);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, 10).setFontWeight('bold');
  }
  if (linhas.length) sh.getRange(sh.getLastRow() + 1, 1, linhas.length, 10).setValues(linhas);
  props.setProperty('B_ultimo', agora);
  var resumo = 'B (' + B_MODO + '): ' + linhas.length + ' evento(s) desde ' + desde.slice(0, 16);
  egExecucao_(ss, 'B_vigiar', resumo);
  Logger.log(resumo);
}

// Percorre os eventos de uma agenda alterados desde "desde" (mestres de série, não as ocorrências).
function egPercorre_(cal, desde, fn) {
  var token = null;
  do {
    var r = Calendar.Events.list(cal, { updatedMin: desde, singleEvents: false, maxResults: 2500, pageToken: token, showDeleted: false });
    (r.items || []).forEach(function (e) {
      if (e.status === 'cancelled') return;
      fn(e);
    });
    token = r.nextPageToken;
  } while (token);
}

// ===================== REGRAS =====================

// Decide agenda, cor e ação. Não move nada.
function egProposta_(g, titulo) {
  var t = egNorm_(titulo);
  var regra = null;
  for (var i = 0; i < EG_REGRAS.length; i++) { if (EG_REGRAS[i].re.test(t)) { regra = EG_REGRAS[i]; break; } }
  var base = egCorBase_(g.cores);
  if (g.tipo !== 'default') return { acao: 'fica', agenda: 'Claude - sugestões', cor: egNomeCor_(base), motivo: 'tipo ' + g.tipo + ': a API não move', regra: regra ? regra.id : '' };
  if (!regra) {
    if (base === '8') regra = { id: 'R08 visualizar (pela cor)', agenda: 'Visualização' };
    else return { acao: 'você classifica', agenda: '?', cor: egNomeCor_(base), motivo: 'nenhuma regra casou', regra: '' };
  }
  var cor = egCorProposta_(base, regra);
  if (regra.agenda === 'FICA') return { acao: 'fica', agenda: 'Claude - sugestões', cor: egNomeCor_(base), motivo: 'regra: fica na principal', regra: regra.id };
  if (!g.meu) return { acao: 'só cor', agenda: 'Claude - sugestões', cor: egNomeCor_(cor.cor), motivo: cor.motivo, regra: regra.id }; // convite: não muda de agenda
  return { acao: 'mover', agenda: regra.agenda, cor: egNomeCor_(cor.cor), motivo: cor.motivo, regra: regra.id };
}

// A cor da área fica; a urgência fica por cima.
function egCorProposta_(base, regra) {
  var area = EG_AREA[regra.agenda] || { padrao: '', aceitas: [] };
  if (EG_URGENCIA.indexOf(base) >= 0) return { cor: base, motivo: 'urgência fica' };
  if (regra.cor && regra.cor !== 'semCor') return { cor: regra.cor, motivo: 'cor da regra: ' + egNomeCor_(regra.cor) };
  if (regra.cor === 'semCor') return { cor: '', motivo: 'sem cor (herda a agenda)' };
  if (area.aceitas.indexOf(base) >= 0) return { cor: base, motivo: 'cor da área fica' };
  if (!area.padrao) return { cor: '', motivo: 'sem cor (herda a agenda)' };
  return { cor: area.padrao, motivo: base ? egNomeCor_(base) + ' é de outra área → ' + egNomeCor_(area.padrao) : 'sem cor → ' + egNomeCor_(area.padrao) };
}

// '' = tirar a cor (o evento herda a cor da agenda). Convite de outra pessoa: não tira a cor.
function egAplicaCor_(cal, id, cor, meu) {
  var ev = Calendar.Events.get(cal, id);
  if ((ev.colorId || '') === cor) return;
  if (cor) { Calendar.Events.patch({ colorId: cor }, cal, id); return; }
  if (!meu) return;
  delete ev.colorId;
  Calendar.Events.update(ev, cal, id);
}

// ===================== AJUDANTES =====================

function egAgendas_() {
  var raw = PropertiesService.getScriptProperties().getProperty('AGENDAS_JSON');
  if (!raw) throw new Error('Falta AGENDAS_JSON nas Propriedades do script.');
  return JSON.parse(raw);
}

function egRegistro_() {
  var it = DriveApp.getFilesByName(EG_REGISTRO_NOME);
  while (it.hasNext()) {
    var f = it.next();
    if (!f.isTrashed() && f.getMimeType() === MimeType.GOOGLE_SHEETS) return SpreadsheetApp.open(f);
  }
  var ss = SpreadsheetApp.create(EG_REGISTRO_NOME);
  var pastas = DriveApp.getFoldersByName(EG_REGISTRO_PASTA);
  if (pastas.hasNext()) DriveApp.getFileById(ss.getId()).moveTo(pastas.next());
  return ss;
}

function egExecucao_(ss, funcao, resumo) {
  var sh = ss.getSheetByName('Execuções') || ss.insertSheet('Execuções');
  if (sh.getLastRow() === 0) sh.appendRow(['quando', 'função', 'modo', 'resumo']);
  sh.appendRow([new Date(), funcao, B_MODO, resumo]);
}

function egNorm_(s) { return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
function egNomeCor_(id) { return id ? (EG_COR[id] || 'cor ' + id) : 'sem cor'; }
function egIdCor_(nome) {
  if (!nome || nome === 'sem cor') return '';
  for (var k in EG_COR) { if (EG_COR[k] === nome) return k; }
  return '';
}
function egCorBase_(cores) {
  var melhor = '', n = -1;
  Object.keys(cores).forEach(function (k) { if (EG_URGENCIA.indexOf(k) < 0 && cores[k] > n) { n = cores[k]; melhor = k; } });
  if (n < 0) Object.keys(cores).forEach(function (k) { if (cores[k] > n) { n = cores[k]; melhor = k; } });
  return melhor;
}

// ===================== GATILHO =====================

function B_instalarGatilho() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'B_vigiar') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('B_vigiar').timeBased().everyHours(1).create();
  Logger.log('Gatilho instalado: B_vigiar a cada hora.');
}
