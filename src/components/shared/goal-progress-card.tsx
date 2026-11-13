"use client";

import { cn } from "@/lib/utils";

interface GoalProgressCardProps {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  targetDate?: Date | null;
  status: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  categoryTag?: string | null;
  className?: string;
}

export function GoalProgressCard({
  id,
  title,
  currentAmount,
  targetAmount,
  targetDate,
  status,
  categoryTag,
  className,
}: GoalProgressCardProps) {
  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const progress = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
  const isCompleted = status === "COMPLETED";

  const statusStyles = {
    IN_PROGRESS: {
      badge: "bg-[#16171b] text-[#86837d] border border-[#cfc6b4]",
      barBg: "bg-[#16171b]",
      barFill: "bg-gradient-to-r from-[#b08a3e] to-[#c2b293]",
      label: "Em Progresso",
    },
    COMPLETED: {
      badge: "bg-[rgba(176,138,62,0.1)] text-[#b08a3e] border border-[rgba(176,138,62,0.3)]",
      barBg: "bg-[#16171b]",
      barFill: "bg-[#b08a3e]",
      label: "Concluída",
    },
    PAUSED: {
      badge: "bg-[rgba(126,110,82,0.15)] text-[#7e6e52] border border-[rgba(126,110,82,0.3)]",
      barBg: "bg-[#16171b]",
      barFill: "bg-[#7e6e52]",
      label: "Pausada",
    },
  };

  const style = statusStyles[status];

  return (
    <div className={cn("card-body p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-[#efeae0] truncate">{title}</span>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider flex-shrink-0", style.badge)}>
            {style.label}
          </span>
        </div>
        <span className="text-lg font-bold text-[#efeae0] flex-shrink-0 ml-2">{progress}%</span>
      </div>

      <div className={cn("w-full h-2 rounded-full overflow-hidden", style.barBg)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", style.barFill)}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-3 text-xs text-[#86837d]">
        <span className="font-medium text-[#efeae0]">{formatBRL(currentAmount)}</span>
        <span>de {formatBRL(targetAmount)}</span>
      </div>

      {categoryTag && (
        <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium bg-[#16171b] border border-[#cfc6b4] rounded text-[#86837d] uppercase tracking-wider">
          {categoryTag}
        </span>
      )}
      {targetDate && (
        <div className="mt-2 text-xs text-[#86837d]">
          Prazo: {new Date(targetDate).toLocaleDateString("pt-BR")}
        </div>
      )}
    </div>
  );
}
