# ── Star Defender — imagem estática servida por nginx ───────────────
# Imagem leve e oficial. Tag fixa para builds reproduzíveis.
FROM nginx:1.27-alpine

# Metadados (opcional, útil em registries)
LABEL org.opencontainers.image.title="Star Defender" \
      org.opencontainers.image.description="Micro arcade (scroller) em HTML5 Canvas" \
      org.opencontainers.image.source="https://example.com/star-defender"

# Configuração customizada do nginx (gzip, cache, SPA-friendly)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# O jogo (arquivo único). Servido como página inicial.
COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80

# Verifica se o nginx está respondendo
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

# nginx:alpine já define o CMD correto (nginx -g 'daemon off;')
