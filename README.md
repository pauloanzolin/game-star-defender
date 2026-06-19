# ★ Star Defender

[![version](https://img.shields.io/badge/version-1.2.0-blue)](CHANGELOG.md)

Micro jogo arcade (scroller infinito) em HTML5 Canvas, com **ranking global em
tempo real**. Empacotado em Docker (nginx + API Node).

> **v1.2** — ranking GLOBAL ao vivo: a lista de recordes é compartilhada entre
> todos os jogadores e atualiza em tempo real (Server-Sent Events).

## Arquitetura

```
Navegador ──HTTP──► nginx (web:80) ──┬─ /        -> index.html (jogo)
                                     └─ /api/*   -> api:3000 (Node + SSE)
                                                     └─ volume sd-scores (JSON)
```

O jogo abre uma conexão **SSE** em `/api/stream`; quando qualquer jogador
registra um recorde (`POST /api/scores`), o servidor transmite o novo ranking
para todos os clientes conectados. Sem servidor acessível, o jogo cai para um
placar local (`localStorage`) e exibe `○ offline`.

## Estrutura

```
star-defender/
├─ index.html          # o jogo (arquivo único, front-end)
├─ Dockerfile          # imagem nginx:alpine + o jogo
├─ nginx.conf          # serve o jogo e faz proxy de /api (SSE-friendly)
├─ docker-compose.yml  # sobe web (nginx) + api (Node) + volume do ranking
├─ server/             # API de ranking global em tempo real
│  ├─ server.js        # Node puro: REST + SSE, persistência em JSON
│  ├─ package.json
│  └─ Dockerfile
├─ .dockerignore / .gitignore
├─ VERSION             # versão atual (SemVer)
├─ CHANGELOG.md        # histórico de versões
└─ scripts/
   └─ release-v1.1.ps1 # automatiza branch + commit + tag + push
```

> `index.html` é a cópia "implantável". Se editar o jogo em `../arcade-game.html`,
> copie de novo: `Copy-Item ..\arcade-game.html .\index.html -Force`

## Subir com Docker Compose (recomendado)

```powershell
docker compose up -d --build
```

Acesse: **http://localhost:3550** (API direta em http://localhost:3551)

Parar / remover:

```powershell
docker compose down
```

## Subir só com Docker (sem compose)

> ⚠️ O **ranking global em tempo real** depende da API (`server/`). Apenas o
> container `web` faz o jogo funcionar, mas o placar fica em modo offline
> (local). Para o ranking compartilhado, use o **docker compose** acima.

```powershell
# build da imagem (apenas o front-end / jogo)
docker build -t star-defender:latest .

# rodar o container
docker run -d --name star-defender -p 3550:80 star-defender:latest
```

Parar / remover:

```powershell
docker rm -f star-defender
```

## Notas

- Imagem final fica em torno de ~50 MB (base `nginx:1.27-alpine`).
- O HTML não é cacheado (sempre pega a versão mais recente do jogo).
- Portas: **web em 3550**, **API em 3551** (ajuste em `docker-compose.yml`).
- `HEALTHCHECK` configurado: `docker ps` mostra o status `healthy`.

## Versionamento & publicação (DevOps)

Projeto segue **SemVer** e **Conventional Commits**; releases marcadas com **tags anotadas**.

| Versão | Destaque |
|--------|----------|
| v1.0.0 | Lançamento inicial do jogo |
| v1.1.0 | Ranking competitivo (lista de recordes local) |
| v1.2.0 | Ranking global em tempo real (backend Node + SSE) |

### Publicar a v1.1 no GitHub

Pré-requisitos: `git` instalado e autenticado no GitHub (ex.: `gh auth login`).

**Opção A — script automatizado:**

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\release-v1.1.ps1
```

**Opção B — passo a passo manual:**

```powershell
# repo + remote
git init
git branch -M main
git remote add origin https://github.com/pauloanzolin/game-star-defender.git
git fetch origin                       # traz a v1.0 existente (se houver)

# branch de feature
git checkout -b feature/ranking-competitivo

# commit semântico
git add -A
git commit -m "feat: ranking competitivo com lista de recordes persistente (v1.1.0)"

# publica a branch e abre PR para main (no GitHub)
git push -u origin feature/ranking-competitivo

# após o merge na main: tag anotada da release
git checkout main && git pull
git tag -a v1.1.0 -m "Star Defender 1.1.0 - ranking competitivo"
git push origin v1.1.0
```

Por fim, crie a **Release** no GitHub a partir da tag `v1.1.0`, usando o trecho
correspondente do [CHANGELOG.md](CHANGELOG.md) como descrição.
