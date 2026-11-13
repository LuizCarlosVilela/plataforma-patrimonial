import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed iniciado...');

  // Verificar se já existem usuários
  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    console.log('Já existem dados no banco. Pulando seed.');
    return;
  }

  // Criar usuário admin de teste
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador Origin',
      email: 'admin@origin.com.br',
      password: hashedPassword,
      role: 'ADMIN',
      planTier: 'PREMIUM',
    },
  });
  console.log(`✅ Usuário ADMIN criado: ${admin.email}`);

  // Criar usuário advisor
  const advisor = await prisma.user.create({
    data: {
      name: 'Consultor Carvalho',
      email: 'advisor@carvalhogroup.com',
      password: hashedPassword,
      role: 'ADVISOR',
      planTier: 'PREMIUM',
    },
  });
  console.log(`✅ Usuário ADVISOR criado: ${advisor.email}`);

  // Criar usuário client de teste
  const client = await prisma.user.create({
    data: {
      name: 'João da Silva',
      email: 'joao@exemplo.com',
      password: hashedPassword,
      role: 'CLIENT',
      planTier: 'FREE',
    },
  });
  console.log(`✅ Usuário CLIENT criado: ${client.email}`);
  console.log(`   Senha para todos: "admin123"`);

  // Criar conta para o cliente
  const conta = await prisma.account.create({
    data: {
      userId: client.id,
      name: 'Conta Corrente',
      type: 'CHECKING',
      initialBalance: 50000,
      currentBalance: 48750,
      currency: 'BRL',
      color: '#b08a3e',
      icon: 'Banknote',
    },
  });
  console.log('✅ Conta criada para cliente');

  // Criar categorias padrão
  const categorias = [
    { name: 'Alimentação', icon: 'Utensils', color: '#f97316' },
    { name: 'Transporte', icon: 'Car', color: '#3b82f6' },
    { name: 'Moradia', icon: 'Home', color: '#10b981' },
    { name: 'Lazer', icon: 'Gamepad2', color: '#8b5cf6' },
    { name: 'Saúde', icon: 'HeartPulse', color: '#ef4444' },
    { name: 'Educação', icon: 'GraduationCap', color: '#06b6d4' },
    { name: 'Investimentos', icon: 'TrendingUp', color: '#b08a3e' },
    { name: 'Salário', icon: 'Banknote', color: '#22c55e' },
  ];

  for (const cat of categorias) {
    await prisma.category.create({
      data: {
        userId: client.id,
        ...cat,
      },
    });
  }
  console.log('✅ Categorias criadas');

  // Criar transações de exemplo
  const transacoes = [
    { type: 'INCOME', amount: 15000, description: 'Salário mensal', date: '2024-11-01' },
    { type: 'EXPENSE', amount: 2500, description: 'Supermercado', date: '2024-11-05' },
    { type: 'EXPENSE', amount: 450, description: 'Combustível', date: '2024-11-07' },
    { type: 'EXPENSE', amount: 1200, description: 'Conta de luz', date: '2024-11-10' },
    { type: 'EXPENSE', amount: 300, description: 'Plano de saúde', date: '2024-11-12' },
    { type: 'INCOME', amount: 2500, description: 'Investimento rendido', date: '2024-11-15' },
  ];

  const categoriaCategoria = await prisma.category.findFirst();
  const categoriaTransacoes = categorias.map(c => ({
    name: c.name,
    icon: c.icon,
    color: c.color,
  }));

  for (const transacao of transacoes) {
    const randomCat = categorias[Math.floor(Math.random() * categorias.length)];
    await prisma.transaction.create({
      data: {
        accountId: conta.id,
        categoryId: randomCat.id || undefined,
        ...transacao,
        isReconciled: true,
      },
    });
  }
  console.log('✅ Transações criadas');

  // Criar metas
  await prisma.goal.create({
    data: {
      userId: client.id,
      title: 'Reserva de emergência',
      targetAmount: 50000,
      currentAmount: 48750,
      targetDate: new Date('2025-06-01'),
      status: 'IN_PROGRESS',
    },
  });
  console.log('✅ Metas criadas');

  console.log('\n🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
