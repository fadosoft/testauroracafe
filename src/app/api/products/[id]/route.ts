
import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/components/ProductCard';

const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

async function readData(): Promise<Product[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

async function writeData(data: Product[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

/**
 * GET /api/products/[id]
 * Recupera un singolo prodotto in base all'ID.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const products = await readData();
    const product = products.find((p) => p.id.toString() === params.id);

    if (!product) {
      return NextResponse.json({ message: 'Prodotto non trovato.' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Errore nel leggere i dati.' }, { status: 500 });
  }
}

/**
 * PUT /api/products/[id]
 * Aggiorna un prodotto esistente.
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const products = await readData();
    const productIndex = products.findIndex((p) => p.id.toString() === params.id);

    if (productIndex === -1) {
      return NextResponse.json({ message: 'Prodotto non trovato.' }, { status: 404 });
    }

    const updatedProductData = await request.json();
    updatedProductData.id = products[productIndex].id;

    products[productIndex] = updatedProductData;
    await writeData(products);

    return NextResponse.json(updatedProductData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Errore nell\'aggiornamento del prodotto.' }, { status: 500 });
  }
}

/**
 * DELETE /api/products/[id]
 * Elimina un prodotto.
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const products = await readData();
    const filteredProducts = products.filter((p) => p.id.toString() !== params.id);

    if (products.length === filteredProducts.length) {
      return NextResponse.json({ message: 'Prodotto non trovato.' }, { status: 404 });
    }

    await writeData(filteredProducts);

    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Errore nell\'eliminazione del prodotto.' }, { status: 500 });
  }
}
