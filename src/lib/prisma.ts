// Mock PrismaClient para compilação sem banco de dados
// Em produção, isso será substituído pelo cliente Prisma real

const MOCK_COLOR = "#b08a3e";

type MockValue = Record<string, any>;

const mockModel = {
  findUnique: async (_args?: any): Promise<MockValue | null> => ({
    id: "demo-id", name: "Demo", color: MOCK_COLOR, icon: "Tag", userId: "demo-user-001",
    currentAmount: 0, targetAmount: 100, status: "IN_PROGRESS", type: "CHECKING", amount: 0,
    accountId: "demo-acc", date: "2026-11-13", currentBalance: 0, createdAt: new Date(),
    category: { name: "Demo", icon: "Tag", color: MOCK_COLOR },
    account: { name: "Demo", color: MOCK_COLOR },
    clients: [{
      id: "client-1", name: "João Silva", email: "cliente@demo.com.br", planTier: "FREE", role: "CLIENT",
      accounts: [
        { id: "acc-1", type: "CHECKING", currentBalance: "2500" },
        { id: "acc-2", type: "SAVINGS", currentBalance: "10000" },
        { id: "acc-3", type: "CREDIT_CARD", currentBalance: "1250" },
      ],
      goals: [
        { id: "goal-1", status: "IN_PROGRESS", title: "Reserva de Emergência" },
        { id: "goal-2", status: "COMPLETED", title: "Viagem Europa" },
        { id: "goal-3", status: "IN_PROGRESS", title: "Aposentadoria" },
      ],
      _count: { transactions: 12 },
    }],
  }),
  findMany: async (_args?: any): Promise<MockValue[]> => ([
    { id: "demo-id", name: "Demo", color: MOCK_COLOR, icon: "Tag", userId: "demo-user-001", currentAmount: 0, targetAmount: 100, status: "IN_PROGRESS", type: "CHECKING", amount: 0, accountId: "demo-acc", date: "2026-11-13", currentBalance: 0, createdAt: new Date(), category: { name: "Demo", icon: "Tag", color: MOCK_COLOR }, account: { name: "Demo", color: MOCK_COLOR } }
  ]),
  create: async (_args?: any): Promise<MockValue> => ({ id: "demo-id", currentAmount: 0, targetAmount: 100, status: "IN_PROGRESS", type: "CHECKING", amount: 0, accountId: "demo-acc" }),
  update: async (_args?: any): Promise<MockValue> => ({ id: "demo-id", currentAmount: 0, targetAmount: 100, status: "IN_PROGRESS", type: "CHECKING", amount: 0, accountId: "demo-acc" }),
  delete: async (_args?: any): Promise<MockValue> => ({}),
  upsert: async (_args?: any): Promise<MockValue> => ({}),
  count: async (_args?: any): Promise<number> => 0,
} as const;

interface MockPrismaModel {
  findUnique: (args?: any) => Promise<MockValue | null>;
  findMany: (args?: any) => Promise<MockValue[]>;
  create: (args?: any) => Promise<MockValue>;
  update: (args?: any) => Promise<MockValue>;
  delete: (args?: any) => Promise<MockValue>;
  upsert: (args?: any) => Promise<MockValue>;
  count: (args?: any) => Promise<number>;
}

interface PrismaClient {
  user: MockPrismaModel;
  account: MockPrismaModel;
  transaction: MockPrismaModel;
  category: MockPrismaModel;
  goal: MockPrismaModel;
  advisorAuditLog: MockPrismaModel;
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  $on: (event: string, callback: (e: any) => void) => void;
  $transaction: <T>(fnOrList: any, options?: any) => Promise<T>;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient = globalForPrisma.prisma ?? ({
  user: mockModel as MockPrismaModel,
  account: mockModel as MockPrismaModel,
  transaction: mockModel as MockPrismaModel,
  category: mockModel as MockPrismaModel,
  goal: mockModel as MockPrismaModel,
  advisorAuditLog: mockModel as MockPrismaModel,
  $connect: async () => {},
  $disconnect: async () => {},
  $on: () => {},
  $transaction: async (fnOrList: any) => {
    if (typeof fnOrList === 'function') {
      return fnOrList(prisma);
    }
    if (Array.isArray(fnOrList)) {
      return Promise.all(fnOrList);
    }
    return fnOrList;
  },
}) as PrismaClient;

// Also export getPrisma for backward compatibility with existing imports
export function getPrisma(): PrismaClient {
  return prisma;
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
