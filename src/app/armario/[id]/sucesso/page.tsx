import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SucessoPage({
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
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">
        Reserva enviada!
      </h1>
      <p className="mt-3 text-sm text-gray-600">
        Recebemos seus dados e o comprovante para o armário{" "}
        <strong>{locker.code}</strong>. Ele ficará marcado como &ldquo;em
        análise&rdquo; até a confirmação do pagamento pela administração. Você
        será contatado pelo e-mail ou telefone informado.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        Voltar para a lista de armários
      </Link>
    </div>
  );
}
