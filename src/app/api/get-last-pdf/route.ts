import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  try {
    const lastPdfUrl = await kv.get('lastPdfUrl');
    return NextResponse.json({ lastPdfUrl });
  } catch (error: any) {
    console.error('Errore nel recupero dell\'ultimo URL PDF:', error);
    return NextResponse.json({ error: 'Impossibile recuperare l\'URL del PDF.' }, { status: 500 });
  }
}
