"use client";

import { useState, useEffect } from "react";
import { Plus, Target, CheckCircle, Clock, PauseCircle, TrendingUp, Wallet } from "lucide-react";
import { formatBRL } from "@/lib/utils";
import { ActionSpinner } from "@/components/shared/action-spinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface Goal {
  id: string;
  title: string;
  targetAmount: string;
  currentAmount: string;
  status: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  targetDate?: string;
  goalAccounts?: Array<{ id: string; accountId: string; account: { id: string; name: string; type: string; color?: string | null } }>;
}

interface Account {
  id: string;
  name: string;
  type: string;
  color?: string | null;
}

const BANK_COLORS: Record<string, string> = {
  BB: "#e52d2d",
  Santander: "#ec0000",
  Itaú: "#ff7a00",
  Bradesco: "#e32632",
  Nubank: "#8a09d2",
  Inter: "#ff7a00",
  C6: "#000000",
  BancoDoBrasil: "#e52d2d",
  Caixa: "#005ca9",
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0");
  const [targetDate, setTargetDate] = useState("");
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [categoryTag, setCategoryTag] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.email) setUserEmail(data.email);
        }
      } catch (e) { console.error(e); }
    }
    getUser();
  }, []);

  useEffect(() => {
    if (userEmail) { loadGoals(); loadAccounts(); }
  }, [userEmail]);

  const loadGoals = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/goals?email=${userEmail}`);
      if (res.ok) { const data = await res.json(); setGoals(data.goals || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadAccounts = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/accounts?email=${userEmail}`);
      if (res.ok) { const data = await res.json(); setAccounts(data.accounts || []); }
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !targetDate || !userEmail) return;
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          title,
          targetAmount: parseFloat(targetAmount),
          currentAmount: parseFloat(currentAmount) || 0,
          targetDate,
          status: "IN_PROGRESS",
          accountIds: selectedAccountIds,
          categoryTag,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setTitle(""); setTargetAmount(""); setCurrentAmount("0");
        setTargetDate(""); setSelectedAccountIds([]); setCategoryTag("");
        loadGoals();
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const toggleAccount = (id: string) => {
    setSelectedAccountIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
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

  const getMonthlyNeeded = (goal: Goal) => {
    const target = parseFloat(goal.targetAmount);
    const current = parseFloat(goal.currentAmount);
    if (!goal.targetDate) return 0;
    const now = new Date();
    const end = new Date(goal.targetDate);
    const months = Math.max(1, Math.ceil((end.getTime() - now.getTime()) / (30.44 * 24 * 60 * 60 * 1000)));
    return (target - current) / months;
  };

  const buildChartData = (goal: Goal) => {
    const target = parseFloat(goal.targetAmount);
    const current = parseFloat(goal.currentAmount);
    if (!goal.targetDate || target <= 0) return [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const end = new Date(goal.targetDate);
    end.setHours(0, 0, 0, 0);
    const totalMonths = Math.max(1, Math.ceil((end.getTime() - now.getTime()) / (30.44 * 24 * 60 * 60 * 1000)));
    const monthlyNeeded = (target - current) / totalMonths;
    const data = [];
    for (let i = 0; i <= Math.min(totalMonths, 24); i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() + i);
      data.push({
        month: date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }).replace(".", "."),
        atual: parseFloat(((current + monthlyNeeded * i).toFixed(2))),
        alvo: parseFloat((target * ((i + 1) / Math.max(totalMonths, 1))).toFixed(2)),
      });
    }
    return data;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#efeae0]">Minhas Metas</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 py-2 px-4 rounded-xl font-medium text-sm transition-all active:scale-[0.98] text-[#16171b]"
          style={{ background: "#b08a3e" }}>
          <Plus className="w-4 h-4" /> Nova Meta
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-[#efeae0]">Criar Nova Meta</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Título</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Reserva de Emergência"
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none" required />
            </div>
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Valor Alvo (R$)</label>
              <input type="number" step="0.01" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="0,00"
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none" required />
            </div>
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Valor Atual (R$)</label>
              <input type="number" step="0.01" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="0,00"
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none" />
            </div>
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Data Limite</label>
              <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none" required />
            </div>
          </div>

          {/* Account selection */}
          {accounts.length > 0 && (
            <div>
              <label className="block text-xs text-[#86837d] mb-2 uppercase tracking-wider">Contas que vão contribuir</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {accounts.map((acc) => {
                  const isSelected = selectedAccountIds.includes(acc.id);
                  return (
                    <button key={acc.id} type="button" onClick={() => toggleAccount(acc.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-sm transition-all ${isSelected ? "border-[#b08a3e] bg-[rgba(176,138,62,0.15)]" : "border-[#cfc6b4] bg-[#16171b] hover:border-[#b08a3e]/50"}`}>
                      <Wallet className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-[#b08a3e]" : "text-[#86837d]"}`} />
                      <span className={`truncate ${isSelected ? "text-[#efeae0]" : "text-[#86837d]"}`}>{acc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)}
              className="py-2 px-4 rounded-lg text-sm text-[#86837d] hover:text-[#efeae0] transition-colors">Cancelar</button>
            <button type="submit" disabled={saving} className="py-2 px-6 rounded-lg font-medium text-sm text-[#16171b]" style={{ background: "#b08a3e" }}>
              {saving ? <ActionSpinner label="Salvando..." /> : "Criar Meta"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#86837d]">Carregando metas...</div>
      ) : goals.length === 0 ? (
        <div className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-8 text-center">
          <Target className="w-16 h-16 mx-auto text-[#86837d] mb-4" />
          <h3 className="text-lg font-medium text-[#efeae0] mb-1">Nenhuma meta cadastrada</h3>
          <p className="text-[#86837d] text-sm mb-4">Defina suas metas financeiras para acompanhar seu progresso</p>
          <button onClick={() => setShowForm(true)}
            className="px-6 py-2 rounded-lg font-medium text-sm text-[#16171b]" style={{ background: "#b08a3e" }}>
            Criar Primeira Meta
          </button>
        </div>
      ) : (
        <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getProgress(goal);
              const statusInfo = getStatusInfo(goal.status);
              const StatusIcon = statusInfo.icon;
              const monthlyNeeded = getMonthlyNeeded(goal);
              const chartData = buildChartData(goal);

              return (
                <div key={goal.id}
                  className="panel p-6 hover:border-[#b08a3e]/40 transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-[#efeae0]">{goal.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mt-2 ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#efeae0] num">{formatBRL(parseFloat(goal.currentAmount))}</p>
                      <p className="text-xs text-[#86837d]">de {formatBRL(parseFloat(goal.targetAmount))}</p>
                    </div>
                  </div>

                  {/* Chart */}
                  {chartData.length > 0 && (
                    <div className="mb-4 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#cfc6b420" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#86837d" }} />
                          <YAxis tick={{ fontSize: 11, fill: "#86837d" }} tickFormatter={(v) => `R$${v.toFixed(0)}`} />
                          <Tooltip
                            contentStyle={{ background: "#191a1e", border: "1px solid #cfc6b4", borderRadius: "8px" }}
                            labelStyle={{ color: "#efeae0" }}
                            formatter={(value, _name) => [formatBRL(value as number), _name === "atual" ? "Saldo acumulado" : "Trajetória"]}
                          />
                          <Bar dataKey="alvo" name="Trajetória" fill="#b08a3e" radius={[4, 4, 0, 0]} opacity={0.6} />
                          <Bar dataKey="atual" name="Saldo acumulado" fill="#b08a3e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-[#86837d] mb-1">
                      <span>Progresso</span>
                      <span className="num">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#16171b] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, background: progress >= 100 ? "#4f6b52" : "#b08a3e" }} />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#86837d]">
                    {goal.targetDate && (
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Prazo: {new Date(goal.targetDate).toLocaleDateString("pt-BR")}</span>
                    )}
                    {monthlyNeeded > 0 && (
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-[#b08a3e]" /> Aporte mensal necessário: <strong className="text-[#efeae0] num">{formatBRL(monthlyNeeded)}</strong></span>
                    )}
                    <span className="ml-auto flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      {goal.goalAccounts?.length || 0} conta{(goal.goalAccounts?.length || 0) !== 1 ? "s" : ""}
                    </span>
                    {progress >= 100 && (
                      <span className="ml-auto text-green-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Concluída!
                      </span>
                    )}
                  </div>

                  {/* Selected accounts */}
                  {goal.goalAccounts && goal.goalAccounts.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#cfc6b4]/20">
                      {goal.goalAccounts.map((ga) => (
                        <span key={ga.accountId} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#16171b] text-[#efeae0] border border-[#cfc6b4]/30">
                          <Wallet className="w-3 h-3 text-[#b08a3e]" />
                          {ga.account.name}
                        </span>
                      ))}
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
