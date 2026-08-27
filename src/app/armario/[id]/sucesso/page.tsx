import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Cabecalho, Rodape } from "@/components/marca";

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
    <div className="mx-auto w-full max-w-2xl px-6 py-8">
      <Cabecalho />

      <h1 className="titulo mt-16 text-4xl sm:text-5xl">
        <span className="block text-white">Reserva</span>
        <span className="block text-laranja">enviada</span>
      </h1>

      <div className="mt-8 bg-white p-6 sm:p-8">
        <p className="text-base leading-relaxed text-azul">
          Recebemos seus dados e o comprovante do armário{" "}
          <strong className="codigo">{locker.code}</strong>. Ele fica
          em análise até a conferência do pagamento, e você será avisado pelo
          e-mail ou telefone informado.
        </p>
        <p className="mt-4 text-sm text-cinza">
          Dúvidas? Fale com o CACOMP pelo e-mail cacomp@aluno.ic.ufmt.br ou
          pelo @cacompufmt.
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 inline-block bg-laranja px-6 py-3 text-sm font-bold uppercase tracking-widest text-azul transition-colors hover:bg-white"
      >
        Voltar para a lista
      </Link>

      <Rodape />
    </div>
  );
}
