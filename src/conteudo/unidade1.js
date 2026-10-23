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
//   { missao: 'id', estado: 'bloqueada' | 'nova' | 'ativa' | 'pronta' | 'concluida' }   ('pronta' = só falta entregar)
//   { marca: 'nome' }   (uma ação que já aconteceu, como 'jorge_aprendeu')
// Moradores das regiões 2 a 5 ficam nas clareiras depois da névoa (anel 5 da vila).
export const NPCS = [
  {
    id: 'prefeita', nome: 'Prefeita Dona Lúcia', visual: { corpo: 'Mage' }, tom: '#ffe6c7', pele: '#b57650',
    pos: [0.35, 0.35], olhar: [0, 1], comportamento: 'parado',
    dialogos: [
      { se: { missao: 'boas_vindas', estado: 'nova' }, dialogo: 'prefeita_intro' },
      { se: { missao: 'boas_vindas', estado: 'ativa' }, dialogo: 'prefeita_espera' },
      { se: { missao: 'boas_vindas', estado: 'pronta' }, dialogo: 'prefeita_conclusao' },
      { se: { missao: 'mapa_movimento', estado: 'nova' }, dialogo: 'prefeita_mapa' },
      { se: { missao: 'mapa_movimento', estado: 'ativa' }, dialogo: 'prefeita_mapa_espera' },
      { se: { missao: 'mapa_movimento', estado: 'pronta' }, dialogo: 'prefeita_mapa_fim' },
      { se: { missao: 'guardiao', estado: 'nova' }, dialogo: 'prefeita_guardiao' },
      { se: { missao: 'guardiao', estado: 'pronta' }, dialogo: 'prefeita_guardiao_fim' },
      { se: { missao: 'guardiao', estado: 'concluida' }, dialogo: 'prefeita_mestre' },
      { dialogo: 'prefeita_depois' },
    ],
  },
  {
    id: 'beto', nome: 'Treinador Beto', visual: { corpo: 'Barbarian' }, tom: null, pele: '#74492e',
    pos: [-0.38, -3.6], olhar: [0, 1], comportamento: 'parado',
    dialogos: [
      { se: { missao: 'trilha', estado: 'nova' }, dialogo: 'beto_trilha_nova' },
      { se: { missao: 'trilha', estado: 'ativa' }, dialogo: 'beto_trilha_espera' },
      { se: { missao: 'trilha', estado: 'pronta' }, dialogo: 'beto_trilha_fim' },
      { se: { missao: 'trilha', estado: 'concluida' }, dialogo: 'beto_depois' },
      { dialogo: 'beto_trilha' },
    ],
  },
  {
    id: 'cida', nome: 'Vó Cida', visual: { corpo: 'Knight', cabeca: 'Mage', semChapeu: true }, tom: '#e9d7ff', pele: '#93603f',
    pos: [-0.4, 0.9], olhar: [0, -1], comportamento: 'sentado',
    dialogos: [
      { se: { missao: 'academia', estado: 'ativa' }, dialogo: 'cida_ginastica' },
      { se: { missao: 'festival', estado: 'ativa' }, dialogo: 'cida_entrevista' },
      { dialogo: 'cida_banco' },
    ],
  },
  {
    id: 'jorge', nome: 'Seu Jorge', visual: { corpo: 'Ranger' }, tom: '#cfe8ff', pele: '#d9a07a', comportamento: 'passear',
    rota: [[-0.65, -0.65], [0.65, -0.65], [0.65, 0.65], [-0.65, 0.65]], pos: [-0.65, -0.65],
    dialogos: [
      { se: { missao: 'mapa_movimento', estado: 'ativa' }, dialogo: 'jorge_caca' },
      { se: { missao: 'arena', estado: 'ativa' }, dialogo: 'jorge_aula' },
      { se: { marca: 'jorge_aprendeu' }, dialogo: 'jorge_depois' },
      { dialogo: 'jorge_passeio' },
    ],
  },
  {
    id: 'nina', nome: 'Corredora Nina', visual: { corpo: 'Rogue' }, tom: '#ffd1a8', pele: '#b57650',
    pos: [-0.4, -5.05], olhar: [0, 1], comportamento: 'parado',
    dialogos: [
      { se: { missao: 'trilha', estado: 'ativa' }, dialogo: 'nina_memoria' },
      { dialogo: 'nina_padrao' },
    ],
  },
  {
    id: 'bia', nome: 'Mestra Bia', visual: { corpo: 'Barbarian', cabeca: 'Rogue', semChapeu: true }, tom: null, pele: '#d9a07a',
    pos: [-5.05, 0.4], olhar: [1, 0], comportamento: 'parado',
    dialogos: [
      { se: { missao: 'academia', estado: 'nova' }, dialogo: 'bia_nova' },
      { se: { missao: 'academia', estado: 'ativa' }, dialogo: 'bia_espera' },
      { se: { missao: 'academia', estado: 'pronta' }, dialogo: 'bia_fim' },
      { dialogo: 'bia_padrao' },
    ],
  },
  {
    id: 'rita', nome: 'Professora Rita', visual: { corpo: 'Ranger', cabeca: 'Mage' }, tom: '#c9a7ff', pele: '#74492e',
    pos: [0.4, 5.05], olhar: [0, -1], comportamento: 'parado',
    dialogos: [
      { se: { missao: 'arena', estado: 'nova' }, dialogo: 'rita_nova' },
      { se: { missao: 'arena', estado: 'ativa' }, dialogo: 'rita_espera' },
      { se: { missao: 'arena', estado: 'pronta' }, dialogo: 'rita_fim' },
      { dialogo: 'rita_padrao' },
    ],
  },
  {
    id: 'tiao', nome: 'Seu Tião', visual: { corpo: 'Barbarian', cabeca: 'Ranger', semChapeu: true }, tom: '#ffd75e', pele: '#93603f',
    pos: [5.05, -0.4], olhar: [-1, 0], comportamento: 'parado',
    dialogos: [
      { se: { missao: 'festival', estado: 'nova' }, dialogo: 'tiao_nova' },
      { se: { missao: 'festival', estado: 'ativa' }, dialogo: 'tiao_espera' },
      { se: { missao: 'festival', estado: 'pronta' }, dialogo: 'tiao_fim' },
      { dialogo: 'tiao_padrao' },
    ],
  },
];

// Missões. Cada objetivo é cumprido por um evento:
//   'falou:<npc>'  ao terminar uma conversa com o NPC      'acao:<nome>'  quando uma fala tem acao: '<nome>'
//   'jogo:<id>'    ao terminar um minijogo (src/conteudo/minijogos.js), com qualquer número de estrelas
// O objetivo `final` é entregue por uma fala com acao: 'concluir:<missao>'.
// Eventos que já aconteceram antes da missão começar também contam.
// `requer`: a missão só aparece depois de { missao } concluída e/ou { regiao } liberada.
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

  mapa_movimento: {
    titulo: 'Mapa do movimento',
    regiao: 'praca',
    doador: 'prefeita',
    requer: { missao: 'boas_vindas' },
    resumo: 'Diferenciar atividade física de exercício físico e descobrir lugares do bairro para se movimentar.',
    objetivos: [
      { id: 'classificar', texto: 'Classifique os movimentos dos moradores com a prefeita', evento: 'jogo:classificar_movimento', npc: 'prefeita' },
      { id: 'lugares', texto: 'Ajude o Seu Jorge a achar lugares para caminhar', evento: 'jogo:caca_lugares', npc: 'jorge' },
      { id: 'voltar', texto: 'Mostre o mapa para a Prefeita Dona Lúcia', npc: 'prefeita', final: true },
    ],
    xpObjetivo: 20,
    recompensa: { xp: 80, itens: ['mapa', 'medalha_praca'], atributos: { agilidade: 1 }, regioes: ['trilha'] },
  },

  trilha: {
    titulo: 'Escute o seu corpo',
    regiao: 'trilha',
    doador: 'beto',
    requer: { regiao: 'trilha' },
    resumo: 'Relacionar as capacidades físicas às sensações do corpo e saber quando parar.',
    objetivos: [
      { id: 'memoria', texto: 'Jogue a Memória do corpo com a Corredora Nina, na Trilha', evento: 'jogo:memoria_sensacoes', npc: 'nina' },
      { id: 'voltar', texto: 'Mostre ao Treinador Beto o que fazer com os sinais do corpo', npc: 'beto', final: true },
    ],
    xpObjetivo: 20,
    recompensa: { xp: 100, itens: ['medalha_trilha'], atributos: { resistencia: 1, forca: 1 }, regioes: ['academia'] },
  },

  academia: {
    titulo: 'As quatro ginásticas',
    regiao: 'academia',
    doador: 'bia',
    requer: { regiao: 'academia' },
    resumo: 'Conhecer musculação, jump, hidroginástica e corrida/caminhada e escolher a ginástica certa para cada objetivo.',
    objetivos: [
      { id: 'forca', texto: 'Descubra as ginásticas no jogo da forca com a Mestra Bia', evento: 'jogo:forca_ginasticas', npc: 'bia' },
      { id: 'cida', texto: 'Ajude a Vó Cida a escolher uma ginástica', evento: 'jogo:quiz_ginastica_ideal', npc: 'cida' },
      { id: 'voltar', texto: 'Volte à Mestra Bia, na Academia', npc: 'bia', final: true },
    ],
    xpObjetivo: 20,
    recompensa: { xp: 100, itens: ['cartoes_ginastica'], atributos: { forca: 1, flexibilidade: 1 }, regioes: ['arena'] },
  },

  arena: {
    titulo: 'Nossa aula de 30 minutos',
    regiao: 'arena',
    doador: 'rita',
    requer: { regiao: 'arena' },
    resumo: 'Organizar uma aula de ginástica em grupo: início, meio e fim, tempo, espaço e tarefas.',
    objetivos: [
      { id: 'ordenar', texto: 'Monte a sequência da aula com a Professora Rita', evento: 'jogo:ordenar_aula', npc: 'rita' },
      { id: 'jorge', texto: 'Ajude o Seu Jorge a planejar a aula da praça', evento: 'jogo:quiz_planejar_aula', npc: 'jorge' },
      { id: 'voltar', texto: 'Volte à Professora Rita, na Arena', npc: 'rita', final: true },
    ],
    xpObjetivo: 20,
    recompensa: { xp: 100, itens: ['apito_dourado'], atributos: { cooperacao: 1, flexibilidade: 1 }, regioes: ['festival'] },
  },

  festival: {
    titulo: 'Movimento e amizade',
    regiao: 'festival',
    doador: 'tiao',
    requer: { regiao: 'festival' },
    resumo: 'Entender as redes de sociabilidade e montar um grupo de movimento para o festival.',
    objetivos: [
      { id: 'entrevista', texto: 'Entreviste a Vó Cida sobre o grupo de caminhada dela', evento: 'acao:entrevista_cida', npc: 'cida' },
      { id: 'caca', texto: 'Encontre as palavras da amizade com o Seu Tião', evento: 'jogo:caca_amizade', npc: 'tiao' },
      { id: 'voltar', texto: 'Volte ao Seu Tião, no Festival', npc: 'tiao', final: true },
    ],
    xpObjetivo: 20,
    recompensa: { xp: 100, itens: ['medalha_amizade'], atributos: { cooperacao: 1, agilidade: 1 } },
  },

  guardiao: {
    titulo: 'O Guardião da Névoa',
    regiao: 'praca',
    doador: 'prefeita',
    requer: { missao: 'festival' },
    resumo: 'Ponto de Checagem 1: mostrar tudo o que aprendeu na Unidade 1 e afastar a névoa de vez.',
    objetivos: [
      { id: 'desafio', texto: 'Vença o Desafio do Guardião com a Prefeita Dona Lúcia', evento: 'jogo:quiz_guardiao', npc: 'prefeita' },
      { id: 'voltar', texto: 'Explique para a prefeita a volta à calma', npc: 'prefeita', final: true },
    ],
    xpObjetivo: 30,
    recompensa: { xp: 150, itens: ['certificado'] },
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
      oi: { fala: 'A vila está voltando a se mexer, {nome}! Siga as estradas sem névoa e procure quem tem um **!** sobre a cabeça. O **Mapa** (tecla M) mostra o caminho.' },
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

  // ======================= Semana 1: Mapa do movimento =======================
  prefeita_mapa: {
    inicio: 'oi',
    nos: {
      oi: {
        fala: 'Agora quero fazer um **Mapa do Movimento** da vila. Primeiro, vamos olhar os moradores: quem está fazendo **atividade física** e quem está fazendo **exercício físico**?',
        acao: 'iniciar:mapa_movimento',
        prox: 'jogo',
      },
      jogo: { fala: 'Leia cada cartão e classifique. Se errar, pense de novo: é planejado, com objetivo e regularidade?', jogo: 'classificar_movimento', prox: 'depois', seSair: 'sair' },
      depois: { fala: 'Muito bem! Agora o **Seu Jorge** quer caminhar 3 vezes por semana, mas não sabe **onde**. Ajude-o a encontrar lugares no bairro!' },
      sair: { fala: 'Tudo bem! Quando quiser tentar de novo, é só falar comigo.' },
    },
  },
  prefeita_mapa_espera: {
    inicio: 'oi',
    nos: {
      oi: {
        fala: 'Como vai o nosso Mapa do Movimento? Lembre: o **Seu Jorge** precisa de lugares para caminhar.',
        escolhas: [
          { texto: 'Quero classificar os movimentos de novo', prox: 'jogo' },
          { texto: 'Vou procurar o Seu Jorge', prox: 'tchau' },
        ],
      },
      jogo: { fala: 'Vamos lá!', jogo: 'classificar_movimento', prox: 'tchau' },
      tchau: { fala: 'Até já, {nome}!' },
    },
  },
  prefeita_mapa_fim: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Que mapa bonito! **Praça, quadra, ciclovia, parque, calçada e escola**: todos são lugares para se movimentar. E ir a pé ou de bicicleta também conta!', prox: 'seguranca' },
      seguranca: { fala: 'Só não esqueça: atravesse na **faixa de pedestres** e use **capacete** na bicicleta.', prox: 'reflexao' },
      reflexao: {
        fala: 'Conte para o seu Diário: **qual proposta de movimento você vai colocar em prática nesta semana?**',
        pergunta: { id: 'praca_proposta', dica: 'Ex.: caminhar até a praça com minha irmã na quarta-feira…' },
        prox: 'fim',
      },
      fim: {
        fala: 'Combinado! E olhe lá: a névoa saiu da estrada do **norte**! A **Trilha do Corpo** está livre. Fale com o **Treinador Beto**.',
        acao: 'concluir:mapa_movimento',
      },
    },
  },
  jorge_caca: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Ah, {nome}! A prefeita disse que você ia me ajudar. Quero caminhar 3 vezes por semana, mas **onde**? Me ajude a achar lugares no bairro!', prox: 'jogo' },
      jogo: { fala: 'Os nomes estão escondidos neste quadro de letras.', jogo: 'caca_lugares', prox: 'depois', seSair: 'sair' },
      depois: { fala: 'Quantas opções! Vou caminhar na **ciclovia** e convidar a minha vizinha: praticar junto é mais divertido. Conte para a prefeita!' },
      sair: { fala: 'Sem pressa! Quando quiser, me ajude a procurar.' },
    },
  },

  // ======================= Semana 2: Trilha do Corpo =======================
  beto_trilha_nova: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'A névoa saiu da trilha, {nome}! Agora dá para treinar. Mas antes, precisamos aprender a **escutar o corpo**.', acao: 'iniciar:trilha', prox: 'nina' },
      nina: { fala: 'Siga a estrada para o norte até a clareira. A **Corredora Nina** tem um jogo de memória sobre as **sensações do corpo**. Depois volte aqui!' },
    },
  },
  beto_trilha_espera: {
    inicio: 'oi',
    nos: { oi: { fala: 'A **Corredora Nina** está na clareira da trilha, logo depois daqui. Vá até lá e jogue a Memória do corpo!' } },
  },
  beto_trilha_fim: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Já sabe que capacidade cansa aos poucos e qual dá aquela tensão leve? Ótimo! Agora o mais importante: **o que fazer com os sinais do corpo**.', prox: 'jogo' },
      jogo: { fala: 'Responda o meu desafio de segurança.', jogo: 'quiz_sinais', prox: 'reflexao', seSair: 'sair' },
      reflexao: {
        fala: 'Pense nos exercícios que você faz na aula. **Qual exercício provoca mais mudanças no seu corpo? Por quê?**',
        pergunta: { id: 'trilha_mudancas', dica: 'Ex.: a corrida, porque meu coração acelera e eu suo muito…' },
        prox: 'fim',
      },
      fim: {
        fala: 'Você escuta o corpo como um atleta! A névoa saiu da estrada do **oeste**: a **Academia das Quatro Ginásticas** está aberta. Procure a **Mestra Bia**.',
        acao: 'concluir:trilha',
      },
      sair: { fala: 'Tudo bem. Volte quando quiser responder o desafio.' },
    },
  },
  beto_depois: {
    inicio: 'oi',
    nos: { oi: { fala: 'Lembre: cansaço é normal, mas **dor forte, tontura ou falta de ar**, pare e avise o professor. E beba água!' } },
  },
  nina_memoria: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Oi! Eu sou a Nina. Quando eu corro, sinto cada parte do corpo trabalhar. Vamos ver se você reconhece as **sensações** de cada capacidade?', prox: 'jogo' },
      jogo: { fala: 'Junte cada capacidade ou sinal do corpo com a sua sensação.', jogo: 'memoria_sensacoes', prox: 'depois', seSair: 'sair' },
      depois: { fala: '**Resistência** cansa aos poucos, **força** dá esforço intenso, **flexibilidade** traz uma leve tensão. E o **suor** resfria o corpo! Volte ao Treinador Beto.' },
      sair: { fala: 'Tudo bem, a trilha não vai fugir! Volte quando quiser.' },
    },
  },
  nina_padrao: {
    inicio: 'oi',
    nos: {
      oi: {
        fala: 'Correr bem é correr no **ritmo certo**: comece devagar e aumente aos poucos. Quer jogar a Memória do corpo de novo?',
        escolhas: [
          { texto: 'Quero jogar!', prox: 'jogo' },
          { texto: 'Agora não', prox: null },
        ],
      },
      jogo: { fala: 'Boa sorte!', jogo: 'memoria_sensacoes' },
    },
  },

  // ======================= Semana 3: Academia =======================
  bia_nova: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Bem-vindo(a) à Academia, {nome}! Eu sou a Mestra Bia. Aqui ensinamos as **ginásticas de condicionamento**: cada uma tem um objetivo, um lugar e equipamentos.', acao: 'iniciar:academia', prox: 'jogo' },
      jogo: { fala: 'Vamos ver se você descobre o nome de cada ginástica pelas dicas!', jogo: 'forca_ginasticas', prox: 'depois', seSair: 'sair' },
      depois: { fala: 'Isso! **Musculação**, **jump**, **hidroginástica**, **caminhada e corrida**. Agora ajude a **Vó Cida**, lá no banco da praça: ela quer escolher uma ginástica.' },
      sair: { fala: 'Sem problemas. Volte quando quiser jogar.' },
    },
  },
  bia_espera: {
    inicio: 'oi',
    nos: {
      oi: {
        fala: 'A **Vó Cida** está no banco da praça esperando a sua ajuda. Quer jogar a forca das ginásticas de novo?',
        escolhas: [
          { texto: 'Quero jogar a forca', prox: 'jogo' },
          { texto: 'Vou ajudar a Vó Cida', prox: null },
        ],
      },
      jogo: { fala: 'Boa sorte!', jogo: 'forca_ginasticas' },
    },
  },
  bia_fim: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'A Vó Cida me contou: vai fazer **hidroginástica**, com baixo impacto nos joelhos. Para escolher, você pensou no **objetivo**, no **espaço** e nos **materiais**. Perfeito!', prox: 'reflexao' },
      reflexao: {
        fala: 'E para você? **Qual ginástica você escolheria para praticar? Por quê?**',
        pergunta: { id: 'academia_escolha', dica: 'Ex.: jump, porque gosto de música e quero mais fôlego…' },
        prox: 'fim',
      },
      fim: {
        fala: 'Ótima escolha! A névoa saiu da estrada do **sul**: a **Arena da Organização** está livre. Procure a **Professora Rita**.',
        acao: 'concluir:academia',
      },
    },
  },
  bia_padrao: {
    inicio: 'oi',
    nos: { oi: { fala: 'A musculação na adolescência é segura com **orientação**, **cargas leves** e **boa técnica**. Comece devagar!' } },
  },
  cida_ginastica: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Ah, a Mestra Bia mandou você? Meus **joelhos doem** um pouco, e o clube tem piscina. Qual ginástica é boa para mim? E para os meus vizinhos?', prox: 'jogo' },
      jogo: { fala: 'Me ajude a escolher para cada um.', jogo: 'quiz_ginastica_ideal', prox: 'depois', seSair: 'sair' },
      depois: { fala: '**Hidroginástica**! Na água o impacto é baixo. Vou me inscrever amanhã mesmo. Conte para a Mestra Bia!' },
      sair: { fala: 'Tudo bem, querido(a). Eu espero aqui no banco.' },
    },
  },

  // ======================= Semana 4: Arena =======================
  rita_nova: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Que bom que você chegou! Eu sou a Professora Rita. A turma quer fazer uma **aula de ginástica de 30 minutos**, mas está todo mundo se esbarrando!', acao: 'iniciar:arena', prox: 'partes' },
      partes: { fala: 'Toda aula bem organizada tem **início, meio e fim**. Monte a sequência para mim.', jogo: 'ordenar_aula', prox: 'depois', seSair: 'sair' },
      depois: { fala: '**Aquecimento**, **parte principal** e **volta à calma**! Agora o **Seu Jorge** quer organizar uma aula na praça. Ajude-o a planejar tempo, espaço e tarefas.' },
      sair: { fala: 'Tudo bem! Volte quando quiser montar a aula.' },
    },
  },
  rita_espera: {
    inicio: 'oi',
    nos: {
      oi: {
        fala: 'O **Seu Jorge** está na praça esperando a sua ajuda para planejar a aula. Quer montar a sequência de novo?',
        escolhas: [
          { texto: 'Quero montar de novo', prox: 'jogo' },
          { texto: 'Vou ajudar o Seu Jorge', prox: null },
        ],
      },
      jogo: { fala: 'Lá vamos nós!', jogo: 'ordenar_aula' },
    },
  },
  rita_fim: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'O Seu Jorge contou que a aula da praça foi um sucesso: **5 minutos** de aquecimento, **20** de parte principal e **5** de volta à calma, cada um com a sua tarefa.', prox: 'reflexao' },
      reflexao: {
        fala: 'Pense numa aula que a sua turma planejou. **O que funcionou bem? O que vocês mudariam?**',
        pergunta: { id: 'arena_aula', dica: 'Ex.: dividir a quadra funcionou; mudaríamos o tempo do aquecimento…' },
        prox: 'fim',
      },
      fim: {
        fala: 'Isso é cooperação! A névoa saiu da estrada do **leste**: o **Festival da Comunidade** pode voltar. Procure o **Seu Tião**.',
        acao: 'concluir:arena',
      },
    },
  },
  rita_padrao: {
    inicio: 'oi',
    nos: { oi: { fala: 'Na **volta à calma**, a frequência cardíaca diminui aos poucos. Nunca pare de repente depois de um esforço intenso!' } },
  },
  jorge_aula: {
    inicio: 'oi',
    nos: {
      oi: { fala: '{nome}! Quero fazer uma aula de ginástica aqui na praça, mas não sei como dividir o **tempo**, o **espaço** e as **tarefas**. Me ajuda?', prox: 'jogo' },
      jogo: { fala: 'Vamos planejar juntos.', jogo: 'quiz_planejar_aula', prox: 'depois', seSair: 'sair' },
      depois: { fala: 'Agora sim: cada um sabe o que fazer e ninguém se esbarra. Conte para a Professora Rita!' },
      sair: { fala: 'Sem pressa, eu espero.' },
    },
  },

  // ======================= Semana 5: Festival =======================
  tiao_nova: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Olá, {nome}! Eu sou o Tião, organizador do **Festival da Comunidade**. Para o festival voltar, precisamos de **grupos de movimento**!', acao: 'iniciar:festival', prox: 'plano' },
      plano: { fala: 'Primeiro, **entreviste a Vó Cida**: ela participa de um grupo de caminhada há anos. Depois volte aqui para o nosso caça-palavras da amizade.' },
    },
  },
  tiao_espera: {
    inicio: 'oi',
    nos: {
      oi: {
        fala: 'Já entrevistou a **Vó Cida**? E que tal o caça-palavras da amizade?',
        escolhas: [
          { texto: 'Quero jogar o caça-palavras', prox: 'jogo' },
          { texto: 'Depois', prox: null },
        ],
      },
      jogo: { fala: 'Encontre as palavras que unem saúde e convivência!', jogo: 'caca_amizade', prox: 'depois' },
      depois: { fala: 'Amizade, grupo, dança, acolher… é disso que o festival é feito!' },
    },
  },
  tiao_fim: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Com o que você aprendeu, montamos um grupo para o festival: escolhemos uma prática que agrada **muita gente**, combinamos **dia, hora e local seguro** e vamos **acolher** quem está começando.', prox: 'reflexao' },
      reflexao: {
        fala: 'E você? **Que grupo de movimento você gostaria de criar ou participar?**',
        pergunta: { id: 'festival_grupo', dica: 'Ex.: um grupo de dança no recreio, com os meus amigos…' },
        prox: 'fim',
      },
      fim: {
        fala: 'O festival está de volta! Mas sinto que a névoa se juntou no **centro da praça**… Corra até a **Prefeita Dona Lúcia**!',
        acao: 'concluir:festival',
      },
    },
  },
  tiao_padrao: {
    inicio: 'oi',
    nos: { oi: { fala: 'Muitas cidades têm projetos **gratuitos** de atividade física em praças e centros comunitários. Informe-se na **UBS** ou na prefeitura!' } },
  },
  cida_entrevista: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Uma entrevista? Que chique! Pode perguntar, querido(a).', prox: 'p1' },
      p1: { fala: '**Que prática você faz?** — Caminhada, com o meu grupo de amigas da praça.', prox: 'p2' },
      p2: { fala: '**Onde e quando?** — Aqui na praça, segunda, quarta e sexta, às 7 da manhã.', prox: 'p3' },
      p3: { fala: '**Há quanto tempo?** — Faz 12 anos! Começamos em três; hoje somos vinte.', prox: 'p4' },
      p4: { fala: '**O que mudou na sua vida?** — Durmo melhor, tenho mais disposição e ganhei amigas para a vida toda. Isso é **rede de sociabilidade**!', acao: 'entrevista_cida', prox: 'fim' },
      fim: { fala: 'Conte para o Seu Tião. Quero ver esse festival cheio de gente se movimentando!' },
    },
  },

  // ======================= Checagem 1: Guardião =======================
  prefeita_guardiao: {
    inicio: 'oi',
    nos: {
      oi: { fala: '{nome}, a névoa que restou se juntou bem aqui e virou o **Guardião da Névoa**! Só quem aprendeu tudo sobre movimento consegue dissipá-lo.', acao: 'iniciar:guardiao', prox: 'jogo' },
      jogo: { fala: 'Cada resposta certa é um raio de sol. Você consegue!', jogo: 'quiz_guardiao', prox: 'reflexao', seSair: 'sair' },
      reflexao: {
        fala: 'O Guardião está quase sumindo! Última tarefa: **explique com suas palavras para que serve a volta à calma.**',
        pergunta: { id: 'guardiao_volta_calma', dica: 'Ex.: serve para o coração desacelerar aos poucos…' },
        prox: 'fim',
      },
      fim: {
        fala: 'A névoa sumiu de vez! A Vila Ativa voltou a se movimentar. Você é oficialmente **Mestre da Vila Ativa**! Parabéns, {nome}!',
        acao: 'concluir:guardiao',
      },
      sair: { fala: 'Respire fundo e volte quando estiver pronto(a). O Guardião espera.' },
    },
  },
  prefeita_guardiao_fim: {
    inicio: 'reflexao',
    nos: {
      reflexao: {
        fala: 'Você venceu o desafio! Agora **explique com suas palavras para que serve a volta à calma.**',
        pergunta: { id: 'guardiao_volta_calma', dica: 'Ex.: serve para o coração desacelerar aos poucos…' },
        prox: 'fim',
      },
      fim: {
        fala: 'A névoa sumiu de vez! Você é oficialmente **Mestre da Vila Ativa**! Parabéns, {nome}!',
        acao: 'concluir:guardiao',
      },
    },
  },
  prefeita_mestre: {
    inicio: 'oi',
    nos: {
      oi: { fala: 'Olá, **Mestre da Vila Ativa**! No seu **Diário** (aba Jogos) você pode jogar de novo os desafios e tentar as 3 estrelas. E na quadra da escola, continue se movimentando!' },
    },
  },
};
