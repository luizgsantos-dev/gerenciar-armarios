"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema, lockerCodeSchema } from "@/lib/validation";
import {
  createAdminSessionToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  getAdminSession,
} from "@/lib/auth";

export type LoginFormState = { error?: string; username?: string } | null;

export async function adminLogin(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  // O username volta junto com o erro: o React limpa os campos assim que a
  // action retorna, e obrigar a redigitar o usuário a cada senha errada é
  // desnecessário.
  const username = String(formData.get("username") ?? "");

  if (!parsed.success) {
    return { error: "Preencha usuário e senha.", username };
  }

  const user = await prisma.adminUser.findUnique({
    where: { username: parsed.data.username },
  });

  if (!user) {
    return { error: "Usuário ou senha inválidos.", username };
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { error: "Usuário ou senha inválidos.", username };
  }

  const token = await createAdminSessionToken({
    sub: user.id,
    username: user.username,
  });
  await setAdminSessionCookie(token);
  redirect("/admin/dashboard");
}

export async function adminLogout() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function approveReservation(reservationId: string) {
  await requireAdmin();

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation) return;

  await prisma.$transaction([
    prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "APPROVED" },
    }),
    prisma.locker.update({
      where: { id: reservation.lockerId },
      data: { status: "OCCUPIED" },
    }),
  ]);

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function rejectReservation(reservationId: string) {
  await requireAdmin();

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation) return;

  await prisma.$transaction([
    prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "REJECTED" },
    }),
    prisma.locker.update({
      where: { id: reservation.lockerId },
      data: { status: "AVAILABLE" },
    }),
  ]);

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function releaseLocker(lockerId: string) {
  await requireAdmin();
  await prisma.locker.update({
    where: { id: lockerId },
    data: { status: "AVAILABLE" },
  });
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function setLockerBlocked(lockerId: string, blocked: boolean) {
  await requireAdmin();
  const locker = await prisma.locker.findUnique({ where: { id: lockerId } });
  if (!locker) return;
  if (locker.status !== "AVAILABLE" && locker.status !== "BLOCKED") {
    return;
  }
  await prisma.locker.update({
    where: { id: lockerId },
    data: { status: blocked ? "BLOCKED" : "AVAILABLE" },
  });
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export type AddLockerState = { error?: string; ok?: boolean } | null;

export async function addLocker(
  _prevState: AddLockerState,
  formData: FormData
): Promise<AddLockerState> {
  await requireAdmin();

  const parsed = lockerCodeSchema.safeParse(formData.get("code"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Código inválido." };
  }

  const existing = await prisma.locker.findUnique({
    where: { code: parsed.data },
  });
  if (existing) {
    return { error: "Já existe um armário com esse código." };
  }

  await prisma.locker.create({ data: { code: parsed.data } });
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  // Objeto novo a cada sucesso: o formulário depende da mudança de
  // referência para saber que deve limpar o campo.
  return { ok: true };
}
