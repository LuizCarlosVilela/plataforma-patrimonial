import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Detect action automatically based on fields present.
    // This route is primarily for registration, but also handles login
    // when the caller sends only email+password without a 'name' field.
    const hasName = !!body.name;
    const isLogin = !hasName && body.email && body.password;

    let name: string | undefined;
    let email: string | undefined;
    let password: string | undefined;

    // Helper: extract from plain object or legacy formData wrapper
    const getVal = (key: string): string | undefined =>
      body[key] ?? body.formData?.[key];

    email = getVal('email');
    password = getVal('password');
    name = hasName ? getVal('name') : undefined;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    // ── REGISTER ────────────────────────────────────────────────
    if (hasName || (!isLogin)) {
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

    // ── LOGIN ──────────────────────────────────────────────────
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password!);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      role: user.role || 'CLIENT',
      planTier: user.planTier,
    });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
