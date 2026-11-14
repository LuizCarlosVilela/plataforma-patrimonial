import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let action: string | undefined;
    let name: string | undefined;
    let email: string | undefined;
    let password: string | undefined;

    if (body.action === 'register') {
      action = 'register';
      if (body.formData && typeof body.formData.get === 'function') {
        name = body.formData.get('name') as string;
        email = body.formData.get('email') as string;
        password = body.formData.get('password') as string;
      } else {
        name = body.name || body.formData?.name as string | undefined;
        email = body.email || body.formData?.email as string | undefined;
        password = body.password || body.formData?.password as string | undefined;
      }
    } else if (body.action === 'login') {
      action = 'login';
      if (body.formData && typeof body.formData.get === 'function') {
        email = body.formData.get('email') as string;
        password = body.formData.get('password') as string;
      } else {
        email = body.email || body.formData?.email as string | undefined;
        password = body.password || body.formData?.password as string | undefined;
      }
    } else {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    if (!action || !email || !password) {
      return NextResponse.json(
        { error: 'Preencha todos os campos: email e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    if (action === 'register') {
      if (!name) {
        return NextResponse.json(
          { error: 'O nome é obrigatório.' },
          { status: 400 }
        );
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Este e-mail já está cadastrado.' },
          { status: 400 }
        );
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

      return NextResponse.json({ success: true, userId: user.id, role: 'CLIENT' });
    }

    // action === 'login'
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuário não encontrado' });
    }

    const isValid = await bcrypt.compare(password, user.password!);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Senha incorreta' });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      role: user.role || 'CLIENT',
    });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
