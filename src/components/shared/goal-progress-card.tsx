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

  const statusColors = {
    IN_PROGRESS: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    COMPLETED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    PAUSED: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div
      key={id}
      className={cn(
        "bg-slate-900/70 border rounded-xl p-4 transition-all",
        statusColors[status],
        className
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-300">{title}</span>
        <span className="text-xs font-bold">{progress}%</span>
      </div>
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500",
            isCompleted ? "bg-emerald-500" : "bg-indigo-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
        <span>Atual: {formatBRL(currentAmount)}</span>
        <span>Meta: {formatBRL(targetAmount)}</span>
      </div>
      {categoryTag && (
        <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium bg-slate-800 rounded text-slate-400">
          {categoryTag}
        </span>
      )}
      {targetDate && (
        <div className="mt-2 text-[11px] text-slate-500">
          Meta para: {new Date(targetDate).toLocaleDateString("pt-BR")}
        </div>
      )}
    </div>
  );
}