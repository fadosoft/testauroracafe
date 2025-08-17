import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'last_pdf_url.json');
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json({ lastPdfUrl: data.lastPdfUrl });
  } catch (error: any) {
    console.error('Errore nel recupero dell\'ultimo URL PDF:', error);
    return NextResponse.json({ error: 'Impossibile recuperare l\'URL del PDF.' }, { status: 500 });
  }
}
