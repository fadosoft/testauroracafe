
import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/components/ProductCard';

// Definiamo il percorso del nostro file JSON
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Funzione helper per leggere i dati
async function readData(): Promise<Product[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // Se il file non esiste o è vuoto, restituisce un array vuoto
    return [];
  }
}

/**
 * Gestore per la richiesta GET /api/products
 * Legge e restituisce tutti i prodotti dal file JSON.
 */
export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Errore nel leggere i dati dei prodotti.' }, { status: 500 });
  }
}

/**
 * Gestore per la richiesta POST /api/products
 * Crea un nuovo prodotto e lo salva nel file JSON.
 */
export async function POST(request: NextRequest) {
  try {
    const products = await readData();
    const newProductData = await request.json();

    // Crea un nuovo prodotto con un ID univoco
    const newProduct: Product = {
      ...newProductData,
      id: Date.now(), // Semplice modo per generare un ID univoco
    };

    products.push(newProduct);
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));

    return NextResponse.json(newProduct, { status: 201 }); // 201 Created
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Errore nella creazione del prodotto.' }, { status: 500 });
  }
}
