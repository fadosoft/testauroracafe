
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const { isLoggedIn } = session;

  // Se l'utente non è loggato, reindirizza alla pagina di login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se l'utente è loggato, procedi
  return NextResponse.next();
}

// Specifica quali rotte devono essere protette dal middleware
export const config = {
  matcher: '/admin/:path*',
};
