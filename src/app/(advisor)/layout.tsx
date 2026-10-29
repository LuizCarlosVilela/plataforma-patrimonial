"use client";

import { ReactNode } from "react";
import { TopHeader } from "@/components/layout/top-header";

interface AdvisorLayoutProps {
  children: ReactNode;
}

export default function AdvisorLayout({ children }: AdvisorLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-4 max-w-5xl mx-auto w-full">
        <TopHeader userName="Guilherme Consultor" userRole="ADVISOR" showMobileMenu={false} />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}