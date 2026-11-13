# Estudo Simples (inglês) - leia só isto antes de mexer

App de estudo de inglês em 1 arquivo (`estudo.html`), para o celular. Conteúdo do livro *Hey, Ho! Let's Go!* Book 1.

## Regra de ouro: gastar pouco token
- **NÃO leia `estudo.html` nem `docs/index.html`** (são gerados, ~420 e ~540 KB). Nunca edite eles.
- Conteúdo = `dados/livro1/NN-L-chave.txt` (um arquivo por unidade, 3-8 KB). Leia SÓ o arquivo da unidade mexida. Formato: `dados/_modelo.txt`.
- Código: `src/fala.js` (comparação da fala, sem tela), `src/app.js` (telas e exercícios), `src/style.css`, `src/index.html`. Use Grep para achar a função e Edit pontual; não releia o arquivo inteiro.
- Frases novas de um módulo: acrescente linhas ` en | pt ` no `[extras]` do `NN-z-mNN.txt`, usando só palavras já ensinadas até ali. Mudou frases de módulos que têm verbos no passado/-ing? Rode `python lembretes.py` (refaz a lição "Lembrete: as formas dos verbos" de cada módulo) e depois `python montar.py`.
- Depois de qualquer mudança: `python montar.py` (confere o formato dos .txt, gera `estudo.html` local e, se existir `senha.txt`, o `docs/index.html` cifrado para o site). Mexeu em `fala.js`: `node testes/fala.test.js`.
- **Publicação:** branch `estudo-simples` do repo público `victor-ozores/English-Course`; o GitHub Pages serve só a pasta `docs/` dessa branch (https://victor-ozores.github.io/English-Course/). Mudou o app ou o conteúdo = `python montar.py`, commitar `docs/index.html` e subir (só com o OK dele).
- **`senha.txt` (local, no .gitignore) nunca sobe nem é repetido em texto.** Ela cifra o conteúdo do site; o app pede a senha na 1ª vez.
- **O repo é PÚBLICO (desde 13/11/2026, decisão dele para ter o Pages grátis).** Por isso o texto do livro em claro NUNCA entra nos commits: `dados/livro*/` está no `.gitignore`. Antes de todo `git add`, conferir que nada de `dados/livro*` entrou. O 1º commit (`a286852`, 12/11) ainda tem o texto no histórico.

## Onde fica cada coisa no app.js (procure pelo nome)
- Telas: `viewHome`, `viewUnit`, `viewFalar` (aba Falar), `viewPerfil`. Etapas: `stepIntro`, `stepList` (palavras e expressões, com `speakRow` = linha com ouvir + falar verde/vermelho), `stepVerbs` (pede o VERBO, `lax:['to']`), `stepRules`, `stepPhrases`, `stepDialog`, `stepReview`.
- Exercícios: objeto `QV` (`choose`, `quiz`, `fix`, `write`, `listen`, `tiles`, `gap`, `pairs`, `speak`, `say`); `mkQ`/`mkGap`/`buildRound` montam as perguntas; `play` é o motor da rodada (folha de resposta, repetição do que errou).
- Fala: `speakLike` (tela do microfone), `listen` (reconhecimento), `record` (gravação, quando o navegador não reconhece fala), `Fala.check` e `Fala.live` (escrita ao vivo, verde/vermelho enquanto digita) em `fala.js` (calibragem).
- Salvamento: `save` (localStorage + espelho em IndexedDB), `baixar`/`compartilhar`/`toCode`/`importText` (aba Progresso). Trava do site: `trava`/`abrir`/`decifrar` (Web Crypto) e `cifrar.js`.
- Arrastar: `dragify`. Ícones: `ICO`. Textos das etapas: `INFO`.

## Arquivos de dados
- Nome: `NN-L-chave.txt`. `NN` = módulo ao qual a unidade pertence; `L` = `a`,`b`... para gramática que vem ANTES do módulo `NN`, `z` para o módulo. A ordem na tela é a ordem alfabética do nome.
- Livro novo = pasta nova `dados/livro2/`; o app mostra um seletor de livro sozinho.
- Texto: `**negrito**`, `{{inglês|português}}` (toque = ouve e mostra a tradução). Separador de colunas é ` | ` e não pode aparecer dentro do texto. Linha começando com 2 espaços continua o campo anterior.
- `erro:` vira pergunta "qual frase está certa?": use só frases de verdade (dica de pronúncia vai no `porque:`).
- `dados/CORRECOES.md` lista as frases do livro que foram corrigidas (11/11/2026). Não desfazer sem ele pedir. **`dados/livro*/` e `CORRECOES.md` estão no .gitignore: só existem neste computador** (faça cópia de segurança da pasta `dados/`).

## Decisões (não desfazer)
- Etapas por unidade: intro > palavras > verbos > expressões > regras > frases > conversa > revisão. Só aparecem as que têm dados. Rodada conclui com 70% certas de primeira. Sem trava.
- **Fala é o centro** (pedido dele: só aprende verbo falando certo). Verbos só concluem na rodada falada. Calibragem: toda palavra de conteúdo tem de ser entendida, na ordem; só um artigo pode faltar/sobrar em frase de 4+ palavras; contrações, números e sons iguais contam como certos. Precisou de 3+ tentativas ou de dica = a frase volta no fim e não conta como "de primeira".
- **Vogal duvidosa (14/11/2026):** o reconhecimento do Chrome erra a vogal de palavra solta (bread/brad, ham/him). `Fala.check` aceita como nível 1 (VERDE, com aviso "o microfone entendeu X, ele confunde a vogal") quando `pkey` (consoantes + desenho das vogais) bate, só para palavra/verbo solto (aí vale também só as consoantes batendo, ex.: ham/him/hmm/hem, mas não hat) ou palavras de `[palavras]` (`SOFTW`) dentro de frases; `STRICT` (went, want, can, do/does/did, pronomes, preposições...) nunca recebe esse perdão, e linhas de passado usam `soft:false`. Também usa os parciais/alternativas do navegador e a calibração pessoal `S.cal` (botão "O microfone errou, eu falei certo", `calAdd`). Aviso de mesmo som (`homo`, ex.: meat/meet) e dicas `SpeechRecognitionPhrase` em `listen(…, hints)` (só se o Chrome tiver; recusou = ouve sem dica). Mexeu nisso: rodar `node testes/fala.test.js` (83 testes).
- Sem gamificação, sem emoji, cores só azul/verde/vermelho/âmbar/cinza, sem gradiente.
- Progresso: `localStorage` chave `estudo_v1` + espelho no IndexedDB (restaura sozinho se o localStorage sumir) + cópia em arquivo ou código `ESTUDO1:` (aba Progresso). Mudou o formato do save = subir `v` e tratar em `clean()`.
- Sem dependências, sem npm. O site publicado entrega o conteúdo SÓ cifrado (texto do livro é protegido); nunca publicar `dados/` em claro nem `estudo.html`.
- README segue o molde do Radar Pricing (banner, botões SVG em `docs/img/botoes`, seções com emoji, 1ª pessoa, fecho do Claude Code). Atualize as contagens quando mudarem.

## Testar
`python -m http.server 8765` nesta pasta e abrir `http://localhost:8765/estudo.html` no painel, tamanho celular 375x812, com o painel visível (escondido, a animação trava). O painel não tem microfone: para testar a fala, troque `window.SpeechRecognition` por uma classe falsa que devolve um texto. Nunca foi testado em celular de verdade.
