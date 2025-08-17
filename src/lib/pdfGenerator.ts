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

// Placeholder per la generazione del PDF tramite API esterna
export async function generatePdf(htmlContent: string, orderId: string): Promise<string> {
  // QUI DOVRAI INTEGRARE LA CHIAMATA ALL'API ESTERNA PER LA GENERAZIONE DEL PDF
  // ESEMPIO:
  // const response = await fetch('https://api.pdfservice.com/generate', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer YOUR_API_KEY`, // Sostituisci con la tua chiave API
  //   },
  //   body: JSON.stringify({ html: htmlContent, options: { format: 'A4' } }),
  // });

  // if (!response.ok) {
  //   throw new Error(`Errore API: ${response.statusText}`);
  // }

  // const pdfBlob = await response.blob();
  // const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer()); // Converti Blob in Buffer

  // const pdfUrl = await uploadToCloudinary(pdfBuffer, orderId);
  // return pdfUrl;

  // Per ora, restituisco un URL di esempio e un errore per indicare che l'integrazione è necessaria
  console.warn("La generazione del PDF tramite API esterna non è ancora implementata. Restituendo URL di esempio.");
  throw new Error("Integrazione API per la generazione PDF non implementata.");
}