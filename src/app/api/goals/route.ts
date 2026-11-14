import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, title, targetAmount, targetDate, status = 'IN_PROGRESS' } = body;

    if (!userId || !title || !targetAmount || !targetDate) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios: userId, title, targetAmount, targetDate' },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        targetAmount: new (require('@prisma/client').Decimal)(targetAmount),
        currentAmount: new (require('@prisma/client').Decimal)(0),
        targetDate: new Date(targetDate),
        status,
      },
    });

    return NextResponse.json({
      message: 'Meta criada com sucesso!',
      goal,
    });
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
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: {
        targetDate: 'asc',
      },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar metas' },
      { status: 500 }
    );
  }
}
