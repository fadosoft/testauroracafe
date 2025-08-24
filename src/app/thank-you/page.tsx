'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Componente che mostra il contenuto della pagina di ringraziamento
function ThankYouContent() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('pdfUrl');

  return (
    <div className="py-5">
      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
      <h1 className="display-4 mt-3">Grazie per il tuo acquisto!</h1>
      <p className="lead">Il tuo ordine è stato accettato e verrà elaborato a breve. Ti invieremo un&apos;email di conferma!</p>
      
      {pdfUrl && (
        <div className="alert alert-success mt-4" role="alert">
          <h4 className="alert-heading">Ordine Confermato!</h4>
          <p>Puoi scaricare la ricevuta del tuo ordine in formato PDF cliccando sul pulsante qui sotto.</p>
          <hr />
          <a href={pdfUrl} className="btn btn-success btn-lg" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-file-earmark-pdf-fill me-2"></i>
            Scarica il PDF del tuo Ordine
          </a>
        </div>
      )}

      <hr className="my-4" />
      <p>Nel frattempo, puoi continuare a navigare nel nostro negozio.</p>
      <Link href="/" className="btn btn-primary btn-lg">
        Torna alla Home
      </Link>
    </div>
  );
}

// Pagina di ringraziamento che usa Suspense per caricare il contenuto
export default function ThankYouPage() {
  return (
    <div className="container mt-5 text-center">
      <Suspense fallback={<div>Caricamento...</div>}>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}