'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Il tuo Carrello</h1>

      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Il tuo carrello è vuoto. <Link href="/products">Torna al catalogo</Link> per aggiungere prodotti.
        </div>
      ) : (
        <>
          <table className="table align-middle">
            <thead>
              <tr>
                <th scope="col">Prodotto</th>
                <th scope="col">Prezzo</th>
                <th scope="col" className="text-center">Quantità</th>
                <th scope="col" className="text-end">Totale</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.package.sku}>
                  <td>
                    <div className="d-flex align-items-center">
                      <Image src={item.productImage} alt={item.productName} width={80} height={80} style={{ objectFit: 'cover' }} className="me-3 rounded" />
                      <div>
                        <h5 className="mb-0">{item.productName}</h5>
                        <small className="text-muted">Formato: {item.package.size}</small>
                      </div>
                    </div>
                  </td>
                  <td>€{item.package.price.toFixed(2)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <button 
                        className="btn btn-outline-secondary btn-sm" 
                        onClick={() => updateQuantity(item.package.sku, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button 
                        className="btn btn-outline-secondary btn-sm" 
                        onClick={() => updateQuantity(item.package.sku, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-end">€{(item.package.price * item.quantity).toFixed(2)}</td>
                  <td className="text-end">
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.package.sku)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="row justify-content-end mt-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Riepilogo Ordine</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Subtotale
                      <span>€{getCartTotal().toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Spedizione
                      <span>Gratuita</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
                      Totale
                      <span>€{getCartTotal().toFixed(2)}</span>
                    </li>
                  </ul>
                  <Link href="/checkout" className="btn btn-primary w-100 mt-3">
                    Procedi al Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}