'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductFilters } from '@/components/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { categories } from '@/data/categories';
import { products } from '@/data/products';

const ITEMS_PER_PAGE = 12;

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categorySlug = params.category as string;

  const category = categories.find(c => c.slug === categorySlug);
  const categoryProducts = products.filter(p => p.category === categorySlug);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const filteredAndSorted = useMemo(() => {
    let filtered = [...categoryProducts];

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
  }, [selectedRating, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDesignClick = (productId: string) => {
    router.push(`/studio?productId=${productId}`);
  };

  if (!category) {
    return (
      <div className="container-print7 py-16 text-center">
        <h1 className="text-3xl font-bold text-print7-dark">Category Not Found</h1>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative h-80 w-full">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-2">{category.name}</h1>
          <p className="text-xl text-gray-100">{category.description}</p>
        </div>
      </div>

      <div className="container-print7 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: category.name },
          ]}
        />
      </div>

      <div className="container-print7 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              onClear={() => {
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
    </div>
  );
}
