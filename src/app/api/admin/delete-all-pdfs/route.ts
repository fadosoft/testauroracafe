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
    // Recupera tutti gli ID degli ordini dalla lista
    const allOrderIds: string[] = await kv.lrange('all_order_ids', 0, -1);
    console.log(`Tentativo di eliminare ${allOrderIds.length} PDF.`);

    const deletionPromises = allOrderIds.map(async (orderId) => {
      const publicId = `orders/order-${orderId}`;
      try {
        // Elimina da Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log(`Eliminato ${publicId} da Cloudinary.`);

        // Elimina da Vercel KV
        await kv.del(`order:${orderId}`);
        console.log(`Eliminato order:${orderId} da Vercel KV.`);
      } catch (error) {
        console.error(`Errore durante l'eliminazione di ${publicId}:`, error);
        // Continua anche se un'eliminazione fallisce
      }
    });

    await Promise.allSettled(deletionPromises);

    // Svuota la lista principale degli ID degli ordini in Vercel KV
    await kv.del('all_order_ids');
    console.log('Lista all_order_ids svuotata in Vercel KV.');

    return NextResponse.json({ message: 'Tutti i PDF e i loro riferimenti sono stati eliminati.' }, { status: 200 });
  } catch (error: any) {
    console.error("PDF deletion error:", error);
    return NextResponse.json({ error: 'Errore interno del server durante l\'eliminazione.' }, { status: 500 });
  }
}
