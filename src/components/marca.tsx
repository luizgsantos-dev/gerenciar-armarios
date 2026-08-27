import Link from "next/link";

/*
 * Elementos da identidade visual do CACOMP reutilizados em todas as
 * páginas. Base: Manual de Marca v1.0 (2026).
 */

/**
 * Wordmark "CACOMP".
 *
 * O manual pede o arquivo oficial do símbolo (rede de pessoas + radar) e
 * proíbe recompô-lo a partir de partes soltas — por isso aqui usamos o
 * wordmark isolado, que o próprio manual autoriza para aplicações
 * menores. Para usar o símbolo: peça o SVG à diretoria de comunicação,
 * coloque em public/ e troque este componente por uma <Image />,
 * respeitando a área de proteção (a altura do "C") e o tamanho mínimo
 * de 32px em tela.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`titulo text-xl tracking-wide ${className}`}
      aria-label="CACOMP"
    >
      CACOMP
    </span>
  );
}

/**
 * Tarja de identificação. O manual determina que toda peça leve
 * "Instituto de Computação" no canto superior esquerdo e/ou inferior
 * direito — é o que marca a peça como oficial do IC/CACOMP.
 */
export function Tarja({
  alinhamento = "esquerda",
  tom = "laranja",
}: {
  alinhamento?: "esquerda" | "direita";
  tom?: "laranja" | "azul";
}) {
  return (
    <span
      className={`tarja ${
        tom === "laranja" ? "text-laranja" : "text-azul"
      } ${alinhamento === "direita" ? "text-right" : ""}`}
    >
      Instituto de Computação
    </span>
  );
}

/** Cabeçalho padrão: tarja de identificação + wordmark. */
export function Cabecalho({ sobreClaro = false }: { sobreClaro?: boolean }) {
  return (
    <header
      className={`flex items-center justify-between gap-4 ${
        sobreClaro ? "text-azul" : "text-white"
      }`}
    >
      <Link href="/" className="transition-opacity hover:opacity-80">
        <Wordmark />
      </Link>
      <Tarja tom={sobreClaro ? "azul" : "laranja"} alinhamento="direita" />
    </header>
  );
}

/** Rodapé padrão: fecha a peça com a tarja, como nos posts. */
export function Rodape({
  sobreClaro = false,
  children,
}: {
  sobreClaro?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <footer
      className={`mt-16 flex flex-wrap items-center justify-between gap-3 border-t pt-6 ${
        sobreClaro ? "border-azul/15" : "border-white/20"
      }`}
    >
      <div className="text-xs">{children}</div>
      <Tarja tom={sobreClaro ? "azul" : "laranja"} alinhamento="direita" />
    </footer>
  );
}

/*
 * Status dos armários usando apenas a paleta institucional.
 *
 * O laranja é a cor de ação do manual, então fica com "Disponível" — o
 * único status em que há algo a fazer. O cinza de apoio é descrito no
 * manual justamente para "elementos secundários (ex. armários)", o que
 * cobre bem os estados inativos. As combinações seguem a regra de
 * contraste: texto azul sobre laranja, branco sobre cinza.
 *
 * As etiquetas claras levam borda e preenchimento branco de propósito: as
 * mesmas cores aparecem sobre o azul da lista pública e sobre o branco do
 * painel, e sem o preenchimento elas sumiriam em um dos dois.
 */
const STATUS = {
  AVAILABLE: { rotulo: "Disponível", classe: "bg-laranja text-azul" },
  PENDING: {
    rotulo: "Em análise",
    classe: "bg-white text-azul border border-azul",
  },
  OCCUPIED: { rotulo: "Ocupado", classe: "bg-cinza text-white" },
  BLOCKED: {
    rotulo: "Indisponível",
    classe: "bg-white text-cinza border border-cinza",
  },
} as const;

export type StatusArmario = keyof typeof STATUS;

export function rotuloStatus(status: string) {
  return STATUS[status as StatusArmario]?.rotulo ?? status;
}

export function EtiquetaStatus({ status }: { status: string }) {
  const item = STATUS[status as StatusArmario];
  if (!item) return null;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${item.classe}`}
    >
      {item.rotulo}
    </span>
  );
}
