"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminLogin, type LoginFormState } from "@/lib/actions/admin";

const CAMPO =
  "mt-1.5 block w-full border border-azul/25 bg-white px-3 py-2.5 text-base text-azul outline-none transition-colors focus:border-azul focus:ring-2 focus:ring-laranja";

const ROTULO = "block text-xs font-bold uppercase tracking-widest text-azul";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-laranja px-4 py-3.5 text-sm font-bold uppercase tracking-widest text-azul transition-colors hover:bg-azul hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginFormState, FormData>(
    adminLogin,
    null
  );

  return (
    <form action={formAction} className="mt-8 space-y-5 bg-white p-6">
      {state?.error && (
        <p className="border-l-4 border-laranja bg-laranja/10 p-3 text-sm font-bold text-azul">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="username" className={ROTULO}>
          Usuário
        </label>
        <input
          id="username"
          name="username"
          defaultValue={state?.username ?? ""}
          type="text"
          autoComplete="username"
          required
          className={CAMPO}
        />
      </div>
      <div>
        <label htmlFor="password" className={ROTULO}>
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={CAMPO}
        />
      </div>
      <SubmitButton />
    </form>
  );
}
