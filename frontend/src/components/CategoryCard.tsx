'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';
import { Button } from './ui/Button';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/products/${category.slug}`}>
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer h-64">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col items-center justify-center">
          <span className="text-5xl mb-3">{category.icon}</span>
          <h3 className="text-2xl font-bold text-white mb-2 text-center">
            {category.name}
          </h3>
          <p className="text-gray-100 text-sm text-center px-4 mb-4">
            {category.description}
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="group-hover:scale-110 transition-transform"
          >
            Explore Now
          </Button>
        </div>
      </div>
    </Link>
  );
};
