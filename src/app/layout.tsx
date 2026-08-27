import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

// Fonte de texto oficial do manual: parágrafos, legendas, rótulos e botões.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

/*
 * A fonte de título do manual é a Loubag (Creative Media Lab), de licença
 * comercial — o próprio manual usa uma serifada de peso equivalente como
 * substituta de pré-visualização, e é o que fazemos aqui.
 *
 * Para usar a Loubag de verdade: coloque os arquivos em src/app/fonts/,
 * troque este bloco por `next/font/local` mantendo a variável
 * `--font-display`, e nada mais precisa mudar — todo o site lê essa
 * variável através do token --font-display em globals.css.
 */
const displaySubstituta = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Armários do IC — CACOMP",
  description:
    "Reserve seu armário no Instituto de Computação. Centro Acadêmico de Ciência da Computação da UFMT.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${displaySubstituta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-azul text-white">
        {children}
      </body>
    </html>
  );
}
