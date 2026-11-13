import { getAccounts } from "@/server/actions/accounts";
import { getPrisma } from "@/lib/prisma";
import { Plus, CreditCard, Landmark, TrendingUp, Wallet } from "lucide-react";
import { formatBRL } from "@/lib/utils";

const accountIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  CreditCard,
  Landmark,
  TrendingUp,
  Wallet,
};

export default async function AccountsPage() {
  const prisma = getPrisma();
  const demoUserEmail = "cliente@demo.com.br";
  const user = await prisma.user.findUnique({ where: { email: demoUserEmail } });

  if (!user) {
    return (
      <div className="p-4 text-center text-[#86837d]">
        <p>Usuário demo não encontrado.</p>
      </div>
    );
  }

  const accounts = await getAccounts(user.id);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#efeae0]">Minhas Contas</h1>
        <button className="flex items-center gap-2 py-2 px-4 rounded-xl font-medium text-sm transition-all hover:shadow-gold active:scale-[0.98] text-[#16171b]"
                 style={{ background: "#b08a3e" }}>
          <Plus className="w-4 h-4" />
          Nova Conta
        </button>
      </div>

      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-8 text-center">
            <CreditCard className="w-16 h-16 mx-auto text-[#86837d] mb-4" />
            <h3 className="text-lg font-medium text-[#efeae0] mb-1">Nenhuma conta cadastrada</h3>
            <p className="text-[#86837d] text-sm mb-4">Adicione suas contas para começar a controlar seu patrimônio</p>
            <button className="text-[#b08a3e] hover:text-[#c49a3e] text-sm font-medium transition-colors">Adicionar primeira conta</button>
          </div>
        ) : (
          accounts.map((account: { id: string; name: string; type: string; currentBalance: string; color?: string; icon?: string }) => {
            const Icon = account.icon && accountIcons[account.icon] ? accountIcons[account.icon] : CreditCard;
            const isCreditCard = account.type === "CREDIT_CARD";
            const balanceColor = isCreditCard ? "text-[#9e4a3e]" : "text-[#4f6b52]";

            return (
              <div
                key={account.id}
                className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-[#16171b] ${
                      account.color ? "" : "bg-[#b08a3e]"
                    }`}
                    style={!account.color ? undefined : { backgroundColor: account.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-[#efeae0]">{account.name}</p>
                    <p className="text-xs text-[#86837d] capitalize">{account.type.toLowerCase().replace("_", " ")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${balanceColor}`}>
                    {formatBRL(Number(account.currentBalance))}
                  </p>
                  <p className="text-xs text-[#86837d]">
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
