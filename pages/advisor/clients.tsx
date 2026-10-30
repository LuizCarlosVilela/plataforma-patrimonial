import { getPrisma } from "@/lib/prisma";
import { Users, TrendingUp, Target, ShieldCheck, Search, Filter, MoreVertical, ArrowRight } from "lucide-react";

const formatBRL = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default async function AdvisorClientsPage() {
  const prisma = getPrisma();
  const advisor = await prisma.user.findUnique({
    where: { email: "consultor@w1.com.br" },
    include: {
      clients: {
        include: {
          accounts: true,
          goals: true,
          _count: { select: { transactions: true } },
        },
        orderBy: { createdAt: "desc" },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-slate-400 text-sm">Gerencie sua carteira de clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-xl font-medium text-sm">
            <Search className="w-4 h-4" />
            Buscar
          </button>
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-xl font-medium text-sm">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-medium text-sm">
            <Users className="w-4 h-4" />
            Convidar Cliente
          </button>
        </div>
      </div>

      {/* Lista de Clientes - Table View */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Patrimônio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Contas</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Metas</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Última Atividade</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-16 h-16 text-slate-600" />
                      <h3 className="text-lg font-medium text-white">Nenhum cliente</h3>
                      <p className="text-slate-400 text-sm">Convide seu primeiro cliente para começar</p>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map((client: { id: string; name: string; email: string; planTier: string; accounts: Array<{ type: string; currentBalance: string }>; goals: Array<{ status: string }> }) => {
                  const assets = client.accounts
                    .filter((a): a is { type: string; currentBalance: string } => a.type !== "CREDIT_CARD")
                    .reduce((s, a): number => s + Number(a.currentBalance), 0 as number);
                  const liabilities = client.accounts
                    .filter((a): a is { type: string; currentBalance: string } => a.type === "CREDIT_CARD")
                    .reduce((s, a): number => s + Number(a.currentBalance), 0 as number);
                  const netWorth = assets - liabilities;
                  const activeGoals = client.goals.filter((g: { status: string }) => g.status === "IN_PROGRESS").length;
                  const completedGoals = client.goals.filter((g: { status: string }) => g.status === "COMPLETED").length;

                  return (
                    <tr key={client.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{client.name}</p>
                            <p className="text-xs text-slate-400">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-semibold ${netWorth >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {formatBRL(netWorth)}
                        </p>
                        <p className="text-xs text-slate-500">{client.accounts.length} contas</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-white font-medium">{client.accounts.length}</span>
                          <span className="text-slate-500">ativas</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-3.5 h-3.5 text-amber-400" />
                          <span>{activeGoals} ativas</span>
                          {completedGoals > 0 && (
                            <span className="text-emerald-400 text-xs">({completedGoals} concluídas)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            client.planTier === "PREMIUM"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {client.planTier === "PREMIUM" ? "Premium" : "Gratuito"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {client.accounts.length > 0 ? `${client.accounts.length} contas` : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Ver detalhes">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Mais opções">
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