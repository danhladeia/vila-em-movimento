import { embaralhar, escapar, tremer } from './util.js';

// Ordenar: o aluno clica nos cartões na ordem certa; cada acerto vai para a fila numerada.
export function iniciar(def, ui) {
  const embaralhados = embaralhar(def.itens.map((it, ordem) => ({ ...it, ordem })));
  let proximo = 0;
  let erros = 0;

  ui.corpo.innerHTML = `
    <ol class="mj-fila">${def.itens.map((_, k) => `<li data-pos="${k}"><span>${k + 1}</span><i>?</i></li>`).join('')}</ol>
    <div class="mj-opcoes coluna">${embaralhados.map((it, k) => `<button data-k="${k}"><b>${escapar(it.texto)}</b><small>${escapar(it.detalhe || '')}</small></button>`).join('')}</div>
    <p class="mj-retorno">Qual vem primeiro?</p>`;
  const retorno = ui.corpo.querySelector('.mj-retorno');
  ui.placar(`Encaixados: 0/${def.itens.length}`);

  ui.corpo.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => {
    const it = embaralhados[+b.dataset.k];
    if (b.disabled) return;
    if (it.ordem === proximo) {
      b.disabled = true;
      b.classList.add('certo');
      const vaga = ui.corpo.querySelector(`[data-pos="${proximo}"]`);
      vaga.classList.add('cheia');
      vaga.querySelector('i').textContent = it.texto;
      proximo += 1;
      ui.som('peca_encaixe');
      ui.placar(`Encaixados: ${proximo}/${def.itens.length}`);
      retorno.className = 'mj-retorno certo';
      retorno.textContent = proximo < def.itens.length ? 'Isso! E depois?' : 'Sequência completa!';
      if (proximo === def.itens.length) {
        setTimeout(() => ui.fim({ estrelas: erros === 0 ? 3 : erros === 1 ? 2 : 1, texto: `Você montou a sequência com ${erros} erro(s).` }), 700);
      }
    } else {
      erros += 1;
      tremer(b);
      ui.som('peca_mover');
      retorno.className = 'mj-retorno errado';
      retorno.textContent = 'Ainda não é a vez desta parte. Pense no início, meio e fim da aula.';
    }
  }));

  return {};
}
