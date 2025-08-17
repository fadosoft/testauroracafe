
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configura Cloudinary con le credenziali dalle variabili d'ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Funzione per caricare un buffer su Cloudinary
const uploadToCloudinary = (buffer: Buffer, orderId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'orders', // Salva i PDF in una cartella 'orders' su Cloudinary
        public_id: `order-${orderId}`, // Nome del file
        resource_type: 'raw', // Tratta il file come un file generico
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Caricamento su Cloudinary fallito senza un risultato.'));
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

export async function generatePdf(htmlContent: string, orderId: string): Promise<string> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: "new",
  });
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Genera il PDF in un buffer di memoria
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();

  // Carica il buffer su Cloudinary e ottieni l'URL
  const pdfUrl = await uploadToCloudinary(Buffer.from(pdfBuffer), orderId);

  return pdfUrl; // Ritorna l'URL sicuro di Cloudinary
}
