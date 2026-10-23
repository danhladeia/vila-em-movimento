import * as THREE from 'three';

// Toca os clipes compartilhados do Rig_Medium num personagem, com transição suave.
export class Animador {
  constructor(biblioteca, raiz) {
    this.bib = biblioteca;
    this.mixer = new THREE.AnimationMixer(raiz);
    this.acoes = new Map();
    this.atual = null;
    this.nomeAtual = '';
    this.aoTerminar = null;
    this.mixer.addEventListener('finished', () => {
      const f = this.aoTerminar;
      this.aoTerminar = null;
      f?.();
    });
  }

  #acao(nome) {
    if (!this.acoes.has(nome)) this.acoes.set(nome, this.mixer.clipAction(this.bib.clipe(nome)));
    return this.acoes.get(nome);
  }

  // Animação em loop (andar, correr, parado...).
  tocar(nome, { transicao = 0.2, velocidade = 1 } = {}) {
    if (this.nomeAtual === nome) {
      this.atual.timeScale = velocidade;
      return;
    }
    const nova = this.#acao(nome);
    nova.reset();
    nova.setLoop(THREE.LoopRepeat, Infinity);
    nova.clampWhenFinished = false;
    nova.timeScale = velocidade;
    nova.enabled = true;
    nova.setEffectiveWeight(1);
    if (this.atual) nova.crossFadeFrom(this.atual, transicao, false);
    nova.play();
    this.atual = nova;
    this.nomeAtual = nome;
  }

  // Animação de uma vez (acenar, interagir...); depois volta para `depois`.
  umaVez(nome, depois = 'Idle_A', { transicao = 0.2 } = {}) {
    const nova = this.#acao(nome);
    nova.reset();
    nova.setLoop(THREE.LoopOnce, 1);
    nova.clampWhenFinished = true;
    nova.timeScale = 1;
    nova.enabled = true;
    nova.setEffectiveWeight(1);
    if (this.atual) nova.crossFadeFrom(this.atual, transicao, false);
    nova.play();
    this.atual = nova;
    this.nomeAtual = nome;
    this.aoTerminar = () => {
      if (this.nomeAtual === nome) this.tocar(depois, { transicao: 0.3 });
    };
  }

  atualizar(dt) {
    this.mixer.update(dt);
  }
}
