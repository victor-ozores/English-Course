(function () {
'use strict';
/* ===== utilidades ===== */
function h(tag, props) {
  var e = document.createElement(tag);
  props = props || {};
  Object.keys(props).forEach(function (k) {
    var v = props[k];
    if (v === false || v == null) return;
    if (k === 'class') e.className = v;
    else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, '');
    else e.setAttribute(k, v);
  });
  for (var i = 2; i < arguments.length; i++) {
    [].concat(arguments[i]).forEach(function (c) { if (c != null && c !== false) e.append(c); });
  }
  return e;
}
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function norm(s) { return String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function words(s) { var n = norm(s); return n ? n.split(' ') : []; }
function diff(a, b) {
  var n = a.length, m = b.length, d = [], i, j;
  for (i = 0; i <= n; i++) d.push(new Array(m + 1).fill(0));
  for (i = 1; i <= n; i++) for (j = 1; j <= m; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
  var ma = new Array(n).fill(false), mb = new Array(m).fill(false); i = n; j = m;
  while (i > 0 && j > 0) { if (a[i - 1] === b[j - 1]) { ma[i - 1] = mb[j - 1] = true; i--; j--; } else if (d[i - 1][j] >= d[i][j - 1]) i--; else j--; }
  return { ma: ma, mb: mb, lcs: d[n][m] };
}
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function uniq(pairs) { var seen = {}, out = []; pairs.forEach(function (p) { if (!seen[p[0]]) { seen[p[0]] = 1; out.push(p); } }); return out; }
function pick(a, n) { return shuffle(a).slice(0, n); }
function single(w) { return /^[A-Za-z']+$/.test(w); }
var ICO = {
  chevR: '<path d="M9 5l7 7-7 7"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
  spk: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  stop: '<rect x="7" y="7" width="10" height="10" rx="2"/>',
  flag: '<path d="M5 21V4M5 4h12l-2.5 4L17 12H5"/>', book: '<path d="M5 4h13v15H7a2 2 0 0 0-2 2z"/><path d="M5 21V4M9 9h5"/>',
  bolt: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>', chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  lines: '<path d="M4 6h16M4 12h16M4 18h10"/>', chat2: '<path d="M3 4h12v8H8l-3 3v-3H3z"/><path d="M10 15v2h6l3 3v-3h2V9h-3"/>',
  target: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>', pencil: '<path d="M4 20l1-4L16 5l3 3L8 19z"/>',
  move: '<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  redo: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>', cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c2 2 10 2 12 0v-4.5"/>'
};
function ico(n, size) {
  var s = document.createElement('span'); s.className = 'ico';
  s.innerHTML = '<svg viewBox="0 0 24 24" width="' + (size || 22) + '" height="' + (size || 22) + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICO[n] + '</svg>';
  return s;
}
function ring(pct, o) {
  o = o || {};
  var c = 2 * Math.PI * 30, s = document.createElement('span'); s.className = 'ring' + (o.big ? ' big' : '');
  s.innerHTML = '<svg viewBox="0 0 72 72" width="100%" height="100%"><circle cx="36" cy="36" r="30" fill="none" stroke="' + (o.track || 'var(--line)') + '" stroke-width="8"/><circle cx="36" cy="36" r="30" fill="none" stroke="' + (o.color || 'var(--ok)') + '" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - pct)).toFixed(1) + '" transform="rotate(-90 36 36)"/></svg><b>' + (o.label != null ? o.label : Math.round(pct * 100) + '%') + '</b>';
  return s;
}
/* texto rico: **negrito** e {{inglês|português}} (toque = ouvir + tradução) */
function rich(s, tag) {
  var e = h(tag || 'span');
  String(s).split(/(\{\{.+?\}\})/).forEach(function (part) {
    var m = part.match(/^\{\{(.+?)\|(.+?)\}\}$/);
    if (m) {
      var sp = h('span', { class: 'tr', tabindex: '0', role: 'button', 'data-pt': m[2].replace(/\*\*/g, ''), 'data-en': m[1].replace(/\*\*/g, '') });
      sp.textContent = m[1].replace(/\*\*/g, ''); e.append(sp);
    } else {
      var t = document.createElement('span');
      t.innerHTML = esc(part).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
      e.append.apply(e, [].slice.call(t.childNodes));
    }
  });
  return e;
}

/* ===== dados ===== */
var KEYS = { objetivo: 1, porque: 1, historia: 1, dica: 1, cena: 1, gancho: 1, resumo: 1, formula: 1, compare: 1, ex: 1, erro: 1, cuidado: 1, quiz: 1 };
var BOOKS = [], UNITS = {}, GL = { w: [], s: [], v: [] }, PT = {}, SOFTW = [];
function parseUnit(book, fname, text) {
  var u = { id: book + ':' + fname.replace(/^\d+-[a-z]-/, ''), file: fname, book: book, titulo: '', tipo: 'modulo', num: 0, notas: {}, secs: {}, lessons: [] };
  var cur = u, cs = null, last = null;
  text.split('\n').forEach(function (raw) {
    if (!raw.trim()) { last = null; return; }
    if (raw.slice(0, 2) === '  ' && last) { last.o[last.k] += '\n' + raw.trim(); return; }
    var l = raw.trim(), m;
    last = null;
    if (l.slice(0, 2) === '# ') {
      var p = l.slice(2).split(' | '); u.titulo = p[0];
      m = (p[1] || '').match(/^(\w+)\s*(\d*)/); u.tipo = m ? m[1] : 'modulo'; u.num = m && m[2] ? +m[2] : 0;
    } else if (l[0] === '[' && l[l.length - 1] === ']') { cs = l.slice(1, -1); u.secs[cs] = []; cur = u; }
    else if (l[0] === '=') {
      m = l.match(/^=(\S+)\s+(.*)$/);
      cur = { kind: m[1], titulo: m[2], ex: [], erros: [], quiz: [] }; u.lessons.push(cur); cs = null;
    } else if ((m = l.match(/^(nota [a-z]+|[a-z]+): ?(.*)$/)) && (KEYS[m[1]] || m[1].slice(0, 5) === 'nota ')) {
      var k = m[1], v = m[2], c;
      if (k === 'ex') cur.ex.push(v.split(' | '));
      else if (k === 'erro') { c = v.split(' | '); cur.erros.push({ wrong: c[0], right: c[1], pt: c[2], why: c[3] }); }
      else if (k === 'quiz') { c = v.split(' | '); cur.quiz.push({ q: c[0], a: c[1], opts: (c[2] || '').split('; ') }); }
      else if (k.slice(0, 5) === 'nota ') { u.notas[k.slice(5)] = v; last = { o: u.notas, k: k.slice(5) }; }
      else { cur[k] = v; last = { o: cur, k: k }; }
    } else if (cs && l.indexOf(' | ') > 0) u.secs[cs].push(l.split(' | ').map(function (x) { return x.trim(); }));
  });
  return u;
}
function loadBooks() {
  var D = window.__DADOS || {};
  Object.keys(D).forEach(function (id) {
    var b = { id: id, nome: D[id].nome, units: [] };
    Object.keys(D[id].files).sort().forEach(function (f) { var u = parseUnit(id, f, D[id].files[f]); b.units.push(u); UNITS[u.id] = u; });
    BOOKS.push(b);
  });
  Object.keys(UNITS).forEach(function (id) {
    var u = UNITS[id];
    ['aquecimento', 'palavras', 'verbos', 'expressoes', 'frases', 'perguntas', 'extras', 'resumo', 'apoio'].forEach(function (s) {
      (u.secs[s] || []).forEach(function (p) {
        if (!PT[p[0]]) PT[p[0]] = p[1];
        (words(p[0]).length >= 3 ? GL.s : GL.w).push([p[0], p[1]]);
        if (s === 'verbos') { var b = p[0].replace(/^to /, ''); if (single(b)) GL.v.push([b, p[1]]); }
        if ((s === 'palavras' || s === 'apoio') && single(p[0].toLowerCase())) SOFTW.push(p[0].toLowerCase());
      });
    });
  });
  GL.w = uniq(GL.w); GL.s = uniq(GL.s); GL.v = uniq(GL.v);
}
function sec(u, n) { return u.secs[n] || []; }
function sentPool(u) { return uniq([].concat(sec(u, 'aquecimento'), sec(u, 'frases'), sec(u, 'perguntas'), sec(u, 'extras'), sec(u, 'resumo')).map(function (p) { return [p[0], p[1]]; })); }
function wordList(u) { return [].concat(sec(u, 'palavras'), sec(u, 'apoio')); }
function allPool(u) { return uniq([].concat(sentPool(u), wordList(u), sec(u, 'verbos'), sec(u, 'expressoes')).map(function (p) { return [p[0], p[1]]; })); }
/* a melhor frase do módulo para treinar um verbo falando */
function verbItem(u, v) {
  var base = v[0].replace(/^to /, ''), past = v[2] && v[2] !== base ? v[2] : '';
  function has(en, w) { return (' ' + norm(en) + ' ').indexOf(' ' + norm(w) + ' ') >= 0; }
  var pool = sentPool(u).filter(function (p) { var n = words(p[0]).length; return n >= 3 && n <= 9; });
  var c = past ? pool.filter(function (p) { return has(p[0], past); }) : [];
  if (!c.length) c = pool.filter(function (p) { return has(p[0], base); });
  if (!c.length) c = pool.filter(function (p) { return has(p[0], base + 's') || has(p[0], base + 'es'); });
  if (c.length) { c.sort(function (a, b) { return a[0].length - b[0].length; }); var s = c[Math.floor(Math.random() * Math.min(3, c.length))]; return { en: s[0], pt: s[1], verb: v[0], sent: true }; }
  return past ? { en: base + ', ' + past, pt: v[1] + ' (presente e passado)', verb: v[0] } : { en: v[0], pt: v[1], verb: v[0] };
}

/* ===== estado e salvamento ===== */
var SK = 'estudo_v1', NOSTORE = false, S;
function fresh() { return { v: 1, prog: {}, dif: {}, cal: {}, bk: 0, cfg: { vel: 0.85, livro: BOOKS[0] ? BOOKS[0].id : '' } }; }
function clean(o) {
  var f = fresh();
  if (!o || o.v !== 1 || typeof o.prog !== 'object' || !o.prog) return null;
  Object.keys(o.prog).forEach(function (k) {
    var p = o.prog[k], st = {};
    if (p && p.steps) Object.keys(p.steps).forEach(function (s) { if (p.steps[s]) st[s] = 1; });
    f.prog[k] = { steps: st };
  });
  if (o.dif && typeof o.dif === 'object') Object.keys(o.dif).forEach(function (k) { var n = +o.dif[k]; if (n > 0) f.dif[k] = Math.min(n, 9); });
  f.bk = +o.bk || 0;
  if (o.cal && typeof o.cal === 'object') Object.keys(o.cal).forEach(function (t) { var a = [].concat(o.cal[t]).filter(function (x) { return typeof x === 'string' && /^[a-z0-9]{1,24}$/.test(x); }).slice(0, 6); if (a.length && /^[a-z0-9]{1,24}$/.test(t)) f.cal[t] = a; });
  if (o.cfg) { if (+o.cfg.vel >= 0.4 && +o.cfg.vel <= 1.2) f.cfg.vel = +o.cfg.vel; if (o.cfg.livro && BOOKS.some(function (b) { return b.id === o.cfg.livro; })) f.cfg.livro = o.cfg.livro; }
  return f;
}
function loadState() { try { var r = localStorage.getItem(SK); if (r) { var o = clean(JSON.parse(r)); if (o) return o; } } catch (e) { NOSTORE = true; } return fresh(); }
function idbOpen(cb) { try { var r = indexedDB.open('estudo_ingles', 1); r.onupgradeneeded = function () { r.result.createObjectStore('kv'); }; r.onsuccess = function () { cb(r.result); }; r.onerror = function () { cb(null); }; } catch (e) { cb(null); } }
function idbSet(txt) { idbOpen(function (db) { if (!db) return; try { db.transaction('kv', 'readwrite').objectStore('kv').put(txt, 'save'); } catch (e) {} }); }
function idbGet(cb) { idbOpen(function (db) { if (!db) return cb(null); try { var q = db.transaction('kv').objectStore('kv').get('save'); q.onsuccess = function () { cb(q.result || null); }; q.onerror = function () { cb(null); }; } catch (e) { cb(null); } }); }
var RESTORED = 0;
function save() { S.ts = Date.now(); var t = JSON.stringify(S); try { localStorage.setItem(SK, t); } catch (e) { NOSTORE = true; } idbSet(t); }
function P(u) { return S.prog[u.id] || (S.prog[u.id] = { steps: {} }); }
function done(u, s) { return !!(S.prog[u.id] && S.prog[u.id].steps[s]); }
function mark(u, s) { P(u).steps[s] = 1; save(); }
function calCount() { var n = 0; Object.keys(S.cal || {}).forEach(function (t) { n += S.cal[t].length; }); return n; }
function calAdd(pairs) {
  S.cal = S.cal || {}; var n = 0;
  (pairs || []).forEach(function (p) {
    var t = p[0], hd = p[1]; if (!t || !hd || t === hd) return;
    var a = S.cal[t] || (S.cal[t] = []); if (a.indexOf(hd) < 0) { a.push(hd); n++; if (a.length > 6) a.shift(); }
  });
  if (n) save(); return n;
}
function fopt(extra) { var o = { cal: S.cal, soft: SOFTW }; for (var k in extra) o[k] = extra[k]; return o; }
function hardAdd(en) { if (en) { S.dif[en] = Math.min((S.dif[en] || 0) + 1, 9); } }
function hardOk(en) { if (en && S.dif[en]) { S.dif[en]--; if (S.dif[en] <= 0) delete S.dif[en]; } }
function doneCount() { var n = 0; Object.keys(S.prog).forEach(function (k) { n += Object.keys(S.prog[k].steps).length; }); return n; }
function stamp() { var d = new Date(); function z(n) { return (n < 10 ? '0' : '') + n; } return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
function snapshot() { var o = JSON.parse(JSON.stringify(S)); o.app = 'estudo-ingles'; o.exportedAt = new Date().toISOString(); return JSON.stringify(o, null, 1); }
function saved(cb) { S.bk = Date.now(); save(); if (cb) cb(); }
function baixar(cb) {
  var blob = new Blob([snapshot()], { type: 'application/json' });
  var a = h('a', { href: URL.createObjectURL(blob), download: 'progresso-estudo-' + stamp() + '.json' }); document.body.append(a); a.click(); a.remove(); saved(cb);
}
function canShareFile() { try { var f = new File(['{}'], 'a.json', { type: 'application/json' }); return !!(navigator.canShare && navigator.canShare({ files: [f] })); } catch (e) { return false; } }
function compartilhar(cb) {
  try {
    var f = new File([snapshot()], 'progresso-estudo-' + stamp() + '.json', { type: 'application/json' });
    navigator.share({ files: [f], title: 'Progresso do estudo de inglês' }).then(function () { saved(cb); }, function () {});
  } catch (e) { baixar(cb); }
}
function exportar(cb) { if (canShareFile() && window.matchMedia && matchMedia('(pointer:coarse)').matches) compartilhar(cb); else baixar(cb); }
function toCode() { return 'ESTUDO1:' + btoa(unescape(encodeURIComponent(snapshot()))); }
function fromText(t) {
  t = String(t || '').trim();
  var m = t.match(/^ESTUDO1:([A-Za-z0-9+\/=\s]+)$/);
  if (m) t = decodeURIComponent(escape(atob(m[1].replace(/\s+/g, ''))));
  return clean(JSON.parse(t));
}
function importText(text, cb) {
  try {
    var o = fromText(text);
    if (!o) throw new Error('formato');
    var n = 0; Object.keys(o.prog).forEach(function (k) { n += Object.keys(o.prog[k].steps).length; });
    if (!confirm('Esta cópia tem ' + n + ' etapa(s) concluída(s). Isso vai SUBSTITUIR o progresso que está neste aparelho. Continuar?')) return;
    S = o; S.bk = Date.now(); save(); cb(true);
  } catch (e) { alert('Isso não parece ser uma cópia de progresso deste estudo. Confira se copiou o código inteiro, começando por ESTUDO1:'); cb(false); }
}
function importar(file, cb) { var r = new FileReader(); r.onload = function () { importText(r.result, cb); }; r.readAsText(file); }

/* ===== voz: falar, ouvir e gravar ===== */
var voice = null, seq = 0;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  var vs = speechSynthesis.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
  function rank(v) { return (/en[-_]US/i.test(v.lang) ? 4 : 0) + (/natural|neural/i.test(v.name) ? 5 : 0) + (/google|aria|jenny|guy|samantha|zira/i.test(v.name) ? 2 : 0); }
  vs.sort(function (a, b) { return rank(b) - rank(a); }); voice = vs[0] || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function speak(t, rate, onend) {
  if (!('speechSynthesis' in window)) return false;
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = rate || S.cfg.vel;
  if (voice) u.voice = voice; if (onend) u.onend = onend;
  speechSynthesis.speak(u); return true;
}
function quiet() { try { speechSynthesis.cancel(); } catch (e) {} }
function speakSeq(list, i, tok) {
  if (i >= list.length || tok !== seq) return;
  speak(list[i], 0, function () { setTimeout(function () { speakSeq(list, i + 1, tok); }, 350); });
}
function SRC() { return window.SpeechRecognition || window.webkitSpeechRecognition; }
function canRecord() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder); }
/* ouve uma frase; onText mostra o que vai entendendo; fim(listaDeOpções | null, erro) */
function listen(onText, fim, hints) {
  var C = SRC(), r = new C(), finals = [], others = [], last = '', err = null, ended = false, usedHints = false, handle = null;
  r.lang = 'en-US'; r.maxAlternatives = 10; r.interimResults = true; r.continuous = false;
  /* o Chrome mais novo aceita uma lista de palavras esperadas (SpeechRecognitionPhrase): ajuda palavra solta */
  try { if (hints && hints.length && window.SpeechRecognitionPhrase && 'phrases' in r) { r.phrases = hints.slice(0, 40).map(function (x) { return new window.SpeechRecognitionPhrase(String(x), 6.0); }); usedHints = true; } } catch (e) { usedHints = false; }
  r.onresult = function (e) {
    for (var i = e.resultIndex || 0; i < e.results.length; i++) {
      var res = e.results[i];
      for (var k = 0; k < res.length; k++) { if (res.isFinal) finals.push(res[k].transcript); else others.push(res[k].transcript); }
      last = res[0].transcript;
    }
    if (onText) onText(last);
  };
  r.onerror = function (e) { err = e.error || 'erro'; };
  r.onend = function () {
    if (ended) return; ended = true;
    if (usedHints && err === 'phrases-not-supported') { handle.inner = listen(onText, fim); return; }
    var all = [], seen = {}; finals.concat(others, last ? [last] : []).forEach(function (t) { var k = String(t).toLowerCase().trim(); if (k && !seen[k] && all.length < 16) { seen[k] = 1; all.push(t); } });
    if (all.length) fim(all, null); else fim(null, err || 'no-speech');
  };
  quiet();
  try { r.start(); } catch (e) { ended = true; fim(null, 'erro'); }
  handle = { inner: null, stop: function () { if (handle.inner) handle.inner.stop(); else { try { r.stop(); } catch (e) {} } } };
  return handle;
}
function record(fim) {
  var chunks = [], rec = null, stopped = false;
  quiet();
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
    rec = new MediaRecorder(s);
    rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = function () { s.getTracks().forEach(function (t) { t.stop(); }); fim(chunks.length ? URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })) : null); };
    rec.start(); if (stopped) rec.stop();
    setTimeout(function () { if (rec.state === 'recording') rec.stop(); }, 8000);
  }, function () { fim(null, 'not-allowed'); });
  return { stop: function () { stopped = true; if (rec && rec.state === 'recording') rec.stop(); } };
}
document.addEventListener('click', function (ev) {
  [].forEach.call(document.querySelectorAll('.bubble'), function (b) { b.remove(); });
  var t = ev.target.closest && ev.target.closest('.tr'); if (!t) return;
  var r = t.getBoundingClientRect(), b = h('span', { class: 'bubble' }, t.dataset.pt);
  document.body.append(b);
  b.style.left = Math.max(8, Math.min(r.left, innerWidth - b.offsetWidth - 8)) + 'px';
  b.style.top = (r.bottom + 6 + b.offsetHeight > innerHeight ? Math.max(8, r.top - b.offsetHeight - 6) : r.bottom + 6) + 'px';
  speak(t.dataset.en);
});
window.addEventListener('scroll', function () { [].forEach.call(document.querySelectorAll('.bubble'), function (b) { b.remove(); }); }, { passive: true });

/* arrastar com o dedo (e tocar): o.tap() e o.drop(x, y) */
function dragify(el, o) {
  var sx = 0, sy = 0, ghost = null, pid = null;
  el.addEventListener('pointerdown', function (e) { if (e.button) return; pid = e.pointerId; sx = e.clientX; sy = e.clientY; try { el.setPointerCapture(pid); } catch (x) {} });
  el.addEventListener('pointermove', function (e) {
    if (e.pointerId !== pid) return;
    if (!ghost && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 9) {
      var r = el.getBoundingClientRect(); ghost = el.cloneNode(true); ghost.className += ' ghost';
      ghost.style.width = r.width + 'px'; ghost._dx = sx - r.left; ghost._dy = sy - r.top; document.body.append(ghost); el.classList.add('lift');
    }
    if (ghost) { ghost.style.left = (e.clientX - ghost._dx) + 'px'; ghost.style.top = (e.clientY - ghost._dy) + 'px'; if (o.over) o.over(e.clientX, e.clientY); }
  });
  function end(e, cancel) {
    if (e.pointerId !== pid) return; pid = null;
    var g = ghost; ghost = null; el.classList.remove('lift'); if (o.over) o.over(-1, -1);
    if (g) { g.remove(); if (!cancel) o.drop(e.clientX, e.clientY); } else if (!cancel) o.tap();
  }
  el.addEventListener('pointerup', function (e) { end(e, false); });
  el.addEventListener('pointercancel', function (e) { end(e, true); });
  el.addEventListener('click', function (e) { if (e.detail === 0) o.tap(); });
}
function inside(el, x, y, pad) { var r = el.getBoundingClientRect(); pad = pad || 0; return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad; }

/* ===== peças de tela ===== */
var $app = document.getElementById('app'), $back = document.getElementById('back'), $ttl = document.getElementById('ttl'),
  $tabH = document.getElementById('tabH'), $tabF = document.getElementById('tabF'), $tabP = document.getElementById('tabP');
function show(title, backHash) {
  $ttl.textContent = title || ''; seq++; quiet();
  document.body.classList.remove('playing'); document.body.classList.toggle('home', title === null);
  $app.style.paddingBottom = '';
  $back.style.visibility = backHash ? 'visible' : 'hidden'; $back.onclick = function () { go(backHash); };
  var hs = location.hash; $tabP.classList.toggle('on', hs === '#p'); $tabF.classList.toggle('on', hs === '#f'); $tabH.classList.toggle('on', hs !== '#p' && hs !== '#f');
  var kids = [].concat.apply([], [].slice.call(arguments, 2)).filter(function (k) { return k != null && k !== false; });
  $app.replaceChildren.apply($app, kids); window.scrollTo(0, 0);
}
function go(hash) { if (location.hash === hash || (hash === '#' && !location.hash)) route(); else location.hash = hash; }
function card() { return h.apply(null, ['div', { class: 'card' }].concat([].slice.call(arguments))); }
function btn(label, fn, cls, ic) { return h('button', { type: 'button', class: cls || '', onclick: fn }, ic ? ico(ic, 20) : null, label); }
function bar(n, t, ok) { return h('div', { class: 'bar' + (ok ? ' ok' : '') }, h('i', { style: 'width:' + (t ? Math.max(0, Math.round(100 * n / t)) : 0) + '%' })); }
function say(text, label) { return h('button', { type: 'button', onclick: function () { if (!speak(text)) alert('Este navegador não tem voz em inglês.'); } }, ico('spk', 20), label || 'Ouvir'); }
function slow(text) { return btn('Devagar', function () { speak(text, 0.55); }); }
function enc(id) { return encodeURIComponent(id); }
function book() { return BOOKS.filter(function (b) { return b.id === S.cfg.livro; })[0] || BOOKS[0]; }
function teacher(t) { return t ? h('div', { class: 'note' }, h('span', { class: 'av' }, ico('cap', 20)), h('div', { class: 'tx' }, h('b', { class: 'k' }, 'Professor'), rich(t))) : null; }

/* ===== etapas ===== */
var INFO = {
  intro: ['Comece por aqui', 'Objetivo da unidade e dica do professor.', '', 'flag'],
  palavras: ['Palavras', 'Os tijolos das frases: ouvir, ligar e escrever.', 'Comece pelas palavras: são os tijolos das frases. Toque em cada uma para ouvir, repita em voz alta e só depois pratique.', 'book'],
  verbos: ['Verbos', 'Aprender falando: repetir e depois falar sem ler.', 'Verbo se aprende **falando**. Na lista, o verbo vem com **to** na frente: **to eat** é "comer". Na frase com um verbo só, o to some: {{I eat bread.|Eu como pão.}} Ouça cada um, e depois treine no microfone: primeiro você repete, depois fala sem ler.', 'bolt'],
  expressoes: ['Expressões', 'Blocos prontos de educação e do dia a dia.', 'São expressões prontas. Decore como um bloco inteiro, sem traduzir palavra por palavra.', 'chat'],
  regras: ['Regras (o porquê)', 'Por que a frase é montada assim, com pegadinhas.', 'Agora o porquê. Cada regra traz a ideia, a fórmula, a comparação com o português, exemplos e os erros mais comuns.', 'bulb'],
  frases: ['Frases', 'Tudo junto: falar, arrastar, escrever e ouvir.', 'Hora de usar tudo junto. O modo misto alterna falar, arrastar, escrever e ouvir.', 'lines'],
  dialogo: ['Conversa', 'Uma cena de verdade: ouça e fale a sua parte.', 'Uma conversa usando o que você aprendeu. Ouça, veja a tradução se precisar e depois fale a sua parte.', 'chat2'],
  revisao: ['Revisão final', '12 perguntas misturadas. 70% de primeira conclui.', '', 'target']
};
function stepsOf(u) {
  var s = ['intro'];
  if (wordList(u).length) s.push('palavras');
  ['verbos', 'expressoes'].forEach(function (k) { if (sec(u, k).length) s.push(k); });
  if (u.lessons.length) s.push('regras');
  if (sentPool(u).length) s.push('frases');
  if (sec(u, 'dialogo').length) s.push('dialogo');
  s.push('revisao'); return s;
}
function nextStep(u) { var s = stepsOf(u); for (var i = 0; i < s.length; i++) if (!done(u, s[i])) return s[i]; return null; }
function progOf(u) { var s = stepsOf(u), n = s.filter(function (x) { return done(u, x); }).length; return [n, s.length]; }
function uLabel(u) { return u.tipo === 'gramatica' ? 'Gramática' : 'Módulo ' + u.num; }
function nextUnit() { var us = book().units; for (var i = 0; i < us.length; i++) if (nextStep(us[i])) return us[i]; return null; }
function stepHash(u, s) { return '#u/' + enc(u.id) + '/' + s; }
function finish(u, s) { mark(u, s); go('#u/' + enc(u.id)); }

/* ===== início ===== */
function viewHome() {
  var b = book(), nu = nextUnit(), kids = [], st = 0, sd = 0, ud = 0;
  b.units.forEach(function (u) { var p = progOf(u); st += p[1]; sd += p[0]; if (p[0] === p[1]) ud++; });
  kids.push(h('div', { class: 'hero' }, h('div', { class: 'k' }, 'Estudo de inglês · ' + b.nome), h('h1', null, sd ? 'Bom te ver de volta' : 'Vamos começar?'),
    h('div', { class: 'row2' }, ring(st ? sd / st : 0, { track: 'rgba(255,255,255,.28)', color: '#fff' }),
      h('div', { class: 't' }, h('b', null, ud + ' de ' + b.units.length + ' unidades concluídas'), sd + ' de ' + st + ' etapas feitas'))));
  if (nu) {
    var ns = nextStep(nu);
    kids.push(h('div', { class: 'card cta' }, h('span', { class: 'tag' + (nu.tipo === 'gramatica' ? ' g' : '') }, uLabel(nu)), h('h2', null, nu.titulo),
      h('p', { class: 'mut' }, 'Próxima etapa: ', h('strong', null, INFO[ns][0])),
      h('button', { type: 'button', class: 'primary wide', onclick: function () { go(stepHash(nu, ns)); } }, 'Continuar', ico('chevR'))));
  } else kids.push(h('div', { class: 'card cta' }, h('h2', null, 'Livro concluído'), h('p', null, 'Você terminou todas as unidades. Use o treino de fala e o reforço para não esquecer.')));
  var nd = Object.keys(S.dif).length;
  kids.push(h('div', { class: 'quick' },
    h('button', { type: 'button', onclick: function () { go('#f'); } }, h('span', { class: 'qi' }, ico('mic')), h('span', null, h('b', null, 'Treino de fala'), h('span', { class: 'small' }, 'Só microfone, 5 minutos'))),
    h('button', { type: 'button', disabled: !nd, onclick: playHard }, h('span', { class: 'qi g' }, ico('redo')), h('span', null, h('b', null, 'O que errei'), h('span', { class: 'small' }, nd ? nd + ' para reforçar' : 'Nada por enquanto')))));
  if (RESTORED) kids.push(h('div', { class: 'msg ok', style: 'margin:0 0 14px' }, 'Recuperei o seu progresso (' + RESTORED + ' etapas) de uma cópia que o navegador guardou.'));
  if (NOSTORE) kids.push(h('div', { class: 'msg warn', style: 'margin:0 0 14px' }, 'Este navegador não está guardando seu progresso. Salve uma cópia ao terminar (aba Progresso).'));
  else if (doneCount() > 0 && (!S.bk || Date.now() - S.bk > 2 * 864e5)) {
    kids.push(h('div', { class: 'msg warn', style: 'margin:0 0 14px' }, h('div', null, S.bk ? 'Sua última cópia foi há ' + Math.floor((Date.now() - S.bk) / 864e5) + ' dias.' : 'Você ainda não salvou uma cópia do progresso.', ' O navegador do celular pode apagar os dados sem aviso.'),
      h('div', { class: 'actions' }, btn('Salvar cópia agora', function () { exportar(viewHome); }, 'primary'))));
  }
  if (BOOKS.length > 1) {
    var sel = h('select', { 'aria-label': 'Livro', onchange: function () { S.cfg.livro = sel.value; save(); viewHome(); } });
    BOOKS.forEach(function (x) { sel.append(h('option', { value: x.id }, x.nome)); }); sel.value = b.id; kids.push(h('div', { style: 'margin-bottom:14px' }, sel));
  }
  kids.push(h('div', { class: 'sec' }, h('h3', null, 'Trilha do ' + b.nome), h('span', { class: 'small' }, b.units.length + ' unidades')));
  var path = h('div', { class: 'path' });
  b.units.forEach(function (u) {
    var p = progOf(u), full = p[0] === p[1], isNext = nu && nu.id === u.id, g = u.tipo === 'gramatica';
    path.append(h('button', { type: 'button', class: 'node' + (full ? ' done' : '') + (isNext ? ' next' : ''), onclick: function () { go('#u/' + enc(u.id)); } },
      h('span', { class: 'nb' + (g ? ' g' : '') }, full ? ico('check', g ? 16 : 22) : g ? 'G' : String(u.num)),
      h('span', { class: 'ut' }, h('span', { class: 'k' }, uLabel(u)), h('span', { class: 't' }, u.titulo)),
      isNext ? h('span', { class: 'pill' }, 'Agora') : full ? null : p[0] ? h('span', { class: 'frac' }, p[0] + '/' + p[1]) : ico('chevR', 18)));
  });
  kids.push(path);
  show(null, '', kids);
}

/* ===== unidade ===== */
function viewUnit(u) {
  var ns = nextStep(u), p = progOf(u), path = h('div', { class: 'path' });
  stepsOf(u).forEach(function (s) {
    var dn = done(u, s), nx = ns === s;
    path.append(h('button', { type: 'button', class: 'node' + (dn ? ' done' : '') + (nx ? ' next' : ''), onclick: function () { go(stepHash(u, s)); } },
      h('span', { class: 'nb' }, ico(dn ? 'check' : INFO[s][3])),
      h('span', { class: 'ut' }, h('span', { class: 't' }, INFO[s][0]), h('span', { class: 'd' }, INFO[s][1])),
      nx ? h('span', { class: 'pill' }, 'Próxima') : dn ? null : ico('chevR', 18)));
  });
  show(uLabel(u), '#',
    h('div', { class: 'card' }, h('span', { class: 'tag' + (u.tipo === 'gramatica' ? ' g' : '') }, uLabel(u)), h('h2', { style: 'margin-top:10px' }, u.titulo),
      h('p', { class: 'small', style: 'margin:0' }, p[0] + ' de ' + p[1] + ' etapas. Siga na ordem: cada uma prepara a próxima.'), bar(p[0], p[1], p[0] === p[1])),
    path);
}
function viewStep(u, s) {
  var back = '#u/' + enc(u.id), fn = { intro: stepIntro, palavras: stepList, verbos: stepVerbs, expressoes: stepList, regras: stepRules, frases: stepPhrases, dialogo: stepDialog, revisao: stepReview }[s];
  if (!fn) return go(back);
  fn(u, s, back);
}
function noteBox(u, s) { return teacher(u.notas[s] || INFO[s][2]); }
function stepIntro(u, s, back) {
  var c = card(h('span', { class: 'tag' + (u.tipo === 'gramatica' ? ' g' : '') }, uLabel(u)), h('h2', { style: 'margin-top:10px' }, u.titulo));
  if (u.objetivo) c.append(h('h3', null, 'O que você vai aprender'), h('p', null, rich(u.objetivo)));
  if (u.porque) c.append(h('h3', null, 'Por que agora'), h('p', null, rich(u.porque)));
  if (u.historia) c.append(h('h3', null, 'Uma historinha'), h('p', null, rich(u.historia)));
  c.append(h('p', { class: 'small' }, 'Toque nas frases pontilhadas em azul para ouvir e ver a tradução.'));
  c.append(h('div', { class: 'actions' }, btn('Entendi, vamos começar', function () { mark(u, s); var n = nextStep(u); go(n ? stepHash(u, n) : back); }, 'primary')));
  show(INFO.intro[0], back, c, u.dica ? teacher(u.dica) : null);
}
function rowBtn(en, pt, extra, exm) {
  return h('button', { type: 'button', class: 'row', onclick: function () { speak(exm || en); } },
    h('span', { class: 'a' }, h('b', null, en + (extra ? '  →  ' + extra : '')), h('span', null, pt), exm ? h('i', null, exm) : null), h('span', { class: 'sp' }, ico('spk')));
}
/* monta uma rodada: 'pairs' gasta 4 itens, os outros 1 */
function buildRound(pool, types, u) {
  var sh = shuffle(pool), k = 0, qs = [];
  function next() { var it = sh[k % sh.length]; k++; return it; }
  if (!sh.length) return qs;
  types.forEach(function (t) {
    if (t === 'pairs') { if (sh.length >= 4) { var its = uniq([next(), next(), next(), next()]); if (its.length === 4) { qs.push({ t: 'pairs', items: its }); return; } } t = 'choose-en2pt'; }
    qs.push(mkQ(t, next(), u));
  });
  return qs;
}
/* linha com ouvir + falar: fica verde (acertou) ou vermelha (errou) */
function speakRow(o) {
  var row = h('div', { class: 'srow' }), info = h('div', { class: 'a' }), msg = h('em', null), live = false, rec = null;
  var target = o.target || o.en.replace(/,.*$/, '').trim(), said = o.seq || [target];
  info.append(h('b', null, o.en), h('span', null, o.pt));
  if (o.example) info.append(h('i', null, o.example));
  info.append(msg);
  function hear() { var tok = ++seq; speakSeq(said, 0, tok); }
  var ear = h('button', { type: 'button', class: 'bt', 'aria-label': 'Ouvir ' + o.en, onclick: hear }, ico('spk', 22));
  var mic = h('button', { type: 'button', class: 'bt mic', 'aria-label': 'Falar ' + o.en }, ico('mic', 22));
  function setState(ok, text) { row.classList.toggle('ok', ok === true); row.classList.toggle('bad', ok === false); msg.textContent = text || ''; if (o.onResult) o.onResult(ok); }
  function idle() { live = false; mic.classList.remove('live'); mic.replaceChildren(ico('mic', 22)); }
  mic.onclick = function () {
    if (live) { if (rec) rec.stop(); return; }
    quiet(); setState(null, ''); row.classList.remove('soft'); [].forEach.call(info.querySelectorAll('.acts'), function (x) { x.remove(); });
    if (SRC()) {
      live = true; mic.classList.add('live'); mic.replaceChildren(ico('stop', 22)); msg.textContent = 'Ouvindo... fale agora';
      rec = listen(function (t) { msg.textContent = t; }, function (alts, err) {
        idle();
        if (!alts) { msg.textContent = err === 'not-allowed' || err === 'service-not-allowed' ? 'Microfone bloqueado. Libere o microfone para este site.' : err === 'network' ? 'Sem internet para conferir a fala.' : 'Não ouvi. Toque no microfone e fale.'; return; }
        var r = Fala.check(target, alts, fopt({ lax: o.lax, soft: o.soft === false ? false : SOFTW }));
        if (r.ok) {
          setState(true, r.soft.length ? 'Quase: entendi "' + r.soft[0].heard + '" e não "' + r.soft[0].target + '". As consoantes batem; confira a vogal ouvindo de novo.' : 'Certo! Eu entendi: ' + r.heard + (r.homo.length ? '. "' + r.homo[0].heard + '" e "' + r.homo[0].target + '" têm o mesmo som: a diferença só aparece na escrita.' : ''));
          row.classList.toggle('soft', !!r.soft.length);
        } else {
          setState(false, 'Eu entendi: "' + r.heard + '". Ouça e tente de novo.'); row.classList.remove('soft');
          if (r.pairs.length) { var cb = btn('O microfone errou, eu falei certo', function () { calAdd(r.pairs); cb.remove(); setState(true, 'Calibrado: "' + r.pairs[0][1] + '" agora vale como "' + r.pairs[0][0] + '" neste aparelho.'); }); cb.className = 'cal'; info.append(h('div', { class: 'acts' }, cb)); }
        }
      }, [target]);
    } else if (canRecord()) {
      live = true; mic.classList.add('live'); mic.replaceChildren(ico('stop', 22)); msg.textContent = 'Gravando... toque para parar';
      rec = record(function (url, err) {
        idle();
        if (!url) { msg.textContent = err === 'not-allowed' ? 'Microfone bloqueado. Libere o microfone para este site.' : 'Não consegui gravar.'; return; }
        var au = new Audio(url); msg.textContent = 'Compare o modelo com a sua voz.';
        var acts = h('div', { class: 'acts' }, btn('Minha voz', function () { quiet(); au.currentTime = 0; au.play(); }, '', 'spk'), btn('Ficou igual', function () { acts.remove(); setState(true, 'Você marcou: ficou igual.'); }), btn('Repetir', function () { acts.remove(); setState(false, 'Ouça o modelo e grave de novo.'); }));
        info.append(acts);
      });
    } else msg.textContent = 'Este navegador não confere sua fala. Use o Chrome.';
  };
  row.append(info, ear, mic);
  return row;
}
function scoreBar(total) {
  var y = h('span', { class: 'y' }), n = h('span', { class: 'n' }), z = h('span', { class: 'z' }), st = {};
  function upd() { var a = 0, b = 0; Object.keys(st).forEach(function (k) { if (st[k] === true) a++; else if (st[k] === false) b++; }); y.textContent = 'Certas ' + a; n.textContent = 'Erradas ' + b; z.textContent = 'Faltam ' + (total - a - b); return [a, b]; }
  upd();
  return { el: h('div', { class: 'score' }, y, n, z), set: function (k, v) { st[k] = v; return upd(); } };
}
function stepList(u, s, back) {
  var items = s === 'palavras' ? wordList(u) : sec(u, s);
  var sb = scoreBar(items.length), c = card(h('p', { class: 'small' }, 'Toque no alto-falante para ouvir e no microfone para falar. Verde = você falou certo. Vermelho = tente de novo.'), sb.el);
  items.forEach(function (p, i) { c.append(speakRow({ en: p[0], pt: p[1], onResult: function (ok) { sb.set(i, ok); } })); });
  function start() {
    var pool = items.map(function (p) { return [p[0], p[1]]; }), types = ['pairs', 'choose-en2pt', 'say', 'choose-pt2en', 'listen', 'pairs', 'write', 'say', 'choose-en2pt', 'write'];
    play(buildRound(pool, types, u), { title: INFO[s][0], back: back, again: start, thr: 0.7, fim: function (ok) { if (ok) mark(u, s); } });
  }
  show(INFO[s][0], back, noteBox(u, s), c, h('button', { type: 'button', class: 'primary wide', onclick: start }, 'Praticar'));
}
function stepVerbs(u, s, back) {
  var vs = sec(u, 'verbos'), mic = !!SRC() || canRecord(), rows = [];
  vs.forEach(function (v) {
    var it = verbItem(u, v), past = v[2] && v[2] !== v[0].replace(/^to /, '') ? v[2] : '';
    rows.push({ en: v[0], pt: v[1], lax: ['to'], example: it.sent ? it.en : '', seq: it.sent ? [v[0], it.en] : null });
    if (past) rows.push({ en: past, pt: 'passado de ' + v[0], target: past, soft: false });
  });
  var sb = scoreBar(rows.length), c = card(h('p', { class: 'small' }, 'Aprenda falando o verbo, não a frase. Toque no alto-falante, ouça o verbo (e depois a frase de exemplo) e fale no microfone. Todos verdes = etapa concluída.'), sb.el), msg = h('div');
  rows.forEach(function (r, i) {
    r.onResult = function (ok) { var t = sb.set(i, ok); if (ok && t[0] === rows.length) { mark(u, s); msg.replaceChildren(h('div', { class: 'msg ok' }, 'Você falou todos os verbos certo. Etapa concluída!')); } };
    c.append(speakRow(r));
  });
  function falar() {
    var pick4 = pick(vs, 4), qs = [], pastQ = pick4.filter(function (v) { return v[2] && v[2] !== v[0].replace(/^to /, ''); }).slice(0, 2);
    pick4.forEach(function (v) { qs.push({ t: 'speak', en: v[0], pt: v[1], lax: ['to'], verb: true }); });
    shuffle(pick4).forEach(function (v) { qs.push({ t: 'say', en: v[0], pt: v[1], lax: ['to'], verb: true }); });
    pastQ.forEach(function (v) { qs.push({ t: 'say', en: v[2], pt: 'passado de ' + v[0] + ' (' + v[1] + ')', verb: true }); });
    pick(pick4.map(function (v) { return verbItem(u, v); }).filter(function (i) { return i.sent; }), 2).forEach(function (i) { qs.push({ t: 'say', en: i.en, pt: i.pt }); });
    play(qs, { title: 'Verbos: falar', back: back, again: falar, thr: 0.7, fim: function (ok) { if (ok) mark(u, s); } });
  }
  function calado() {
    var pool = vs.map(function (v) { return [v[0], v[1]]; }), sp = vs.map(function (v) { return verbItem(u, v); }).filter(function (i) { return i.sent; });
    var qs = buildRound(pool, ['pairs', 'choose-pt2en', 'write', 'choose-en2pt', 'write'], u);
    pick(sp, 4).forEach(function (i) { qs.push(mkGap([i.en, i.pt], u)); });
    play(qs, { title: 'Verbos: sem microfone', back: back, again: calado, thr: 0.7, fim: function (ok) { if (ok && !mic) mark(u, s); },
      nota: mic ? 'Esta rodada não conclui a etapa. Verbo só conta quando você fala: use os botões de microfone ou a rodada "Treinar falando".' : '' });
  }
  show(INFO.verbos[0], back, noteBox(u, s), c, msg,
    h('button', { type: 'button', class: 'primary wide', onclick: falar }, ico('mic', 20), 'Treinar falando (rodada)'),
    h('div', { class: 'actions' }, btn('Treinar sem microfone', calado)));
}

/* regras: lições uma a uma */
var KIND = { regra: 'Regra', pegadinha: 'Pegadinha', dica: 'Dica', vocabulario: 'Vocabulário', idioma: 'Expressão', resumo: 'Resumo' };
function stepRules(u, s, back) {
  var L = u.lessons, i = 0;
  function draw() {
    var l = L[i], dots = h('div', { class: 'dots' });
    L.forEach(function (x, k) { dots.append(h('i', { class: k === i ? 'on' : k < i ? 'past' : '' })); });
    var c = card(h('span', { class: 'tag' + (l.kind === 'pegadinha' ? ' g' : '') }, KIND[l.kind] || 'Regra'), h('h2', { style: 'margin-top:10px' }, l.titulo));
    if (l.gancho) c.append(h('div', { class: 'hook' }, rich(l.gancho)));
    if (l.resumo) c.append(h('h3', null, 'A ideia'), h('p', null, h('strong', null, rich(l.resumo))));
    if (l.formula) c.append(h('h3', null, 'Fórmula'), h('div', { class: 'formula' }, l.formula));
    if (l.porque) c.append(h('h3', null, 'Por quê'), h('p', null, rich(l.porque)));
    if (l.compare) c.append(h('h3', null, 'Português x inglês'), h('div', { class: 'cmp' }, rich(l.compare)));
    if (l.ex.length) { c.append(h('h3', null, 'Exemplos (toque para ouvir)')); l.ex.forEach(function (e) { c.append(rowBtn(e[0], e[1])); }); }
    if (l.erros.length) {
      c.append(h('h3', null, 'Cuidado com estes erros'));
      l.erros.forEach(function (e) {
        c.append(h('div', { class: 'err' }, h('div', { class: 'l bad' }, ico('x', 18), h('span', { class: 'x' }, e.wrong)), h('div', { class: 'l good' }, ico('check', 18), h('span', { class: 'v' }, e.right)),
          h('div', { class: 'small' }, e.pt), h('div', null, rich(e.why))));
      });
    }
    if (l.cuidado) c.append(h('h3', null, 'Cuidado'), h('div', { class: 'cmp' }, rich(l.cuidado)));
    if (l.quiz.length) {
      c.append(h('h3', null, 'Teste rápido'));
      l.quiz.forEach(function (q) {
        var box = h('div', { class: 'err' }, h('p', null, h('strong', null, q.q))), res = h('div');
        shuffle(q.opts).forEach(function (o) {
          var b = h('button', { type: 'button', class: 'opt', onclick: function () {
            var ok = o === q.a; [].forEach.call(box.querySelectorAll('.opt'), function (x) { x.disabled = true; if (x.textContent === q.a) x.classList.add('right'); });
            if (!ok) b.classList.add('wrong');
            res.replaceChildren(h('div', { class: 'msg ' + (ok ? 'ok' : 'bad'), style: 'margin-top:4px' }, ok ? 'Certo!' : 'Não. O certo é: ' + q.a));
          } }, o);
          box.append(b);
        });
        box.append(res); c.append(box);
      });
    }
    var last = i === L.length - 1, acts = h('div', { class: 'actions' });
    if (i > 0) acts.append(btn('Anterior', function () { i--; draw(); }));
    acts.append(btn(last ? 'Concluir as regras' : 'Próxima regra', function () { if (last) finish(u, s); else { i++; draw(); } }, 'primary'));
    c.append(acts);
    show(INFO.regras[0], back, dots, i === 0 ? noteBox(u, s) : null, c);
  }
  draw();
}

/* frases */
var MODES = {
  misto: ['speak', 'tiles', 'say', 'write', 'gap', 'speak', 'listen', 'say', 'tiles', 'write'],
  falar: ['speak', 'say'], escrever: ['write'], arrastar: ['tiles', 'gap'], ouvir: ['listen']
};
function stepPhrases(u, s, back) {
  var kids = [noteBox(u, s)], md = sec(u, 'modelo');
  if (md.length) {
    var c = card(h('h3', null, 'Modelo de pergunta e resposta'));
    md.forEach(function (r) { c.append(rowBtn(r[0], r[2]), rowBtn(r[1], r[3])); });
    kids.push(c);
  }
  function start(mode) {
    var t = MODES[mode], types = []; for (var i = 0; i < 10; i++) types.push(t[i % t.length]);
    play(buildRound(sentPool(u), types, u), { title: INFO.frases[0], back: back, again: function () { start(mode); }, thr: 0.7, fim: function (ok) { if (ok) mark(u, s); } });
  }
  function tile(mode, ic, a, b) { return h('button', { type: 'button', onclick: function () { start(mode); } }, h('span', { class: 'qi' }, ico(ic)), h('span', null, h('b', null, a), h('span', { class: 'small' }, b))); }
  kids.push(h('button', { type: 'button', class: 'primary wide', style: 'margin-bottom:14px', onclick: function () { start('misto'); } }, 'Treino misto (recomendado)'));
  kids.push(h('div', { class: 'quick' }, tile('falar', 'mic', 'Só falar', 'Repetir e falar sem ler'), tile('arrastar', 'move', 'Arrastar', 'Montar e completar'),
    tile('escrever', 'pencil', 'Escrever', 'Do português ao inglês'), tile('ouvir', 'spk', 'Ouvir', 'Escrever o que ouviu')));
  show(INFO.frases[0], back, kids);
}

/* conversa */
function stepDialog(u, s, back) {
  var lines = sec(u, 'dialogo'), me = function (w) { return /^(voc[eê]|you)$/i.test(w); };
  var wrap = h('div'), c = card(h('h3', null, 'A cena'), h('p', null, rich(u.cena || '')));
  lines.forEach(function (r) {
    wrap.append(h('button', { type: 'button', class: 'bub ' + (me(r[0]) ? 'me' : 'o'), onclick: function () { speak(r[1]); } }, h('b', null, r[0]), h('span', null, r[1]), h('span', { class: 'pt' }, r[2])));
  });
  c.append(wrap, h('div', { class: 'actions' },
    btn('Ouvir tudo', function () { var tok = ++seq; speakSeq(lines.map(function (r) { return r[1]; }), 0, tok); }, '', 'spk'),
    btn('Tradução', function () { wrap.classList.toggle('showpt'); })));
  function start() {
    var qs = [];
    lines.forEach(function (r, i) { if (me(r[0])) qs.push({ t: 'speak', en: r[1], pt: r[2], ctx: i > 0 ? lines[i - 1] : null }); });
    play(qs, { title: 'Sua parte na conversa', back: back, again: start, thr: 0.5, ordem: true, fim: function (ok) { if (ok) mark(u, s); } });
  }
  var mine = lines.some(function (r) { return me(r[0]); });
  show(INFO.dialogo[0], back, noteBox(u, s), c,
    mine ? h('button', { type: 'button', class: 'primary wide', onclick: start }, ico('mic', 20), 'Falar a minha parte') : null,
    h('div', { class: 'actions' }, btn('Já li, marcar como feito', function () { finish(u, s); })));
}

/* revisão final */
function stepReview(u, s, back) {
  var qz = [], fx = [];
  u.lessons.forEach(function (l) {
    l.quiz.forEach(function (q) { qz.push({ t: 'quiz', prompt: q.q, answer: q.a, options: shuffle(q.opts) }); });
    l.erros.forEach(function (e) { fx.push({ t: 'fix', wrong: e.wrong, right: e.right, pt: e.pt, why: e.why, en: e.right }); });
  });
  var qs = pick(qz, 2).concat(pick(fx, 2)), sp = sentPool(u);
  qs = qs.concat(buildRound(sp.length ? sp : allPool(u), ['say', 'tiles', 'speak', 'write', 'gap', 'listen', 'say'], u));
  qs = qs.concat(buildRound(allPool(u), ['choose-pt2en'], u));
  play(shuffle(qs), { title: INFO.revisao[0], back: back, again: function () { stepReview(u, s, back); }, thr: 0.7, fim: function (ok) { if (ok) mark(u, s); } });
}
function playHard() {
  var ens = Object.keys(S.dif).sort(function (a, b) { return S.dif[b] - S.dif[a]; }).filter(function (e) { return PT[e]; }).slice(0, 10);
  var types = ['say', 'write', 'tiles', 'choose-pt2en'];
  var qs = ens.map(function (e, i) { return mkQ(types[i % 4], [e, PT[e]]); });
  if (!qs.length) { go('#'); return; }
  play(qs, { title: 'O que errei', back: '#', again: playHard, livre: true });
}

/* ===== aba Falar ===== */
function viewFalar() {
  var cur = nextUnit() || book().units[book().units.length - 1];
  var sel = h('select', { 'aria-label': 'De onde vêm as frases' }, h('option', { value: 'atual' }, 'Unidade atual: ' + cur.titulo), h('option', { value: 'tudo' }, 'Tudo o que já estudei'));
  function units() { if (sel.value === 'atual') return [cur]; var us = book().units.filter(function (u) { return progOf(u)[0] > 0; }); return us.length ? us : [cur]; }
  function start(kind) {
    var us = units(), qs = [];
    if (kind === 'verbos') {
      var vs = []; us.forEach(function (u) { sec(u, 'verbos').forEach(function (v) { vs.push(verbItem(u, v)); }); });
      if (!vs.length) { alert('Esta unidade não tem lista de verbos. Escolha "Tudo o que já estudei" ou outro treino.'); return; }
      pick(vs, 8).forEach(function (i, k) { qs.push({ t: k % 2 ? 'say' : 'speak', en: i.en, pt: i.pt }); });
    } else {
      var pool = []; us.forEach(function (u) { pool = pool.concat(sentPool(u)); });
      pool = uniq(pool).filter(function (p) { var n = words(p[0]).length; return n >= 2 && n <= 10; });
      pick(pool, 8).forEach(function (p) { qs.push({ t: kind, en: p[0], pt: p[1] }); });
    }
    play(qs, { title: 'Treino de fala', back: '#f', again: function () { start(kind); }, livre: true });
  }
  function tile(kind, ic, a, b) { return h('button', { type: 'button', onclick: function () { start(kind); } }, h('span', { class: 'qi' }, ico(ic)), h('span', null, h('b', null, a), h('span', { class: 'small' }, b))); }
  var how = SRC() ? 'O microfone escreve o que entendeu e o app compara palavra por palavra com a frase certa. Verde = entendida. Vermelha = repita.' :
    canRecord() ? 'Este navegador não entende a fala, então você grava, ouve o modelo e a sua voz, e decide se ficou igual. No Chrome a conferência é automática.' :
    'Este navegador não tem microfone liberado. Abra no Chrome para a conferência automática.';
  show('Treino de fala', '',
    teacher('Só se aprende a falar **falando**. Fale alto e claro, perto do celular. Se uma palavra ficar vermelha, ouça devagar e repita só ela antes de tentar a frase de novo.'),
    card(h('h3', null, 'De onde vêm as frases'), sel),
    h('div', { class: 'quick' }, tile('speak', 'spk', 'Repetir', 'Ouvir, ler e falar'), tile('say', 'mic', 'Falar sem ler', 'Do português ao inglês')),
    h('div', { class: 'quick' }, tile('verbos', 'bolt', 'Só verbos', 'Cada verbo numa frase'), h('button', { type: 'button', onclick: playHard, disabled: !Object.keys(S.dif).length }, h('span', { class: 'qi g' }, ico('redo')), h('span', null, h('b', null, 'O que errei'), h('span', { class: 'small' }, 'Reforço')))),
    card(h('h3', null, 'Como a fala é conferida'), h('p', { class: 'small', style: 'margin:0 0 8px' }, how), h('p', { class: 'small', style: 'margin:0' }, 'Se o navegador pedir permissão do microfone toda vez, é porque o arquivo foi aberto direto do aparelho. Pelo link do site (https) ele guarda a sua resposta.')));
}

/* ===== perguntas ===== */
function distract(it, dir) {
  var pool = words(it[0]).length >= 3 ? GL.s : GL.w, ix = dir === 'en2pt' ? 1 : 0;
  var c = shuffle(pool.filter(function (p) { return p[0] !== it[0] && p[1] !== it[1]; })), out = [], seen = {};
  seen[it[ix]] = 1;
  c.forEach(function (p) { if (out.length < 3 && !seen[p[ix]]) { seen[p[ix]] = 1; out.push(p[ix]); } });
  return out.length === 3 ? out : null;
}
function mkGap(it, u) {
  var ws = it[0].split(/\s+/), low = function (w) { return w.toLowerCase().replace(/[^a-z']/g, ''); };
  var verbs = (u ? sec(u, 'verbos') : []).map(function (v) { return v[0].replace(/^to /, '').toLowerCase(); }).filter(single);
  var vocab = (u ? wordList(u) : []).map(function (v) { return v[0].toLowerCase(); }).filter(single);
  var ix = -1, pool = [], i;
  for (i = 0; i < ws.length && ix < 0; i++) if (verbs.indexOf(low(ws[i])) >= 0) { ix = i; pool = verbs.concat(GL.v.map(function (p) { return p[0].toLowerCase(); })); }
  for (i = ws.length - 1; i >= 0 && ix < 0; i--) if (vocab.indexOf(low(ws[i])) >= 0) { ix = i; pool = vocab.concat(GL.w.map(function (p) { return p[0].toLowerCase(); }).filter(single)); }
  if (ix < 0) { var best = 0; ws.forEach(function (w, k) { if (low(w).length > best) { best = low(w).length; ix = k; } }); pool = GL.w.map(function (p) { return p[0].toLowerCase(); }).filter(single); }
  var m = ws[ix].match(/^([^A-Za-z']*)(.*?)([^A-Za-z']*)$/), ans = m[2], seen = {}, d = [];
  seen[ans.toLowerCase()] = 1;
  shuffle(pool).forEach(function (w) { if (d.length < 3 && !seen[w] && w.length > 1) { seen[w] = 1; d.push(w); } });
  if (!ans || d.length < 3 || ws.length < 3) return { t: 'write', en: it[0], pt: it[1], answer: it[0], prompt: it[1] };
  return { t: 'gap', en: it[0], pt: it[1], ws: ws, ix: ix, pre: m[1], post: m[3], answer: ans, options: shuffle(d.concat([ans.toLowerCase() === 'i' ? 'I' : ans.toLowerCase()])) };
}
function mkQ(type, it, u) {
  var en = it[0], pt = it[1], n = words(en).length;
  if (type === 'tiles' && n < 3) type = 'write';
  if (type === 'gap') return mkGap(it, u);
  if (type.slice(0, 6) === 'choose') {
    var dir = type.slice(7), d = distract(it, dir);
    if (!d) return { t: 'write', en: en, pt: pt, answer: en, prompt: pt };
    var ans = dir === 'en2pt' ? pt : en;
    return { t: 'choose', dir: dir, en: en, pt: pt, prompt: dir === 'en2pt' ? en : pt, answer: ans, options: shuffle(d.concat([ans])) };
  }
  if (type === 'speak' || type === 'say') return { t: type, en: en, pt: pt };
  return { t: type, en: en, pt: pt, answer: en, prompt: pt };
}
var TL = { choose: ['Escolher', 'list'], quiz: ['Escolher', 'list'], fix: ['Certo ou errado', 'target'], write: ['Escrever', 'pencil'], listen: ['Ouvir e escrever', 'spk'],
  tiles: ['Arrastar', 'move'], gap: ['Completar', 'move'], pairs: ['Ligar os pares', 'grid'], speak: ['Falar', 'mic'], say: ['Falar sem ler', 'mic'] };
var QV = {};
function lockOpts(box, right) { [].forEach.call(box.querySelectorAll('.opt'), function (x) { x.disabled = true; if (x.textContent === right) x.classList.add('right'); }); }
function optList(c, opts, right, after) {
  opts.forEach(function (o) {
    var b = h('button', { type: 'button', class: 'opt', onclick: function () { var ok = o === right; lockOpts(c.box, right); if (!ok) b.classList.add('wrong'); after(ok); } }, o);
    c.box.append(b);
  });
}
QV.choose = function (q, c) {
  var en2 = q.dir === 'en2pt';
  c.box.append(h('p', { class: 'small' }, en2 ? 'O que significa?' : 'Como se diz em inglês?'), h('p', { class: en2 ? 'en' : 'big' }, q.prompt));
  if (en2) { c.box.append(h('div', { style: 'margin:0 0 14px' }, say(q.en))); speak(q.en); }
  optList(c, q.options, q.answer, function (ok) { c.done(ok, ok ? h('div', null, q.en + ' = ' + q.pt) : ['O certo é: ', h('strong', null, q.answer)], q.en); });
};
QV.quiz = function (q, c) {
  c.box.append(h('p', { class: 'small' }, 'Escolha a certa:'), h('p', { class: 'big' }, q.prompt));
  optList(c, q.options, q.answer, function (ok) { c.done(ok, ok ? null : ['O certo é: ', h('strong', null, q.answer)]); });
};
QV.fix = function (q, c) {
  c.box.append(h('p', { class: 'small' }, 'Qual frase está certa?'), h('p', { class: 'big' }, q.pt));
  optList(c, shuffle([q.wrong, q.right]), q.right, function (ok) { c.done(ok, rich(q.why), q.right); });
};
function writeLike(q, c, listenOnly) {
  var input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'done', 'aria-label': 'Escreva em inglês' });
  var chk = h('button', { type: 'button', class: 'primary' }, 'Conferir');
  c.box.append(h('p', { class: 'small' }, listenOnly ? 'Ouça e escreva o que você ouviu:' : 'Escreva em inglês:'));
  if (listenOnly) c.box.append(h('div', { class: 'actions', style: 'margin:0 0 14px' }, say(q.en, 'Ouvir'), slow(q.en)));
  else c.box.append(h('p', { class: 'big' }, q.prompt));
  var liveEl = h('div', { class: 'wm live', 'aria-live': 'polite' });
  c.box.append(input, liveEl, h('p', { class: 'livehint' }, 'Enquanto você digita, a palavra fica verde se estiver certa e vermelha se estiver errada.'), h('div', { class: 'actions' }, chk, listenOnly ? null : btn('Dica: ouvir', function () { speak(q.en); }, '', 'spk')));
  input.addEventListener('input', function () {
    if (input.readOnly) return;
    var r = Fala.live(q.answer, input.value); liveEl.replaceChildren();
    r.marks.forEach(function (m) { liveEl.append(h('span', { class: m.s === 'ok' ? 'y' : m.s === 'bad' ? 'n' : 'p' }, m.w)); });
    input.classList.toggle('good', r.full);
  });
  function check() {
    if (!words(input.value).length) return;
    var ok = Fala.sameWritten(input.value, q.answer);
    input.readOnly = true; chk.disabled = true; input.blur();
    if (ok) return c.done(true, h('div', null, q.answer), q.en);
    var a = words(input.value), t = words(q.answer), d = diff(a, t);
    var mine = h('div', { class: 'ln' }, 'Você escreveu: ');
    a.forEach(function (w, i) { mine.append(h('span', { style: d.ma[i] ? '' : 'color:var(--bad);text-decoration:line-through;font-weight:700' }, w), ' '); });
    var miss = t.filter(function (w, i) { return !d.mb[i]; });
    c.done(false, [mine, h('div', { class: 'ln' }, 'O certo é: ', h('strong', null, q.answer)), miss.length ? h('div', { class: 'ln' }, 'Faltou ou mudou: ', h('strong', null, miss.join(', '))) : null, h('div', { class: 'small' }, q.pt)], q.en);
  }
  chk.onclick = check; input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } });
  if (listenOnly) speak(q.en);
}
QV.write = function (q, c) { writeLike(q, c, false); };
QV.listen = function (q, c) { writeLike(q, c, true); };
QV.tiles = function (q, c) {
  var toks = q.answer.split(/\s+/), order = shuffle(toks.map(function (t, i) { return i; })), placed = [], fin = false;
  var slot = h('div', { class: 'tiles slot' }), bank = h('div', { class: 'tiles bank' }), chk = h('button', { type: 'button', class: 'primary' }, 'Conferir'), warn = h('div');
  function drop(ix, x, y) {
    var was = placed.indexOf(ix); if (was >= 0) placed.splice(was, 1);
    if (inside(slot, x, y, 18)) {
      var kids = [].slice.call(slot.children).filter(function (k) { return +k.dataset.ix !== ix; }), pos = kids.length;
      for (var i = 0; i < kids.length; i++) { var r = kids[i].getBoundingClientRect(); if (y < r.top - 4 || (y <= r.bottom + 4 && x < r.left + r.width / 2)) { pos = i; break; } }
      placed.splice(pos, 0, ix);
    }
    draw();
  }
  function tile(ix, on) {
    var b = h('button', { type: 'button', class: 'tile' + (on ? ' on' : ''), 'data-ix': ix }, toks[ix]);
    dragify(b, {
      tap: function () { if (fin) return; var w = placed.indexOf(ix); if (w >= 0) placed.splice(w, 1); else placed.push(ix); draw(); },
      drop: function (x, y) { if (!fin) drop(ix, x, y); },
      over: function (x, y) { slot.classList.toggle('over', x >= 0 && inside(slot, x, y, 18)); }
    });
    return b;
  }
  function draw() {
    slot.replaceChildren(); bank.replaceChildren(); warn.replaceChildren();
    placed.forEach(function (ix) { slot.append(tile(ix, true)); });
    order.forEach(function (ix) { if (placed.indexOf(ix) < 0) bank.append(tile(ix, false)); });
  }
  chk.onclick = function () {
    if (placed.length < toks.length) { warn.replaceChildren(h('div', { class: 'msg warn' }, 'Use todas as palavras antes de conferir.')); return; }
    fin = true; chk.disabled = true;
    var mine = placed.map(function (i) { return toks[i]; }).join(' '), ok = norm(mine) === norm(q.answer);
    c.done(ok, ok ? h('div', null, q.answer) : [h('div', { class: 'ln' }, 'Você montou: ' + mine), h('div', { class: 'ln' }, 'O certo é: ', h('strong', null, q.answer))], q.en);
  };
  c.box.append(h('p', { class: 'small' }, 'Arraste ou toque nas palavras para montar em inglês:'), h('p', { class: 'big' }, q.prompt), slot, bank, warn,
    h('div', { class: 'actions' }, chk, btn('Dica: ouvir', function () { speak(q.en); }, '', 'spk')));
  draw();
};
QV.gap = function (q, c) {
  var fill = '', fin = false, blank = h('span', { class: 'blank', role: 'button', tabindex: '0' }, ' '), line = h('p', { class: 'gapline' });
  var bank = h('div', { class: 'tiles bank' }), chk = h('button', { type: 'button', class: 'primary', disabled: true }, 'Conferir');
  q.ws.forEach(function (w, i) { if (i === q.ix) line.append(q.pre, blank, q.post, ' '); else line.append(w + ' '); });
  function set(v) { if (fin) return; fill = v; blank.textContent = v || ' '; chk.disabled = !v; draw(); }
  blank.addEventListener('click', function () { set(''); });
  function draw() {
    bank.replaceChildren();
    q.options.forEach(function (o) {
      if (o === fill) return;
      var b = h('button', { type: 'button', class: 'tile' }, o);
      dragify(b, { tap: function () { set(o); }, drop: function (x, y) { if (inside(blank, x, y, 34)) set(o); }, over: function (x, y) { blank.classList.toggle('over', x >= 0 && inside(blank, x, y, 34)); } });
      bank.append(b);
    });
  }
  chk.onclick = function () {
    fin = true; chk.disabled = true;
    var ok = fill.toLowerCase() === q.answer.toLowerCase();
    c.done(ok, ok ? h('div', null, q.en) : ['O certo é: ', h('strong', null, q.answer), h('div', { class: 'ln' }, q.en)], q.en);
  };
  c.box.append(h('p', { class: 'small' }, 'Arraste a palavra certa para o espaço:'), h('p', { class: 'mut' }, q.pt), line, bank, h('div', { class: 'actions' }, chk));
  draw();
};
QV.pairs = function (q, c) {
  var left = shuffle(q.items), right = shuffle(q.items), selL = null, selR = null, miss = 0, hit = 0, wrong = {};
  var grid = h('div', { class: 'pairs' }), L = [], Rg = [];
  function clear() { L.concat(Rg).forEach(function (b) { b.classList.remove('sel', 'miss'); }); selL = selR = null; }
  function tryMatch() {
    if (selL == null || selR == null) return;
    var a = left[selL], b = right[selR], bl = L[selL], br = Rg[selR];
    if (a[0] === b[0]) {
      bl.classList.remove('sel'); br.classList.remove('sel'); bl.classList.add('hit'); br.classList.add('hit'); bl.disabled = br.disabled = true; hit++; selL = selR = null;
      if (hit === q.items.length) { Object.keys(wrong).forEach(hardAdd); c.done(miss <= 1, miss ? h('div', null, 'Você errou ' + miss + ' par(es) no caminho.') : null); }
    } else {
      miss++; wrong[a[0]] = 1; bl.classList.add('miss'); br.classList.add('miss'); setTimeout(clear, 450);
    }
  }
  left.forEach(function (p, i) {
    var b = h('button', { type: 'button', onclick: function () { if (selL != null) L[selL].classList.remove('sel'); selL = i; b.classList.add('sel'); speak(p[0]); tryMatch(); } }, p[0]);
    L.push(b);
  });
  right.forEach(function (p, i) {
    var b = h('button', { type: 'button', onclick: function () { if (selR != null) Rg[selR].classList.remove('sel'); selR = i; b.classList.add('sel'); tryMatch(); } }, p[1]);
    Rg.push(b);
  });
  for (var i = 0; i < left.length; i++) grid.append(L[i], Rg[i]);
  c.box.append(h('p', { class: 'small' }, 'Toque no inglês e depois na tradução:'), grid);
};
function marksEl(r) { var e = h('div', { class: 'wm' }); r.marks.forEach(function (m) { e.append(h('span', { class: m.ok ? (m.soft ? 's' : 'y') : 'n' }, m.w)); }); return e; }
function speakLike(q, c, hidden) {
  var tries = 0, hinted = false, live = false, rec = null, shown = !hidden, ended = false;
  var enEl = h('p', { class: 'en' }, hidden ? '' : q.en), res = h('div'), heard = h('div', { class: 'heard' });
  var mic = h('button', { type: 'button', class: 'mic', 'aria-label': 'Falar' }, ico('mic', 40)), lab = h('div', { class: 'miclab' }, 'Toque e fale');
  function idle(t) { live = false; mic.classList.remove('live'); mic.replaceChildren(ico('mic', 40)); lab.textContent = t || 'Toque e fale de novo'; }
  function reveal() { if (!shown) { shown = true; hinted = true; enEl.textContent = q.en; } }
  function skip() { return btn('Pular esta', function () { ended = true; c.done(false, ['O certo é: ', h('strong', null, q.en), h('div', { class: 'small' }, q.pt)], q.en); }); }
  function toWrite() { c.box.replaceChildren.apply(c.box, c.head); QV.write({ t: 'write', en: q.en, pt: q.pt, answer: q.en, prompt: q.pt }, c); }
  function pass(fb) { ended = true; c.done(true, fb, null, tries > 2 || (hidden && hinted)); }
  if (q.ctx) c.box.append(h('button', { type: 'button', class: 'row', style: 'margin-bottom:12px', onclick: function () { speak(q.ctx[1]); } }, h('span', { class: 'a' }, h('span', null, q.ctx[0] + ' diz:'), h('b', null, q.ctx[1])), h('span', { class: 'sp' }, ico('spk'))));
  if (hidden) c.box.append(h('p', { class: 'small' }, q.verb ? 'Diga o verbo em inglês (com to):' : 'Diga em inglês, sem ler:'), h('p', { class: 'big' }, q.pt), enEl);
  else c.box.append(h('p', { class: 'small' }, q.ctx ? 'Agora você responde:' : 'Ouça e repita em voz alta:'), enEl, h('p', { class: 'mut' }, q.pt));
  c.box.append(h('div', { class: 'actions', style: 'margin-top:4px' },
    h('button', { type: 'button', onclick: function () { if (hidden) hinted = true; speak(q.en); } }, ico('spk', 20), hidden ? 'Dica: ouvir' : 'Ouvir'),
    btn('Devagar', function () { if (hidden) hinted = true; speak(q.en, 0.55); })));
  c.box.append(h('div', { class: 'micwrap' }, mic, lab, heard), res);

  function onSR(alts, err) {
    if (ended) return;
    if (!alts) {
      idle();
      res.replaceChildren(h('div', { class: 'msg warn' }, err === 'not-allowed' || err === 'service-not-allowed' ? 'O navegador bloqueou o microfone. Libere o microfone para este site nas configurações do navegador.' : err === 'no-speech' || err === 'aborted' ? 'Não ouvi nada. Toque no microfone e fale perto do celular.' : err === 'network' ? 'O reconhecimento de voz precisa de internet. Confira a conexão.' : 'O microfone falhou (' + err + ').'),
        h('div', { class: 'actions' }, btn('Escrever esta frase', toWrite, '', 'pencil')));
      return;
    }
    tries++;
    var r = Fala.check(q.en, alts, fopt({ lax: q.lax }));
    heard.textContent = 'Eu entendi: ' + r.heard;
    if (r.ok) { reveal(); return pass([marksEl(r), h('div', { class: 'small' }, r.soft.length ? 'Quase: entendi "' + r.soft[0].heard + '" no lugar de "' + r.soft[0].target + '". As consoantes batem; só a vogal ficou diferente. Ouça o modelo e repita devagar para acertar a vogal.' : r.homo.length ? 'Entendi "' + r.homo[0].heard + '", que tem o mesmo som de "' + r.homo[0].target + '". O microfone não separa as duas; a diferença só aparece na escrita.' : r.level === 2 ? 'Todas as palavras foram entendidas.' : 'Quase perfeito: só uma palavrinha (a, an, the ou to) ficou diferente.')]); }
    idle();
    if (hidden && tries >= 2) reveal();
    var falt = r.marks.filter(function (m) { return !m.ok; }).length;
    res.replaceChildren(h('div', { class: 'msg bad' }, h('strong', null, 'Ainda não. '),
      shown ? 'Repita com atenção as palavras em vermelho.' : falt + ' palavra(s) não bateram. Tente de novo, ou use a dica para ouvir.', shown ? marksEl(r) : null),
      h('div', { class: 'actions' }, r.pairs.length ? btn('O microfone errou, eu falei certo', function () { calAdd(r.pairs); reveal(); pass([marksEl(Fala.check(q.en, alts, fopt({ lax: q.lax }))), h('div', { class: 'small' }, 'Calibrado: "' + r.pairs[0][1] + '" agora vale como "' + r.pairs[0][0] + '" neste aparelho.')]); }) : null, tries >= 2 ? skip() : null));
  }
  function onRec(url, err) {
    if (ended) return;
    idle('Toque para gravar de novo');
    if (!url) { res.replaceChildren(h('div', { class: 'msg warn' }, err === 'not-allowed' ? 'O navegador bloqueou o microfone. Libere o microfone para este site.' : 'Não consegui gravar. Tente de novo.'), h('div', { class: 'actions' }, btn('Escrever esta frase', toWrite, '', 'pencil'))); return; }
    tries++; reveal();
    var au = new Audio(url);
    res.replaceChildren(h('div', { class: 'msg info' }, 'Compare: ouça o modelo e depois a sua voz. Ficou igual?'),
      h('div', { class: 'actions' }, say(q.en, 'Modelo'), btn('Minha voz', function () { quiet(); au.currentTime = 0; au.play(); }, '', 'spk')),
      h('div', { class: 'actions' }, btn('Ficou igual', function () { pass(h('div', null, q.en)); }, 'primary'), tries >= 2 ? skip() : null));
  }
  mic.onclick = function () {
    if (live) { if (rec) rec.stop(); return; }
    res.replaceChildren(); heard.textContent = '';
    if (SRC()) { live = true; mic.classList.add('live'); mic.replaceChildren(ico('stop', 40)); lab.textContent = 'Ouvindo... fale agora'; rec = listen(function (t) { heard.textContent = t; }, onSR, [q.en]); }
    else if (canRecord()) { live = true; mic.classList.add('live'); mic.replaceChildren(ico('stop', 40)); lab.textContent = 'Gravando... toque para parar'; rec = record(onRec); }
    else {
      reveal(); lab.textContent = 'Fale em voz alta';
      res.replaceChildren(h('div', { class: 'msg info' }, 'Este navegador não libera o microfone. Fale em voz alta, compare com o modelo e marque. No Chrome a conferência é automática.'),
        h('div', { class: 'actions' }, btn('Falei igual', function () { pass(h('div', null, q.en)); }, 'primary'), btn('Preciso repetir', function () { speak(q.en, 0.7); })));
    }
  };
  if (!hidden) speak(q.en); else if (q.ctx) speak(q.ctx[1]);
}
QV.speak = function (q, c) { speakLike(q, c, false); };
QV.say = function (q, c) { speakLike(q, c, true); };

/* ===== motor do treino ===== */
function play(qs, o) {
  qs = qs.filter(Boolean);
  if (!qs.length) { show(o.title || 'Treino', o.back, card(h('p', null, 'Não há perguntas suficientes aqui.'))); return; }
  var R = { q: qs.map(function (q) { return { q: q, retry: false, soft: false }; }), total: qs.length, first: 0 };
  function draw() {
    if (!R.q.length) return end();
    var cur = R.q[0], q = cur.q, ans = false, tl = TL[q.t] || ['Treino', 'target'];
    var head = [h('div', { class: 'qhead' }, bar(R.total - R.q.length, R.total), h('span', { class: 'frac' }, (R.total - R.q.length + 1) + '/' + R.total)), h('div', null, h('span', { class: 'chip' }, ico(tl[1], 16), tl[0]))];
    var box = h('div', { class: 'card' }, head);
    var ctx = { box: box, head: head, done: function (ok, fb, sayEn, soft) {
      if (ans) return; ans = true; R.q.shift();
      if (!ok) { cur.retry = true; R.q.splice(Math.min(2, R.q.length), 0, cur); hardAdd(q.en); }
      else {
        if (soft && !cur.soft) { cur.soft = true; cur.retry = true; R.q.push(cur); }
        else { if (!cur.retry) R.first++; hardOk(q.en); }
      }
      save(); if (sayEn) speak(sayEn);
      var again = !ok || (soft && cur.soft && R.q.indexOf(cur) >= 0);
      var nb = h('button', { type: 'button', onclick: draw }, R.q.length ? 'Continuar' : 'Ver resultado');
      var sheet = h('div', { class: 'sheet ' + (ok ? 'ok' : 'bad'), role: 'status' }, h('div', null,
        h('div', { class: 'st' }, ico(ok ? 'check' : 'x', 20), ok ? (again ? 'Certo, mas vamos repetir' : ['Muito bem!', 'Certo!', 'Isso mesmo!'][Math.floor(Math.random() * 3)]) : 'Ainda não'),
        fb ? h('div', { class: 'sb' }, fb) : null,
        again ? h('div', { class: 'small', style: 'margin-top:6px' }, ok ? 'Você precisou de dica ou de várias tentativas. Ela volta no fim.' : 'Essa volta daqui a pouco.') : null, nb));
      $app.append(sheet);
      $app.style.paddingBottom = (sheet.offsetHeight + 24) + 'px';
      setTimeout(function () { try { nb.focus({ preventScroll: true }); } catch (e) {} }, 60);
    } };
    show(o.title || 'Treino', o.back, box); document.body.classList.add('playing'); QV[q.t](q, ctx);
  }
  function end() {
    var pct = R.first / R.total, ok = !o.livre && pct >= o.thr;
    if (o.fim) o.fim(ok);
    show(o.title || 'Treino', o.back, card(h('div', { class: 'center' }, ring(pct, { big: true, color: ok || o.livre ? 'var(--ok)' : 'var(--pri)' }),
      h('h2', null, o.livre ? 'Treino concluído' : ok ? (o.nota ? 'Rodada concluída' : 'Etapa concluída') : 'Quase lá'),
      h('p', null, 'Você acertou ' + R.first + ' de ' + R.total + ' de primeira.')),
      h('div', { class: 'msg ' + (ok || o.livre ? 'ok' : 'info') }, o.livre ? 'O que você errou ficou na lista "O que errei".' : ok ? (o.nota || 'Muito bem! A etapa está marcada como feita.') : 'Para concluir, acerte pelo menos ' + Math.ceil(o.thr * R.total) + ' de primeira. Faça outra rodada.'),
      doneCount() > 0 && (!S.bk || Date.now() - S.bk > 2 * 864e5) ? h('div', { class: 'msg warn' }, h('div', null, 'Faz tempo que você não salva uma cópia do progresso.'), h('div', { class: 'actions' }, btn('Salvar cópia agora', function () { exportar(function () { go(o.back); }); }))) : null,
      h('div', { class: 'actions' }, btn(ok ? 'Voltar para a unidade' : 'Outra rodada', ok ? function () { go(o.back); } : o.again, 'primary'), btn(ok ? 'Outra rodada' : 'Voltar', ok ? o.again : function () { go(o.back); }))));
  }
  draw();
}

/* ===== progresso ===== */
function viewPerfil() {
  var tot = 0, fin = 0; BOOKS.forEach(function (b) { b.units.forEach(function (u) { var p = progOf(u); tot++; if (p[0] === p[1]) fin++; }); });
  var nd = Object.keys(S.dif).length, info = h('div'), file = h('input', { type: 'file', style: 'display:none', onchange: function () { if (file.files[0]) importar(file.files[0], function (ok) { if (ok) viewPerfil(); }); } });
  function persist() { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().then(function (g) { info.replaceChildren(h('p', { class: 'small', style: 'margin-top:10px' }, g ? 'O navegador prometeu guardar os dados deste site.' : 'O navegador não prometeu guardar os dados. Por isso salve a cópia.')); }); }
  var vel = h('select', { 'aria-label': 'Velocidade da voz', onchange: function () { S.cfg.vel = +vel.value; save(); speak('This is the speed of the voice.'); } });
  [['1', 'Normal'], ['0.85', 'Um pouco mais lenta'], ['0.7', 'Lenta'], ['0.55', 'Bem lenta']].forEach(function (o) { vel.append(h('option', { value: o[0] }, o[1])); });
  vel.value = ['1', '0.85', '0.7', '0.55'].reduce(function (a, b) { return Math.abs(+b - S.cfg.vel) < Math.abs(+a - S.cfg.vel) ? b : a; });
  var code = h('textarea', { 'aria-label': 'Código do progresso', placeholder: 'O código aparece aqui. Para importar, cole o código inteiro (começa com ESTUDO1:) e toque em Importar código.', spellcheck: 'false' }), cmsg = h('div');
  function copiar() {
    code.value = toCode(); code.focus(); code.select();
    function ok() { saved(); cmsg.replaceChildren(h('div', { class: 'msg ok' }, 'Código copiado. Cole numa conversa com você mesmo (WhatsApp, e-mail) ou numa nota.')); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code.value).then(ok, function () { cmsg.replaceChildren(h('div', { class: 'msg warn' }, 'Não consegui copiar sozinho. Segure o dedo no texto, escolha Selecionar tudo e copie.')); });
    else { try { document.execCommand('copy'); ok(); } catch (e) { cmsg.replaceChildren(h('div', { class: 'msg warn' }, 'Selecione o texto e copie.')); } }
  }
  var bk = S.bk ? 'Última cópia salva: ' + new Date(S.bk).toLocaleDateString('pt-BR') + '.' : 'Você ainda não salvou nenhuma cópia.';
  show('Meu progresso', '',
    h('div', { class: 'card center' }, ring(tot ? fin / tot : 0, { big: true }), h('h2', null, fin + ' de ' + tot + ' unidades concluídas'), h('p', { class: 'small', style: 'margin:0' }, doneCount() + ' etapas feitas no total.')),
    card(h('h3', null, 'Salvar e importar'),
      h('p', null, 'O navegador do celular pode apagar os dados sem avisar. O app guarda o progresso duas vezes no navegador, mas só a cópia em arquivo é segura de verdade. Salve uma vez por semana e guarde no Google Drive, no WhatsApp ou num e-mail para você.'),
      h('p', { class: 'small' }, bk), NOSTORE ? h('div', { class: 'msg warn', style: 'margin:0 0 10px' }, 'Este navegador não está guardando nada agora. Salve a cópia ao terminar.') : null,
      h('button', { type: 'button', class: 'primary wide', onclick: function () { baixar(viewPerfil); } }, 'Baixar arquivo de progresso'),
      h('div', { class: 'actions' }, canShareFile() ? btn('Compartilhar (Drive, WhatsApp)', function () { compartilhar(viewPerfil); }) : null, btn('Importar arquivo', function () { file.click(); })),
      h('h3', null, 'Código de segurança'),
      h('p', { class: 'small' }, 'Se o arquivo não abrir no seu celular, use o código: é um texto só, que você manda para si mesmo e cola depois.'),
      code, h('div', { class: 'actions' }, btn('Copiar código', copiar), btn('Importar código', function () { importText(code.value, function (ok) { if (ok) viewPerfil(); }); })), cmsg,
      h('div', { class: 'actions' }, btn('Pedir ao navegador para guardar', persist)), file, info),
    card(h('h3', null, 'Voz e microfone'), h('p', { class: 'small' }, 'Velocidade da voz em inglês:'), vel,
      !('speechSynthesis' in window) ? h('div', { class: 'msg warn' }, 'Este navegador não tem voz. Use o Chrome.') : !voice ? h('div', { class: 'msg warn' }, 'Não achei uma voz em inglês. No Android, instale o "Reconhecimento e síntese de fala" do Google; no Windows, adicione o idioma inglês.') : h('p', { class: 'small', style: 'margin:10px 0 0' }, 'Voz em uso: ' + voice.name + '.'),
      h('p', { class: 'small', style: 'margin:8px 0 0' }, SRC() ? 'Conferência da fala: automática (precisa de internet e do microfone liberado).' : canRecord() ? 'Conferência da fala: por gravação (você compara com o modelo). No Chrome ela é automática.' : 'Conferência da fala: indisponível neste navegador. Use o Chrome.')),
    card(h('h3', null, 'Calibração do microfone'), h('p', { class: 'small' }, 'O microfone do navegador erra mais a vogal de uma palavra solta (bread vira brad, ham vira him). O app já aceita isso como "quase". Quando ele errar outra coisa e você tiver certeza de que falou certo, toque em "O microfone errou, eu falei certo": o app aprende e passa a aceitar.'), h('p', null, calCount() ? calCount() + ' correção(ões) aprendida(s) neste aparelho.' : 'Nenhuma correção aprendida ainda.'), calCount() ? btn('Apagar as correções', function () { if (confirm('Apagar as correções do microfone?')) { S.cal = {}; save(); viewPerfil(); } }) : null),
    card(h('h3', null, 'Reforço'), h('p', null, nd ? nd + ' item(ns) que você errou e ainda não acertou de novo.' : 'Nada para reforçar agora.'), nd ? btn('Treinar o que errei', playHard, 'primary') : null),
    card(h('h3', null, 'Zerar tudo'), h('p', { class: 'small' }, 'Apaga o progresso deste aparelho. Salve uma cópia antes.'), btn('Apagar progresso', function () { if (confirm('Apagar TODO o progresso deste aparelho? Isso não dá para desfazer.')) { S = fresh(); save(); go('#'); } })));
}

/* ===== rota ===== */
function route() {
  quiet();
  var p = (location.hash || '#').slice(1).split('/');
  if (p[0] === 'u') { var u = UNITS[decodeURIComponent(p[1] || '')]; if (u) return p[2] ? viewStep(u, p[2]) : viewUnit(u); }
  if (p[0] === 'p') return viewPerfil();
  if (p[0] === 'f') return viewFalar();
  viewHome();
}
function start() {
  document.body.classList.remove('locked');
  try { loadBooks(); } catch (e) { $app.textContent = 'Erro ao ler os dados: ' + e.message; return; }
  if (!BOOKS.length) { $app.textContent = 'Nenhum livro encontrado na pasta dados.'; return; }
  S = loadState();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  if (doneCount() === 0) { idbGet(function (t) { try { var o = t && clean(JSON.parse(t)), n = 0; if (o) { Object.keys(o.prog).forEach(function (k) { n += Object.keys(o.prog[k].steps).length; }); if (n > 0) { S = o; RESTORED = n; save(); route(); } } } catch (e) {} }); }
  save();
  $tabP.onclick = function () { go('#p'); }; $tabF.onclick = function () { go('#f'); }; $tabH.onclick = function () { go('#'); };
  window.addEventListener('hashchange', route);
  document.addEventListener('visibilitychange', function () { if (document.hidden) save(); });
  route();
}

/* ===== trava (só na versão publicada): o conteúdo vem cifrado e a senha abre ===== */
function b64(s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
function normPw(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }
function decifrar(pw) {
  var C = window.__CIFRADO, sub = window.crypto && window.crypto.subtle;
  if (!sub) return Promise.reject(new Error('sem-crypto'));
  return sub.importKey('raw', new TextEncoder().encode(normPw(pw)), 'PBKDF2', false, ['deriveKey'])
    .then(function (k) { return sub.deriveKey({ name: 'PBKDF2', salt: b64(C.s), iterations: C.n, hash: 'SHA-256' }, k, { name: 'AES-GCM', length: 256 }, false, ['decrypt']); })
    .then(function (k) { return sub.decrypt({ name: 'AES-GCM', iv: b64(C.i) }, k, b64(C.c)); })
    .then(function (buf) { return JSON.parse(new TextDecoder().decode(buf)); });
}
function abrir(pw) {
  return decifrar(pw).then(function (d) {
    window.__DADOS = d; try { localStorage.setItem('estudo_k', normPw(pw)); } catch (e) {} start();
  });
}
function trava(erro) {
  document.body.classList.add('locked');
  var input = h('input', { type: 'password', autocomplete: 'current-password', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Senha de acesso', placeholder: 'Senha de acesso' }), msg = h('div');
  var go1 = h('button', { type: 'button', class: 'primary wide', style: 'margin-top:12px' }, 'Entrar');
  function enviar() {
    if (!input.value) return; go1.disabled = true; go1.textContent = 'Abrindo...'; msg.replaceChildren();
    abrir(input.value).catch(function (e) {
      go1.disabled = false; go1.textContent = 'Entrar';
      msg.replaceChildren(h('div', { class: 'msg bad' }, e && e.message === 'sem-crypto' ? 'Este navegador não consegue abrir o conteúdo protegido. Abra o endereço com https, no Chrome.' : 'Senha incorreta. Confira e tente de novo.'));
    });
  }
  go1.onclick = enviar; input.addEventListener('keydown', function (e) { if (e.key === 'Enter') enviar(); });
  show('Estudo de inglês', '', h('div', { class: 'card', style: 'margin-top:24px' }, h('h2', null, 'Acesso protegido'),
    h('p', { class: 'mut' }, 'O conteúdo do livro é protegido. Digite a senha de acesso. Ela fica guardada neste aparelho, então você só digita uma vez.'), input, go1, msg, erro ? h('div', { class: 'msg warn' }, erro) : null));
}
if (window.__CIFRADO && !window.__DADOS) {
  var guardada = null; try { guardada = localStorage.getItem('estudo_k'); } catch (e) {}
  if (guardada) abrir(guardada).catch(function () { trava(); }); else trava();
} else start();
})();
