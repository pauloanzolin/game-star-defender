# ★ Star Defender

[![version](https://img.shields.io/badge/version-1.1.0-blue)](CHANGELOG.md)

Micro jogo arcade (scroller infinito) em HTML5 Canvas, servido por **nginx** em um container.

> **v1.1** — ranking competitivo: informe seu nome e dispute a lista de recordes!

## Estrutura

```
star-defender/
├─ index.html          # o jogo (arquivo único, sem dependências)
├─ Dockerfile          # imagem nginx:alpine + o jogo
├─ nginx.conf          # config do servidor (gzip, cache, segurança)
├─ docker-compose.yml  # orquestração (porta 8080 -> 80)
├─ .dockerignore
├─ .gitignore
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

Acesse: **http://localhost:8080**

Parar / remover:

```powershell
docker compose down
```

## Subir só com Docker (sem compose)

```powershell
# build da imagem
docker build -t star-defender:latest .

# rodar o container
docker run -d --name star-defender -p 8080:80 star-defender:latest
```

Parar / remover:

```powershell
docker rm -f star-defender
```

## Notas

- Imagem final fica em torno de ~50 MB (base `nginx:1.27-alpine`).
- O HTML não é cacheado (sempre pega a versão mais recente do jogo).
- Para trocar a porta, ajuste `8080:80` no `docker-compose.yml` ou o `-p` no `docker run`.
- `HEALTHCHECK` configurado: `docker ps` mostra o status `healthy`.

## Versionamento & publicação (DevOps)

Projeto segue **SemVer** e **Conventional Commits**; releases marcadas com **tags anotadas**.

| Versão | Destaque |
|--------|----------|
| v1.0.0 | Lançamento inicial do jogo |
| v1.1.0 | Ranking competitivo (lista de recordes) |

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
