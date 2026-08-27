import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Cabecalho, Rodape, EtiquetaStatus } from "@/components/marca";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const lockers = await prisma.locker.findMany({ orderBy: { code: "asc" } });
  const disponiveis = lockers.filter((l) => l.status === "AVAILABLE").length;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <Cabecalho />

      <h1 className="titulo mt-12 text-5xl sm:text-6xl">
        <span className="block text-white">Armários</span>
        <span className="block text-laranja">do IC</span>
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85">
        Tenha um lugar somente seu no Instituto de Computação. Escolha um
        armário disponível, envie seus dados e o comprovante do Pix — a
        reserva é confirmada depois da conferência do pagamento.
      </p>

      {lockers.length > 0 && (
        <p className="mt-6 inline-flex items-center gap-2 bg-laranja px-3 py-1.5 text-sm font-bold text-azul">
          {disponiveis} {disponiveis === 1 ? "armário livre" : "armários livres"}
          <span className="font-medium">de {lockers.length}</span>
        </p>
      )}

      {lockers.length === 0 ? (
        <p className="mt-10 text-sm text-white/70">
          Nenhum armário cadastrado ainda.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto bg-white">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b-2 border-azul">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-azul">
                  Armário
                </th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-azul">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-widest text-azul">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody>
              {lockers.map((locker) => (
                <tr key={locker.id} className="border-b border-azul/10">
                  <td className="codigo px-5 py-3 text-lg text-azul">
                    {locker.code}
                  </td>
                  <td className="px-5 py-3">
                    <EtiquetaStatus status={locker.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    {locker.status === "AVAILABLE" ? (
                      <Link
                        href={`/armario/${locker.id}`}
                        className="inline-block bg-azul px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-laranja hover:text-azul"
                      >
                        Reservar
                      </Link>
                    ) : (
                      <span className="text-sm text-cinza">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Rodape>
        <Link
          href="/admin/login"
          className="text-white/50 transition-colors hover:text-laranja"
        >
          Acesso administrativo
        </Link>
      </Rodape>
    </div>
  );
}
