
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [secretKey, setSecretKey] = useState('');
  const [pdfFiles, setPdfFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAllPdfs = async () => {
    if (!window.confirm(`Sei sicuro di voler eliminare tutti i file PDF? Questa azione è irreversibile.`)) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch('/api/admin/orders/delete', {
        method: 'DELETE', // Using DELETE for a bulk deletion action
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante l\'eliminazione di tutti i file.');
      }

      setPdfFiles([]); // Clear the list of files
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeletePdf = async (fileName: string) => {
    if (!window.confirm(`Sei sicuro di voler eliminare il file ${fileName}? Questa azione è irreversibile.`)) {
      return; // User cancelled the deletion
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch('/api/admin/orders/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`,
        },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante l\'eliminazione del file.');
      }

      // Remove the deleted file from the state
      setPdfFiles(prevFiles => prevFiles.filter(file => file !== fileName));
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Chiave segreta non valida.');
        } else {
          throw new Error('Errore nel recupero degli ordini.');
        }
      }

      const data = await response.json();
      setPdfFiles(data);
      setAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="container mt-5">
        <h1>Accesso Ordini Amministrazione</h1>
        <p>Inserisci la chiave segreta per accedere agli ordini PDF.</p>
        <form onSubmit={handleAuthSubmit}>
          <div className="mb-3">
            <label htmlFor="secretKey" className="form-label">Chiave Segreta</label>
            <input
              type="password"
              className="form-control"
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifica...' : 'Accedi'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>Ordini PDF Generati</h1>
      {loading && <p>Caricamento ordini...</p>}
      {error && <p className="text-danger">{error}</p>}

      {pdfFiles.length === 0 ? (
        <div className="alert alert-info">
          Nessun ordine PDF trovato. Gli ordini verranno generati dopo il checkout.
        </div>
      ) : (
        <ul className="list-group">
          {pdfFiles.map((fileName) => (
            <li key={fileName} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <Link href={`/orders/${fileName}`} target="_blank" rel="noopener noreferrer">
                  {fileName}
                </Link>
              </div>
              <div>
                <a href={`/orders/${fileName}`} download className="btn btn-sm btn-primary me-2">
                  Scarica
                </a>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeletePdf(fileName)}
                  disabled={deleting}
                >
                  {deleting ? 'Eliminazione...' : 'Elimina'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 d-flex justify-content-between">
        <Link href="/admin" className="btn btn-outline-secondary">← Torna alla Dashboard Admin</Link>
        <button
          className="btn btn-danger"
          onClick={handleDeleteAllPdfs}
          disabled={deleting || pdfFiles.length === 0}
        >
          {deleting ? 'Eliminazione...' : 'Elimina Tutti i PDF'}
        </button>
      </div>
    </div>
  );
}
