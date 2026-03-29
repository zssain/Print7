'use client';

import React, { useState } from 'react';
import { formatPrice, calculateTax, calculateShipping } from '@/lib/utils';
import { Button } from './ui/Button';

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  onCheckout,
  isLoading = false,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal - discount);
  const total = subtotal - discount + shipping + tax;

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (code === 'SAVE10') {
      setDiscount(subtotal * 0.1);
    } else if (code === 'SAVE20') {
      setDiscount(subtotal * 0.2);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
      <h3 className="text-2xl font-bold text-print7-dark mb-6">Order Summary</h3>

      <div className="space-y-4 border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-print7-success">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-print7-success font-semibold' : ''}>
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
      </div>

      <div className="flex justify-between text-2xl font-bold text-print7-primary mb-6 py-4">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-print7-dark mb-2 block">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-print7-primary"
          />
          <Button variant="outline" size="md" onClick={applyPromoCode}>
            Apply
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Try: SAVE10 or SAVE20</p>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onCheckout}
        isLoading={isLoading}
      >
        Proceed to Checkout
      </Button>

      <p className="text-xs text-gray-600 text-center mt-4">
        Free shipping on orders over $75
      </p>
    </div>
  );
};
