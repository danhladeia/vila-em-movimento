import { Ator } from '../rpg/ator.js';
import { Q } from './vila.js';
import { Marcador } from './marcador.js';

const VEL_PASSEIO = 1.6;

// Morador da vila. Comportamentos: 'parado', 'sentado' ou 'passear' (rota em loop).
export class Npc extends Ator {
  constructor(bib, colisao, def) {
    super(bib, colisao, def.visual, { tom: def.tom, pele: def.pele });
    this.def = def;
    this.conversando = false;
    this.indiceRota = 1;
    this.pausa = 0;
    this.marcador = new Marcador(this.raiz);
    this.tempo = Math.random() * 3;
    this.colocar(def.pos[0] * Q, def.pos[1] * Q);
    if (def.olhar) this.virarPara(this.posicao.x + def.olhar[0], this.posicao.z + def.olhar[1], true);
    this.#poseBase();
  }

  get nome() {
    return this.def.nome;
  }

  #poseBase() {
    if (this.def.comportamento === 'sentado') this.anim.tocar('Sit_Chair_Idle', { transicao: 0.3 });
    else this.anim.tocar('Idle_A', { transicao: 0.3 });
  }

  comecarConversa(jogador) {
    this.conversando = true;
    if (this.def.comportamento === 'sentado') return;
    this.virarPara(jogador.posicao.x, jogador.posicao.z);
    this.anim.umaVez('Waving', 'Idle_A');
  }

  terminarConversa() {
    this.conversando = false;
    if (this.def.olhar && this.def.comportamento !== 'passear') {
      this.virarPara(this.posicao.x + this.def.olhar[0], this.posicao.z + this.def.olhar[1]);
    }
    this.#poseBase();
  }

  atualizar(dt) {
    if (this.def.comportamento === 'passear' && !this.conversando) this.#passear(dt);
    this.tempo += dt;
    this.marcador.atualizar(this.tempo);
    super.atualizar(dt);
  }

  #passear(dt) {
    if (this.pausa > 0) {
      this.pausa -= dt;
      if (this.anim.nomeAtual !== 'Idle_A') this.anim.tocar('Idle_A');
      return;
    }
    const [ax, az] = this.def.rota[this.indiceRota];
    const dx = ax * Q - this.posicao.x;
    const dz = az * Q - this.posicao.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.3) {
      this.indiceRota = (this.indiceRota + 1) % this.def.rota.length;
      this.pausa = 1.2 + Math.random() * 1.5;
      return;
    }
    this.mover({ x: (dx / dist) * VEL_PASSEIO * dt, z: (dz / dist) * VEL_PASSEIO * dt });
    this.anguloAlvo = Math.atan2(dx, dz);
    this.anim.tocar('Walking_A', { velocidade: 0.8 });
  }
}
