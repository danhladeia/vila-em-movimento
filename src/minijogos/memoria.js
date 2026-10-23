import { embaralhar, escapar } from './util.js';

// Jogo da memória de pares conceito ↔ explicação. Cartas de conceito em roxo, de explicação em amarelo.
export function iniciar(def, ui) {
  const cartas = embaralhar(def.pares.flatMap(([a, b], par) => [{ par, tipo: 'conceito', texto: a }, { par, tipo: 'explica', texto: b }]));
  let viradas = [];
  let jogadas = 0;
  let achados = 0;
  let travado = false;

  ui.corpo.innerHTML = `
    <div class="mj-memoria">${cartas.map((c, k) => `
      <button class="carta ${c.tipo}" data-k="${k}" aria-label="Carta ${k + 1}">
        <span class="verso">?</span><span class="frente">${escapar(c.texto)}</span>
      </button>`).join('')}
    </div>
    <p class="mj-retorno">Encontre os ${def.pares.length} pares.</p>`;
  const botoes = [...ui.corpo.querySelectorAll('.carta')];
  const retorno = ui.corpo.querySelector('.mj-retorno');
  const atualizarPlacar = () => ui.placar(`Pares: ${achados}/${def.pares.length} · Jogadas: ${jogadas}`);
  atualizarPlacar();

  botoes.forEach((b) => b.addEventListener('click', () => virar(+b.dataset.k)));

  function virar(k) {
    const b = botoes[k];
    if (travado || b.classList.contains('virada') || b.classList.contains('achada')) return;
    b.classList.add('virada');
    ui.som('carta');
    viradas.push(k);
    if (viradas.length < 2) return;

    jogadas += 1;
    const [a, c] = viradas;
    viradas = [];
    if (cartas[a].par === cartas[c].par) {
      achados += 1;
      botoes[a].classList.add('achada');
      botoes[c].classList.add('achada');
      const [conceito, explica] = def.pares[cartas[a].par];
      retorno.className = 'mj-retorno certo';
      retorno.innerHTML = `<b>${escapar(conceito)}</b>: ${escapar(explica)}.`;
      ui.som('peca_encaixe');
      atualizarPlacar();
      if (achados === def.pares.length) {
        const n = def.pares.length;
        const estrelas = jogadas <= n + 3 ? 3 : jogadas <= n + 7 ? 2 : 1;
        setTimeout(() => ui.fim({ estrelas, texto: `Você juntou os ${n} pares em ${jogadas} jogadas.` }), 900);
      }
    } else {
      travado = true;
      atualizarPlacar();
      setTimeout(() => {
        botoes[a].classList.remove('virada');
        botoes[c].classList.remove('virada');
        travado = false;
      }, 1100);
    }
  }

  return {};
}
