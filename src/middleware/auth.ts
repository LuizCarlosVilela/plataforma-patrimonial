import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware para validar token de autenticação
const authMiddleware = (request: NextRequest) => {
  const token = request.cookies.get('openfinance_auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verificar se o token é válido (simulação)
  if (token !== 'valid_openfinance_token') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export default authMiddleware