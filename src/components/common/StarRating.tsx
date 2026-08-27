import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showScore?: boolean;
  reviewCount?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 14,
  showScore = false,
  reviewCount,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center text-[#f59e0b]">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index + 1 <= Math.floor(rating);
          const half = !filled && index < rating;
          return (
            <Star
              key={index}
              size={size}
              className={`${
                filled
                  ? 'fill-[#f59e0b] text-[#f59e0b]'
                  : half
                  ? 'fill-[#f59e0b]/50 text-[#f59e0b]'
                  : 'fill-transparent text-gray-300'
              }`}
            />
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-gray-700 ml-0.5">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-500">({reviewCount})</span>
      )}
    </div>
  );
};
