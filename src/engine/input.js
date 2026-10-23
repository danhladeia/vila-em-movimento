// Teclado e clique. Guarda o estado das teclas e entrega "toques" (apertou agora) uma vez por quadro.
export class Entrada {
  constructor(dom) {
    this.teclas = new Set();
    this.toques = new Set();
    this.cliques = [];
    this.bloqueado = false; // true durante diálogos: o movimento para, mas os toques continuam

    window.addEventListener('keydown', (e) => {
      // Digitando um nome ou uma resposta: as teclas são do campo, não do jogo.
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      // Só segura rolagem/troca de foco quando o foco é do jogo (não de um botão dos menus).
      const noJogo = e.target === document.body || e.target === dom;
      if (noJogo && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Tab'].includes(e.key)) e.preventDefault();
      const k = e.code;
      if (!this.teclas.has(k)) this.toques.add(k);
      this.teclas.add(k);
    });
    window.addEventListener('keyup', (e) => this.teclas.delete(e.code));
    window.addEventListener('blur', () => this.teclas.clear());

    dom.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      this.cliques.push({ x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 });
    });
  }

  apertada(...codigos) {
    return codigos.some((c) => this.teclas.has(c));
  }

  tocou(...codigos) {
    return codigos.some((c) => this.toques.has(c));
  }

  // Direção pedida pelo teclado no plano (x = direita, y = para cima na tela).
  direcao() {
    if (this.bloqueado) return { x: 0, y: 0 };
    const x = (this.apertada('KeyD', 'ArrowRight') ? 1 : 0) - (this.apertada('KeyA', 'ArrowLeft') ? 1 : 0);
    const y = (this.apertada('KeyW', 'ArrowUp') ? 1 : 0) - (this.apertada('KeyS', 'ArrowDown') ? 1 : 0);
    return { x, y };
  }

  fimDoQuadro() {
    this.toques.clear();
    this.cliques.length = 0;
  }
}
