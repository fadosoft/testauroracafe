
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductPackage } from '@/components/ProductCard';

export default function NewProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: '',
    image: '/images/placeholder.jpg',
    packages: [{ sku: '', size: '', price: 0, stock_quantity: 0 }] // Inizia con una confezione vuota
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

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

  const addPackage = () => {
    const newPackage: ProductPackage = { sku: '', size: '', price: 0, stock_quantity: 0 };
    setProduct(prev => ({ ...prev, packages: [...(prev.packages || []), newPackage] }));
  };

  const removePackage = (index: number) => {
    setProduct(prev => ({ ...prev, packages: prev.packages?.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Salvataggio fallito: ${errorBody}`);
      }

      router.push('/admin');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Aggiungi Nuovo Prodotto</h1>
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
                <input type="text" className="form-control" name="size" value={pkg.size} onChange={(e) => handlePackageChange(index, e)} required/>
              </div>
              <div className="col-md-3">
                <label className="form-label">Prezzo</label>
                <input type="number" step="0.01" className="form-control" name="price" value={pkg.price} onChange={(e) => handlePackageChange(index, e)} required/>
              </div>
              <div className="col-md-2">
                <label className="form-label">Quantità</label>
                <input type="number" className="form-control" name="stock_quantity" value={pkg.stock_quantity} onChange={(e) => handlePackageChange(index, e)} required/>
              </div>
              <div className="col-md-3">
                <label className="form-label">SKU</label>
                <input type="text" className="form-control" name="sku" value={pkg.sku} onChange={(e) => handlePackageChange(index, e)} required/>
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removePackage(index)}>X</button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addPackage}>Aggiungi Confezione</button>

        <hr />
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Salvataggio...' : 'Salva Prodotto'}
        </button>
      </form>
    </div>
  );
}
