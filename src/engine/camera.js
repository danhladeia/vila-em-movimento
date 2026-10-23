import * as THREE from 'three';

// Câmera que segue o jogador, em dois modos (tecla V):
//   'cima'      3/4 de cima, olhando sempre para o norte (bom para se localizar)
//   'terceira'  atrás do personagem; arrastar o mouse gira; ao andar para a frente ela volta para trás dele
// A roda do mouse aproxima/afasta nos dois modos.
const ALTURA_FOCO = 1.6;
const VOLTA_ATRAS_MS = 1500; // espera depois de girar com o mouse antes de voltar para trás do personagem

export class CameraSeguidora {
  constructor(dom) {
    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.3, 260);
    this.modo = 'cima';
    this.desloc = new THREE.Vector3(0, 15, 15);
    this.zoom = 1;
    this.yaw = 0;          // 0 = câmera ao sul, olhando para o norte (como o modo de cima)
    this.pitch = 0.4;      // inclinação na 3ª pessoa
    this.distancia = 8.5;
    this.ultimoGiro = 0;
    this.foco = new THREE.Vector3();
    this.alvo = null;
    this.colisao = null;
    this.tmp = new THREE.Vector3();

    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      const passo = Math.sign(e.deltaY);
      if (this.modo === 'terceira') this.distancia = THREE.MathUtils.clamp(this.distancia + passo * 0.8, 3.5, 13);
      else this.zoom = THREE.MathUtils.clamp(this.zoom + passo * 0.1, 0.55, 1.6);
    }, { passive: false });
  }

  seguir(objeto) {
    this.alvo = objeto;
    this.foco.copy(objeto.position);
    this.#posicionar(1);
  }

  // Troca de modo. Na 3ª pessoa, começa atrás do personagem (`anguloJogador` = para onde ele olha).
  alternar(anguloJogador = 0) {
    this.modo = this.modo === 'cima' ? 'terceira' : 'cima';
    if (this.modo === 'terceira') this.yaw = anguloJogador + Math.PI;
    else this.yaw = 0;
    return this.modo;
  }

  definirModo(modo, anguloJogador = 0) {
    if (modo !== this.modo) this.alternar(anguloJogador);
  }

  // Arrasto do mouse (em pixels): gira em volta do personagem e muda a inclinação.
  girar(dx, dy) {
    if (this.modo !== 'terceira' || (!dx && !dy)) return;
    this.yaw -= dx * 0.006;
    this.pitch = THREE.MathUtils.clamp(this.pitch + dy * 0.004, 0.08, 1.1);
    this.ultimoGiro = performance.now();
  }

  // Direção "para a frente" no chão (x, z), usada para o teclado andar relativo à câmera.
  frente() {
    return { x: -Math.sin(this.yaw), z: -Math.cos(this.yaw) };
  }

  // `jogador` = { angulo, andandoParaFrente } para a câmera voltar sozinha para trás dele.
  atualizar(dt, jogador = null) {
    if (!this.alvo) return;
    if (this.modo === 'terceira' && jogador?.andandoParaFrente && performance.now() - this.ultimoGiro > VOLTA_ATRAS_MS) {
      let d = jogador.angulo + Math.PI - this.yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      this.yaw += d * (1 - Math.exp(-2.2 * dt));
    }
    // Suavização independente da taxa de quadros.
    const k = 1 - Math.exp(-6 * dt);
    this.foco.lerp(this.alvo.position, this.modo === 'terceira' ? 1 - Math.exp(-14 * dt) : k);
    this.#posicionar(k);
  }

  #posicionar(k) {
    const desejada = this.tmp;
    if (this.modo === 'terceira') {
      const d = this.#distanciaLivre();
      const h = Math.cos(this.pitch) * d;
      desejada.set(
        this.foco.x + Math.sin(this.yaw) * h,
        this.foco.y + ALTURA_FOCO + Math.sin(this.pitch) * d,
        this.foco.z + Math.cos(this.yaw) * h,
      );
      this.camera.position.lerp(desejada, 1 - (1 - k) ** 2);
      this.camera.lookAt(this.foco.x, this.foco.y + ALTURA_FOCO, this.foco.z);
    } else {
      desejada.copy(this.foco).addScaledVector(this.desloc, this.zoom);
      this.camera.position.lerp(desejada, k);
      this.camera.lookAt(this.foco.x, this.foco.y + 1.2, this.foco.z);
    }
  }

  // Aproxima a câmera quando um prédio (ou outra caixa grande) ficaria entre ela e o personagem.
  #distanciaLivre() {
    if (!this.colisao) return this.distancia;
    const passos = 14;
    for (let i = 1; i <= passos; i++) {
      const d = (this.distancia * i) / passos;
      const x = this.foco.x + Math.sin(this.yaw) * Math.cos(this.pitch) * d;
      const z = this.foco.z + Math.cos(this.yaw) * Math.cos(this.pitch) * d;
      const bate = this.colisao.caixas.some((c) => c.ativo && c.maxX - c.minX > 3 && c.maxZ - c.minZ > 3
        && x > c.minX - 0.4 && x < c.maxX + 0.4 && z > c.minZ - 0.4 && z < c.maxZ + 0.4);
      if (bate) return Math.max(2.2, (this.distancia * (i - 1)) / passos);
    }
    return this.distancia;
  }
}
