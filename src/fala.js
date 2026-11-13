/* Compara o que o microfone entendeu com a frase certa.
   Sem tela: dá para testar com  node testes/fala.test.js
   Regras da calibragem:
   - toda palavra de conteúdo precisa ser entendida, na ordem (verbo, do/does/did, not, preposição...);
   - só um artigo (a, an, the) pode faltar ou sobrar, e só em frase com 4 palavras ou mais;
   - "don't" = "do not", "15" = "fifteen", "to/too/two" e outros sons iguais contam como certos. */
var Fala = (function () {
  'use strict';
  var CONTR = {
    "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "can't": 'can not', cannot: 'can not',
    "won't": 'will not', "wouldn't": 'would not', "couldn't": 'could not', "shouldn't": 'should not',
    "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
    "haven't": 'have not', "hasn't": 'has not',
    "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are',
    "he's": 'he is', "she's": 'she is', "it's": 'it is', "that's": 'that is', "there's": 'there is',
    "what's": 'what is', "where's": 'where is', "who's": 'who is',
    "i'd": 'i would', "you'd": 'you would', "he'd": 'he would', "she'd": 'she would', "we'd": 'we would', "they'd": 'they would',
    "i'll": 'i will', "you'll": 'you will', "he'll": 'he will', "she'll": 'she will', "it'll": 'it will', "we'll": 'we will', "they'll": 'they will',
    "let's": 'let us', gonna: 'going to', wanna: 'want to'
  };
  /* sons iguais (ou grafias diferentes da mesma palavra): a 1ª de cada grupo é a forma usada na comparação */
  var GROUPS = ['to too two', 'for four fore', 'ate eight', 'by buy bye', 'know no', 'knew new', 'write right', 'red read',
    'meat meet', 'son sun', 'hi high', 'one won', 'see sea c', 'be bee b', 'here hear', 'where wear', 'our hour', 'week weak',
    'would wood', 'bread bred', 'tea tee t', 'i eye', 'you u', 'are r', 'why y', 'oh o', 'aunt ant', 'male mail', 'pair pear',
    'sell cell', 'sent cent scent', 'hole whole', 'night knight', 'piece peace', 'plane plain', 'wait weight', 'way weigh',
    'which witch', 'role roll', 'sale sail', 'tale tail', 'through threw thru', 'blue blew', 'road rode', 'heard herd',
    'made maid', 'seen scene', 'site sight', 'some sum', 'knows nose', 'flew flu', 'break brake', 'add ad', 'in inn',
    'not knot', 'so sew', 'do due', 'dear deer', 'flour flower', 'wore war', 'taught taut', 'ok okay', 'mom mum',
    'favorite favourite', 'color colour', 'traveled travelled', 'theater theatre', 'and n', 'gray grey', 'toward towards'];
  var CANON = {};
  GROUPS.forEach(function (g) { var w = g.split(' '); w.forEach(function (x) { CANON[x] = w[0]; }); });
  /* palavras que o microfone troca por outra de mesmo som */
  var SOUND = { your: 'you are', its: 'it is', their: 'they are', there: 'they are', whose: 'who is' };
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  var WEAK = { a: 1, an: 1, the: 1 };
  var FILL = { uh: 1, um: 1, ah: 1, er: 1, hmm: 1 };

  function num(n) {
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
    return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + num(n % 100) : '');
  }
  function digits(s) {
    if (s.length <= 3) return num(+s);
    if (s.length === 4) {
      var a = +s.slice(0, 2), b = +s.slice(2);
      if (a % 10 === 0 && b < 10) return num(a / 10) + ' thousand' + (b ? ' ' + num(b) : '');
      return num(a) + ' ' + (b === 0 ? 'hundred' : b < 10 ? 'oh ' + num(b) : num(b));
    }
    return s.split('').map(function (d) { return ONES[+d]; }).join(' ');
  }
  /* uma palavra da tela -> lista de pedaços comparáveis. strict = só contrações e números (para a escrita) */
  function toks(word, strict) {
    var out = [];
    String(word).toLowerCase().replace(/[’‘`]/g, "'").split(/[^a-z0-9']+/).forEach(function (raw) {
      raw = raw.replace(/^'+|'+$/g, '');
      if (!raw) return;
      var parts;
      if (CONTR[raw]) parts = CONTR[raw].split(' ');
      else if (/^\d+$/.test(raw)) parts = digits(raw).split(' ');
      else parts = [raw.replace(/'s$/, 's').replace(/'/g, '')];
      parts.forEach(function (p) {
        if (strict) { out.push(p); return; }
        (SOUND[p] ? SOUND[p].split(' ') : [p]).forEach(function (x) { out.push(CANON[x] || x); });
      });
    });
    return out;
  }
  function words(text, strict) {
    return String(text).split(/\s+/).map(function (w) { return { w: w, t: toks(w, strict) }; }).filter(function (o) { return o.t.length; });
  }
  function flat(text, strict) {
    var out = [];
    words(text, strict).forEach(function (o) { out.push.apply(out, o.t); });
    return out;
  }
  function align(a, b) {
    var n = a.length, m = b.length, d = [], i, j;
    for (i = 0; i <= n; i++) { d.push([]); for (j = 0; j <= m; j++) d[i].push(0); }
    for (i = 1; i <= n; i++) for (j = 1; j <= m; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
    var ma = [], mb = [];
    for (i = 0; i < n; i++) ma.push(false);
    for (j = 0; j < m; j++) mb.push(false);
    i = n; j = m;
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) { ma[i - 1] = mb[j - 1] = true; i--; j--; }
      else if (d[i - 1][j] >= d[i][j - 1]) i--; else j--;
    }
    return { ma: ma, mb: mb, lcs: d[n][m] };
  }
  /* "post card" x "postcard", "wi fi" x "wifi": acerta o que foi ouvido para o jeito da frase certa */
  function compounds(h, t) {
    var has = {}, pair = {}, i, out = [], out2 = [];
    t.forEach(function (x) { has[x] = 1; });
    for (i = 0; i + 1 < t.length; i++) pair[t[i] + t[i + 1]] = [t[i], t[i + 1]];
    for (i = 0; i < h.length; i++) {
      if (i + 1 < h.length && has[h[i] + h[i + 1]] && !(has[h[i]] && has[h[i + 1]])) { out.push(h[i] + h[i + 1]); i++; }
      else out.push(h[i]);
    }
    out.forEach(function (x) { if (!has[x] && pair[x]) { out2.push(pair[x][0], pair[x][1]); } else out2.push(x); });
    return out2;
  }
  /* "I I want" (gaguejou) vira "I want", a não ser que a frase certa repita a palavra */
  function stutter(h, t) {
    var rep = {}, i;
    for (i = 0; i + 1 < t.length; i++) if (t[i] === t[i + 1]) rep[t[i]] = 1;
    return h.filter(function (x, k) { return k === 0 || x !== h[k - 1] || rep[x]; });
  }
  function every(list, ok) { for (var i = 0; i < list.length; i++) if (!ok(list[i])) return false; return true; }

  /* "som aproximado" de uma palavra: mantém as consoantes e marca onde há vogal (V), sem dizer qual vogal.
     bread, brad, bred => brVd | ham, him, hem => hVm | cheese, chase => CVs.
     O microfone erra mais a vogal de uma palavra solta do que a consoante. */
  function pkey(w) {
    w = String(w).toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return '';
    w = w.replace(/^kn/, 'n').replace(/^wr/, 'r').replace(/^wh/, 'w').replace(/^ps/, 's').replace(/mb$/, 'm');
    w = w.replace(/ph/g, 'f').replace(/tch/g, 'C').replace(/ck/g, 'k').replace(/dge/g, 'j').replace(/qu/g, 'kw').replace(/x/g, 'ks');
    w = w.replace(/sh/g, 'S').replace(/ch/g, 'C').replace(/th/g, 'T').replace(/gh/g, '');
    w = w.replace(/c(?=[eiy])/g, 's').replace(/c/g, 'k');
    w = w.replace(/(.)\1+/g, '$1');
    if (w.length > 3 && /[^aeiouy]e$/.test(w)) w = w.slice(0, -1);
    w = w.replace(/^y/, 'j').replace(/[aeiouy]+/g, 'V');
    return w;
  }
  /* mesma consoante e mesmo desenho de vogais, só a vogal muda (ex.: bread / brad) */
  function softEq(a, b) {
    if (!a || !b || a === b || a.length < 3 || b.length < 2) return false;
    var k = pkey(a);
    return k.length >= 2 && k === pkey(b);
  }
  /* palavras que NUNCA recebem esse perdão: trocar a vogal muda a gramática (went/want, can/can't, has/his...) */
  var STRICT = {};
  ('to do does did not no can will would is am are was were be been have has had a an the i you he she it we they me my your his her ' +
    'its our their this that these those and or but of in on at for from with by went want see say said than then them they\'re').split(' ')
    .forEach(function (w) { STRICT[w] = 1; });
  function setOf(list) {
    var o = {};
    [].concat(list || []).forEach(function (x) { toks(x).forEach(function (t) { o[t] = 1; }); });
    return o;
  }
  /* correções pessoais: { palavraCerta: ['o que o microfone ouviu', ...] } */
  function applyCal(H, T, cal) {
    if (!cal) return H;
    var rev = {}, inT = {};
    T.forEach(function (t) { inT[t] = 1; });
    Object.keys(cal).forEach(function (t) { if (inT[t]) cal[t].forEach(function (h) { if (!inT[h]) rev[h] = t; }); });
    return H.map(function (h) { return rev[h] || h; });
  }

  /* target = frase certa; alts = o que o microfone entendeu (uma ou mais opções).
     opt.lax  = palavras que podem faltar (ex.: ['to'] num verbo solto)
     opt.soft = true (palavra solta) ou lista de palavras que aceitam vogal duvidosa (ex.: o vocabulário do módulo)
     opt.cal  = correções pessoais { palavraCerta: [ouvido, ...] }
     nível 2 = perfeito, 1 = bom (só um artigo, ou uma vogal duvidosa), 0 = ainda não */
  function check(target, alts, opt) {
    opt = opt || {};
    var lax = opt.lax || [];
    var W = words(target), T = flat(target), best = null;
    var softAll = opt.soft === false ? false : (opt.soft === true || T.length === 1 || (T.length === 2 && T[0] === 'to' && lax.indexOf('to') >= 0)), softSet = Array.isArray(opt.soft) ? setOf(opt.soft) : null;
    function elig(t) { return !STRICT[t] && (softAll || (softSet && softSet[t])); }
    [].concat(alts || []).forEach(function (alt) {
      var H = stutter(compounds(applyCal(flat(alt), T, opt.cal), T), T), d = align(H, T), i, j;
      var missI = [], extraI = [], used = {}, softIdx = {}, nSoft = 0;
      for (i = 0; i < T.length; i++) if (!d.mb[i]) missI.push(i);
      for (j = 0; j < H.length; j++) if (!d.ma[j]) extraI.push(j);
      missI.forEach(function (ti) {
        if (!elig(T[ti])) return;
        for (var k = 0; k < extraI.length; k++) {
          var hj = extraI[k];
          if (!used[hj] && softEq(T[ti], H[hj])) { used[hj] = 1; softIdx[ti] = H[hj]; nSoft++; break; }
        }
      });
      var miss = missI.filter(function (ti) { return !softIdx[ti]; }).map(function (ti) { return T[ti]; });
      var extra = extraI.filter(function (hj) { return !used[hj]; }).map(function (hj) { return H[hj]; });
      var level = 0;
      if (!T.length || !H.length) level = 0;
      else if (!miss.length && !extra.length) level = nSoft ? 1 : 2;
      else if (miss.length <= 1 && extra.length <= 1 &&
        every(miss, function (x) { return lax.indexOf(x) >= 0 || (WEAK[x] && T.length >= 4); }) &&
        every(extra, function (x) { return WEAK[x] || FILL[x] || lax.indexOf(x) >= 0; })) level = 1;
      var pct = T.length && H.length ? (d.lcs + nSoft) / Math.max(T.length, H.length) : 0;
      if (!best || level > best.level || (level === best.level && pct > best.pct)) {
        var pairs = [];
        for (var z = 0; z < Math.min(miss.length, extra.length); z++) pairs.push([miss[z], extra[z]]);
        best = { level: level, pct: pct, heard: alt, mb: d.mb, softIdx: softIdx, nSoft: nSoft, pairs: pairs };
      }
    });
    if (!best) best = { level: 0, pct: 0, heard: '', mb: [], softIdx: {}, nSoft: 0, pairs: [] };
    var k = 0, marks = W.map(function (o) {
      var ok = true, soft = false;
      o.t.forEach(function () { if (best.softIdx[k]) soft = true; else if (!best.mb[k]) ok = false; k++; });
      if (!ok && best.level > 0) { ok = true; soft = true; }  // faltou só uma palavrinha aceita (a, an, the, to): fica amarela
      return { w: o.w, ok: ok, soft: ok && soft };
    });
    /* palavras que soam iguais (meat/meet): o microfone não separa; avisa em vez de parecer erro do app */
    var Ts = flat(target, true), Hs = flat(best.heard, true), inT = {}, homo = [], seenH = {};
    Ts.forEach(function (t) { inT[t] = 1; });
    Hs.forEach(function (hh) {
      if (inT[hh] || !CANON[hh] || seenH[hh]) return;
      for (var q = 0; q < Ts.length; q++) if (Ts[q] !== hh && !STRICT[Ts[q]] && CANON[Ts[q]] === CANON[hh]) { homo.push({ target: Ts[q], heard: hh }); seenH[hh] = 1; break; }
    });
    var softList = [];
    Object.keys(best.softIdx).forEach(function (ti) { softList.push({ target: T[ti], heard: best.softIdx[ti] }); });
    return { ok: best.level > 0, level: best.level, pct: best.pct, heard: best.heard, marks: marks, soft: softList, pairs: best.pairs, homo: best.level > 0 ? homo : [] };
  }
  /* escrita: aceita "do not" por "don't" e "15" por "fifteen", mas a grafia tem de estar certa */
  function sameWritten(a, b) { return flat(a, true).join(' ') === flat(b, true).join(' '); }

  /* conferência enquanto digita: cada palavra digitada fica ok (verde), bad (vermelha) ou part (ainda digitando).
     full = a frase já está completa e certa. */
  function live(target, typed) {
    var G = flat(target, true), orig = String(target).toLowerCase().replace(/[’‘`]/g, "'").split(/\s+/)
      .map(function (w) { return w.replace(/[^a-z0-9']/g, ''); }).filter(Boolean);
    var partial = typed.length > 0 && !/\s$/.test(typed);
    var tw = String(typed).split(/\s+/).filter(Boolean).map(function (w) { return { w: w, t: toks(w, true) }; });
    var F = [], owner = [];
    tw.forEach(function (o, wi) { o.t.forEach(function (x) { F.push(x); owner.push(wi); }); });
    var d = align(F, G), okw = tw.map(function () { return true; });
    owner.forEach(function (wi, k) { if (!d.ma[k]) okw[wi] = false; });
    var marks = tw.map(function (o, i) {
      if (!o.t.length) return { w: o.w, s: 'ok' };
      if (okw[i]) return { w: o.w, s: 'ok' };
      if (partial && i === tw.length - 1) {
        var p = o.w.toLowerCase().replace(/[’‘`]/g, "'").replace(/[^a-z0-9']/g, '');
        if (p && orig.some(function (x) { return x.indexOf(p) === 0; })) return { w: o.w, s: 'part' };
      }
      return { w: o.w, s: 'bad' };
    });
    return { marks: marks, full: !!F.length && sameWritten(typed, target) };
  }

  return { check: check, flat: flat, sameWritten: sameWritten, live: live, pkey: pkey, softEq: softEq };
})();
if (typeof module !== 'undefined') module.exports = Fala;
