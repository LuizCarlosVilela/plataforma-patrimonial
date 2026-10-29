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
    <section
      className={cn(
        "bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl",
        className
      )}
    >
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Patrimônio Líquido
      </span>
      <h2 className={cn("text-3xl font-extrabold mt-1 mb-4", isPositive ? "text-emerald-400" : "text-rose-400")}>
        {formatBRL(netWorth)}
      </h2>

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
        <div>
          <div className="flex items-center gap-1 text-slate-400 text-xs mb-0.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ativos (Soma)</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">{formatBRL(totalAssets)}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-slate-400 text-xs mb-0.5">
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            <span>Faturas & Passivos</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">{formatBRL(totalLiabilities)}</p>
        </div>
      </div>
    </section>
  );
}