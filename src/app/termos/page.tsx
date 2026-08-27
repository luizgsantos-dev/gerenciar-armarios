import Link from "next/link";

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
        &larr; Voltar
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-gray-900">
        Termo de uso dos armários do bloco
      </h1>

      <div className="prose prose-sm mt-6 max-w-none text-gray-700">
        <p>
          Este documento é um modelo inicial e deve ser revisado e ajustado
          pela administração do bloco antes de ser divulgado oficialmente.
        </p>

        <ol className="list-decimal space-y-3 pl-5">
          <li>
            A reserva do armário é pessoal e intransferível, vinculada ao
            nome, RGA, telefone e e-mail informados no formulário de
            cadastro.
          </li>
          <li>
            A confirmação da reserva está condicionada à análise e aprovação
            do comprovante de pagamento enviado. Enquanto a análise estiver
            em andamento, o armário permanece reservado apenas
            provisoriamente.
          </li>
          <li>
            Caso o comprovante não seja validado, a reserva será cancelada e
            o armário voltará a ficar disponível para outras pessoas.
          </li>
          <li>
            O usuário é responsável pela guarda de seus próprios pertences.
            O bloco não se responsabiliza por itens deixados no armário.
          </li>
          <li>
            É proibido o armazenamento de itens perecíveis, inflamáveis,
            ilícitos ou que representem risco à segurança.
          </li>
          <li>
            O uso do armário é válido pelo período letivo vigente, podendo
            ser renovado conforme regras divulgadas pela administração.
          </li>
          <li>
            O descumprimento deste termo pode resultar no cancelamento da
            reserva, sem direito a reembolso.
          </li>
          <li>
            Dúvidas sobre pagamento, uso ou liberação do armário devem ser
            encaminhadas à administração do bloco pelos canais oficiais de
            contato.
          </li>
        </ol>
      </div>
    </div>
  );
}
