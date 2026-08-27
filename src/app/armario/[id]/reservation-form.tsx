"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createReservation,
  type ReservationFormState,
} from "@/lib/actions/reservations";

const CAMPO =
  "mt-1.5 block w-full border border-azul/25 bg-white px-3 py-2.5 text-base text-azul outline-none transition-colors placeholder:text-cinza/60 focus:border-azul focus:ring-2 focus:ring-laranja";

const ROTULO =
  "block text-xs font-bold uppercase tracking-widest text-azul";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p className="mt-1.5 text-sm font-medium text-cinza">{messages[0]}</p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-laranja px-4 py-3.5 text-sm font-bold uppercase tracking-widest text-azul transition-colors hover:bg-azul hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
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
    <form action={formAction} className="mt-8 bg-white p-6 sm:p-8" noValidate>
      <input type="hidden" name="lockerId" value={lockerId} />

      {state?.error && (
        <div className="mb-6 border-l-4 border-laranja bg-laranja/10 p-4">
          <p className="text-sm font-bold text-azul">{state.error}</p>
          <p className="mt-1 text-xs text-cinza">
            Por segurança o navegador não mantém arquivos anexados — selecione
            o comprovante novamente antes de reenviar.
          </p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="name" className={ROTULO}>
            Nome completo
          </label>
          <input
            id="name"
            name="name"
            defaultValue={state?.values?.name ?? ""}
            type="text"
            required
            className={CAMPO}
          />
          <FieldError messages={state?.fieldErrors?.name} />
        </div>

        <div>
          <label htmlFor="rga" className={ROTULO}>
            RGA
          </label>
          <input
            id="rga"
            name="rga"
            defaultValue={state?.values?.rga ?? ""}
            type="text"
            required
            className={CAMPO}
          />
          <FieldError messages={state?.fieldErrors?.rga} />
        </div>

        <div>
          <label htmlFor="phone" className={ROTULO}>
            Telefone
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={state?.values?.phone ?? ""}
            type="tel"
            placeholder="(65) 91234-5678"
            required
            className={CAMPO}
          />
          <FieldError messages={state?.fieldErrors?.phone} />
        </div>

        <div>
          <label htmlFor="email" className={ROTULO}>
            E-mail
          </label>
          <input
            id="email"
            name="email"
            defaultValue={state?.values?.email ?? ""}
            type="email"
            required
            className={CAMPO}
          />
          <FieldError messages={state?.fieldErrors?.email} />
        </div>

        <div>
          <label htmlFor="proof" className={ROTULO}>
            Comprovante do Pix
          </label>
          <input
            id="proof"
            name="proof"
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            required
            className="mt-1.5 block w-full border border-azul/25 bg-white text-base text-azul file:mr-3 file:border-0 file:bg-azul file:px-4 file:py-2.5 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-white hover:file:bg-laranja hover:file:text-azul"
          />
          <p className="mt-1.5 text-xs text-cinza">
            PNG, JPG, WEBP ou PDF, até 5MB.
          </p>
          <FieldError messages={state?.fieldErrors?.proof} />
        </div>

        <div className="border-t border-azul/10 pt-5">
          <div className="flex items-start gap-3">
            <input
              id="termsAccepted"
              name="termsAccepted"
              type="checkbox"
              defaultChecked={state?.values?.termsAccepted ?? false}
              required
              className="mt-0.5 h-5 w-5 shrink-0 accent-laranja"
            />
            <label htmlFor="termsAccepted" className="text-sm text-azul">
              Li e concordo com o{" "}
              <a
                href="/termos"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-laranja underline underline-offset-2 hover:text-azul"
              >
                termo de uso do armário
              </a>
              .
            </label>
          </div>
          <FieldError messages={state?.fieldErrors?.termsAccepted} />
        </div>

        <SubmitButton />
      </div>
    </form>
  );
}
