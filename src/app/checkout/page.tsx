'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CustomAlert from '@/components/CustomAlert'; // Importa il componente Alert

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'Italia',
  });
  const [error, setError] = useState<string | null>(null); // Stato per il messaggio di errore
  const [isLoading, setIsLoading] = useState(false); // Stato per il caricamento

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Resetta l'errore precedente
    console.log("Ordine inviato:", { formData, cartItems });

    try {
      const response = await fetch('/api/generate-order-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          cartItems,
          orderTotal: getCartTotal().toFixed(2),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Si è verificato un errore durante la creazione dell'ordine.";
        console.error("Errore nella generazione del PDF:", errorMessage);
        setError(errorMessage); // Mostra l'errore all'utente
      } else {
        console.log("Chiamata API per generazione PDF completata con successo.");
        const successData = await response.json();
        console.log("Successo:", successData);
        clearCart(); // Svuota il carrello solo in caso di successo
        router.push(`/thank-you?pdfUrl=${encodeURIComponent(successData.pdfUrl)}`);
      }
    } catch (error) {
      console.error("Errore durante la chiamata API per generazione PDF:", error);
      setError("Si è verificato un errore di rete. Controlla la tua connessione e riprova.");
    } finally {
      setIsLoading(false); // Disabilita lo stato di caricamento
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h1>Checkout</h1>
        <p className="lead">Non hai articoli nel carrello per procedere al checkout.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>Checkout</h1>
      {error && <CustomAlert type="danger" message={error} />} 
      <div className="row">
        {/* Riepilogo Ordine */}
        <div className="col-md-5 order-md-2 mb-4">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Il tuo carrello</span>
            <span className="badge bg-secondary rounded-pill">{cartItems.length}</span>
          </h4>
          <ul className="list-group mb-3">
            {cartItems.map(item => (
              <li key={item.package.sku} className="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                  <h6 className="my-0">{item.productName}</h6>
                  <small className="text-muted">Formato: {item.package.size} | Quantità: {item.quantity}</small>
                </div>
                <span className="text-muted">€{(item.package.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between">
              <span>Totale (EUR)</span>
              <strong>€{getCartTotal().toFixed(2)}</strong>
            </li>
          </ul>
        </div>

        {/* Dati di Spedizione */}
        <div className="col-md-7 order-md-1">
          <h4 className="mb-3">Indirizzo di spedizione</h4>
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            {/* ... i tuoi campi del form ... */}
            <div className="row">
              <div className="col-md-12 mb-3">
                <label htmlFor="name">Nome completo</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" required />
            </div>

            <div className="mb-3">
              <label htmlFor="address">Indirizzo</label>
              <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Via Roma, 123" required />
            </div>

            <div className="row">
              <div className="col-md-5 mb-3">
                <label htmlFor="city">Città</label>
                <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="zip">CAP</label>
                <input type="text" className="form-control" id="zip" name="zip" value={formData.zip} onChange={handleInputChange} required />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="country">Paese</label>
                <input type="text" className="form-control" id="country" name="country" value={formData.country} onChange={handleInputChange} required />
              </div>
            </div>

            <hr className="mb-4" />

            <button className="btn btn-primary btn-lg w-100" type="submit" disabled={isLoading}>
              {isLoading ? 'Elaborazione...' : 'Completa Ordine'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}