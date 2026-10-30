"use server";

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createAccountSchema = z.object({
  userId: z.string().cuid(),
  name: z.string().min(1).max(100),
  type: z.enum(["CHECKING", "SAVINGS", "CREDIT_CARD", "INVESTMENT", "CASH", "OTHER"]),
  initialBalance: z.number().default(0),
  color: z.string().optional(),
  icon: z.string().optional(),
  currency: z.string().default("BRL"),
});

export async function createAccount(data: z.infer<typeof createAccountSchema>) {
  const validated = createAccountSchema.parse(data);
  const prisma = getPrisma();
  const account = await prisma.account.create({
    data: {
      userId: validated.userId,
      name: validated.name,
      type: validated.type,
      initialBalance: validated.initialBalance,
      currentBalance: validated.initialBalance,
      color: validated.color,
      icon: validated.icon,
      currency: validated.currency,
    },
  });

  revalidatePath("/");
  revalidatePath("/accounts");

  return account;
}

export async function updateAccount(id: string, data: Partial<z.infer<typeof createAccountSchema>>) {
  const prisma = getPrisma();
  const account = await prisma.account.update({
    where: { id },
    data,
  });

  revalidatePath("/");
  revalidatePath("/accounts");

  return account;
}

export async function deleteAccount(id: string) {
  const prisma = getPrisma();
  await prisma.account.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/accounts");
}

export async function getAccounts(userId: string) {
  const prisma = getPrisma();
  return prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}