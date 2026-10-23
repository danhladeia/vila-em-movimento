import { ATRIBUTOS, ATRIBUTO_MAX, CLASSES, nivelPorXp } from '../conteudo/rpg.js';

// Estado do aluno (tudo o que é salvo) e o save no navegador.
// O save fica só neste computador/navegador; sem login, a chave é nome + turma.

const CHAVE = 'vilaEmMovimento.saves.v1';
const VERSAO = 1;

const normalizar = (s) => s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');

function lerTodos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || {};
  } catch {
    return {}; // navegação privada, armazenamento bloqueado ou dado corrompido
  }
}

function gravarTodos(saves) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(saves));
    return true;
  } catch {
    return false;
  }
}

export function listarSaves() {
  return Object.values(lerTodos())
    .filter((s) => s?.versao === VERSAO)
    .sort((a, b) => (b.salvoEm || 0) - (a.salvoEm || 0));
}

export function apagarSave(id) {
  const saves = lerTodos();
  delete saves[id];
  gravarTodos(saves);
}

export class Estado {
  constructor(dados) {
    this.d = dados;
    this.ouvintes = new Map();
    this.timerSalvar = null;
  }

  // `visual` = índice em CLASSES[].visuais; `tom` = cor da roupa; `pele` = cor da pele.
  static novo(nome, turma, classeId, { visual = 0, tom = null, pele = null } = {}) {
    const classe = CLASSES.find((c) => c.id === classeId);
    const atributos = Object.fromEntries(ATRIBUTOS.map((a) => [a.id, 1]));
    atributos[classe.atributo] += 1;
    return new Estado({
      versao: VERSAO,
      id: `${normalizar(nome)}|${normalizar(turma)}`,
      nome: nome.trim(),
      turma: turma.trim(),
      classe: classeId,
      visual,
      tom,
      pele,
      xp: 0,
      atributos,
      itens: [classe.item],
      missoes: {},         // id -> { estado: 'ativa' | 'concluida', feitos: [ids de objetivos] }
      eventos: [],         // eventos já acontecidos ('falou:beto', 'acao:...')
      regioes: ['praca'],  // regiões sem névoa
      respostas: {},       // id -> { pergunta, texto, em }
      jogos: {},           // id do minijogo -> melhor número de estrelas (1 a 3)
      pos: null,
      criadoEm: Date.now(),
      salvoEm: Date.now(),
    });
  }

  static carregar(id) {
    const d = lerTodos()[id];
    if (d?.versao !== VERSAO) return null;
    d.jogos ??= {}; // saves de antes dos minijogos
    return new Estado(d);
  }

  static existe(nome, turma) {
    return Boolean(lerTodos()[`${normalizar(nome)}|${normalizar(turma)}`]);
  }

  // ---------- eventos para HUD e sons ----------
  on(tipo, f) {
    if (!this.ouvintes.has(tipo)) this.ouvintes.set(tipo, []);
    this.ouvintes.get(tipo).push(f);
  }

  emitir(tipo, dados) {
    (this.ouvintes.get(tipo) || []).forEach((f) => f(dados));
    (this.ouvintes.get('*') || []).forEach((f) => f(tipo, dados));
  }

  // ---------- save ----------
  salvar() {
    this.d.salvoEm = Date.now();
    const saves = lerTodos();
    saves[this.d.id] = this.d;
    return gravarTodos(saves);
  }

  // Junta várias mudanças seguidas num só save.
  salvarLogo() {
    clearTimeout(this.timerSalvar);
    this.timerSalvar = setTimeout(() => this.salvar(), 300);
  }

  // ---------- RPG ----------
  get nivel() {
    return nivelPorXp(this.d.xp);
  }

  ganharXp(qtd) {
    if (!qtd) return;
    const antes = this.nivel;
    this.d.xp += qtd;
    this.emitir('xp', { qtd, total: this.d.xp });
    if (this.nivel > antes) this.emitir('nivel', { nivel: this.nivel });
    this.salvarLogo();
  }

  temItem(id) {
    return this.d.itens.includes(id);
  }

  darItem(id) {
    if (this.temItem(id)) return;
    this.d.itens.push(id);
    this.emitir('item', { id });
    this.salvarLogo();
  }

  somarAtributo(id, qtd) {
    const antes = this.d.atributos[id];
    this.d.atributos[id] = Math.min(ATRIBUTO_MAX, antes + qtd);
    if (this.d.atributos[id] !== antes) this.emitir('atributo', { id, qtd: this.d.atributos[id] - antes });
    this.salvarLogo();
  }

  aconteceu(evento) {
    return this.d.eventos.includes(evento);
  }

  registrarEvento(evento) {
    if (!this.aconteceu(evento)) this.d.eventos.push(evento);
    this.salvarLogo();
  }

  regiaoLiberada(id) {
    return this.d.regioes.includes(id);
  }

  liberarRegiao(id) {
    if (this.regiaoLiberada(id)) return;
    this.d.regioes.push(id);
    this.emitir('regiao', { id });
    this.salvarLogo();
  }

  // Guarda o melhor resultado de um minijogo. XP só pela melhora (10 por estrela nova),
  // para que jogar de novo valha a pena sem virar "fábrica de XP".
  registrarJogo(id, estrelas) {
    const antes = this.d.jogos[id] || 0;
    if (estrelas > antes) {
      this.d.jogos[id] = estrelas;
      this.emitir('jogo', { id, estrelas, recorde: antes > 0 });
      this.ganharXp((estrelas - antes) * 10);
    }
    this.salvarLogo();
  }

  responder(id, pergunta, texto) {
    this.d.respostas[id] = { pergunta, texto: texto.trim(), em: Date.now() };
    this.emitir('resposta', { id });
    this.salvarLogo();
  }
}
