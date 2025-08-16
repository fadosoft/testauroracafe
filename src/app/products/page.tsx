
'use client';

import { useState } from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import productsData from '@/data/products.json';

export default function ProductsPage() {
  const allProducts: Product[] = productsData;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Estrai categorie uniche dai prodotti
  const categories = ['Tutte', ...Array.from(new Set(allProducts.map(p => p.category)))];

  const filteredProducts = allProducts
    .filter(product => {
      // Filtro per categoria
      return selectedCategory === null || selectedCategory === 'Tutte' || product.category === selectedCategory;
    })
    .filter(product => {
      // Filtro per termine di ricerca (nome o descrizione)
      return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             product.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <main className="container mt-5">
      <h1 className="text-center mb-4">I nostri prodotti</h1>
      <p className="lead text-center mb-4">La nostra selezione di caffè pregiati, scelti per te.</p>

      {/* Controlli di Filtro e Ricerca */}
      <div id="products-section" className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Cerca per nome o descrizione..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <div className="btn-group w-100">
            {categories.map(category => (
              <button
                key={category}
                className={`btn ${selectedCategory === category || (selectedCategory === null && category === 'Tutte') ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(category === 'Tutte' ? null : category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Griglia Prodotti */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">Nessun prodotto trovato.</p>
          </div>
        )}
      </div>
    </main>
  );
}
