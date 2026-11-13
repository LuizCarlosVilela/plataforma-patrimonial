"use client";

import { NetWorthCard } from "@/components/shared/net-worth-card";
import { GoalProgressCard } from "@/components/shared/goal-progress-card";
import { Plus, ArrowUpRight, ShieldCheck, TrendingUp, Target } from "lucide-react";

const DEMO_USER_ID = "demo-user-001";

const formatBRL = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

const demoData = {
  netWorth: 2450000,
  totalAssets: 2630000,
  totalLiabilities: 180000,
  goals: [
    { id: "g1", userId: DEMO_USER_ID, title: "Reserva de Emergência (6 Meses)", targetAmount: 30000, currentAmount: 12000, status: "IN_PROGRESS" as const, progress: 40, categoryTag: "Liquidez" },
    { id: "g2", userId: DEMO_USER_ID, title: "Aposentadoria Patrimonial", targetAmount: 5000000, currentAmount: 1350000, status: "IN_PROGRESS" as const, progress: 27, categoryTag: "Longo Prazo" },
  ],
  recentTransactions: [
    { id: "t1", description: "Aporte XP Investimentos", amount: 5000, type: "INCOME", date: "12 Nov 2026", account: { name: "XP Investimentos" } },
    { id: "t2", description: "Supermercado St. Marché", amount: 840, type: "EXPENSE", date: "10 Nov 2026", account: { name: "Cartão XP" } },
  ],
};

export default function DashboardPage() {
  const data = demoData;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Card Principal: Patrimônio Líquido */}
      <NetWorthCard
        netWorth={data.netWorth}
        totalAssets={data.totalAssets}
        totalLiabilities={data.totalLiabilities}
      />

      {/* Ações Rápidas */}
      <section className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 bg-[#b08a3e] hover:bg-[#c49a3e] active:scale-[0.98] transition-all text-[#16171b] py-3 px-4 rounded-xl font-medium text-sm shadow-gold">
          <Plus className="w-4 h-4" />
          <span>Nova Despesa</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-[#191a1e] border border-[#cfc6b4] hover:border-[#b08a3e]/40 hover:bg-[#16171b] active:scale-[0.98] transition-all text-[#efeae0] py-3 px-4 rounded-xl font-medium text-sm">
          <span className="text-[#b08a3e]">+</span> Nova Receita
        </button>
      </section>

      {/* Metas Patrimoniais */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs text-[#86837d] uppercase tracking-wider">Planejamento & Metas</h3>
          <a href="/client/goals" className="text-xs font-medium text-[#86837d] hover:text-[#b08a3e] flex items-center gap-1 transition-colors">
            Ver todas <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.goals.map((goal) => (
            <GoalProgressCard key={goal.id} {...goal} />
          ))}
        </div>
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
            <div key={orbit.num} className="card-premium p-5 relative overflow-hidden group cursor-pointer">
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
          <a href="/client/transactions" className="text-xs font-medium text-[#86837d] hover:text-[#b08a3e] transition-colors">Ver todas →</a>
        </div>
        <div className="space-y-2">
          {data.recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between card-body p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${tx.type === "INCOME" ? "bg-[rgba(79,107,82,0.1)] text-[#4f6b52]" : "bg-[rgba(158,74,62,0.1)] text-[#9e4a3e]"}`}>
                  {tx.type === "INCOME" ? <TrendingUp className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#efeae0]">{tx.description}</p>
                  <p className="text-xs text-[#86837d]">{tx.account.name} • {tx.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${tx.type === "INCOME" ? "text-[#4f6b52]" : "text-[#9e4a3e]"}`}>
                {tx.type === "INCOME" ? "+" : "-"}{formatBRL(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
