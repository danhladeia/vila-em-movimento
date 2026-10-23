import { escapar } from './util.js';

// Quiz: uma pergunta por vez (teclas 1 a 4); depois de responder, mostra a explicação.
export function iniciar(def, ui) {
  const perguntas = def.perguntas;
  let i = 0;
  let acertos = 0;
  let respondida = false;

  function mostrar() {
    const q = perguntas[i];
    respondida = false;
    ui.placar(`Pergunta ${i + 1} de ${perguntas.length} · Acertos: ${acertos}`);
    ui.corpo.innerHTML = `
      <div class="mj-cartao pergunta">${escapar(q.texto)}</div>
      <div class="mj-opcoes coluna">${q.opcoes.map((o, k) => `<button data-o="${k}"><kbd>${k + 1}</kbd>${escapar(o)}</button>`).join('')}</div>
      <p class="mj-retorno"></p>
      <div class="mj-acoes"><button class="btn-principal pequeno oculto" data-proximo>${i + 1 < perguntas.length ? 'Próxima ▸' : 'Ver resultado ▸'}</button></div>`;
    ui.corpo.querySelectorAll('[data-o]').forEach((b) => b.addEventListener('click', () => responder(+b.dataset.o)));
    ui.corpo.querySelector('[data-proximo]').addEventListener('click', proxima);
  }

  function responder(k) {
    const q = perguntas[i];
    if (respondida || k >= q.opcoes.length) return;
    respondida = true;
    const certo = k === q.certa;
    if (certo) acertos += 1;
    ui.corpo.querySelectorAll('[data-o]').forEach((b, j) => {
      b.disabled = true;
      if (j === q.certa) b.classList.add('certo');
      else if (j === k) b.classList.add('errado');
    });
    const retorno = ui.corpo.querySelector('.mj-retorno');
    retorno.className = `mj-retorno ${certo ? 'certo' : 'errado'}`;
    retorno.textContent = `${certo ? 'Certo!' : 'Não foi dessa vez.'} ${q.explica}`;
    ui.som(certo ? 'peca_encaixe' : 'peca_mover');
    ui.placar(`Pergunta ${i + 1} de ${perguntas.length} · Acertos: ${acertos}`);
    ui.corpo.querySelector('[data-proximo]').classList.remove('oculto');
  }

  function proxima() {
    if (!respondida) return;
    i += 1;
    if (i < perguntas.length) mostrar();
    else {
      const taxa = acertos / perguntas.length;
      ui.fim({ estrelas: taxa === 1 ? 3 : taxa >= 0.6 ? 2 : 1, texto: `Você acertou ${acertos} de ${perguntas.length} perguntas.` });
    }
  }

  mostrar();
  return {
    tecla(e) {
      const n = Number(e.key);
      if (n >= 1 && n <= 4) responder(n - 1);
      else if (e.key === 'Enter' || e.key === ' ') proxima();
    },
  };
}
