#!/bin/sh
set -e

if [ -z "$AUTH_SECRET" ]; then
  echo "ERRO: AUTH_SECRET não definido. Gere um valor forte e passe pelo ambiente." >&2
  exit 1
fi

echo "[entrypoint] Aplicando migrations em $DATABASE_URL"
node /opt/prisma-cli/node_modules/prisma/build/index.js migrate deploy

echo "[entrypoint] Verificando usuário admin e dados iniciais"
node scripts/bootstrap.mjs

echo "[entrypoint] Iniciando aplicação"
exec "$@"
