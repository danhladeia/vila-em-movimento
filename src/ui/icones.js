// Ícones do Free Icon Pack (copiados por scripts/copiar_assets.mjs).
const URLS = import.meta.glob('../assets/icones/*.png', { query: '?url', import: 'default', eager: true });

const icones = {};
for (const [caminho, url] of Object.entries(URLS)) icones[caminho.split('/').pop().replace('.png', '')] = url;

export const icone = (nome) => icones[nome] || '';

export const imgIcone = (nome, classe = 'ico') => `<img class="${classe}" src="${icone(nome)}" alt="" />`;

// Preenche os <img data-icone="..."> já escritos no HTML.
export function preencherIcones(raiz = document) {
  raiz.querySelectorAll('img[data-icone]').forEach((img) => {
    img.src = icone(img.dataset.icone);
  });
}
