// Regras de RPG: classes, atributos, itens e níveis. (O conteúdo pedagógico fica em unidade1.js.)

export const ATRIBUTOS = [
  { id: 'forca', nome: 'Força', icone: 'forca' },
  { id: 'resistencia', nome: 'Resistência', icone: 'resistencia' },
  { id: 'flexibilidade', nome: 'Flexibilidade', icone: 'flexibilidade' },
  { id: 'agilidade', nome: 'Agilidade', icone: 'agilidade' },
  { id: 'cooperacao', nome: 'Cooperação', icone: 'cooperacao' },
];
export const ATRIBUTO_MAX = 10;

// A classe só dá +1 num atributo e um item inicial: o conteúdo do jogo é igual para todos.
export const CLASSES = [
  {
    id: 'forca', modelo: 'Barbarian', nome: 'Guardião da Força', atributo: 'forca', item: 'faixa',
    texto: 'Gosta de desafios de força, com pesos ou com o próprio corpo.',
  },
  {
    id: 'resistencia', modelo: 'Ranger', nome: 'Andarilho da Resistência', atributo: 'resistencia', item: 'tenis',
    texto: 'Caminha e corre longas distâncias sem perder o ritmo.',
  },
  {
    id: 'agilidade', modelo: 'Rogue', nome: 'Ágil das Trilhas', atributo: 'agilidade', item: 'cronometro',
    texto: 'Rápido nas mudanças de direção e atento ao tempo.',
  },
  {
    id: 'flexibilidade', modelo: 'Mage', nome: 'Sábio do Alongamento', atributo: 'flexibilidade', item: 'colchonete',
    texto: 'Cuida do corpo com alongamento e respiração.',
  },
  {
    id: 'cooperacao', modelo: 'Knight', nome: 'Capitão da Equipe', atributo: 'cooperacao', item: 'prancheta',
    texto: 'Organiza o grupo e garante que todos participem.',
  },
];

// Tons para a roupa do personagem (multiplicam a textura original; null = cor original).
export const TONS = [null, '#8ec5ff', '#ff9ccb', '#a6e88c', '#ffd75e'];

export const ITENS = {
  diario: { nome: 'Diário do Aventureiro', icone: 'diario', texto: 'Guarda suas missões, respostas e descobertas. Abra com a tecla Tab.' },
  faixa: { nome: 'Faixa de treino', icone: 'faixa', texto: 'Lembra que força se treina aos poucos, com boa técnica.' },
  tenis: { nome: 'Tênis de corrida', icone: 'tenis', texto: 'Calçado confortável para caminhar e correr.' },
  cronometro: { nome: 'Cronômetro', icone: 'cronometro', texto: 'Mede o tempo de cada parte do exercício.' },
  colchonete: { nome: 'Colchonete', icone: 'colchonete', texto: 'Para alongar e fazer a volta à calma com conforto.' },
  prancheta: { nome: 'Prancheta do Capitão', icone: 'prancheta', texto: 'Para anotar o plano do grupo e quem faz o quê.' },
  mapa: { nome: 'Mapa do Bairro', icone: 'mapa', texto: 'Lugares do bairro onde dá para se movimentar.' },
  garrafinha: { nome: 'Garrafinha', icone: 'garrafinha', texto: 'Hidratar-se ajuda o corpo a se recuperar.' },
  medalha_praca: { nome: 'Medalha da Praça', icone: 'medalha', texto: 'Por ajudar a Praça do Bairro.' },
};

// XP total necessário para cada nível (índice 0 = nível 1).
export const NIVEIS = [0, 150, 350, 600, 900];

export function nivelPorXp(xp) {
  let n = 1;
  NIVEIS.forEach((min, i) => {
    if (xp >= min) n = i + 1;
  });
  return n;
}
