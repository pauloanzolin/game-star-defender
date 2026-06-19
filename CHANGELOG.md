# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2026-06-19

### Adicionado
- **Ranking competitivo**: o jogador informa o nome e cada partida grava a
  pontuação numa lista persistente (localStorage).
- **Lista de recordes** exibida do maior para o menor — quem fez mais pontos
  fica no topo. Mostra as 10 melhores marcas, destaca o líder e a sua entrada.
- Mensagem de posição no fim de jogo ("Você ficou em Xº lugar" / "NOVO LÍDER!").
- Campo de nome com persistência da última identidade usada e atalho **Enter**
  para iniciar.

### Alterado
- Tela de fim de jogo reformulada para mostrar pontuação, nível e ranking.
- "Recorde" agora deriva do topo da lista de pontuações.

## [1.0.0] - 2026-06-XX

### Adicionado
- Jogo arcade scroller infinito (Star Defender) em HTML5 Canvas.
- Movimento nos 4 sentidos (setas / WASD) e tiro.
- Cenário em rolagem contínua com dificuldade crescente por tempo.
- Sistema de dano: 2 batidas explodem a nave e custam 1 vida.
- Obstáculos quebráveis (tijolos) que surgem e ficam para trás.
- Meteoros indestrutíveis (apenas desviáveis).
- Power-ups temporários (30s): escudo, força (tiro perfurante) e tiro triplo.
- Empacotamento Docker (nginx) com docker-compose.

[1.1.0]: https://github.com/pauloanzolin/game-star-defender/releases/tag/v1.1.0
[1.0.0]: https://github.com/pauloanzolin/game-star-defender/releases/tag/v1.0.0
