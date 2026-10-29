"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createGoalSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().min(1).max(100),
  targetAmount: z.number().positive(),
  currentAmount: z.number().default(0),
  targetDate: z.string().datetime().optional(),
  categoryTag: z.string().optional(),
});

export async function createGoal(data: z.infer<typeof createGoalSchema>) {
  const validated = createGoalSchema.parse(data);

  const goal = await prisma.goal.create({
    data: {
      userId: validated.userId,
      title: validated.title,
      targetAmount: validated.targetAmount,
      currentAmount: validated.currentAmount,
      targetDate: validated.targetDate ? new Date(validated.targetDate) : null,
      categoryTag: validated.categoryTag,
    },
  });

  revalidatePath("/");
  revalidatePath("/goals");

  return goal;
}

export async function updateGoal(id: string, data: Partial<z.infer<typeof createGoalSchema>>) {
  const updateData: any = { ...data };
  if (data.targetDate) {
    updateData.targetDate = new Date(data.targetDate);
  }

  const goal = await prisma.goal.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/");
  revalidatePath("/goals");

  return goal;
}

export async function deleteGoal(id: string) {
  await prisma.goal.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/goals");
}

export async function getGoals(userId: string) {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addToGoal(goalId: string, amount: number) {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!goal) throw new Error("Meta não encontrada");

  const newAmount = Number(goal.currentAmount) + amount;
  const status = newAmount >= Number(goal.targetAmount) ? "COMPLETED" : "IN_PROGRESS";

  const updated = await prisma.goal.update({
    where: { id: goalId },
    data: {
      currentAmount: newAmount,
      status,
    },
  });

  revalidatePath("/");
  revalidatePath("/goals");

  return updated;
}