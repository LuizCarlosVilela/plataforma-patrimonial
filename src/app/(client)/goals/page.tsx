import { getGoals } from "@/server/actions/goals";
import { getPrisma } from "@/lib/prisma";
import { Plus, Target, CheckCircle, Clock, PauseCircle, TrendingUp } from "lucide-react";
import { formatBRL } from "@/lib/utils";

const statusIcons = {
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle,
  PAUSED: PauseCircle,
};

const statusLabels = {
  IN_PROGRESS: "Em Progresso",
  COMPLETED: "Concluída",
  PAUSED: "Pausada",
};

const statusColors = {
  IN_PROGRESS: "text-[#b08a3e] bg-[rgba(176,138,62,0.1)] border-[rgba(176,138,62,0.3)]",
  COMPLETED: "text-[#4f6b52] bg-[rgba(79,107,82,0.1)] border-[rgba(79,107,82,0.3)]",
  PAUSED: "text-[#7e6e52] bg-[rgba(126,110,82,0.15)] border-[rgba(126,110,82,0.3)]",
};

export default async function GoalsPage() {
  const prisma = getPrisma();
  const demoUserEmail = "cliente@demo.com.br";
  const user = await prisma.user.findUnique({ where: { email: demoUserEmail } });

  if (!user) {
    return (
      <div className="p-4 text-center text-[#86837d]">
        <p>Usuário demo não encontrado.</p>
        <p className="text-sm mt-2">Execute: <code className="bg-[#16171b] px-2 py-1 rounded border border-[#cfc6b4]">npx prisma db seed</code></p>
      </div>
    );
  }

  const goals = await getGoals(user.id);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#efeae0]">Minhas Metas</h1>
        <button className="flex items-center gap-2 py-2 px-4 rounded-xl font-medium text-sm transition-all hover:shadow-gold active:scale-[0.98] text-[#16171b]"
                 style={{ background: "#b08a3e" }}>
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-8 text-center">
            <Target className="w-16 h-16 mx-auto text-[#86837d] mb-4" />
            <h3 className="text-lg font-medium text-[#efeae0] mb-1">Nenhuma meta cadastrada</h3>
            <p className="text-[#86837d] text-sm mb-4">Crie metas para sua reserva de emergência, viagens, investimentos...</p>
            <button className="text-[#b08a3e] hover:text-[#b08a3e] text-sm font-medium transition-colors">Criar primeira meta</button>
          </div>
        ) : (
          goals.map((goal: { id: string; title: string; currentAmount: number; targetAmount: number; status: string; categoryTag: string; targetDate: Date }) => {
            const current = Number(goal.currentAmount);
            const target = Number(goal.targetAmount);
            const progress = Math.min(Math.round((current / target) * 100), 100);
            const StatusIcon = statusIcons[goal.status as keyof typeof statusIcons];
            const isCompleted = goal.status === "COMPLETED";
            const colorKey = goal.status as keyof typeof statusColors;

            return (
              <div
                key={goal.id}
                className={`bg-[#191a1e]/70 border rounded-xl p-5 ${statusColors[colorKey]}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#efeae0]">{goal.title}</h3>
                      <span className="text-xs font-bold text-[#efeae0]">{progress}%</span>
                    </div>
                    {goal.categoryTag && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-[#16171b] border border-[#cfc6b4] rounded text-[#86837d]">
                        {String(goal.categoryTag)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {StatusIcon && <StatusIcon className={`w-4 h-4 ${statusColors[colorKey].split(" ")[0]}`} />}
                  </div>
                </div>

                <div className="w-full bg-[#16171b] h-3 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${isCompleted ? "bg-[#4f6b52]" : "bg-[#b08a3e]"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-[#86837d]">
                    <span>Atual: <span className="text-[#efeae0] font-medium">{formatBRL(current)}</span></span>
                    <span>Meta: <span className="text-[#efeae0] font-medium">{formatBRL(target)}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[#86837d]">
                    {goal.targetDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(goal.targetDate).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                    <span className="capitalize text-xs">{statusLabels[goal.status as keyof typeof statusLabels]}</span>
                  </div>
                </div>

                {!isCompleted && (
                  <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm text-[#16171b] transition-all hover:bg-[#b08a3e]"
                          style={{ background: "#b08a3e" }}>
                    <Plus className="w-4 h-4" />
                    Adicionar valor
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
