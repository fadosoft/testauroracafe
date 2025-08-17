
'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { cartItems } = useCart();
  const pathname = usePathname();

  // Calcoliamo il numero totale di articoli nel carrello
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top">
      <div className="container d-flex flex-column align-items-center">
        <div className="d-flex justify-content-between align-items-center w-100">
          <Link href="/" className="navbar-brand">
            <img src="/logo.webp" alt="Aurora Cafè Logo" className="navbar-logo" />
          </Link>
          <span className="text-center my-2 display-4 fw-bold text-dark">
            Benvenuti in Aurora Cafè
          </span>
          <div className="d-flex">
            <Link href="/cart" className="btn btn-success">
              <i className="bi-cart-fill me-1"></i>
              Carrello
              <span className="badge bg-dark text-white ms-1 rounded-pill">{totalItems}</span>
            </Link>
          </div>
        </div>
        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/products" className={`nav-link ${pathname === '/products' ? 'active' : ''}`}>I nostri prodotti</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>Chi siamo</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Contatti</Link>
            </li>
            <li className="nav-item">
              <Link href="/riservate" className={`nav-link ${pathname === '/riservate' ? 'active' : ''}`}>Riservate</Link>
            </li>
          </ul>
      </div>
    </nav>
  );
}
