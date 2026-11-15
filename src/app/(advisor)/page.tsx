import { prisma } from "@/lib/prisma";
import { Users, TrendingUp, ShieldCheck, ArrowUpRight, Target, Activity } from "lucide-react";

const formatBRL = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default async function AdvisorDashboardPage() {
  // using shared prisma instance
  const advisor = await prisma.user.findUnique({
    where: { email: "consultor@w1.com.br" },
    include: {
      clients: {
        include: {
          accounts: true,
          goals: true,
          _count: { select: { accounts: true } },
        },
      },
    },
  });

  if (!advisor) {
    return (
      <div className="p-4 text-center text-[#86837d]">
        <p>Assessor não encontrado.</p>
        <p className="text-sm mt-2">Execute: <code className="bg-[#191a1e] px-2 py-1 rounded">npx prisma db seed</code></p>
      </div>
    );
  }

  const clients = advisor.clients;

  const totalClients = clients.length;
  const totalNetWorth = clients.reduce((sum, client) => {
    const assets = client.accounts
      .filter((a) => a.type !== "CREDIT_CARD")
      .reduce((s, a) => s + Number(a.currentBalance), 0);
    const liabilities = client.accounts
      .filter((a) => a.type === "CREDIT_CARD")
      .reduce((s, a) => s + Number(a.currentBalance), 0);
    return sum + (assets - liabilities);
  }, 0);
  const totalGoals = clients.reduce((sum, client) => sum + client.goals.length, 0);
  const activeGoals = clients.reduce(
    (sum, client) => sum + client.goals.filter((g) => g.status === "IN_PROGRESS").length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#efeae0]">Painel do Assessor</h1>
          <p className="text-[#86837d] text-sm">Visão geral da carteira de clientes</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#4f6b52]/10 border border-[rgba(79,107,82,0.2)] text-[#4f6b52] px-3 py-1.5 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>W1 Consultoria</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#191a1e] border border-[#cfc6b4]/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-[#b08a3e]" />
            <span className="text-xs font-medium text-[#86837d]">Total de Clientes</span>
          </div>
          <p className="text-2xl font-bold text-[#efeae0]">{totalClients}</p>
        </div>

        <div className="bg-[#191a1e] border border-[#cfc6b4]/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#4f6b52]" />
            <span className="text-xs font-medium text-[#86837d]">Patrimônio Total</span>
          </div>
          <p className="text-2xl font-bold text-[#4f6b52]">{formatBRL(totalNetWorth)}</p>
        </div>

        <div className="bg-[#191a1e] border border-[#cfc6b4]/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-[#b08a3e]" />
            <span className="text-xs font-medium text-[#86837d]">Metas Ativas</span>
          </div>
          <p className="text-2xl font-bold text-[#b08a3e]">{activeGoals}/{totalGoals}</p>
        </div>

        <div className="bg-[#191a1e] border border-[#cfc6b4]/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-[#9e4a3e]" />
            <span className="text-xs font-medium text-[#86837d]">Alertas</span>
          </div>
          <p className="text-2xl font-bold text-[#9e4a3e]">3</p>
        </div>
      </div>

      {/* Lista de Clientes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#efeae0]">Clientes</h2>
          <button className="text-sm text-[#b08a3e] hover:underline">Ver todos</button>
        </div>

        <div className="space-y-3">
          {clients.length === 0 ? (
            <div className="bg-[#191a1e] border border-[#cfc6b4]/30 rounded-xl p-8 text-center">
              <Users className="w-16 h-16 mx-auto text-[#86837d] mb-4" />
              <h3 className="text-lg font-medium text-[#efeae0] mb-1">Nenhum cliente vinculado</h3>
              <p className="text-[#86837d] text-sm">Convide seus clientes para começar a assessoria</p>
            </div>
          ) : (
            clients.map((client) => {
              const assets = client.accounts
                .filter((a) => a.type !== "CREDIT_CARD")
                .reduce((s, a) => s + Number(a.currentBalance), 0);
              const liabilities = client.accounts
                .filter((a) => a.type === "CREDIT_CARD")
                .reduce((s, a) => s + Number(a.currentBalance), 0);
              const netWorth = assets - liabilities;
              const activeGoalsCount = client.goals.filter((g) => g.status === "IN_PROGRESS").length;
              const accountCount = client.accounts.length;

              return (
                <div
                  key={client.id}
                  className="bg-[#191a1e] border border-[#cfc6b4]/30 rounded-xl p-4 hover:border-[#cfc6b4]/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#16171b] font-bold" style={{ background: "#b08a3e" }}>
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#efeae0]">{client.name}</p>
                        <p className="text-xs text-[#86837d]">{client.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-[#efeae0]">{formatBRL(netWorth)}</p>
                      <p className="text-xs text-[#86837d]">Patrimônio Líquido</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#cfc6b4]/20 flex items-center justify-between text-sm text-[#86837d]">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" />
                      {accountCount} contas
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      {activeGoalsCount} metas ativas
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {client.planTier === "PREMIUM" ? "Premium" : "Gratuito"}
                    </span>
                    <button className="text-[#b08a3e] hover:underline text-sm font-medium">
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
