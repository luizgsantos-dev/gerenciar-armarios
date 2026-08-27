import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-semibold text-gray-900">
        Acesso administrativo
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Área restrita para gestão dos armários do bloco.
      </p>
      <LoginForm />
    </div>
  );
}
