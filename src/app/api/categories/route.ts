import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resolveUserId(query: string): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: { OR: [{ id: query }, { email: query }] },
    select: { id: true },
  });
  return user?.id ?? null;
}

// Default categories for new users — organized by type
const DEFAULT_CATEGORIES = [
  // Expenses
  { name: 'Alimentação', icon: 'Utensils', color: '#f97316' },
  { name: 'Transporte', icon: 'Car', color: '#3b82f6' },
  { name: 'Moradia', icon: 'Home', color: '#8b5cf6' },
  { name: 'Lazer', icon: 'Gamepad2', color: '#ec4899' },
  { name: 'Saúde', icon: 'HeartPulse', color: '#ef4444' },
  { name: 'Educação', icon: 'GraduationCap', color: '#06b6d4' },
  { name: 'Compras', icon: 'ShoppingBag', color: '#f59e0b' },
  { name: 'Investimentos', icon: 'TrendingUp', color: '#22c55e' },
  // Income
  { name: 'Salário', icon: 'Wallet', color: '#10b981' },
  { name: 'Freelance', icon: 'Briefcase', color: '#6366f1' },
  { name: 'Dividendos', icon: 'Coins', color: '#eab308' },
  { name: 'Outros', icon: 'MoreHorizontal', color: '#6b7280' },
];

const ICON_MAP: Record<string, string> = {
  Utensils: 'Utensils',
  Car: 'Car',
  Home: 'Home',
  Gamepad2: 'Gamepad2',
  HeartPulse: 'HeartPulse',
  Wallet: 'Wallet',
  TrendingUp: 'TrendingUp',
  GraduationCap: 'GraduationCap',
  ShoppingBag: 'ShoppingBag',
  Briefcase: 'Briefcase',
  Coins: 'Coins',
  MoreHorizontal: 'MoreHorizontal',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdOrEmail = searchParams.get('userId') || searchParams.get('email');
    const type = searchParams.get('type'); // "expense" | "income"

    if (!userIdOrEmail) {
      return NextResponse.json({ error: 'userId ou email é obrigatório' }, { status: 400 });
    }

    const userId = await resolveUserId(userIdOrEmail);
    if (!userId) {
      return NextResponse.json({ categories: [] });
    }

    // If no categories exist, seed defaults for this user
    const existing = await prisma.category.count({ where: { userId } });
    if (existing === 0) {
      await prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map((cat) => ({
          userId,
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
        })),
      });
    }

    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, icon: true, color: true },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, name, icon, color } = body;

    if (!name) {
      return NextResponse.json({ error: 'Nome da categoria é obrigatório' }, { status: 400 });
    }

    const resolvedUserId = await resolveUserId(userId || email);
    if (!resolvedUserId) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const category = await prisma.category.create({
      data: {
        userId: resolvedUserId,
        name: name.trim(),
        icon: icon || null,
        color: color || '#8b5cf6',
      },
      select: { id: true, name: true, icon: true, color: true },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, userId, email, name, icon, color } = body;

    if (!categoryId) {
      return NextResponse.json({ error: 'categoryId é obrigatório' }, { status: 400 });
    }

    const resolvedUserId = await resolveUserId(userId || email);
    if (!resolvedUserId) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const category = await prisma.category.update({
      where: { id: categoryId, userId: resolvedUserId },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(icon ? { icon } : {}),
        ...(color ? { color } : {}),
      },
      select: { id: true, name: true, icon: true, color: true },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const userIdOrEmail = searchParams.get('userId') || searchParams.get('email');

    if (!categoryId) {
      return NextResponse.json({ error: 'categoryId é obrigatório' }, { status: 400 });
    }

    const resolvedUserId = await resolveUserId(userIdOrEmail || '');
    if (!resolvedUserId) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    await prisma.category.delete({
      where: { id: categoryId, userId: resolvedUserId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir categoria' },
      { status: 500 }
    );
  }
}
