import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  try {
    console.log("Tentativo di recupero ordini dall'indice 'orders_index'.");
    // Recupera tutti i publicId dall'indice affidabile
    const publicIds: string[] = await kv.smembers('orders_index');
    console.log("Risultato di SMEMBERS per 'orders_index':", publicIds);

    if (!publicIds || publicIds.length === 0) {
      console.log("Nessun ordine trovato nell'indice.");
      return NextResponse.json({ orders: [] });
    }

    const orders = [];
    for (const publicId of publicIds) {
      // Recupera l'URL del PDF corrispondente dalla chiave 'order:'
      const pdfUrl: string | null = await kv.get(`order:${publicId}`);
      console.log(`Recuperato URL per ${publicId}:`, pdfUrl);
      
      if (pdfUrl) {
        orders.push({
          publicId: publicId,
          pdfUrl: pdfUrl,
        });
      } else {
        console.warn(`Attenzione: publicId ${publicId} trovato nell'indice ma senza un URL corrispondente.`);
      }
    }

    console.log("Ordini finali inviati al frontend:", orders);
    // Il frontend si aspetta un oggetto con una proprietà 'orders'
    return NextResponse.json({ orders });

  } catch (error: any) {
    console.error('Errore nel recupero di tutti gli ordini da Vercel KV:', error);
    return NextResponse.json({ error: 'Impossibile recuperare gli ordini.' }, { status: 500 });
  }
}