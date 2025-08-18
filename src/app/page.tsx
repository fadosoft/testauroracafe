
'use client';

import { useState } from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import productsData from '@/data/products.json';
import Link from 'next/link';
import TestimonialCard, { Testimonial } from '@/components/TestimonialCard';
import testimonialsData from '@/data/testimonials.json';

export default function Home() {

  return (
    <main className="container mt-5">
      <div className="p-5 mb-4 rounded-3" style={{
        backgroundImage: 'url("https://via.placeholder.com/1600x400/55423d/ffffff")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
      }}>
        <div className="container-fluid py-5">
          <h1 className="display-3 fw-bold mb-3 text-white">Scopri l&apos;Essenza del Vero Caffè</h1>
          <p className="fs-4 mb-4 text-white">Miscele pregiate, selezionate con cura, tostato con amore, passione artigianale, aroma inconfondibile.</p>
          <Link href="/products" className="btn btn-primary btn-lg">Esplora i Prodotti</Link>
        </div>
      </div>

      <section className="container my-5">
        <h2 className="text-center mb-4">Cosa dicono di noi</h2>
        <div className="row">
          {testimonialsData.map((testimonial: Testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>
    </main>
  );
}
