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
import { AddLockerForm } from "./add-locker-form";

export const dynamic = "force-dynamic";

const RESERVATION_STATUS_LABEL: Record<string, string> = {
  PENDING: "Em análise",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};

const RESERVATION_STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const LOCKER_STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponível",
  PENDING: "Em análise",
  OCCUPIED: "Ocupado",
  BLOCKED: "Indisponível",
};

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Painel administrativo
          </h1>
          <p className="text-sm text-gray-600">
            Sessão de {session.username}
          </p>
        </div>
        <form action={adminLogout}>
          <button
            type="submit"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sair
          </button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">Reservas</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-500">
                  Armário
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">
                  Nome
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">
                  RGA
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">
                  Contato
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">
                  Comprovante
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {reservation.locker.code}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {reservation.name}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {reservation.rga}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    <div>{reservation.phone}</div>
                    <div className="text-xs text-gray-500">
                      {reservation.email}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <a
                      href={`/api/admin/proof/${reservation.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      Ver arquivo
                    </a>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${RESERVATION_STATUS_STYLE[reservation.status]}`}
                    >
                      {RESERVATION_STATUS_LABEL[reservation.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
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
                            className="rounded-md bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700"
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
                            className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
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
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Nenhuma reserva enviada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">Armários</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-500">
                  Código
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {lockers.map((locker) => (
                <tr key={locker.id}>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {locker.code}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {LOCKER_STATUS_LABEL[locker.status]}
                  </td>
                  <td className="px-3 py-2 text-right">
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
                            className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
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
                            className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
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

        <div className="mt-4 max-w-xs">
          <AddLockerForm />
        </div>
      </section>
    </div>
  );
}
