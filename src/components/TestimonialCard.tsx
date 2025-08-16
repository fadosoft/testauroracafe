import React from 'react';

export interface Testimonial {
  id: number;
  reviewerName: string;
  rating: number;
  reviewText: string;
  date: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="card-title mb-0">{testimonial.reviewerName}</h5>
            <div className="text-warning">
              {Array.from({ length: 5 }, (_, i) => (
                <i key={i} className={`bi bi-star${i < testimonial.rating ? '-fill' : ''}`}></i>
              ))}
            </div>
          </div>
          <p className="card-text flex-grow-1">{testimonial.reviewText}</p>
          <small className="text-muted mt-2">{testimonial.date}</small>
        </div>
      </div>
    </div>
  );
}
