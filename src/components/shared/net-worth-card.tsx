"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NetWorthCardProps {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  className?: string;
}

export function NetWorthCard({ netWorth, totalAssets, totalLiabilities, className }: NetWorthCardProps) {
  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const isPositive = netWorth >= 0;

  return (
    <section className={cn("card-body p-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-[#86837d] uppercase tracking-[0.15em]">
            Patrimônio Líquido
          </span>
          <h2 className={cn("text-3xl font-bold mt-2", isPositive ? "text-[#efeae0]" : "text-[#9e4a3e]")}>
            {formatBRL(netWorth)}
          </h2>
          <p className="text-xs text-[#4f6b52] font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            +12.4% este mês
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#b08a3e]/10">
          <span className="text-xl font-bold text-[#b08a3e]">O</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-5 mt-5 border-t border-[#cfc6b4]">
        <div>
          <div className="flex items-center gap-1.5 text-[#86837d] text-xs mb-1 uppercase tracking-wider">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#4f6b52]" />
            <span>Ativos</span>
          </div>
          <p className="text-base font-semibold text-[#efeae0]">{formatBRL(totalAssets)}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-[#86837d] text-xs mb-1 uppercase tracking-wider">
            <ArrowDownRight className="w-3.5 h-3.5 text-[#9e4a3e]" />
            <span>Passivos</span>
          </div>
          <p className="text-base font-semibold text-[#efeae0]">{formatBRL(totalLiabilities)}</p>
        </div>
      </div>
    </section>
  );
}
