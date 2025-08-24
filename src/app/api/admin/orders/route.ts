
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (!secretKey) {
    console.error('ADMIN_SECRET_KEY non configurata.');
    return NextResponse.json({ message: 'Errore di configurazione del server.' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
    return NextResponse.json({ message: 'Non autorizzato.' }, { status: 401 });
  }

  try {
    // Cerca tutte le chiavi che corrispondono agli ID degli ordini
    const orderIdKeys = await kv.keys('order_id:*');

    if (orderIdKeys.length === 0) {
      return NextResponse.json([]);
    }

    // Estrai il public_id (che usiamo come nome del file) da ogni chiave
    const pdfFiles = orderIdKeys.map(key => key.replace('order_id:', ''));

    return NextResponse.json(pdfFiles);
  } catch (error) {
    console.error('Errore nel recupero degli ordini da Vercel KV:', error);
    return NextResponse.json({ message: 'Errore nel recupero degli ordini.' }, { status: 500 });
  }
}
