import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email non fornita.' }, { status: 400 });
    }

    await kv.set('admin_email', email);
    return NextResponse.json({ message: `Email amministratore impostata su ${email}` });
  } catch (error) {
    console.error('Errore nell\'impostazione dell\'email amministratore:', error);
    return NextResponse.json({ error: 'Errore interno del server.' }, { status: 500 });
  }
}
