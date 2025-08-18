
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import productsData from '@/data/products.json';
import { Product } from '@/components/ProductCard'; // Usiamo la stessa interfaccia
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { addToCart } = useCart();
  const products: Product[] = productsData;
  const product = products.find((p) => p.id.toString() === params.id);

  // State per la confezione selezionata e la quantità
  const [selectedPackage, setSelectedPackage] = useState(product?.packages[0]);
  const [quantity, setQuantity] = useState(1);

  // Aggiorna la confezione selezionata se il prodotto cambia o al primo caricamento
  useEffect(() => {
    if (product && product.packages.length > 0) {
      setSelectedPackage(product.packages[0]);
    } else {
      setSelectedPackage(undefined);
    }
  }, [product]);

  if (!product || !selectedPackage) {
    return (
      <div className="container text-center mt-5">
        <h1>Prodotto non trovato</h1>
        <p>Il prodotto che stai cercando non esiste o non ha confezioni disponibili.</p>
        <Link href="/products" className="btn btn-primary">Torna al catalogo</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Prepara l'oggetto da aggiungere al carrello
    // NOTA: questo richiederà di aggiornare la logica del CartContext
    const itemToAdd = {
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      package: selectedPackage,
      quantity: quantity,
    };
    addToCart(itemToAdd);
    alert(`${quantity} x ${product.name} (${selectedPackage.size}) aggiunto/i al carrello!`);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <Image src={product.image} className="img-fluid rounded" alt={product.name} width={500} height={500} style={{ objectFit: 'cover' }} />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p className="lead">{product.description}</p>
          
          {/* Selettore Confezione */}
          <div className="mt-4">
            <h5>Scegli la confezione:</h5>
            {product.packages.map((pkg) => (
              <div key={pkg.sku} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="packageOptions"
                  id={pkg.sku}
                  value={pkg.sku}
                  checked={selectedPackage.sku === pkg.sku}
                  onChange={() => {
                    setSelectedPackage(pkg);
                    setQuantity(1); // Resetta la quantità quando cambia la confezione
                  }}
                />
                <label className="form-check-label" htmlFor={pkg.sku}>
                  {pkg.size} - <span className="fw-bold">€{pkg.price.toFixed(2)}</span>
                </label>
              </div>
            ))}
          </div>

          {/* Dettagli Confezione Selezionata */}
          <div className="card bg-light p-3 my-3">
            <p className="mb-1"><strong>Prezzo:</strong> €{selectedPackage.price.toFixed(2)}</p>
            <p className="mb-1"><strong>SKU:</strong> {selectedPackage.sku}</p>
            <p className="mb-0"><strong>Disponibilità:</strong> {selectedPackage.stock_quantity} unità</p>
          </div>

          {/* Selettore Quantità e Pulsante Aggiungi */}
          <div className="d-flex align-items-center gap-3">
            <input
              type="number"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              max={selectedPackage.stock_quantity}
              style={{ width: '100px' }}
            />
            <button 
              className="btn btn-success btn-lg flex-grow-1"
              onClick={handleAddToCart}
              disabled={quantity > selectedPackage.stock_quantity}
            >
              Aggiungi al Carrello
            </button>
          </div>
            {quantity > selectedPackage.stock_quantity && 
              <p className='text-danger mt-2'>Quantità non disponibile.</p>
            }
        </div>
      </div>
      <div className="mt-5">
        <Link href="/products" className="btn btn-accent-gold">← Torna al catalogo</Link>
      </div>
    </div>
  );
}
