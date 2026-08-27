"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createReservation,
  type ReservationFormState,
} from "@/lib/actions/reservations";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return <p className="mt-1 text-sm text-red-600">{messages[0]}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Enviando..." : "Enviar reserva"}
    </button>
  );
}

export function ReservationForm({ lockerId }: { lockerId: string }) {
  const [state, formAction] = useActionState<ReservationFormState, FormData>(
    createReservation,
    null
  );

  return (
    <form action={formAction} className="mt-6 space-y-5" noValidate>
      <input type="hidden" name="lockerId" value={lockerId} />

      {state?.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          <p>{state.error}</p>
          <p className="mt-1 text-xs">
            Por segurança o navegador não mantém arquivos anexados — selecione
            o comprovante novamente antes de reenviar.
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          defaultValue={state?.values?.name ?? ""}
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <FieldError messages={state?.fieldErrors?.name} />
      </div>

      <div>
        <label
          htmlFor="rga"
          className="block text-sm font-medium text-gray-700"
        >
          RGA
        </label>
        <input
          id="rga"
          name="rga"
          defaultValue={state?.values?.rga ?? ""}
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <FieldError messages={state?.fieldErrors?.rga} />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Telefone
        </label>
        <input
          id="phone"
          name="phone"
          defaultValue={state?.values?.phone ?? ""}
          type="tel"
          placeholder="(11) 91234-5678"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <FieldError messages={state?.fieldErrors?.phone} />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          E-mail
        </label>
        <input
          id="email"
          name="email"
          defaultValue={state?.values?.email ?? ""}
          type="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <FieldError messages={state?.fieldErrors?.email} />
      </div>

      <div>
        <label
          htmlFor="proof"
          className="block text-sm font-medium text-gray-700"
        >
          Comprovante de pagamento (Pix)
        </label>
        <input
          id="proof"
          name="proof"
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          required
          className="mt-1 block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
        />
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, WEBP ou PDF, até 5MB.
        </p>
        <FieldError messages={state?.fieldErrors?.proof} />
      </div>

      <div className="flex items-start gap-2">
        <input
          id="termsAccepted"
          name="termsAccepted"
          type="checkbox"
          defaultChecked={state?.values?.termsAccepted ?? false}
          required
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="termsAccepted" className="text-sm text-gray-700">
          Li e concordo com o{" "}
          <a
            href="/termos"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            termo de uso do armário
          </a>
          .
        </label>
      </div>
      <FieldError messages={state?.fieldErrors?.termsAccepted} />

      <SubmitButton />
    </form>
  );
}
