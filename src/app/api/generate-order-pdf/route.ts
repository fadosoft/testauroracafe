import { NextRequest, NextResponse } from 'next/server';
import { generatePdf } from '@/lib/pdfGenerator';
import { CartItem } from '@/context/CartContext';
import { kv } from '@vercel/kv';
import nodemailer from 'nodemailer'; // NEW IMPORT

export async function POST(req: NextRequest) {
  console.log("API route generate-order-pdf hit!");
  try {
    const body = await req.json();
    const { formData, cartItems, orderTotal } = body;
    console.log('Received cartItems:', cartItems);

    // Log della chiave API di PDF.co (solo per debug, rimuovere in produzione!)
    console.log('PDF_CO_API_KEY (first 5 chars):', process.env.PDF_CO_API_KEY ? process.env.PDF_CO_API_KEY.substring(0, 5) : 'NOT_SET');

    if (!formData || !cartItems || !orderTotal || !formData.name) {
      return NextResponse.json({ error: 'Dati mancanti per la generazione del PDF.' }, { status: 400 });
    }

    // --- Inizio Logica Nome File --- 
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const sanitizedName = formData.name
      .toLowerCase()
      .replace(/\s+/g, '_') // Sostituisce spazi con underscore
      .replace(/[^a-z0-9_-]/g, ''); // Rimuove caratteri non alfanumerici
    
    const publicId = `ordine_${sanitizedName}_${uniqueId}`;
    // --- Fine Logica Nome File ---

    const orderDate = new Date().toLocaleDateString('it-IT', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Costruisci il contenuto HTML per il PDF
    let htmlContent = `
      <h1>Conferma Ordine Aurora Café</h1>
      <p><strong>Data Ordine:</strong> ${orderDate}</p>
      <p><strong>ID Ordine:</strong> #${publicId}</p> 
      <hr>
      <h2>Dettagli Cliente</h2>
      <p><strong>Nome:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Indirizzo:</strong><br>${formData.address}<br>${formData.zip} ${formData.city}</p>
      <hr>
      <h2>Riepilogo Ordine</h2>
      <table border="1" cellpadding="5" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th>Prodotto</th>
            <th>Formato</th>
            <th>Quantità</th>
            <th>Prezzo Unitario</th>
            <th>Totale</th>
          </tr>
        </thead>
        <tbody>
    `;

    cartItems.forEach((item: CartItem) => {
      htmlContent += `
        <tr>
          <td>${item.productName}</td>
          <td>${item.package.size}</td>
          <td>${item.quantity}</td>
          <td>€${item.package.price.toFixed(2)}</td>
          <td>€${(item.package.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    });

    htmlContent += `
        </tbody>
      </table>
      <h3>Totale Complessivo: €${orderTotal}</h3>
      <hr>
      <p>Grazie per il tuo acquisto!</p>
    `;

    const { pdfUrl, pdfBuffer } = await generatePdf(htmlContent, publicId);
    console.log(`PDF URL generato da generatePdf: ${pdfUrl}`);

    // Salva l'URL del PDF in Vercel KV con una chiave unica per l'ordine
    await kv.set(`order:${publicId}`, pdfUrl);
    // Aggiungi l'ID dell'ordine a una lista di tutti gli ordini
    await kv.set(`order_id:${publicId}`, 'true');
    console.log(`URL PDF per ordine ${publicId} salvato in Vercel KV: ${pdfUrl}`);

    // --- Email Sending Logic ---
    const adminEmail: string | null = await kv.get('admin_email');
    if (adminEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `Nuovo Ordine Aurora Café - #${publicId}`,
        html: `
          <p>Hai ricevuto un nuovo ordine da ${formData.name} (${formData.email}).</p>
          <p><strong>ID Ordine:</strong> #${publicId}</p>
          <p><strong>Totale:</strong> €${orderTotal}</p>
          <p>Alleghiamo il PDF dell'ordine.</p>
        `,
        attachments: [
          {
            filename: `${publicId}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Email ordine inviata con successo ad admin.');
      } catch (emailError) {
        console.error('Errore nell\'invio dell\'email all\'admin:', emailError);
      }
    } else {
      console.log('Invio email all\'admin saltato: email admin non configurata o credenziali mancanti.');
    }
    // --- End Email Sending Logic ---

    return NextResponse.json({ message: 'PDF generato e caricato con successo!', pdfUrl });
  } catch (error: any) {
    console.error('Errore nella generazione del PDF (catch block):', error);
    if (error instanceof Error) {
      console.error('Dettagli errore:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    } else {
      console.error('Errore sconosciuto:', error);
    }
    return NextResponse.json({ error: error.message || 'Errore sconosciuto nella generazione del PDF' }, { status: 500 });
  }
}