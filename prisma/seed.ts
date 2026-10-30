import { AccountType, UserRole, PlanTier, GoalStatus, TransactionType } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

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
      role: UserRole.ADVISOR,
      planTier: PlanTier.FREE,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "cliente@demo.com.br" },
    update: {},
    create: {
      email: "cliente@demo.com.br",
      name: "João Silva",
      role: UserRole.CLIENT,
      planTier: PlanTier.FREE,
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
      status: GoalStatus.IN_PROGRESS,
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
}

// Export for manual seeding via tsx prisma/seed.ts
export default main;