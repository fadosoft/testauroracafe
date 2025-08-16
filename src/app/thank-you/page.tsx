'use client';

import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="container mt-5 text-center">
      <div className="py-5">
        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
        <h1 className="display-4 mt-3">Grazie per il tuo acquisto!</h1>
        <p className="lead">Grazie per averci scelto! Il tuo ordine è stato accettato, ti invieremo un'email di conferma!</p>
        <hr className="my-4" />
        <p>Nel frattempo, puoi continuare a navigare nel nostro negozio.</p>
        <Link href="/" className="btn btn-primary btn-lg">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}