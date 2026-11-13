# Estudo de inglês (Hey, Ho! Let's Go! - Book 1)

Duas formas de abrir, sempre no **Chrome** (é nele que a voz e a conferência da fala funcionam; a conferência precisa de internet):

- **Pelo link do site** (GitHub Pages): fica fácil no celular e o Chrome guarda a permissão do microfone. Pede a **senha de acesso** na primeira vez. A senha está no arquivo `senha.txt` desta pasta.
- **Pelo arquivo `estudo.html`** (não precisa de senha nem de internet, mas o Chrome pergunta a permissão do microfone a cada toque).

## Como estudar
1. Toque em **Continuar**.
2. Cada unidade segue a ordem: **Comece por aqui > Palavras > Verbos > Expressões > Regras (o porquê) > Frases > Conversa > Revisão final**.
3. As unidades "Gramática" (do, does, did, will...) aparecem antes do módulo que precisa delas.
4. Para concluir uma etapa de treino: **70% certas de primeira**. O que você erra volta na rodada e vai para "O que errei".

## Falar (o centro do app)
- **Palavras, verbos e expressões**: cada linha tem o alto-falante (ouvir) e o microfone (falar). Verde = você falou certo; vermelho = tente de novo. Verbos: todos verdes = etapa concluída.
- **Verbos**: o app pede o **verbo** ("to talk"), não a frase. O "to" do começo pode faltar; o verbo não.
- Aba **Falar**: repetir vendo a frase, falar sem ler (português para inglês) ou só verbos.
- Toda palavra importante precisa sair, na ordem. "He work" não passa por "He works". Só um artigo (a, an, the) pode faltar. "Don't" = "do not"; "15" = "fifteen".
- Precisou de 3 tentativas ou usou a dica? A frase passa, mas **volta no fim** da rodada.
- Sem fone ou sem poder falar: toque em **Escrever esta frase**. As palavras ficam verdes ou vermelhas **enquanto você digita**.
- Limite: o microfone confirma que cada palavra foi entendida; não mede sotaque fino.

## Exercícios
Falar, falar sem ler, arrastar para montar a frase, completar arrastando, ligar os pares, escrever, ouvir e escrever, escolher e "qual está certa?".

## Salvar o progresso (importante no celular)
O navegador do celular pode apagar os dados sem avisar. O app guarda o progresso **duas vezes** no navegador, mas a cópia segura é a sua. Na aba **Progresso**:
- **Baixar arquivo de progresso**: gera `progresso-estudo-DATA.json`.
- **Compartilhar** (aparece no celular): manda para o Drive ou WhatsApp.
- **Copiar código**: um texto só (começa com `ESTUDO1:`); cole numa conversa com você mesmo. **Importar código** devolve tudo.
- **Importar arquivo**: restaura o progresso, inclusive em outro aparelho.
- A tela inicial avisa quando faz mais de 2 dias sem cópia. Salve uma vez por semana.

## Atualizar o conteúdo (jeito barato)
O conteúdo está em `dados/livro1/*.txt`, um arquivo por unidade (modelo em `dados/_modelo.txt`). Para mudar uma frase: edite a linha e rode:

```bash
python montar.py
```

Isso confere o formato e gera `estudo.html` (local) e `docs/index.html` (o que vai para o site, cifrado). Para o site mudar, é preciso subir o `docs/index.html` novo para o GitHub. Livro 2: crie a pasta `dados/livro2/`.

As frases do livro que foram corrigidas estão em `dados/CORRECOES.md` (só neste computador: a pasta `dados/livro1/` não vai para o GitHub, então guarde uma cópia dela).

## Para pedir ao Claude sem gastar token
Diga só a unidade e o que mudar. Exemplo: "no `dados/livro1/07-z-m07.txt` troque a frase X por Y e rode `python montar.py`". O Claude lê o `CLAUDE.md` desta pasta (curto) e o arquivo da unidade, nunca o `estudo.html` nem o `docs/index.html`.
