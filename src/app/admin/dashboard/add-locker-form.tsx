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
      className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
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
        className="block text-sm font-medium text-gray-700"
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
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <SubmitButton />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
