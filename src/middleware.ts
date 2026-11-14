import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Auth routes are public — skip them
  if (pathname.startsWith('/api/auth') || pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // Lista de rotas protegidas
  const protectedRoutes = [
    '/dashboard',
    '/clients',
    '/goals',
    '/transactions',
    '/accounts',
    '/reports',
  ];

  // Verificar se a rota é protegida e se não há token
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configurar quais rotas devem ser protegidas
export const config = {
  matcher: [
    '/dashboard',
    '/clients',
    '/goals',
    '/transactions',
    '/accounts',
    '/api/(.*)',
  ],
};