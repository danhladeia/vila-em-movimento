import { MINIJOGOS } from '../conteudo/minijogos.js';
import { tocarSom } from '../engine/audio.js';
import { estrelasHtml, escapar } from './util.js';
import * as classificar from './classificar.js';
import * as memoria from './memoria.js';
import * as forca from './forca.js';
import * as cacapalavras from './cacapalavras.js';
import * as ordenar from './ordenar.js';
import * as quiz from './quiz.js';

const TIPOS = { classificar, memoria, forca, cacapalavras, ordenar, quiz };
const $ = (id) => document.getElementById(id);

const MENSAGENS = ['', 'Bom começo! Que tal tentar de novo depois?', 'Muito bem!', 'Perfeito! Você arrasou!'];

// Painel em tela cheia onde os minijogos acontecem.
// abrir(id) resolve com { estrelas, texto } ou null se o aluno sair antes do fim.
export class PainelJogos {
  constructor() {
    this.el = $('minijogo');
    this.aberto = false;
    this.atual = null;
    $('mj-sair').addEventListener('click', () => this.#terminar(null));
    window.addEventListener('keydown', (e) => {
      if (!this.aberto || e.target instanceof HTMLInputElement) return;
      if (e.key === 'Escape') {
        this.#terminar(null);
        return;
      }
      if (this.resultado && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        this.#terminar(this.resultado);
        return;
      }
      if ([' ', 'Enter'].includes(e.key)) e.preventDefault();
      this.atual?.tecla?.(e);
    });
  }

  abrir(id) {
    const def = MINIJOGOS[id];
    if (!def) return Promise.resolve(null);
    this.aberto = true;
    this.resultado = null;
    this.el.classList.remove('oculto');
    $('mj-titulo').textContent = def.titulo;
    $('mj-instrucao').textContent = def.instrucao;
    $('mj-placar').textContent = '';
    const corpo = $('mj-corpo');
    corpo.innerHTML = '';
    tocarSom('carta', 0.4);
    document.activeElement?.blur();

    return new Promise((resolver) => {
      this.resolver = resolver;
      this.atual = TIPOS[def.tipo].iniciar(def, {
        corpo,
        placar: (t) => { $('mj-placar').textContent = t; },
        som: (nome) => tocarSom(nome, 0.4),
        fim: (res) => this.#mostrarResultado(res),
      });
    });
  }

  #mostrarResultado(res) {
    this.resultado = res;
    tocarSom('dado', 0.6);
    $('mj-placar').textContent = '';
    $('mj-corpo').innerHTML = `
      <div class="mj-resultado">
        <div class="estrelas">${estrelasHtml(res.estrelas)}</div>
        <h3>${MENSAGENS[res.estrelas]}</h3>
        <p>${escapar(res.texto)}</p>
        <button class="btn-principal" data-continuar>Continuar</button>
      </div>`;
    $('mj-corpo').querySelector('[data-continuar]').addEventListener('click', () => this.#terminar(res));
  }

  #terminar(res) {
    if (!this.aberto) return;
    this.aberto = false;
    this.atual?.destruir?.();
    this.atual = null;
    this.el.classList.add('oculto');
    $('mj-corpo').innerHTML = '';
    this.resolver?.(res);
  }
}
