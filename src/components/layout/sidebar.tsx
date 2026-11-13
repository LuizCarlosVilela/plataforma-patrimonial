"use client";

import { Home, Wallet, Target, ArrowRightLeft, Settings, LogOut, Palette, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/client/dashboard", icon: Home },
    { name: "Diagnóstico MAPA", path: "/client/diagnostic", icon: ShieldCheck },
    { name: "Contas", path: "/client/accounts", icon: Wallet },
    { name: "Metas", path: "/client/goals", icon: Target },
    { name: "Transações", path: "/client/transactions", icon: ArrowRightLeft },
    { name: "Relatórios", path: "/client/reports", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#191a1e] border-r border-[#cfc6b4] flex flex-col hidden md:flex flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-[#cfc6b4]/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-[#16171b]"
               style={{ background: "#b08a3e" }}>
            O
          </div>
          <div>
            <span className="text-base font-semibold tracking-widest text-[#efeae0] block leading-none">ORIGIN</span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-[#86837d]">Gestão Patrimonial</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                isActive
                  ? "bg-white/10 text-[#efeae0] font-medium"
                  : "text-[#86837d] hover:bg-white/5 hover:text-[#cfc6b4]"
              }`}
            >
              <item.icon size={17} className={isActive ? "text-[#b08a3e]" : ""} />
              <span className="text-sm">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1 h-1 rounded-full" style={{ background: "#b08a3e" }} />
              )}
            </Link>
          );
        })}

        <div className="my-3 border-t border-[#cfc6b4]/20" />

        <Link
          href="/client/design-system"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
            pathname === "/client/design-system"
              ? "bg-white/10 text-[#efeae0] font-medium"
              : "text-[#86837d] hover:bg-white/5 hover:text-[#cfc6b4]"
          }`}
        >
          <Palette size={17} />
          <span className="text-sm">Origin Design</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#cfc6b4]/20">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full text-[#86837d] hover:text-[#9e4a3e] transition-colors rounded-lg hover:bg-white/5">
          <LogOut size={17} />
          <span className="text-sm">Sair</span>
        </button>
        <div className="mt-2 px-3">
          <p className="text-[10px] text-[#86837d]">Carvalho Group · Diagnóstico Patrimonial</p>
        </div>
      </div>
    </aside>
  );
}
