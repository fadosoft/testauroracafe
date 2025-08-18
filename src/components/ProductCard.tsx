
import Image from 'next/image';
import Link from 'next/link';

// Definiamo la struttura dei dati per un singolo prodotto
// Questo ci aiuta con il type-checking e l'autocompletamento
export interface ProductPackage {
  size: string;
  price: number;
  stock_quantity: number;
  sku: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  packages: ProductPackage[];
}


interface ProductCardProps {
  product: Product;
}

// Il componente React per la card del prodotto
export default function ProductCard({ product }: ProductCardProps) {
  
  // Trova il prezzo più basso tra le confezioni disponibili
  const minPrice = product.packages.length > 0 
    ? Math.min(...product.packages.map(p => p.price))
    : 0;

  return (
    <div className="col mb-4">
      <div className="card h-100">
        <Image src={product.image} className="card-img-top" alt={product.name} width={300} height={200} style={{ objectFit: 'cover', margin: '0 auto', display: 'block' }} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          {product.packages.length > 0 ? (
            <h6 className="card-subtitle mb-2 text-muted">A partire da €{minPrice.toFixed(2)}</h6>
          ) : (
            <h6 className="card-subtitle mb-2 text-muted">Prezzo non disponibile</h6>
          )}
          <div className="mt-auto">
            <Link href={`/products/${product.id}`} className="btn btn-primary w-100">
              Vedi Dettagli e Prezzi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
