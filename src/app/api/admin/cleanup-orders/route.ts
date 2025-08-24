import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const orderIdKeys: string[] = await kv.keys('order_id:*');
    console.log(`Tentativo di pulire ${orderIdKeys.length} ordini.`);

    const cleanupPromises = orderIdKeys.map(async (key) => {
      const orderId = key.replace('order_id:', '');
      const cloudinaryPublicId = `order-${orderId}`;

      try {
        await cloudinary.api.resource(cloudinaryPublicId, { resource_type: 'image' });
        // Se la risorsa esiste, non è un ordine orfano, non fare nulla
      } catch (error) {
        // Se la risorsa non esiste, è un ordine orfano, eliminalo da KV
        console.log(`Ordine orfano trovato durante la pulizia: ${orderId}. Eliminazione delle chiavi da KV.`);
        await kv.del(`order:${orderId}`);
        await kv.del(`order_id:${orderId}`);
      }
    });

    await Promise.allSettled(cleanupPromises);

    return NextResponse.json({ message: 'Processo di pulizia completato.' }, { status: 200 });
  } catch (error: any) {
    console.error('Errore durante il processo di pulizia:', error);
    return NextResponse.json({ error: 'Errore interno del server durante la pulizia.' }, { status: 500 });
  }
}
