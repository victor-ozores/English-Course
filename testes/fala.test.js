/* Teste da calibragem da fala. Rodar:  node testes/fala.test.js */
var Fala = require('../src/fala.js');
var falhas = 0, total = 0;
function t(nome, frase, ouvido, nivel) {
  total++;
  var r = Fala.check(frase, [].concat(ouvido));
  if (r.level !== nivel) { falhas++; console.log('FALHOU: ' + nome + ' | esperado ' + nivel + ', veio ' + r.level + ' | ' + frase + ' <- ' + ouvido); }
}
function eq(nome, a, b) { total++; if (JSON.stringify(a) !== JSON.stringify(b)) { falhas++; console.log('FALHOU: ' + nome + ' | ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); } }

// 2 = perfeito, 1 = bom (um artigo de diferença), 0 = ainda não
t('igual', 'I want to eat bread.', 'i want to eat bread', 2);
t('pontuação e maiúscula', 'Good evening!', 'good evening', 2);
t('to ouvido como 2', 'to eat', '2 eat', 2);
t('to ouvido como too', 'to eat', 'too eat', 2);
t("don't = do not", "I don't speak French.", 'I do not speak French', 2);
t("I'd = I would", "I'd like a coke, please.", 'I would like a coke please', 2);
t('número por extenso', 'Do you have 15 books at home?', 'do you have fifteen books at home', 2);
t('número em algarismo', 'I have thirty books.', 'I have 30 books', 2);
t('ano', 'in 2020', 'in twenty twenty', 2);
t('postcard junto ou separado', 'She wants to buy a postcard for me.', 'she wants to buy a post card for me', 2);
t('separado na frase, junto no ouvido', 'I like ice cream.', 'I like icecream', 2);
t('drive-thru', 'I prefer to go to the drive-thru.', 'I prefer to go to the drive through', 2);
t("rock n' roll", "We listen to rock n' roll music.", 'we listen to rock and roll music', 2);
t('their/there', 'Their church is big.', 'there church is big', 2);
t('read no passado', 'I read that book yesterday.', 'I red that book yesterday', 2);
t('gaguejou', 'I want water.', 'I I want water', 2);
t('escolhe a melhor opção', 'I eat bread', ['I it bread', 'I eat bread'], 2);

t('artigo a mais', 'I want to eat bread.', 'I want to eat the bread', 1);
t('artigo faltando', 'I go to the bank every day.', 'I go to bank every day', 1);

t('faltou o to', 'I go to the bank every day.', 'I go the bank every day', 0);
t('faltou o -s', 'He works at the mall.', 'he work at the mall', 0);
t("don't no lugar de doesn't", "She doesn't work.", "she don't work", 0);
t("can't no lugar de can", 'I can swim.', "I can't swim", 0);
t("can no lugar de can't", "I can't swim.", 'I can swim', 0);
t('verbo errado', 'I drink water.', 'I think water', 0);
t('passado errado', 'We went to the movies.', 'we go to the movies', 0);
t('faltou did', 'Did you work yesterday?', 'you work yesterday', 0);
t('ordem trocada', 'Where do you work?', 'where you do work', 0);
t('frase curta sem artigo não passa', 'the bread', 'bread', 0);
t('nada ouvido', 'I eat', '', 0);
t('palavra a mais que não é artigo', 'I want water.', 'I want some water', 0);

eq('marca a palavra que faltou', Fala.check("She doesn't work.", 'she work').marks.map(function (m) { return m.ok; }), [true, false, true]);
eq('escrita aceita do not', Fala.sameWritten("I don't speak French.", 'i do not speak french'), true);
eq('escrita não aceita som igual', Fala.sameWritten('Their church is big.', 'there church is big'), false);
eq('escrita não aceita erro de letra', Fala.sameWritten('I am writing.', 'I am writting'), false);

// verbo: o "to" do começo pode faltar, o verbo não
function tl(nome, frase, ouvido, nivel) { total++; var r = Fala.check(frase, [ouvido], { lax: ['to'] }); if (r.level !== nivel) { falhas++; console.log('FALHOU: ' + nome + ' | esperado ' + nivel + ', veio ' + r.level); } }
tl('to talk completo', 'to talk', 'to talk', 2);
tl('só talk passa', 'to talk', 'talk', 1);
tl('verbo errado não passa', 'to talk', 'to walk', 0);
tl('stop por stop', 'to stop', 'stop', 1);
tl('nada ouvido', 'to stop', '', 0);
total++; if (Fala.check('to talk', ['talk']).level !== 0) { falhas++; console.log('FALHOU: sem lax o to é obrigatório'); }

// escrita ao vivo: verde, vermelho, "ainda digitando"
function lv(nome, alvo, digitado, esperado, cheia) {
  total++; var r = Fala.live(alvo, digitado), s = r.marks.map(function (m) { return m.s; }).join(',');
  if (s !== esperado || (cheia !== undefined && r.full !== cheia)) { falhas++; console.log('FALHOU: ' + nome + ' | ' + s + ' (' + r.full + ') != ' + esperado + ' (' + cheia + ')'); }
}
lv('começou certo', "I don't speak French.", 'I', 'ok', false);
lv('palavra a meio (don)', "I don't speak French.", "I don", 'ok,part', false);
lv('palavra errada', "I don't speak French.", "I dont ", 'ok,bad', false);
lv('do not vale por don\'t', "I don't speak French.", 'I do not speak', 'ok,ok,ok,ok', false);
lv('frase completa', "I don't speak French.", "I don't speak French", 'ok,ok,ok,ok', true);
lv('errou no meio e seguiu', 'She works at the mall.', 'She work at the mall', 'ok,bad,ok,ok,ok', false);
lv('parte errada no fim', 'He plays soccer.', 'He plays footb', 'ok,ok,bad', false);
lv('maiúscula e pontuação', 'Good evening!', 'good evening', 'ok,ok', true);
lv('vazio', 'Good evening!', '', '', false);

// palavra solta: a vogal duvidosa não derruba (o microfone erra mais a vogal que a consoante)
function sf(nome, alvo, ouvido, nivel, opt) { total++; var r = Fala.check(alvo, [].concat(ouvido), opt); if (r.level !== nivel) { falhas++; console.log('FALHOU: ' + nome + ' | esperado ' + nivel + ', veio ' + r.level + ' | ' + alvo + ' <- ' + ouvido); } return r; }
sf('bread ouvido brad', 'bread', 'brad', 1);
sf('ham ouvido him', 'ham', 'him', 1);
sf('cheese ouvido chase', 'cheese', 'chase', 1);
sf('rice ouvido race', 'rice', 'race', 1);
sf('palavra igual continua perfeita', 'bread', 'bread', 2);
sf('consoante diferente não passa', 'bread', 'bed', 0);
sf('consoante diferente 2', 'milk', 'mock', 0);
sf('went não aceita want (gramática)', 'went', 'want', 0);
sf('can não aceita can\'t', 'can', "can't", 0);
sf('to eat, ouvido it', 'to eat', 'it', 1, { lax: ['to'] });
sf('to talk, ouvido tack', 'to talk', 'tack', 0, { lax: ['to'] });
sf('verbo com -s não vira sem -s', 'works', 'work', 0);
sf('frase: bread ouvido brad, só com a lista', 'I eat bread', 'I eat brad', 1, { soft: ['bread'] });
sf('frase sem a lista continua exigente', 'I eat bread', 'I eat brad', 0);
sf('frase: went nunca vira want', 'We went to the movies', 'we want to the movies', 0, { soft: ['movies', 'went'] });
sf('frase: he work continua errado', 'He works at the mall', 'he work at the mall', 0, { soft: ['mall'] });
var rs = Fala.check('bread', ['brad']);
total++; if (!(rs.marks[0].ok && rs.marks[0].soft && rs.soft[0].target === 'bread' && rs.soft[0].heard === 'brad')) { falhas++; console.log('FALHOU: marca soft'); }
var rl = Fala.check('to talk', ['talk'], { lax: ['to'] });
total++; if (!(rl.ok && rl.marks[0].ok && rl.marks[0].soft && rl.marks[1].ok && !rl.marks[1].soft)) { falhas++; console.log('FALHOU: o to que faltou fica amarelo e o verbo verde'); }
var rh = Fala.check('meat', ['meet']);
total++; if (!(rh.level === 2 && rh.homo.length === 1 && rh.homo[0].target === 'meat' && rh.homo[0].heard === 'meet')) { falhas++; console.log('FALHOU: aviso de mesmo som (meat/meet)'); }
total++; if (Fala.check('I want to eat', ['I want too eat']).homo.length) { falhas++; console.log('FALHOU: to/too não deve gerar aviso'); }
total++; if (Fala.check('meat', ['meat']).homo.length) { falhas++; console.log('FALHOU: palavra igual não gera aviso'); }
// calibração pessoal
sf('calibração: brod passa a valer bread', 'I eat bread', 'I eat brod', 2, { cal: { bread: ['brod'] } });
sf('calibração não vale para outra palavra', 'I eat cheese', 'I eat brod', 0, { cal: { bread: ['brod'] } });
eq('pares para calibrar', Fala.check('I like ham', ['I like hum']).pairs, [['ham', 'hum']]);
eq('pkey', [Fala.pkey('bread'), Fala.pkey('brad'), Fala.pkey('ham'), Fala.pkey('him'), Fala.pkey('talk')], ['brVd', 'brVd', 'hVm', 'hVm', 'tVlk']);

console.log(falhas ? falhas + ' de ' + total + ' FALHARAM' : 'ok: ' + total + ' testes da fala passaram');
process.exit(falhas ? 1 : 0);
