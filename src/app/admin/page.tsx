
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/components/ProductCard'; // Using the updated Product interface

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Errore nel caricamento dei prodotti: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto? L\'azione è irreversibile.')) {
      try {
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Eliminazione fallita.');
        }
        setProducts(products.filter((p) => p.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const getMinPrice = (product: Product) => {
    if (!product.packages || product.packages.length === 0) return 0;
    return Math.min(...product.packages.map(p => p.price));
  };

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard Amministrazione</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          Aggiungi Prodotto
        </Link>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Prezzo (a partire da)</th>
            <th>N. Confezioni</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>€{getMinPrice(product).toFixed(2)}</td>
              <td>{product.packages?.length || 0}</td>
              <td>
                <Link href={`/admin/products/edit/${product.id}`} className="btn btn-sm btn-warning me-2">
                  Modifica
                </Link>
                <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-danger">
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

