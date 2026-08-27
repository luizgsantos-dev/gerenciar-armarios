import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { Cabecalho, Rodape } from "@/components/marca";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-8">
      <Cabecalho />

      <h1 className="titulo mt-16 text-4xl">
        <span className="block text-white">Acesso</span>
        <span className="block text-laranja">administrativo</span>
      </h1>

      <p className="mt-4 text-sm text-white/75">
        Área restrita à diretoria do CACOMP.
      </p>

      <LoginForm />

      <Rodape />
    </div>
  );
}
