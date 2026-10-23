// Teclado, clique e arrasto. Guarda o estado das teclas e entrega "toques" (apertou agora),
// cliques e o arrasto do mouse uma vez por quadro.
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

    // Mouse: arrastar gira a câmera (3ª pessoa); soltar sem arrastar é um clique (ir até / conversar).
    this.arrasto = { dx: 0, dy: 0 };
    let inicio = null;
    let arrastou = false;
    dom.addEventListener('contextmenu', (e) => e.preventDefault());
    dom.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.button !== 2) return;
      inicio = { x: e.clientX, y: e.clientY, botao: e.button };
      arrastou = false;
      dom.setPointerCapture(e.pointerId);
    });
    dom.addEventListener('pointermove', (e) => {
      if (!inicio) return;
      if (!arrastou && Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) > 6) arrastou = true;
      if (arrastou) {
        this.arrasto.dx += e.movementX;
        this.arrasto.dy += e.movementY;
      }
    });
    dom.addEventListener('pointerup', (e) => {
      if (inicio && !arrastou && inicio.botao === 0) {
        this.cliques.push({ x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 });
      }
      inicio = null;
    });
    dom.addEventListener('pointercancel', () => { inicio = null; });
  }

  apertada(...codigos) {
    return codigos.some((c) => this.teclas.has(c));
  }

  tocou(...codigos) {
    return codigos.some((c) => this.toques.has(c));
  }

  // Direção pedida pelo teclado no plano (x = direita, y = para a frente).
  // Com `setasGiram` (3ª pessoa), ← e → giram a câmera em vez de andar de lado.
  direcao(setasGiram = false) {
    if (this.bloqueado) return { x: 0, y: 0 };
    const dir = setasGiram ? ['KeyD'] : ['KeyD', 'ArrowRight'];
    const esq = setasGiram ? ['KeyA'] : ['KeyA', 'ArrowLeft'];
    const x = (this.apertada(...dir) ? 1 : 0) - (this.apertada(...esq) ? 1 : 0);
    const y = (this.apertada('KeyW', 'ArrowUp') ? 1 : 0) - (this.apertada('KeyS', 'ArrowDown') ? 1 : 0);
    return { x, y };
  }

  fimDoQuadro() {
    this.toques.clear();
    this.cliques.length = 0;
    this.arrasto.dx = 0;
    this.arrasto.dy = 0;
  }
}
