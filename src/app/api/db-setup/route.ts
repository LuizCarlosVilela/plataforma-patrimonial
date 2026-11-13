import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function executeSql(sql: string): Promise<void> {
  await prisma.$executeRawUnsafe(sql);
}

export async function GET() {
  try {
    // Verificar conexão
    await prisma.$queryRaw`SELECT 1`;

    // Criar tabelas se não existirem (comandos individuais)
    const tables = [
      `CREATE TABLE IF NOT EXISTS "users" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT,
        avatar_url TEXT,
        role TEXT NOT NULL DEFAULT 'CLIENT',
        plan_tier TEXT NOT NULL DEFAULT 'FREE',
        advisor_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL
      )`,

      `CREATE TABLE IF NOT EXISTS "accounts" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        initial_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
        current_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'BRL',
        color TEXT,
        icon TEXT,
        is_manual BOOLEAN NOT NULL DEFAULT true,
        open_finance_item_id TEXT,
        last_synced_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL
      )`,

      `CREATE TABLE IF NOT EXISTS "categories" (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES "users"(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        parent_id TEXT REFERENCES "categories"(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL
      )`,

      `CREATE TABLE IF NOT EXISTS "transactions" (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL REFERENCES "accounts"(id) ON DELETE CASCADE,
        category_id TEXT REFERENCES "categories"(id) ON DELETE SET NULL,
        type TEXT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        external_id TEXT UNIQUE,
        is_reconciled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL
      )`,

      `CREATE TABLE IF NOT EXISTS "goals" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        target_amount DECIMAL(15,2) NOT NULL,
        current_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
        target_date DATE,
        status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
        category_tag TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL
      )`,
    ];

    for (const sql of tables) {
      await executeSql(sql);
    }

    // Criar índices
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON "users"(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_advisor ON "users"(advisor_id)',
      'CREATE INDEX IF NOT EXISTS idx_accounts_user ON "accounts"(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_categories_user ON "categories"(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_transactions_account ON "transactions"(account_id)',
      'CREATE INDEX IF NOT EXISTS idx_goals_user ON "goals"(user_id)',
    ];

    for (const sql of indexes) {
      await executeSql(sql);
    }

    return NextResponse.json({
      message: '✅ Banco configurado com sucesso! Tabelas criadas.',
      ready: true
    });
  } catch (error) {
    console.error('Erro ao configurar banco:', error);
    return NextResponse.json(
      { error: 'Erro ao configurar banco', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
