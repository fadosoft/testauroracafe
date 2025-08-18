
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('file');

  if (!fileName) {
    return new NextResponse('Nome del file mancante', { status: 400 });
  }

  // Pulisce il nome del file per evitare attacchi (path traversal)
  const safeFileName = path.basename(fileName);

  const filePath = path.join(process.cwd(), 'public', 'orders', safeFileName);

  try {
    // Verifica che il file esista
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File non trovato', { status: 404 });
    }

    // Legge il file
    const fileBuffer = fs.readFileSync(filePath);

    // Imposta gli header per forzare il download
    const headers = new Headers();
    headers.append('Content-Disposition', `attachment; filename="${safeFileName}"`);
    headers.append('Content-Type', 'application/pdf');

    // Crea la risposta con il contenuto del file
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: headers,
    });

    // Elimina il file DOPO aver preparato la risposta
    // NOTA: In un ambiente serverless, l'esecuzione potrebbe terminare prima del completamento.
    // Un approccio più robusto potrebbe usare un task in background o una strategia diversa.
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkError) {
      console.error(`Errore durante l'eliminazione del file ${filePath}:`, unlinkError);
      // Non blocchiamo il download se l'eliminazione fallisce, ma logghiamo l'errore.
    }

    return response;

  } catch (error) {
    console.error(`Errore durante la lettura del file ${filePath}:`, error);
    return new NextResponse('Errore interno del server', { status: 500 });
  }
}
