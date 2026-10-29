import { getGoals } from "@/server/actions/goals";
import { prisma } from "@/lib/prisma";
import { Plus, Target, CheckCircle, Clock, PauseCircle } from "lucide-react";
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
  IN_PROGRESS: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  COMPLETED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  PAUSED: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

export default async function GoalsPage() {
  const demoUserEmail = "cliente@demo.com.br";
  const user = await prisma.user.findUnique({ where: { email: demoUserEmail } });

  if (!user) {
    return (
      <div className="p-4 text-center text-slate-400">
        <p>Usuário demo não encontrado.</p>
      </div>
    );
  }

  const goals = await getGoals(user.id);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Minhas Metas</h1>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-xl font-medium text-sm">
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-8 text-center">
            <Target className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">Nenhuma meta cadastrada</h3>
            <p className="text-slate-400 text-sm mb-4">Crie metas para sua reserva de emergência, viagens, investimentos...</p>
            <button className="text-indigo-400 hover:underline text-sm">Criar primeira meta</button>
          </div>
        ) : (
          goals.map((goal) => {
            const current = Number(goal.currentAmount);
            const target = Number(goal.targetAmount);
            const progress = Math.min(Math.round((current / target) * 100), 100);
            const StatusIcon = statusIcons[goal.status];
            const isCompleted = goal.status === "COMPLETED";

            return (
              <div
                key={goal.id}
                className={`bg-slate-900/70 border rounded-xl p-5 ${statusColors[goal.status]}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{goal.title}</h3>
                      <span className="text-xs font-bold">{progress}%</span>
                    </div>
                    {goal.categoryTag && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-slate-800 rounded text-slate-400">
                        {goal.categoryTag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusIcon className={`w-4 h-4 ${statusColors[goal.status].split(" ")[0]}`} />
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${isCompleted ? "bg-emerald-500" : "bg-indigo-500"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>Atual: <span className="text-white font-medium">{formatBRL(current)}</span></span>
                    <span>Meta: <span className="text-white font-medium">{formatBRL(target)}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    {goal.targetDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(goal.targetDate).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                    <span className="capitalize text-xs">{statusLabels[goal.status]}</span>
                  </div>
                </div>

                {!isCompleted && (
                  <button className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium text-sm transition-colors">
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