
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { kv } from '@vercel/kv';

// Configura Cloudinary con le credenziali dalle variabili d'ambiente
// Assicurati che queste variabili siano impostate nel tuo ambiente Vercel
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publicId = searchParams.get('public_id'); // Ora usiamo il public_id di Cloudinary

  if (!publicId) {
    return new NextResponse('ID pubblico del file mancante', { status: 400 });
  }

  try {
    // Costruisci l'URL del file su Cloudinary
    const cloudinaryUrl = cloudinary.url(publicId, { resource_type: 'raw' });

    // Scarica il file da Cloudinary
    const pdfResponse = await fetch(cloudinaryUrl);
    if (!pdfResponse.ok) {
      return new NextResponse('File non trovato su Cloudinary', { status: 404 });
    }
    const fileBuffer = await pdfResponse.arrayBuffer();

    // Imposta gli header per forzare il download
    const headers = new Headers();
    headers.append('Content-Disposition', `attachment; filename="${publicId}.pdf"`);
    headers.append('Content-Type', 'application/pdf');

    // Crea la risposta con il contenuto del file
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: headers,
    });

    // Elimina il file da Cloudinary DOPO aver preparato la risposta
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      console.log(`File ${publicId} eliminato con successo da Cloudinary.`);

      // Estrai l'orderId dal publicId per la chiave KV
      const orderId = publicId.replace('order-', '');
      await kv.del(`order:${orderId}`);
      console.log(`URL PDF per ordine ${orderId} eliminato con successo da Vercel KV.`);

    } catch (destroyError) {
      console.error(`Errore durante l'eliminazione del file ${publicId} da Cloudinary o Vercel KV:`, destroyError);
      // Non blocchiamo il download se l'eliminazione fallisce, ma logghiamo l'errore.
    }

    return response;

  } catch (error) {
    console.error(`Errore durante il recupero del file da Cloudinary:`, error);
    return new NextResponse('Errore interno del server', { status: 500 });
  }
}
