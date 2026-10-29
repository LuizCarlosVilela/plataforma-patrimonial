"use client";

import { ReactNode } from "react";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { TopHeader } from "@/components/layout/top-header";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-4 max-w-md mx-auto w-full">
        <TopHeader userName="João Silva" userRole="CLIENT" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6 pb-28">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}