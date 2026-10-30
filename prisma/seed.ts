import { AccountType, GoalStatus, TransactionType } from "@/lib/prisma";

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

  // Mock Prisma - using the local types from lib/prisma.ts
  const mockPrisma = {
    category: {
      upsert: async (params: any) => {
        console.log(`Criando categoria: ${params.create.name}`);
      },
    },
    user: {
      upsert: async (params: any) => {
        console.log(`Criando usuário: ${params.create.email}`);
        return { id: "mock-user-id", ...params.create };
      },
    },
    account: {
      create: async (params: any) => {
        console.log(`Criando conta: ${params.data.name}, tipo: ${params.data.type}`);
        return { id: "mock-account-id", ...params.data };
      },
    },
    goal: {
      create: async (params: any) => {
        console.log(`Criando meta: ${params.data.title}`);
        return { id: "mock-goal-id", ...params.data };
      },
    },
  };

  // 2. Criar Consultor e Cliente Demo
  const advisor = await mockPrisma.user.upsert({
    where: { email: "consultor@w1.com.br" },
    update: {},
    create: {
      email: "consultor@w1.com.br",
      name: "Guilherme Consultor (W1)",
      role: "ADVISOR",
    },
  });

  const client = await mockPrisma.user.upsert({
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
  const checking = await mockPrisma.account.create({
    data: {
      userId: client.id,
      name: "Nubank Conta",
      type: "CHECKING",
      initialBalance: 2500.0,
      currentBalance: 2500.0,
      color: "#820AD1",
      icon: "Landmark",
    },
  });

  const creditCard = await mockPrisma.account.create({
    data: {
      userId: client.id,
      name: "Cartão XP Visa Infinite",
      type: "CREDIT_CARD",
      initialBalance: 0.0,
      currentBalance: 1250.0, // Fatura em aberto (Passivo)
      color: "#1E1E1E",
      icon: "CreditCard",
    },
  });

  // 4. Meta de Reserva de Emergência
  await mockPrisma.goal.create({
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
    // No PrismaClient to disconnect when using mock
  });