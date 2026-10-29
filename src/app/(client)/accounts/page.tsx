import { getAccounts } from "@/server/actions/accounts";
import { prisma } from "@/lib/prisma";
import { Plus, CreditCard, Landmark, TrendingUp, Wallet } from "lucide-react";

const accountIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  CreditCard,
  Landmark,
  TrendingUp,
  Wallet,
};

export default async function AccountsPage() {
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

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Minhas Contas</h1>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-xl font-medium text-sm">
          <Plus className="w-4 h-4" />
          Nova Conta
        </button>
      </div>

      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-8 text-center">
            <CreditCard className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">Nenhuma conta cadastrada</h3>
            <p className="text-slate-400 text-sm mb-4">Adicione suas contas para começar a controlar seu patrimônio</p>
            <button className="text-indigo-400 hover:underline text-sm">Adicionar primeira conta</button>
          </div>
        ) : (
          accounts.map((account) => {
            const Icon = account.icon && accountIcons[account.icon] ? accountIcons[account.icon] : CreditCard;
            const isCreditCard = account.type === "CREDIT_CARD";
            const balanceColor = isCreditCard ? "text-rose-400" : "text-emerald-400";

            return (
              <div
                key={account.id}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                      account.color ? `bg-[${account.color}]` : "bg-indigo-600"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{account.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{account.type.toLowerCase().replace("_", " ")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${balanceColor}`}>
                    {formatBRL(Number(account.currentBalance))}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isCreditCard ? "Fatura em aberto" : "Saldo disponível"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}