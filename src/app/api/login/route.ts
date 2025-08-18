
import { NextRequest, NextResponse } from 'next/server';
import { getSession, SessionData } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = await request.json();
  const { username, password } = body;

  // NON FARE QUESTO IN PRODUZIONE!
  // Usa variabili d'ambiente e un confronto sicuro.
  const adminUsername = 'aurora';
  const adminPassword = 'federica';

  if (username === adminUsername && password === adminPassword) {
    // Aggiorna i dati della sessione
    session.isLoggedIn = true;
    session.username = username;
    await session.save();
    
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  }

  return NextResponse.json({ message: 'Credenziali non valide' }, { status: 401 });
}
