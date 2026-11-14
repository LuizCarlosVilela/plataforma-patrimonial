import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, type, initialBalance = 0, currency = 'BRL' } = body;

    if (!userId || !name || !type) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios: userId, name, type' },
        { status: 400 }
      );
    }

    const account = await prisma.account.create({
      data: {
        userId,
        name,
        type: type as any,
        initialBalance: new (require('@prisma/client').Decimal)(initialBalance),
        currentBalance: new (require('@prisma/client').Decimal)(initialBalance),
        currency,
        isManual: true,
      },
    });

    return NextResponse.json({
      message: 'Conta criada com sucesso!',
      account,
    });
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
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
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
