"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NetWorthCard } from "@/components/shared/net-worth-card";
import { GoalProgressCard } from "@/components/shared/goal-progress-card";
import { Plus, ArrowUpRight, ShieldCheck, TrendingUp, Target, Loader2, RefreshCw } from "lucide-react";

interface Account {
  id: string;
  name: string;
  type: string;
  currentBalance: string;
  currency: string;
  icon?: string | null;
}

interface Transaction {
  id: string;
  description: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  date: string;
  account?: { name: string };
}

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  status: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  progress?: number;
  categoryTag?: string | null;
}

const formatBRL = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserEmail() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email);
        }
      } catch (err) {
        console.error('Erro ao buscar e-mail do usuário:', err);
      }
    }
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (userEmail) {
      loadData();
    }
  }, [userEmail]);

  async function loadData() {
    if (!userEmail) return;

    setLoading(true);
    try {
      const [accRes, txRes, goalRes] = await Promise.all([
        fetch(`/api/accounts?email=${encodeURIComponent(userEmail)}`),
        fetch(`/api/transactions?email=${encodeURIComponent(userEmail)}`),
        fetch(`/api/goals?email=${encodeURIComponent(userEmail)}`),
      ]);
      const accData = await accRes.json();
      const txData = await txRes.json();
      const goalData = await goalRes.json();
      setAccounts(accData.accounts ?? []);
      setTransactions(txData.transactions ?? []);
      setGoals(goalData.goals ?? []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenFinanceSync() {
    if (!userEmail) return;

    setSyncing(true);
    try {
      const res = await fetch("/api/openfinance/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      if (res.ok) {
        alert("Open Finance sincronizado com sucesso!");
        await loadData();
      } else {
        const err = await res.json();
        alert(`Erro no sync: ${err.error || "Tente novamente."}`);
      }
    } catch {
      alert("Erro de conexão. Verifique sua internet.");
    } finally {
      setSyncing(false);
    }
  }

  const totalAssets = accounts
    .filter((a) => a.type !== "CREDIT_CARD")
    .reduce((sum, a) => sum + parseFloat(a.currentBalance || "0"), 0);
  const totalLiabilities = Math.abs(
    accounts
      .filter((a) => a.type === "CREDIT_CARD")
      .reduce((sum, a) => sum + parseFloat(a.currentBalance || "0"), 0)
  );
  const netWorth = totalAssets - totalLiabilities;
  const recentTx = transactions.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Card Principal: Patrimônio Líquido */}
      <NetWorthCard
        netWorth={netWorth}
        totalAssets={totalAssets}
        totalLiabilities={totalLiabilities}
        className="panel"
      />

      {/* Ações Rápidas */}
      <section className="grid grid-cols-2 gap-4">
        <Link href="/transactions" legacyBehavior passHref>
          <button
            className="flex items-center justify-center gap-2 bg-[#b08a3e] hover:bg-[#b08a3e]/90 active:scale-[0.98] transition-all text-[#16171b] py-3 px-4 rounded-xl font-medium text-sm shadow-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Despesa</span>
          </button>
        </Link>
        <Link href="/transactions" legacyBehavior passHref>
          <button
            className="flex items-center justify-center gap-2 bg-[#191a1e] border border-[#cfc6b4] hover:border-[#b08a3e]/40 hover:bg-[#16171b] active:scale-[0.98] transition-all text-[#efeae0] py-3 px-4 rounded-xl font-medium text-sm"
          >
            <span className="text-[#b08a3e]">+</span> Nova Receita
          </button>
        </Link>
      </section>

      {/* Metas Patrimoniais */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs text-[#86837d] uppercase tracking-wider">Planejamento & Metas</h3>
          <a href="/goals" className="text-xs font-medium text-[#86837d] hover:text-[#b08a3e] flex items-center gap-1 transition-colors">
            Ver todas <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-[#86837d]">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Carregando metas…
          </div>
        ) : goals.length === 0 ? (
          <div className="panel p-8 text-center text-[#86837d] text-sm">
            Nenhuma meta cadastrada.{" "}
            <a href="/goals" className="text-[#b08a3e] hover:underline">Criar uma meta →</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <GoalProgressCard key={goal.id} {...goal} className="panel" />
            ))}
          </div>
        )}
      </section>

      {/* Órbitas do Método MAPA */}
      <section>
        <h3 className="font-semibold text-xs text-[#86837d] uppercase tracking-wider mb-3">Método MAPA — Diagnóstico Atual</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { num: "01", title: "Órbita Corporativa", desc: "Gestão estratégica da empresa e separação caixa-pessoal", icon: ShieldCheck },
            { num: "02", title: "Órbita Patrimonial", desc: "Blindagem jurídica e alocação inteligente dos ativos", icon: TrendingUp },
            { num: "03", title: "Órbita Sucessória", desc: "Governança familiar e planejamento sucessório", icon: Target },
          ].map((orbit) => (
            <div key={orbit.num} className="panel p-5 relative overflow-hidden group cursor-pointer transition-all hover:border-[#b08a3e]/50">
              <div className="absolute top-3 right-3 text-3xl font-bold font-mono text-[#b08a3e]/20 group-hover:text-[#b08a3e]/40 transition-colors">
                {orbit.num}
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#b08a3e]/10 border border-[#b08a3e]/20 flex items-center justify-center mb-3">
                <orbit.icon className="w-5 h-5 text-[#b08a3e]" />
              </div>
              <h4 className="text-sm font-semibold text-[#efeae0] mb-1">{orbit.title}</h4>
              <p className="text-xs text-[#86837d] leading-relaxed">{orbit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Transações Recentes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs text-[#86837d] uppercase tracking-wider">Transações Recentes</h3>
          <a href="/transactions" className="text-xs font-medium text-[#86837d] hover:text-[#b08a3e] transition-colors">Ver todas →</a>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-[#86837d]">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Carregando transações…
          </div>
        ) : recentTx.length === 0 ? (
          <div className="panel p-8 text-center text-[#86837d] text-sm">
            Nenhuma transação registrada ainda.{" "}
            <a href="/transactions" className="text-[#b08a3e] hover:underline">Registrar uma →</a>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTx.map((tx) => (
              <div key={tx.id} className="panel p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${tx.type === "INCOME" ? "bg-[rgba(79,107,82,0.1)] text-[#4f6b52]" : "bg-[rgba(158,74,62,0.1)] text-[#9e4a3e]"}`}>
                    {tx.type === "INCOME" ? <TrendingUp className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#efeae0]">{tx.description}</p>
                    <p className="text-xs text-[#86837d]">{tx.account?.name ?? "—"} • {new Date(tx.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold num ${tx.type === "INCOME" ? "text-[#4f6b52]" : "text-[#9e4a3e]"}`}>
                  {tx.type === "INCOME" ? "+" : "-"}{formatBRL(parseFloat(tx.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Botão Open Finance */}
      <section>
        <button
          onClick={handleOpenFinanceSync}
          disabled={syncing}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#cfc6b4]/30 text-[#86837d] hover:border-[#b08a3e]/60 hover:text-[#b08a3e] transition-all text-sm"
        >
          {syncing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sincronizando Open Finance…
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Sincronizar Contas via Open Finance
            </>
          )}
        </button>
      </section>
    </div>
  );
}
