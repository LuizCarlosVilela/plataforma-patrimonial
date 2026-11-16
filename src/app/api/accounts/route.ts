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
    const { email, userId, name, type, initialBalance = 0, currency = 'BRL', bankId, color } = body;
    const resolvedUserId = await resolveUserId(userId || email);

    if (!resolvedUserId || !name || !type) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const account = await prisma.account.create({
      data: {
        userId: resolvedUserId,
        name,
        type: type as any,
        initialBalance: new (require('@prisma/client').Decimal)(initialBalance),
        currentBalance: new (require('@prisma/client').Decimal)(initialBalance),
        currency,
        isManual: true,
        ...(bankId ? { bankId } : {}),
        ...(color ? { color } : {}),
      },
    });

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
