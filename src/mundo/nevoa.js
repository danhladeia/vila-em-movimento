import * as THREE from 'three';

const geo = new THREE.IcosahedronGeometry(1, 2);
const OPACIDADE = 0.62;

// Nuvem da Névoa da Preguiça que bloqueia a entrada de uma região ainda não liberada.
// `largura` no eixo X local; gire o grupo para alinhar com a estrada.
// userData.dissipar() faz a nuvem crescer e sumir em ~1,5 s (cada nuvem tem o seu material para isso).
export function criarNevoa(largura, seed = 1) {
  const mat = new THREE.MeshStandardMaterial({
    color: 0xb9a2e6, emissive: 0x6a2fb0, emissiveIntensity: 0.18, roughness: 1, transparent: true, opacity: OPACIDADE, depthWrite: false,
  });
  const grupo = new THREE.Group();
  let sumindo = -1;
  const bolhas = [];
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const n = Math.round(largura * 1.4);
  for (let i = 0; i < n; i++) {
    const b = new THREE.Mesh(geo, mat);
    const r = 1.4 + rand() * 1.8;
    b.scale.setScalar(r);
    b.position.set((rand() - 0.5) * largura, r * 0.55 + rand() * 1.5, (rand() - 0.5) * 3);
    b.userData.base = b.position.clone();
    b.userData.fase = rand() * Math.PI * 2;
    bolhas.push(b);
    grupo.add(b);
  }
  grupo.userData.dissipar = (imediato = false) => {
    if (imediato) grupo.visible = false;
    else if (sumindo < 0) sumindo = 0;
  };
  grupo.userData.atualizar = (t, dt = 1 / 60) => {
    if (!grupo.visible) return;
    if (sumindo >= 0) {
      sumindo += dt / 1.5;
      mat.opacity = OPACIDADE * Math.max(0, 1 - sumindo);
      grupo.scale.setScalar(1 + sumindo * 0.8);
      grupo.position.y = sumindo * 3;
      if (sumindo >= 1) grupo.visible = false;
    }
    for (const b of bolhas) {
      const f = b.userData.fase;
      b.position.y = b.userData.base.y + Math.sin(t * 0.7 + f) * 0.35;
      b.position.x = b.userData.base.x + Math.sin(t * 0.4 + f * 2) * 0.3;
    }
  };
  return grupo;
}
