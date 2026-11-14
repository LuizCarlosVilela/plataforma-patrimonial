import { NextResponse } from 'next/server';
import { loginAction, registerAction } from '@/server/actions/auth';

export async function POST(request: Request) {
  const { action, formData } = await request.json();

  try {
    if (action === 'login') {
      const result = await loginAction(formData);
      return NextResponse.json(result);
    } else if (action === 'register') {
      const result = await registerAction(formData);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar ação de autenticação' },
      { status: 500 }
    );
  }
}
