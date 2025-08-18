'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useState, Suspense } from 'react'; // Import useState and Suspense

// Componente che usa useSearchParams e useState
function ThankYouContent() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('pdfUrl'); // Get pdfUrl from query params

  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [showPdfLink, setShowPdfLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const CORRECT_SECRET_KEY = 'AURORACAFE_SECRET'; // Placeholder: In a real app, validate this via API

  const handleSecretKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKeyInput === CORRECT_SECRET_KEY) {
      setShowPdfLink(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Chiave segreta non valida. Riprova.');
      setShowPdfLink(false);
    }
  };

  return (
    <div className="py-5">
      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
      <h1 className="display-4 mt-3">Grazie per il tuo acquisto!</h1>
      <p className="lead">Grazie per averci scelto! Il tuo ordine è stato accettato, ti invieremo un&apos;email di conferma!</p>
      
      

      <hr className="my-4" />
      <p>Nel frattempo, puoi continuare a navigare nel nostro negozio.</p>
      <Link href="/" className="btn btn-primary btn-lg">
        Torna alla Home
      </Link>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <div className="container mt-5 text-center">
      <Suspense fallback={<div>Caricamento...</div>}> {/* Wrap with Suspense */}
        <ThankYouContent />
      </Suspense>
    </div>
  );
}