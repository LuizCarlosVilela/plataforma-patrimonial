"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, DollarSign, Target, Download, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
}

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [transRes, goalsRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/goals"),
        ]);

        const transData = await transRes.json();
        const goalsData = await goalsRes.json();

        setTransactions(transData.transactions || []);
        setGoals(goalsData.goals || []);
      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#b08a3e] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#efeae0]">
      {/* Header */}
      <header className="border-b border-[#cfc6b4]/20 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-[#86837d] hover:text-[#efeae0] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold">Relatórios</h1>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#191a1e] border border-[#cfc6b4] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-[#86837d] text-sm">Receitas</span>
            </div>
            <p className="text-2xl font-bold text-green-500">
              R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-[#191a1e] border border-[#cfc6b4] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-[#86837d] text-sm">Despesas</span>
            </div>
            <p className="text-2xl font-bold text-red-500">
              R$ {totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-[#191a1e] border border-[#cfc6b4] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#b08a3e]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#b08a3e]" />
              </div>
              <span className="text-[#86837d] text-sm">Saldo</span>
            </div>
            <p className="text-2xl font-bold text-[#efeae0]">
              R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#191a1e] border border-[#cfc6b4] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#cfc6b4]/20 flex items-center justify-between">
            <h2 className="font-semibold">Transações</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#cfc6b4]/30 text-sm text-[#86837d] hover:text-[#efeae0] transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center text-[#86837d]">
              <p>Nenhuma transação registrada</p>
              <Link href="/transactions" className="text-[#b08a3e] hover:underline mt-2 inline-block">
                Criar primeira transação
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#cfc6b4]/20 text-left text-sm text-[#86837d]">
                  <th className="px-6 py-3">Descrição</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Valor</th>
                  <th className="px-6 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-[#cfc6b4]/10 hover:bg-white/5">
                    <td className="px-6 py-3">{t.description}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                          t.type === "INCOME"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {t.type === "INCOME" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-3 font-medium ${
                        t.type === "INCOME" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      R$ {t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-3 text-[#86837d]">
                      {new Date(t.date).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Goals Progress */}
        {goals.length > 0 && (
          <div className="bg-[#191a1e] border border-[#cfc6b4] rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Progresso das Metas</h2>
            <div className="space-y-4">
              {goals.map((g) => {
                const progress = Math.min(
                  100,
                  (g.currentAmount / g.targetAmount) * 100
                );
                return (
                  <div key={g.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{g.title}</span>
                      <span className="text-sm text-[#86837d]">
                        R$ {g.currentAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} /{" "}
                        R$ {g.targetAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="h-2 bg-[#16171b] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progress}%`, background: "#b08a3e" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
