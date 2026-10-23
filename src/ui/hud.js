import * as THREE from 'three';
import { CLASSES, NIVEIS, ITENS, ATRIBUTOS } from '../conteudo/rpg.js';
import { imgIcone, preencherIcones } from './icones.js';
import { tocarSom } from '../engine/audio.js';

const $ = (id) => document.getElementById(id);
const escapar = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Ficha do jogador, missão atual, avisos de recompensa, nome do lugar e o balão "E Conversar".
export class Hud {
  constructor() {
    this.el = $('hud');
    this.elRegiao = $('hud-regiao');
    this.elPrompt = $('prompt-interacao');
    this.elPromptTexto = this.elPrompt.querySelector('span');
    this.lugar = '';
    this.timer = null;
    this.v = new THREE.Vector3();
    preencherIcones(this.el);
  }

  mostrar() {
    this.el.classList.remove('oculto');
  }

  // Liga o HUD ao estado do aluno: tudo o que muda no estado aparece aqui.
  ligar(estado, missoes, retratoUrl) {
    this.estado = estado;
    this.missoes = missoes;
    $('hud-retrato').src = retratoUrl;
    this.atualizarFicha();
    this.atualizarMissao();

    estado.on('xp', ({ qtd }) => {
      this.aviso(`+${qtd} XP`, 'xp');
      this.atualizarFicha();
    });
    estado.on('nivel', ({ nivel }) => {
      tocarSom('dado', 0.6);
      this.aviso(`Você subiu para o nível ${nivel}!`, 'xp', 'grande');
    });
    estado.on('item', ({ id }) => {
      tocarSom('pegar', 0.5);
      this.aviso(`Novo item: ${ITENS[id].nome}`, ITENS[id].icone);
    });
    estado.on('atributo', ({ id, qtd }) => {
      const a = ATRIBUTOS.find((x) => x.id === id);
      this.aviso(`${a.nome} +${qtd}`, a.icone);
    });
    estado.on('missao_iniciada', ({ def }) => {
      tocarSom('carta', 0.5);
      this.aviso(`Nova missão: ${def.titulo}`, 'missao', 'grande');
      this.atualizarMissao();
    });
    estado.on('objetivo', ({ objetivo }) => {
      this.aviso(`Feito: ${objetivo.texto}`, 'feito');
      this.atualizarMissao();
    });
    estado.on('missao_pronta', () => this.atualizarMissao());
    estado.on('missao_concluida', ({ def }) => {
      tocarSom('dado', 0.6);
      this.aviso(`Missão concluída: ${def.titulo}`, 'trofeu', 'grande');
      this.atualizarMissao();
    });
    estado.on('resposta', () => this.aviso('Resposta guardada no Diário', 'diario'));
    estado.on('regiao', () => this.aviso('A névoa se afastou de uma estrada!', 'mapa', 'grande'));
  }

  atualizarFicha() {
    const d = this.estado.d;
    const nivel = this.estado.nivel;
    const classe = CLASSES.find((c) => c.id === d.classe);
    $('hud-nome').textContent = d.nome;
    $('hud-nivel').innerHTML = `${imgIcone('xp')} Nível ${nivel} · ${escapar(classe.nome)}`;
    const min = NIVEIS[nivel - 1];
    const max = NIVEIS[nivel];
    $('hud-xp').style.width = max ? `${(100 * (d.xp - min)) / (max - min)}%` : '100%';
    $('hud-xp').parentElement.title = max ? `${d.xp} / ${max} XP` : `${d.xp} XP (nível máximo)`;
  }

  atualizarMissao() {
    const el = $('hud-missao');
    const [id] = this.missoes.ativas();
    if (!id) {
      el.classList.add('oculto');
      return;
    }
    const def = this.missoes.defs[id];
    const pronta = this.missoes.estadoDe(id) === 'pronta';
    const linhas = def.objetivos
      .filter((o) => !o.final || pronta)
      .map((o) => {
        const ok = this.missoes.feito(id, o.id);
        return `<li class="${ok ? 'ok' : ''}">${ok ? imgIcone('feito') : '<i></i>'}${escapar(o.texto)}</li>`;
      })
      .join('');
    el.innerHTML = `<b>${imgIcone('missao')} ${escapar(def.titulo)}</b><ul>${linhas}</ul>`;
    el.classList.remove('oculto');
  }

  // Aviso que sobe no canto e some sozinho. `icone` = nome do ícone; `tipo` 'grande' para destaques.
  aviso(texto, icone = null, tipo = '') {
    const el = document.createElement('div');
    el.className = `aviso ${tipo}`;
    el.innerHTML = `${icone ? imgIcone(icone) : ''}<span>${escapar(texto)}</span>`;
    const pilha = $('hud-avisos');
    pilha.appendChild(el);
    // Muitas recompensas de uma vez: mantém só as 4 mais recentes na tela.
    while (pilha.children.length > 4) pilha.firstElementChild.remove();
    setTimeout(() => el.classList.add('saindo'), tipo === 'grande' ? 3800 : 2600);
    setTimeout(() => el.remove(), tipo === 'grande' ? 4400 : 3200);
  }

  avisarLugar(nome) {
    if (nome === this.lugar) return;
    this.lugar = nome;
    this.elRegiao.textContent = nome;
    this.elRegiao.classList.add('mostrar');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.elRegiao.classList.remove('mostrar'), 2600);
  }

  // `alvo` = Object3D (ou null para esconder), posicionado acima da cabeça.
  prompt(alvo, texto, camera) {
    if (!alvo) {
      this.elPrompt.classList.add('oculto');
      return;
    }
    this.v.copy(alvo.position);
    this.v.y += 4.1; // acima do marcador ! / ?
    this.v.project(camera);
    const x = (this.v.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-this.v.y * 0.5 + 0.5) * window.innerHeight;
    this.elPromptTexto.textContent = texto;
    this.elPrompt.style.left = `${x}px`;
    this.elPrompt.style.top = `${y}px`;
    this.elPrompt.classList.remove('oculto');
  }
}
