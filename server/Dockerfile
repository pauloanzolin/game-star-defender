# ── Star Defender — API de ranking (Node + SSE) ─────────────────────
FROM node:20-alpine

WORKDIR /app

# Sem dependências externas — copiamos apenas o necessário
COPY package.json ./
COPY server.js ./

# Diretório de dados (persistido via volume no docker-compose)
RUN mkdir -p /app/data
ENV DATA_DIR=/app/data
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
