// Utilidades comuns dos minijogos.

export function embaralhar(lista) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const escapar = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function estrelasHtml(n, total = 3) {
  return Array.from({ length: total }, (_, i) => `<span class="estrela ${i < n ? 'cheia' : ''}">★</span>`).join('');
}

// Cria um elemento a partir de HTML.
export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// Faz um elemento "tremer" (resposta errada).
export function tremer(elemento) {
  elemento.classList.remove('tremendo');
  void elemento.offsetWidth;
  elemento.classList.add('tremendo');
}
