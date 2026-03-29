'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useCartStore } from '@/store/cartStore';
import { usePaymentStore } from '@/store/paymentStore';
import { formatPrice, calculateTax, calculateShipping } from '@/lib/utils';
import toast from 'react-hot-toast';

type Step = 'shipping' | 'payment' | 'review' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore(state => state.items);
  const total = useCartStore(state => state.getTotal());
  const clearCart = useCartStore(state => state.clear);
  const { profile, processPayment } = usePaymentStore();

  const [step, setStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [payment, setPayment] = useState({
    method: 'saved-card' as 'saved-card' | 'saved-wallet' | 'new-card' | 'cod',
    savedCardId: profile.defaultCardId,
    savedWalletId: profile.defaultWalletId,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  if (items.length === 0) {
    return (
      <div className="container-print7 py-16 text-center">
        <h1 className="text-3xl font-bold text-print7-dark mb-4">No Items in Cart</h1>
        <Link href="/products">
          <Button variant="primary" size="lg">
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const handleShippingChange = (field: string, value: string) => {
    setShipping(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPayment(prev => ({ ...prev, [field]: value }));
  };

  const validateShipping = () => {
    if (!shipping.fullName || !shipping.email || !shipping.address || !shipping.city || !shipping.state || !shipping.zipCode) {
      toast.error('Please fill in all shipping fields');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (payment.method === 'saved-card' && !payment.savedCardId) {
      toast.error('Please select a saved card');
      return false;
    }
    if (payment.method === 'saved-wallet' && !payment.savedWalletId) {
      toast.error('Please select a saved wallet');
      return false;
    }
    if (payment.method === 'new-card') {
      if (!payment.cardNumber || !payment.expiryDate || !payment.cvv) {
        toast.error('Please fill in all card details');
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);
    try {
      const subtotal = total;
      const tax = calculateTax(subtotal);
      const shipping_cost = calculateShipping(subtotal);
      const finalTotal = subtotal + tax + shipping_cost;

      // Determine payment method and ID
      let methodId: string | undefined;
      let paymentMethod: 'card' | 'wallet' | 'cod' = 'card';

      if (payment.method === 'saved-card') {
        methodId = payment.savedCardId;
        paymentMethod = 'card';
      } else if (payment.method === 'saved-wallet') {
        methodId = payment.savedWalletId;
        paymentMethod = 'wallet';
      } else if (payment.method === 'new-card') {
        paymentMethod = 'card';
      } else if (payment.method === 'cod') {
        paymentMethod = 'cod';
      }

      const result = await processPayment(finalTotal, paymentMethod, methodId);

      if (result.success) {
        clearCart();
        setShowConfirmation(true);
        toast.success('Order placed successfully!');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = total;
  const tax = calculateTax(subtotal);
  const shipping_cost = calculateShipping(subtotal);
  const finalTotal = subtotal + tax + shipping_cost;

  const steps: Array<{ id: Step; name: string; icon: string }> = [
    { id: 'shipping', name: 'Shipping', icon: '📦' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'review', name: 'Review', icon: '✓' },
  ];

  return (
    <div className="container-print7 py-8">
      <Link href="/cart" className="flex items-center gap-2 text-print7-primary hover:text-blue-700 mb-8">
        <ArrowLeft size={18} />
        Back to Cart
      </Link>

      <h1 className="text-4xl font-bold text-print7-dark mb-8">Checkout</h1>

      <div className="flex gap-8 mb-8">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                s.id === step
                  ? 'bg-print7-primary text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {s.icon}
            </div>
            <span
              className={`font-semibold ${
                s.id === step ? 'text-print7-primary' : 'text-gray-600'
              }`}
            >
              {s.name}
            </span>
            {index < steps.length - 1 && (
              <div className="w-8 h-1 bg-gray-300 mx-2" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-print7-dark mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={shipping.fullName}
                  onChange={(e) => handleShippingChange('fullName', e.target.value)}
                  placeholder="John Doe"
                />
                <Input
                  label="Email"
                  type="email"
                  value={shipping.email}
                  onChange={(e) => handleShippingChange('email', e.target.value)}
                  placeholder="john@example.com"
                />
                <Input
                  label="Phone"
                  value={shipping.phone}
                  onChange={(e) => handleShippingChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
                <Input
                  label="Address"
                  value={shipping.address}
                  onChange={(e) => handleShippingChange('address', e.target.value)}
                  placeholder="123 Main Street"
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="City"
                    value={shipping.city}
                    onChange={(e) => handleShippingChange('city', e.target.value)}
                  />
                  <Input
                    label="State"
                    value={shipping.state}
                    onChange={(e) => handleShippingChange('state', e.target.value)}
                  />
                  <Input
                    label="Zip Code"
                    value={shipping.zipCode}
                    onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <Button variant="outline" onClick={() => router.push('/cart')}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (validateShipping()) setStep('payment');
                  }}
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-print7-dark mb-6">Payment Method</h2>

              <div className="space-y-4 mb-6">
                {/* Saved Cards */}
                {profile.cards.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-print7-dark mb-3">
                      Saved Cards
                    </label>
                    <div className="space-y-3">
                      {profile.cards.map((card) => (
                        <label
                          key={card.id}
                          className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="saved-card"
                            checked={payment.method === 'saved-card' && payment.savedCardId === card.id}
                            onChange={() =>
                              setPayment({
                                ...payment,
                                method: 'saved-card',
                                savedCardId: card.id,
                              })
                            }
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{card.cardNumber}</p>
                            <p className="text-sm text-gray-600">
                              {card.cardholderName} • Expires {card.expiryMonth}/{card.expiryYear}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Saved Wallets */}
                {profile.wallets.filter((w) => w.isLinked).length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-print7-dark mb-3">
                      Digital Wallets
                    </label>
                    <div className="space-y-3">
                      {profile.wallets
                        .filter((w) => w.isLinked)
                        .map((wallet) => (
                          <label
                            key={wallet.id}
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="saved-wallet"
                              checked={payment.method === 'saved-wallet' && payment.savedWalletId === wallet.id}
                              onChange={() =>
                                setPayment({
                                  ...payment,
                                  method: 'saved-wallet',
                                  savedWalletId: wallet.id,
                                })
                              }
                              className="w-4 h-4"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{wallet.displayName}</p>
                              <p className="text-sm text-gray-600">
                                {wallet.email || wallet.upiId || 'Connected'}
                              </p>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                {profile.codEnabled && (
                  <div>
                    <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={payment.method === 'cod'}
                        onChange={() => setPayment({ ...payment, method: 'cod' })}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when your order arrives (+$2.99 fee)</p>
                      </div>
                    </label>
                  </div>
                )}

                {/* New Card */}
                <div>
                  <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="new-card"
                      checked={payment.method === 'new-card'}
                      onChange={() => setPayment({ ...payment, method: 'new-card' })}
                      className="w-4 h-4"
                    />
                    <p className="font-semibold text-gray-900">Use a New Card</p>
                  </label>

                  {payment.method === 'new-card' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Input
                        label="Card Number"
                        value={payment.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Expiry Date"
                          value={payment.expiryDate}
                          onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                        />
                        <Input
                          label="CVV"
                          value={payment.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button variant="outline" onClick={() => setStep('shipping')}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (validatePayment()) setStep('review');
                  }}
                >
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-print7-dark mb-6">Order Review</h2>

              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="font-bold text-print7-dark mb-4">Shipping Address</h3>
                <p className="text-gray-600">{shipping.fullName}</p>
                <p className="text-gray-600">{shipping.address}</p>
                <p className="text-gray-600">{shipping.city}, {shipping.state} {shipping.zipCode}</p>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-print7-dark mb-4">Items</h3>
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-gray-600 mb-2">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <Button variant="outline" onClick={() => setStep('payment')}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePlaceOrder}
                  isLoading={isProcessing}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing && <Loader2 size={18} className="animate-spin" />}
                  {isProcessing ? 'Processing Payment...' : 'Place Order'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h3 className="font-bold text-print7-dark text-lg mb-4">Order Summary</h3>

          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span>{item.product.name}</span>
                <span>{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping_cost === 0 ? 'FREE' : formatPrice(shipping_cost)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg text-print7-primary">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      <Modal isOpen={showConfirmation} onClose={() => router.push('/')}>
        <div className="text-center py-8">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-print7-dark mb-3">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. You'll receive a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Expected delivery: 5-7 business days
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/')}
          >
            Return to Home
          </Button>
        </div>
      </Modal>
    </div>
  );
}
