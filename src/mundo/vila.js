import * as THREE from 'three';
import { criarPlaca } from './placa.js';
import { criarNevoa } from './nevoa.js';
import { REGIOES } from '../conteudo/unidade1.js';

// Monta a Vila Ativa numa grade de quarteirões de 10 m (centro da praça = 0,0; norte = -z).
//
//   anel 0-1  Praça do Bairro
//   anel 2    rua em volta da praça (faixas de pedestre perto da praça)
//   anel 3    prédios e pracinhas, com as 4 estradas saindo para as regiões
//   anel 4+   floresta; a estrada termina na névoa que bloqueia cada região
export const Q = 10;
export const LIMITE = 4.5 * Q;

const DIRECOES = {
  norte: { di: 0, dj: -1 },
  sul: { di: 0, dj: 1 },
  oeste: { di: -1, dj: 0 },
  leste: { di: 1, dj: 0 },
};

// Rotação (em y) dos modelos de rua do City Builder Bits, conferida na vista de cima:
// road_straight(_crossing) sem rotação corre no eixo Z; road_corner liga +X e +Z;
// road_tsplit sem rotação tem a rua principal em Z e o ramo em +X.
const ROT = {
  retaX: Math.PI / 2,
  retaZ: 0,
};

function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

export function criarVila(bib, colisao) {
  const grupo = new THREE.Group();
  const animados = [];
  const portais = [];
  const rand = rng(7);

  const por = (obj, i, j, rotY = 0, dx = 0, dz = 0) => {
    obj.position.set(i * Q + dx, 0, j * Q + dz);
    obj.rotation.y = rotY;
    grupo.add(obj);
    return obj;
  };

  // ---------- chão ----------
  const grama = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.MeshStandardMaterial({ color: 0x86b85a, roughness: 1 }));
  grama.rotation.x = -Math.PI / 2;
  grama.receiveShadow = true;
  grupo.add(grama);

  const piso = new THREE.Mesh(new THREE.PlaneGeometry(3 * Q, 3 * Q), new THREE.MeshStandardMaterial({ color: 0xe8dcc2, roughness: 0.95 }));
  piso.rotation.x = -Math.PI / 2;
  piso.position.y = 0.02;
  piso.receiveShadow = true;
  grupo.add(piso);

  // ---------- ruas ----------
  const anel = (i, j) => Math.max(Math.abs(i), Math.abs(j));
  const ehRua = (i, j) => anel(i, j) === 2 || ((i === 0 || j === 0) && anel(i, j) >= 3 && anel(i, j) <= 4);

  for (let i = -4; i <= 4; i++) {
    for (let j = -4; j <= 4; j++) {
      if (!ehRua(i, j)) continue;
      const a = anel(i, j);
      let nome = 'road_straight';
      let rot = 0;
      if (a === 2 && Math.abs(i) === 2 && Math.abs(j) === 2) {
        nome = 'road_corner';
        // Liga as duas ruas vizinhas que vão em direção ao meio do anel.
        rot = Math.atan2(-Math.sign(i), -Math.sign(j)) - Math.PI / 4;
      } else if (a === 2 && (i === 0 || j === 0)) {
        nome = 'road_tsplit';
        // Gira o ramo (+X) para apontar para fora do anel.
        const fora = i === 0 ? { x: 0, z: Math.sign(j) } : { x: Math.sign(i), z: 0 };
        rot = Math.atan2(-fora.z, fora.x);
      } else if (a === 2) {
        const emX = Math.abs(j) === 2;
        nome = Math.abs(i) === 1 || Math.abs(j) === 1 ? 'road_straight_crossing' : 'road_straight';
        rot = emX ? ROT.retaX : ROT.retaZ;
      } else {
        rot = i === 0 ? ROT.retaZ : ROT.retaX;
      }
      const tile = por(bib.modelo('cidade', nome, { sombra: false }), i, j, rot);
      tile.userData.rua = { i, j, nome };
    }
  }

  // ---------- anel 3: prédios e pracinhas ----------
  const predios = bib.nomes('cidade', 'building_');
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      if (anel(i, j) !== 3 || i === 0 || j === 0) continue;
      // Frente do prédio voltada para a rua (para o centro).
      const frente = Math.abs(j) === 3 ? Math.atan2(0, -Math.sign(j)) : Math.atan2(-Math.sign(i), 0);
      if (Math.abs(i) === 3 && Math.abs(j) === 3) {
        pracinha(i, j);
        continue;
      }
      const nome = predios[Math.floor(rand() * predios.length)];
      por(bib.modelo('cidade', nome), i, j, frente);
      colisao.caixa(i * Q, j * Q, 8.6, 8.6);
    }
  }

  function pracinha(i, j) {
    por(bib.modelo('cidade', 'base', { sombra: false }), i, j);
    const arvores = bib.nomes('floresta', 'Tree_');
    for (let k = 0; k < 3; k++) {
      const dx = (rand() - 0.5) * 6;
      const dz = (rand() - 0.5) * 6;
      const a = por(bib.modelo('floresta', arvores[Math.floor(rand() * arvores.length)]), i, j, rand() * 6.28, dx, dz);
      a.scale.multiplyScalar(0.8 + rand() * 0.4);
      colisao.circulo(i * Q + dx, j * Q + dz, 0.9);
    }
  }

  // ---------- Praça do Bairro ----------
  const P = 1.5 * Q;
  // Canteiros com árvores nos 4 cantos.
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = sx * 10;
    const cz = sz * 10;
    const canteiro = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.6, 0.35, 28), new THREE.MeshStandardMaterial({ color: 0x6fa346, roughness: 1 }));
    canteiro.position.set(cx, 0.17, cz);
    canteiro.receiveShadow = true;
    grupo.add(canteiro);
    const arv = bib.modelo('floresta', ['Tree_2_A', 'Tree_3_A', 'Tree_2_C', 'Tree_3_B'][(sx + 1) + (sz + 1) / 2]);
    arv.position.set(cx, 0.3, cz);
    grupo.add(arv);
    colisao.circulo(cx, cz, 3.4);
    for (let k = 0; k < 5; k++) {
      const ang = (k / 5) * Math.PI * 2 + rand();
      const moita = bib.modelo('floresta', rand() > 0.5 ? 'Bush_1_A' : 'Bush_2_A');
      moita.scale.multiplyScalar(2.2);
      moita.position.set(cx + Math.cos(ang) * 2.6, 0.3, cz + Math.sin(ang) * 2.6);
      grupo.add(moita);
    }
  }

  // Bancos voltados para o centro, dois em cada lado.
  const bancos = [];
  for (const [x, z] of [[-4, 9], [4, 9], [-4, -9], [4, -9], [9, -4], [9, 4], [-9, -4], [-9, 4]]) {
    const b = bib.modelo('cidade', 'bench');
    const nosLados = Math.abs(x) === 9;
    b.position.set(x, 0.02, z);
    b.rotation.y = nosLados ? Math.atan2(-Math.sign(x), 0) : Math.atan2(0, -Math.sign(z));
    grupo.add(b);
    bancos.push(b);
    colisao.caixa(x, z, nosLados ? 0.9 : 2.1, nosLados ? 2.1 : 0.9);
  }

  // Postes nas bordas da praça.
  for (const [x, z] of [[-14, -5], [14, -5], [-14, 5], [14, 5], [-5, -14], [5, -14], [-5, 14], [5, 14]]) {
    const poste = bib.modelo('cidade', 'streetlight');
    poste.position.set(x, 0, z);
    poste.rotation.y = Math.atan2(-x, -z);
    grupo.add(poste);
    colisao.circulo(x, z, 0.35);
  }

  // Placa da praça ao lado da prefeita.
  const placa = criarPlaca(['Praça do Bairro', 'Vila Ativa']);
  placa.position.set(-2.2, 0, -1.4);
  placa.rotation.y = 0.35;
  grupo.add(placa);
  colisao.circulo(-2.2, -1.4, 0.4);

  // ---------- carros estacionados ----------
  for (const [nome, i, j, lado] of [['car_sedan', 3, 0, 1], ['car_taxi', -3, 0, -1], ['car_hatchback', 0, 3, 1], ['car_stationwagon', 0, -3, -1]]) {
    const emX = j === 0;
    const c = bib.modelo('cidade', nome);
    const dx = emX ? 0 : lado * 3;
    const dz = emX ? lado * 3 : 0;
    por(c, i, j, emX ? Math.PI / 2 : 0, dx, dz);
    colisao.caixa(i * Q + dx, j * Q + dz, emX ? 4.8 : 2.2, emX ? 2.2 : 4.8);
  }

  // ---------- floresta em volta ----------
  const arvores = bib.nomes('floresta', 'Tree_');
  const pedras = bib.nomes('floresta', 'Rock_');
  const corredor = (x, z) => (Math.abs(x) < 7 && Math.abs(z) > 32) || (Math.abs(z) < 7 && Math.abs(x) > 32);
  for (let k = 0; k < 420; k++) {
    const x = (rand() - 0.5) * 150;
    const z = (rand() - 0.5) * 150;
    const dentro = Math.max(Math.abs(x), Math.abs(z));
    if (dentro < 36 || corredor(x, z)) continue;
    const a = bib.modelo('floresta', arvores[Math.floor(rand() * arvores.length)], { sombra: dentro < 60 });
    a.position.set(x, 0, z);
    a.rotation.y = rand() * 6.28;
    a.scale.multiplyScalar(0.85 + rand() * 0.5);
    grupo.add(a);
    if (dentro < LIMITE + 2) colisao.circulo(x, z, 1);
  }
  for (let k = 0; k < 60; k++) {
    const x = (rand() - 0.5) * 100;
    const z = (rand() - 0.5) * 100;
    if (Math.max(Math.abs(x), Math.abs(z)) < 40 || corredor(x, z)) continue;
    const p = bib.modelo('floresta', pedras[Math.floor(rand() * pedras.length)]);
    p.position.set(x, 0, z);
    p.scale.multiplyScalar(0.9 + rand() * 0.6);
    grupo.add(p);
  }

  // ---------- portais das regiões (fechados pela névoa) ----------
  for (const r of REGIOES) {
    if (!r.porta) continue;
    const { di, dj } = DIRECOES[r.porta];
    const ang = Math.atan2(di, dj);
    const nevoa = criarNevoa(12, r.n * 101);
    nevoa.position.set(di * 4.2 * Q, 0, dj * 4.2 * Q);
    nevoa.rotation.y = ang;
    grupo.add(nevoa);
    animados.push(nevoa.userData.atualizar);
    const lateral = di === 0;
    const bloqueio = colisao.caixa(di * 4.1 * Q, dj * 4.1 * Q, lateral ? 12 : 3, lateral ? 3 : 12, r.id);

    // Na calçada, depois dos prédios, de frente para quem chega da praça.
    const lx = di * 3.85 * Q + (lateral ? 5.6 : 0);
    const lz = dj * 3.85 * Q + (lateral ? 0 : 5.6);
    const portal = { regiao: r, nevoa, bloqueio, placa: null, aberto: false };
    portal.trocarPlaca = (subtitulo) => {
      if (portal.placa) grupo.remove(portal.placa);
      portal.placa = criarPlaca([r.nome, subtitulo], { largura: 4.2 });
      portal.placa.position.set(lx, 0, lz);
      // Vira para a estrada, puxando para o sul: a câmera olha para o norte, e de lado a placa sumiria.
      portal.placa.rotation.y = Math.atan2(di * 3 * Q - lx, dj * 3 * Q + 12 - lz);
      grupo.add(portal.placa);
    };
    portal.trocarPlaca(`Região ${r.n} · coberta pela névoa`);
    colisao.circulo(lx, lz, 0.4);
    portais.push(portal);
  }

  // Tira a névoa da estrada de uma região (animado quando acontece durante o jogo).
  function liberarRegiao(id, imediato = false) {
    const p = portais.find((x) => x.regiao.id === id);
    if (!p || p.aberto) return;
    p.aberto = true;
    p.bloqueio.ativo = false;
    p.nevoa.userData.dissipar(imediato);
    p.trocarPlaca(`Região ${p.regiao.n} · liberada!`);
  }

  return {
    grupo,
    portais,
    bancos,
    liberarRegiao,
    atualizar: (t, dt) => animados.forEach((f) => f(t, dt)),
  };
}

// Nome do lugar onde o jogador está (para o aviso no topo da tela).
export function lugarEm(x, z) {
  const m = Math.max(Math.abs(x), Math.abs(z));
  if (m < 1.5 * Q) return 'Praça do Bairro';
  if (m > 3.5 * Q) {
    for (const r of REGIOES) {
      if (!r.porta) continue;
      const { di, dj } = DIRECOES[r.porta];
      const naEstrada = di ? Math.sign(x) === di && Math.abs(z) < Q : Math.sign(z) === dj && Math.abs(x) < Q;
      if (naEstrada) return `Estrada para: ${r.nome}`;
    }
  }
  return 'Vila Ativa';
}
