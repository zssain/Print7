import { create } from 'zustand';
import { CartItem, Product } from '@/types';
import { generateId } from '@/lib/utils';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, options: CartItem['selectedOptions'], designId?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product, options, designId) => {
    set(state => {
      const existingItem = state.items.find(
        item =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedOptions) === JSON.stringify(options)
      );

      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === existingItem.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  totalPrice: (item.quantity + 1) * product.price,
                }
              : item
          ),
        };
      }

      const newItem: CartItem = {
        id: generateId(),
        product,
        quantity: options.quantity || 1,
        selectedOptions: options,
        designId,
        totalPrice: (options.quantity || 1) * product.price,
      };

      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (id: string) => {
    set(state => ({
      items: state.items.filter(item => item.id !== id),
    }));
  },

  updateQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }

    set(state => ({
      items: state.items.map(item =>
        item.id === id
          ? {
              ...item,
              quantity,
              totalPrice: quantity * item.product.price,
            }
          : item
      ),
    }));
  },

  clear: () => {
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.totalPrice, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
