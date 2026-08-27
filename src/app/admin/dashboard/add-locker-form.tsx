"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { addLocker, type AddLockerState } from "@/lib/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 bg-azul px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-laranja hover:text-azul disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Adicionando..." : "Adicionar"}
    </button>
  );
}

export function AddLockerForm() {
  const [state, formAction] = useActionState<AddLockerState, FormData>(
    addLocker,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <label
        htmlFor="code"
        className="block text-xs font-bold uppercase tracking-widest text-azul"
      >
        Novo armário
      </label>
      <div className="flex gap-2">
        <input
          id="code"
          name="code"
          type="text"
          placeholder="Ex: A-01"
          required
          className="block w-full border border-azul/25 bg-white px-3 py-2.5 text-base text-azul outline-none transition-colors placeholder:text-cinza/60 focus:border-azul focus:ring-2 focus:ring-laranja"
        />
        <SubmitButton />
      </div>
      {state?.error && (
        <p className="text-sm font-medium text-cinza">{state.error}</p>
      )}
    </form>
  );
}
