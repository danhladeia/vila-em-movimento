import { embaralhar, escapar, tremer } from './util.js';

// Classificar: um cartão por vez; o aluno escolhe o grupo certo (mouse ou teclas 1, 2...).
// Errou: recebe uma pista e tenta de novo. Acertou: lê a explicação e segue.
export function iniciar(def, ui) {
  const itens = embaralhar(def.itens);
  let i = 0;
  let erros = 0;
  let respondido = false;

  function mostrar() {
    const item = itens[i];
    respondido = false;
    ui.placar(`Cartão ${i + 1} de ${itens.length}`);
    ui.corpo.innerHTML = `
      <div class="mj-cartao">${escapar(item.texto)}</div>
      <div class="mj-opcoes linha">${def.grupos.map((g, k) => `<button data-g="${k}"><kbd>${k + 1}</kbd>${escapar(g)}</button>`).join('')}</div>
      <p class="mj-retorno"></p>
      <div class="mj-acoes"><button class="btn-principal pequeno oculto" data-proximo>Próximo ▸</button></div>`;
    ui.corpo.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => escolher(+b.dataset.g)));
    ui.corpo.querySelector('[data-proximo]').addEventListener('click', proximo);
  }

  function escolher(g) {
    if (respondido || g >= def.grupos.length) return;
    const item = itens[i];
    const retorno = ui.corpo.querySelector('.mj-retorno');
    const botao = ui.corpo.querySelector(`[data-g="${g}"]`);
    if (g === item.grupo) {
      respondido = true;
      botao.classList.add('certo');
      retorno.className = 'mj-retorno certo';
      retorno.textContent = `Isso! ${item.explica}`;
      ui.corpo.querySelector('[data-proximo]').classList.remove('oculto');
      ui.som('peca_encaixe');
    } else {
      erros += 1;
      botao.classList.add('errado');
      tremer(ui.corpo.querySelector('.mj-cartao'));
      retorno.className = 'mj-retorno errado';
      retorno.textContent = 'Ainda não. Pense: é algo planejado, com objetivo e regularidade? Tente de novo.';
      ui.som('peca_mover');
    }
  }

  function proximo() {
    if (!respondido) return;
    i += 1;
    if (i < itens.length) mostrar();
    else ui.fim({ estrelas: erros <= 1 ? 3 : erros <= 3 ? 2 : 1, texto: `Você classificou ${itens.length} cartões com ${erros} erro(s).` });
  }

  mostrar();
  return {
    tecla(e) {
      const n = Number(e.key);
      if (n >= 1 && n <= def.grupos.length) escolher(n - 1);
      else if (e.key === 'Enter' || e.key === ' ') proximo();
    },
  };
}
