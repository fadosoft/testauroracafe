import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  try {
    // Recupera tutte le chiavi che rappresentano un ID ordine
    const orderIdKeys: string[] = await kv.keys('order_id:*');

    const orders = [];
    for (const key of orderIdKeys) {
      // Il publicId è la parte della chiave dopo 'order_id:'
      const publicId = key.replace('order_id:', '');
      
      // Recupera l'URL del PDF corrispondente dalla chiave 'order:'
      const pdfUrl: string | null = await kv.get(`order:${publicId}`);
      
      if (pdfUrl) {
        orders.push({
          publicId: publicId, // Invia il publicId al frontend
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