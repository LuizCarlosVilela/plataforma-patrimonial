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
    // Aceita userId, email ou token diretamente
    const userIdRaw = body.userId || body.email || '';
    const token = body.token;

    if (!userIdRaw) {
      return NextResponse.json({ error: 'userId ou email é obrigatório' }, { status: 400 });
    }

    const userId = await resolveUserId(userIdRaw);
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Simular chamada à API do Open Finance (mock)
    // Em produção, fazer fetch real para https://api.bcb.gov.br/openfinance/...
    const mockAccounts = [
      { id: 'of_account_1', name: 'Conta Corrente Banco X', type: 'CHECKING', balance: 12500.50, currency: 'BRL' },
      { id: 'of_account_2', name: 'Poupança Banco Y', type: 'SAVINGS', balance: 45000.00, currency: 'BRL' },
      { id: 'of_account_3', name: 'Cartão de Crédito', type: 'CREDIT_CARD', balance: -2300.00, currency: 'BRL' },
    ];

    for (const account of mockAccounts) {
      const existing = await prisma.account.findFirst({
        where: { userId, openFinanceItemId: account.id },
      });

      if (existing) {
        await prisma.account.update({
          where: { id: existing.id },
          data: {
            name: account.name,
            type: account.type as any,
            currentBalance: new (require('@prisma/client').Decimal)(account.balance),
            openFinanceItemId: account.id,
            lastSyncedAt: new Date(),
            isManual: false,
          },
        });
      } else {
        await prisma.account.create({
          data: {
            userId,
            name: account.name,
            type: account.type as any,
            currentBalance: new (require('@prisma/client').Decimal)(account.balance),
            initialBalance: new (require('@prisma/client').Decimal)(account.balance),
            openFinanceItemId: account.id,
            lastSyncedAt: new Date(),
            isManual: false,
            currency: account.currency,
          },
        });
      }
    }

    return NextResponse.json({ message: 'Sincronização concluída com sucesso!' });
  } catch (error) {
    console.error('Erro no sync:', error);
    return NextResponse.json(
      { error: 'Erro ao sincronizar', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
