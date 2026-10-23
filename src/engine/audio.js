// Efeitos sonoros curtos. Os navegadores só liberam áudio depois de um clique (botão "Começar").
const URLS = import.meta.glob('../assets/sons/*.mp3', { query: '?url', import: 'default', eager: true });

const sons = {};
for (const [caminho, url] of Object.entries(URLS)) {
  sons[caminho.split('/').pop().replace('.mp3', '')] = url;
}

let ligado = true;

export function tocarSom(nome, volume = 0.5) {
  if (!ligado || !sons[nome]) return;
  const a = new Audio(sons[nome]);
  a.volume = volume;
  a.play().catch(() => {});
}

export function alternarSom() {
  ligado = !ligado;
  return ligado;
}
