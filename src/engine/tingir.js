import * as THREE from 'three';

// Recolore a textura (atlas) dos personagens KayKit: troca a cor da pele e tinge a roupa.
// Nos 5 atlas a pele é o mesmo bloco degradê no canto superior esquerdo (1/8 da largura × 1/4 da altura).
// Tingir pela textura (e não por material.color) deixa a pele fora do tom da roupa.

const PELE_REF = [246, 190, 154]; // tom médio da pele original

const cache = new Map();

const rgb = (hex) => {
  const c = new THREE.Color(hex);
  return [c.r * 255, c.g * 255, c.b * 255];
};

// A imagem pode ter vindo invertida (ImageBitmap com flipY): procura o bloco de pele em cima ou embaixo.
function blocoPeleEmCima(dados, L, A) {
  const amostra = (y) => {
    const i = (y * L + 4) * 4;
    return Math.abs(dados[i] - 248) + Math.abs(dados[i + 1] - 204) + Math.abs(dados[i + 2] - 171);
  };
  return amostra(4) <= amostra(A - 5);
}

export function texturaTingida(original, { tom = null, pele = null }) {
  if (!tom && !pele) return original;
  const chave = `${original.uuid}|${tom}|${pele}`;
  if (cache.has(chave)) return cache.get(chave);

  const img = original.image;
  const L = img.width;
  const A = img.height;
  const canvas = document.createElement('canvas');
  canvas.width = L;
  canvas.height = A;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const dados = ctx.getImageData(0, 0, L, A);
  const d = dados.data;

  const emCima = blocoPeleEmCima(d, L, A);
  const peleX = L / 8;
  const peleY0 = emCima ? 0 : A - A / 4;
  const peleY1 = emCima ? A / 4 : A;
  const fp = pele ? rgb(pele).map((v, k) => v / PELE_REF[k]) : null;
  const ft = tom ? rgb(tom).map((v) => v / 255) : null;

  for (let y = 0; y < A; y++) {
    const naFaixaPele = y >= peleY0 && y < peleY1;
    for (let x = 0; x < L; x++) {
      const i = (y * L + x) * 4;
      const f = naFaixaPele && x < peleX ? fp : ft;
      if (!f) continue;
      d[i] = Math.min(255, d[i] * f[0]);
      d[i + 1] = Math.min(255, d[i + 1] * f[1]);
      d[i + 2] = Math.min(255, d[i + 2] * f[2]);
    }
  }
  ctx.putImageData(dados, 0, 0);

  const t = new THREE.CanvasTexture(canvas);
  for (const p of ['flipY', 'colorSpace', 'wrapS', 'wrapT', 'magFilter', 'minFilter', 'channel']) t[p] = original[p];
  t.needsUpdate = true;
  cache.set(chave, t);
  return t;
}
