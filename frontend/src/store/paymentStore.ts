'use client';

import { create } from 'zustand';
import { PaymentProfile, PaymentCard, DigitalWallet, PaymentTransaction } from '@/types';

interface PaymentStore {
  profile: PaymentProfile;
  addCard: (card: PaymentCard) => void;
  removeCard: (cardId: string) => void;
  updateCard: (cardId: string, updates: Partial<PaymentCard>) => void;
  setDefaultCard: (cardId: string) => void;
  addWallet: (wallet: DigitalWallet) => void;
  removeWallet: (walletId: string) => void;
  linkWallet: (walletId: string) => void;
  unlinkWallet: (walletId: string) => void;
  setDefaultWallet: (walletId: string) => void;
  setDefaultMethod: (method: 'card' | 'wallet' | 'cod') => void;
  toggleCOD: () => void;
  processPayment: (
    amount: number,
    method: 'card' | 'wallet' | 'cod',
    methodId?: string
  ) => Promise<{ success: boolean; transactionId: string; message: string }>;
  getTransactionHistory: () => PaymentTransaction[];
  getTransactionById: (id: string) => PaymentTransaction | undefined;
}

const mockCards: PaymentCard[] = [
  {
    id: 'card-1',
    type: 'visa',
    cardNumber: '**** **** **** 4242',
    lastFour: '4242',
    expiryMonth: '12',
    expiryYear: '2026',
    cardholderName: 'John Doe',
    isDefault: true,
    billingAddress: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0100',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
  },
  {
    id: 'card-2',
    type: 'mastercard',
    cardNumber: '**** **** **** 5555',
    lastFour: '5555',
    expiryMonth: '08',
    expiryYear: '2027',
    cardholderName: 'John Doe',
    isDefault: false,
    billingAddress: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0100',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
  },
  {
    id: 'card-3',
    type: 'amex',
    cardNumber: '**** **** **** 3782',
    lastFour: '3782',
    expiryMonth: '06',
    expiryYear: '2025',
    cardholderName: 'John Doe',
    isDefault: false,
    billingAddress: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0100',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
  },
];

const mockWallets: DigitalWallet[] = [
  {
    id: 'wallet-1',
    type: 'paypal',
    email: 'john.doe@paypal.com',
    displayName: 'PayPal Account',
    isLinked: true,
    isDefault: false,
  },
  {
    id: 'wallet-2',
    type: 'google-pay',
    displayName: 'Google Pay',
    isLinked: true,
    isDefault: false,
  },
  {
    id: 'wallet-3',
    type: 'apple-pay',
    displayName: 'Apple Pay',
    isLinked: false,
    isDefault: false,
  },
  {
    id: 'wallet-4',
    type: 'upi',
    upiId: 'johndoe@upi',
    displayName: 'UPI',
    isLinked: false,
    isDefault: false,
  },
];

const mockTransactions: PaymentTransaction[] = [
  {
    id: 'txn-001',
    orderId: 'ORD-2025-1001',
    method: 'card',
    methodDetail: 'Visa ending 4242',
    amount: 245.99,
    currency: 'USD',
    status: 'completed',
    createdAt: '2026-03-20T14:30:00Z',
    completedAt: '2026-03-20T14:35:00Z',
  },
  {
    id: 'txn-002',
    orderId: 'ORD-2025-1002',
    method: 'wallet',
    methodDetail: 'PayPal (john.doe@paypal.com)',
    amount: 89.50,
    currency: 'USD',
    status: 'completed',
    createdAt: '2026-03-18T10:15:00Z',
    completedAt: '2026-03-18T10:20:00Z',
  },
  {
    id: 'txn-003',
    orderId: 'ORD-2025-1003',
    method: 'card',
    methodDetail: 'Mastercard ending 5555',
    amount: 152.75,
    currency: 'USD',
    status: 'failed',
    createdAt: '2026-03-15T16:45:00Z',
  },
  {
    id: 'txn-004',
    orderId: 'ORD-2025-1004',
    method: 'cod',
    methodDetail: 'Cash on Delivery',
    amount: 67.25,
    currency: 'USD',
    status: 'pending',
    createdAt: '2026-03-22T09:00:00Z',
  },
  {
    id: 'txn-005',
    orderId: 'ORD-2025-1005',
    method: 'card',
    methodDetail: 'Visa ending 4242',
    amount: 312.00,
    currency: 'USD',
    status: 'processing',
    createdAt: '2026-03-23T11:20:00Z',
  },
  {
    id: 'txn-006',
    orderId: 'ORD-2025-1006',
    method: 'wallet',
    methodDetail: 'Google Pay',
    amount: 95.99,
    currency: 'USD',
    status: 'completed',
    createdAt: '2026-03-19T13:45:00Z',
    completedAt: '2026-03-19T13:50:00Z',
  },
  {
    id: 'txn-007',
    orderId: 'ORD-2025-1007',
    method: 'card',
    methodDetail: 'Amex ending 3782',
    amount: 445.50,
    currency: 'USD',
    status: 'refunded',
    createdAt: '2026-03-10T08:30:00Z',
    completedAt: '2026-03-10T08:35:00Z',
    refundedAt: '2026-03-17T14:20:00Z',
    refundAmount: 445.50,
  },
  {
    id: 'txn-008',
    orderId: 'ORD-2025-1008',
    method: 'cod',
    methodDetail: 'Cash on Delivery',
    amount: 123.45,
    currency: 'USD',
    status: 'completed',
    createdAt: '2026-03-12T15:00:00Z',
    completedAt: '2026-03-12T15:05:00Z',
  },
];

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  profile: {
    cards: mockCards,
    wallets: mockWallets,
    defaultMethod: 'card',
    defaultCardId: 'card-1',
    defaultWalletId: undefined,
    codEnabled: true,
    transactions: mockTransactions,
  },

  addCard: (card: PaymentCard) =>
    set((state) => ({
      profile: {
        ...state.profile,
        cards: [...state.profile.cards, card],
      },
    })),

  removeCard: (cardId: string) =>
    set((state) => ({
      profile: {
        ...state.profile,
        cards: state.profile.cards.filter((card) => card.id !== cardId),
        defaultCardId:
          state.profile.defaultCardId === cardId ? undefined : state.profile.defaultCardId,
      },
    })),

  updateCard: (cardId: string, updates: Partial<PaymentCard>) =>
    set((state) => ({
      profile: {
        ...state.profile,
        cards: state.profile.cards.map((card) =>
          card.id === cardId ? { ...card, ...updates } : card
        ),
      },
    })),

  setDefaultCard: (cardId: string) =>
    set((state) => ({
      profile: {
        ...state.profile,
        defaultCardId: cardId,
        defaultMethod: 'card',
        cards: state.profile.cards.map((card) => ({
          ...card,
          isDefault: card.id === cardId,
        })),
      },
    })),

  addWallet: (wallet: DigitalWallet) =>
    set((state) => ({
      profile: {
        ...state.profile,
        wallets: [...state.profile.wallets, wallet],
      },
    })),

  removeWallet: (walletId: string) =>
    set((state) => ({
      profile: {
        ...state.profile,
        wallets: state.profile.wallets.filter((wallet) => wallet.id !== walletId),
        defaultWalletId:
          state.profile.defaultWalletId === walletId ? undefined : state.profile.defaultWalletId,
      },
    })),

  linkWallet: (walletId: string) =>
    set((state) => ({
      profile: {
        ...state.profile,
        wallets: state.profile.wallets.map((wallet) =>
          wallet.id === walletId ? { ...wallet, isLinked: true } : wallet
        ),
      },
    })),

  unlinkWallet: (walletId: string) =>
    set((state) => ({
      profile: {
        ...state.profile,
        wallets: state.profile.wallets.map((wallet) =>
          wallet.id === walletId ? { ...wallet, isLinked: false, isDefault: false } : wallet
        ),
        defaultWalletId:
          state.profile.defaultWalletId === walletId ? undefined : state.profile.defaultWalletId,
      },
    })),

  setDefaultWallet: (walletId: string) =>
    set((state) => ({
      profile: {
        ...state.profile,
        defaultWalletId: walletId,
        defaultMethod: 'wallet',
        wallets: state.profile.wallets.map((wallet) => ({
          ...wallet,
          isDefault: wallet.id === walletId,
        })),
      },
    })),

  setDefaultMethod: (method: 'card' | 'wallet' | 'cod') =>
    set((state) => ({
      profile: {
        ...state.profile,
        defaultMethod: method,
      },
    })),

  toggleCOD: () =>
    set((state) => ({
      profile: {
        ...state.profile,
        codEnabled: !state.profile.codEnabled,
      },
    })),

  processPayment: async (
    amount: number,
    method: 'card' | 'wallet' | 'cod',
    methodId?: string
  ) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.15; // 85% success rate

        const state = get();
        let methodDetail = '';

        if (method === 'card' && methodId) {
          const card = state.profile.cards.find((c) => c.id === methodId);
          methodDetail = card ? `${card.type.charAt(0).toUpperCase() + card.type.slice(1)} ending ${card.lastFour}` : 'Card';
        } else if (method === 'wallet' && methodId) {
          const wallet = state.profile.wallets.find((w) => w.id === methodId);
          methodDetail = wallet
            ? `${wallet.type === 'paypal' ? 'PayPal' : wallet.type === 'google-pay' ? 'Google Pay' : wallet.type === 'apple-pay' ? 'Apple Pay' : 'UPI'} ${wallet.email ? `(${wallet.email})` : wallet.upiId ? `(${wallet.upiId})` : ''}`
            : 'Wallet';
        } else if (method === 'cod') {
          methodDetail = 'Cash on Delivery';
        }

        const transaction: PaymentTransaction = {
          id: `txn-${Date.now()}`,
          orderId: `ORD-${Math.random().toString(36).substring(7).toUpperCase()}`,
          method,
          methodDetail,
          amount,
          currency: 'USD',
          status: success ? 'processing' : 'failed',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          profile: {
            ...state.profile,
            transactions: [transaction, ...state.profile.transactions],
          },
        }));

        resolve({
          success,
          transactionId: transaction.id,
          message: success ? 'Payment processing' : 'Payment failed. Please try again.',
        });
      }, 1500);
    });
  },

  getTransactionHistory: () => {
    return get().profile.transactions;
  },

  getTransactionById: (id: string) => {
    return get().profile.transactions.find((txn) => txn.id === id);
  },
}));
