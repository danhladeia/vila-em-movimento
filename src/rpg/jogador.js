import * as THREE from 'three';
import { Ator } from './ator.js';

const VEL_ANDAR = 3.4;
const VEL_CORRER = 7.2;

// O Aprendiz do Movimento: teclado (relativo à tela) ou clique para ir até um ponto ou NPC.
export class Jogador extends Ator {
  constructor(bib, colisao, modelo, opcoes = {}) {
    super(bib, colisao, modelo, opcoes);
    this.destino = null;      // Vector3 do clique
    this.alvoNpc = null;      // NPC clicado: anda até ele e conversa
    this.aoChegarNpc = null;
    this.travado = 0;
    this.parado = false;      // true durante diálogos
  }

  irPara(ponto, npc = null) {
    this.destino = ponto.clone();
    this.alvoNpc = npc;
    this.travado = 0;
  }

  pararDeAndar() {
    this.destino = null;
    this.alvoNpc = null;
  }

  // `frente` = direção da câmera no chão ({x, z}); o teclado anda relativo a ela.
  // `setasGiram`: na 3ª pessoa, ← e → são da câmera, não do personagem.
  atualizar(dt, entrada, frente = { x: 0, z: -1 }, setasGiram = false) {
    let dir = new THREE.Vector2();
    const correndo = entrada.apertada('ShiftLeft', 'ShiftRight');
    this.andandoParaFrente = false;

    if (!this.parado) {
      const tecla = entrada.direcao(setasGiram);
      if (tecla.x || tecla.y) {
        // direita da câmera = (-frente.z, frente.x)
        dir.set(-frente.z * tecla.x + frente.x * tecla.y, frente.x * tecla.x + frente.z * tecla.y).normalize();
        this.pararDeAndar();
      } else if (this.destino) {
        const dx = this.destino.x - this.posicao.x;
        const dz = this.destino.z - this.posicao.z;
        const dist = Math.hypot(dx, dz);
        const chegou = this.alvoNpc ? dist < 2.2 : dist < 0.25;
        if (chegou) {
          const npc = this.alvoNpc;
          this.pararDeAndar();
          if (npc) this.aoChegarNpc?.(npc);
        } else {
          dir.set(dx / dist, dz / dist);
        }
      }
    }

    if (dir.lengthSq() > 0) {
      const vel = correndo ? VEL_CORRER : VEL_ANDAR;
      const antes = this.posicao.clone();
      this.mover({ x: dir.x * vel * dt, z: dir.y * vel * dt });
      this.anguloAlvo = Math.atan2(dir.x, dir.y);
      // Só conta andar quase reto para a frente: andar de lado (A/D) não deve fazer a câmera girar.
      this.andandoParaFrente = dir.x * frente.x + dir.y * frente.z > 0.9;
      this.anim.tocar(correndo ? 'Running_A' : 'Walking_A');

      // Clique para um lugar bloqueado: desiste depois de um tempinho empurrando a parede.
      if (this.destino) {
        const andou = antes.distanceTo(this.posicao);
        this.travado = andou < vel * dt * 0.3 ? this.travado + dt : 0;
        if (this.travado > 0.35) this.pararDeAndar();
      }
    } else if (this.anim.nomeAtual === 'Walking_A' || this.anim.nomeAtual === 'Running_A') {
      this.anim.tocar('Idle_A');
    }

    super.atualizar(dt);
  }
}
