# 🚀 PLANO TÉCNICO DE IMPLEMENTAÇÃO: CLONE S1NC (W1) - MVP WEB & MOBILE-READY

> **Instruções para o Agente Claude Code:**  
> Siga este plano passo a passo de forma incremental. Execute os comandos de setup, crie a estrutura de diretórios, instale dependências, configure as variáveis de ambiente e implemente cada módulo com tipagem estrita e boas práticas.

---

## 🎯 1. Visão Geral do Produto e Arquitetura

O **S1NC (W1 Consultoria)** é uma plataforma de Gestão Financeira Pessoal (PFM) e Planejamento Patrimonial que atende tanto o usuário final (Cliente) quanto o Assessor Financeiro (Advisor).

### Pilares Fundamentais do MVP:
1. **Controle Financeiro & Patrimônio Líquido (Net Worth):**  
   $$\text{Patrimônio Líquido} = \sum(\text{Contas Correntes} + \text{Investimentos} + \text{Dinheiro}) - \sum(\text{Faturas de Cartão})$$
2. **Entrada Manual Ágil (Mobile-First):** Lançamento rápido de despesas/receitas com categorização e vínculo a contas.
3. **Metas & Planejamento (Pilar W1):** Reserva de emergência e metas de curto/médio prazo com progresso percentual.
4. **Painel do Consultor (Advisor Mode):** Permite ao assessor visualizar a carteira de clientes vinculados e auditar os dados financeiros.
5. **Preparação para Fase 2:** Schemas e contratos prontos para Open Finance (Pluggy/Belvo) e app nativo (React Native / Expo).

### Stack Tecnológica:
- **Framework:** Next.js (App Router, React 19 / 18, TypeScript)
- **Estilização & UI:** Tailwind CSS, Lucide React, Radix UI / Shadcn UI
- **Banco de Dados & ORM:** PostgreSQL (Supabase) + Prisma ORM
- **Validação & Contratos:** Zod
- **Deploy:** Vercel (Web / API Routes / Server Actions) + Supabase (PostgreSQL / Auth)

---

## 📁 2. Estrutura de Diretórios Recomendada

```text
sync-mvp/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   │   ├── (advisor)/
│   │   │   └── advisor/
│   │   │       ├── clients/
│   │   │       └── page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (client)/
│   │   │   ├── accounts/
│   │   │   │   └── page.tsx
│   │   │   ├── goals/
│   │   │   │   └── page.tsx
│   │   │   ├── transactions/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx           # Dashboard Principal (Mobile-First)
│   │   ├── api/
│   │   │   └── trpc/ ou routes...
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── mobile-bottom-nav.tsx
│   │   │   └── top-header.tsx
│   │   ├── shared/
│   │   │   ├── net-worth-card.tsx
│   │   │   ├── transaction-modal.tsx
│   │   │   └── goal-progress-card.tsx
│   │   └── ui/                     # Componentes Shadcn UI
│   ├── lib/
│   │   ├── prisma.ts               # Singleton do PrismaClient
│   │   └── utils.ts
│   ├── server/
│   │   ├── actions/
│   │   │   ├── accounts.ts
│   │   │   ├── goals.ts
│   │   │   └── transactions.ts
│   │   └── queries/
│   │       └── dashboard.ts
│   └── types/
│       └── index.ts
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## ⚙️ 3. Passo a Passo de Execução para Claude Code

### Passo 1: Inicialização do Projeto e Dependências
Execute os seguintes comandos no terminal:

```bash
# 1. Criar aplicação Next.js com App Router e TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# 2. Instalar dependências core de backend e validação
npm install @prisma/client @tanstack/react-query zod date-fns lucide-react clsx tailwind-merge class-variance-authority

# 3. Instalar dependências de desenvolvimento
npm install -D prisma tsx @types/node

# 4. Inicializar componentes Shadcn UI
npx shadcn@latest init
```

---

### Passo 2: Configuração de Variáveis de Ambiente (`.env`)
Crie o arquivo `.env` com suporte ao Supabase:

```env
# Conexão Pooler da Vercel para o Supabase (Porta 6543)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Conexão direta para Migrations do Prisma (Porta 5432)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Next Auth / Chaves de sessão
NEXTAUTH_SECRET="sua-chave-secreta-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

---

### Passo 3: Criação do `prisma/schema.prisma`
Gere o schema com suporte a patrimônio, contas, metas e modelo W1 Consultoria:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  CLIENT
  ADVISOR
  ADMIN
}

enum PlanTier {
  FREE
  PREMIUM
}

enum AccountType {
  CHECKING
  SAVINGS
  CREDIT_CARD
  INVESTMENT
  CASH
  OTHER
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}

enum GoalStatus {
  IN_PROGRESS
  COMPLETED
  PAUSED
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  avatarUrl     String?   @map("avatar_url")
  role          UserRole  @default(CLIENT)
  planTier      PlanTier  @default(FREE) @map("plan_tier")

  advisorId     String?   @map("advisor_id")
  advisor       User?     @relation("AdvisorClients", fields: [advisorId], references: [id], onDelete: SetNull)
  clients       User[]    @relation("AdvisorClients")

  accounts      Account[]
  categories    Category[]
  goals         Goal[]
  auditLogs     AdvisorAuditLog[]

  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@index([advisorId])
  @@map("users")
}

model Account {
  id                String       @id @default(cuid())
  userId            String       @map("user_id")
  user              User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  name              String
  type              AccountType
  initialBalance    Decimal      @default(0.00) @db.Decimal(15, 2) @map("initial_balance")
  currentBalance    Decimal      @default(0.00) @db.Decimal(15, 2) @map("current_balance")
  currency          String       @default("BRL")
  color             String?
  icon              String?

  isManual          Boolean      @default(true) @map("is_manual")
  openFinanceItemId String?      @map("open_finance_item_id")
  lastSyncedAt      DateTime?    @map("last_synced_at")

  transactions      Transaction[]

  createdAt         DateTime     @default(now()) @map("created_at")
  updatedAt         DateTime     @updatedAt @map("updated_at")

  @@index([userId])
  @@map("accounts")
}

model Category {
  id            String        @id @default(cuid())
  userId        String?       @map("user_id")
  user          User?         @relation(fields: [userId], references: [id], onDelete: Cascade)

  name          String
  icon          String?
  color         String?
  parentId      String?       @map("parent_id")
  parent        Category?     @relation("SubCategories", fields: [parentId], references: [id], onDelete: Cascade)
  subCategories Category[]    @relation("SubCategories")

  transactions  Transaction[]

  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  @@index([userId])
  @@map("categories")
}

model Transaction {
  id           String          @id @default(cuid())
  accountId    String          @map("account_id")
  account      Account         @relation(fields: [accountId], references: [id], onDelete: Cascade)

  categoryId   String?         @map("category_id")
  category     Category?       @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  type         TransactionType
  amount       Decimal         @db.Decimal(15, 2)
  description  String
  date         DateTime        @db.Date
  notes        String?

  externalId   String?         @unique @map("external_id")
  isReconciled Boolean         @default(true) @map("is_reconciled")

  createdAt    DateTime        @default(now()) @map("created_at")
  updatedAt    DateTime        @updatedAt @map("updated_at")

  @@index([accountId, date])
  @@index([categoryId])
  @@map("transactions")
}

model Goal {
  id            String      @id @default(cuid())
  userId        String      @map("user_id")
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  title         String
  targetAmount  Decimal     @db.Decimal(15, 2) @map("target_amount")
  currentAmount Decimal     @default(0.00) @db.Decimal(15, 2) @map("current_amount")
  targetDate    DateTime?   @map("target_date") @db.Date
  status        GoalStatus  @default(IN_PROGRESS)
  categoryTag   String?     @map("category_tag")

  createdAt     DateTime    @default(now()) @map("created_at")
  updatedAt     DateTime    @updatedAt @map("updated_at")

  @@index([userId])
  @@map("goals")
}

model AdvisorAuditLog {
  id         String   @id @default(cuid())
  advisorId  String   @map("advisor_id")
  clientId   String   @map("client_id")
  client     User     @relation(fields: [clientId], references: [id], onDelete: Cascade)
  action     String
  accessedAt DateTime @default(now()) @map("accessed_at")

  @@index([advisorId, clientId])
  @@map("advisor_audit_logs")
}
```

---

### Passo 4: Seed do Banco de Dados (`prisma/seed.ts`)
Configurar o seed inicial com categorias padrão brasileiras e um usuário demo:

```typescript
import { PrismaClient, AccountType, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // 1. Criar Categorias Padrão
  const defaultCategories = [
    { id: "cat-alimentacao", name: "Alimentação", icon: "Utensils", color: "#F97316" },
    { id: "cat-moradia", name: "Moradia", icon: "Home", color: "#3B82F6" },
    { id: "cat-transporte", name: "Transporte", icon: "Car", color: "#EAB308" },
    { id: "cat-saude", name: "Saúde", icon: "HeartPulse", color: "#EF4444" },
    { id: "cat-lazer", name: "Lazer & Cultura", icon: "Gamepad2", color: "#8B5CF6" },
    { id: "cat-renda", name: "Salário & Renda", icon: "Wallet", color: "#10B981" },
    { id: "cat-investimentos", name: "Investimentos", icon: "TrendingUp", color: "#06B6D4" },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        userId: null,
      },
    });
  }

  // 2. Criar Consultor e Cliente Demo
  const advisor = await prisma.user.upsert({
    where: { email: "consultor@w1.com.br" },
    update: {},
    create: {
      email: "consultor@w1.com.br",
      name: "Guilherme Consultor (W1)",
      role: "ADVISOR",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "cliente@demo.com.br" },
    update: {},
    create: {
      email: "cliente@demo.com.br",
      name: "João Silva",
      role: "CLIENT",
      advisorId: advisor.id,
    },
  });

  // 3. Criar Contas Iniciais do Cliente
  const checking = await prisma.account.create({
    data: {
      userId: client.id,
      name: "Nubank Conta",
      type: AccountType.CHECKING,
      initialBalance: 2500.0,
      currentBalance: 2500.0,
      color: "#820AD1",
      icon: "Landmark",
    },
  });

  const creditCard = await prisma.account.create({
    data: {
      userId: client.id,
      name: "Cartão XP Visa Infinite",
      type: AccountType.CREDIT_CARD,
      initialBalance: 0.0,
      currentBalance: 1250.0, // Fatura em aberto (Passivo)
      color: "#1E1E1E",
      icon: "CreditCard",
    },
  });

  // 4. Meta de Reserva de Emergência
  await prisma.goal.create({
    data: {
      userId: client.id,
      title: "Reserva de Emergência (6 Meses)",
      targetAmount: 30000.0,
      currentAmount: 12000.0,
      categoryTag: "Segurança",
    },
  });

  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Adicione ao `package.json`:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

---

### Passo 5: Singleton do Prisma Client (`src/lib/prisma.ts`)
Evita conexões excessivas durante o Fast Refresh do Next.js:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

### Passo 6: Server Action com Cálculo de Patrimônio Líquido (`src/server/queries/dashboard.ts`)

```typescript
"use server";

import { prisma } from "@/lib/prisma";
import { AccountType } from "@prisma/client";

export async function getDashboardData(userId: string) {
  const accounts = await prisma.account.findMany({
    where: { userId },
  });

  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const recentTransactions = await prisma.transaction.findMany({
    where: { account: { userId } },
    include: {
      account: { select: { name: true, color: true } },
      category: { select: { name: true, icon: true, color: true } },
    },
    orderBy: { date: "desc" },
    take: 5,
  });

  // Cálculo de Patrimônio Líquido
  let assets = 0;
  let liabilities = 0;

  for (const acc of accounts) {
    const balance = Number(acc.currentBalance);
    if (acc.type === AccountType.CREDIT_CARD) {
      liabilities += balance;
    } else {
      assets += balance;
    }
  }

  const netWorth = assets - liabilities;

  return {
    netWorth,
    totalAssets: assets,
    totalLiabilities: liabilities,
    accounts,
    goals,
    recentTransactions,
  };
}
```

---

### Passo 7: Interface Mobile-First (`src/app/(client)/page.tsx`)
A interface deve priorizar a visualização em smartphones (max-w-md centralizado), usando cards compactos e barra inferior de navegação:

```tsx
import { getDashboardData } from "@/server/queries/dashboard";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Plus, ShieldCheck } from "lucide-react";

export default async function DashboardPage() {
  // Demo com usuário inicial
  const demoUserId = "cliente@demo.com.br"; 
  const user = await prisma.user.findUnique({ where: { email: demoUserId } });
  
  if (!user) return <div className="p-4 text-center">Execute o seed do Prisma.</div>;
  const data = await getDashboardData(user.id);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-24 max-w-md mx-auto px-4 pt-6">
      {/* Top Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-medium text-slate-400">Olá,</span>
          <h1 className="text-lg font-bold text-white">{user.name}</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>W1 Sync</span>
        </div>
      </header>

      {/* Card Principal: Patrimônio Líquido */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl mb-6">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Patrimônio Líquido
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-1 mb-4">
          {formatBRL(data.netWorth)}
        </h2>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
          <div>
            <div className="flex items-center gap-1 text-slate-400 text-xs mb-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ativos (Soma)</span>
            </div>
            <p className="text-sm font-semibold text-slate-200">{formatBRL(data.totalAssets)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-slate-400 text-xs mb-0.5">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
              <span>Faturas & Passivos</span>
            </div>
            <p className="text-sm font-semibold text-slate-200">{formatBRL(data.totalLiabilities)}</p>
          </div>
        </div>
      </section>

      {/* Ações Rápidas */}
      <section className="grid grid-cols-2 gap-3 mb-6">
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white py-3 rounded-xl font-medium text-sm shadow-md">
          <Plus className="w-4 h-4" />
          <span>Nova Despesa</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 active:scale-95 transition-all text-slate-200 py-3 rounded-xl font-medium text-sm">
          <span>+ Nova Receita</span>
        </button>
      </section>

      {/* Metas Patrimoniais (Pilar W1) */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-slate-200">Planejamento & Metas</h3>
          <span className="text-xs text-indigo-400">Ver todas</span>
        </div>
        <div className="space-y-3">
          {data.goals.map((goal) => {
            const current = Number(goal.currentAmount);
            const target = Number(goal.targetAmount);
            const progress = Math.min(Math.round((current / target) * 100), 100);

            return (
              <div key={goal.id} className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-300">{goal.title}</span>
                  <span className="text-xs font-bold text-indigo-400">{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
                  <span>Atual: {formatBRL(current)}</span>
                  <span>Meta: {formatBRL(target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Navigation Fixa (Mobile Style) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-6 py-3 flex justify-between items-center text-xs text-slate-400">
        <button className="flex flex-col items-center gap-1 text-indigo-400 font-semibold">
          <TrendingUp className="w-5 h-5" />
          <span>Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-slate-200">
          <ArrowUpRight className="w-5 h-5" />
          <span>Extrato</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-slate-200">
          <ShieldCheck className="w-5 h-5" />
          <span>Assessor</span>
        </button>
      </nav>
    </main>
  );
}
```

---

## 🚀 4. Guia de Deploy (Supabase + Vercel)

### A. Banco de Dados (Supabase)
1. Crie um novo projeto no [Supabase](https://supabase.com).
2. Vá em **Project Settings -> Database** e localize os parâmetros de **Connection Pooling**:
   - `DATABASE_URL` (Porta 6543 / PgBouncer ativo).
   - `DIRECT_URL` (Porta 5432 / Direta).
3. No terminal local, rode:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

### B. Deploy na Vercel
1. Conecte o repositório Git na [Vercel](https://vercel.com).
2. Em **Environment Variables**, adicione:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
3. Ajuste o **Build Command** para:
   ```bash
   prisma generate && next build
   ```
4. Conclua o deploy e acesse a URL gerada.