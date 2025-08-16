import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // In un'applicazione reale, qui elaboreresti i dettagli del pagamento
    // con un gateway come Stripe. Per questo mock, simuliamo un successo.

    const paymentDetails = await request.json();
    console.log('Mock Payment Request Received:', paymentDetails);

    // Simula un ritardo per rendere l'esperienza più realistica
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Restituisce una risposta di successo simulata
    return NextResponse.json({ success: true, message: 'Pagamento mock elaborato con successo.', transactionId: `mock_${Date.now()}` }, { status: 200 });

  } catch (error) {
    console.error('Errore nel mock payment:', error);
    return NextResponse.json({ success: false, message: 'Errore nell\'elaborazione del pagamento mock.' }, { status: 500 });
  }
}