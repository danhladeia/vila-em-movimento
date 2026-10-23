import * as THREE from 'three';

// Câmera 3/4 que segue o jogador com suavização. A roda do mouse aproxima/afasta.
export class CameraSeguidora {
  constructor(dom) {
    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.5, 260);
    this.desloc = new THREE.Vector3(0, 15, 15);
    this.zoom = 1;
    this.foco = new THREE.Vector3();
    this.alvo = null;

    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoom = THREE.MathUtils.clamp(this.zoom + Math.sign(e.deltaY) * 0.1, 0.55, 1.6);
    }, { passive: false });
  }

  seguir(objeto) {
    this.alvo = objeto;
    this.foco.copy(objeto.position);
    this.#posicionar(1);
  }

  atualizar(dt) {
    if (!this.alvo) return;
    // Suavização independente da taxa de quadros.
    const k = 1 - Math.exp(-6 * dt);
    this.foco.lerp(this.alvo.position, k);
    this.#posicionar(k);
  }

  #posicionar(k) {
    const desejada = this.foco.clone().addScaledVector(this.desloc, this.zoom);
    this.camera.position.lerp(desejada, k);
    this.camera.lookAt(this.foco.x, this.foco.y + 1.2, this.foco.z);
  }
}
