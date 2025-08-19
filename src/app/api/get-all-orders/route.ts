import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  try {
    // Recupera tutti gli ID degli ordini dalla lista
    const allOrderIds: string[] = await kv.lrange('all_order_ids', 0, -1);
    console.log('Retrieved allOrderIds from KV:', allOrderIds);
    console.log('Retrieved allOrderIds:', allOrderIds);

    const orders = [];
    for (const orderId of allOrderIds) {
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
