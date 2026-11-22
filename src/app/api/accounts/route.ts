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

// Helper: upsert account without failing on missing columns
async function safeUpsertAccount(updates: Record<string, any>, accountId: string) {
  try {
    return await prisma.account.update({
      where: { id: accountId },
      data: updates,
    });
  } catch (err: any) {
    const msg = err?.message || '';
    if (err?.code === 'P2006' ||
        msg.includes('bankId') || msg.includes('bank_id') ||
        msg.includes('creditLimit') || msg.includes('credit_limit') ||
        msg.includes('dueDay') || msg.includes('due_day')) {
      delete updates.bankId;
      delete updates.color;
      delete updates.creditLimit;
      delete updates.dueDay;
      return await prisma.account.update({
        where: { id: accountId },
        data: updates,
      });
    }
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email, userId, name, type, initialBalance = 0,
      currency = 'BRL', bankId, color,
      creditLimit, dueDay,
    } = body;
    const resolvedUserId = await resolveUserId(userId || email);

    if (!resolvedUserId || !name || !type) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const createData: any = {
      userId: resolvedUserId,
      name,
      type: type as any,
      initialBalance: new (require('@prisma/client').Decimal)(initialBalance),
      currentBalance: new (require('@prisma/client').Decimal)(initialBalance),
      currency,
      isManual: true,
    };

    if (bankId) createData.bankId = bankId;
    if (color) createData.color = color;

    if (type === 'CREDIT_CARD') {
      if (creditLimit) createData.creditLimit = new (require('@prisma/client').Decimal)(creditLimit);
      if (dueDay) createData.dueDay = parseInt(dueDay, 10);
    }

    let account;
    try {
      account = await prisma.account.create({ data: createData });
    } catch (err: any) {
      const msg = err?.message || '';
      if (err?.code === 'P2006' ||
          msg.includes('bankId') || msg.includes('bank_id') ||
          msg.includes('creditLimit') || msg.includes('credit_limit') ||
          msg.includes('dueDay') || msg.includes('due_day')) {
        delete createData.bankId;
        delete createData.color;
        delete createData.creditLimit;
        delete createData.dueDay;
        account = await prisma.account.create({ data: createData });
      } else {
        throw err;
      }
    }

    return NextResponse.json({ message: 'Conta criada com sucesso!', account });
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || searchParams.get('email');

    if (!userId) {
      return NextResponse.json({ error: 'userId ou email é obrigatório' }, { status: 400 });
    }

    const resolvedUserId = await resolveUserId(userId);
    if (!resolvedUserId) {
      return NextResponse.json({ accounts: [] });
    }

    const accounts = await prisma.account.findMany({
      where: { userId: resolvedUserId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar contas' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, email, userId, name, type, initialBalance, currency, bankId, color, creditLimit, dueDay } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID da conta é obrigatório' }, { status: 400 });
    }

    const resolvedUserId = await resolveUserId(userId || email);
    if (!resolvedUserId) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verify ownership
    const existing = await prisma.account.findFirst({ where: { id, userId: resolvedUserId } });
    if (!existing) {
      return NextResponse.json({ error: 'Conta não encontrada' }, { status: 404 });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (type !== undefined) updates.type = type as any;
    if (currency !== undefined) updates.currency = currency;
    if (initialBalance !== undefined) updates.initialBalance = new (require('@prisma/client').Decimal)(initialBalance);
    if (bankId !== undefined) updates.bankId = bankId;
    if (color !== undefined) updates.color = color;

    if (type === 'CREDIT_CARD') {
      if (creditLimit !== undefined && creditLimit !== '') updates.creditLimit = new (require('@prisma/client').Decimal)(creditLimit);
      if (dueDay !== undefined) updates.dueDay = parseInt(dueDay, 10);
    }

    const account = await safeUpsertAccount(updates, id);
    return NextResponse.json({ message: 'Conta atualizada!', account });
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar conta', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userIdParam = searchParams.get('userId') || searchParams.get('email');

    if (!id) {
      return NextResponse.json({ error: 'ID da conta é obrigatório' }, { status: 400 });
    }

    const resolvedUserId = await resolveUserId(userIdParam || '');
    if (resolvedUserId) {
      const existing = await prisma.account.findFirst({ where: { id, userId: resolvedUserId } });
      if (!existing) {
        return NextResponse.json({ error: 'Conta não encontrada' }, { status: 404 });
      }
    }

    await prisma.account.delete({ where: { id } });
    return NextResponse.json({ message: 'Conta excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir conta', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
