import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "S1NC - Gestão Patrimonial W1",
  description: "Plataforma de Gestão Financeira Pessoal e Planejamento Patrimonial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="min-h-screen antialiased dark">
      <body>{children}</body>
    </html>
  );
}