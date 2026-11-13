"""Junta src/ + dados/ em UM arquivo: estudo.html (é ele que vai para o celular).
Uso:  python montar.py
Também confere o formato dos arquivos em dados/ e avisa de linhas com problema."""
import json, os, re, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
KEYS = {'objetivo', 'porque', 'historia', 'dica', 'cena', 'gancho', 'resumo', 'formula',
        'compare', 'ex', 'erro', 'cuidado', 'quiz'}
SECS = {'aquecimento', 'palavras', 'apoio', 'verbos', 'expressoes', 'frases', 'perguntas',
        'modelo', 'extras', 'resumo', 'dialogo'}
KINDS = {'regra', 'pegadinha', 'dica', 'vocabulario', 'idioma', 'resumo'}


def ler(*p):
    with open(os.path.join(AQUI, *p), encoding='utf-8') as f:
        return f.read()


def conferir(nome, texto):
    erros = []
    sec = None
    ultimo_key = False
    for n, raw in enumerate(texto.split('\n'), 1):
        if not raw.strip():
            ultimo_key = False
            continue
        if raw.startswith('  ') and ultimo_key:
            continue
        l = raw.strip()
        ultimo_key = False
        if l.startswith('# '):
            if ' | ' not in l:
                erros.append((n, 'cabeçalho precisa de "# Título | modulo N" ou "# Título | gramatica"'))
        elif l.startswith('['):
            sec = l[1:-1]
            if not l.endswith(']') or sec not in SECS:
                erros.append((n, 'seção desconhecida: ' + l))
        elif l.startswith('='):
            k = l[1:].split(' ')[0]
            if k not in KINDS:
                erros.append((n, 'tipo de lição desconhecido: ' + k))
            sec = None
        else:
            m = re.match(r'^(nota [a-z]+|[a-z]+): ?(.*)$', l)
            if m and (m.group(1) in KEYS or m.group(1).startswith('nota ')):
                ultimo_key = True
                c = m.group(1)
                if c == 'ex' and m.group(2).count(' | ') != 1:
                    erros.append((n, 'ex: precisa de "inglês | português"'))
                if c == 'erro' and m.group(2).count(' | ') != 3:
                    erros.append((n, 'erro: precisa de "errado | certo | tradução | por quê"'))
                if c == 'quiz' and m.group(2).count(' | ') != 2:
                    erros.append((n, 'quiz: precisa de "pergunta | certa | opção1; opção2; opção3"'))
            elif sec and ' | ' in l:
                cols = l.count(' | ') + 1
                esperado = {'modelo': 4, 'dialogo': 3}.get(sec)
                if esperado and cols != esperado:
                    erros.append((n, '[%s] precisa de %d colunas' % (sec, esperado)))
                if not esperado and cols not in (2, 3):
                    erros.append((n, 'linha com %d colunas' % cols))
            else:
                erros.append((n, 'linha não entendida: ' + l[:60]))
    return erros


def pagina(dados_js):
    html = ler('src', 'index.html')
    return (html.replace('{{CSS}}', ler('src', 'style.css'))
                .replace('{{DADOS}}', dados_js)
                .replace('{{JS}}', (ler('src', 'fala.js') + '\n' + ler('src', 'app.js')).replace('</script', '<\\/script')))


def argumento(nome):
    if nome in sys.argv:
        i = sys.argv.index(nome)
        return sys.argv[i + 1] if i + 1 < len(sys.argv) else None
    return None


def senha_do_arquivo():
    p = os.path.join(AQUI, 'senha.txt')
    if not os.path.exists(p):
        return None
    with open(p, encoding='utf-8') as f:
        return f.readline().strip() or None


def main():
    dados = {}
    total_erros = 0
    base = os.path.join(AQUI, 'dados')
    for livro in sorted(os.listdir(base)):
        pasta = os.path.join(base, livro)
        if not os.path.isdir(pasta) or livro.startswith('_'):
            continue
        arqs = {}
        for f in sorted(os.listdir(pasta)):
            if not f.endswith('.txt'):
                continue
            t = ler('dados', livro, f).replace('\r\n', '\n')
            for n, msg in conferir(f, t):
                print('  %s/%s linha %d: %s' % (livro, f, n, msg))
                total_erros += 1
            arqs[f[:-4]] = t
        nome = re.sub(r'^livro\s*', 'Livro ', livro, flags=re.I)
        dados[livro] = {'nome': nome, 'files': arqs}
    texto = json.dumps(dados, ensure_ascii=False)
    html = pagina('window.__DADOS=' + texto.replace('</', '<\\/') + ';')
    with open(os.path.join(AQUI, 'estudo.html'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(html)
    unid = sum(len(d['files']) for d in dados.values())
    print('estudo.html pronto: %d livro(s), %d unidades, %d KB, %d aviso(s)' % (
        len(dados), unid, len(html.encode('utf-8')) // 1024, total_erros))
    # versão para publicar no GitHub Pages: o conteúdo vai CIFRADO, só a senha abre
    senha = argumento('--senha') or senha_do_arquivo()
    saida = argumento('--saida') or os.path.join(AQUI, 'docs')
    if senha:
        try:
            r = subprocess.run(['node', os.path.join(AQUI, 'cifrar.js')], input=texto, capture_output=True, text=True,
                               encoding='utf-8', env=dict(os.environ, ESTUDO_SENHA=senha), timeout=120)
        except FileNotFoundError:
            print('  versão do site NÃO gerada: o Node não está instalado.')
            return 1
        if r.returncode:
            print('  versão do site NÃO gerada:', r.stderr.strip())
            return 1
        os.makedirs(saida, exist_ok=True)
        with open(os.path.join(saida, 'index.html'), 'w', encoding='utf-8', newline='\n') as f:
            f.write(pagina('window.__CIFRADO=' + r.stdout + ';'))
        open(os.path.join(saida, '.nojekyll'), 'w').close()
        print('docs/index.html pronto (cifrado, para o GitHub Pages)')
    else:
        print('Sem senha.txt: a versão do site (docs/index.html) não foi gerada.')
    return 1 if total_erros else 0


if __name__ == '__main__':
    sys.exit(main())
