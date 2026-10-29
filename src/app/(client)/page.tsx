import { getDashboardData } from "@/server/queries/dashboard";
import { prisma } from "@/lib/prisma";
import { NetWorthCard } from "@/components/shared/net-worth-card";
import { GoalProgressCard } from "@/components/shared/goal-progress-card";
import { Plus, ArrowUpRight, ShieldCheck, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  // Demo com usuário inicial - em produção usar auth()
  const demoUserEmail = "cliente@demo.com.br";
  const user = await prisma.user.findUnique({ where: { email: demoUserEmail } });

  if (!user) {
    return (
      <div className="p-4 text-center text-slate-400">
        <p>Usuário demo não encontrado.</p>
        <p className="text-sm mt-2">Execute: <code className="bg-slate-800 px-2 py-1 rounded">npm run db:seed</code></p>
      </div>
    );
  }

  const data = await getDashboardData(user.id);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <>
      {/* Card Principal: Patrimônio Líquido */}
      <NetWorthCard
        netWorth={data.netWorth}
        totalAssets={data.totalAssets}
        totalLiabilities={data.totalLiabilities}
      />

      {/* Ações Rápidas */}
      <section className="grid grid-cols-2 gap-3 mb-6">
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white py-3 rounded-xl font-medium text-sm shadow-md">
          <Plus className="w-4 h-4" />
          <span>Nova Despesa</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 active:scale-95 transition-all text-slate-200 py-3 rounded-xl font-medium text-sm">
          <span>+ Nova Receita</span>
        </button>
      </section>

      {/* Metas Patrimoniais (Pilar W1) */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-slate-200">Planejamento & Metas</h3>
          <span className="text-xs text-indigo-400">Ver todas</span>
        </div>
        <div className="space-y-3">
          {data.goals.length === 0 ? (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 text-center">
              <Target className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">Nenhuma meta cadastrada</p>
              <button className="mt-3 text-xs text-indigo-400 hover:underline">Criar primeira meta</button>
            </div>
          ) : (
            data.goals.map((goal) => (
              <GoalProgressCard
                key={goal.id}
                id={goal.id}
                title={goal.title}
                currentAmount={goal.currentAmount}
                targetAmount={goal.targetAmount}
                targetDate={goal.targetDate}
                status={goal.status}
                categoryTag={goal.categoryTag}
              />
            ))
          )}
        </div>
      </section>

      {/* Transações Recentes */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-slate-200">Transações Recentes</h3>
          <span className="text-xs text-indigo-400">Ver todas</span>
        </div>
        <div className="space-y-2">
          {data.recentTransactions.length === 0 ? (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 text-center">
              <ArrowUpRight className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">Nenhuma transação recente</p>
            </div>
          ) : (
            data.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between bg-slate-900/70 border border-slate-800 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm
                      ${tx.type === "INCOME" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}
                    `}
                  >
                    {tx.type === "INCOME" ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{tx.description}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      {tx.account.name} • {new Date(tx.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <span
                  className={`
                    text-sm font-semibold
                    ${tx.type === "INCOME" ? "text-emerald-400" : "text-rose-400"}
                  `}
                >
                  {tx.type === "INCOME" ? "+" : "-"}{formatBRL(Number(tx.amount))}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}