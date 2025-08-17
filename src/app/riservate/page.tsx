'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RiservatePage() {
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const CORRECT_SECRET_KEY = 'RISERVATE_SECRET'; // Placeholder: In a real app, validate this via API

  const handleSecretKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKeyInput === CORRECT_SECRET_KEY) {
      setErrorMessage('');
      setLoading(true);
      try {
        const response = await fetch('/api/get-last-pdf');
        if (!response.ok) {
          throw new Error('Errore nel recupero dell\'URL del PDF.');
        }
        const data = await response.json();
        if (data.lastPdfUrl) {
          setPdfUrl(data.lastPdfUrl);
          setShowContent(true);
        } else {
          setErrorMessage('Nessun PDF trovato. Generane uno prima.');
        }
      } catch (error: any) {
        console.error('Errore nel recupero PDF:', error);
        setErrorMessage(`Errore nel recupero PDF: ${error.message || 'Errore sconosciuto'}`);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage('Chiave segreta non valida. Riprova.');
      setShowContent(false);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <div className="py-5">
        <h1 className="display-4 mt-3">Area Riservata</h1>
        {!showContent ? (
          <form onSubmit={handleSecretKeySubmit} className="mb-3">
            <p className="lead">Inserisci la chiave segreta per accedere:</p>
            <div className="input-group mx-auto" style={{ maxWidth: '300px' }}>
              <input
                type="password"
                className="form-control"
                placeholder="Chiave Segreta"
                value={secretKeyInput}
                onChange={(e) => setSecretKeyInput(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Caricamento...' : 'Accedi'}
              </button>
            </div>
            {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
          </form>
        ) : (
          <div>
            <p className="lead">Benvenuto nell\'area riservata!</p>
            {pdfUrl ? (
              <div className="mt-4">
                <p className="lead">Scarica l\'ultimo PDF generato:</p>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-lg">
                  <i className="bi bi-download me-2"></i>Scarica PDF
                </a>
              </div>
            ) : (
              <p className="lead text-warning">Nessun PDF disponibile al momento.</p>
            )}
          </div>
        )}
        <hr className="my-4" />
        <Link href="/" className="btn btn-secondary btn-lg">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
