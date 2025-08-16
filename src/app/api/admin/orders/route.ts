
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
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
    return NextResponse.json(pdfFiles);
  } catch (error) {
    console.error('Errore nella lettura della directory degli ordini:', error);
    return NextResponse.json({ message: 'Errore nel recupero degli ordini.' }, { status: 500 });
  }
}
