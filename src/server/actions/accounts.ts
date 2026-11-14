"use server";

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAccounts(userId: string) {
  const prisma = getPrisma();
  return prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      transactions: {
        take: 5,
        orderBy: { date: "desc" },
      },
    },
  });
}

export async function createAccount(data: {
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "INVESTMENT" | "CASH" | "OTHER";
  initialBalance: number;
  currency?: string;
  icon?: string;
  color?: string;
}) {
  const prisma = getPrisma();
  const account = await prisma.account.create({
    data: {
      name: data.name,
      type: data.type,
      currentBalance: data.initialBalance,
      initialBalance: data.initialBalance,
      currency: data.currency || "BRL",
      icon: data.icon,
      color: data.color,
      isManual: true,
    },
  });
  revalidatePath("/accounts");
  return account;
}

export async function syncOpenFinance(userId: string, accounts: Array<{
  id: string;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "INVESTMENT" | "CASH" | "OTHER";
  balance: number;
  currency: string;
}>) {
  const prisma = getPrisma();
  const results = [];

  for (const acc of accounts) {
    const existing = await prisma.account.findFirst({
      where: { userId, openFinanceItemId: acc.id },
    });

    if (existing) {
      const updated = await prisma.account.update({
        where: { id: existing.id },
        data: {
          name: acc.name,
          type: acc.type,
          currentBalance: acc.balance,
          lastSyncedAt: new Date(),
          isManual: false,
        },
      });
      results.push(updated);
    } else {
      const created = await prisma.account.create({
        data: {
          userId,
          name: acc.name,
          type: acc.type,
          currentBalance: acc.balance,
          initialBalance: acc.balance,
          currency: acc.currency,
          openFinanceItemId: acc.id,
          lastSyncedAt: new Date(),
          isManual: false,
        },
      });
      results.push(created);
    }
  }

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  return results;
}
