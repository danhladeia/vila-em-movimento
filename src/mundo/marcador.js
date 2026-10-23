import * as THREE from 'three';

// Balão sobre a cabeça do NPC: "!" (missão nova) ou "?" (próximo passo de uma missão).
const texturas = {};

function textura(simbolo) {
  if (texturas[simbolo]) return texturas[simbolo];
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = simbolo === '!' ? '#ffc933' : '#2f7ee8';
  ctx.strokeStyle = '#2a1259';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(64, 64, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = simbolo === '!' ? '#2a1259' : '#ffffff';
  ctx.font = '900 80px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(simbolo, 64, 70);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  texturas[simbolo] = t;
  return t;
}

export class Marcador {
  constructor(pai, altura = 3.3) {
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ depthTest: false, transparent: true }));
    this.sprite.scale.setScalar(0.9);
    this.sprite.renderOrder = 10;
    this.sprite.visible = false;
    this.altura = altura;
    this.simbolo = null;
    pai.add(this.sprite);
  }

  definir(simbolo) {
    if (simbolo === this.simbolo) return;
    this.simbolo = simbolo;
    this.sprite.visible = Boolean(simbolo);
    if (simbolo) {
      this.sprite.material.map = textura(simbolo);
      this.sprite.material.needsUpdate = true;
    }
  }

  atualizar(t) {
    if (this.sprite.visible) this.sprite.position.y = this.altura + Math.sin(t * 3) * 0.12;
  }
}
