import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Questa è una rotta di test per diagnosticare problemi con la lettura da Vercel KV.
export async function GET() {
  try {
    console.log("Esecuzione rotta di test: /api/test-read");
    const publicIds = await kv.smembers('orders_index');
    console.log("Risultato grezzo da smembers('orders_index'):", publicIds);
    return NextResponse.json({ 
      message: "Risultato grezzo da kv.smembers('orders_index')",
      data: publicIds 
    });
  } catch (error: any) {
    console.error("Errore nella rotta di test /api/test-read:", error);
    return NextResponse.json(
      { error: 'Errore durante la lettura da Vercel KV.', details: error.message },
      { status: 500 }
    );
  }
}
