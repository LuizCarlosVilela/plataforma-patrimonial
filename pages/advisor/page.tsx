import { getPrisma } from "@/lib/prisma";
import { Users, TrendingUp, ShieldCheck, ArrowUpRight, Target, Activity } from "lucide-react";

const formatBRL = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default async function AdvisorDashboardPage() {
  const prisma = getPrisma();
  // Buscar clientes do advisor demo
  const advisor = await prisma.user.findUnique({
    where: { email: "consultor@w1.com.br" },
    include: {
      clients: {
        include: {
          accounts: true,
          goals: true,
          _count: { select: { transactions: true } },
        },
      },
    },
  });

  if (!advisor) {
    return (
      <div className="p-4 text-center text-slate-400">
        <p>Assessor não encontrado.</p>
      </div>
    );
  }

  const clients = advisor.clients;

  // Calcular totais
  const totalClients = clients.length;
  const totalNetWorth = clients.reduce(
    (sum: number, client: { accounts: Array<{ type: string; currentBalance: string }> }) => {
      const assets = client.accounts
        .filter((a): a is { type: string; currentBalance: string } => a.type !== "CREDIT_CARD")
        .reduce((s: number, a: { type: string; currentBalance: string }): number => s + Number(a.currentBalance), 0 as number);
      const liabilities = client.accounts
        .filter((a): a is { type: string; currentBalance: string } => a.type === "CREDIT_CARD")
        .reduce((s: number, a: { type: string; currentBalance: string }): number => s + Number(a.currentBalance), 0 as number);
      return sum + (assets - liabilities);
    },
    0 as number
  );
  const totalGoals = clients.reduce(
    (sum: number, client: { goals: Array<{ status: string }> }) => sum + client.goals.length,
    0
  );
  const activeGoals = clients.reduce(
    (sum: number, client: { goals: Array<{ status: string }> }) => sum + client.goals.filter((g: { status: string }) => g.status === "IN_PROGRESS").length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Painel do Assessor</h1>
          <p className="text-slate-400 text-sm">Visão geral da carteira de clientes</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>W1 Consultoria</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-medium text-slate-400">Total de Clientes</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalClients}</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-medium text-slate-400">Patrimônio Total</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{formatBRL(totalNetWorth)}</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-medium text-slate-400">Metas Ativas</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{activeGoals}/{totalGoals}</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-rose-400" />
            <span className="text-xs font-medium text-slate-400">Alertas</span>
          </div>
          <p className="text-2xl font-bold text-rose-400">3</p>
        </div>
      </div>

      {/* Lista de Clientes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Clientes</h2>
          <button className="text-sm text-indigo-400 hover:underline">Ver todos</button>
        </div>

        <div className="space-y-3">
          {clients.length === 0 ? (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-8 text-center">
              <Users className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-1">Nenhum cliente vinculado</h3>
              <p className="text-slate-400 text-sm">Convide seus clientes para começar a assessoria</p>
            </div>
          ) : (
            clients.map((client: { id: string; name: string; email: string; planTier: string; accounts: Array<{ type: string; currentBalance: string }>; goals: Array<{ status: string }>; _count: { transactions: number } }) => {
              const assets = client.accounts
                .filter((a): a is { type: string; currentBalance: string } => a.type !== "CREDIT_CARD")
                .reduce((s: number, a: { type: string; currentBalance: string }): number => s + Number(a.currentBalance), 0 as number);
              const liabilities = client.accounts
                .filter((a): a is { type: string; currentBalance: string } => a.type === "CREDIT_CARD")
                .reduce((s: number, a: { type: string; currentBalance: string }): number => s + Number(a.currentBalance), 0 as number);
              const netWorth = assets - liabilities;
              const activeGoalsCount = client.goals.filter((g: { status: string }) => g.status === "IN_PROGRESS").length;
              const transactionCount = client._count?.transactions || 0;

              return (
                <div
                  key={client.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-xs text-slate-400">{client.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-white">{formatBRL(netWorth)}</p>
                      <p className="text-xs text-slate-400">Patrimônio Líquido</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" />
                      {transactionCount} transações
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      {activeGoalsCount} metas ativas
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {client.planTier === "PREMIUM" ? "Premium" : "Gratuito"}
                    </span>
                    <button className="text-indigo-400 hover:underline text-sm font-medium">
                      Ver detalhes →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}