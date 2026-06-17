# ★ Star Defender — Docker

Micro jogo arcade (scroller infinito) em HTML5 Canvas, servido por **nginx** em um container.

## Estrutura

```
star-defender/
├─ index.html          # o jogo (arquivo único, sem dependências)
├─ Dockerfile          # imagem nginx:alpine + o jogo
├─ nginx.conf          # config do servidor (gzip, cache, segurança)
├─ docker-compose.yml  # orquestração (porta 8080 -> 80)
└─ .dockerignore
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
