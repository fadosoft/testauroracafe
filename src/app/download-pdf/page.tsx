'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PdfDownloadSection from '@/components/PdfDownloadSection';
import Link from 'next/link';

function DownloadPdfContent() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('pdfUrl');

  return (
    <div className="container mt-5 text-center">
      <div className="py-5">
        <h1 className="display-4 mt-3">Scarica il tuo PDF</h1>
        {pdfUrl ? (
          <PdfDownloadSection pdfUrl={pdfUrl} />
        ) : (
          <p className="lead text-danger">URL del PDF non trovato. Assicurati di aver generato un PDF.</p>
        )}
        <hr className="my-4" />
        <Link href="/" className="btn btn-secondary btn-lg">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}

export default function DownloadPdfPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <DownloadPdfContent />
    </Suspense>
  );
}
