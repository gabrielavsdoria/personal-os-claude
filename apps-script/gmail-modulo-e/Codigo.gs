/**
 * Módulo E do Gmail · versão pública da v1 (25/10/2026)
 * Remetentes, empresas e IDs reais foram trocados por exemplos; a lógica é a mesma.
 * Regras de classificação: skill triagem-email.
 * Só usa o serviço avançado Gmail (sem GmailApp). Nunca apaga e nunca manda para a lixeira.
 * Cada passo tem _simular (só lê e escreve na planilha) e _executar (muda o Gmail).
 * Log: aba "Execuções" da planilha de registro.
 * O id da planilha fica fora do código: Propriedades do script › REGISTRO_ID.
 */

const EG_SHEET_ID = PropertiesService.getScriptProperties().getProperty('REGISTRO_ID');
const EG_ABA_REMET = 'E1 - remetentes';
const EG_ABA_DESC = 'E4 - descadastro';
const EG_ABA_ARQ = 'E5 - arquivar';
const EG_DIAS = 60;
const EG_ROTULOS = ['Faculdade', 'Estágio', 'Serviços', 'Compras', 'Newsletters', 'Responder', 'Descadastrar'];
const EG_CATS_AUTO = ['Faculdade', 'Estágio', 'Serviços', 'Compras', 'Newsletters']; // aplicadas por remetente
const EG_ARQUIVAR = ['Newsletters', 'Compras'];
const EG_DESCADASTRO_LISTA = ['loja-exemplo', 'newsletter-exemplo', 'eventos-exemplo']; // remetentes que a pessoa escolheu descadastrar
const EG_GENERICOS = ['gmail.com', 'googlemail.com', 'hotmail.com', 'outlook.com', 'live.com', 'yahoo.com', 'yahoo.com.br', 'icloud.com', 'uol.com.br', 'bol.com.br', 'terra.com.br'];

// Regras por remetente/domínio (ordem importa: a primeira que bater vence)
const EG_REGRAS = [
  ['Faculdade', /(@|\.)universidade\.edu\b|moodle|classroom\.google\.com/],
  ['Estágio', /gupy|ciadetalentos|ciadeestagios|jobalerts-noreply@linkedin|jobs-listings@linkedin|jobs-noreply@linkedin|kolab|inhire|workday|jobconvo|eureca|99jobs|vagas\.com|glassdoor|indeed|recrut|recruit|carreiras|careers/],
  ['Serviços', /agendamento|reserva|atendimento|confirmacao de horario/],
  ['Compras', /pedido|order|receipt|recibo|nota-?fiscal|nfe|rastreio|entrega/]
];

/* ============ util ============ */

function eg_ss_() { return SpreadsheetApp.openById(EG_SHEET_ID); }

function eg_log_(funcao, dry, resumo) {
  const sh = eg_ss_().getSheetByName('Execuções');
  sh.appendRow([Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss'), funcao, dry, resumo]);
}

function eg_tab_(nome, cab, linhas) {
  const ss = eg_ss_();
  const sh = ss.getSheetByName(nome) || ss.insertSheet(nome);
  sh.clearContents();
  sh.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold');
  if (linhas.length) sh.getRange(2, 1, linhas.length, cab.length).setValues(linhas);
  sh.setFrozenRows(1);
  return sh;
}

function eg_lerTab_(nome) {
  const sh = eg_ss_().getSheetByName(nome);
  if (!sh) throw new Error('Aba "' + nome + '" não existe. Rode a simulação antes.');
  const v = sh.getDataRange().getValues();
  const cab = v.shift();
  return v.map(l => { const o = {}; cab.forEach((c, i) => o[c] = l[i]); return o; });
}

function eg_header_(msg, nome) {
  const h = (msg.payload && msg.payload.headers) || [];
  const x = h.find(k => k.name.toLowerCase() === nome.toLowerCase());
  return x ? x.value : '';
}

/** messages.get com pausa e novas tentativas (limite de cota por minuto do Gmail). */
function eg_get_(id, opts) {
  for (let t = 1; t <= 8; t++) {
    try { Utilities.sleep(120); return Gmail.Users.Messages.get('me', id, opts); }
    catch (e) {
      if (!/quota|rate|limit/i.test(String(e)) || t === 8) throw e;
      Utilities.sleep(15000 * t);
    }
  }
}

function eg_parseFrom_(from) {
  const m = from.match(/^\s*"?([^"<]*)"?\s*<([^>]+)>/);
  if (m) return { nome: m[1].trim(), email: m[2].trim().toLowerCase() };
  return { nome: '', email: from.trim().toLowerCase() };
}

function eg_dominio_(email) { return (email.split('@')[1] || '').toLowerCase(); }

function eg_classificar_(email, nome, temListUnsub) {
  const alvo = (email + ' ' + nome).toLowerCase();
  for (const [cat, re] of EG_REGRAS) if (re.test(alvo)) return cat;
  if (temListUnsub) return 'Newsletters';
  if (/no-?reply|news|newsletter|marketing|promo|ofertas|mailer|notifica|info@|comunicado/.test(email)) return 'Newsletters';
  return ''; // sem rótulo: provável pessoa real
}

function eg_listarIds_(q, labelIds, max) {
  const ids = [];
  let token;
  do {
    const r = Gmail.Users.Messages.list('me', { q: q, labelIds: labelIds, maxResults: 500, pageToken: token });
    (r.messages || []).forEach(m => ids.push(m.id));
    token = r.nextPageToken;
  } while (token && ids.length < (max || 100000));
  return ids;
}

function eg_modificar_(ids, add, remove) {
  for (let i = 0; i < ids.length; i += 1000) {
    Gmail.Users.Messages.batchModify({ ids: ids.slice(i, i + 1000), addLabelIds: add || [], removeLabelIds: remove || [] }, 'me');
  }
}

function eg_mapaRotulos_() {
  const m = {};
  (Gmail.Users.Labels.list('me').labels || []).forEach(l => m[l.name] = l.id);
  return m;
}

/** Junta critérios "from" em blocos de até ~400 caracteres. */
function eg_blocosFrom_(itens) {
  const blocos = []; let atual = [];
  itens.forEach(it => {
    if ((atual.concat(it)).join(' OR ').length > 400 && atual.length) { blocos.push(atual); atual = []; }
    atual.push(it);
  });
  if (atual.length) blocos.push(atual);
  return blocos;
}

/** Categoria final de cada remetente (coluna "categoria final" vence a proposta). */
function eg_categoriasAprovadas_() {
  const porCat = {}; EG_CATS_AUTO.forEach(c => porCat[c] = []);
  // Agrupa por domínio só quando TODOS os remetentes do domínio (inclusive os sem rótulo) caem na mesma categoria
  const dom2cat = {};
  eg_lerTab_(EG_ABA_REMET).forEach(r => {
    const fin = String(r['categoria final'] || '').trim();
    const cat = fin ? fin : String(r['categoria proposta'] || '').trim();
    const e = String(r['remetente']).trim();
    const d = eg_dominio_(e); (dom2cat[d] = dom2cat[d] || new Set()).add(porCat[cat] ? cat : 'nenhum');
    if (fin === '-' || !porCat[cat]) return;
    porCat[cat].push(e);
  });
  const crit = {};
  Object.keys(porCat).forEach(c => {
    const s = new Set();
    porCat[c].forEach(e => {
      const d = eg_dominio_(e);
      if (d && EG_GENERICOS.indexOf(d) < 0 && dom2cat[d].size === 1) s.add('@' + d); else s.add(e);
    });
    crit[c] = Array.from(s).sort();
  });
  return crit;
}

/* ============ E1 · mapa de remetentes (só leitura) ============ */
// Roda em partes: se passar de ~4,5 min, salva o progresso e pede para rodar de novo.

function E1_mapaRemetentes_simular() {
  const t0 = Date.now();
  const cache = CacheService.getScriptCache();
  let estado = JSON.parse(cache.get('E1') || 'null') || { token: null, agg: {}, lidas: 0 };
  let fim = false;
  while (Date.now() - t0 < 270000) {
    const r = Gmail.Users.Messages.list('me', { q: 'newer_than:' + EG_DIAS + 'd -in:sent -in:chats -in:draft', maxResults: 100, pageToken: estado.token });
    for (const m of (r.messages || [])) {
      const msg = eg_get_(m.id, { format: 'metadata', metadataHeaders: ['From', 'List-Unsubscribe', 'List-Unsubscribe-Post'] });
      const f = eg_parseFrom_(eg_header_(msg, 'From'));
      const a = estado.agg[f.email] || (estado.agg[f.email] = { n: f.nome, q: 0, nl: 0, lu: 0, oc: 0 });
      a.q++; estado.lidas++;
      if ((msg.labelIds || []).indexOf('UNREAD') >= 0) a.nl++;
      if (eg_header_(msg, 'List-Unsubscribe')) a.lu = 1;
      if (/one-click/i.test(eg_header_(msg, 'List-Unsubscribe-Post'))) a.oc = 1;
    }
    estado.token = r.nextPageToken || null;
    cache.put('E1', JSON.stringify(estado), 21600);
    if (!estado.token) { fim = true; break; }
  }
  if (!fim) {
    cache.put('E1', JSON.stringify(estado), 21600);
    eg_log_('E1_mapaRemetentes_simular', true, 'parcial: ' + estado.lidas + ' e-mails lidos; rodar de novo para continuar');
    Logger.log('PARCIAL: ' + estado.lidas + ' e-mails. Rode de novo.');
    return;
  }
  cache.remove('E1');
  const linhas = Object.keys(estado.agg).map(e => {
    const a = estado.agg[e];
    const cat = eg_classificar_(e, a.n, a.lu);
    const desc = EG_DESCADASTRO_LISTA.some(k => (e + ' ' + a.n).toLowerCase().indexOf(k) >= 0) ? 'lista inicial' :
      (cat === 'Newsletters' && a.q >= 3 && a.nl === a.q ? 'sugerido (nunca abriu)' : '');
    return [e, a.n, eg_dominio_(e), a.q, a.nl, a.lu ? 'sim' : 'não', a.oc ? 'sim' : 'não', cat, '', desc];
  }).sort((x, y) => y[3] - x[3]);
  eg_tab_(EG_ABA_REMET, ['remetente', 'nome', 'domínio', 'qtd 60d', 'não lidas', 'tem descadastro', 'descadastro 1 clique', 'categoria proposta', 'categoria final', 'descadastrar?'], linhas);
  const cont = {}; linhas.forEach(l => cont[l[7] || 'sem rótulo'] = (cont[l[7] || 'sem rótulo'] || 0) + l[3]);
  const res = estado.lidas + ' e-mails, ' + linhas.length + ' remetentes · ' + Object.keys(cont).map(k => k + ' ' + cont[k]).join(', ');
  eg_log_('E1_mapaRemetentes_simular', true, res);
  Logger.log(res);
}

/* ============ E2 · rótulos + aplicar 60 dias ============ */

function E2_rotulos_simular() { eg_rotulos_(true); }
function E2_rotulos_executar() { eg_rotulos_(false); }

function eg_rotulos_(dry) {
  const t0 = Date.now();
  let mapa = eg_mapaRotulos_();
  const feito = [];
  // 1. Oportunidades -> Estágio (renomeia: mantém histórico e o filtro antigo)
  if (mapa['Oportunidades'] && !mapa['Estágio']) {
    feito.push('renomear Oportunidades → Estágio');
    if (!dry) Gmail.Users.Labels.patch({ name: 'Estágio' }, 'me', mapa['Oportunidades']);
  }
  if (!dry) mapa = eg_mapaRotulos_();
  // 2. Criar os que faltam
  EG_ROTULOS.forEach(n => {
    if (mapa[n] || (n === 'Estágio' && mapa['Oportunidades'])) return;
    feito.push('criar ' + n);
    if (!dry) Gmail.Users.Labels.create({ name: n, labelListVisibility: 'labelShow', messageListVisibility: 'show' }, 'me');
  });
  if (!dry) mapa = eg_mapaRotulos_();
  const id = n => mapa[n] || (n === 'Estágio' ? mapa['Oportunidades'] : null);
  // 3. Inscrições antigas (processos seletivos) também em Estágio; Inscrições fica como histórico
  if (mapa['Inscrições']) {
    const ids = eg_listarIds_('from:(gupy.com.br)', [mapa['Inscrições']]);
    feito.push('Inscrições → +Estágio: ' + ids.length);
    if (!dry && ids.length) eg_modificar_(ids, [id('Estágio')]);
  }
  // 4. Aplicar por remetente nos últimos 60 dias
  const crit = eg_categoriasAprovadas_();
  Object.keys(crit).forEach(cat => {
    let total = 0;
    eg_blocosFrom_(crit[cat]).forEach(bloco => {
      const ids = eg_listarIds_('newer_than:' + EG_DIAS + 'd -in:sent from:(' + bloco.join(' OR ') + ')');
      total += ids.length;
      if (!dry && ids.length) eg_modificar_(ids, [id(cat)]);
    });
    feito.push(cat + ': ' + total + ' e-mails (' + crit[cat].length + ' remetentes/domínios)');
  });
  const res = feito.join(' | ') + ' · ' + Math.round((Date.now() - t0) / 1000) + 's';
  eg_log_(dry ? 'E2_rotulos_simular' : 'E2_rotulos_executar', dry, res);
  Logger.log(res);
}

/* ============ E3 · filtros automáticos ============ */

function E3_filtros_simular() { eg_filtros_(true); }
function E3_filtros_executar() { eg_filtros_(false); }

function eg_filtros_(dry) {
  const mapa = eg_mapaRotulos_();
  const existentes = new Set((((Gmail.Users.Settings.Filters.list('me') || {}).filter) || []).map(f => (f.criteria && f.criteria.from) || ''));
  const crit = eg_categoriasAprovadas_();
  const feito = [];
  Object.keys(crit).forEach(cat => {
    const idRot = mapa[cat] || (cat === 'Estágio' ? mapa['Oportunidades'] : null);
    eg_blocosFrom_(crit[cat]).forEach(bloco => {
      const from = bloco.join(' OR ');
      if (existentes.has(from)) { feito.push(cat + ': já existe'); return; }
      feito.push(cat + ': ' + bloco.length + ' remetentes');
      if (!dry) {
        if (!idRot) throw new Error('Rótulo ' + cat + ' não existe: rode E2_rotulos_executar antes.');
        Gmail.Users.Settings.Filters.create({ criteria: { from: from }, action: { addLabelIds: [idRot] } }, 'me');
      }
    });
  });
  const res = feito.length + ' filtros · ' + feito.join(' | ');
  eg_log_(dry ? 'E3_filtros_simular' : 'E3_filtros_executar', dry, res);
  Logger.log(res);
}

/* ============ E4 · descadastro de um clique ============ */

function E4_descadastro_simular() {
  const linhas = [];
  const vistos = {};
  EG_DESCADASTRO_LISTA.forEach(k => {
    const r = Gmail.Users.Messages.list('me', { q: 'from:' + k + ' newer_than:400d -in:sent', maxResults: 50 });
    (r.messages || []).forEach(m => {
      const msg = eg_get_(m.id, { format: 'metadata', metadataHeaders: ['From', 'Subject', 'Date', 'List-Unsubscribe', 'List-Unsubscribe-Post', 'Authentication-Results'] });
      const f = eg_parseFrom_(eg_header_(msg, 'From'));
      if (vistos[f.email]) return; // a lista vem do mais novo para o mais antigo
      vistos[f.email] = 1;
      const lu = eg_header_(msg, 'List-Unsubscribe');
      const post = eg_header_(msg, 'List-Unsubscribe-Post');
      const https = (lu.match(/<(https:[^>]+)>/i) || [])[1] || '';
      const mailto = (lu.match(/<(mailto:[^>]+)>/i) || [])[1] || '';
      const auth = eg_header_(msg, 'Authentication-Results');
      const dkimD = ((auth.match(/dkim=pass[^;]*header\.(?:d|i)=@?([a-z0-9.-]+)/i) || [])[1] || '').toLowerCase();
      const dom = eg_dominio_(f.email);
      const alinhado = dkimD && (dom === dkimD || dom.endsWith('.' + dkimD) || dkimD.endsWith('.' + dom));
      let um = 'não', motivo;
      if (!lu) motivo = 'sem cabeçalho de descadastro: abrir o e-mail e clicar';
      else if (!https || !/one-click/i.test(post)) motivo = mailto ? 'só descadastro por e-mail: clicar no Gmail' : 'sem um clique: abrir o link';
      else if (!alinhado) motivo = 'autenticidade não confirmada (DKIM): clicar você mesma';
      else { um = 'sim'; motivo = 'pronto para um clique'; }
      linhas.push([f.email, f.nome, k, eg_header_(msg, 'Date'), eg_header_(msg, 'Subject').slice(0, 80), um, motivo,
        'https://mail.google.com/mail/u/0/#all/' + m.id, um === 'sim' ? https : (https || mailto), 'sim', '']);
    });
  });
  eg_tab_(EG_ABA_DESC, ['remetente', 'nome', 'palavra', 'último e-mail', 'assunto', '1 clique', 'motivo', 'abrir no Gmail', 'link de descadastro', 'aprovar?', 'resultado'], linhas);
  const n1 = linhas.filter(l => l[5] === 'sim').length;
  const res = linhas.length + ' remetentes · ' + n1 + ' com um clique · ' + (linhas.length - n1) + ' para clicar';
  eg_log_('E4_descadastro_simular', true, res);
  Logger.log(res);
}

function E4_descadastro_executar() {
  const sh = eg_ss_().getSheetByName(EG_ABA_DESC);
  const v = sh.getDataRange().getValues(); const cab = v[0];
  const c = n => cab.indexOf(n);
  const mapa = eg_mapaRotulos_();
  let ok = 0, falha = 0, lista = 0;
  for (let i = 1; i < v.length; i++) {
    const l = v[i];
    if (String(l[c('aprovar?')]).toLowerCase() !== 'sim' || l[c('resultado')]) continue;
    const email = l[c('remetente')];
    let resultado;
    if (l[c('1 clique')] === 'sim') {
      const resp = UrlFetchApp.fetch(l[c('link de descadastro')], { method: 'post', contentType: 'application/x-www-form-urlencoded', payload: 'List-Unsubscribe=One-Click', muteHttpExceptions: true, followRedirects: true });
      const code = resp.getResponseCode();
      if (code >= 200 && code < 300) { ok++; resultado = 'descadastrado (HTTP ' + code + ')'; } else { falha++; resultado = 'falhou (HTTP ' + code + '): clicar você mesma'; }
    } else { lista++; resultado = 'na lista para clicar'; }
    const ids = eg_listarIds_('from:' + email, null, 500);
    if (ids.length && mapa['Descadastrar']) eg_modificar_(ids, [mapa['Descadastrar']]);
    sh.getRange(i + 1, c('resultado') + 1).setValue(resultado + ' · ' + Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM HH:mm'));
  }
  const res = 'um clique ok ' + ok + ', falhas ' + falha + ', para clicar ' + lista;
  eg_log_('E4_descadastro_executar', false, res);
  Logger.log(res);
}

/* ============ E5 · arquivar Newsletters e Compras > 7 dias ============ */

function E5_arquivar_simular() { eg_arquivar_(true); }
function E5_arquivar_executar() { eg_arquivar_(false); }

function eg_arquivar_(dry) {
  const mapa = eg_mapaRotulos_();
  const linhas = []; const feito = [];
  EG_ARQUIVAR.forEach(cat => {
    if (!mapa[cat]) { feito.push(cat + ': rótulo não existe'); return; }
    const ids = eg_listarIds_('older_than:7d -is:starred', [mapa[cat], 'INBOX']);
    feito.push(cat + ': ' + ids.length);
    if (dry) {
      ids.slice(0, 40).forEach(id => {
        const m = eg_get_(id, { format: 'metadata', metadataHeaders: ['From', 'Subject', 'Date'] });
        linhas.push([cat, eg_header_(m, 'Date'), eg_parseFrom_(eg_header_(m, 'From')).email, eg_header_(m, 'Subject').slice(0, 90)]);
      });
      linhas.push([cat, 'total', ids.length + ' e-mails', '(amostra dos 40 mais novos acima)']);
    } else if (ids.length) {
      eg_modificar_(ids, [], ['INBOX']);
    }
  });
  if (dry) eg_tab_(EG_ABA_ARQ, ['categoria', 'data', 'remetente', 'assunto'], linhas);
  const res = (dry ? 'a arquivar · ' : 'arquivados · ') + feito.join(' | ') + ' (sem estrela, mais de 7 dias, continuam no rótulo)';
  eg_log_(dry ? 'E5_arquivar_simular' : 'E5_arquivar_executar', dry, res);
  Logger.log(res);
}
