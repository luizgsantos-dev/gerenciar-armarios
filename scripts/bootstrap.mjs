/**
 * Prepara o banco para uso: garante que exista um usuário admin e,
 * opcionalmente, cria armários de exemplo.
 *
 * Roda tanto no desenvolvimento (`npm run db:seed`) quanto no start do
 * container (ver docker-entrypoint.sh). É idempotente: pode rodar a cada
 * inicialização sem duplicar dados nem redefinir a senha do admin.
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isTruthy(value) {
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

async function ensureAdminUser() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Defina ADMIN_USERNAME e ADMIN_PASSWORD no ambiente antes de rodar o bootstrap."
    );
  }

  const existing = await prisma.adminUser.findUnique({ where: { username } });

  if (!existing) {
    await prisma.adminUser.create({
      data: { username, passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log(`[bootstrap] Usuário admin "${username}" criado.`);
    return;
  }

  if (isTruthy(process.env.ADMIN_FORCE_PASSWORD_RESET)) {
    await prisma.adminUser.update({
      where: { username },
      data: { passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log(`[bootstrap] Senha do admin "${username}" redefinida.`);
    return;
  }

  console.log(
    `[bootstrap] Usuário admin "${username}" já existe (senha preservada).`
  );
}

async function maybeSeedExampleLockers() {
  if (!isTruthy(process.env.SEED_EXAMPLE_LOCKERS)) return;

  const existing = await prisma.locker.count();
  if (existing > 0) {
    console.log("[bootstrap] Armários já cadastrados, seed ignorado.");
    return;
  }

  const total = Number(process.env.SEED_LOCKER_COUNT ?? 20);
  const codes = Array.from(
    { length: total },
    (_, i) => `A-${String(i + 1).padStart(2, "0")}`
  );
  await prisma.locker.createMany({ data: codes.map((code) => ({ code })) });
  console.log(`[bootstrap] ${codes.length} armários de exemplo criados.`);
}

try {
  await ensureAdminUser();
  await maybeSeedExampleLockers();
} catch (err) {
  console.error("[bootstrap] Falhou:", err);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
