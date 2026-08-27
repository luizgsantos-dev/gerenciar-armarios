import Link from "next/link";
import { Cabecalho, Rodape } from "@/components/marca";

/*
 * Página de leitura longa: o manual reserva o fundo branco justamente
 * para esse caso, com o azul no texto.
 */
export default function TermosPage() {
  return (
    <div className="min-h-full flex-1 bg-white">
      <div className="mx-auto w-full max-w-2xl px-6 py-8">
        <Cabecalho sobreClaro />

        <Link
          href="/"
          className="mt-10 inline-block text-sm font-medium text-cinza transition-colors hover:text-laranja"
        >
          &larr; Voltar
        </Link>

        <h1 className="titulo mt-4 text-4xl text-azul sm:text-5xl">
          <span className="block">Termo de uso</span>
          <span className="block text-laranja">dos armários</span>
        </h1>

        <div className="mt-8 border-l-4 border-laranja bg-laranja/10 p-4">
          <p className="text-sm text-azul">
            Este documento é um modelo inicial e deve ser revisado pela
            diretoria do CACOMP antes de ser divulgado oficialmente.
          </p>
        </div>

        <ol className="mt-8 space-y-5 text-base leading-relaxed text-azul">
          {[
            "A reserva do armário é pessoal e intransferível, vinculada ao nome, RGA, telefone e e-mail informados no formulário de cadastro.",
            "A confirmação da reserva está condicionada à análise e aprovação do comprovante de pagamento enviado. Enquanto a análise estiver em andamento, o armário permanece reservado apenas provisoriamente.",
            "Caso o comprovante não seja validado, a reserva será cancelada e o armário voltará a ficar disponível para outros estudantes.",
            "O estudante é responsável pela guarda de seus próprios pertences. O CACOMP e o Instituto de Computação não se responsabilizam por itens deixados no armário.",
            "É proibido armazenar itens perecíveis, inflamáveis, ilícitos ou que representem risco à segurança.",
            "O uso do armário é válido pelo período letivo vigente, podendo ser renovado conforme as regras divulgadas pelo CACOMP.",
            "O descumprimento deste termo pode resultar no cancelamento da reserva, sem direito a reembolso.",
            "Dúvidas sobre pagamento, uso ou liberação do armário devem ser encaminhadas ao CACOMP pelos canais oficiais de contato.",
          ].map((texto, i) => (
            <li key={i} className="flex gap-4">
              <span className="titulo shrink-0 text-lg text-laranja">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{texto}</span>
            </li>
          ))}
        </ol>

        <Rodape sobreClaro>
          <span className="text-cinza">cacomp@aluno.ic.ufmt.br</span>
        </Rodape>
      </div>
    </div>
  );
}
