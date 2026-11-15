import { prisma } from "@/lib/prisma";
import { Users, TrendingUp, Target, ShieldCheck, Search, Filter, MoreVertical, ArrowRight } from "lucide-react";

const formatBRL = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default async function AdvisorClientsPage() {
  // using shared prisma instance
  const advisor = await prisma.user.findUnique({
    where: { email: "consultor@w1.com.br" },
    include: {
      clients: {
        include: {
          accounts: true,
          goals: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!advisor) {
    return (
      <div className="p-4 text-center text-[#86837d]">
        <p>Assessor não encontrado.</p>
      </div>
    );
  }

  const clients = advisor.clients;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#efeae0]">Clientes</h1>
          <p className="text-[#86837d] text-sm">Gerencie sua carteira de clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#16171b] border border-[#cfc6b4]/40 hover:border-[#cfc6b4] text-[#efeae0] px-4 py-2 rounded-xl font-medium text-sm transition-colors">
            <Search className="w-4 h-4" />
            Buscar
          </button>
          <button className="flex items-center gap-2 bg-[#16171b] border border-[#cfc6b4]/40 hover:border-[#cfc6b4] text-[#efeae0] px-4 py-2 rounded-xl font-medium text-sm transition-colors">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 text-[#16171b] px-4 py-2 rounded-xl font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: "#b08a3e" }}>
            <Users className="w-4 h-4" />
            Convidar Cliente
          </button>
        </div>
      </div>

      {/* Lista de Clientes - Table View */}
      <div className="bg-[#191a1e]/70 border border-[#cfc6b4]/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#cfc6b4]/30 bg-[#191a1e]/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#86837d] uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#86837d] uppercase tracking-wider">Patrimônio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#86837d] uppercase tracking-wider">Contas</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#86837d] uppercase tracking-wider">Metas</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#86837d] uppercase tracking-wider">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#86837d] uppercase tracking-wider">Última Atividade</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[#86837d] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfc6b4]/20">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-16 h-16 text-[#86837d]" />
                      <h3 className="text-lg font-medium text-[#efeae0]">Nenhum cliente</h3>
                      <p className="text-[#86837d] text-sm">Convide seu primeiro cliente para começar</p>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map((client) => {
                  const assets = client.accounts
                    .filter((a) => a.type !== "CREDIT_CARD")
                    .reduce((s, a) => s + Number(a.currentBalance), 0);
                  const liabilities = client.accounts
                    .filter((a) => a.type === "CREDIT_CARD")
                    .reduce((s, a) => s + Number(a.currentBalance), 0);
                  const netWorth = assets - liabilities;
                  const activeGoals = client.goals.filter((g) => g.status === "IN_PROGRESS").length;
                  const completedGoals = client.goals.filter((g) => g.status === "COMPLETED").length;

                  return (
                    <tr key={client.id} className="hover:bg-[rgba(207,198,180,0.04)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#16171b] font-bold" style={{ background: "#b08a3e" }}>
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-[#efeae0]">{client.name}</p>
                            <p className="text-xs text-[#86837d]">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-semibold ${netWorth >= 0 ? "text-[#4f6b52]" : "text-[#9e4a3e]"}`}>
                          {formatBRL(netWorth)}
                        </p>
                        <p className="text-xs text-[#86837d]">{client.accounts.length} contas</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[#efeae0] font-medium">{client.accounts.length}</span>
                          <span className="text-[#86837d]">ativas</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-3.5 h-3.5 text-[#b08a3e]" />
                          <span>{activeGoals} ativas</span>
                          {completedGoals > 0 && (
                            <span className="text-[#4f6b52] text-xs">({completedGoals} concluídas)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            client.planTier === "PREMIUM"
                              ? "bg-[rgba(176,138,62,0.15)] text-[#b08a3e] border border-[rgba(176,138,62,0.3)]"
                              : "bg-[#16171b] text-[#86837d] border border-[#cfc6b4]/40"
                          }`}
                        >
                          {client.planTier === "PREMIUM" ? "Premium" : "Gratuito"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#86837d]">
                        {client.accounts.length > 0 ? `${client.accounts.length} contas` : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-[#86837d] hover:text-[#efeae0] hover:bg-[#16171b] rounded-lg transition-colors" title="Ver detalhes">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-[#86837d] hover:text-[#efeae0] hover:bg-[#16171b] rounded-lg transition-colors" title="Mais opções">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
