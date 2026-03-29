'use client';

import React from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FiltersProps {
  onCategoryChange?: (category: string | null) => void;
  onPriceChange?: (min: number, max: number) => void;
  onRatingChange?: (rating: number | null) => void;
  selectedCategory?: string | null;
  minPrice?: number;
  maxPrice?: number;
  selectedRating?: number | null;
  onClear?: () => void;
}

const categories = [
  'Business Cards',
  'Flyers',
  'Banners',
  'Posters',
  'Apparel',
  'Mugs',
  'Stickers',
  'Signs',
];

const priceRanges = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: 10000 },
];

const ratings = [5, 4, 3, 2, 1];

export const ProductFilters: React.FC<FiltersProps> = ({
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  selectedCategory,
  selectedRating,
  onClear,
}) => {
  const [expandedSections, setExpandedSections] = React.useState({
    category: true,
    price: true,
    rating: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full lg:w-64 bg-white rounded-lg shadow-md p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-print7-dark">Filters</h3>
        {(selectedCategory || selectedRating) && (
          <button
            onClick={onClear}
            className="text-sm text-print7-primary hover:text-blue-700 flex items-center gap-1"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full mb-4 font-semibold text-print7-dark"
          >
            <span>Category</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() => onCategoryChange?.(category)}
                    className="w-4 h-4 text-print7-primary rounded"
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-4 font-semibold text-print7-dark"
          >
            <span>Price</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.price && (
            <div className="space-y-2">
              {priceRanges.map(range => (
                <label key={`${range.min}-${range.max}`} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={() => onPriceChange?.(range.min, range.max)}
                    className="w-4 h-4 text-print7-primary rounded"
                  />
                  <span className="text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full mb-4 font-semibold text-print7-dark"
          >
            <span>Rating</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.rating && (
            <div className="space-y-2">
              {ratings.map(rating => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRating === rating}
                    onChange={() => onRatingChange?.(rating)}
                    className="w-4 h-4 text-print7-primary rounded"
                  />
                  <span className="text-gray-700">
                    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} & up
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
