import { escapar, tremer } from './util.js';

// Forca temática: a cada letra errada, uma nuvem da Névoa da Preguiça cobre o sol (6 chances por palavra).
// Perder uma palavra não trava o jogo: ela é revelada e o aluno segue para a próxima.
const MAX_ERROS = 6;
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUVENS = [[22, 30], [62, 22], [92, 40], [30, 70], [70, 78], [50, 50]];

function desenhoSol(erros) {
  const nuvens = NUVENS.slice(0, erros).map(([x, y]) => `<g class="nuvem" transform="translate(${x} ${y})">
    <circle r="16"/><circle cx="14" cy="4" r="12"/><circle cx="-14" cy="5" r="11"/></g>`).join('');
  return `<svg viewBox="0 0 120 110" class="mj-sol" aria-hidden="true">
    <circle cx="60" cy="52" r="30" class="sol"/>${nuvens}</svg>`;
}

export function iniciar(def, ui) {
  const palavras = def.palavras;
  let p = 0;
  let certas = 0;
  let errosTotal = 0;
  let tentadas;
  let erros;
  let acabou;

  function nova() {
    tentadas = new Set();
    erros = 0;
    acabou = false;
    desenhar();
  }

  function desenhar() {
    const { palavra, dica } = palavras[p];
    ui.placar(`Palavra ${p + 1} de ${palavras.length} · Chances: ${MAX_ERROS - erros}`);
    const letras = palavra.split('').map((l) => `<span class="${tentadas.has(l) || acabou ? 'aberta' : ''}">${tentadas.has(l) || acabou ? l : ''}</span>`).join('');
    ui.corpo.innerHTML = `
      <div class="mj-forca">
        ${desenhoSol(erros)}
        <div>
          <p class="mj-dica"><b>Dica:</b> ${escapar(dica)}</p>
          <div class="mj-palavra">${letras}</div>
        </div>
      </div>
      <div class="mj-teclado">${LETRAS.map((l) => {
        const usada = tentadas.has(l);
        const cls = usada ? (palavra.includes(l) ? 'certo' : 'errado') : '';
        return `<button data-l="${l}" class="${cls}" ${usada || acabou ? 'disabled' : ''}>${l}</button>`;
      }).join('')}</div>
      <p class="mj-retorno"></p>
      <div class="mj-acoes"><button class="btn-principal pequeno ${acabou ? '' : 'oculto'}" data-proximo>${p + 1 < palavras.length ? 'Próxima palavra ▸' : 'Ver resultado ▸'}</button></div>`;
    ui.corpo.querySelectorAll('[data-l]').forEach((b) => b.addEventListener('click', () => chutar(b.dataset.l)));
    ui.corpo.querySelector('[data-proximo]').addEventListener('click', proxima);
  }

  function chutar(l) {
    if (acabou || tentadas.has(l)) return;
    const { palavra } = palavras[p];
    tentadas.add(l);
    if (palavra.includes(l)) ui.som('peca_encaixe');
    else {
      erros += 1;
      errosTotal += 1;
      ui.som('peca_mover');
    }
    const completa = palavra.split('').every((x) => tentadas.has(x));
    if (completa || erros >= MAX_ERROS) {
      acabou = true;
      if (completa) certas += 1;
    }
    desenhar();
    const retorno = ui.corpo.querySelector('.mj-retorno');
    if (acabou && completa) {
      retorno.className = 'mj-retorno certo';
      retorno.textContent = 'Muito bem! O sol continua brilhando.';
    } else if (acabou) {
      retorno.className = 'mj-retorno errado';
      retorno.textContent = `A névoa cobriu o sol… A palavra era ${palavra}.`;
      tremer(ui.corpo.querySelector('.mj-palavra'));
    }
  }

  function proxima() {
    if (!acabou) return;
    p += 1;
    if (p < palavras.length) nova();
    else {
      const estrelas = certas === palavras.length && errosTotal <= 6 ? 3 : certas >= palavras.length - 1 ? 2 : 1;
      ui.fim({ estrelas, texto: `Você descobriu ${certas} de ${palavras.length} palavras.` });
    }
  }

  nova();
  return {
    tecla(e) {
      const l = e.key.toUpperCase();
      if (l.length === 1 && l >= 'A' && l <= 'Z') chutar(l);
      else if (e.key === 'Enter') proxima();
    },
  };
}
