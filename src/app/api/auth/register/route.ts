import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;
    const formData = body.formData;

    if (action === 'register') {
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!name || !email || !password) {
        return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'CLIENT',
          planTier: 'FREE',
        },
      });

      return NextResponse.json({ success: true, userId: user.id });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json({ error: 'Erro ao registrar usuário' }, { status: 500 });
  }
}
