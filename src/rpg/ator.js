import * as THREE from 'three';
import { Animador } from '../engine/anim.js';

export const RAIO_ATOR = 0.55;

// Base comum a jogador e NPCs: modelo animado + corpo de colisão + virar suavemente.
export class Ator {
  constructor(bib, colisao, modelo, opcoes = {}) {
    this.raiz = new THREE.Group();
    this.modelo = bib.personagem(modelo, opcoes);
    this.raiz.add(this.modelo);
    this.anim = new Animador(bib, this.modelo);
    this.anim.tocar('Idle_A', { transicao: 0 });
    this.colisao = colisao;
    this.corpo = colisao.circulo(0, 0, RAIO_ATOR, this);
    this.angulo = 0;
    this.anguloAlvo = 0;
  }

  get posicao() {
    return this.raiz.position;
  }

  colocar(x, z) {
    this.raiz.position.set(x, 0, z);
    this.#syncCorpo();
  }

  virarPara(x, z, imediato = false) {
    const dx = x - this.raiz.position.x;
    const dz = z - this.raiz.position.z;
    if (dx * dx + dz * dz < 1e-6) return;
    this.anguloAlvo = Math.atan2(dx, dz);
    if (imediato) this.angulo = this.anguloAlvo;
  }

  // Anda `passo` (vetor XZ já multiplicado por dt) respeitando as colisões. Devolve true se bateu.
  mover(passo) {
    const p = this.raiz.position;
    p.x += passo.x;
    p.z += passo.z;
    const bateu = this.colisao.resolver(p, RAIO_ATOR, this);
    this.#syncCorpo();
    return bateu;
  }

  atualizar(dt) {
    // Gira pelo menor caminho até o ângulo desejado.
    let d = this.anguloAlvo - this.angulo;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    this.angulo += d * (1 - Math.exp(-12 * dt));
    this.modelo.rotation.y = this.angulo;
    this.anim.atualizar(dt);
  }

  #syncCorpo() {
    this.corpo.x = this.raiz.position.x;
    this.corpo.z = this.raiz.position.z;
  }
}
