# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.3.1] - 2026-06-19

### Alterado
- Os obstáculos passam a ser desenhados como **cometas** (cabeça gelada com
  cauda) no lugar dos tijolos. Apenas o visual mudou — hitbox, HP, destruição a
  tiros e dano ao colidir permanecem idênticos.

## [1.3.0] - 2026-06-19

### Adicionado
- **Armamento progressivo (4 upgrades)**: itens de upgrade que sobem o nível da
  arma (Lv.1→4) — cadência maior, tiro duplo, leque triplo e, no máximo, tiros
  perfurantes/maiores. Surgem com mais frequência conforme o jogo acelera.
- **Item de vida** a cada 2 minutos, concedendo **+2 vidas**.
- HUD mostra o nível atual da arma (`⇧ ARMA Lv.X` / `ARMA MAX`).

### Alterado
- `fire()` agora combina o nível de armamento progressivo com os buffs
  temporários (força/triplo).

## [1.2.1] - 2026-06-19

### Alterado
- Stack passa a publicar nas portas **3550** (web) e **3551** (API), conforme
  o ambiente de implantação.

## [1.2.0] - 2026-06-19

### Adicionado
- **Ranking GLOBAL em tempo real**: backend Node (Server-Sent Events) que
  compartilha a lista de recordes entre todos os jogadores.
- Atualização ao vivo — quando alguém registra um recorde, o placar de todos
  os clientes conectados muda na hora (sem recarregar).
- Indicador de status do placar (`● ao vivo` / `○ offline`).
- API: `GET /api/scores`, `POST /api/scores`, `GET /api/stream` (SSE),
  `GET /api/health`. Persistência em volume Docker.
- `docker-compose` agora sobe dois serviços (web + api) com proxy do nginx.

### Alterado
- O placar passa a refletir o servidor quando online; o `localStorage` vira
  apenas fallback offline.
- Destaque da própria pontuação agora por `id` retornado pelo servidor.

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

[1.3.1]: https://github.com/pauloanzolin/game-star-defender/releases/tag/v1.3.1
[1.3.0]: https://github.com/pauloanzolin/game-star-defender/releases/tag/v1.3.0
[1.2.1]: https://github.com/pauloanzolin/game-star-defender/releases/tag/v1.2.1
[1.2.0]: https://github.com/pauloanzolin/game-star-defender/releases/tag/v1.2.0
[1.1.0]: https://github.com/pauloanzolin/game-star-defender/releases/tag/v1.1.0
[1.0.0]: https://github.com/pauloanzolin/game-star-defender/releases/tag/v1.0.0
