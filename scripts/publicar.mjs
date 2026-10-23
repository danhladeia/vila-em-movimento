// Publica o jogo no GitHub Pages: envia dist/index.html para a branch gh-pages do repositório "origin".
//   npm run publicar        (gera o build antes)
//
// A branch gh-pages guarda só o jogo pronto e é refeita a cada publicação.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (args, cwd = RAIZ) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

const jogo = path.join(RAIZ, 'dist', 'index.html');
if (!fs.existsSync(jogo)) throw new Error('dist/index.html não existe: rode "npm run build" antes.');

const remoto = git(['remote', 'get-url', 'origin']);
const versao = git(['rev-parse', '--short', 'HEAD']);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vila-pages-'));
try {
  fs.copyFileSync(jogo, path.join(tmp, 'index.html'));
  fs.writeFileSync(path.join(tmp, '.nojekyll'), ''); // serve o arquivo como está, sem processar
  git(['init', '-q', '-b', 'gh-pages'], tmp);
  git(['add', '-A'], tmp);
  git(['commit', '-q', '-m', `Publica o jogo (código ${versao})`], tmp);
  git(['push', '-q', '--force', remoto, 'gh-pages'], tmp);
  console.log(`Publicado (código ${versao}). O GitHub Pages atualiza em 1 ou 2 minutos.`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
