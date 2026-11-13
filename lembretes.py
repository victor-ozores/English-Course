"""Gera (ou atualiza) em cada módulo a lição "Lembrete: as formas dos verbos deste módulo".
Ela lista só as formas que aparecem nas frases do módulo e que mudam de aparência:
o passado (needed, took, bought), a 3ª pessoa com mudança (has, goes, studies) e o -ing com mudança (making, running).
Uso:  python lembretes.py     (depois:  python montar.py)
É seguro rodar de novo: a lição antiga é trocada pela nova."""
import glob, os, re, sys

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dados', 'livro1')
TITULO = 'Lembrete: as formas dos verbos deste módulo'

IRREG = {  # verbo: passado
    'be': 'was/were', 'have': 'had', 'do': 'did', 'go': 'went', 'get': 'got', 'make': 'made', 'take': 'took',
    'buy': 'bought', 'sell': 'sold', 'bring': 'brought', 'think': 'thought', 'fight': 'fought', 'catch': 'caught',
    'teach': 'taught', 'keep': 'kept', 'sleep': 'slept', 'feel': 'felt', 'leave': 'left', 'meet': 'met',
    'send': 'sent', 'spend': 'spent', 'bend': 'bent', 'hear': 'heard', 'hold': 'held', 'pay': 'paid',
    'tell': 'told', 'find': 'found', 'begin': 'began', 'drink': 'drank', 'ring': 'rang', 'sink': 'sank',
    'sit': 'sat', 'dig': 'dug', 'know': 'knew', 'grow': 'grew', 'fly': 'flew', 'speak': 'spoke', 'break': 'broke',
    'wake': 'woke', 'freeze': 'froze', 'wear': 'wore', 'tear': 'tore', 'forget': 'forgot', 'eat': 'ate',
    'give': 'gave', 'become': 'became', 'stand': 'stood', 'bite': 'bit', 'hide': 'hid', 'forgive': 'forgave',
    'come': 'came', 'run': 'ran', 'see': 'saw', 'say': 'said', 'write': 'wrote', 'drive': 'drove', 'lose': 'lost',
    'win': 'won', 'build': 'built', 'ride': 'rode', 'sing': 'sang', 'swim': 'swam', 'steal': 'stole',
}
DOBRA = {'stop', 'plan', 'drop', 'hug', 'chat', 'shop', 'jog', 'tip', 'rob', 'sit', 'run', 'swim', 'get', 'put', 'hit', 'cut', 'begin', 'win', 'dig', 'chat', 'travel_'}
EXTRA = ('ask adopt bark call clean close cook dance exercise help improve invite joke laugh like listen live love mock need '
         'open play practice prefer pray stop study talk tease travel try type use visit walk wash watch work want admire '
         'believe intend enjoy arrive start stay marry answer carry fix pass watch hate learn download access').split()
VOGAL = 'aeiou'


def forma_passado(v):
    if v in IRREG: return IRREG[v]
    if v.endswith('e'): return v + 'd'
    if v.endswith('y') and v[-2] not in VOGAL: return v[:-1] + 'ied'
    if v in DOBRA: return v + v[-1] + 'ed'
    return v + 'ed'


def forma_ing(v):
    if v.endswith('ie'): return v[:-2] + 'ying'
    if v.endswith('e') and not v.endswith(('ee', 'ye', 'oe')): return v[:-1] + 'ing'
    if v in DOBRA: return v + v[-1] + 'ing'
    return v + 'ing'


def forma_s(v):
    if v == 'have': return 'has'
    if v.endswith(('s', 'sh', 'ch', 'x', 'z', 'o')): return v + 'es'
    if v.endswith('y') and v[-2] not in VOGAL: return v[:-1] + 'ies'
    return v + 's'


def toks(t):
    return [w.lower().strip("'") for w in re.findall(r"[A-Za-z']+", t)]


def main():
    arquivos = sorted(glob.glob(os.path.join(BASE, '*-z-m*.txt')))
    bases = set(EXTRA) | set(IRREG)
    for f in glob.glob(os.path.join(BASE, '*.txt')):
        sec = None
        for l in open(f, encoding='utf-8').read().split('\n'):
            s = l.strip()
            if s.startswith('['): sec = s[1:-1]; continue
            if s.startswith(('=', '# ')): sec = None
            if sec == 'verbos' and ' | ' in s:
                v = s.split(' | ')[0].replace('to ', '').strip()
                if re.fullmatch(r'[a-z]+', v): bases.add(v)
    mapa = {}  # forma -> (verbo, tipo, rotulo)
    for v in sorted(bases):
        if v in ('be', 'do', 'call', 'use'): continue  # was/were e did/does têm gramática própria; called é só adjetivo aqui
        p = forma_passado(v)
        for pp in p.split('/'):
            if pp != v and pp not in bases: mapa.setdefault(pp, (v, 'passado', pp))
        i = forma_ing(v)
        if i != v + 'ing': mapa.setdefault(i, (v, 'ing', i))
        s3 = forma_s(v)
        if s3 != v + 's' and v != 'be': mapa.setdefault(s3, (v, 's', s3))
    mapa.pop('left', None)  # "left" também é esquerda (turn left)
    mapa.pop('saw', None) if False else None
    feitos = 0
    for f in arquivos:
        mod = int(os.path.basename(f)[:2])
        if mod < 6: continue
        linhas = open(f, encoding='utf-8').read().split('\n')
        # tira a lição antiga, se houver
        i = next((k for k, l in enumerate(linhas) if l.startswith('=') and TITULO in l), None)
        if i is not None:
            j = i + 1
            while j < len(linhas) and not linhas[j].startswith('='): j += 1
            del linhas[i:j]
        sec = None; frases = []
        for l in linhas:
            s = l.strip()
            if s.startswith('['): sec = s[1:-1]; continue
            if s.startswith(('=', '# ')): sec = None
            en = pt = None
            if sec in ('aquecimento', 'frases', 'perguntas', 'extras', 'resumo') and ' | ' in s:
                c = s.split(' | '); en, pt = c[0], c[1]
            elif sec == 'dialogo' and ' | ' in s:
                c = s.split(' | '); en, pt = c[1], c[2]
            elif s.startswith('ex: ') and ' | ' in s:
                en, pt = s[4:].split(' | ')[:2]
            if en: frases.append((en, pt))
        achadas = {}
        for en, pt in frases:
            for w in toks(en):
                if w in mapa and w not in bases:
                    v, tipo, rot = mapa[w]
                    achadas.setdefault((tipo, v, rot), []).append((en, pt))
        if sum(1 for k in achadas) < 3:
            if i is not None:
                with open(f, 'w', encoding='utf-8', newline='\n') as arq:
                    arq.write('\n'.join(linhas))
            continue
        irregulares = lambda k: (0 if (k[0] == 'passado' and k[1] in IRREG) else 1, k[1])
        por_tipo = {'passado': [], 's': [], 'ing': []}
        for k in sorted(achadas, key=irregulares): por_tipo[k[0]].append(k)
        for t in por_tipo: por_tipo[t] = por_tipo[t][:16]
        formula = []
        nomes = {'passado': 'PASSADO (já aconteceu)', 's': 'HE, SHE, IT (o verbo muda)', 'ing': 'COM -ING (está acontecendo)'}
        for t in ('passado', 's', 'ing'):
            if not por_tipo[t]: continue
            formula.append(nomes[t] if not formula else nomes[t])
            for (_, v, rot) in por_tipo[t]:
                extra = ' (irregular)' if (t == 'passado' and v in IRREG) else ''
                formula.append('to %s  >  %s%s' % (v, rot, extra))
        porque = []
        if por_tipo['passado']:
            porque.append('**Passado.** A maioria dos verbos ganha **-ed** (to need > needed). Alguns mudam por inteiro e não seguem regra (to buy > bought, to take > took, to sell > sold, to go > went). Quando uma frase tiver um verbo que você não reconhece, procure aqui o verbo básico.')
        if por_tipo['s']:
            porque.append('**He, she, it.** O verbo ganha -s, e alguns mudam mais: have > has, go > goes, do > does, study > studies, watch > watches.')
        if por_tipo['ing']:
            porque.append('**-ing.** O e some (make > making, write > writing), ou a última letra dobra (run > running, swim > swimming).')
        porque.append('Depois de **did**, **didn\'t**, **to**, **can** e **will**, o verbo volta para a forma básica, a que está no dicionário.')
        exemplos = []
        usados = set()
        for k in sorted(achadas, key=irregulares):
            for en, pt in achadas[k]:
                if en not in usados and len(exemplos) < 4:
                    usados.add(en); exemplos.append((en, pt))
                    break
        L = ['', '=dica ' + TITULO,
             'gancho: Alguns verbos aparecem nas frases com **outra cara**. Aqui estão as formas que você vai encontrar neste módulo e o verbo básico de cada uma, para ninguém ser pego de surpresa.',
             'resumo: Se um verbo parecer estranho, procure o verbo básico (o do dicionário) nesta lista.']
        L.append('formula: ' + formula[0])
        L += ['  ' + x for x in formula[1:]]
        L.append('porque: ' + porque[0])
        L += ['  ' + x for x in porque[1:]]
        for en, pt in exemplos: L.append('ex: %s | %s' % (en, pt))
        # insere antes da primeira lição
        j = next((k for k, l in enumerate(linhas) if l.startswith('=')), len(linhas))
        novo = linhas[:j] + [x for x in L[1:]] + [''] + linhas[j:] if j < len(linhas) else linhas + L
        open(f, 'w', encoding='utf-8', newline='\n').write('\n'.join(novo).replace('\n\n\n', '\n\n'))
        feitos += 1
        print('M%02d: %d formas (%s)' % (mod, len(achadas), ', '.join('%s %d' % (t, len(v)) for t, v in por_tipo.items() if v)))
    print('lições de lembrete:', feitos)


if __name__ == '__main__':
    main()
