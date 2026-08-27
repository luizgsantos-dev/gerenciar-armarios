import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReservationForm } from "./reservation-form";

export const dynamic = "force-dynamic";

export default async function ArmarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locker = await prisma.locker.findUnique({ where: { id } });

  if (!locker) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
        &larr; Voltar para a lista de armários
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-gray-900">
        Reserva do armário {locker.code}
      </h1>

      {locker.status !== "AVAILABLE" ? (
        <p className="mt-6 rounded-md bg-yellow-50 p-4 text-sm text-yellow-800">
          Este armário não está mais disponível. Volte à lista e escolha
          outro.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-gray-600">
            Preencha seus dados, confirme a leitura do termo de uso e anexe o
            comprovante de pagamento do Pix para concluir a reserva.
          </p>
          <ReservationForm lockerId={locker.id} />
        </>
      )}
    </div>
  );
}
