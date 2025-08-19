'use client';

import React, { useEffect, useState } from 'react';

interface Review {
  id: number;
  productId: number;
  userId?: number | null;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

interface ReviewListProps {
  productId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Review[] = await response.json();
        setReviews(data);
      } catch (err) {
        setError('Failed to load reviews.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (reviews.length === 0) {
    return <p>No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-yellow-500">{'★'.repeat(review.rating)}</span>
              <span className="ml-2 text-gray-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            {review.comment && <p className="text-gray-700">{review.comment}</p>}
            {review.userId && <p className="text-gray-500 text-sm mt-2">By User ID: {review.userId}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
