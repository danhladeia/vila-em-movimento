import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as clonarComEsqueleto } from 'three/addons/utils/SkeletonUtils.js';
import { texturaTingida } from './tingir.js';

// Chapéus, capacetes e máscaras: saem quando o visual pede `semChapeu`.
const CHAPEUS = /_(BearHat|Helmet|HelmetVisor|Hat|Mask)$/;

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

  // Personagem animável.
  // `visual`: nome do modelo ('Knight') ou { corpo, cabeca, semChapeu } para combinar a cabeça
  //   (rosto e cabelo) de um modelo com o corpo de outro: todos usam o mesmo esqueleto Rig_Medium.
  // `tom` tinge a roupa e `pele` troca a cor da pele (ver engine/tingir.js).
  personagem(visual, { tom = null, pele = null } = {}) {
    const v = typeof visual === 'string' ? { corpo: visual } : visual;
    const original = this.personagens[v.corpo];
    if (!original) throw new Error(`Personagem não encontrado: ${v.corpo}`);
    const obj = clonarComEsqueleto(original);

    const malhas = [];
    obj.traverse((o) => o.isSkinnedMesh && malhas.push(o));
    for (const m of malhas) {
      const tirar = (v.semChapeu && CHAPEUS.test(m.name)) || (v.cabeca && /_Head$/.test(m.name));
      if (tirar) m.removeFromParent();
    }
    if (v.cabeca) this.#trocarCabeca(obj, malhas, v.cabeca);

    obj.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = false;
      o.frustumCulled = false; // malhas com esqueleto: a caixa original não acompanha a animação
      // A cabeça (rosto e cabelo) só muda a pele: a cor da roupa não tinge o cabelo.
      const opcoes = /_Head$/.test(o.name) ? { pele } : { tom, pele };
      if ((opcoes.tom || opcoes.pele) && o.material.map) {
        o.material = o.material.clone();
        o.material.map = texturaTingida(o.material.map, opcoes);
      }
    });
    return obj;
  }

  // Põe a cabeça do modelo `doador` no esqueleto de `obj`, ligando cada osso pelo nome.
  #trocarCabeca(obj, malhas, doador) {
    let cabeca = null;
    this.personagens[doador].traverse((o) => {
      if (o.isSkinnedMesh && /_Head$/.test(o.name)) cabeca = o;
    });
    const corpo = malhas.find((m) => /_Body$/.test(m.name));
    const ossos = cabeca.skeleton.bones.map((b) => obj.getObjectByName(b.name));
    const nova = new THREE.SkinnedMesh(cabeca.geometry, cabeca.material);
    nova.name = cabeca.name;
    corpo.parent.add(nova);
    nova.bind(new THREE.Skeleton(ossos, cabeca.skeleton.boneInverses), cabeca.bindMatrix.clone());
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
