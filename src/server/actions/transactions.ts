"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createTransactionSchema = z.object({
  accountId: z.string().cuid(),
  categoryId: z.string().cuid().optional(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  amount: z.number().positive(),
  description: z.string().min(1).max(255),
  date: z.string().datetime(),
  notes: z.string().optional(),
});

export async function createTransaction(data: z.infer<typeof createTransactionSchema>) {
  const validated = createTransactionSchema.parse(data);

  // Buscar conta para validar e atualizar saldo
  const account = await prisma.account.findUnique({
    where: { id: validated.accountId },
  });

  if (!account) {
    throw new Error("Conta não encontrada");
  }

  // Calcular novo saldo baseado no tipo de transação
  const currentBalance = Number(account.currentBalance);
  let newBalance = currentBalance;

  if (validated.type === "INCOME") {
    newBalance += validated.amount;
  } else if (validated.type === "EXPENSE") {
    newBalance -= validated.amount;
  }
  // TRANSFER não altera o saldo total (sai de uma conta e entra em outra)

  // Criar transação e atualizar saldo da conta em uma transação
  const [transaction] = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        accountId: validated.accountId,
        categoryId: validated.categoryId,
        type: validated.type,
        amount: validated.amount,
        description: validated.description,
        date: new Date(validated.date),
        notes: validated.notes,
      },
    }),
    prisma.account.update({
      where: { id: validated.accountId },
      data: { currentBalance: newBalance },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/accounts");
  revalidatePath("/transactions");

  return transaction;
}

export async function deleteTransaction(id: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { account: true },
  });

  if (!transaction) {
    throw new Error("Transação não encontrada");
  }

  // Reverter saldo da conta
  const currentBalance = Number(transaction.account.currentBalance);
  let newBalance = currentBalance;

  if (transaction.type === "INCOME") {
    newBalance -= Number(transaction.amount);
  } else if (transaction.type === "EXPENSE") {
    newBalance += Number(transaction.amount);
  }

  await prisma.$transaction([
    prisma.transaction.delete({ where: { id } }),
    prisma.account.update({
      where: { id: transaction.accountId },
      data: { currentBalance: newBalance },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/accounts");
  revalidatePath("/transactions");
}