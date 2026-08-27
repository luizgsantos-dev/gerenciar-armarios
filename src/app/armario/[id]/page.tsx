import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Cabecalho, Rodape } from "@/components/marca";
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
    <div className="mx-auto w-full max-w-2xl px-6 py-8">
      <Cabecalho />

      <Link
        href="/"
        className="mt-10 inline-block text-sm font-medium text-white/70 transition-colors hover:text-laranja"
      >
        &larr; Voltar para a lista
      </Link>

      <h1 className="titulo mt-4 text-4xl sm:text-5xl">
        <span className="block text-white">Garanta o armário</span>
        <span className="block text-laranja">{locker.code}</span>
      </h1>

      {locker.status !== "AVAILABLE" ? (
        <div className="mt-8 border-l-4 border-laranja bg-white p-5">
          <p className="text-sm text-azul">
            Este armário não está mais disponível. Volte à lista e escolha
            outro.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-5 text-base leading-relaxed text-white/85">
            Preencha seus dados, confirme a leitura do termo de uso e anexe o
            comprovante do Pix para concluir a reserva.
          </p>
          <ReservationForm lockerId={locker.id} />
        </>
      )}

      <Rodape />
    </div>
  );
}
