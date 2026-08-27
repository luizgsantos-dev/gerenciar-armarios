import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponível",
  PENDING: "Em análise",
  OCCUPIED: "Ocupado",
  BLOCKED: "Indisponível",
};

const STATUS_STYLE: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  OCCUPIED: "bg-red-100 text-red-800",
  BLOCKED: "bg-gray-200 text-gray-600",
};

export default async function HomePage() {
  const lockers = await prisma.locker.findMany({
    orderBy: { code: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">
        Armários do bloco
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Escolha um armário disponível para iniciar a reserva. Após o envio do
        formulário e do comprovante de pagamento, o armário fica em análise
        até a confirmação.
      </p>

      {lockers.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">
          Nenhum armário cadastrado ainda.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Armário
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {lockers.map((locker) => (
                <tr key={locker.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {locker.code}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[locker.status]}`}
                    >
                      {STATUS_LABEL[locker.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {locker.status === "AVAILABLE" ? (
                      <Link
                        href={`/armario/${locker.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        Reservar
                      </Link>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 text-xs text-gray-400">
        <Link href="/admin/login" className="hover:text-gray-600">
          Acesso administrativo
        </Link>
      </p>
    </div>
  );
}
