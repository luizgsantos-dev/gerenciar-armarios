import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  adminLogout,
  approveReservation,
  rejectReservation,
  releaseLocker,
  setLockerBlocked,
} from "@/lib/actions/admin";
import { Cabecalho, Rodape, EtiquetaStatus, rotuloStatus } from "@/components/marca";
import { AddLockerForm } from "./add-locker-form";

export const dynamic = "force-dynamic";

const RESERVA = {
  PENDING: { rotulo: "Em análise", classe: "bg-white text-azul border border-azul/30" },
  APPROVED: { rotulo: "Aprovada", classe: "bg-laranja text-azul" },
  REJEITADA: { rotulo: "Rejeitada", classe: "bg-cinza text-white" },
} as const;

function EtiquetaReserva({ status }: { status: string }) {
  const item =
    status === "REJECTED"
      ? RESERVA.REJEITADA
      : RESERVA[status as "PENDING" | "APPROVED"];
  if (!item) return null;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${item.classe}`}
    >
      {item.rotulo}
    </span>
  );
}

const TH =
  "px-3 py-3 text-left text-xs font-bold uppercase tracking-widest text-azul";

/*
 * Painel de leitura densa: fundo branco com texto azul, a combinação que
 * o manual reserva para páginas de leitura longa e documentos formais.
 */
export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [reservations, lockers] = await Promise.all([
    prisma.reservation.findMany({
      include: { locker: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.locker.findMany({ orderBy: { code: "asc" } }),
  ]);

  const pendentes = reservations.filter((r) => r.status === "PENDING").length;

  return (
    <div className="min-h-full flex-1 bg-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <Cabecalho sobreClaro />

        <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="titulo text-4xl text-azul">
              <span className="block">Painel</span>
              <span className="block text-laranja">administrativo</span>
            </h1>
            <p className="mt-3 text-sm text-cinza">
              Sessão de {session.username}
            </p>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="border border-azul px-4 py-2 text-xs font-bold uppercase tracking-widest text-azul transition-colors hover:bg-azul hover:text-white"
            >
              Sair
            </button>
          </form>
        </div>

        <section className="mt-12">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="titulo text-2xl text-azul">Reservas</h2>
            {pendentes > 0 && (
              <span className="bg-laranja px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-azul">
                {pendentes} aguardando análise
              </span>
            )}
          </div>

          <div className="mt-4 overflow-x-auto border border-azul/15">
            <table className="min-w-full text-sm">
              <thead className="border-b-2 border-azul">
                <tr>
                  <th className={TH}>Armário</th>
                  <th className={TH}>Nome</th>
                  <th className={TH}>RGA</th>
                  <th className={TH}>Contato</th>
                  <th className={TH}>Comprovante</th>
                  <th className={TH}>Status</th>
                  <th className={`${TH} text-right`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-b border-azul/10 align-top"
                  >
                    <td className="codigo px-3 py-3 text-base text-azul">
                      {reservation.locker.code}
                    </td>
                    <td className="px-3 py-3 text-azul">{reservation.name}</td>
                    <td className="px-3 py-3 text-azul">{reservation.rga}</td>
                    <td className="px-3 py-3 text-azul">
                      <div>{reservation.phone}</div>
                      <div className="text-xs text-cinza">
                        {reservation.email}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <a
                        href={`/api/admin/proof/${reservation.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-laranja underline underline-offset-2 hover:text-azul"
                      >
                        Ver arquivo
                      </a>
                    </td>
                    <td className="px-3 py-3">
                      <EtiquetaReserva status={reservation.status} />
                    </td>
                    <td className="px-3 py-3 text-right">
                      {reservation.status === "PENDING" && (
                        <div className="flex justify-end gap-2">
                          <form
                            action={approveReservation.bind(
                              null,
                              reservation.id
                            )}
                          >
                            <button
                              type="submit"
                              className="bg-laranja px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-azul transition-colors hover:bg-azul hover:text-white"
                            >
                              Aprovar
                            </button>
                          </form>
                          <form
                            action={rejectReservation.bind(
                              null,
                              reservation.id
                            )}
                          >
                            <button
                              type="submit"
                              className="border border-cinza px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-cinza transition-colors hover:bg-cinza hover:text-white"
                            >
                              Rejeitar
                            </button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-8 text-center text-cinza"
                    >
                      Nenhuma reserva enviada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="titulo text-2xl text-azul">Armários</h2>

          <div className="mt-4 overflow-x-auto border border-azul/15">
            <table className="min-w-full text-sm">
              <thead className="border-b-2 border-azul">
                <tr>
                  <th className={TH}>Código</th>
                  <th className={TH}>Status</th>
                  <th className={`${TH} text-right`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {lockers.map((locker) => (
                  <tr key={locker.id} className="border-b border-azul/10">
                    <td className="codigo px-3 py-3 text-base text-azul">
                      {locker.code}
                    </td>
                    <td className="px-3 py-3">
                      <EtiquetaStatus status={locker.status} />
                      <span className="sr-only">
                        {rotuloStatus(locker.status)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {(locker.status === "AVAILABLE" ||
                          locker.status === "BLOCKED") && (
                          <form
                            action={setLockerBlocked.bind(
                              null,
                              locker.id,
                              locker.status === "AVAILABLE"
                            )}
                          >
                            <button
                              type="submit"
                              className="border border-azul px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-azul transition-colors hover:bg-azul hover:text-white"
                            >
                              {locker.status === "AVAILABLE"
                                ? "Bloquear"
                                : "Desbloquear"}
                            </button>
                          </form>
                        )}
                        {locker.status === "OCCUPIED" && (
                          <form action={releaseLocker.bind(null, locker.id)}>
                            <button
                              type="submit"
                              className="border border-azul px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-azul transition-colors hover:bg-azul hover:text-white"
                            >
                              Liberar
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 max-w-sm">
            <AddLockerForm />
          </div>
        </section>

        <Rodape sobreClaro />
      </div>
    </div>
  );
}
