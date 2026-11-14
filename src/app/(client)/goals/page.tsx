"use client";

import { useState, useEffect } from "react";
import { Plus, Target, CheckCircle, Clock, PauseCircle, TrendingUp, ArrowUp } from "lucide-react";
import { formatBRL } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  targetAmount: string;
  currentAmount: string;
  status: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  targetDate?: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0");
  const [targetDate, setTargetDate] = useState("");
  const [categoryTag, setCategoryTag] = useState("");

  const DEMO_USER_ID = "clx8h6r7v0000w3xy9z2k4m5n";

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const res = await fetch(`/api/goals?userId=${DEMO_USER_ID}`);
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
      }
    } catch (e) {
      console.error("Error loading goals:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !targetDate) return;

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          title,
          targetAmount: parseFloat(targetAmount),
          currentAmount: parseFloat(currentAmount) || 0,
          targetDate,
          status: "IN_PROGRESS",
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setTitle("");
        setTargetAmount("");
        setCurrentAmount("0");
        setTargetDate("");
        setCategoryTag("");
        loadGoals();
      }
    } catch (e) {
      console.error("Error creating goal:", e);
    }
  };

  const getStatusInfo = (status: Goal["status"]) => {
    switch (status) {
      case "IN_PROGRESS":
        return { icon: Clock, label: "Em Progresso", color: "text-[#b08a3e] bg-[rgba(176,138,62,0.1)] border-[rgba(176,138,62,0.3)]" };
      case "COMPLETED":
        return { icon: CheckCircle, label: "Concluída", color: "text-[#4f6b52] bg-[rgba(79,107,82,0.1)] border-[rgba(79,107,82,0.3)]" };
      case "PAUSED":
        return { icon: PauseCircle, label: "Pausada", color: "text-[#7e6e52] bg-[rgba(126,110,82,0.15)] border-[rgba(126,110,82,0.3)]" };
    }
  };

  const getProgress = (goal: Goal) => {
    const target = parseFloat(goal.targetAmount);
    const current = parseFloat(goal.currentAmount);
    return target > 0 ? Math.min(100, (current / target) * 100) : 0;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#efeae0]">Minhas Metas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 py-2 px-4 rounded-xl font-medium text-sm transition-all active:scale-[0.98] text-[#16171b]"
          style={{ background: "#b08a3e" }}
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-[#efeae0]">Criar Nova Meta</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Reserva de Emergência"
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Valor Alvo (R$)</label>
              <input
                type="number"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Valor Atual (R$)</label>
              <input
                type="number"
                step="0.01"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Data Limite</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="py-2 px-4 rounded-lg text-sm text-[#86837d] hover:text-[#efeae0] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-6 rounded-lg font-medium text-sm text-[#16171b]"
              style={{ background: "#b08a3e" }}
            >
              Criar Meta
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12 text-[#86837d]">Carregando metas...</div>
      ) : goals.length === 0 ? (
        <div className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-8 text-center">
          <Target className="w-16 h-16 mx-auto text-[#86837d] mb-4" />
          <h3 className="text-lg font-medium text-[#efeae0] mb-1">Nenhuma meta cadastrada</h3>
          <p className="text-[#86837d] text-sm mb-4">Defina suas metas financeiras para acompanhar seu progresso</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = getProgress(goal);
            const statusInfo = getStatusInfo(goal.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={goal.id}
                className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-6 hover:border-[#b08a3e]/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#efeae0]">{goal.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mt-2 ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#efeae0]">{formatBRL(parseFloat(goal.currentAmount))}</p>
                    <p className="text-xs text-[#86837d]">de {formatBRL(parseFloat(goal.targetAmount))}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-[#86837d] mb-1">
                    <span>Progresso</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#16171b] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background: progress >= 100 ? "#4f6b52" : "#b08a3e",
                      }}
                    />
                  </div>
                </div>

                {goal.targetDate && (
                  <div className="flex items-center gap-2 text-xs text-[#86837d]">
                    <Clock className="w-3 h-3" />
                    <span>Prazo: {new Date(goal.targetDate).toLocaleDateString("pt-BR")}</span>
                    {progress >= 100 && (
                      <span className="ml-auto text-green-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Concluída!
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
