"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck, Menu, Bell, User, LogOut, ChevronDown } from "lucide-react";

interface TopHeaderProps {
  userName: string;
  userRole: "CLIENT" | "ADVISOR" | "ADMIN";
  showMobileMenu?: boolean;
  onMenuClick?: () => void;
  className?: string;
}

export function TopHeader({ userName, userRole, showMobileMenu = true, onMenuClick, className }: TopHeaderProps) {
  const firstName = userName.split(" ")[0];

  return (
    <header className={cn("flex items-center justify-between mb-6", className)}>
      <div>
        <span className="text-xs font-medium text-slate-400">Olá,</span>
        <h1 className="text-lg font-bold text-white">{firstName}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Badge W1 Sync */}
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>W1 Sync</span>
        </div>

        {/* Notificações */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Menu do usuário */}
        <div className="relative">
          <button className="flex items-center gap-2 p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-slate-800">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-slate-400 capitalize">{userRole.toLowerCase()}</p>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
              <span>Minha Assessoria</span>
            </button>
            <hr className="border-slate-800 mx-2" />
            <button className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}