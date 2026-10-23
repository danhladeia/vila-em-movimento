// Conteúdo pedagógico da Unidade 1 (Caderno DED Express EF7, "Ginástica e saúde").
// Tudo o que é texto do jogo fica aqui, separado do motor, para revisar sem mexer no código.
// Nas falas, **negrito** vira destaque e {nome} vira o nome do aluno.

// Regiões da vila. `porta` = direção da estrada que leva até ela (a Praça fica no centro).
export const REGIOES = [
  { id: 'praca', n: 1, nome: 'Praça do Bairro', semana: 1, tema: 'Movimento para a vida', porta: null },
  { id: 'trilha', n: 2, nome: 'Trilha do Corpo', semana: 2, tema: 'Capacidades físicas e sensações', porta: 'norte' },
  { id: 'academia', n: 3, nome: 'Academia das Quatro Ginásticas', semana: 3, tema: 'Tipos de ginástica de condicionamento', porta: 'oeste' },
  { id: 'arena', n: 4, nome: 'Arena da Organização', semana: 4, tema: 'Organizar a aula de ginástica', porta: 'sul' },
  { id: 'festival', n: 5, nome: 'Festival da Comunidade', semana: 5, tema: 'Movimento e amizade', porta: 'leste' },
];

// NPCs. `pos` em quarteirões (1 quarteirão = 10 m; centro da praça = 0,0; norte = z negativo).
// `visual`, `tom` (roupa) e `pele`: como em CLASSES[].visuais e PELES (src/conteudo/rpg.js).
// comportamento: 'parado' | 'sentado' | 'passear' (segue `rota` em loop)
// dialogos: o primeiro cuja condição `se` valer é o usado. Condições:
//   { missao: 'id', estado: 'nova' | 'ativa' | 'pronta' | 'concluida' }   ('pronta' = só falta entregar)
//   { marca: 'nome' }   (uma ação que já aconteceu, como 'jorge_aprendeu')
export const NPCS = [
  {
    id: 'prefeita', nome: 'Prefeita Dona Lúcia', visual: { corpo: 'Mage' }, tom: '#ffe6c7', pele: '#b57650',
    pos: [0.35, 0.35], olhar: [0, 1], comportamento: 'parado',
    dialogos: [
      { se: { missao: 'boas_vindas', estado: 'nova' }, dialogo: 'prefeita_intro' },
      { se: { missao: 'boas_vindas', estado: 'ativa' }, dialogo: 'prefeita_espera' },
      { se: { missao: 'boas_vindas', estado: 'pronta' }, dialogo: 'prefeita_conclusao' },
      { dialogo: 'prefeita_depois' },
    ],
  },
  {
    id: 'beto', nome: 'Treinador Beto', visual: { corpo: 'Barbarian' }, tom: null, pele: '#74492e',
    pos: [-0.38, -3.6], olhar: [0, 1], comportamento: 'parado', dialogos: [{ dialogo: 'beto_trilha' }],
  },
  {
    id: 'cida', nome: 'Vó Cida', visual: { corpo: 'Knight', cabeca: 'Mage', semChapeu: true }, tom: '#e9d7ff', pele: '#93603f',
    pos: [-0.4, 0.9], olhar: [0, -1], comportamento: 'sentado', dialogos: [{ dialogo: 'cida_banco' }],
  },
  {
    id: 'jorge', nome: 'Seu Jorge', visual: { corpo: 'Ranger' }, tom: '#cfe8ff', pele: '#d9a07a', comportamento: 'passear',
    rota: [[-0.65, -0.65], [0.65, -0.65], [0.65, 0.65], [-0.65, 0.65]], pos: [-0.65, -0.65],
    dialogos: [
      { se: { marca: 'jorge_aprendeu' }, dialogo: 'jorge_depois' },
      { dialogo: 'jorge_passeio' },
    ],
  },
];

// Missões. Cada objetivo é cumprido por um evento:
//   'falou:<npc>'  ao terminar uma conversa com o NPC      'acao:<nome>'  quando uma fala tem acao: '<nome>'
// O objetivo `final` é entregue por uma fala com acao: 'concluir:<missao>'.
// Eventos que já aconteceram antes da missão começar também contam.
export const MISSOES = {
  boas_vindas: {
    titulo: 'Boas-vindas à Vila Ativa',
    regiao: 'praca',
    doador: 'prefeita',
    resumo: 'Conhecer os moradores e descobrir como cada um se movimenta no dia a dia.',
    objetivos: [
      { id: 'beto', texto: 'Converse com o Treinador Beto, na estrada do norte', evento: 'falou:beto', npc: 'beto' },
      { id: 'cida', texto: 'Converse com a Vó Cida, no banco da praça', evento: 'falou:cida', npc: 'cida' },
      { id: 'jorge', texto: 'Ajude o Seu Jorge a tirar a dúvida dele', evento: 'acao:jorge_aprendeu', npc: 'jorge' },
      { id: 'voltar', texto: 'Volte e conte tudo para a Prefeita Dona Lúcia', npc: 'prefeita', final: true },
    ],
    xpObjetivo: 15,
    aoIniciar: { itens: ['diario'] },
    recompensa: { xp: 110, itens: ['garrafinha'], atributos: { cooperacao: 1 } },
  },
};

export const DIALOGOS = {
  prefeita_intro: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Que bom que você chegou, **{nome}**! Eu sou a Lúcia, prefeita da Vila Ativa.', prox: 'nevoa' },
      nevoa: {
        fala: 'Desde que a **Névoa da Preguiça** desceu sobre a vila, ninguém mais se movimenta. As praças ficaram vazias e o nosso festival foi cancelado.',
        escolhas: [
          { texto: 'Como a névoa apareceu?', prox: 'origem' },
          { texto: 'Como eu posso ajudar?', prox: 'ajuda' },
        ],
      },
      origem: {
        fala: 'Ela foi crescendo aos pouquinhos: um dia sem caminhar, outro sem brincar na quadra… Quando vimos, ninguém sabia mais **onde** nem **como** se movimentar.',
        prox: 'ajuda',
      },
      ajuda: {
        fala: 'A névoa recua quando as pessoas **aprendem** sobre o movimento e **resolvem problemas** juntas. Ela cobre as estradas para as quatro regiões da vila.',
        prox: 'regioes',
      },
      regioes: {
        fala: 'Ao norte fica a **Trilha do Corpo**; a oeste, a **Academia das Quatro Ginásticas**; ao sul, a **Arena da Organização**; e a leste, o **Festival da Comunidade**.',
        prox: 'comeco',
      },
      comeco: {
        fala: 'Mas tudo começa aqui na **Praça do Bairro**. Converse com os moradores e observe: como cada um se movimenta no dia a dia?',
        escolhas: [
          { texto: 'Pode deixar, vou começar agora!', prox: 'diario' },
          { texto: 'Pode repetir onde ficam as regiões?', prox: 'regioes' },
        ],
      },
      diario: {
        fala: 'Leve este **Diário do Aventureiro**. Nele ficam suas missões e tudo o que você descobrir. Para abrir, aperte **Tab**.',
        acao: 'iniciar:boas_vindas',
        prox: 'fim',
      },
      fim: { fala: 'Fale com o **Treinador Beto**, com a **Vó Cida** e com o **Seu Jorge**. Depois volte aqui e me conte o que aprendeu!' },
    },
  },

  prefeita_espera: {
    inicio: 'oi',
    nos: {
      oi: {
        fala: 'Ainda falta conversar com alguns moradores. Abra o seu **Diário** (tecla **Tab**) para ver o que falta. Quem tem um **?** em cima da cabeça está esperando por você!',
      },
    },
  },

  prefeita_conclusao: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Você voltou, {nome}! O Seu Jorge me contou que você o ajudou com uma dúvida.', prox: 'pergunta' },
      pergunta: {
        fala: 'Então me diga: o que transforma uma simples caminhada em **exercício físico**?',
        escolhas: [
          { texto: 'Ter planejamento, objetivo e regularidade.', prox: 'certo' },
          { texto: 'Andar bem rápido, sem parar nem um minuto.', prox: 'dica' },
          { texto: 'Usar roupa de academia.', prox: 'dica' },
        ],
      },
      dica: {
        fala: 'Hum… varrer a casa também cansa, e ninguém planeja varrer para treinar. Lembre o que você explicou ao Seu Jorge.',
        prox: 'pergunta',
      },
      certo: {
        fala: 'Isso mesmo! **Atividade física** é todo movimento que gasta energia. **Exercício físico** é a atividade **planejada**, com **objetivo** e **regularidade**.',
        prox: 'reflexao',
      },
      reflexao: {
        fala: 'E você? Conte para o seu Diário: **como você costuma se movimentar no dia a dia?**',
        pergunta: { id: 'praca_meu_movimento', dica: 'Ex.: vou a pé para a escola, jogo bola no fim de semana…' },
        prox: 'fim',
      },
      fim: {
        fala: 'Obrigada, {nome}! Olhe só: a névoa já ficou um pouquinho mais fraca aqui na praça.',
        acao: 'concluir:boas_vindas',
      },
    },
  },

  prefeita_depois: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Você já conhece a vila, {nome}! Descanse um pouco e beba água: logo teremos novos desafios na **Praça do Bairro**.' },
    },
  },

  beto_trilha: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Ei! Eu sou o Beto, treinador da **Trilha do Corpo**. A névoa fechou a trilha bem aqui atrás de mim.', prox: 'corpo' },
      corpo: {
        fala: 'Na trilha a gente aprende a **escutar o corpo**: a respiração acelera, o coração bate mais rápido e o suor aparece para resfriar a gente.',
        escolhas: [
          { texto: 'Cansar durante o exercício é normal?', prox: 'cansaco' },
          { texto: 'Quando a trilha vai abrir?', prox: 'abrir' },
        ],
      },
      cansaco: {
        fala: 'Cansaço é normal! Mas **dor forte, tontura ou falta de ar** não são: nesse caso, **pare** e avise o professor.',
        prox: 'abrir',
      },
      abrir: { fala: 'Primeiro ajude a Praça do Bairro. Quando a névoa recuar por lá, ela vai afinar aqui também.', prox: null },
    },
  },

  cida_banco: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Olá, querido(a)! Eu caminhava todo dia de manhã com o meu grupo… agora fico aqui no banco.', prox: 'grupo' },
      grupo: {
        fala: 'Sinto falta das amigas da caminhada. Praticar junto é muito mais gostoso, sabia?',
        escolhas: [
          { texto: 'Por que é melhor praticar em grupo?', prox: 'porque' },
          { texto: 'Um dia eu caminho com a senhora!', prox: 'promessa' },
        ],
      },
      porque: {
        fala: 'A gente faz amizades, conversa, um anima o outro… isso se chama **rede de sociabilidade**. O movimento cuida da saúde **e** da convivência.',
        prox: null,
      },
      promessa: { fala: 'Combinado! Quando a névoa passar, vou te apresentar o pessoal do festival.', prox: null },
    },
  },

  jorge_passeio: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Bom dia! Estou só dando uma volta na praça… o médico disse que eu preciso melhorar o **fôlego**.', prox: 'duvida' },
      duvida: {
        fala: 'Mas fiquei na dúvida: dar uma voltinha já é **exercício físico**, ou é só **atividade física**?',
        escolhas: [
          { texto: 'Toda atividade física é exercício.', prox: 'errado' },
          { texto: 'Exercício é a atividade planejada, com objetivo e regularidade.', prox: 'certo' },
        ],
      },
      errado: {
        fala: 'Hum, será? Varrer a casa também gasta energia… mas ninguém planeja varrer para treinar. Acho que tem uma diferença aí.',
        prox: 'duvida',
      },
      certo: {
        fala: 'Ah, entendi! Se eu caminhar **3 vezes por semana, 30 minutos**, para melhorar o fôlego, vira **exercício físico**. Obrigado!',
        acao: 'jorge_aprendeu',
      },
    },
  },

  jorge_depois: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Olha eu aqui na minha caminhada planejada! Segunda, quarta e sexta, 30 minutos. Meu fôlego já agradece, {nome}!' },
    },
  },
};
