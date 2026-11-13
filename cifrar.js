// Cifra o conteúdo do livro para a versão publicada (docs/index.html).
// Uso (chamado pelo montar.py): lê o texto de stdin e a senha da variável ESTUDO_SENHA; escreve JSON em stdout.
// AES-256-GCM com chave derivada da senha (PBKDF2-SHA256). O app abre com a Web Crypto do navegador.
const crypto = require('crypto');
const ITER = 250000;
const senha = String(process.env.ESTUDO_SENHA || '').toLowerCase().replace(/[^a-z0-9]/g, '');
if (senha.length < 8) { console.error('senha curta demais'); process.exit(2); }
let txt = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => { txt += d; });
process.stdin.on('end', () => {
  const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(senha, salt, ITER, 32, 'sha256');
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([c.update(txt, 'utf8'), c.final()]);
  const ct = Buffer.concat([body, c.getAuthTag()]); // a Web Crypto espera o selo colado no fim
  process.stdout.write(JSON.stringify({ s: salt.toString('base64'), i: iv.toString('base64'), c: ct.toString('base64'), n: ITER }));
});
