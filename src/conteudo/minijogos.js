// Minijogos da Unidade 1 (Caderno DED Express EF7). Cada um é aberto por uma fala com `jogo: '<id>'`.
// Tipos: classificar, memoria, forca, cacapalavras, ordenar, quiz (ver src/minijogos/).
// Palavras da forca e do caça-palavras vão SEM acento (o jogo compara letra por letra).

export const MINIJOGOS = {
  // ---------------- Semana 1: Movimento para a vida ----------------
  classificar_movimento: {
    tipo: 'classificar', semana: 1,
    titulo: 'Atividade ou exercício?',
    instrucao: 'Leia o que cada morador está fazendo e classifique.',
    grupos: ['Atividade física', 'Exercício físico'],
    itens: [
      { texto: 'Dona Rosa varre a calçada todas as manhãs.', grupo: 0, explica: 'Gasta energia, mas não é planejado para treinar: é atividade física.' },
      { texto: 'Pedro passeia com o cachorro depois do almoço.', grupo: 0, explica: 'Movimento do dia a dia: atividade física.' },
      { texto: 'Lia vai de bicicleta para a escola.', grupo: 0, explica: 'É deslocamento ativo: atividade física (e conta muito para a saúde!).' },
      { texto: 'Caio treina corrida 3 vezes por semana com uma planilha.', grupo: 1, explica: 'Planejado, com objetivo e regularidade: exercício físico.' },
      { texto: 'A turma da praça faz ginástica toda terça e quinta, às 7h.', grupo: 1, explica: 'Aula planejada e regular: exercício físico.' },
      { texto: 'Seu Tião lava o carro no sábado.', grupo: 0, explica: 'Tarefa doméstica: atividade física.' },
      { texto: 'Bia faz 20 minutos de alongamento orientado antes de dormir, todos os dias, para melhorar a flexibilidade.', grupo: 1, explica: 'Tem objetivo (flexibilidade) e regularidade: exercício físico.' },
    ],
  },
  caca_lugares: {
    tipo: 'cacapalavras', semana: 1,
    titulo: 'Lugares para se movimentar',
    instrucao: 'Encontre no quadro os lugares do bairro onde dá para se movimentar.',
    tamanho: 10,
    palavras: ['PRACA', 'QUADRA', 'CICLOVIA', 'PARQUE', 'CALCADA', 'ESCOLA'],
  },

  // ---------------- Semana 2: Capacidades físicas e sensações ----------------
  memoria_sensacoes: {
    tipo: 'memoria', semana: 2,
    titulo: 'Memória do corpo',
    instrucao: 'Vire duas cartas por vez e junte cada capacidade ou sinal do corpo com a sua sensação.',
    pares: [
      ['Resistência', 'Cansa aos poucos, em ritmo contínuo'],
      ['Força', 'Esforço intenso nos músculos'],
      ['Flexibilidade', 'Leve tensão ao alongar'],
      ['Velocidade', 'Coração dispara em pouco tempo'],
      ['Suor', 'Ajuda a resfriar o corpo'],
      ['Respiração', 'Acelera quando o esforço aumenta'],
    ],
  },
  quiz_sinais: {
    tipo: 'quiz', semana: 2,
    titulo: 'Sinais do corpo: o que fazer?',
    instrucao: 'Escolha a atitude certa em cada situação.',
    perguntas: [
      { texto: 'Durante a corrida, sua respiração acelerou e você suou. Isso é…', opcoes: ['Normal no exercício', 'Sinal para parar na hora'], certa: 0, explica: 'Respiração acelerada e suor são sinais normais do esforço.' },
      { texto: 'Um colega sentiu tontura e dor forte no peito. O que fazer?', opcoes: ['Continuar para não perder', 'Parar e avisar o professor', 'Beber água e correr mais rápido'], certa: 1, explica: 'Dor forte, tontura ou falta de ar não são normais: pare e avise o professor.' },
      { texto: 'Antes do exercício, o melhor é…', opcoes: ['Observar a respiração em repouso e aquecer', 'Começar no esforço máximo'], certa: 0, explica: 'Antes: observe o corpo e aqueça. Durante: perceba o esforço. Depois: respire fundo e alongue.' },
      { texto: 'No semáforo do esforço, o vermelho significa…', opcoes: ['Esforço leve', 'Esforço médio', 'Esforço forte'], certa: 2, explica: 'Verde = leve, amarelo = médio, vermelho = forte.' },
    ],
  },

  // ---------------- Semana 3: Tipos de ginástica de condicionamento ----------------
  forca_ginasticas: {
    tipo: 'forca', semana: 3,
    titulo: 'Adivinhe a ginástica',
    instrucao: 'Descubra a palavra antes que a Névoa da Preguiça cubra o sol. Use a dica!',
    palavras: [
      { palavra: 'HIDROGINASTICA', dica: 'Na água, com baixo impacto nas articulações.' },
      { palavra: 'MUSCULACAO', dica: 'Desenvolve a força com pesos ou com o próprio corpo.' },
      { palavra: 'JUMP', dica: 'Resistência com música, sobre minicamas elásticas.' },
      { palavra: 'CAMINHADA', dica: 'Resistência em ritmo contínuo, para todas as idades.' },
    ],
  },
  quiz_ginastica_ideal: {
    tipo: 'quiz', semana: 3,
    titulo: 'Quem precisa de quê?',
    instrucao: 'Indique a ginástica mais adequada para cada pessoa: objetivo, espaço e materiais.',
    perguntas: [
      { texto: 'Vó Cida tem dor nos joelhos e o clube tem piscina.', opcoes: ['Jump', 'Hidroginástica', 'Corrida'], certa: 1, explica: 'Na água o impacto nas articulações é baixo.' },
      { texto: 'Rafa quer ficar mais forte e só tem o próprio corpo.', opcoes: ['Musculação com o peso do corpo', 'Hidroginástica', 'Caminhada'], certa: 0, explica: 'Agachamentos e flexões usam o peso do corpo para treinar força.' },
      { texto: 'Seu Jorge quer melhorar o fôlego e mora perto do parque.', opcoes: ['Musculação com cargas altas', 'Caminhada e corrida'], certa: 1, explica: 'Caminhada e corrida trabalham a resistência cardiorrespiratória.' },
      { texto: 'Bia adora música e quer treinar resistência.', opcoes: ['Jump', 'Musculação'], certa: 0, explica: 'O jump é resistência com música na minicama elástica.' },
      { texto: 'Um adolescente quer começar musculação. O mais seguro é…', opcoes: ['Pegar o máximo de peso logo', 'Cargas leves, boa técnica e orientação profissional'], certa: 1, explica: 'Comece devagar e aumente o esforço aos poucos, com orientação.' },
    ],
  },

  // ---------------- Semana 4: Organizar a aula de ginástica ----------------
  ordenar_aula: {
    tipo: 'ordenar', semana: 4,
    titulo: 'Início, meio e fim',
    instrucao: 'Clique nas partes da aula de ginástica na ordem certa.',
    itens: [
      { texto: 'Aquecimento', detalhe: 'Prepara músculos e articulações.' },
      { texto: 'Parte principal', detalhe: 'Exercícios com o objetivo do dia.' },
      { texto: 'Volta à calma', detalhe: 'Alongamentos e respiração para o corpo se recuperar.' },
    ],
  },
  quiz_planejar_aula: {
    tipo: 'quiz', semana: 4,
    titulo: 'Nossa aula de 30 minutos',
    instrucao: 'Ajude a turma a planejar o tempo, o espaço e as tarefas.',
    perguntas: [
      { texto: 'Qual divisão de tempo faz sentido para uma aula de 30 minutos?', opcoes: ['0 + 30 + 0 minutos', '5 + 20 + 5 minutos', '20 + 5 + 5 minutos'], certa: 1, explica: 'Aquecimento curto, parte principal maior e volta à calma no fim.' },
      { texto: 'Depois de um esforço intenso, o certo é…', opcoes: ['Parar de repente e sentar', 'Diminuir aos poucos, alongar e respirar'], certa: 1, explica: 'Na volta à calma a frequência cardíaca diminui aos poucos.' },
      { texto: 'Para todos participarem com segurança na quadra, a turma deve…', opcoes: ['Dividir a quadra em espaços para cada exercício', 'Fazer todos os exercícios no mesmo cantinho'], certa: 0, explica: 'Organizar o espaço evita esbarrões e filas.' },
      { texto: 'Quem cuida do tempo de cada parte e do sinal de troca?', opcoes: ['O cronometrista', 'Ninguém, cada um decide'], certa: 0, explica: 'Combinar papéis (anotar, cronometrar, demonstrar) ajuda o grupo.' },
    ],
  },

  // ---------------- Semana 5: Movimento e amizade ----------------
  caca_amizade: {
    tipo: 'cacapalavras', semana: 5,
    titulo: 'Movimento e amizade',
    instrucao: 'Encontre as palavras que unem saúde e convivência.',
    tamanho: 11,
    palavras: ['AMIZADE', 'GRUPO', 'DANCA', 'ACOLHER', 'SAUDE', 'CONVIVENCIA', 'CAMINHADA'],
  },

  // ---------------- Ponto de Checagem 1 ----------------
  quiz_guardiao: {
    tipo: 'quiz', semana: 5,
    titulo: 'Desafio do Guardião da Névoa',
    instrucao: 'Cada resposta certa dissipa um pedaço da névoa. Use tudo o que você aprendeu!',
    perguntas: [
      { texto: 'Qual cena mostra um exercício físico?', opcoes: ['Passear com o cachorro', 'Aula de ginástica planejada', 'Lavar o carro'], certa: 1, explica: 'Exercício físico é planejado, com objetivo e regularidade.' },
      { texto: 'Qual é uma vantagem da hidroginástica?', opcoes: ['Alto impacto nas articulações', 'Baixo impacto nas articulações', 'Não trabalha resistência'], certa: 1, explica: 'Na água, o impacto nas articulações é baixo.' },
      { texto: 'Qual é a ordem certa das partes da aula?', opcoes: ['Parte principal, aquecimento, volta à calma', 'Aquecimento, parte principal, volta à calma', 'Volta à calma, aquecimento, parte principal'], certa: 1, explica: 'Início (aquecimento), meio (parte principal) e fim (volta à calma).' },
      { texto: 'Para que serve a volta à calma?', opcoes: ['Para o corpo se recuperar aos poucos', 'Para aumentar o esforço no fim'], certa: 0, explica: 'Alongamentos e respiração ajudam o corpo a se recuperar.' },
      { texto: 'Praticar em grupo cria…', opcoes: ['Redes de sociabilidade', 'Mais cansaço e menos amizade'], certa: 0, explica: 'Fazemos amigos e sentimos que pertencemos a uma comunidade.' },
    ],
  },
};
