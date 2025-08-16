
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Product, ProductPackage } from '@/components/ProductCard';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Usiamo Partial<Product> per lo stato iniziale, ma ci aspettiamo un Product completo
  const [product, setProduct] = useState<Partial<Product>>({ packages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) throw new Error('Prodotto non trovato.');
          const data = await response.json();
          setProduct(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // Gestisce le modifiche all'interno di una confezione
  const handlePackageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedPackages = [...(product.packages || [])];
    const currentPackage = { ...updatedPackages[index] };

    if (name === 'price' || name === 'stock_quantity') {
      currentPackage[name as 'price' | 'stock_quantity'] = parseFloat(value) || 0;
    } else {
      currentPackage[name as 'size' | 'sku'] = value;
    }
    
    updatedPackages[index] = currentPackage;
    setProduct(prev => ({ ...prev, packages: updatedPackages }));
  };

  // Aggiunge una nuova confezione vuota
  const addPackage = () => {
    const newPackage: ProductPackage = { sku: '', size: '', price: 0, stock_quantity: 0 };
    setProduct(prev => ({ ...prev, packages: [...(prev.packages || []), newPackage] }));
  };

  // Rimuove una confezione
  const removePackage = (index: number) => {
    setProduct(prev => ({ ...prev, packages: prev.packages?.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Aggiornamento fallito: ${errorBody}`);
      }

      router.push('/admin');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Caricamento prodotto...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h1>Modifica Prodotto</h1>
      <form onSubmit={handleSubmit}>
        {/* Campi Prodotto Principali */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nome Prodotto</label>
          <input type="text" className="form-control" id="name" name="name" value={product.name || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descrizione</label>
          <textarea className="form-control" id="description" name="description" value={product.description || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Categoria</label>
          <input type="text" className="form-control" id="category" name="category" value={product.category || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">URL Immagine</label>
          <input type="text" className="form-control" id="image" name="image" value={product.image || ''} onChange={handleChange} required />
        </div>

        {/* Gestione Confezioni */}
        <hr />
        <h4 className="mt-4">Gestione Confezioni</h4>
        {product.packages?.map((pkg, index) => (
          <div key={index} className="card mb-3 p-3">
            <div className="row">
              <div className="col-md-3">
                <label className="form-label">Formato (es. 50 cialde)</label>
                <input type="text" className="form-control" name="size" value={pkg.size} onChange={(e) => handlePackageChange(index, e)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Prezzo</label>
                <input type="number" step="0.01" className="form-control" name="price" value={pkg.price} onChange={(e) => handlePackageChange(index, e)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Quantità</label>
                <input type="number" className="form-control" name="stock_quantity" value={pkg.stock_quantity} onChange={(e) => handlePackageChange(index, e)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">SKU</label>
                <input type="text" className="form-control" name="sku" value={pkg.sku} onChange={(e) => handlePackageChange(index, e)} />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removePackage(index)}>X</button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addPackage}>Aggiungi Confezione</button>

        <hr />

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Salvataggio...' : 'Salva Modifiche'}
        </button>
      </form>
    </div>
  );
}
