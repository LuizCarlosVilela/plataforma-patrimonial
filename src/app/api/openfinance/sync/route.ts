import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId as string;
    const token = body.token as string;

    if (!userId || !token) {
      return NextResponse.json({ error: 'userId e token são obrigatórios' }, { status: 400 });
    }

    // Simular chamada à API do Open Finance
    // Em produção, substituir por chamada real à API
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
