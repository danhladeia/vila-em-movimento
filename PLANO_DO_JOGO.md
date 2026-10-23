# A Vila em Movimento: plano do jogo (RPG 3D, Three.js)

**Público:** 7º ano, Educação Física · **Base:** Caderno DED Express EF7, **Unidade 1 "Ginástica e saúde"** (semanas 1 a 5 + Ponto de Checagem 1) · **Habilidades:** EF67EF08P7, EF67EF09P7, EF67EF10P7

---

## 1. Ideia central

A **Vila Ativa** foi coberta pela **Névoa da Preguiça**: os moradores pararam de se movimentar, as praças ficaram vazias e o festival da comunidade foi cancelado. O aluno é um **Aprendiz do Movimento** e precisa percorrer 5 regiões, uma para cada semana do caderno, resolvendo problemas com o que aprende. A cada região resolvida a névoa recua e os moradores voltam a se mexer (caminhar, alongar, dançar, comemorar).

- **Sem combate com armas.** Os "desafios" são problemas de Educação Física: classificar, escolher, planejar, organizar, convencer. O "chefe" final é vencido **organizando uma aula de ginástica** e respondendo ao Ponto de Checagem.
- **Cara de RPG:** escolha de personagem, atributos, XP e níveis, inventário, diário de missões, NPCs com diálogos e escolhas, mapa com regiões que vão sendo liberadas, recompensas e medalhas.
- **Mesma estrutura do caderno** em toda missão: **Antes da prática** (NPC apresenta o problema), **Registro da prática** (jogabilidade) e **Depois da prática** (pergunta de reflexão gravada no Diário), terminando com o **"Como estou?"** (autoavaliação em 3 estrelas).

---

## 2. Personagem e sistemas de RPG

### Classes (modelos KayKit Adventurers, **sem armas**)
| Modelo | Classe no jogo | Atributo inicial +1 | Item inicial |
|---|---|---|---|
| Barbarian | Guardião da Força | Força | Faixa de treino |
| Ranger | Andarilho da Resistência | Resistência | Tênis de corrida |
| Rogue / Rogue_Hooded | Ágil das Trilhas | Agilidade | Cronômetro |
| Mage | Sábio do Alongamento | Flexibilidade | Colchonete |
| Knight | Capitão da Equipe | Cooperação | Apito |

A classe dá só um pequeno bônus visual e de diálogo: **todo o conteúdo é igual para todos**. As cores das roupas poderão ser trocadas (tingimento do material) para o aluno se reconhecer no personagem.

### Atributos
**Força · Resistência · Flexibilidade · Agilidade · Cooperação** (0 a 10). Sobem ao completar missões ligadas a cada capacidade. Algumas portas e diálogos pedem um mínimo (ex.: "Cooperação 3" para recrutar o grupo da Região 5), o que incentiva completar tudo.

### Barra de energia (fôlego) e Termômetro do Esforço
Correr e fazer exercícios gasta fôlego. O HUD mostra **respiração, batimento e suor** mudando com o esforço (conteúdo da Semana 2). Quem força demais recebe o evento **"tontura"** e precisa escolher a ação certa (**parar e avisar o professor**). Isso ensina ritmo e segurança sem punir.

### Progresso
- **XP e níveis** (1 a 5; um nível por região concluída).
- **Inventário** com itens didáticos: garrafinha, tênis, capacete, mapa do bairro, cartões das ginásticas, cronograma da aula.
- **Diário do Aventureiro**: missões ativas, respostas do "Depois da prática", autoavaliações e glossário desbloqueável (Sociabilidade, Aquecimento, Volta à calma, Hidroginástica, Musculação).
- **Medalhas** por região e a medalha final **"Mestre da Vila Ativa"**.

---

## 3. Mapa do mundo e missões (o conteúdo do caderno vira problema)

O mundo é uma pequena vila vista em **câmera 3/4 (isométrica que segue o jogador)**: centro urbano feito com o City Builder Bits, cercado de floresta (Forest Nature Pack). Cada região começa coberta de névoa e é liberada em ordem.

### Região 1: Praça do Bairro (Semana 1: *Movimento para a vida*, EF67EF10P7)
- **Antes:** a Prefeita Dona Lúcia explica que ninguém sabe onde se movimentar no bairro.
- **Problema 1, "Atividade ou exercício?":** 6 moradores fazem ações (varrer a calçada, passear com o cachorro, ir de bicicleta para a escola, treino de corrida com planilha, aula de ginástica na praça, lavar o carro). O jogador conversa com cada um e classifica: **atividade física** (gasta energia) ou **exercício físico** (planejado, com objetivo e regularidade).
- **Problema 2, "Mapa do movimento":** explorar o bairro e encontrar 3 lugares (praça, quadra, ciclovia/academia ao ar livre). Em cada um, escolher **prática possível** e **com quem** praticar. O mapa preenchido vira item do inventário.
- **Problema 3, "Ajude o vizinho":** NPCs com restrições ("não tenho dinheiro", "tenho só 20 minutos", "não gosto de ir sozinho"). O jogador recomenda um lugar e uma prática do mapa. Respostas coerentes dão XP; incoerentes recebem dica.
- **Segurança (Fique ligado):** atravessar a rua na faixa e pegar o capacete antes da ciclovia. O jogo verifica isso.
- **Depois:** "Qual proposta você vai colocar em prática nesta semana?"
- **Recompensa:** Mapa do Bairro + Medalha da Praça.

### Região 2: Trilha do Corpo (Semana 2: *Capacidades físicas e sensações*, EF67EF08P7)
- **Antes:** o Treinador Beto pede para o aprendiz "escutar o corpo".
- **Prática jogável:** 4 estações iguais às do diário de sensações:
  1. **Corrida de 3 minutos** (volta na trilha, ritmo contínuo; acelerar demais esvazia o fôlego),
  2. **10 agachamentos** (sequência de teclas no ritmo; animação de exercício),
  3. **Alongamento de 30 segundos** (segurar a tecla sem soltar, tensão leve),
  4. **Tiro de 20 metros** (velocidade máxima, curta).
- **Problema, "Diário de sensações":** depois de cada estação o jogador classifica a **capacidade** (resistência, força, flexibilidade, velocidade), a **sensação principal** (respiração acelerada, músculos queimando, leve tensão, coração disparado) e o **esforço no semáforo** (verde, amarelo, vermelho). O HUD mostrou os sinais durante a prática, então a resposta é deduzida da observação, não decorada.
- **Evento de segurança:** um NPC sente dor forte e tontura. Escolher **parar e avisar o professor** (e não "continuar para não perder").
- **Depois:** "Qual exercício provocou mais mudanças no seu corpo? Por quê?"
- **Recompensa:** Garrafinha (recupera fôlego mais rápido) + atributos de Resistência e Força.

### Região 3: Academia das Quatro Ginásticas (Semana 3: *Tipos de ginástica de condicionamento*, EF67EF09P7)
- **Antes:** quatro mestres guardam quatro salas: **musculação**, **jump**, **hidroginástica** (lago da floresta) e **corrida/caminhada** (pista).
- **Prática:** uma minissérie em cada sala (com animações de exercício) que libera o **cartão da ginástica** com objetivo, local e equipamento.
- **Problema 1, "Ligue a ginástica":** encaixar cada cartão na característica certa (água e baixo impacto; resistência em ritmo contínuo; força com pesos; resistência com música na minicama elástica).
- **Problema 2, "Quem precisa de quê?":** moradores chegam com objetivo, espaço e materiais:
  - Vovó Zita, dor nos joelhos, tem piscina no clube → **hidroginástica**;
  - Rafa quer ficar mais forte, só tem o próprio corpo → **musculação com o peso do corpo**;
  - Seu Jorge quer melhorar o fôlego, mora perto do parque → **caminhada/corrida**;
  - Bia adora música e quer resistência → **jump**.
  O jogador aplica o método do caderno: **objetivo → espaço/materiais → começar devagar**.
- **Fique ligado:** musculação na adolescência é segura com orientação profissional, carga leve e boa técnica (NPC instrutor corrige um jovem que quer pegar peso demais).
- **Depois:** "Qual ginástica você escolheria para praticar? Por quê?"
- **Recompensa:** Cartões das Ginásticas + Medalha da Academia.

### Região 4: Arena da Organização (Semana 4: *Organizar a aula de ginástica*, EF67EF09P7)
- **Antes:** a turma da arena quer fazer uma aula de 30 minutos, mas está tudo bagunçado: gente se esbarrando e ninguém sabe a ordem.
- **Problema principal (quebra-cabeça de planejamento), em 3 partes:**
  1. **Ordem:** arrastar os blocos para **Aquecimento → Parte principal → Volta à calma**;
  2. **Tempo:** distribuir os minutos para somar **30** com proporções coerentes (ex.: 5 + 20 + 5). O jogo recusa "0 minutos de aquecimento" ou "volta à calma de 1 minuto depois de esforço intenso", explicando por quê;
  3. **Espaço e papéis:** numa planta da quadra vista de cima, colocar as estações sem sobreposição e atribuir NPCs para **anotar, cronometrar e demonstrar**.
- **Execução:** a aula acontece em tempo acelerado com os NPCs animados seguindo o plano. Se o plano tiver erro, aparece a consequência (colisão, gente parada, cansaço) e o jogador ajusta.
- **Fique ligado:** não parar de repente depois de esforço intenso; a frequência cardíaca deve baixar aos poucos.
- **Depois:** "O que funcionou bem na aula planejada? O que você mudaria?"
- **Recompensa:** Cronograma da Aula + Cooperação +2 + Apito Dourado.

### Região 5: Festival da Comunidade (Semana 5: *Movimento e amizade*, EF67EF10P7)
- **Antes:** o festival precisa de um **grupo de movimento** para acontecer.
- **Problema 1, "Entrevista":** conversar com Vó Cida, que participa de um grupo de caminhada há anos, fazendo as 4 perguntas do caderno (que prática faz, onde e quando, há quanto tempo, o que mudou na vida). As respostas vão para o Diário.
- **Problema 2, "Monte o grupo":** recrutar moradores com escolhas de diálogo baseadas nos 3 passos do caderno:
  - escolher uma prática que agrade **muitas pessoas**;
  - combinar **dia, hora e local seguro**;
  - **acolher** quem está começando (o NPC tímido só entra se o jogador escolher a fala acolhedora).
  Falas que excluem ("só entra quem já é bom") fazem moradores irem embora, e o jogador pode tentar de novo.
- **Fique ligado:** projetos gratuitos de atividade física na UBS e na prefeitura (placa e NPC agente de saúde).
- **Depois:** "Que grupo de movimento você gostaria de criar ou participar?"
- **Recompensa:** Medalha da Amizade. O festival acontece (NPCs dançando, comemorando e acenando).

### Desafio Final: O Guardião da Névoa (Ponto de Checagem 1)
No centro da vila, a névoa toma forma. Cada resposta certa dissipa um pedaço:
1. Qual cena mostra um **exercício físico**? (passear com o cachorro / aula planejada / lavar o carro)
2. Uma vantagem da hidroginástica? (**baixo impacto nas articulações**)
3. Ordenar as partes da aula e **explicar a função da volta à calma** (resposta escrita no Diário).

Errar não acaba o jogo: o Guardião mostra uma dica que leva de volta à região correspondente. No final, a vila inteira se movimenta e o aluno recebe o **certificado "Mestre da Vila Ativa"**.

---

## 4. Avaliação e uso pelo professor
- **Diário imprimível:** ao final, a tela "Meu Diário" reúne nome, turma, respostas do "Depois da prática", tabelas registradas (mapa, sensações, plano da aula, entrevista), autoavaliações e acertos de primeira. Pode ser **impresso ou salvo em PDF** pelo navegador e serve de evidência que complementa o caderno.
- **Uso por semana:** modo "Liberar até a Região N" (tecla do professor, como nas Aulas Interativas) para acompanhar o ritmo do trimestre; ou modo livre, jogando tudo em cerca de 60 a 75 minutos.
- **Progresso salvo** no navegador (por nome de aluno), com botão "Começar de novo".
- **A prática corporal continua na quadra:** cada região termina com um "Desafio da vida real" (ex.: "faça a caminhada ativa pela escola"), igual ao "Antes da prática" do caderno.

---

## 5. Uso dos assets da pasta `Assets 3D`

| Pack | Uso no jogo |
|---|---|
| **KayKit Adventurers 2.0** | 5 classes jogáveis e NPCs com cores variadas; acessórios: `mug` (garrafinha), `shield_badge` (medalha), `spellbook` (Diário). Espadas, arcos e machados **não serão usados**. |
| **KayKit Character Animations 1.1** (Rig_Medium) | `Idle`, `Walking`, `Running`, `Jump_*` (movimento); **`Push_Ups`, `Sit_Ups`, `Lie_Down`** (estações de exercício); `Cheering`, `Waving` (festa e diálogos); `Sit_Chair_*`, `Sit_Floor_*` (descanso e volta à calma); `Interact`, `PickUp` (itens); `Dodge_*`, `Crouching` (agachamento e jogos de agilidade); `Hit_A` (tontura, sem violência). |
| **KayKit City Builder Bits** | Ruas, faixa de pedestre (`road_straight_crossing`), prédios, bancos, postes, lixeiras e carros (contexto de segurança no trânsito). |
| **KayKit Forest Nature Pack** | Trilha do Corpo, entorno do lago da hidroginástica, árvores, pedras e grama da praça. |
| **Free 3D Modular Prototyping** | Arena e Academia: pisos, rampas, escadas, cercas, portas, `coin` (XP), `key`, `toggle switch` (portas das regiões). |
| **Free Icon Pack v3.1** | Ícones do HUD e do inventário (coração, energia, maçã, moedas, troféus, jogadores). |
| **JDSherbert Tabletop SFX** | Sons de interface: `Paper Flip` (diário), `Dice Roll` (recompensa), `Piece Move/Impact` (encaixe nos quebra-cabeças), `Deck Deal` (cartões das ginásticas). |

> As pastas extraídas estão aninhadas dentro de `KayKit_Forest_Nature_Pack_1.0_FREE`. Um script vai **copiar só os arquivos usados** para dentro do jogo, sem mexer nos originais. Os PDFs de licença ficam junto, nos créditos (KayKit é CC0).

---

## 6. Arquitetura técnica

**Requisito-chave:** igual às Aulas Interativas, o jogo tem de **abrir com dois cliques, sem internet e sem servidor**. O Chrome bloqueia módulos ES e o carregamento de `.gltf` via `file://`, então:

- **Desenvolvimento:** Vite + Three.js (versão fixada) + `GLTFLoader` + `SkeletonUtils`.
- **Build final:** `vite-plugin-singlefile` gera **um único `index.html`** com JS, modelos (`.glb` em base64), ícones e sons embutidos. Estimativa de 10 a 15 MB, porque os modelos usados são pequenos (personagens com cerca de 350 KB cada e rigs entre 0,7 e 0,8 MB).
- **Animações compartilhadas:** os 5 personagens usam o mesmo esqueleto `Rig_Medium`, então os clipes dos arquivos `Rig_Medium_*.glb` são carregados uma vez e reaproveitados por todos (`AnimationMixer` por personagem).
- **Pensado para os computadores da escola:** low-poly, sombra de uma única luz, `pixelRatio` limitado a 1,5, NPCs fora da tela sem animar, meta de **30 fps em GPU integrada**.

### Estrutura de pastas
```
Jogo_RPG_EF7/
  PLANO_DO_JOGO.md
  package.json, vite.config.js
  scripts/copiar_assets.mjs     # seleciona e converte (.gltf → .glb) só o necessário
  public/assets/{modelos,anims,icones,sons}/
  src/
    main.js                     # boot, loop, troca de cenas
    engine/   render.js · camera.js · input.js · loader.js · anim.js · colisao.js · audio.js · save.js
    rpg/      jogador.js · atributos.js · inventario.js · missoes.js · dialogo.js · diario.js
    mundo/    vila.js · regioes.js · nevoa.js · npcs.js
    minijogos/ classificar.js · estacoes_exercicio.js · ligar_cartoes.js · planejar_aula.js · recrutar.js · checagem.js
    ui/       hud.js · caixa_dialogo.js · telas.js · imprimir_diario.js · estilo.css
    conteudo/ unidade1.js       # TODO o texto pedagógico (missões, falas, respostas, dicas)
  dist/index.html               # jogo final (dois cliques)
```
Como em `Aulas_Interativas_EF/7ano/js/content.js`, **o conteúdo pedagógico fica separado do motor** (`conteudo/unidade1.js`). Assim dá para revisar textos ou criar a Unidade 2 sem mexer no código.

### Controles
WASD/setas ou clique para andar · **E** para interagir · **Tab** para o Diário · **I** para o inventário · **M** para o mapa · **Esc** para o menu. Os minijogos aceitam mouse (arrastar e soltar). Interface toda em português, fonte grande, com opção de aumentar o texto e todas as falas visíveis na tela (sem depender de áudio).

---

## 7. Etapas de desenvolvimento

| Etapa | Entrega | Pronto quando... |
|---|---|---|
| **M0 Base** | Projeto Vite, script de assets, build em arquivo único | `dist/index.html` abre com dois cliques offline e mostra um personagem animado |
| **M1 Motor** | Vila em branco, câmera, movimento, colisão, animações, interação com NPC, caixa de diálogo | dá para andar pela vila e conversar com um NPC |
| **M2 Sistemas de RPG** | Seleção de classe, atributos, XP, inventário, diário, missões, save, névoa por região | uma missão de teste dá XP, item e fica salva ao recarregar |
| **M3 Regiões 1 e 2** | Praça do Bairro + Trilha do Corpo completas | as duas regiões são concluíveis de ponta a ponta |
| **M4 Regiões 3 e 4** | Academia + Arena (quebra-cabeça da aula de 30 min) | o plano errado mostra a consequência; o certo libera a região |
| **M5 Região 5 + Final** | Festival + Guardião da Névoa + certificado | o jogo é zerado e o Diário imprime todas as respostas |
| **M6 Acabamento** | Sons, tutorial, modo professor, acessibilidade, teste em PC fraco | 30 fps no PC da escola; um aluno joga sem ajuda |

**Checagem pedagógica:** cada item do caderno (Aprenda, Veja como, Fique ligado, Atividade, Depois, Como estou?) das semanas 1 a 5 e as 3 questões da Checagem 1 aparecem em pelo menos uma missão. Esse checklist fica em `conteudo/unidade1.js`.

---

## 8. Decisões em aberto (com a sugestão adotada se não houver resposta)
1. **Onde roda:** PCs/notebooks da escola (sugestão) ou também celular (exigiria controles de toque).
2. **Ritmo:** liberação por semana pelo professor **e** modo livre (sugestão: os dois).
3. **Identificação:** só nome e turma digitados, sem login (sugestão).
4. **Integração:** botão no menu das `Aulas_Interativas_EF` levando ao jogo (sugestão: sim, depois do M5).
