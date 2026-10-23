// Regras das missões: estados, objetivos, recompensas, qual fala cada NPC usa e o marcador sobre a cabeça.
// As definições ficam em src/conteudo/unidade1.js (MISSOES).
export class Missoes {
  constructor(estado, defs) {
    this.estado = estado;
    this.defs = defs;
  }

  #salvo(id) {
    return this.estado.d.missoes[id];
  }

  // A missão só aparece depois dos seus pré-requisitos: { missao: 'id' } concluída e/ou { regiao: 'id' } liberada.
  #disponivel(id) {
    const r = this.defs[id].requer || {};
    if (r.missao && this.estadoDe(r.missao) !== 'concluida') return false;
    if (r.regiao && !this.estado.regiaoLiberada(r.regiao)) return false;
    return true;
  }

  // 'bloqueada' | 'nova' | 'ativa' | 'pronta' (só falta entregar) | 'concluida'
  estadoDe(id) {
    const m = this.#salvo(id);
    if (!m) return this.#disponivel(id) ? 'nova' : 'bloqueada';
    if (m.estado === 'concluida') return 'concluida';
    const faltam = this.defs[id].objetivos.filter((o) => !o.final && !m.feitos.includes(o.id));
    return faltam.length ? 'ativa' : 'pronta';
  }

  feito(id, objetivoId) {
    const m = this.#salvo(id);
    return Boolean(m && (m.estado === 'concluida' || m.feitos.includes(objetivoId)));
  }

  // Missões em andamento, na ordem em que foram aceitas.
  ativas() {
    return Object.keys(this.estado.d.missoes).filter((id) => ['ativa', 'pronta'].includes(this.estadoDe(id)));
  }

  iniciar(id) {
    if (this.estadoDe(id) !== 'nova') return;
    const def = this.defs[id];
    this.estado.d.missoes[id] = { estado: 'ativa', feitos: [] };
    this.estado.emitir('missao_iniciada', { id, def });
    (def.aoIniciar?.itens || []).forEach((it) => this.estado.darItem(it));
    // O que o aluno já fez antes de aceitar a missão também vale.
    for (const o of def.objetivos) {
      if (o.evento && this.estado.aconteceu(o.evento)) this.#cumprir(id, o);
    }
    this.estado.salvarLogo();
  }

  #cumprir(id, objetivo) {
    const m = this.#salvo(id);
    if (m.feitos.includes(objetivo.id)) return;
    m.feitos.push(objetivo.id);
    const def = this.defs[id];
    this.estado.emitir('objetivo', { id, objetivo });
    this.estado.ganharXp(def.xpObjetivo || 0);
    if (this.estadoDe(id) === 'pronta') this.estado.emitir('missao_pronta', { id, def });
  }

  evento(ev) {
    this.estado.registrarEvento(ev);
    for (const id of this.ativas()) {
      for (const o of this.defs[id].objetivos) {
        if (o.evento === ev) this.#cumprir(id, o);
      }
    }
  }

  concluir(id) {
    if (this.estadoDe(id) !== 'pronta') return;
    const def = this.defs[id];
    const m = this.#salvo(id);
    m.estado = 'concluida';
    m.feitos = def.objetivos.map((o) => o.id);
    this.estado.emitir('missao_concluida', { id, def });
    const r = def.recompensa || {};
    this.estado.ganharXp(r.xp || 0);
    (r.itens || []).forEach((it) => this.estado.darItem(it));
    Object.entries(r.atributos || {}).forEach(([at, q]) => this.estado.somarAtributo(at, q));
    (r.regioes || []).forEach((rg) => this.estado.liberarRegiao(rg));
    this.estado.salvar();
  }

  // Ações vindas das falas: 'iniciar:<missao>', 'concluir:<missao>' ou um nome livre (vira 'acao:<nome>').
  acao(texto) {
    const [tipo, arg] = texto.split(':');
    if (tipo === 'iniciar') this.iniciar(arg);
    else if (tipo === 'concluir') this.concluir(arg);
    else this.evento(`acao:${texto}`);
  }

  condicao(se) {
    if (!se) return true;
    if (se.missao) return this.estadoDe(se.missao) === se.estado;
    if (se.marca) return this.estado.aconteceu(`acao:${se.marca}`);
    return false;
  }

  dialogoDe(npcDef) {
    return npcDef.dialogos.find((d) => this.condicao(d.se))?.dialogo;
  }

  // '!' = tem missão nova para dar; '?' = é o próximo passo de uma missão em andamento.
  marcadorDe(npcId) {
    for (const [id, def] of Object.entries(this.defs)) {
      const est = this.estadoDe(id);
      if (est === 'nova' && def.doador === npcId) return '!';
      if (est === 'ativa' || est === 'pronta') {
        const pendente = def.objetivos.some((o) => o.npc === npcId && !this.feito(id, o.id) && (!o.final || est === 'pronta'));
        if (pendente) return '?';
      }
    }
    return null;
  }
}
