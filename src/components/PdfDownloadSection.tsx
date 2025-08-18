'use client';

import { useState } from 'react';

interface PdfDownloadSectionProps {
  pdfUrl: string | null;
}

export default function PdfDownloadSection({ pdfUrl }: PdfDownloadSectionProps) {
  // Estrae il public_id dall'URL di Cloudinary.
  // Esempio URL: https://res.cloudinary.com/nome/raw/upload/v123/orders/order-123.pdf
  // Il public_id che vogliamo è "orders/order-123"
  const getPublicIdFromUrl = (url: string) => {
    try {
      const parts = url.split('/');
      const ordersIndex = parts.indexOf('orders');
      if (ordersIndex !== -1 && parts.length > ordersIndex + 1) {
        // Prende la parte finale (es. "order-123.pdf") e rimuove l'estensione
        const fileNameWithExt = parts[ordersIndex + 1];
        const fileName = fileNameWithExt.split('.')[0];
        return `orders/${fileName}`;
      }
      return null;
    } catch {
      return null;
    }
  };

  const publicId = pdfUrl ? getPublicIdFromUrl(pdfUrl) : null;

  return (
    <div className="mt-4">
      <p className="lead">Puoi scaricare la conferma del tuo ordine qui:</p>
      {publicId ? (
        <a href={`/api/download-and-delete-pdf?public_id=${publicId}`} className="btn btn-success btn-lg">
          <i className="bi bi-download me-2"></i>Scarica PDF Ordine
        </a>
      ) : (
        <p className="text-danger">Impossibile generare il link per il download. L'URL del PDF non è valido.</p>
      )}
    </div>
  );
}
