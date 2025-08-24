
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
  console.log('Public ID in backend:', publicId); // LOGGING

  if (!publicId) {
    return new NextResponse('ID pubblico del file mancante', { status: 400 });
  }

  try {
    // Costruisci l'URL del file su Cloudinary
    const cloudinaryUrl = cloudinary.url(publicId, { resource_type: 'raw' });
    console.log('Cloudinary URL:', cloudinaryUrl); // LOGGING

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

    return response;

  } catch (error) {
    console.error(`Errore durante il recupero del file da Cloudinary:`, error);
    return new NextResponse('Errore interno del server', { status: 500 });
  }
}
