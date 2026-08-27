# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Base — Debian slim (OpenSSL 3), que casa com o binaryTarget
# "debian-openssl-3.0.x" declarado em prisma/schema.prisma.
# ---------------------------------------------------------------------------
FROM node:22-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------------------------
# Dependências
# ---------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
# --ignore-scripts pula o postinstall (prisma generate); geramos no builder,
# depois que o schema já está no lugar.
RUN npm ci --ignore-scripts

# ---------------------------------------------------------------------------
# CLI do Prisma, isolado
#
# O runtime precisa do CLI para aplicar migrations no start, mas a saída
# standalone do Next só inclui o que o código da aplicação importa — o CLI
# e suas dependências transitivas ficam de fora. Instalamos numa árvore
# própria, que é copiada inteira para a imagem final.
# ---------------------------------------------------------------------------
FROM base AS prisma-cli
WORKDIR /opt/prisma-cli
COPY package.json ./source-package.json
RUN PRISMA_VERSION="$(node -p "require('./source-package.json').dependencies.prisma")" \
  && rm source-package.json \
  && npm init -y > /dev/null \
  && npm install --no-audit --no-fund --foreground-scripts "prisma@${PRISMA_VERSION}" \
  && node node_modules/prisma/build/index.js --version

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
# O build não acessa o banco, mas o Next avalia next.config.ts e as rotas;
# um DATABASE_URL qualquer basta para satisfazer o Prisma Client.
ENV DATABASE_URL="file:/tmp/build.db"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Banco e uploads ficam em volumes, fora da imagem.
ENV DATABASE_URL="file:/app/data/app.db"

# Saída standalone do Next (server.js + node_modules já reduzido).
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Prisma Client gerado (inclui o query engine para debian-openssl-3.0.x).
COPY --from=builder --chown=node:node /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma

# bcryptjs é usado pelo scripts/bootstrap.mjs, que roda fora do bundle do
# Next — o trace do standalone embute a lib no server e não a deixa em
# node_modules, então copiamos explicitamente (não tem dependências).
COPY --from=builder --chown=node:node /app/node_modules/bcryptjs ./node_modules/bcryptjs

# Schema + migrations, aplicados no start; e o CLI isolado que os aplica.
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/scripts ./scripts
COPY --from=prisma-cli --chown=node:node /opt/prisma-cli /opt/prisma-cli

COPY --chown=node:node docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Criados com dono `node` para que volumes nomeados herdem a permissão certa.
RUN mkdir -p /app/data /app/uploads/comprovantes && chown -R node:node /app/data /app/uploads

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
