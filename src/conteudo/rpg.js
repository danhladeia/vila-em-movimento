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
// `visuais`: aparências que o aluno pode escolher. A cabeça (rosto e cabelo) pode vir de outro modelo:
// 'Rogue' e 'Mage' têm cabelo comprido; 'Ranger', cabelo curto. Ver Biblioteca.personagem.
export const CLASSES = [
  {
    id: 'forca', nome: 'Guardiã(o) da Força', atributo: 'forca', item: 'faixa',
    texto: 'Gosta de desafios de força, com pesos ou com o próprio corpo.',
    visuais: [
      { corpo: 'Barbarian', cabeca: 'Rogue', semChapeu: true },
      { corpo: 'Barbarian' },
      { corpo: 'Barbarian', cabeca: 'Mage', semChapeu: true },
    ],
  },
  {
    id: 'resistencia', nome: 'Andarilha(o) da Resistência', atributo: 'resistencia', item: 'tenis',
    texto: 'Caminha e corre longas distâncias sem perder o ritmo.',
    visuais: [
      { corpo: 'Ranger' },
      { corpo: 'Ranger', cabeca: 'Rogue' },
      { corpo: 'Ranger', cabeca: 'Mage' },
    ],
  },
  {
    id: 'agilidade', nome: 'Ágil das Trilhas', atributo: 'agilidade', item: 'cronometro',
    texto: 'Rápida(o) nas mudanças de direção e atenta(o) ao tempo.',
    visuais: [
      { corpo: 'Rogue' },
      { corpo: 'Rogue', cabeca: 'Ranger' },
      { corpo: 'Rogue_Hooded' },
    ],
  },
  {
    id: 'flexibilidade', nome: 'Sábia(o) do Alongamento', atributo: 'flexibilidade', item: 'colchonete',
    texto: 'Cuida do corpo com alongamento e respiração.',
    visuais: [
      { corpo: 'Mage' },
      { corpo: 'Mage', cabeca: 'Rogue', semChapeu: true },
      { corpo: 'Mage', cabeca: 'Ranger' },
    ],
  },
  {
    id: 'cooperacao', nome: 'Capitã(o) da Equipe', atributo: 'cooperacao', item: 'prancheta',
    texto: 'Organiza o grupo e garante que todos participem.',
    visuais: [
      { corpo: 'Knight', cabeca: 'Rogue', semChapeu: true },
      { corpo: 'Knight', cabeca: 'Ranger', semChapeu: true },
      { corpo: 'Knight' },
    ],
  },
];

// Aparência salva do aluno (saves antigos não têm `visual`: usa a primeira).
export function visualDe(d) {
  const classe = CLASSES.find((c) => c.id === d.classe);
  return classe.visuais[d.visual ?? 0] ?? classe.visuais[0];
}

// Tons para a roupa do personagem (multiplicam a textura original; null = cor original).
export const TONS = [null, '#8ec5ff', '#ff9ccb', '#a6e88c', '#ffd75e'];

// Tons de pele (null = tom original dos modelos).
export const PELES = [null, '#f6cfae', '#d9a07a', '#b57650', '#93603f', '#74492e'];

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
  medalha_trilha: { nome: 'Medalha da Trilha', icone: 'medalha', texto: 'Por aprender a escutar os sinais do corpo.' },
  cartoes_ginastica: { nome: 'Cartões das Ginásticas', icone: 'diario', texto: 'Musculação, jump, hidroginástica, caminhada e corrida: objetivo, lugar e equipamentos.' },
  apito_dourado: { nome: 'Apito Dourado', icone: 'prancheta', texto: 'Para organizar aulas com início, meio e fim.' },
  medalha_amizade: { nome: 'Medalha da Amizade', icone: 'medalha', texto: 'Por trazer o Festival da Comunidade de volta.' },
  certificado: { nome: 'Certificado Mestre da Vila Ativa', icone: 'trofeu', texto: 'Por vencer o Guardião da Névoa e concluir a Unidade 1.' },
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
