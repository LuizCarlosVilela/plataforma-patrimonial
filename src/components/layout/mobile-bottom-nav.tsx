"use client";

import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { TrendingUp, ArrowUpRight, ShieldCheck, CreditCard, Target, Users } from "lucide-react";

interface MobileBottomNavProps {
  activeTab?: "dashboard" | "transactions" | "advisor" | "accounts" | "goals";
}

export function MobileBottomNav({ activeTab = "dashboard" }: MobileBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: "dashboard", label: "Início", icon: TrendingUp, href: "/dashboard" },
    { id: "transactions", label: "Extrato", icon: ArrowUpRight, href: "/transactions" },
    { id: "accounts", label: "Contas", icon: CreditCard, href: "/accounts" },
    { id: "goals", label: "Metas", icon: Target, href: "/goals" },
    { id: "advisor", label: "Assessor", icon: ShieldCheck, href: "/advisor" },
  ];

  const currentTab = tabs.find(t => pathname?.startsWith(t.href))?.id || activeTab;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-6 py-3 flex justify-around items-center text-xs text-slate-400">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => router.push(tab.href)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-indigo-400 font-semibold" : "hover:text-slate-200"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive && "text-indigo-400")} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}