import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
try {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  console.log(JSON.stringify(users));
} catch(e) {
  console.error("Error:", e.message);
} finally {
  await prisma.$disconnect();
}
