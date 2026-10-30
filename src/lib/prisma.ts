import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Also export getPrisma for backward compatibility with existing imports
export function getPrisma() {
  if (process.env.NODE_ENV === "development") return prisma;
  return prisma;
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;