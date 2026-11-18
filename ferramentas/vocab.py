"""Confere o vocabulário das frases de cada unidade.
Uso: python ferramentas/vocab.py ctx 08-z   (mostra as palavras que a unidade ensina)
"""
import os, re, sys, unicodedata
sys.stdout.reconfigure(encoding='utf-8')
B = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dados', 'livro1')
SEC = ['palavras','apoio','verbos','expressoes','aquecimento','frases','perguntas','extras','resumo']
def nz(s):
    s = s.lower().replace('’', "'")
    return re.findall(r"[a-z]+(?:'[a-z]+)?", s)
def strip(x):
    x = re.sub(r'\{\{([^|}]*)\|[^}]*\}\}', r'\1', x); return x.replace('**', '')
def load():
    units = []
    for f in sorted(os.listdir(B)):
        if f.startswith('_') or not f.endswith('.txt'): continue
        u = {'f': f[:-4], 'secs': {}, 'title': '', 'extras_n': 0}
        cs = None
        for raw in open(os.path.join(B, f), encoding='utf-8').read().replace('\r\n', '\n').split('\n'):
            l = raw.strip()
            if l.startswith('# '): u['title'] = l[2:].split(' | ')[0]
            if l.startswith('[') and l.endswith(']'): cs = l[1:-1]; u['secs'].setdefault(cs, []); continue
            if l.startswith('=') or l.startswith('#'): cs = None; continue
            if cs in SEC or cs in ('dialogo',):
                if ' | ' in l and not raw.startswith('  '): u['secs'][cs].append([strip(x.strip()) for x in l.split(' | ')])
        units.append(u)
    return units
BASE = set("a an the i you he she it we they my your his her our their its me him us them this that these those is am are was were be been do does did not no yes and or but with at in on to from for of by about as if when where what who why how which there here very too also can will would could should have has had get go going used some any all every each one two three four five six seven eight nine ten please thanks thank hello hi good morning afternoon evening night".split())
def stems(w):
    out = {w}
    for suf in ('s','es','ed','d','ing'):
        if w.endswith(suf): out.add(w[:-len(suf)])
    if w.endswith('ies'): out.add(w[:-3]+'y')
    if w.endswith('ied'): out.add(w[:-3]+'y')
    if w.endswith('ing'): out.add(w[:-3]+'e'); 
    if len(w)>4 and w[-1]==w[-2]: out.add(w[:-1])
    if w.endswith('ing') and len(w)>5 and w[-4]==w[-5]: out.add(w[:-4])
    if w.endswith('ed') and len(w)>4 and w[-3]==w[-4]: out.add(w[:-3])
    return out
def taught_upto(units, i):
    T = set(BASE)
    for u in units[:i+1]:
        for s in ('palavras','apoio','verbos','expressoes'):
            for r in u['secs'].get(s, []):
                for c in r[:3] if s=='verbos' else r[:1]:
                    for w in nz(c): T.add(w)
    return T
def appeared_upto(units, i):
    A = set()
    for u in units[:i+1]:
        for s in SEC:
            for r in u['secs'].get(s, []):
                for w in nz(r[0]): A.add(w)
        for r in u['secs'].get('dialogo', []):
            for w in nz(r[1]): A.add(w)
    return A
def check(units, i, lines):
    T = taught_upto(units, i); A = appeared_upto(units, i); bad = []
    for ln in lines:
        en = ln.split(' | ')[0]
        for w in nz(en):
            if not (stems(w) & T):
                bad.append((w, en, 'ja apareceu' if (stems(w) & A) else 'NAO ensinada'))
    return bad
if __name__ == '__main__':
    units = load()
    if sys.argv[1] == 'ctx':
        for a in sys.argv[2:]:
            i = [k for k, u in enumerate(units) if u['f'].startswith(a)][0]; u = units[i]
            prev = taught_upto(units, i-1) if i else set(BASE); cur = taught_upto(units, i)
            new = sorted(cur - prev)
            print('=== ' + u['f'] + ' | ' + u['title'])
            print('palavras novas:', ', '.join(new))
            ex = [r[0] for r in u['secs'].get('extras', [])]
            print('extras (%d), amostra:' % len(ex), ' // '.join(ex[:5]))
            print('aquecimento:', ' // '.join(r[0] for r in u['secs'].get('aquecimento', [])[:3]))
