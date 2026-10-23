import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as clonarComEsqueleto } from 'three/addons/utils/SkeletonUtils.js';

// No build final estes "?url" viram data: URIs embutidos no index.html (funciona em file://).
import urlCidade from '../assets/modelos/cidade.glb?url';
import urlFloresta from '../assets/modelos/floresta.glb?url';

const URL_PERSONAGENS = import.meta.glob('../assets/modelos/personagens/*.glb', { query: '?url', import: 'default', eager: true });
const URL_ANIMS = import.meta.glob('../assets/modelos/anims/*.glb', { query: '?url', import: 'default', eager: true });

const nomeArquivo = (caminho) => caminho.split('/').pop().replace(/\.glb$/, '');

// Escala de cada pack em relação aos personagens KayKit (~2,5 de altura).
// O City Builder Bits é miniatura: um quarteirão de 2×2 vira 10×10.
export const ESCALA = { cidade: 5, floresta: 1.6 };

export class Biblioteca {
  constructor() {
    this.packs = {};          // pack -> Map(nome -> Object3D original)
    this.personagens = {};    // nome -> gltf.scene original
    this.clipes = new Map();  // nome -> AnimationClip
  }

  // Cópia estática (geometria e material compartilhados) já na escala do pack.
  modelo(pack, nome, { sombra = true } = {}) {
    const original = this.packs[pack]?.get(nome);
    if (!original) throw new Error(`Modelo não encontrado: ${pack}/${nome}`);
    const obj = original.clone();
    obj.position.set(0, 0, 0);
    obj.scale.setScalar(ESCALA[pack]);
    obj.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = sombra;
        o.receiveShadow = true;
      }
    });
    return obj;
  }

  nomes(pack, prefixo = '') {
    return [...this.packs[pack].keys()].filter((n) => n.startsWith(prefixo));
  }

  // Personagem animável. `tom` (cor) tinge o material para diferenciar NPCs com o mesmo modelo.
  personagem(nome, { tom = null } = {}) {
    const original = this.personagens[nome];
    if (!original) throw new Error(`Personagem não encontrado: ${nome}`);
    const obj = clonarComEsqueleto(original);
    obj.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = false;
      o.frustumCulled = false; // malhas com esqueleto: a caixa original não acompanha a animação
      if (tom) {
        o.material = o.material.clone();
        o.material.color = new THREE.Color(tom);
      }
    });
    return obj;
  }

  clipe(nome) {
    const c = this.clipes.get(nome);
    if (!c) throw new Error(`Animação não encontrada: ${nome}`);
    return c;
  }
}

export async function carregarTudo(aoProgredir = () => {}) {
  const gerente = new THREE.LoadingManager();
  const loader = new GLTFLoader(gerente);
  const bib = new Biblioteca();

  const tarefas = [
    ['cidade', urlCidade],
    ['floresta', urlFloresta],
    ...Object.entries(URL_PERSONAGENS).map(([c, u]) => [`personagem:${nomeArquivo(c)}`, u]),
    ...Object.entries(URL_ANIMS).map(([c, u]) => [`anims:${nomeArquivo(c)}`, u]),
  ];
  let feitas = 0;

  await Promise.all(tarefas.map(async ([chave, url]) => {
    const gltf = await loader.loadAsync(url);
    if (chave === 'cidade' || chave === 'floresta') {
      const mapa = new Map();
      for (const filho of gltf.scene.children) mapa.set(filho.name.replace(/^M_/, ''), filho);
      bib.packs[chave] = mapa;
    } else if (chave.startsWith('personagem:')) {
      bib.personagens[chave.slice(11)] = gltf.scene;
    } else {
      for (const clipe of gltf.animations) bib.clipes.set(clipe.name, clipe);
    }
    feitas += 1;
    aoProgredir(feitas / tarefas.length);
  }));

  return bib;
}
