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
    const { email, userId, title, targetAmount, currentAmount = 0, targetDate, status = 'IN_PROGRESS', accountIds, categoryTag } = body;
    const resolvedUserId = await resolveUserId(userId || email);

    if (!resolvedUserId || !title || !targetAmount || !targetDate) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios: userId/email, title, targetAmount, targetDate' },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        userId: resolvedUserId,
        title,
        targetAmount: new (require('@prisma/client').Decimal)(targetAmount),
        currentAmount: new (require('@prisma/client').Decimal)(currentAmount),
        targetDate: new Date(targetDate),
        status,
        ...(categoryTag ? { categoryTag } : {}),
      },
    });

    return NextResponse.json({ message: 'Meta criada com sucesso!', goal });
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar meta', details: error instanceof Error ? error.message : String(error) },
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
      return NextResponse.json({ goals: [] });
    }

    let goals;
    try {
      goals = await prisma.goal.findMany({
        where: { userId: resolvedUserId },
        orderBy: { targetDate: 'asc' },
        include: {
          goalAccounts: {
            include: { account: true },
          },
        },
      });
    } catch (err: any) {
      const msg = err?.message || '';
      if (err?.code === 'P2006' ||
          msg.includes('goal_accounts') || msg.includes('goal_account')) {
        // goal_accounts table doesn't exist yet — return simple goals
        goals = await prisma.goal.findMany({
          where: { userId: resolvedUserId },
          orderBy: { targetDate: 'asc' },
        });
      } else {
        throw err;
      }
    }

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar metas' },
      { status: 500 }
    );
  }
}
