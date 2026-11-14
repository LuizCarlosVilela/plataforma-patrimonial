import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, accountId, type, amount, description, date } = body;

    if (!userId || !accountId || !type || !amount || !description || !date) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios: userId, accountId, type, amount, description, date' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        accountId,
        type: type as 'INCOME' | 'EXPENSE',
        amount: new (require('@prisma/client').Decimal)(amount),
        description,
        date: new Date(date),
        isReconciled: true,
      },
    });

    // Atualizar saldo da conta
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (account) {
      const newBalance = type === 'INCOME'
        ? account.currentBalance.plus(new (require('@prisma/client').Decimal)(amount))
        : account.currentBalance.minus(new (require('@prisma/client').Decimal)(amount));

      await prisma.account.update({
        where: { id: accountId },
        data: { currentBalance: newBalance },
      });
    }

    return NextResponse.json({
      message: 'Transação criada com sucesso!',
      transaction,
    });
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
    const userId = searchParams.get('userId');
    const accountId = searchParams.get('accountId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const where: any = { account: { userId } };
    if (accountId) {
      where.accountId = accountId;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: true,
      },
      orderBy: {
        date: 'desc',
      },
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
