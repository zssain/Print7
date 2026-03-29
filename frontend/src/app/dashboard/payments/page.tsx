'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Edit2,
  Trash2,
  Plus,
  Smartphone,
  ToggleRight,
  ToggleLeft,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { usePaymentStore } from '@/store/paymentStore';
import { PaymentCard } from '@/types';
import toast from 'react-hot-toast';

export default function PaymentsPage() {
  const {
    profile,
    addCard,
    removeCard,
    setDefaultCard,
    linkWallet,
    unlinkWallet,
    setDefaultWallet,
    setDefaultMethod,
    toggleCOD,
  } = usePaymentStore();

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState<string | null>(null);
  const [cardFormData, setCardFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const handleAddCard = () => {
    if (
      !cardFormData.cardNumber ||
      !cardFormData.cardholderName ||
      !cardFormData.expiryMonth ||
      !cardFormData.expiryYear ||
      !cardFormData.cvv
    ) {
      toast.error('Please fill in all card details');
      return;
    }

    const cleanNumber = cardFormData.cardNumber.replace(/\s+/g, '');
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      toast.error('Invalid card number');
      return;
    }

    // Auto-detect card type
    const firstDigit = cleanNumber[0];
    let type: 'visa' | 'mastercard' | 'amex' | 'discover' = 'visa';
    if (firstDigit === '4') type = 'visa';
    else if (firstDigit === '5') type = 'mastercard';
    else if (firstDigit === '3') type = 'amex';
    else if (firstDigit === '6') type = 'discover';

    const lastFour = cleanNumber.slice(-4);
    const maskedNumber = `**** **** **** ${lastFour}`;

    const newCard: PaymentCard = {
      id: `card-${Date.now()}`,
      type,
      cardNumber: maskedNumber,
      lastFour,
      expiryMonth: cardFormData.expiryMonth,
      expiryYear: cardFormData.expiryYear,
      cardholderName: cardFormData.cardholderName,
      isDefault: profile.cards.length === 0,
      billingAddress: {
        fullName: cardFormData.cardholderName,
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      },
    };

    addCard(newCard);
    setCardFormData({ cardNumber: '', cardholderName: '', expiryMonth: '', expiryYear: '', cvv: '' });
    setShowAddCardModal(false);
    toast.success('Card added successfully');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '');
    if (!/^\d*$/.test(value)) return;
    if (value.length > 19) value = value.slice(0, 19);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardFormData({ ...cardFormData, cardNumber: formatted });
  };

  const getCardGradient = (type: string) => {
    switch (type) {
      case 'visa':
        return 'from-blue-600 to-blue-400';
      case 'mastercard':
        return 'from-red-600 to-orange-500';
      case 'amex':
        return 'from-green-600 to-green-400';
      case 'discover':
        return 'from-orange-600 to-orange-400';
      default:
        return 'from-gray-600 to-gray-400';
    }
  };

  const getCardLogo = (type: string) => {
    switch (type) {
      case 'visa':
        return 'VISA';
      case 'mastercard':
        return 'MC';
      case 'amex':
        return 'AMEX';
      case 'discover':
        return 'DIS';
      default:
        return 'CARD';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1A1A2E] mb-2">Payment Methods</h1>
        <p className="text-gray-600 mb-8">Manage your saved cards, wallets, and payment preferences</p>

        {/* Saved Cards Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1A1A2E]">Saved Cards</h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddCardModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Card
            </Button>
          </div>

          {profile.cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.cards.map((card) => (
                <div
                  key={card.id}
                  className={`relative bg-gradient-to-br ${getCardGradient(card.type)} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all group`}
                  onMouseEnter={() => setShowCardDetails(card.id)}
                  onMouseLeave={() => setShowCardDetails(null)}
                >
                  {/* Card Background Pattern */}
                  <div className="absolute inset-0 opacity-10 rounded-lg" />

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-12">
                      <span className="text-lg font-bold">{getCardLogo(card.type)}</span>
                      {card.isDefault && (
                        <span className="bg-yellow-300 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <div className="mb-8">
                      <p className="text-sm opacity-75 mb-1">Card Number</p>
                      <p className="text-xl font-mono tracking-wider">{card.cardNumber}</p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-75 mb-1">Cardholder Name</p>
                        <p className="font-semibold text-sm">{card.cardholderName}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75 mb-1">Expires</p>
                        <p className="font-semibold text-sm">
                          {card.expiryMonth}/{card.expiryYear}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay with Actions */}
                  {showCardDetails === card.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center gap-3 z-20">
                      <button
                        className="p-3 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                        title="Edit card"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="p-3 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        onClick={() => {
                          removeCard(card.id);
                          toast.success('Card removed');
                        }}
                        title="Remove card"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}

                  {/* Quick Actions Below Card */}
                  {showCardDetails === card.id && !card.isDefault && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-80 rounded-b-lg z-20">
                      <button
                        className="w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded hover:bg-yellow-300 transition-colors text-sm"
                        onClick={() => {
                          setDefaultCard(card.id);
                          toast.success('Default card updated');
                        }}
                      >
                        Set as Default
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
              <CreditCard size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">No saved cards yet</p>
              <Button variant="primary" size="sm" onClick={() => setShowAddCardModal(true)}>
                Add Your First Card
              </Button>
            </div>
          )}
        </section>

        {/* Digital Wallets Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">Digital Wallets</h2>
          <div className="space-y-4">
            {profile.wallets.map((wallet) => (
              <div key={wallet.id} className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {wallet.type === 'paypal' ? (
                      <span className="text-blue-600 font-bold text-sm">PP</span>
                    ) : wallet.type === 'google-pay' ? (
                      <span className="text-gray-600 font-bold text-sm">GP</span>
                    ) : wallet.type === 'apple-pay' ? (
                      <span className="text-black font-bold text-sm">AP</span>
                    ) : (
                      <Smartphone size={20} className="text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{wallet.displayName}</h3>
                    <p className="text-sm text-gray-600">
                      {wallet.email || wallet.upiId || 'Not connected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {wallet.isLinked ? (
                      <>
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm font-medium text-green-600">Linked</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full" />
                        <span className="text-sm font-medium text-gray-600">Not Linked</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {wallet.isLinked ? (
                      <>
                        {wallet.isDefault && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">
                            DEFAULT
                          </span>
                        )}
                        {!wallet.isDefault && (
                          <button
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm font-medium"
                            onClick={() => {
                              setDefaultWallet(wallet.id);
                              toast.success(`${wallet.displayName} set as default`);
                            }}
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors text-sm font-medium"
                          onClick={() => {
                            unlinkWallet(wallet.id);
                            toast.success(`${wallet.displayName} unlinked`);
                          }}
                        >
                          Unlink
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                        onClick={() => {
                          linkWallet(wallet.id);
                          toast.success(`${wallet.displayName} linked successfully`);
                        }}
                      >
                        Link Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Default Payment Method Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">Default Payment Method</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="defaultMethod"
                  checked={profile.defaultMethod === 'card'}
                  onChange={() => setDefaultMethod('card')}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                  {profile.defaultCardId && (
                    <p className="text-sm text-gray-600">
                      {profile.cards.find((c) => c.id === profile.defaultCardId)?.cardNumber}
                    </p>
                  )}
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="defaultMethod"
                  checked={profile.defaultMethod === 'wallet'}
                  onChange={() => setDefaultMethod('wallet')}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">Digital Wallet</p>
                  {profile.defaultWalletId && (
                    <p className="text-sm text-gray-600">
                      {profile.wallets.find((w) => w.id === profile.defaultWalletId)?.displayName}
                    </p>
                  )}
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="defaultMethod"
                  checked={profile.defaultMethod === 'cod'}
                  onChange={() => setDefaultMethod('cod')}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">Pay when item arrives (+$2.99 fee)</p>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Cash on Delivery Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">Cash on Delivery</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Enable Cash on Delivery</h3>
                <p className="text-gray-600 text-sm">Pay for your order when it arrives at your doorstep</p>
                <p className="text-sm text-orange-600 font-medium mt-2">Service Fee: $2.99 per order</p>
              </div>
              <button
                onClick={toggleCOD}
                className="flex-shrink-0"
              >
                {profile.codEnabled ? (
                  <ToggleRight size={40} className="text-green-600" />
                ) : (
                  <ToggleLeft size={40} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Recent Transactions Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1A1A2E]">Recent Transactions</h2>
            <Link href="/dashboard/payments/transactions">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {profile.transactions.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.transactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {transaction.orderId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{transaction.methodDetail}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : transaction.status === 'processing'
                                ? 'bg-blue-100 text-blue-700'
                                : transaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : transaction.status === 'failed'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
              <CreditCard size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No transactions yet</p>
            </div>
          )}
        </section>
      </div>

      {/* Add Card Modal */}
      <Modal isOpen={showAddCardModal} onClose={() => setShowAddCardModal(false)}>
        <div className="p-8 max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-[#1A1A2E] mb-6">Add New Card</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardFormData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardFormData.cardholderName}
                onChange={(e) =>
                  setCardFormData({ ...cardFormData, cardholderName: e.target.value })
                }
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Month
                </label>
                <select
                  value={cardFormData.expiryMonth}
                  onChange={(e) =>
                    setCardFormData({ ...cardFormData, expiryMonth: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) =>
                    String(i + 1).padStart(2, '0')
                  ).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Year
                </label>
                <select
                  value={cardFormData.expiryYear}
                  onChange={(e) =>
                    setCardFormData({ ...cardFormData, expiryYear: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">YY</option>
                  {Array.from({ length: 20 }, (_, i) => 2026 + i).map((year) => (
                    <option key={year} value={String(year).slice(-2)}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                value={cardFormData.cvv}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 4) value = value.slice(0, 4);
                  setCardFormData({ ...cardFormData, cvv: value });
                }}
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddCardModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddCard}
                className="flex-1"
              >
                Save Card
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
