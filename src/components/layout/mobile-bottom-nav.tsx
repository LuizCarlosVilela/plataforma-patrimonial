"use client";

import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { TrendingUp, ArrowUpRight, ShieldCheck, CreditCard, Target } from "lucide-react";

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
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#191a1e]/95 backdrop-blur-md border-t border-[rgba(207,198,180,0.2)] px-6 py-3 flex justify-around items-center text-xs text-[#86837d]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => router.push(tab.href)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive
                ? "text-[#b08a3e] font-semibold"
                : "hover:text-[#cfc6b4]"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive && "text-[#b08a3e]")} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
