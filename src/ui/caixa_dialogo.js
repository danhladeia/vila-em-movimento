import { tocarSom } from '../engine/audio.js';

const CPS = 55; // letras por segundo do "texto digitando"

const escapar = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// "**negrito**" -> trechos [{t, b}]
function trechos(fala) {
  return fala.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((p) => (p.startsWith('**') ? { t: p.slice(2, -2), b: true } : { t: p, b: false }));
}

function htmlAte(partes, n) {
  let html = '';
  for (const { t, b } of partes) {
    if (n <= 0) break;
    const pedaco = escapar(t.slice(0, n));
    html += b ? `<b>${pedaco}</b>` : pedaco;
    n -= t.length;
  }
  return html;
}

// Caixa de diálogo com texto digitando e escolhas (mouse ou teclas 1–4).
// Formato dos diálogos: ver src/conteudo/unidade1.js.
export class CaixaDialogo {
  constructor() {
    this.el = document.getElementById('dialogo');
    this.elNome = document.getElementById('dialogo-nome');
    this.elTexto = document.getElementById('dialogo-texto');
    this.elEscolhas = document.getElementById('dialogo-escolhas');
    this.elContinuar = document.getElementById('dialogo-continuar');
    this.elResposta = document.getElementById('dialogo-resposta');
    this.elCampo = document.getElementById('dialogo-campo');
    this.aberta = false;
    this.el.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, form')) return;
      this.avancar();
    });
    this.elResposta.addEventListener('submit', (e) => {
      e.preventDefault();
      this.#responder();
    });
    this.elCampo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.#responder();
      }
    });
  }

  // aoAcao(nome): nó com `acao`; aoResposta(id, pergunta, texto): nó com `pergunta`; aoFechar(): fim.
  // `apelido` substitui {nome} nas falas.
  abrir(nome, dialogo, { aoAcao = () => {}, aoResposta = () => {}, aoFechar = () => {}, apelido = '' } = {}) {
    this.nome = nome;
    this.dialogo = dialogo;
    this.aoAcao = aoAcao;
    this.aoResposta = aoResposta;
    this.aoFechar = aoFechar;
    this.apelido = apelido;
    this.aberta = true;
    this.el.classList.remove('oculto');
    tocarSom('carta', 0.35);
    this.#mostrar(dialogo.inicio);
  }

  #mostrar(id) {
    const no = this.dialogo.nos[id];
    if (!no) {
      this.fechar();
      return;
    }
    this.no = no;
    this.elNome.textContent = no.quem ?? this.nome;
    this.partes = trechos(no.fala.replaceAll('{nome}', this.apelido));
    this.total = this.partes.reduce((s, p) => s + p.t.length, 0);
    this.letras = 0;
    this.elTexto.innerHTML = '';
    this.elEscolhas.innerHTML = '';
    this.elResposta.classList.add('oculto');
    this.elContinuar.classList.add('oculto');
    if (no.acao) this.aoAcao(no.acao);
  }

  #responder() {
    const texto = this.elCampo.value.trim();
    if (!this.no?.pergunta || texto.length < 3) {
      this.elCampo.focus();
      return;
    }
    this.aoResposta(this.no.pergunta.id, this.partes.map((p) => p.t).join(''), texto);
    this.elCampo.blur();
    tocarSom('pegar', 0.4);
    if (this.no.prox) this.#mostrar(this.no.prox);
    else this.fechar();
  }

  get digitando() {
    return this.letras < this.total;
  }

  #terminarDigitar() {
    this.letras = this.total;
    this.elTexto.innerHTML = htmlAte(this.partes, this.total);
    if (this.no.escolhas) {
      this.no.escolhas.forEach((esc, i) => {
        const b = document.createElement('button');
        b.innerHTML = `<kbd>${i + 1}</kbd>${escapar(esc.texto)}`;
        b.addEventListener('click', () => this.escolher(i));
        this.elEscolhas.appendChild(b);
      });
    } else if (this.no.pergunta) {
      this.elCampo.value = '';
      this.elCampo.placeholder = this.no.pergunta.dica || 'Escreva sua resposta…';
      this.elResposta.classList.remove('oculto');
      this.elCampo.focus();
    } else {
      this.elContinuar.textContent = this.no.prox ? 'Espaço ▸' : 'Espaço ▸ fechar';
      this.elContinuar.classList.remove('oculto');
    }
  }

  avancar() {
    if (!this.aberta) return;
    if (this.digitando) {
      this.#terminarDigitar();
      return;
    }
    if (this.no.escolhas || this.no.pergunta) return;
    tocarSom('papel', 0.3);
    if (this.no.prox) this.#mostrar(this.no.prox);
    else this.fechar();
  }

  escolher(i) {
    if (!this.aberta || this.digitando || !this.no.escolhas?.[i]) return;
    tocarSom('peca_mover', 0.4);
    this.#mostrar(this.no.escolhas[i].prox);
  }

  fechar() {
    this.aberta = false;
    this.el.classList.add('oculto');
    this.aoFechar();
  }

  atualizar(dt, entrada) {
    if (!this.aberta) return;
    if (this.digitando) {
      this.letras = Math.min(this.total, this.letras + CPS * dt);
      this.elTexto.innerHTML = htmlAte(this.partes, Math.floor(this.letras));
      if (!this.digitando) this.#terminarDigitar();
    }
    if (entrada.tocou('Space', 'Enter', 'KeyE', 'NumpadEnter')) this.avancar();
    ['Digit1', 'Digit2', 'Digit3', 'Digit4'].forEach((k, i) => {
      if (entrada.tocou(k, `Numpad${i + 1}`)) this.escolher(i);
    });
  }
}
