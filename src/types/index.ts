import { AccountType, TransactionType, GoalStatus, UserRole, PlanTier } from "@prisma/client";

export type { AccountType, TransactionType, GoalStatus, UserRole, PlanTier };

export interface DashboardData {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  accounts: AccountWithRelations[];
  goals: GoalWithProgress[];
  recentTransactions: TransactionWithRelations[];
}

export interface AccountWithRelations {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  currentBalance: number;
  currency: string;
  color: string | null;
  icon: string | null;
  isManual: boolean;
  openFinanceItemId: string | null;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    transactions: number;
  };
}

export interface TransactionWithRelations {
  id: string;
  accountId: string;
  categoryId: string | null;
  type: TransactionType;
  amount: number;
  description: string;
  date: Date;
  notes: string | null;
  externalId: string | null;
  isReconciled: boolean;
  createdAt: Date;
  updatedAt: Date;
  account: {
    name: string;
    color: string | null;
  };
  category: {
    name: string;
    icon: string | null;
    color: string | null;
  } | null;
}

export interface GoalWithProgress {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date | null;
  status: GoalStatus;
  categoryTag: string | null;
  createdAt: Date;
  updatedAt: Date;
  progress: number;
}

export interface CategoryWithRelations {
  id: string;
  userId: string | null;
  name: string;
  icon: string | null;
  color: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  subCategories?: CategoryWithRelations[];
  _count?: {
    transactions: number;
  };
}

export interface UserWithRelations {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  planTier: PlanTier;
  advisorId: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    accounts: number;
    goals: number;
    transactions: number;
  };
}