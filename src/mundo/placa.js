import * as THREE from 'three';

// Placa de madeira com texto desenhado num canvas (sem fontes externas).
export function criarPlaca(linhas, { largura = 3.6, cor = '#6a2fb0' } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fffaf0';
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = cor;
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, 496, 240);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const [titulo, ...resto] = Array.isArray(linhas) ? linhas : [linhas];
  ctx.fillStyle = cor;
  ctx.font = '900 54px "Trebuchet MS", "Segoe UI", sans-serif';
  ctx.fillText(titulo, 256, resto.length ? 96 : 128, 470);
  ctx.fillStyle = '#5d5470';
  ctx.font = '700 36px "Trebuchet MS", "Segoe UI", sans-serif';
  resto.forEach((t, i) => ctx.fillText(t, 256, 166 + i * 44, 470));

  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;

  const altura = largura / 2;
  const grupo = new THREE.Group();
  const madeira = new THREE.MeshStandardMaterial({ color: 0x8a5a33, roughness: 0.9 });
  const poste = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.2, 0.22), madeira);
  poste.position.y = 1.1;
  const quadro = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.2, altura + 0.2, 0.16), madeira);
  quadro.position.y = 2.2 + altura / 2;
  const frente = new THREE.Mesh(new THREE.PlaneGeometry(largura, altura), new THREE.MeshStandardMaterial({ map: textura, roughness: 0.8 }));
  frente.position.set(0, quadro.position.y, 0.09);
  const verso = frente.clone();
  verso.rotation.y = Math.PI;
  verso.position.z = -0.09;
  for (const m of [poste, quadro]) m.castShadow = true;
  grupo.add(poste, quadro, frente, verso);
  return grupo;
}
