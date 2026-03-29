'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { Rating } from './ui/Rating';
import { Button } from './ui/Button';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onDesignClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDesignClick }) => {
  const [isFavorited, setIsFavorited] = React.useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
      <div className="relative overflow-hidden bg-gray-100 h-64">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart
            size={20}
            className={isFavorited ? 'fill-print7-secondary text-print7-secondary' : 'text-gray-400'}
          />
        </button>
        {product.featured && (
          <div className="absolute top-3 left-3 bg-print7-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/products/${product.category}/${product.id}`}>
          <h3 className="text-lg font-semibold text-print7-dark hover:text-print7-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3">
          <Rating rating={product.rating} reviews={product.reviews} size="sm" />
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-print7-primary">
            {formatPrice(product.price)}
          </span>
          {!product.inStock && (
            <span className="text-sm font-semibold text-print7-error">Out of Stock</span>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          className="w-full mt-4"
          onClick={onDesignClick}
          disabled={!product.inStock}
        >
          <ShoppingCart size={16} className="mr-2" />
          Design Now
        </Button>
      </div>
    </div>
  );
};
