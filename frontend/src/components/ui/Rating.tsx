'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviews?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviews,
  interactive = false,
  onChange,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  const displayRating = hoverRating || Math.round(rating);
  const starSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => {
              if (interactive && onChange) onChange(star);
            }}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            disabled={!interactive}
          >
            <Star
              size={starSize}
              className={
                star <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }
            />
          </button>
        ))}
      </div>
      <span className="text-sm font-medium text-print7-dark">
        {rating.toFixed(1)}
      </span>
      {reviews !== undefined && (
        <span className="text-sm text-gray-500">
          ({reviews} {reviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};
