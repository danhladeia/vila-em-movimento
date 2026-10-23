import * as THREE from 'three';

// Cor da Névoa da Preguiça: também é a cor do céu e da névoa de distância.
export const COR_NEVOA = 0xd9cdef;

export function criarRender(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  // PCs da escola: limita a resolução para manter ~30 fps em GPU integrada.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const cena = new THREE.Scene();
  cena.background = new THREE.Color(COR_NEVOA);
  cena.fog = new THREE.Fog(COR_NEVOA, 55, 120);

  const ceu = new THREE.HemisphereLight(0xfff6e0, 0x6f8a4e, 1.6);
  cena.add(ceu);

  // Uma única luz com sombra, que acompanha o jogador (ver atualizarSol).
  const sol = new THREE.DirectionalLight(0xffffff, 2.2);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024);
  const area = 28;
  Object.assign(sol.shadow.camera, { left: -area, right: area, top: area, bottom: -area, near: 1, far: 120 });
  sol.shadow.bias = -0.0005;
  sol.shadow.normalBias = 0.03;
  cena.add(sol, sol.target);
  const deslocSol = new THREE.Vector3(18, 34, 14);

  function atualizarSol(foco) {
    sol.position.copy(foco).add(deslocSol);
    sol.target.position.copy(foco);
  }

  function aoRedimensionar(camera) {
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  return { renderer, cena, atualizarSol, aoRedimensionar };
}
