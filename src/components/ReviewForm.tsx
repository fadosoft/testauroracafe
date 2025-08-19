'use client';

import React, { useState } from 'react';

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (rating === 0) {
      setError('Please select a rating.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
          // userId: You might want to get this from an authenticated user session
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess('Review submitted successfully!');
      setRating(0);
      setComment('');
      onReviewSubmitted(); // Notify parent component to refresh reviews
    } catch (err) {
      setError('Failed to submit review.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Submit a Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="rating" className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">Comment (optional):</label>
          <textarea
            id="comment"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
