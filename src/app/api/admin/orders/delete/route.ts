import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (!secretKey) {
    console.error('ADMIN_SECRET_KEY non configurata in .env.local');
    return NextResponse.json({ message: 'Errore di configurazione del server.' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
    return NextResponse.json({ message: 'Non autorizzato.' }, { status: 401 });
  }

  const { fileName } = await req.json();

  if (!fileName) {
    return NextResponse.json({ message: 'Nome del file non fornito.' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'orders', fileName);

  // Security check: Ensure the file is within the 'public/orders' directory
  // This prevents directory traversal attacks
  if (!filePath.startsWith(path.join(process.cwd(), 'public', 'orders'))) {
    return NextResponse.json({ message: 'Percorso file non valido.' }, { status: 400 });
  }

  try {
    await fs.unlink(filePath);
    return NextResponse.json({ message: `File ${fileName} eliminato con successo.` });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ message: 'File non trovato.' }, { status: 404 });
    }
    console.error(`Errore nell'eliminazione del file ${fileName}:`, error);
    return NextResponse.json({ message: 'Errore nell\'eliminazione del file.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
    const secretKey = process.env.ADMIN_SECRET_KEY;
    if (!secretKey) {
      console.error('ADMIN_SECRET_KEY non configurata in .env.local');
      return NextResponse.json({ message: 'Errore di configurazione del server.' }, { status: 500 });
    }
  
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ message: 'Non autorizzato.' }, { status: 401 });
    }
  
    const ordersDir = path.join(process.cwd(), 'public', 'orders');
  
    try {
      const files = await fs.readdir(ordersDir);
      const pdfFiles = files.filter(file => file.endsWith('.pdf'));
  
      if (pdfFiles.length === 0) {
        return NextResponse.json({ message: 'Nessun file PDF da eliminare.' });
      }
  
      for (const file of pdfFiles) {
        const filePath = path.join(ordersDir, file);
        await fs.unlink(filePath);
      }
  
      return NextResponse.json({ message: `Tutti i ${pdfFiles.length} file PDF sono stati eliminati con successo.` });
    } catch (error: any) {
      console.error('Errore nell\'eliminazione di tutti i file PDF:', error);
      return NextResponse.json({ message: 'Errore nell\'eliminazione dei file.' }, { status: 500 });
    }
  }