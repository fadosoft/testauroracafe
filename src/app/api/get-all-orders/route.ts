import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  try {
    // Recupera tutti i publicId dall'indice affidabile
    const publicIds: string[] = await kv.smembers('orders_index');

    const orders = [];
    for (const publicId of publicIds) {
      // Recupera l'URL del PDF corrispondente dalla chiave 'order:'
      const pdfUrl: string | null = await kv.get(`order:${publicId}`);
      
      if (pdfUrl) {
        orders.push({
          publicId: publicId,
          pdfUrl: pdfUrl,
        });
      }
    }

    // Il frontend si aspetta un oggetto con una proprietà 'orders'
    return NextResponse.json({ orders });

  } catch (error: any) {
    console.error('Errore nel recupero di tutti gli ordini da Vercel KV:', error);
    return NextResponse.json({ error: 'Impossibile recuperare gli ordini.' }, { status: 500 });
  }
}
