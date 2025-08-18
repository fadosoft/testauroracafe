'use client';

import { useState } from 'react';

interface PdfDownloadSectionProps {
  pdfUrl: string | null;
}

export default function PdfDownloadSection({ pdfUrl }: PdfDownloadSectionProps) {
  // Estrae il solo nome del file dall'URL completo
  const fileName = pdfUrl ? pdfUrl.split('/').pop() : null;

  return (
    <div className="mt-4">
      <p className="lead">Puoi scaricare la conferma del tuo ordine qui:</p>
      {fileName ? (
        <a href={`/api/download-and-delete-pdf?file=${fileName}`} className="btn btn-success btn-lg">
          <i className="bi bi-download me-2"></i>Scarica PDF Ordine
        </a>
      ) : (
        <p className="text-danger">Impossibile generare il link per il download.</p>
      )}
    </div>
  );
}
