"use client";

import { usePathname } from "next/navigation";
import { Home, Wallet, Target, ArrowRightLeft, BarChart3, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OriginLogo } from "@/components/shared/origin-logo";

const TABS = [
  { label: "Início", path: "/dashboard", icon: Home },
  { label: "Contas", path: "/accounts", icon: Wallet },
  { label: "Metas", path: "/goals", icon: Target },
  { label: "Transações", path: "/transactions", icon: ArrowRightLeft },
  { label: "Relatórios", path: "/reports", icon: BarChart3 },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#191a1e]/95 backdrop-blur-md border-t border-[#cfc6b4] md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {/* Logo compacto no início */}
        <div className="flex-shrink-0 mr-1">
          <OriginLogo size={28} />
        </div>

        {TABS.map((tab) => {
          const isActive = pathname === tab.path || (tab.path !== "/dashboard" && pathname?.startsWith(tab.path));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all min-w-0",
                isActive
                  ? "text-[#b08a3e]"
                  : "text-[#86837d] hover:text-[#efeae0]"
              )}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={cn(isActive && "drop-shadow-[0_0_6px_rgba(176,138,62,0.5)]")}
              />
              <span className={cn("text-[10px] leading-none truncate max-w-full", isActive && "font-semibold")}>
                {tab.label}
              </span>
              {isActive && (
                <span
                  className="absolute -bottom-0.5 w-4 h-0.5 rounded-full"
                  style={{ background: "#b08a3e" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
