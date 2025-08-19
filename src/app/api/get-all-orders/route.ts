import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  try {
    // Recupera tutti gli ID degli ordini tramite pattern matching
    const orderIdKeys: string[] = await kv.keys('order_id:*');
    console.log('Retrieved orderIdKeys from KV:', orderIdKeys);

    const orders = [];
    for (const key of orderIdKeys) {
      const orderId = key.replace('order_id:', ''); // Estrai l'ID effettivo
      const pdfUrl: string | null = await kv.get(`order:${orderId}`);
      if (pdfUrl) {
        orders.push({
          orderId,
          pdfUrl,
        });
      }
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Errore nel recupero di tutti gli ordini:', error);
    return NextResponse.json({ error: 'Impossibile recuperare gli ordini.' }, { status: 500 });
  }
}
