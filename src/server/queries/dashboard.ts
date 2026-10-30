"use server";

import { getPrisma } from "@/lib/prisma";

// Account types defined locally (matching Prisma schema)
type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT' | 'CASH' | 'OTHER';

export async function getDashboardData(userId: string) {
  const prisma = getPrisma();
  const accounts = await prisma.account.findMany({
    where: { userId },
  });

  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const goalsWithProgress = goals.map((goal: { id: string; currentAmount: string; targetAmount: string; status: string }) => ({
    ...goal,
    currentAmount: Number(goal.currentAmount),
    targetAmount: Number(goal.targetAmount),
    progress: Math.min(Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100), 100),
  }));

  const recentTransactions = await prisma.transaction.findMany({
    where: { account: { userId } },
    include: {
      account: { select: { name: true, color: true } },
      category: { select: { name: true, icon: true, color: true } },
    },
    orderBy: { date: "desc" },
    take: 5,
  });

  // Cálculo de Patrimônio Líquido
  let assets = 0;
  let liabilities = 0;

  for (const acc of accounts) {
    const balance = Number(acc.currentBalance);
    if (acc.type === 'CREDIT_CARD') {
      liabilities += balance;
    } else {
      assets += balance;
    }
  }

  const netWorth = assets - liabilities;

  return {
    netWorth,
    totalAssets: assets,
    totalLiabilities: liabilities,
    accounts,
    goals: goalsWithProgress,
    recentTransactions,
  };
}