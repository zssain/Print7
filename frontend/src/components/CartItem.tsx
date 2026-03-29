'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-print7-dark">
          {item.product.name}
        </h3>
        {item.selectedOptions.size && (
          <p className="text-sm text-gray-600">
            Size: {item.selectedOptions.size}
          </p>
        )}
        {item.selectedOptions.color && (
          <p className="text-sm text-gray-600">
            Color: {item.selectedOptions.color}
          </p>
        )}
        {item.selectedOptions.material && (
          <p className="text-sm text-gray-600">
            Material: {item.selectedOptions.material}
          </p>
        )}

        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="p-1 hover:bg-gray-100"
            >
              <Minus size={16} />
            </button>
            <span className="px-3 py-1 font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="p-1 hover:bg-gray-100"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={onRemove}
            className="text-print7-error hover:text-red-700 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="text-right flex flex-col justify-between">
        <div>
          <p className="text-lg font-bold text-print7-primary">
            {formatPrice(item.totalPrice)}
          </p>
          <p className="text-sm text-gray-600">
            {formatPrice(item.product.price)} each
          </p>
        </div>
      </div>
    </div>
  );
};
