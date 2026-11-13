"use client";

import { Menu, Bell, User, LogOut, ChevronDown, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  userName: string;
  userRole: "CLIENT" | "ADVISOR" | "ADMIN";
  showMobileMenu?: boolean;
  onMenuClick?: () => void;
  className?: string;
}

export function TopHeader({ userName, userRole, showMobileMenu = true, onMenuClick, className }: TopHeaderProps) {
  const firstName = userName.split(" ")[0];
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className={cn("flex items-center justify-between mb-6", className)}>
      <div>
        <span className="text-xs font-medium text-[#86837d] uppercase tracking-wider">Bom dia,</span>
        <h1 className="text-xl font-semibold text-[#efeae0] mt-0.5">{firstName}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Role badge — discreto */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#86837d] bg-[#191a1e] border border-[#cfc6b4] px-2.5 py-1.5 rounded-md">
          <span className="uppercase tracking-wider">{userRole.toLowerCase()}</span>
        </div>

        {/* Notificações */}
        <button className="relative p-2 text-[#86837d] hover:text-[#efeae0] transition-colors rounded-lg hover:bg-[#191a1e]">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#9e4a3e] text-[#efeae0] text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[#cfc6b4] mx-1" />

        {/* Avatar + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 text-[#86837d] hover:text-[#efeae0] transition-colors rounded-lg hover:bg-[#191a1e]"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#efeae0] font-semibold text-sm"
                 style={{ background: "#16171b" }}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            <ChevronDown className={cn("w-4 h-4 text-[#86837d] transition-transform", showDropdown && "rotate-180")} />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-[#191a1e] border border-[#cfc6b4] rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#cfc6b4]">
                  <p className="text-sm font-medium text-[#efeae0]">{userName}</p>
                  <p className="text-xs text-[#86837d] mt-0.5 capitalize">{userRole.toLowerCase()}</p>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#86837d] hover:bg-[#16171b] hover:text-[#efeae0] transition-colors">
                  <User className="w-4 h-4" />
                  <span>Perfil</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#86837d] hover:bg-[#16171b] hover:text-[#efeae0] transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Configurações</span>
                </button>
                <hr className="border-[#cfc6b4] mx-2" />
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#9e4a3e] hover:bg-[#9e4a3e]/10 transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            </>
          )}
        </div>

        {showMobileMenu && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-[#86837d] hover:text-[#efeae0] transition-colors rounded-lg hover:bg-[#191a1e]"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
