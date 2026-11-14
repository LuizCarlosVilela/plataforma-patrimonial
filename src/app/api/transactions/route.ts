import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resolveUserId(emailOrId: string): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: { OR: [{ id: emailOrId }, { email: emailOrId }] },
    select: { id: true },
  });
  return user?.id ?? null;
}

async function resolveAccountId(idOrEmail: string): Promise<string | null> {
  // Try direct ID lookup first
  const acc = await prisma.account.findUnique({
    where: { id: idOrEmail },
    select: { id: true },
  });
  if (acc) return acc.id;

  // Try email -> find user -> find account
  const user = await prisma.user.findFirst({
    where: { email: idOrEmail },
    select: { id: true },
  });
  if (user) {
    const found = await prisma.account.findFirst({
      where: { userId: user.id },
      select: { id: true },
    });
    return found?.id ?? null;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, userId, accountId, type, amount, description, date } = body;
    const resolvedUserId = await resolveUserId(userId || email);

    if (!resolvedUserId || !accountId || !type || !amount || !description || !date) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios: userId/email, accountId, type, amount, description, date' },
        { status: 400 }
      );
    }

    const resolvedAccountId = await resolveAccountId(accountId);
    if (!resolvedAccountId) {
      return NextResponse.json({ error: 'Conta não encontrada' }, { status: 404 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        accountId: resolvedAccountId,
        type: type as 'INCOME' | 'EXPENSE',
        amount: new (require('@prisma/client').Decimal)(amount),
        description,
        date: new Date(date),
        isReconciled: true,
      },
    });

    // Update account balance
    const account = await prisma.account.findUnique({
      where: { id: resolvedAccountId },
      select: { currentBalance: true },
    });

    if (account) {
      const delta = new (require('@prisma/client').Decimal)(amount);
      const newBalance = type === 'INCOME'
        ? account.currentBalance.plus(delta)
        : account.currentBalance.minus(delta);

      await prisma.account.update({
        where: { id: resolvedAccountId },
        data: { currentBalance: newBalance },
      });
    }

    return NextResponse.json({ message: 'Transação criada com sucesso!', transaction });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar transação', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || searchParams.get('email');
    const accountId = searchParams.get('accountId');

    if (!userId) {
      return NextResponse.json({ error: 'userId ou email é obrigatório' }, { status: 400 });
    }

    const resolvedUserId = await resolveUserId(userId);
    if (!resolvedUserId) {
      return NextResponse.json({ transactions: [] });
    }

    const where: any = { account: { userId: resolvedUserId } };
    if (accountId) {
      const resolvedAccId = await resolveAccountId(accountId);
      if (resolvedAccId) where.accountId = resolvedAccId;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { account: true },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar transações' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da transação é obrigatório' }, { status: 400 });
    }

    // Get transaction before deleting to adjust balance
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { account: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
    }

    // Delete the transaction
    await prisma.transaction.delete({ where: { id } });

    // Update account balance
    if (transaction.account) {
      const delta = new (require('@prisma/client').Decimal)(transaction.amount);
      const newBalance = transaction.type === 'INCOME'
        ? transaction.account.currentBalance.minus(delta)
        : transaction.account.currentBalance.plus(delta);

      await prisma.account.update({
        where: { id: transaction.accountId },
        data: { currentBalance: newBalance },
      });
    }

    return NextResponse.json({ message: 'Transação excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir transação' },
      { status: 500 }
    );
  }
}
