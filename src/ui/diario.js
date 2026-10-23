import { ATRIBUTOS, ATRIBUTO_MAX, CLASSES, ITENS, NIVEIS } from '../conteudo/rpg.js';
import { REGIOES } from '../conteudo/unidade1.js';
import { MINIJOGOS } from '../conteudo/minijogos.js';
import { imgIcone } from './icones.js';
import { estrelasHtml } from '../minijogos/util.js';
import { tocarSom } from '../engine/audio.js';

const TIPO_NOME = {
  classificar: 'Classificar', memoria: 'Jogo da memória', forca: 'Forca', cacapalavras: 'Caça-palavras', ordenar: 'Ordenar', quiz: 'Quiz',
};

const $ = (id) => document.getElementById(id);
const escapar = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const negrito = (s) => escapar(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

const ABAS = [
  { id: 'missoes', nome: 'Missões', icone: 'missao' },
  { id: 'jogos', nome: 'Jogos', icone: 'trofeu' },
  { id: 'mochila', nome: 'Mochila', icone: 'mochila' },
  { id: 'ficha', nome: 'Ficha', icone: 'xp' },
  { id: 'respostas', nome: 'Respostas', icone: 'diario' },
  { id: 'mapa', nome: 'Mapa', icone: 'mapa' },
];

// Diário do Aventureiro: missões, mochila (inventário), ficha (atributos), respostas e mapa.
export class Diario {
  // `aoJogar(id)`: abre um minijogo já conhecido para jogar de novo (aba Jogos).
  constructor({ estado, missoes, retratoUrl, posJogador, npcs, aoJogar }) {
    this.estado = estado;
    this.missoes = missoes;
    this.retratoUrl = retratoUrl;
    this.posJogador = posJogador;
    this.npcs = npcs;
    this.aoJogar = aoJogar;
    this.el = $('diario');
    this.aba = 'missoes';
    this.aberto = false;

    $('diario-abas').innerHTML = ABAS.map((a) => `<button data-aba="${a.id}">${imgIcone(a.icone)}<span>${a.nome}</span></button>`).join('');
    $('diario-abas').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-aba]');
      if (b) this.abrir(b.dataset.aba);
    });
    $('diario-fechar').addEventListener('click', () => this.fechar());
    this.el.addEventListener('pointerdown', (e) => {
      if (e.target === this.el) this.fechar();
    });
  }

  alternar(aba) {
    if (this.aberto && (!aba || aba === this.aba)) this.fechar();
    else this.abrir(aba || this.aba);
  }

  abrir(aba = this.aba) {
    if (!this.aberto) tocarSom('papel', 0.35);
    this.aba = aba;
    this.aberto = true;
    this.el.classList.remove('oculto');
    $('diario-abas').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.aba === aba)));
    const c = $('diario-conteudo');
    c.innerHTML = this.#html(aba);
    c.scrollTop = 0;
    if (aba === 'mapa') this.#desenharMapa(c.querySelector('canvas'));
    c.querySelectorAll('[data-jogar]').forEach((b) => b.addEventListener('click', () => {
      this.fechar();
      this.aoJogar?.(b.dataset.jogar);
    }));
  }

  fechar() {
    this.aberto = false;
    this.el.classList.add('oculto');
    document.activeElement?.blur();
  }

  #html(aba) {
    const d = this.estado.d;
    if (aba === 'missoes') {
      const ativas = this.missoes.ativas();
      const concluidas = Object.keys(d.missoes).filter((id) => this.missoes.estadoDe(id) === 'concluida');
      if (!ativas.length && !concluidas.length) {
        return '<p class="vazio">Nenhuma missão ainda. Procure moradores com um <b class="marca-amarela">!</b> sobre a cabeça.</p>';
      }
      const bloco = (id) => {
        const def = this.missoes.defs[id];
        const est = this.missoes.estadoDe(id);
        const objs = def.objetivos
          .filter((o) => !o.final || est !== 'ativa')
          .map((o) => {
            const ok = this.missoes.feito(id, o.id);
            return `<li class="${ok ? 'ok' : ''}">${ok ? imgIcone('feito') : '<i></i>'}${escapar(o.texto)}</li>`;
          })
          .join('');
        const regiao = REGIOES.find((r) => r.id === def.regiao);
        return `<article class="missao ${est}">
          <h3>${imgIcone(est === 'concluida' ? 'trofeu' : 'missao')} ${escapar(def.titulo)}</h3>
          <p class="meta">${escapar(regiao.nome)} · Semana ${regiao.semana} do caderno</p>
          <p>${escapar(def.resumo)}</p>
          <ul class="objetivos">${objs}</ul>
        </article>`;
      };
      return `${ativas.length ? '<h3 class="secao">Em andamento</h3>' : ''}${ativas.map(bloco).join('')}
        ${concluidas.length ? '<h3 class="secao">Concluídas</h3>' : ''}${concluidas.map(bloco).join('')}`;
    }

    if (aba === 'jogos') {
      const cartoes = Object.entries(MINIJOGOS).map(([id, def]) => {
        const melhor = d.jogos[id] || 0;
        if (!melhor) {
          return `<div class="jogo-cartao bloqueado">${imgIcone('cadeado')}<b>???</b><small>Semana ${def.semana} · descubra numa missão</small></div>`;
        }
        return `<div class="jogo-cartao"><b>${escapar(def.titulo)}</b><small>Semana ${def.semana} · ${TIPO_NOME[def.tipo]}</small>
          <div>${estrelasHtml(melhor)}</div>
          <button class="btn-principal pequeno" data-jogar="${id}">Jogar de novo</button></div>`;
      }).join('');
      return `<p class="dica">Jogue de novo para tentar as 3 estrelas. Cada estrela nova vale +10 XP.</p><div class="jogos">${cartoes}</div>`;
    }

    if (aba === 'mochila') {
      return `<div class="itens">${d.itens
        .map((id) => ITENS[id])
        .filter(Boolean)
        .map((it) => `<div class="item">${imgIcone(it.icone, 'ico-grande')}<b>${escapar(it.nome)}</b><small>${escapar(it.texto)}</small></div>`)
        .join('')}</div>`;
    }

    if (aba === 'ficha') {
      const classe = CLASSES.find((c) => c.id === d.classe);
      const nivel = this.estado.nivel;
      const prox = NIVEIS[nivel];
      const barras = ATRIBUTOS.map((a) => {
        const v = d.atributos[a.id];
        return `<div class="atrib">${imgIcone(a.icone)}<span>${a.nome}</span>
          <div class="pontos">${Array.from({ length: ATRIBUTO_MAX }, (_, i) => `<i class="${i < v ? 'cheio' : ''}"></i>`).join('')}</div><b>${v}</b></div>`;
      }).join('');
      return `<div class="ficha">
        <img class="retrato" src="${this.retratoUrl}" alt="" />
        <div>
          <h3>${escapar(d.nome)}</h3>
          <p class="meta">Turma ${escapar(d.turma)} · ${escapar(classe.nome)}</p>
          <p class="nivel">${imgIcone('xp')} Nível ${nivel} · ${d.xp} XP${prox ? ` (próximo nível: ${prox} XP)` : ' (nível máximo)'}</p>
        </div>
      </div>
      <h3 class="secao">Atributos</h3>${barras}
      <p class="dica">Os atributos sobem quando você conclui missões ligadas a cada capacidade.</p>`;
    }

    if (aba === 'respostas') {
      const lista = Object.values(d.respostas).sort((a, b) => a.em - b.em);
      if (!lista.length) return '<p class="vazio">Suas respostas do "Depois da prática" vão aparecer aqui.</p>';
      return lista
        .map((r) => `<article class="resposta"><p class="pergunta">${negrito(r.pergunta)}</p><p>${escapar(r.texto)}</p>
          <small>${new Date(r.em).toLocaleDateString('pt-BR')}</small></article>`)
        .join('');
    }

    if (aba === 'mapa') {
      return `<canvas width="520" height="520"></canvas>
        <p class="legenda"><span class="ponto voce"></span> Você <span class="ponto npc"></span> Morador
        <span class="ponto nevoa"></span> Coberta pela névoa</p>`;
    }
    return '';
  }

  #desenharMapa(canvas) {
    const ctx = canvas.getContext('2d');
    const T = canvas.width;
    const L = 60; // metade do lado do mundo mostrado
    const px = (v) => ((v + L) / (2 * L)) * T;
    ctx.fillStyle = '#9fcb6f';
    ctx.fillRect(0, 0, T, T);

    // Quarteirões de prédios (anel 3), ruas (anel 2 + estradas) e clareiras das regiões.
    ctx.fillStyle = '#c9c2d6';
    ctx.fillRect(px(-35), px(-35), px(35) - px(-35), px(35) - px(-35));
    ctx.fillStyle = '#6d6a75';
    ctx.fillRect(px(-25), px(-25), px(25) - px(-25), px(25) - px(-25));
    ctx.fillRect(px(-5), px(-55), px(5) - px(-5), px(55) - px(-55));
    ctx.fillRect(px(-55), px(-5), px(55) - px(-55), px(5) - px(-5));
    ctx.fillStyle = '#efe5cf';
    ctx.fillRect(px(-15), px(-15), px(15) - px(-15), px(15) - px(-15));
    const raio = px(9.5) - px(0);
    for (const [x, z] of [[0, -50], [0, 50], [-50, 0], [50, 0]]) {
      ctx.fillStyle = '#e6d9b8';
      ctx.beginPath();
      ctx.arc(px(x), px(z), raio, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 15px "Trebuchet MS", sans-serif';
    ctx.fillStyle = '#2a1259';
    ctx.fillText('Praça do Bairro', px(0), px(-10));

    // Rótulos: norte/sul ao lado da clareira; leste/oeste acima da estrada, para caber no mapa.
    const posRegiao = { norte: [-27, -48], sul: [-27, 48], oeste: [-44, -16], leste: [44, -16] };
    for (const r of REGIOES) {
      if (!r.porta) continue;
      const [x, z] = posRegiao[r.porta];
      const livre = this.estado.regiaoLiberada(r.id);
      ctx.fillStyle = livre ? 'rgba(255,255,255,.92)' : 'rgba(185,162,230,.95)';
      ctx.beginPath();
      ctx.roundRect(px(x) - 64, px(z) - 22, 128, 44, 12);
      ctx.fill();
      ctx.fillStyle = '#2a1259';
      ctx.font = '800 12px "Trebuchet MS", sans-serif';
      const nomes = r.nome.split(' ');
      const meio = Math.ceil(nomes.length / 2);
      ctx.fillText(nomes.slice(0, meio).join(' '), px(x), px(z) - 7);
      ctx.fillText(`${nomes.slice(meio).join(' ')}${livre ? '' : ' (névoa)'}`, px(x), px(z) + 9);
    }

    for (const n of this.npcs) {
      const marca = this.missoes.marcadorDe(n.def.id);
      ctx.fillStyle = marca === '!' ? '#ffc933' : marca === '?' ? '#2f7ee8' : '#f58220';
      ctx.beginPath();
      ctx.arc(px(n.posicao.x), px(n.posicao.z), marca ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();
      if (marca) {
        ctx.fillStyle = marca === '!' ? '#2a1259' : '#fff';
        ctx.font = '900 11px sans-serif';
        ctx.fillText(marca, px(n.posicao.x), px(n.posicao.z) + 1);
      }
    }
    const p = this.posJogador();
    ctx.fillStyle = '#6a2fb0';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(px(p.x), px(p.z), 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}
