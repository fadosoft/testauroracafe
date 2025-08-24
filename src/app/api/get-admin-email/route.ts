import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  try {
    const adminEmail: string | null = await kv.get('admin_email');
    return NextResponse.json({ adminEmail });
  } catch (error) {
    console.error('Errore nel recupero dell\'email amministratore:', error);
    return NextResponse.json({ error: 'Errore interno del server.' }, { status: 500 });
  }
}
