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
    // Recupera tutti gli ID degli ordini tramite pattern matching
    const orderIdKeys: string[] = await kv.keys('order_id:*');
    console.log(`Tentativo di eliminare ${orderIdKeys.length} PDF.`);

    const deletionPromises = orderIdKeys.map(async (key) => {
      const orderId = key.replace('order_id:', ''); // Estrai l'ID effettivo
      const publicId = `orders/order-${orderId}`;
      try {
        // Elimina da Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log(`Eliminato ${publicId} da Cloudinary.`);

        // Elimina da Vercel KV (chiave order:ID)
        await kv.del(`order:${orderId}`);
        console.log(`Eliminato order:${orderId} da Vercel KV.`);

        // Elimina da Vercel KV (chiave order_id:ID)
        await kv.del(key); // Elimina la chiave order_id:ID
        console.log(`Eliminato ${key} da Vercel KV.`);

      } catch (error) {
        console.error(`Errore durante l'eliminazione di ${publicId}:`, error);
        // Continua anche se un'eliminazione fallisce
      }
    });

    await Promise.allSettled(deletionPromises);

    console.log('Tutti i riferimenti agli ordini sono stati eliminati da Vercel KV.');

    return NextResponse.json({ message: 'Tutti i PDF e i loro riferimenti sono stati eliminati.' }, { status: 200 });
  } catch (error: any) {
    console.error("PDF deletion error:", error);
    return NextResponse.json({ error: 'Errore interno del server durante l\'eliminazione.' }, { status: 500 });
  }
}
