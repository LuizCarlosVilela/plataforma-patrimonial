import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Origin — Liberdade é fruto de estrutura",
  description: "Diagnóstico patrimonial em 3 minutos para empresários R$100k+/mês. Descubra onde seu patrimônio está travado e como transformar faturamento em liberdade.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} h-full antialiased`}
      style={{ backgroundColor: "#16171B" }}
    >
      <body className="min-h-full flex flex-col bg-[#16171B] text-[#efeae0]">{children}</body>
    </html>
  );
}
