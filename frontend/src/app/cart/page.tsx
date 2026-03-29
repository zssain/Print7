'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CartItem } from '@/components/CartItem';
import { CartSummary } from '@/components/CartSummary';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const total = useCartStore(state => state.getTotal());

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container-print7 py-16">
        <div className="text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-4xl font-bold text-print7-dark mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 text-lg mb-8">Start shopping to add items to your cart</p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              <ArrowLeft size={20} className="mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-print7 py-8">
      <Link href="/products" className="flex items-center gap-2 text-print7-primary hover:text-blue-700 mb-8">
        <ArrowLeft size={18} />
        Continue Shopping
      </Link>

      <h1 className="text-4xl font-bold text-print7-dark mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>

          <div className="mt-8 bg-print7-light rounded-lg p-6">
            <h3 className="font-bold text-print7-dark mb-3">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Review your items and quantities</li>
              <li>Apply any promo codes</li>
              <li>Proceed to checkout</li>
              <li>Enter shipping and payment information</li>
              <li>Review your order</li>
              <li>Confirm and we'll get printing!</li>
            </ol>
          </div>
        </div>

        <div>
          <CartSummary
            subtotal={total}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
