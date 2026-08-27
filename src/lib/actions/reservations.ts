"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validation";
import { deleteProofFile, saveProofFile } from "@/lib/uploads";

/**
 * Valores já digitados, devolvidos junto com os erros.
 *
 * O React limpa os campos não controlados assim que a action retorna, então
 * sem isso a pessoa perderia tudo que preencheu a cada erro de validação.
 * O anexo é a exceção: por segurança o navegador não permite repopular um
 * input de arquivo, e o formulário avisa que ele precisa ser reenviado.
 */
export type ReservationFormValues = {
  name: string;
  rga: string;
  phone: string;
  email: string;
  termsAccepted: boolean;
};

export type ReservationFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: ReservationFormValues;
} | null;

function readValues(formData: FormData): ReservationFormValues {
  const text = (key: string) => String(formData.get(key) ?? "");
  return {
    name: text("name"),
    rga: text("rga"),
    phone: text("phone"),
    email: text("email"),
    termsAccepted: formData.get("termsAccepted") === "on",
  };
}

export async function createReservation(
  _prevState: ReservationFormState,
  formData: FormData
): Promise<ReservationFormState> {
  const values = readValues(formData);

  const parsed = reservationSchema.safeParse({
    lockerId: formData.get("lockerId"),
    name: formData.get("name"),
    rga: formData.get("rga"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    termsAccepted: formData.get("termsAccepted"),
    proof: formData.get("proof"),
  });

  if (!parsed.success) {
    return {
      error: "Verifique os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
      values,
    };
  }

  const { lockerId, name, rga, phone, email, proof } = parsed.data;

  const locker = await prisma.locker.findUnique({ where: { id: lockerId } });
  if (!locker) {
    return { error: "Armário não encontrado.", values };
  }
  if (locker.status !== "AVAILABLE") {
    return {
      error:
        "Este armário não está mais disponível. Volte à lista e escolha outro.",
      values,
    };
  }

  const { storedName, originalName } = await saveProofFile(proof);

  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.locker.updateMany({
        where: { id: lockerId, status: "AVAILABLE" },
        data: { status: "PENDING" },
      });

      if (updated.count === 0) {
        throw new Error("LOCKER_TAKEN");
      }

      await tx.reservation.create({
        data: {
          lockerId,
          name,
          rga,
          phone,
          email,
          termsAccepted: true,
          proofFileName: originalName,
          proofPath: storedName,
          status: "PENDING",
        },
      });
    });
  } catch (err) {
    // A reserva não foi criada: não deixe o comprovante órfão no disco.
    await deleteProofFile(storedName);

    if (err instanceof Error && err.message === "LOCKER_TAKEN") {
      return {
        error:
          "Este armário acabou de ser reservado por outra pessoa. Escolha outro na lista.",
        values,
      };
    }
    throw err;
  }

  redirect(`/armario/${lockerId}/sucesso`);
}
