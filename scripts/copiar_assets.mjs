// Seleciona, empacota e copia para src/assets/ só os arquivos que o jogo usa.
// Os originais em "Assets 3D" não são alterados.
//
//   npm run assets                       (usa a pasta padrão)
//   ASSETS_3D="C:/caminho/Assets 3D" npm run assets
//
// Saída:
//   src/assets/modelos/cidade.glb      KayKit City Builder Bits (um nó por modelo, textura única)
//   src/assets/modelos/floresta.glb    KayKit Forest Nature Pack (seleção)
//   src/assets/modelos/anims/*.glb     clipes do Rig_Medium (sem malhas)
//   src/assets/modelos/personagens/*.glb
//   src/assets/sons/*.mp3
//   src/assets/icones/*.png         Free Icon Pack (só os usados)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO, Document } from '@gltf-transform/core';
import { mergeDocuments, unpartition, dedup, prune } from '@gltf-transform/functions';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');
const PADRAO = path.resolve(RAIZ, '../Assets 3D');
const BASE = process.env.ASSETS_3D || PADRAO;
const SAIDA = path.join(RAIZ, 'src/assets');

const io = new NodeIO();

// As pastas dos packs podem estar soltas em "Assets 3D" ou aninhadas dentro de
// uma delas (como na máquina original). Procura a primeira que existir.
function acharPack(nome) {
  const candidatos = [path.join(BASE, nome), path.join(BASE, 'KayKit_Forest_Nature_Pack_1.0_FREE', nome)];
  for (const c of candidatos) {
    if (fs.existsSync(c) && fs.statSync(c).isDirectory()) {
      // Alguns zips extraem pack/pack/...
      const interno = path.join(c, nome);
      return fs.existsSync(interno) ? interno : c;
    }
  }
  throw new Error(`Pack não encontrado: ${nome} (procurado em ${BASE})`);
}

const CIDADE = path.join(acharPack('KayKit_City_Builder_Bits_1.0_FREE'), 'Assets/gltf');
const FLORESTA = path.join(acharPack('KayKit_Forest_Nature_Pack_1.0_FREE'), 'Assets/gltf');
const AVENTUREIROS = path.join(acharPack('KayKit_Adventurers_2.0_FREE'), 'Characters/gltf');
const ANIMS = path.join(acharPack('KayKit_Character_Animations_1.1'), 'Animations/gltf/Rig_Medium');
const SONS = path.join(acharPack('JDSherbert - Tabletop Games SFX Pack (FREE)'), 'Mono/mp3');

const FILTRO_CIDADE = (f) => f.endsWith('.gltf') && !f.includes('withoutBase');
const FILTRO_FLORESTA = (f) =>
  /^(Tree_[1-4]_[A-E]|Tree_Bare_1_A|Bush_(1_A|1_C|2_A|2_C|4_A)|Rock_(1_A|1_E|1_J|3_A|3_E)|Grass_(1_A|2_A))_Color1\.gltf$/.test(f);
const RIGS = ['General', 'MovementBasic', 'MovementAdvanced', 'Simulation'];
const SONS_USADOS = {
  'Paper Flip - 1': 'papel',
  'Dice Roll - 1': 'dado',
  'Piece Move - 1': 'peca_mover',
  'Piece Impact - 1': 'peca_encaixe',
  'Deck Deal - 1': 'carta',
  'Dice Pickup - 1': 'pegar',
};

// Ícones do HUD e do inventário: nome no jogo -> [pasta no pack, arquivo preferido].
// Sem preferência, usa o primeiro "1st 64px" sem contorno.
const ICONES = {
  diario: ['Item/Book', /^Purple Book 1st 64px/],
  tenis: ['Item/Shoe'],
  cronometro: ['Item/Clock'],
  faixa: ['Player/Arm', /^Arm 1st 64px/],
  colchonete: ['Item/Scroll'],
  prancheta: ['Item/Pencil'],
  mapa: ['Item/Location Pin'],
  garrafinha: ['Item/Potion'],
  medalha: ['Item/Medal', /^Golden Medal 1st 64/],
  trofeu: ['Item/Trophy'],
  mochila: ['Item/Backpack'],
  cadeado: ['Item/Lock'],
  forca: ['Player/Arm', /^Red Arm 1st 64px/],
  resistencia: ['Main/Heart'],
  flexibilidade: ['Nature/Leaf', /^Leaf 1st 64px/],
  agilidade: ['Main/Lighting', /^Lighting 1st 64px/],
  cooperacao: ['Player/Friend'],
  xp: ['Main/Star'],
  missao: ['UI/Exclamation Mark'],
  feito: ['UI/Checkmark', /^Checkmark 1st 64px/],
};

function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

// Junta vários .gltf num único .glb: cada arquivo vira um nó-raiz "M_<arquivo>"
// (prefixo para o nome não colidir com os nós internos, que o GLTFLoader renomearia).
async function empacotar(pasta, filtro, nomeSaida, renomear = (f) => f) {
  const arquivos = fs.readdirSync(pasta).filter(filtro).sort();
  const alvo = new Document();
  alvo.createBuffer();
  const cena = alvo.createScene('modelos');
  for (const arq of arquivos) {
    const origem = await io.read(path.join(pasta, arq));
    const mapa = mergeDocuments(alvo, origem);
    const cenaOrigem = mapa.get(origem.getRoot().listScenes()[0]);
    const raiz = alvo.createNode(`M_${renomear(arq.replace(/\.gltf$/, ''))}`);
    for (const no of cenaOrigem.listChildren()) raiz.addChild(no);
    cena.addChild(raiz);
    cenaOrigem.dispose();
  }
  alvo.getRoot().setDefaultScene(cena);
  await alvo.transform(unpartition(), dedup(), prune());
  const destino = path.join(SAIDA, 'modelos', nomeSaida);
  await io.write(destino, alvo);
  console.log(`  ${nomeSaida}: ${arquivos.length} modelos, ${kb(fs.statSync(destino).size)}`);
}

// Clipes dos rigs sem as malhas do manequim. Um arquivo por rig: se fossem juntos,
// o GLTFLoader renomearia os ossos repetidos (hips_1...) e os clipes não achariam o esqueleto.
async function empacotarAnims() {
  const dest = path.join(SAIDA, 'modelos', 'anims');
  fs.mkdirSync(dest, { recursive: true });
  for (const rig of RIGS) {
    const doc = await io.read(path.join(ANIMS, `Rig_Medium_${rig}.glb`));
    for (const no of doc.getRoot().listNodes()) {
      if (no.getMesh()) no.setMesh(null);
      if (no.getSkin()) no.setSkin(null);
    }
    for (const anim of doc.getRoot().listAnimations()) {
      if (anim.getName() === 'T-Pose') anim.dispose();
    }
    await doc.transform(prune({ keepLeaves: true }));
    const destino = path.join(dest, `${rig}.glb`);
    await io.write(destino, doc);
    const n = doc.getRoot().listAnimations().length;
    console.log(`  anims/${rig}.glb: ${n} clipes, ${kb(fs.statSync(destino).size)}`);
  }
}

function copiarPersonagens() {
  const dest = path.join(SAIDA, 'modelos', 'personagens');
  fs.mkdirSync(dest, { recursive: true });
  const glbs = fs.readdirSync(AVENTUREIROS).filter((f) => f.endsWith('.glb'));
  for (const f of glbs) fs.copyFileSync(path.join(AVENTUREIROS, f), path.join(dest, f));
  console.log(`  personagens: ${glbs.join(', ')}`);
}

function copiarSons() {
  const dest = path.join(SAIDA, 'sons');
  fs.mkdirSync(dest, { recursive: true });
  for (const [trecho, nome] of Object.entries(SONS_USADOS)) {
    const f = fs.readdirSync(SONS).find((x) => x.includes(trecho));
    if (!f) throw new Error(`Som não encontrado: ${trecho}`);
    fs.copyFileSync(path.join(SONS, f), path.join(dest, `${nome}.mp3`));
  }
  console.log(`  sons: ${Object.values(SONS_USADOS).join(', ')}`);
}

function copiarIcones() {
  const pack = acharPack('Free Icon Pack v3.1 (Basic)');
  const dest = path.join(SAIDA, 'icones');
  fs.mkdirSync(dest, { recursive: true });
  for (const [nome, [pasta, preferido]] of Object.entries(ICONES)) {
    // A subpasta pode se chamar "64px" ou "64w", conforme o ícone.
    const sub = fs.readdirSync(path.join(pack, pasta)).find((x) => x.startsWith('64'));
    const dir = path.join(pack, pasta, sub);
    const arquivos = fs.readdirSync(dir).sort();
    const f = arquivos.find((x) => (preferido ? preferido.test(x) : /1st 64\w*\.png$/.test(x) && !x.includes('Outline')));
    if (!f) throw new Error(`Ícone não encontrado: ${pasta}`);
    fs.copyFileSync(path.join(dir, f), path.join(dest, `${nome}.png`));
  }
  console.log(`  icones: ${Object.keys(ICONES).length}`);
}

console.log(`Assets de: ${BASE}`);
fs.mkdirSync(path.join(SAIDA, 'modelos'), { recursive: true });
await empacotar(CIDADE, FILTRO_CIDADE, 'cidade.glb');
await empacotar(FLORESTA, FILTRO_FLORESTA, 'floresta.glb', (n) => n.replace(/_Color1$/, ''));
await empacotarAnims();
copiarPersonagens();
copiarSons();
copiarIcones();
console.log('Pronto.');
