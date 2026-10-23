import * as THREE from 'three';
import './ui/estilo.css';
import { criarRender } from './engine/render.js';
import { CameraSeguidora } from './engine/camera.js';
import { Entrada } from './engine/input.js';
import { carregarTudo } from './engine/loader.js';
import { Colisao } from './engine/colisao.js';
import { criarVila, lugarEm, LIMITE } from './mundo/vila.js';
import { Npc } from './mundo/npcs.js';
import { Jogador } from './rpg/jogador.js';
import { Missoes } from './rpg/missoes.js';
import { CaixaDialogo } from './ui/caixa_dialogo.js';
import { Hud } from './ui/hud.js';
import { Diario } from './ui/diario.js';
import { fluxoInicio } from './ui/telas.js';
import { retrato } from './ui/retratos.js';
import { NPCS, DIALOGOS, MISSOES } from './conteudo/unidade1.js';
import { CLASSES } from './conteudo/rpg.js';

const DIST_CONVERSA = 2.6;
const INICIO = new THREE.Vector3(0, 0, 12);

const $ = (id) => document.getElementById(id);
const { renderer, cena, atualizarSol, aoRedimensionar } = criarRender($('jogo'));
const cam = new CameraSeguidora(renderer.domElement);
aoRedimensionar(cam.camera);
const entrada = new Entrada(renderer.domElement);
const dialogo = new CaixaDialogo();
const hud = new Hud();

const bib = await carregarTudo((p) => {
  $('barra-progresso').style.width = `${Math.round(p * 100)}%`;
});
$('texto-progresso').textContent = 'Montando a vila…';
await new Promise((ok) => setTimeout(ok, 0)); // deixa a mensagem aparecer antes de montar

const colisao = new Colisao(LIMITE);
const vila = criarVila(bib, colisao);
cena.add(vila.grupo);

const npcs = NPCS.map((def) => {
  const npc = new Npc(bib, colisao, def);
  cena.add(npc.raiz);
  return npc;
});

// Compila os shaders antes do primeiro quadro para não engasgar ao começar.
renderer.compile(cena, cam.camera);

// Estes só existem depois que o aluno entra no jogo.
let estado = null;
let missoes = null;
let jogador = null;
let diario = null;
let rodando = false;

// ---------- conversa ----------
function conversar(npc) {
  if (dialogo.aberta || diario.aberto) return;
  const def = DIALOGOS[missoes.dialogoDe(npc.def)];
  if (!def) return;
  jogador.pararDeAndar();
  jogador.parado = true;
  entrada.bloqueado = true;
  jogador.virarPara(npc.posicao.x, npc.posicao.z);
  jogador.anim.tocar('Idle_A');
  npc.comecarConversa(jogador);
  dialogo.abrir(npc.nome, def, {
    apelido: estado.d.nome.split(' ')[0],
    aoAcao: (acao) => missoes.acao(acao),
    aoResposta: (id, pergunta, texto) => estado.responder(id, pergunta, texto),
    aoFechar: () => {
      npc.terminarConversa();
      jogador.parado = false;
      entrada.bloqueado = false;
      missoes.evento(`falou:${npc.def.id}`);
    },
  });
}

function npcMaisProximo() {
  let melhor = null;
  let dMelhor = DIST_CONVERSA;
  for (const npc of npcs) {
    const d = npc.posicao.distanceTo(jogador.posicao);
    if (d < dMelhor) {
      melhor = npc;
      dMelhor = d;
    }
  }
  return melhor;
}

// ---------- clique: chão ou NPC ----------
const raio = new THREE.Raycaster();
const chao = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const ponto = new THREE.Vector3();

function donoDe(obj) {
  return npcs.find((n) => {
    for (let o = obj; o; o = o.parent) if (o === n.raiz) return true;
    return false;
  });
}

function tratarClique({ x, y }) {
  raio.setFromCamera({ x, y }, cam.camera);
  const acertos = raio.intersectObjects(npcs.map((n) => n.raiz), true);
  const npc = acertos.length ? donoDe(acertos[0].object) : null;
  if (npc) {
    if (npc.posicao.distanceTo(jogador.posicao) < DIST_CONVERSA) conversar(npc);
    else jogador.irPara(npc.posicao, npc);
    return;
  }
  if (raio.ray.intersectPlane(chao, ponto)) jogador.irPara(ponto);
}

// ---------- teclas do Diário ----------
function tratarTeclasDiario() {
  if (entrada.tocou('Tab')) diario.alternar();
  else if (entrada.tocou('KeyI')) diario.alternar('mochila');
  else if (entrada.tocou('KeyM')) diario.alternar('mapa');
  else if (entrada.tocou('KeyJ')) diario.alternar('missoes');
  else if (entrada.tocou('Escape') && diario.aberto) diario.fechar();
}

// ---------- save da posição ----------
let ultimoSave = 0;
function salvarPosicao(forcar = false) {
  if (!estado || !jogador) return;
  const agora = performance.now();
  if (!forcar && agora - ultimoSave < 5000) return;
  ultimoSave = agora;
  const p = jogador.posicao;
  const antes = estado.d.pos;
  if (!forcar && antes && Math.hypot(antes[0] - p.x, antes[1] - p.z) < 0.5) return;
  estado.d.pos = [+p.x.toFixed(2), +p.z.toFixed(2)];
  estado.salvar();
}
window.addEventListener('beforeunload', () => salvarPosicao(true));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) salvarPosicao(true);
});

// ---------- laço ----------
const relogio = new THREE.Clock();
const centro = new THREE.Vector3();

function quadro(dtFixo) {
  const dt = dtFixo ?? Math.min(relogio.getDelta(), 1 / 20);
  const t = relogio.elapsedTime;

  if (!rodando) {
    // Menus: a câmera gira devagar em volta da praça.
    const a = t * 0.06;
    cam.camera.position.set(Math.sin(a) * 42, 26, Math.cos(a) * 42);
    cam.camera.lookAt(0, 2, 0);
    for (const npc of npcs) npc.atualizar(dt);
    vila.atualizar(t, dt);
    atualizarSol(centro);
    renderer.render(cena, cam.camera);
    entrada.fimDoQuadro();
    return;
  }

  const estavaConversando = dialogo.aberta;
  dialogo.atualizar(dt, entrada);
  if (!estavaConversando && !dialogo.aberta) tratarTeclasDiario();
  entrada.bloqueado = dialogo.aberta || diario.aberto;
  jogador.parado = entrada.bloqueado;

  if (!entrada.bloqueado && !estavaConversando) {
    for (const c of entrada.cliques) tratarClique(c);
    const perto = npcMaisProximo();
    if (perto && entrada.tocou('KeyE')) conversar(perto);
    hud.prompt(dialogo.aberta ? null : perto?.raiz, perto ? `Conversar com ${perto.nome}` : '', cam.camera);
    hud.avisarLugar(lugarEm(jogador.posicao.x, jogador.posicao.z));
  } else {
    hud.prompt(null);
  }

  jogador.atualizar(dt, entrada);
  for (const npc of npcs) {
    npc.marcador.definir(missoes.marcadorDe(npc.def.id));
    npc.atualizar(dt);
  }
  vila.atualizar(t, dt);
  cam.atualizar(dt);
  atualizarSol(jogador.posicao);
  renderer.render(cena, cam.camera);
  salvarPosicao();
  entrada.fimDoQuadro();
}
renderer.setAnimationLoop(() => quadro());
entrada.bloqueado = true;
$('tela-carregando').classList.add('oculto');

// ---------- entrada do aluno ----------
estado = await fluxoInicio({ renderer, bib });
missoes = new Missoes(estado, MISSOES);
const classe = CLASSES.find((c) => c.id === estado.d.classe);
const retratoUrl = retrato(renderer, bib, classe.modelo, estado.d.tom);

jogador = new Jogador(bib, colisao, classe.modelo, { tom: estado.d.tom });
jogador.aoChegarNpc = conversar;
const [px, pz] = estado.d.pos || [INICIO.x, INICIO.z];
jogador.colocar(px, pz);
jogador.virarPara(0, 0, true);
cena.add(jogador.raiz);
cam.seguir(jogador.raiz);

for (const id of estado.d.regioes) vila.liberarRegiao(id, true);
estado.on('regiao', ({ id }) => vila.liberarRegiao(id));

hud.ligar(estado, missoes, retratoUrl);
diario = new Diario({ estado, missoes, retratoUrl, posJogador: () => jogador.posicao, npcs });
$('btn-diario').addEventListener('click', (e) => { e.currentTarget.blur(); diario.alternar('missoes'); });
$('btn-mochila').addEventListener('click', (e) => { e.currentTarget.blur(); diario.alternar('mochila'); });
$('btn-mapa').addEventListener('click', (e) => { e.currentTarget.blur(); diario.alternar('mapa'); });

hud.mostrar();
if (!estado.d.pos) hud.aviso('Converse com a Prefeita Dona Lúcia, no meio da praça', 'missao', 'grande');
else hud.aviso(`Bem-vindo(a) de volta, ${estado.d.nome.split(' ')[0]}!`, 'xp', 'grande');
rodando = true;
renderer.domElement.focus();

// Acesso para depuração no console. simular(s, teclas) roda `s` segundos de jogo com teclas seguradas.
window.__jogo = {
  cena, jogador, npcs, cam, colisao, bib, dialogo, entrada, estado, missoes, vila, diario,
  simular(segundos, teclas = []) {
    teclas.forEach((k) => { entrada.teclas.add(k); entrada.toques.add(k); });
    for (let i = 0; i < segundos * 30; i++) quadro(1 / 30);
    teclas.forEach((k) => entrada.teclas.delete(k));
  },
  liberar: (id) => estado.liberarRegiao(id),
};
