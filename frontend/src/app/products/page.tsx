'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductFilters } from '@/components/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';
import { products } from '@/data/products';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const filteredAndSorted = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory.toLowerCase().replace(' ', '-'));
    }

    if (selectedRating) {
      filtered = filtered.filter(p => Math.round(p.rating) >= selectedRating);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort(() => Math.random() - 0.5);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  }, [selectedCategory, selectedRating, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDesignClick = (productId: string) => {
    router.push(`/studio?productId=${productId}`);
  };

  return (
    <div className="container-print7 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-print7-dark mb-2">All Products</h1>
        <p className="text-gray-600">Browse our complete collection of printable products</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <ProductFilters
            selectedCategory={selectedCategory}
            selectedRating={selectedRating}
            onCategoryChange={setSelectedCategory}
            onRatingChange={setSelectedRating}
            onClear={() => {
              setSelectedCategory(null);
              setSelectedRating(null);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSorted.length)} of {filteredAndSorted.length} products
            </p>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-print7-primary"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <ProductGrid
            products={paginatedProducts}
            onDesignClick={(product) => handleDesignClick(product.id)}
          />

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
