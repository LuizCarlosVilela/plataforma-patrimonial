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

    // Build create data without optional fields that may not exist in DB yet
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

    // Try creating with all fields; on failure retry without optional ones
    let account;
    try {
      account = await prisma.account.create({ data: createData });
    } catch (err: any) {
      if (err?.code === 'P2006' || err?.message?.includes('bank_id') || err?.message?.includes('credit_limit') || err?.message?.includes('due_day')) {
        // Columns don't exist yet — retry without them
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
