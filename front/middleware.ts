import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas (não precisam de autenticação)
const PUBLIC_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite rotas públicas
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verifica token no cookie (mais seguro) ou header
  const token = request.cookies.get('nexsupport_token')?.value;

  if (!token) {
    // Redireciona para login preservando a URL original
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Aplica middleware em todas as rotas exceto assets estáticos e API
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
