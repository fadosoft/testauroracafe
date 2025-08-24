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
        public_id: `order-${orderId}`, // Nome del file
        resource_type: 'image', // Tratta il file come un'immagine (per PDF)
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

export async function generatePdf(htmlContent: string, orderId: string): Promise<{ pdfUrl: string, pdfBuffer: Buffer }> {
  // Sostituisci 'YOUR_PDF_CO_API_KEY' con la tua chiave API di PDF.co
  // È FORTEMENTE RACCOMANDATO DI USARE UNA VARIABILE D'AMBIENTE PER LA CHIAVE API (es. process.env.PDF_CO_API_KEY)
  const pdfCoApiKey = process.env.PDF_CO_API_KEY; // <-- SOSTITUISCI QUESTO

  if (!pdfCoApiKey) {
    throw new Error('PDF.co API Key non configurata. Assicurati che la variabile d\'ambiente PDF_CO_API_KEY sia impostata su Vercel.');
  }

  const response = await fetch('https://api.pdf.co/v1/pdf/convert/from/html', {
    method: 'POST',
    headers: {
      'x-api-key': pdfCoApiKey,
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      html: htmlContent,
      name: `order-${orderId}.pdf`,
      async: false // Imposta a true se vuoi un'operazione asincrona e ricevere un URL per il download
    }),
  });

  console.log(`Risposta PDF.co - Status: ${response.status}`); // Log status
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Risposta PDF.co - Errore: ${errorText}`); // Log error text
    throw new Error(`Errore API PDF.co: ${response.status} - ${errorText}`);
  }

  const jsonResponse = await response.json();
  console.log('Risposta JSON da PDF.co:', jsonResponse); // Log full JSON response
  if (!jsonResponse.url) {
    throw new Error('Risposta API PDF.co non valida: URL del PDF non trovato.');
  }

  // Scarica il PDF dal URL fornito da PDF.co
  const pdfResponse = await fetch(jsonResponse.url);
  if (!pdfResponse.ok) {
    throw new Error(`Errore durante il download del PDF da PDF.co: ${pdfResponse.statusText}`);
  }

  const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

  const pdfUrl = await uploadToCloudinary(pdfBuffer, orderId);
  return { pdfUrl, pdfBuffer };
}
