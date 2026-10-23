import { embaralhar } from './util.js';

// Caça-palavras: palavras na horizontal, vertical ou diagonal (sempre no sentido de leitura).
// Seleção: arrastar da primeira à última letra, ou clicar na primeira e depois na última.
// A dica mostra a primeira letra de uma palavra que falta (cada dica tira uma estrela).
const DIRECOES = [[1, 0], [0, 1], [1, 1]];
const ALFABETO = 'ABCDEFGHIJLMNOPQRSTUVZ';
const CORES = ['#ffd75e', '#8ec5ff', '#a6e88c', '#ff9ccb', '#c9a7ff', '#ffb27a', '#7fe0d0'];

function montarGrade(palavras, n) {
  for (let tentativa = 0; tentativa < 50; tentativa++) {
    const g = Array.from({ length: n }, () => Array(n).fill(''));
    const posicoes = {};
    let ok = true;
    for (const w of [...palavras].sort((a, b) => b.length - a.length)) {
      let colocou = false;
      for (let t = 0; t < 300 && !colocou; t++) {
        const [dx, dy] = DIRECOES[Math.floor(Math.random() * DIRECOES.length)];
        const x0 = Math.floor(Math.random() * (n - (dx ? w.length - 1 : 0)));
        const y0 = Math.floor(Math.random() * (n - (dy ? w.length - 1 : 0)));
        const cabe = [...w].every((c, i) => [c, ''].includes(g[y0 + dy * i][x0 + dx * i]));
        if (!cabe) continue;
        [...w].forEach((c, i) => { g[y0 + dy * i][x0 + dx * i] = c; });
        posicoes[w] = [...w].map((_, i) => [x0 + dx * i, y0 + dy * i]);
        colocou = true;
      }
      if (!colocou) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    for (const linha of g) for (let x = 0; x < n; x++) if (!linha[x]) linha[x] = ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
    return { g, posicoes };
  }
  throw new Error('Não coube no caça-palavras: aumente o tamanho.');
}

// Células em linha reta entre a e b (ou null se não for reta).
function linhaEntre([x0, y0], [x1, y1]) {
  const dx = Math.sign(x1 - x0);
  const dy = Math.sign(y1 - y0);
  const passos = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  if (x0 !== x1 && y0 !== y1 && Math.abs(x1 - x0) !== Math.abs(y1 - y0)) return null;
  return Array.from({ length: passos + 1 }, (_, i) => [x0 + dx * i, y0 + dy * i]);
}

export function iniciar(def, ui) {
  const n = def.tamanho;
  const { g, posicoes } = montarGrade(def.palavras, n);
  const achadas = new Set();
  let dicas = 0;
  let inicio = null;
  let arrastando = false;

  ui.corpo.innerHTML = `
    <div class="mj-caca">
      <div class="mj-grade" style="grid-template-columns: repeat(${n}, 1fr)">
        ${g.flatMap((linha, y) => linha.map((c, x) => `<button data-x="${x}" data-y="${y}">${c}</button>`)).join('')}
      </div>
      <div class="mj-lista">
        <ul>${embaralhar(def.palavras).map((w) => `<li data-w="${w}">${w}</li>`).join('')}</ul>
        <button class="btn-secundario pequeno" data-dica>Dica (−1 ★)</button>
      </div>
    </div>
    <p class="mj-retorno">Arraste sobre as letras ou clique na primeira e na última letra.</p>`;
  const celula = (x, y) => ui.corpo.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  const retorno = ui.corpo.querySelector('.mj-retorno');
  const atualizarPlacar = () => ui.placar(`Palavras: ${achadas.size}/${def.palavras.length}${dicas ? ` · Dicas: ${dicas}` : ''}`);
  atualizarPlacar();

  function marcarSelecao(cels) {
    ui.corpo.querySelectorAll('.mj-grade .sel').forEach((b) => b.classList.remove('sel'));
    (cels || []).forEach(([x, y]) => celula(x, y).classList.add('sel'));
  }

  function conferir(cels) {
    marcarSelecao(null);
    if (!cels || cels.length < 2) return;
    const texto = cels.map(([x, y]) => g[y][x]).join('');
    const w = def.palavras.find((p) => !achadas.has(p) && (p === texto || p === [...texto].reverse().join('')));
    const igualPosicao = w && posicoes[w].every(([x, y]) => cels.some(([a, b]) => a === x && b === y));
    if (w && igualPosicao) {
      achadas.add(w);
      const cor = CORES[(achadas.size - 1) % CORES.length];
      cels.forEach(([x, y]) => {
        const b = celula(x, y);
        b.classList.add('achada');
        b.style.background = cor;
      });
      ui.corpo.querySelector(`[data-w="${w}"]`).classList.add('achada');
      retorno.className = 'mj-retorno certo';
      retorno.textContent = `Você achou ${w}!`;
      ui.som('peca_encaixe');
      atualizarPlacar();
      if (achadas.size === def.palavras.length) {
        setTimeout(() => ui.fim({ estrelas: Math.max(1, 3 - dicas), texto: `Você encontrou as ${def.palavras.length} palavras${dicas ? ` usando ${dicas} dica(s)` : ' sem dicas'}.` }), 700);
      }
    } else {
      retorno.className = 'mj-retorno';
      retorno.textContent = 'Essa não é uma das palavras. Tente de novo!';
    }
  }

  const grade = ui.corpo.querySelector('.mj-grade');
  const pos = (e) => {
    const b = e.target.closest('[data-x]');
    return b ? [+b.dataset.x, +b.dataset.y] : null;
  };
  grade.addEventListener('pointerdown', (e) => {
    const p = pos(e);
    if (!p) return;
    e.preventDefault();
    if (inicio && !arrastando) {
      // Segundo clique (modo clicar-clicar).
      conferir(linhaEntre(inicio, p));
      inicio = null;
      return;
    }
    inicio = p;
    arrastando = true;
    marcarSelecao([p]);
  });
  grade.addEventListener('pointermove', (e) => {
    if (!arrastando || !inicio) return;
    const b = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-x]');
    if (b) marcarSelecao(linhaEntre(inicio, [+b.dataset.x, +b.dataset.y]));
  });
  window.addEventListener('pointerup', soltar);
  function soltar(e) {
    if (!arrastando) return;
    arrastando = false;
    const b = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-x]');
    const fimPos = b ? [+b.dataset.x, +b.dataset.y] : null;
    if (fimPos && (fimPos[0] !== inicio[0] || fimPos[1] !== inicio[1])) {
      conferir(linhaEntre(inicio, fimPos));
      inicio = null;
    }
    // Soltou na mesma letra: fica esperando o segundo clique.
  }

  ui.corpo.querySelector('[data-dica]').addEventListener('click', () => {
    const falta = def.palavras.find((w) => !achadas.has(w));
    if (!falta) return;
    dicas += 1;
    const [x, y] = posicoes[falta][0];
    const b = celula(x, y);
    b.classList.remove('piscando');
    void b.offsetWidth;
    b.classList.add('piscando');
    retorno.className = 'mj-retorno';
    retorno.textContent = `Dica: ${falta} começa na letra que está piscando.`;
    atualizarPlacar();
  });

  return {
    destruir: () => window.removeEventListener('pointerup', soltar),
    // Para testes automáticos: seleciona uma palavra pelas posições.
    _selecionar: (w) => conferir(posicoes[w]),
  };
}
