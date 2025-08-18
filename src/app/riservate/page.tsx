'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  orderId: string;
  pdfUrl: string;
}

export default function RiservatePage() {
  const router = useRouter();
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const CORRECT_SECRET_KEY = 'RISERVATE_SECRET'; // Placeholder: In a real app, validate this via API

  const handleSecretKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKeyInput === CORRECT_SECRET_KEY) {
      setErrorMessage('');
      setLoading(true);
      try {
        const response = await fetch('/api/get-all-orders');
        if (!response.ok) {
          throw new Error('Errore nel recupero degli ordini.');
        }
        const data = await response.json();
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
          setShowContent(true);
        } else {
          setErrorMessage('Nessun ordine trovato. Generane uno prima.');
        }
      } catch (error: any) {
        console.error('Errore nel recupero ordini:', error);
        setErrorMessage(`Errore nel recupero ordini: ${error.message || 'Errore sconosciuto'}`);
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
            <p className="lead">Benvenuto nell&apos;area riservata!</p>
            {orders.length > 0 ? (
              <div className="mt-4">
                <p className="lead">Ordini disponibili:</p>
                <ul className="list-group mx-auto" style={{ maxWidth: '400px' }}>
                  {orders.map((order) => {
                    const getPublicIdFromUrl = (url: string) => {
                      try {
                        const parts = url.split('/');
                        const ordersIndex = parts.indexOf('orders');
                        if (ordersIndex !== -1 && parts.length > ordersIndex + 1) {
                          const fileNameWithExt = parts[ordersIndex + 1];
                          const fileName = fileNameWithExt.split('.')[0];
                          return `orders/${fileName}`;
                        }
                        return null;
                      } catch {
                        return null;
                      }
                    };
                    const publicId = getPublicIdFromUrl(order.pdfUrl);

                    const handleDownload = () => {
                      if (!publicId) {
                        alert('URL del PDF non valido, impossibile scaricare.');
                        return;
                      }
                      window.open(`/api/download-and-delete-pdf?public_id=${publicId}`, '_blank');
                      setOrders(currentOrders => currentOrders.filter(o => o.orderId !== order.orderId));
                    };

                    return (
                      <li key={order.orderId} className="list-group-item d-flex justify-content-between align-items-center">
                        Ordine ID: {order.orderId}
                        <button onClick={handleDownload} className="btn btn-sm btn-success">
                          Scarica e Rimuovi
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="lead text-warning">Nessun ordine disponibile al momento.</p>
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
