'use client';

import { useState } from 'react';
import Link from 'next/link';

// Interfaccia aggiornata per corrispondere alla nuova risposta dell'API
interface Order {
  publicId: string;
  pdfUrl: string;
}

export default function RiservatePage() {
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Per il login iniziale
  const [isRefreshing, setIsRefreshing] = useState(false); // Per l'aggiornamento
  const [orders, setOrders] = useState<Order[]>([]);

  const CORRECT_SECRET_KEY = 'RISERVATE_SECRET';

  // Funzione riutilizzabile per caricare gli ordini
  const fetchOrders = async () => {
    setIsRefreshing(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/get-all-orders', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Errore nel recupero degli ordini.');
      }
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error: any) {
      setErrorMessage(`Errore nel recupero ordini: ${error.message || 'Errore sconosciuto'}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSecretKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKeyInput === CORRECT_SECRET_KEY) {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
      setShowContent(true);
    } else {
      setErrorMessage('Chiave segreta non valida. Riprova.');
      setShowContent(false);
    }
  };

  const handleDelete = async (publicIdToDelete: string) => {
    if (!window.confirm(`Sei sicuro di voler eliminare l订单 ${publicIdToDelete}? L'azione è irreversibile.`)) {
      return;
    }
    try {
      const response = await fetch('/api/admin/orders/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: publicIdToDelete }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante l\'eliminazione.');
      }
      setOrders(currentOrders => currentOrders.filter(o => o.publicId !== publicIdToDelete));
      alert('Ordine eliminato con successo!');
    } catch (error: any) {
      alert(`Errore durante l\'eliminazione: ${error.message}`);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Sei sicuro di voler eliminare TUTTI gli ordini? Questa operazione è irreversibile.')) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders/delete', { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Errore durante l\'eliminazione di tutti gli ordini.');
      }
      setOrders([]);
      alert('Tutti gli ordini sono stati eliminati con successo!');
    } catch (error: any) {
      alert(`Errore nell\'eliminazione di tutti gli ordini: ${error.message}`);
    } finally {
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
            <p className="lead">Benvenuto! Ecco gli ordini generati.</p>
            {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
            <div className="mt-4">
              <div className="d-flex justify-content-center gap-2 mb-3">
                <button onClick={fetchOrders} className="btn btn-primary" disabled={isRefreshing}>
                  {isRefreshing ? 'Aggiornamento...' : 'Aggiorna Lista'}
                </button>
                <button onClick={handleDeleteAll} className="btn btn-danger" disabled={loading || orders.length === 0}>
                  {loading ? 'Eliminazione...' : 'Elimina Tutti'}
                </button>
              </div>
              {orders.length > 0 ? (
                <ul className="list-group mx-auto" style={{ maxWidth: '600px' }}>
                  {orders.map((order) => (
                    <li key={order.publicId} className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="text-truncate" style={{ maxWidth: '300px' }}>{order.publicId}</span>
                      <div>
                        <a href={order.pdfUrl} className="btn btn-sm btn-success me-2" target="_blank" rel="noopener noreferrer">
                          Scarica
                        </a>
                        <button onClick={() => handleDelete(order.publicId)} className="btn btn-sm btn-danger">
                          Elimina
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="lead text-info mt-4">Nessun ordine disponibile al momento.</p>
              )}
            </div>
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
