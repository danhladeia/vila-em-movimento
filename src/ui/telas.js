import { Estado, listarSaves, apagarSave } from '../rpg/estado.js';
import { CLASSES, TONS, PELES, ATRIBUTOS, ITENS, visualDe } from '../conteudo/rpg.js';
import { retrato } from './retratos.js';
import { imgIcone } from './icones.js';
import { tocarSom } from '../engine/audio.js';

const $ = (id) => document.getElementById(id);
const escapar = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const TELAS = ['tela-titulo', 'tela-nome', 'tela-classe'];

function mostrar(id) {
  TELAS.forEach((t) => $(t).classList.toggle('oculto', t !== id));
  const foco = $(id).querySelector('input, button.btn-principal');
  setTimeout(() => foco?.focus(), 30);
}

function armazenamentoOk() {
  try {
    localStorage.setItem('vilaEmMovimento.teste', '1');
    localStorage.removeItem('vilaEmMovimento.teste');
    return true;
  } catch {
    return false;
  }
}

// Título → (continuar | nome e turma → classe). Resolve com o Estado do aluno.
export function fluxoInicio({ renderer, bib }) {
  return new Promise((resolver) => {
    let nome = '';
    let turma = '';
    let classeId = null;
    let visual = 0;
    let tom = null;
    let pele = null;

    $('aviso-save').classList.toggle('oculto', armazenamentoOk());

    function montarSaves() {
      const saves = listarSaves();
      const lista = $('lista-saves');
      lista.innerHTML = saves.length ? '<p class="rotulo">Continuar de onde parou:</p>' : '';
      for (const s of saves) {
        const classe = CLASSES.find((c) => c.id === s.classe);
        const linha = document.createElement('div');
        linha.className = 'save';
        linha.innerHTML = `
          <button class="save-continuar">
            <img src="${retrato(renderer, bib, visualDe(s), { tom: s.tom, pele: s.pele })}" alt="" />
            <span><b>${escapar(s.nome)}</b> · ${escapar(s.turma)}<small>${escapar(classe.nome)}</small></span>
          </button>
          <button class="save-apagar" title="Apagar este jogo salvo">Apagar</button>`;
        linha.querySelector('.save-continuar').addEventListener('click', () => {
          tocarSom('carta', 0.4);
          resolver(Estado.carregar(s.id));
        });
        linha.querySelector('.save-apagar').addEventListener('click', () => {
          if (confirm(`Apagar o jogo salvo de ${s.nome} (${s.turma})? Isso não pode ser desfeito.`)) {
            apagarSave(s.id);
            montarSaves();
          }
        });
        lista.appendChild(linha);
      }
      $('btn-novo').textContent = saves.length ? 'Novo jogo' : 'Começar';
    }

    // Cartões das classes. A selecionada mostra a aparência escolhida; as outras, a primeira aparência.
    function montarClasses() {
      const caixa = $('classes');
      caixa.innerHTML = '';
      for (const c of CLASSES) {
        const at = ATRIBUTOS.find((a) => a.id === c.atributo);
        const it = ITENS[c.item];
        const escolhida = c.id === classeId;
        const b = document.createElement('button');
        b.className = 'classe';
        b.setAttribute('aria-pressed', String(escolhida));
        b.innerHTML = `
          <img class="retrato" src="${retrato(renderer, bib, c.visuais[escolhida ? visual : 0], { pele, tom: escolhida ? tom : null })}" alt="" />
          <b>${c.nome}</b>
          <span class="bonus">${imgIcone(at.icone)} +1 ${at.nome}</span>
          <span class="bonus">${imgIcone(it.icone)} ${it.nome}</span>
          <small>${c.texto}</small>`;
        b.addEventListener('click', () => {
          if (classeId !== c.id) visual = 0;
          classeId = c.id;
          tocarSom('peca_mover', 0.4);
          montarTudo();
        });
        caixa.appendChild(b);
      }
      $('btn-jogar').disabled = !classeId;
    }

    // Retratos das aparências da classe escolhida.
    function montarVisuais() {
      const caixa = $('visuais');
      caixa.innerHTML = '';
      const classe = CLASSES.find((c) => c.id === classeId);
      if (!classe) {
        caixa.innerHTML = '<small>Escolha uma classe acima.</small>';
        return;
      }
      classe.visuais.forEach((v, i) => {
        const b = document.createElement('button');
        b.className = 'visual';
        b.title = `Aparência ${i + 1}`;
        b.setAttribute('aria-pressed', String(i === visual));
        b.innerHTML = `<img src="${retrato(renderer, bib, v, { tom, pele })}" alt="Aparência ${i + 1}" />`;
        b.addEventListener('click', () => {
          visual = i;
          tocarSom('peca_mover', 0.4);
          montarTudo();
        });
        caixa.appendChild(b);
      });
    }

    // Bolinhas de cor (pele ou roupa). `fundoOriginal` = como desenhar a opção "cor original".
    function montarCores(id, cores, atual, fundoOriginal, aoEscolher) {
      const caixa = $(id);
      caixa.innerHTML = '';
      cores.forEach((cor) => {
        const b = document.createElement('button');
        b.className = 'tom';
        b.style.background = cor || fundoOriginal;
        b.title = cor ? 'Outra cor' : 'Cor original';
        b.setAttribute('aria-pressed', String(cor === atual));
        b.addEventListener('click', () => {
          aoEscolher(cor);
          montarTudo();
        });
        caixa.appendChild(b);
      });
    }

    function montarTudo() {
      montarClasses();
      montarVisuais();
      montarCores('peles', PELES, pele, '#f6be9a', (c) => { pele = c; });
      montarCores('tons', TONS, tom, 'conic-gradient(#e5484d, #ffc933, #1fa35c, #2f7ee8, #6a2fb0, #e5484d)', (c) => { tom = c; });
    }

    document.querySelectorAll('[data-voltar]').forEach((b) => b.addEventListener('click', () => {
      mostrar($('tela-classe').classList.contains('oculto') ? 'tela-titulo' : 'tela-nome');
    }));

    $('btn-novo').addEventListener('click', () => {
      tocarSom('carta', 0.4);
      mostrar('tela-nome');
    });

    $('form-nome').addEventListener('submit', (e) => {
      e.preventDefault();
      nome = $('in-nome').value.trim();
      turma = $('in-turma').value.trim();
      const erro = $('erro-nome');
      if (nome.length < 2 || !turma) {
        erro.textContent = 'Escreva seu nome e sua turma.';
      } else if (Estado.existe(nome, turma)) {
        erro.textContent = 'Já existe um jogo salvo com esse nome e turma. Volte e escolha "Continuar".';
      } else {
        erro.textContent = '';
      }
      erro.classList.toggle('oculto', !erro.textContent);
      if (erro.textContent) return;
      tocarSom('peca_mover', 0.4);
      montarTudo();
      mostrar('tela-classe');
    });

    $('btn-jogar').addEventListener('click', () => {
      if (!classeId) return;
      tocarSom('dado', 0.5);
      const estado = Estado.novo(nome, turma, classeId, { visual, tom, pele });
      estado.salvar();
      resolver(estado);
    });

    montarSaves();
    mostrar('tela-titulo');
  }).then((estado) => {
    TELAS.forEach((t) => $(t).classList.add('oculto'));
    return estado;
  });
}
