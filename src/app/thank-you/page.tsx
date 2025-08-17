'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('pdfUrl'); // Get pdfUrl from query params

  return (
    <div className="container mt-5 text-center">
      <div className="py-5">
        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
        <h1 className="display-4 mt-3">Grazie per il tuo acquisto!</h1>
        <p className="lead">Grazie per averci scelto! Il tuo ordine è stato accettato, ti invieremo un'email di conferma!</p>
        
        {pdfUrl && ( // Conditionally render download link if pdfUrl exists
          <div className="mt-4">
            <p className="lead">Puoi scaricare la conferma del tuo ordine qui:</p>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-lg">
              <i className="bi bi-download me-2"></i>Scarica PDF Ordine
            </a>
          </div>
        )}

        <hr className="my-4" />
        <p>Nel frattempo, puoi continuare a navigare nel nostro negozio.</p>
        <Link href="/" className="btn btn-primary btn-lg">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}