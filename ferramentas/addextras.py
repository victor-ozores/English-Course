"""Acrescenta frases novas ao [extras] das unidades, sem repetir e só com palavras já ensinadas.
Uso: python ferramentas/addextras.py minhas-frases.txt
Formato do arquivo: uma linha '@08-z' por unidade e depois linhas 'inglês | português'.
"""
import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(__file__))
import vocab
B = vocab.B
units = vocab.load()
src = open(sys.argv[1], encoding='utf-8').read()
blocks = {}; cur = None
for l in src.split('\n'):
    l = l.rstrip()
    if l.startswith('@'): cur = l[1:].strip(); blocks[cur] = []
    elif l.strip() and cur and ' | ' in l: blocks[cur].append(l.strip())
def key(s): return ' '.join(vocab.nz(s))
tot = 0
for pref, lines in blocks.items():
    idx = [k for k, u in enumerate(units) if u['f'].startswith(pref)][0]; u = units[idx]
    path = os.path.join(B, u['f'] + '.txt')
    text = open(path, encoding='utf-8').read(); crlf = '\r\n' in text; text = text.replace('\r\n', '\n')
    have = set(key(r[0]) for s in vocab.SEC for r in u['secs'].get(s, []))
    ok = []; skipped = []
    for ln in lines:
        en, pt = ln.split(' | ')[:2]
        if key(en) in have: skipped.append('dup: ' + en); continue
        if len(ln.split(' | ')) != 2: skipped.append('colunas: ' + ln); continue
        bad = [b for b in vocab.check(units, idx, [ln]) if b[2] == 'NAO ensinada']
        if bad: skipped.append('VOCAB ' + ','.join(sorted(set(b[0] for b in bad))) + ' <- ' + en); continue
        have.add(key(en)); ok.append(ln)
    if '[extras]' not in text: print(pref, 'SEM [extras]'); continue
    L = text.split('\n'); i = L.index('[extras]'); j = i + 1
    while j < len(L) and not (L[j].startswith('[') or L[j].startswith('=')): j += 1
    while j > i + 1 and not L[j - 1].strip(): j -= 1
    L[j:j] = ok
    out = '\n'.join(L)
    if crlf: out = out.replace('\n', '\r\n')
    open(path, 'w', encoding='utf-8', newline='').write(out)
    tot += len(ok)
    print('%s: +%d' % (u['f'], len(ok)) + ('  | pulados: ' + ' ; '.join(skipped) if skipped else ''))
print('total', tot)
