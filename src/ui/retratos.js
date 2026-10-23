import * as THREE from 'three';
import { Animador } from '../engine/anim.js';

// Retratos 2D dos personagens, desenhados uma vez com o próprio renderer (sem imagens extras).
const TAM = 256;
const cache = new Map();
const SRGB = Uint8Array.from({ length: 256 }, (_, i) => {
  const c = i / 255;
  return Math.round(255 * (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055));
});

export function retrato(renderer, bib, modelo, tom = null) {
  const chave = `${modelo}|${tom}`;
  if (cache.has(chave)) return cache.get(chave);

  const cena = new THREE.Scene();
  cena.add(new THREE.HemisphereLight(0xffffff, 0x9a86c4, 2.2));
  const luz = new THREE.DirectionalLight(0xffffff, 2.2);
  luz.position.set(2, 4, 5);
  cena.add(luz);

  const obj = bib.personagem(modelo, { tom });
  const anim = new Animador(bib, obj);
  anim.tocar('Idle_A', { transicao: 0 });
  anim.atualizar(0.4);
  obj.rotation.y = -0.35;
  cena.add(obj);

  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  cam.position.set(0, 1.85, 4.3);
  cam.lookAt(0, 1.45, 0);

  const alvo = new THREE.WebGLRenderTarget(TAM, TAM);
  const fundoAntes = renderer.getClearColor(new THREE.Color());
  const alfaAntes = renderer.getClearAlpha();
  renderer.setRenderTarget(alvo);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  renderer.render(cena, cam);
  const px = new Uint8Array(TAM * TAM * 4);
  renderer.readRenderTargetPixels(alvo, 0, 0, TAM, TAM, px);
  renderer.setRenderTarget(null);
  renderer.setClearColor(fundoAntes, alfaAntes);
  alvo.dispose();

  // Render targets saem em cor linear: converte para sRGB para o retrato não ficar escuro.
  for (let i = 0; i < px.length; i += 4) {
    px[i] = SRGB[px[i]];
    px[i + 1] = SRGB[px[i + 1]];
    px[i + 2] = SRGB[px[i + 2]];
  }

  // A leitura vem de baixo para cima: inverte as linhas.
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TAM;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(TAM, TAM);
  for (let y = 0; y < TAM; y++) {
    img.data.set(px.subarray((TAM - 1 - y) * TAM * 4, (TAM - y) * TAM * 4), y * TAM * 4);
  }
  ctx.putImageData(img, 0, 0);
  const url = canvas.toDataURL('image/png');
  cache.set(chave, url);
  return url;
}
