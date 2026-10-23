# A Vila em Movimento

RPG 3D de Educação Física para o 7º ano, feito com three.js. Baseado na Unidade 1, "Ginástica e saúde", do Caderno DED Express EF7.

**Jogar:** https://danhladeia.github.io/vila-em-movimento/

A Névoa da Preguiça cobriu a Vila Ativa. O aluno explora a vila, conversa com os moradores e resolve problemas de Educação Física para afastar a névoa. O jogo tem classes, XP, mochila, missões e um Diário com as respostas do aluno. O progresso fica salvo no navegador.

- Plano pedagógico e etapas: [PLANO_DO_JOGO.md](PLANO_DO_JOGO.md)
- Como usar e editar: [LEIA-ME.txt](LEIA-ME.txt)
- Falas, moradores e missões: [src/conteudo/unidade1.js](src/conteudo/unidade1.js)

Também funciona sem internet: `npm run build` gera um único `dist/index.html`, que abre com dois cliques.

Para atualizar o site depois de mudar algo, rode `npm run publicar`. O comando gera o jogo e o envia para a branch `gh-pages`.

## Créditos

- Modelos 3D: [KayKit](https://kaylousberg.com) (Kay Lousberg), CC0
- Sons: JDSherbert, Tabletop Games SFX Pack
- Ícones: Free Icon Pack v3.1 (Basic), de @gvesster
- Motor 3D: [three.js](https://threejs.org) (MIT)
