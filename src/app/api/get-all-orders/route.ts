import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  console.log('get-all-orders function called!'); // NEW LOG
  try {
    // Recupera tutti gli ID degli ordini tramite pattern matching
    const orderIdKeys: string[] = await kv.keys('order_id:*');
    console.log('Raw output of kv.keys("order_id:*"):', orderIdKeys);
    console.log('Retrieved orderIdKeys from KV:', orderIdKeys);

    const orders = [];
    for (const key of orderIdKeys) {
      const orderId = key.replace('order_id:', ''); // Estrai l'ID effettivo
      const pdfUrl: string | null = await kv.get(`order:${orderId}`);
      console.log(`pdfUrl for order ${orderId}:`, pdfUrl); // LOGGING
      if (pdfUrl) {
        const cloudinaryPublicId = `order-${orderId}`;
        console.log(`Cloudinary publicId for order ${orderId}:`, cloudinaryPublicId); // LOGGING
        try {
          // Verifica l'esistenza della risorsa su Cloudinary
          await cloudinary.api.resource(cloudinaryPublicId, { resource_type: 'image' });
          orders.push({
            orderId,
            pdfUrl,
          });
        } catch (error) {
          // Se la risorsa non esiste, è un ordine orfano
          console.log(`Cloudinary resource not found for order ${orderId}. Error:`, error); // LOGGING
          console.log(`Ordine orfano trovato: ${orderId}. Eliminazione delle chiavi da KV.`);
          await kv.del(`order:${orderId}`);
          await kv.del(`order_id:${orderId}`);
        }
      }
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Errore nel recupero di tutti gli ordini:', error);
    return NextResponse.json({ error: 'Impossibile recuperare gli ordini.' }, { status: 500 });
  }
}
