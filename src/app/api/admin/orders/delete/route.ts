import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { kv } from '@vercel/kv';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Common authorization function
async function authorizeRequest(req: NextRequest) {
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (!secretKey) {
    throw new Error('ADMIN_SECRET_KEY non configurata.');
  }
  const authHeader = req.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
    return false;
  }
  return true;
}

// Handles single PDF deletion
export async function POST(req: NextRequest) {
  try {
    if (!(await authorizeRequest(req))) {
      return NextResponse.json({ message: 'Non autorizzato.' }, { status: 401 });
    }

    const { fileName } = await req.json();
    if (!fileName) {
      return NextResponse.json({ message: 'Nome del file non fornito.' }, { status: 400 });
    }

    const publicId = fileName; // The fileName from the admin page is the public_id
    const orderId = publicId.replace('order-', '');

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

    // Delete from Vercel KV
    await kv.del(`order:${orderId}`);
    await kv.del(`order_id:${publicId}`);

    console.log(`File ${publicId} e dati associati eliminati con successo.`);
    return NextResponse.json({ message: `File ${fileName} eliminato con successo.` });

  } catch (error: any) {
    console.error(`Errore nell'eliminazione del file:`, error);
    return NextResponse.json({ message: error.message || 'Errore nell\'eliminazione del file.' }, { status: 500 });
  }
}

// Handles bulk PDF deletion
export async function DELETE(req: NextRequest) {
  try {
    if (!(await authorizeRequest(req))) {
      return NextResponse.json({ message: 'Non autorizzato.' }, { status: 401 });
    }

    const orderIdKeys = await kv.keys('order_id:*');
    if (orderIdKeys.length === 0) {
      return NextResponse.json({ message: 'Nessun file PDF da eliminare.' });
    }

    const publicIds = orderIdKeys.map(key => key.replace('order_id:', ''));
    const orderIds = publicIds.map(pid => pid.replace('order-', ''));

    // Bulk delete from Cloudinary
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds, { resource_type: 'raw' });
    }

    // Bulk delete from Vercel KV
    const kvKeysToDelete = [
      ...orderIdKeys,
      ...orderIds.map(id => `order:${id}`)
    ];
    
    if (kvKeysToDelete.length > 0) {
      await kv.del(...kvKeysToDelete);
    }

    console.log(`Tutti i ${publicIds.length} file PDF e dati associati sono stati eliminati.`);
    return NextResponse.json({ message: `Tutti i ${publicIds.length} file PDF sono stati eliminati con successo.` });

  } catch (error: any) {
    console.error('Errore nell\'eliminazione di tutti i file PDF:', error);
    return NextResponse.json({ message: error.message || 'Errore nell\'eliminazione dei file.' }, { status: 500 });
  }
}
