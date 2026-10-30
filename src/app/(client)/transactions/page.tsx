import { getPrisma } from "@/lib/prisma";
import { getAccounts } from "@/server/actions/accounts";
import { Plus, ArrowUpRight, ArrowDownRight, Filter, Calendar } from "lucide-react";
import { formatBRL } from "@/lib/utils";

export default async function TransactionsPage() {
  const prisma = getPrisma();
  const demoUserEmail = "cliente@demo.com.br";
  const user = await prisma.user.findUnique({ where: { email: demoUserEmail } });

  if (!user) {
    return (
      <div className="p-4 text-center text-slate-400">
        <p>Usuário demo não encontrado.</p>
      </div>
    );
  }

  const accounts = await getAccounts(user.id);

  // Mock transactions for demo since server action is not yet available
  const mockTransactions = [
    {
      id: "tx-1",
      account: { name: "Nubank Conta", color: "#820AD1", type: "CHECKING" },
      category: { name: "Alimentação", icon: "Utensils", color: "#F97316" },
      type: "EXPENSE",
      amount: "85.00",
      description: "Supermercado",
      date: "2025-01-15T14:30:00.000Z",
      notes: null,
    },
    {
      id: "tx-2",
      account: { name: "Cartão XP Visa Infinite", color: "#1E1E1E", type: "CREDIT_CARD" },
      category: { name: "Transporte", icon: "Car", color: "#EAB308" },
      type: "EXPENSE",
      amount: "45.50",
      description: "Uber para o trabalho",
      date: "2025-01-14T09:15:00.000Z",
      notes: null,
    },
    {
      id: "tx-3",
      account: { name: "Nubank Conta", color: "#820AD1", type: "CHECKING" },
      category: { name: "Salário & Renda", icon: "Wallet", color: "#10B981" },
      type: "INCOME",
      amount: "3500.00",
      description: "Salário - Tech Solutions Ltda",
      date: "2025-01-10T10:00:00.000Z",
      notes: null,
    },
  ];

  // Use mock transactions for demo purposes
  const transactions = mockTransactions;

  // Agrupar por data
  const groupedTransactions = transactions.reduce(
    (acc: Record<string, typeof transactions>, _tx: typeof transactions[0]) => {
      const dateKey = new Date(_tx.date).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(_tx);
      return acc;
    },
    {} as Record<string, typeof transactions>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Extrato</h1>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-xl font-medium text-sm">
          <Plus className="w-4 h-4" />
          Nova Transação
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 py-2 rounded-xl font-medium text-sm">
          <Filter className="w-4 h-4" />
          Filtrar
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 py-2 rounded-xl font-medium text-sm">
          <Calendar className="w-4 h-4" />
          Período
        </button>
      </div>

      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-8 text-center">
          <ArrowUpRight className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">Nenhuma transação encontrada</h3>
          <p className="text-slate-400 text-sm mb-4">Comece registrando suas despesas e receitas</p>
          <button className="text-indigo-400 hover:underline text-sm">Registrar primeira transação</button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, txs]: [string, typeof transactions]) => {
            const dayTotal = txs.reduce(
              (sum: number, tx: typeof transactions[0]): number => {
                const amount = Number(tx.amount);
                return tx.type === "INCOME" ? sum + amount : sum - amount;
              },
              0
            );

            return (
              <div key={date} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300 capitalize">{date}</span>
                  <span className={`text-sm font-semibold ${dayTotal >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {dayTotal >= 0 ? "+" : ""}{formatBRL(dayTotal)}
                  </span>
                </div>
                <div className="space-y-1">
                  {txs.map((tx: typeof transactions[0]) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between bg-slate-900/70 border border-slate-800 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm
                            ${tx.type === "INCOME" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-500"}
                          `}
                        >
                          {tx.type === "INCOME" ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{tx.description}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            {tx.account.name}
                            {tx.category && (
                              <>
                                <span>•</span>
                                {tx.category.icon && <span className="text-emerald-400">◆</span>}
                                {tx.category.name}
                              </>
                            )}
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
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}