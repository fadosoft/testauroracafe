
import { NextRequest, NextResponse } from 'next/server';
import { generatePdf } from '@/lib/pdfGenerator';
import { CartItem } from '@/context/CartContext';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData, cartItems, orderTotal } = body;

    if (!formData || !cartItems || !orderTotal) {
      return NextResponse.json({ error: 'Dati mancanti per la generazione del PDF.' }, { status: 400 });
    }

    const orderId = Date.now().toString(); // ID ordine basato sul timestamp
    const orderDate = new Date().toLocaleDateString('it-IT', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Costruisci il contenuto HTML per il PDF
    let htmlContent = `
      <h1>Conferma Ordine Aurora Café</h1>
      <p><strong>Data Ordine:</strong> ${orderDate}</p>
      <p><strong>ID Ordine:</strong> #${orderId}</p>
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

    const pdfUrl = await generatePdf(htmlContent, orderId);

    return NextResponse.json({ message: 'PDF generato e caricato con successo!', pdfUrl });
  } catch (error: any) {
    console.error('Errore nella generazione del PDF:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
