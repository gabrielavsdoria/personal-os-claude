/**
 * App pessoal v0.2 (27/10/2026): tela Hoje e validar sugestões · versão pública
 * v0.2 = correções de uma auditoria de segurança feita antes de instalar (27/10).
 *
 * Web app do Apps Script: Executar como "Eu", acesso "Somente eu".
 * Propriedades do script (Configurações do projeto > Propriedades do script):
 *   SHEET_ID     planilha de dados do app (Config, Areas, Log, Check-in). O Claude NÃO escreve nela.
 *   ENTRADA_ID   planilha de entrada do Claude (Hoje, Semana). Só texto para mostrar.
 *   OWNER_EMAIL  o seu e-mail (trava: qualquer outra pessoa é recusada).
 *   MODO         "simular" (padrão) ou "real". Fica aqui, fora da planilha, de propósito.
 *
 * Regras:
 *  - nada de chave ou senha no código; funções internas terminam em "_";
 *  - toda função pública confere quem chama (OWNER_EMAIL) e valida o que recebe;
 *  - só mexe em evento que tem a marca #sugestao-claude na descrição, sem convidados, sem cor,
 *    não recorrente, organizado pela dona, na agenda de sugestões, e que não mudou desde que a tela leu;
 *  - toda agenda e planilha de destino tem de ser da dona; se não for, o app para;
 *  - se uma agenda não carrega, o app avisa e não oferece horário livre (falha fechada);
 *  - tudo o que vai para planilha passa por celula_() (sem fórmula);
 *  - saúde não passa por aqui: a área de bem-estar não é destino no app.
 */

var TZ_ = 'America/Sao_Paulo';
var MARCA_ = '#sugestao-claude';
var MOTIVOS_ = ['sem tempo', 'não quero mais', 'oportunidade passou', 'outro'];
var TIPOS_CARD_ = ['primeiro_passo', 'risco', 'levar', 'prazo', 'urgente', 'radar', 'vai_abrir', 'prova', 'pergunta'];
var LINK_OK_ = /^https:\/\/([a-z0-9-]+\.)*(google\.com|gupy\.io|gupy\.com\.br|ciadeestagios\.com\.br|ciadetalentos\.com\.br|kolab\.ee|linkedin\.com|usp\.br|claude\.ai)(\/|$)/i;
var PROTEGIDO_ = /pedir ao claude|faxina|\bvoo\b|passagem|check-?in|moodle|diario|consulta|exame|saude/;
var CHAVES_AGENDA_ = ['agenda_sugestoes', 'agenda_faculdade', 'agenda_carreira', 'agenda_social', 'agenda_projetos', 'agenda_feriado', 'agenda_visualizacao', 'agenda_bemestar'];
var DESTINOS_PERMITIDOS_ = ['agenda_faculdade', 'agenda_carreira', 'agenda_social', 'agenda_projetos'];

// ---------- Entrada do web app ----------

function doGet() {
  dono_();
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Hoje')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ---------- Funções públicas (chamadas pela tela) ----------

function getPainel() {
  dono_();
  var cfg = config_();
  var agora = new Date();
  var dia = eventosDoDia_(cfg, agora);
  var sug = listarSugestoes_(cfg);
  return {
    agoraIso: agora.toISOString(),
    modo: cfg.modo, versao: cfg.versao,
    eventos: dia.eventos,
    avisos: dia.falhas.concat(sug.falhas),
    cards: cardsDeHoje_(cfg, agora),
    sugestoes: sug.lista,
    areas: cfg.areas.map(function (a) { return a.area; }),
    motivos: MOTIVOS_,
    carga: cargaDoDia_(dia.eventos, agora)
  };
}

function aceitarSugestao(eventId, versaoVista, areaNome) {
  dono_(); validarId_(eventId); validarVersao_(versaoVista);
  var cfg = config_();
  var area = cfg.areas.filter(function (a) { return a.area === areaNome; })[0];
  if (!area) throw new Error('Área desconhecida.');
  var destino = cfg.agendas[area.agendaChave];
  return comTrava_(function () {
    var ev = sugestaoValida_(cfg, eventId, versaoVista);
    var colorId = escolherCor_(area, ev.summary || '');
    var novo = {
      summary: ev.summary,
      description: String(ev.description || '').replace(MARCA_, '').trim(),
      location: ev.location || '',
      start: ev.start, end: ev.end,
      reminders: ev.reminders || { useDefault: true }
    };
    if (colorId) novo.colorId = String(colorId);
    if (cfg.modo !== 'real') {
      log_(cfg, 'aceitar', 'simular', ev, area.area + (colorId ? ' (cor ' + colorId + ')' : ''), 'simulado');
      return { ok: true, simulado: true, msg: 'Simulação: iria para ' + area.area + '.' };
    }
    var criado = Calendar.Events.insert(novo, destino);
    try {
      Calendar.Events.remove(cfg.agendas.agenda_sugestoes, ev.id);
    } catch (e) {
      Calendar.Events.remove(destino, criado.id); // desfaz: nada fica duplicado
      throw new Error('Não deu para apagar a sugestão. Nada mudou.');
    }
    limparCache_();
    log_(cfg, 'aceitar', 'real', ev, area.area, 'novo id ' + criado.id);
    return { ok: true, simulado: false, msg: 'Foi para ' + area.area + '.' };
  });
}

function recusarSugestao(eventId, versaoVista, motivo) {
  dono_(); validarId_(eventId); validarVersao_(versaoVista);
  if (MOTIVOS_.indexOf(motivo) < 0) throw new Error('Motivo inválido.');
  var cfg = config_();
  return comTrava_(function () {
    var ev = sugestaoValida_(cfg, eventId, versaoVista);
    var inicio = dataDoEvento_(ev.start);
    if (cfg.modo !== 'real') {
      log_(cfg, 'recusar', 'simular', ev, 'Nao feitos', motivo);
      return { ok: true, simulado: true, msg: 'Simulação: iria para Não feitos (' + motivo + ').' };
    }
    Calendar.Events.remove(cfg.agendas.agenda_sugestoes, ev.id);
    limparCache_();
    log_(cfg, 'recusar', 'real', ev, 'Nao feitos', motivo);
    try {
      SpreadsheetApp.openById(cfg.naoFeitosId).getSheets()[0].appendRow([
        hojeTexto_(), celula_(ev.summary), tipoDaSugestao_(ev.summary || ''),
        inicio ? Utilities.formatDate(inicio, TZ_, 'dd/MM/yyyy HH:mm') : '', 'recusado no app', motivo, ''
      ].map(celula_));
    } catch (e) {
      return { ok: true, simulado: false, msg: 'Recusada. Atenção: não consegui anotar em Não feitos (está no Log).' };
    }
    return { ok: true, simulado: false, msg: 'Recusada e anotada em Não feitos.' };
  });
}

function horariosLivres(eventId, versaoVista) {
  dono_(); validarId_(eventId); validarVersao_(versaoVista);
  var cfg = config_();
  var ev = sugestaoValida_(cfg, eventId, versaoVista);
  if (ev.start.date) throw new Error('Só dá para mover sugestão com horário.');
  var dur = Math.round((dataDoEvento_(ev.end) - dataDoEvento_(ev.start)) / 60000);
  return procurarLivres_(cfg, dur, 3, ev.id).map(function (d) { return d.toISOString(); });
}

function moverSugestao(eventId, versaoVista, novoInicioIso) {
  dono_(); validarId_(eventId); validarVersao_(versaoVista);
  if (typeof novoInicioIso !== 'string' || novoInicioIso.length > 40) throw new Error('Horário inválido.');
  var novoInicio = new Date(novoInicioIso);
  if (isNaN(novoInicio.getTime())) throw new Error('Horário inválido.');
  var cfg = config_();
  return comTrava_(function () {
    var ev = sugestaoValida_(cfg, eventId, versaoVista);
    var ini = dataDoEvento_(ev.start), duracaoMs = dataDoEvento_(ev.end) - ini;
    var ofertas = procurarLivres_(cfg, Math.round(duracaoMs / 60000), 3, ev.id).map(function (d) { return d.getTime(); });
    if (ofertas.indexOf(novoInicio.getTime()) < 0) throw new Error('Esse horário não está mais livre. Atualize.');
    if (cfg.modo !== 'real') {
      log_(cfg, 'mover', 'simular', ev, fmt_(novoInicio), 'simulado');
      return { ok: true, simulado: true, msg: 'Simulação: iria para ' + fmt_(novoInicio) + '.' };
    }
    Calendar.Events.patch({
      start: { dateTime: novoInicio.toISOString(), timeZone: TZ_ },
      end: { dateTime: new Date(novoInicio.getTime() + duracaoMs).toISOString(), timeZone: TZ_ }
    }, cfg.agendas.agenda_sugestoes, ev.id);
    limparCache_();
    log_(cfg, 'mover', 'real', ev, fmt_(novoInicio), 'ok');
    return { ok: true, simulado: false, msg: 'Movida para ' + fmt_(novoInicio) + '.' };
  });
}

/** Só leitura, para testar no editor (Executar > diagnostico). Mostra contagens, nunca conteúdo. */
function diagnostico() {
  var p = getPainel();
  var r = { modo: p.modo, versao: p.versao, eventosHoje: p.eventos.length, sugestoes: p.sugestoes.length,
    cardsHoje: p.cards.length, areas: p.areas.length, avisos: p.avisos.length };
  Logger.log(JSON.stringify(r));
  return r;
}

// ---------- Segurança ----------

/** Só a dona usa. Se um dia a implantação for aberta por engano, o app recusa todo mundo. */
function dono_() {
  var esperado = String(PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL') || '').toLowerCase();
  var quem = String(Session.getActiveUser().getEmail() || '').toLowerCase();
  if (!esperado || quem !== esperado) throw new Error('Acesso negado.');
}

function validarId_(id) {
  if (typeof id !== 'string' || !/^[A-Za-z0-9_]{5,200}$/.test(id)) throw new Error('Evento inválido.');
}
function validarVersao_(v) {
  if (typeof v !== 'string' || v.length > 40 || !/^[0-9TZ:.\-]+$/.test(v)) throw new Error('Versão inválida. Atualize.');
}

/** Texto seguro para planilha: nunca vira fórmula, número ou data. */
function celula_(v) {
  var s = String(v === null || v === undefined ? '' : v).replace(/[\r\n\t]+/g, ' ').slice(0, 300);
  if (/^[=+\-@]/.test(s) || /^\d/.test(s)) s = "'" + s;
  return s;
}

function comTrava_(fn) {
  var lock = LockService.getUserLock();
  if (!lock.tryLock(15000)) throw new Error('Outra ação em andamento. Tente de novo.');
  try { return fn(); } finally { lock.releaseLock(); }
}

/** A sugestão só pode ser mexida se passar por todas estas portas. */
function sugestaoValida_(cfg, eventId, versaoVista) {
  var ev = Calendar.Events.get(cfg.agendas.agenda_sugestoes, eventId);
  if (!ev || ev.status === 'cancelled') throw new Error('A sugestão não existe mais. Atualize.');
  if (!ehSugestao_(ev)) throw new Error('Esse evento não é uma sugestão do Claude: o app não mexe.');
  if (ev.updated !== versaoVista) throw new Error('O evento mudou desde que a tela abriu. Atualize.');
  return ev;
}

function ehSugestao_(e) {
  return !!e && !e.colorId && !e.recurringEventId && !e.recurrence &&
    e.organizer && e.organizer.self === true &&
    !(e.attendees && e.attendees.length) &&
    (!e.eventType || e.eventType === 'default') &&
    String(e.description || '').indexOf(MARCA_) >= 0 &&
    !PROTEGIDO_.test(normalizar_(e.summary));
}

// ---------- Configuração ----------

function config_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID'), entrada = props.getProperty('ENTRADA_ID');
  if (!id || !entrada) throw new Error('Faltam SHEET_ID ou ENTRADA_ID nas Propriedades do script.');
  var cache = CacheService.getUserCache();
  var guardado = cache.get('cfg_v2');
  var base;
  if (guardado) base = JSON.parse(guardado);
  else { base = lerConfig_(id); try { cache.put('cfg_v2', JSON.stringify(base), 300); } catch (e) {} }
  base.ss = SpreadsheetApp.openById(id);
  base.entradaId = entrada;
  base.modo = props.getProperty('MODO') === 'real' ? 'real' : 'simular';
  return base;
}

/** Lê Config e Areas e confere tudo: agendas e planilha de destino têm de ser da dona. */
function lerConfig_(id) {
  var ss = SpreadsheetApp.openById(id);
  var linhas = ss.getSheetByName('Config').getDataRange().getValues();
  var kv = {};
  for (var i = 1; i < linhas.length; i++) if (linhas[i][0]) kv[String(linhas[i][0]).trim()] = linhas[i][1];
  var agendas = {};
  CHAVES_AGENDA_.forEach(function (k) {
    var cal = String(kv[k] || '').trim();
    if (!cal) return;
    var info = Calendar.CalendarList.get(cal); // precisa estar na lista da dona
    if (!info || info.accessRole !== 'owner') throw new Error('A agenda ' + k + ' não é sua. O app parou por segurança.');
    agendas[k] = cal;
  });
  if (!agendas.agenda_sugestoes) throw new Error('Falta agenda_sugestoes na Config.');
  var naoFeitosId = String(kv.nao_feitos_id || '').trim();
  var dono = String(PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL') || '').toLowerCase();
  var nf = SpreadsheetApp.openById(naoFeitosId);
  if (!nf.getOwner() || String(nf.getOwner().getEmail()).toLowerCase() !== dono) throw new Error('A planilha de não feitos não é sua. O app parou por segurança.');
  var areasRaw = ss.getSheetByName('Areas').getDataRange().getValues();
  var areas = [];
  for (var j = 1; j < areasRaw.length; j++) {
    var a = areasRaw[j];
    var chave = String(a[1] || '').trim();
    if (!a[0] || DESTINOS_PERMITIDOS_.indexOf(chave) < 0 || !agendas[chave]) continue;
    var padrao = String(a[3] || '');
    if (padrao.length > 200) padrao = '';
    var cor = Number(a[2]), urg = Number(a[4]);
    areas.push({ area: String(a[0]).slice(0, 40), agendaChave: chave,
      colorId: cor >= 1 && cor <= 11 ? cor : null, padrao: padrao, colorUrgente: urg >= 1 && urg <= 11 ? urg : null });
  }
  var lim = function (v, a, b, d) { v = Number(v); return v >= a && v <= b ? v : d; };
  return {
    agendas: agendas, areas: areas, naoFeitosId: naoFeitosId,
    livreIni: lim(kv.livre_inicio_h, 6, 22, 9), livreFim: lim(kv.livre_fim_h, 7, 23, 21),
    cacheMin: lim(kv.cache_min, 1, 30, 5), diasSug: lim(kv.dias_sugestoes, 1, 21, 14),
    versao: String(kv.versao || '').slice(0, 40)
  };
}

// ---------- Leitura ----------

function listarTodos_(calId, opcoes) {
  var itens = [], token = null, voltas = 0;
  do {
    var o = JSON.parse(JSON.stringify(opcoes));
    if (token) o.pageToken = token;
    var r = Calendar.Events.list(calId, o);
    itens = itens.concat(r.items || []);
    token = r.nextPageToken;
  } while (token && ++voltas < 10);
  return itens;
}

function listarSugestoes_(cfg) {
  var agora = new Date();
  try {
    var itens = listarTodos_(cfg.agendas.agenda_sugestoes, {
      timeMin: new Date(agora.getTime() - 86400000).toISOString(),
      timeMax: new Date(agora.getTime() + cfg.diasSug * 86400000).toISOString(),
      singleEvents: true, orderBy: 'startTime', maxResults: 250 });
  } catch (e) { return { lista: [], falhas: ['As sugestões não carregaram agora.'] }; }
  return { falhas: [], lista: itens.filter(ehSugestao_).map(function (e) {
    return { id: e.id, versao: e.updated, titulo: String(e.summary || '(sem título)').slice(0, 200),
      inicio: e.start.dateTime || e.start.date, fim: e.end.dateTime || e.end.date,
      diaInteiro: !!e.start.date, area: areaSugerida_(cfg, e.summary) };
  }) };
}

function eventosDoDia_(cfg, agora) {
  var cache = CacheService.getUserCache();
  var chave = 'eventos_' + Utilities.formatDate(agora, TZ_, 'yyyyMMdd');
  var guardado = cache.get(chave);
  if (guardado) return JSON.parse(guardado);
  var ini = inicioDoDia_(agora), fim = new Date(ini.getTime() + 86400000);
  var nomes = { agenda_sugestoes: 'Sugestões', agenda_faculdade: 'Faculdade', agenda_carreira: 'Carreira', agenda_bemestar: 'Bem-estar',
    agenda_social: 'Social', agenda_projetos: 'Projetos', agenda_feriado: 'Feriado', agenda_visualizacao: 'Visualização' };
  var lista = [], falhas = [];
  Object.keys(cfg.agendas).forEach(function (k) {
    try {
      listarTodos_(cfg.agendas[k], { timeMin: ini.toISOString(), timeMax: fim.toISOString(), singleEvents: true, orderBy: 'startTime', maxResults: 250 })
        .forEach(function (e) {
          if (e.status === 'cancelled') return;
          lista.push({ agenda: k, agendaNome: nomes[k] || k, titulo: String(e.summary || '(sem título)').slice(0, 200),
            inicio: e.start.dateTime || e.start.date, fim: e.end.dateTime || e.end.date, diaInteiro: !!e.start.date,
            colorId: e.colorId || '', livre: e.transparency === 'transparent', sugestao: k === 'agenda_sugestoes' && ehSugestao_(e) });
        });
    } catch (err) { falhas.push('A agenda ' + (nomes[k] || k) + ' não carregou: o dia pode estar incompleto.'); }
  });
  lista.sort(function (a, b) { return String(a.inicio).localeCompare(String(b.inicio)); });
  var r = { eventos: lista, falhas: falhas };
  if (!falhas.length) { try { cache.put(chave, JSON.stringify(r), cfg.cacheMin * 60); } catch (e) {} }
  return r;
}

function cardsDeHoje_(cfg, agora) {
  var linhas;
  try { linhas = SpreadsheetApp.openById(cfg.entradaId).getSheetByName('Hoje').getDataRange().getValues(); }
  catch (e) { return []; }
  var hoje = Utilities.formatDate(agora, TZ_, 'yyyy-MM-dd'), out = [];
  for (var i = 1; i < linhas.length && out.length < 20; i++) {
    var l = linhas[i];
    var d = l[0] instanceof Date ? Utilities.formatDate(l[0], TZ_, 'yyyy-MM-dd') : String(l[0]).trim();
    var tipo = String(l[1]).trim();
    if (d !== hoje || TIPOS_CARD_.indexOf(tipo) < 0) continue;
    var link = String(l[4] || '').trim();
    var dominio = '';
    if (LINK_OK_.test(link)) dominio = link.replace(/^https:\/\//i, '').split('/')[0].toLowerCase(); else link = '';
    out.push({ tipo: tipo, texto: String(l[2]).slice(0, 300), detalhe: String(l[3] || '').slice(0, 300), link: link, dominio: dominio, ordem: Number(l[5]) || 99 });
  }
  out.sort(function (a, b) { return a.ordem - b.ordem; });
  return out;
}

function cargaDoDia_(eventos, agora) {
  var ini = inicioDoDia_(agora);
  var jIni = ini.getTime() + 7 * 3600000, jFim = ini.getTime() + 23 * 3600000;
  var ocupado = 0, sug = 0;
  eventos.forEach(function (e) {
    if (e.diaInteiro || e.livre) return;
    var m = Math.max(0, (Math.min(new Date(e.fim).getTime(), jFim) - Math.max(new Date(e.inicio).getTime(), jIni)) / 60000);
    if (e.sugestao) sug += m; else ocupado += m;
  });
  var total = (jFim - jIni) / 60000;
  return { ocupadoH: round1_(ocupado / 60), sugestoesH: round1_(sug / 60), janelaH: round1_(total / 60), cheio: (ocupado + sug) > total * 0.85 };
}

/** Horários livres em todas as agendas. Se qualquer agenda falhar, não oferece nada (falha fechada). */
function procurarLivres_(cfg, duracaoMin, quantos, ignorarId) {
  var agora = new Date(), passo = 30 * 60000;
  var t0 = Math.ceil((agora.getTime() + 30 * 60000) / passo) * passo, limite = agora.getTime() + 7 * 86400000;
  var ocupados = [];
  Object.keys(cfg.agendas).forEach(function (k) {
    var itens;
    try { itens = listarTodos_(cfg.agendas[k], { timeMin: agora.toISOString(), timeMax: new Date(limite).toISOString(), singleEvents: true, maxResults: 250 }); }
    catch (err) { throw new Error('Uma agenda não carregou; não dá para garantir horário livre agora.'); }
    itens.forEach(function (e) {
      if (e.status === 'cancelled' || e.start.date || e.transparency === 'transparent' || e.id === ignorarId) return;
      ocupados.push([new Date(e.start.dateTime).getTime(), new Date(e.end.dateTime).getTime()]);
    });
  });
  var achados = [];
  for (var t = t0; t < limite && achados.length < quantos; t += passo) {
    var d = new Date(t);
    var h = Number(Utilities.formatDate(d, TZ_, 'H')) + Number(Utilities.formatDate(d, TZ_, 'm')) / 60;
    if (h < cfg.livreIni || h + duracaoMin / 60 > cfg.livreFim) continue;
    var fimT = t + duracaoMin * 60000;
    if (!ocupados.some(function (o) { return o[0] < fimT && o[1] > t; })) { achados.push(d); t += 3 * 3600000 - passo; }
  }
  return achados;
}

// ---------- Utilidades ----------

function normalizar_(s) {
  return String(s || '').slice(0, 200).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function areaSugerida_(cfg, titulo) {
  var t = normalizar_(titulo), bruto = String(titulo || '').slice(0, 200);
  for (var i = 0; i < cfg.areas.length; i++) {
    var p = cfg.areas[i].padrao;
    if (!p) continue;
    try { var re = new RegExp(p, 'i'); if (re.test(t) || re.test(bruto)) return cfg.areas[i].area; } catch (e) {}
  }
  return null;
}

function escolherCor_(area, titulo) {
  if (area.colorUrgente && /prazo/.test(normalizar_(titulo))) return area.colorUrgente;
  return area.colorId;
}

function tipoDaSugestao_(titulo) {
  var t = normalizar_(titulo);
  if (String(titulo).indexOf('🎯') >= 0 || /entrevista|inscri|processo/.test(t)) return 'carreira';
  if (/estudo|revisao|lista|exercicio|simulado/.test(t)) return 'estudo';
  return 'ação';
}

/** Log com o necessário para desfazer à mão: id, início e fim originais. Nada de descrição. */
function log_(cfg, acao, modo, ev, para, resultado) {
  try {
    cfg.ss.getSheetByName('Log').appendRow([
      Utilities.formatDate(new Date(), TZ_, 'yyyy-MM-dd HH:mm:ss'), acao, modo, ev.summary, ev.id,
      (ev.start.dateTime || ev.start.date) + ' a ' + (ev.end.dateTime || ev.end.date), para, resultado
    ].map(celula_));
  } catch (e) { /* o log nunca derruba a ação já feita */ }
}

function limparCache_() {
  try { CacheService.getUserCache().remove('eventos_' + Utilities.formatDate(new Date(), TZ_, 'yyyyMMdd')); } catch (e) {}
}

function inicioDoDia_(d) { return new Date(Utilities.formatDate(d, TZ_, "yyyy-MM-dd'T'00:00:00XXX")); }
function dataDoEvento_(x) { return x ? new Date(x.dateTime || x.date) : null; }
function hojeTexto_() { return Utilities.formatDate(new Date(), TZ_, 'dd/MM/yyyy'); }
function fmt_(d) { return Utilities.formatDate(d, TZ_, 'dd/MM HH:mm'); }
function round1_(n) { return Math.round(n * 10) / 10; }
