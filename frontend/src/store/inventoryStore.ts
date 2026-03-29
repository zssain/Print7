import { create } from 'zustand';
import { InventoryItem } from '@/types';
import { products } from '@/data/products';

interface InventoryStore {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  updateStock: (id: string, quantity: number) => void;
  setReorderThreshold: (id: string, threshold: number) => void;
  toggleAutoReorder: (id: string) => void;
  getLowStockItems: () => InventoryItem[];
  getTotalValue: () => number;
  getItemsByCategory: (category: string) => InventoryItem[];
}

const mockInventoryData: InventoryItem[] = [
  {
    id: 'inv-001',
    product: products[0],
    quantity: 150,
    reorderThreshold: 50,
    autoReorder: true,
    reorderQuantity: 100,
    status: 'in-stock',
    lastOrdered: '2026-03-15',
    stockHistory: [
      { month: 'Sep', quantity: 120 },
      { month: 'Oct', quantity: 135 },
      { month: 'Nov', quantity: 145 },
      { month: 'Dec', quantity: 155 },
      { month: 'Jan', quantity: 160 },
      { month: 'Feb', quantity: 150 },
    ],
    totalSpent: 3748.50,
  },
  {
    id: 'inv-002',
    product: products[1],
    quantity: 45,
    reorderThreshold: 50,
    autoReorder: true,
    reorderQuantity: 100,
    status: 'low-stock',
    lastOrdered: '2026-03-10',
    stockHistory: [
      { month: 'Sep', quantity: 80 },
      { month: 'Oct', quantity: 75 },
      { month: 'Nov', quantity: 65 },
      { month: 'Dec', quantity: 55 },
      { month: 'Jan', quantity: 50 },
      { month: 'Feb', quantity: 45 },
    ],
    totalSpent: 1034.55,
  },
  {
    id: 'inv-003',
    product: products[2],
    quantity: 0,
    reorderThreshold: 30,
    autoReorder: false,
    reorderQuantity: 50,
    status: 'out-of-stock',
    lastOrdered: '2026-02-20',
    stockHistory: [
      { month: 'Sep', quantity: 25 },
      { month: 'Oct', quantity: 20 },
      { month: 'Nov', quantity: 15 },
      { month: 'Dec', quantity: 8 },
      { month: 'Jan', quantity: 2 },
      { month: 'Feb', quantity: 0 },
    ],
    totalSpent: 2499.50,
  },
  {
    id: 'inv-004',
    product: products[3],
    quantity: 200,
    reorderThreshold: 75,
    autoReorder: true,
    reorderQuantity: 150,
    status: 'in-stock',
    lastOrdered: '2026-03-20',
    stockHistory: [
      { month: 'Sep', quantity: 180 },
      { month: 'Oct', quantity: 190 },
      { month: 'Nov', quantity: 200 },
      { month: 'Dec', quantity: 210 },
      { month: 'Jan', quantity: 205 },
      { month: 'Feb', quantity: 200 },
    ],
    totalSpent: 7998.00,
  },
  {
    id: 'inv-005',
    product: products[4],
    quantity: 85,
    reorderThreshold: 60,
    autoReorder: true,
    reorderQuantity: 120,
    status: 'in-stock',
    lastOrdered: '2026-03-18',
    stockHistory: [
      { month: 'Sep', quantity: 100 },
      { month: 'Oct', quantity: 95 },
      { month: 'Nov', quantity: 90 },
      { month: 'Dec', quantity: 88 },
      { month: 'Jan', quantity: 86 },
      { month: 'Feb', quantity: 85 },
    ],
    totalSpent: 5099.15,
  },
  {
    id: 'inv-006',
    product: products[5],
    quantity: 30,
    reorderThreshold: 60,
    autoReorder: false,
    reorderQuantity: 100,
    status: 'low-stock',
    lastOrdered: '2026-03-05',
    stockHistory: [
      { month: 'Sep', quantity: 120 },
      { month: 'Oct', quantity: 100 },
      { month: 'Nov', quantity: 75 },
      { month: 'Dec', quantity: 50 },
      { month: 'Jan', quantity: 40 },
      { month: 'Feb', quantity: 30 },
    ],
    totalSpent: 2999.70,
  },
  {
    id: 'inv-007',
    product: products[6],
    quantity: 250,
    reorderThreshold: 80,
    autoReorder: true,
    reorderQuantity: 180,
    status: 'in-stock',
    lastOrdered: '2026-03-22',
    stockHistory: [
      { month: 'Sep', quantity: 200 },
      { month: 'Oct', quantity: 215 },
      { month: 'Nov', quantity: 230 },
      { month: 'Dec', quantity: 245 },
      { month: 'Jan', quantity: 250 },
      { month: 'Feb', quantity: 250 },
    ],
    totalSpent: 8747.50,
  },
  {
    id: 'inv-008',
    product: products[7],
    quantity: 15,
    reorderThreshold: 40,
    autoReorder: true,
    reorderQuantity: 80,
    status: 'low-stock',
    lastOrdered: '2026-02-28',
    stockHistory: [
      { month: 'Sep', quantity: 70 },
      { month: 'Oct', quantity: 60 },
      { month: 'Nov', quantity: 45 },
      { month: 'Dec', quantity: 30 },
      { month: 'Jan', quantity: 22 },
      { month: 'Feb', quantity: 15 },
    ],
    totalSpent: 1874.85,
  },
  {
    id: 'inv-009',
    product: products[8],
    quantity: 180,
    reorderThreshold: 70,
    autoReorder: true,
    reorderQuantity: 140,
    status: 'in-stock',
    lastOrdered: '2026-03-19',
    stockHistory: [
      { month: 'Sep', quantity: 160 },
      { month: 'Oct', quantity: 170 },
      { month: 'Nov', quantity: 175 },
      { month: 'Dec', quantity: 180 },
      { month: 'Jan', quantity: 180 },
      { month: 'Feb', quantity: 180 },
    ],
    totalSpent: 5397.20,
  },
  {
    id: 'inv-010',
    product: products[9],
    quantity: 320,
    reorderThreshold: 100,
    autoReorder: true,
    reorderQuantity: 200,
    status: 'in-stock',
    lastOrdered: '2026-03-21',
    stockHistory: [
      { month: 'Sep', quantity: 280 },
      { month: 'Oct', quantity: 295 },
      { month: 'Nov', quantity: 310 },
      { month: 'Dec', quantity: 320 },
      { month: 'Jan', quantity: 320 },
      { month: 'Feb', quantity: 320 },
    ],
    totalSpent: 3199.80,
  },
  {
    id: 'inv-011',
    product: products[10],
    quantity: 50,
    reorderThreshold: 50,
    autoReorder: false,
    reorderQuantity: 100,
    status: 'low-stock',
    lastOrdered: '2026-03-08',
    stockHistory: [
      { month: 'Sep', quantity: 100 },
      { month: 'Oct', quantity: 90 },
      { month: 'Nov', quantity: 75 },
      { month: 'Dec', quantity: 65 },
      { month: 'Jan', quantity: 58 },
      { month: 'Feb', quantity: 50 },
    ],
    totalSpent: 1499.50,
  },
  {
    id: 'inv-012',
    product: products[11],
    quantity: 420,
    reorderThreshold: 120,
    autoReorder: true,
    reorderQuantity: 250,
    status: 'in-stock',
    lastOrdered: '2026-03-23',
    stockHistory: [
      { month: 'Sep', quantity: 350 },
      { month: 'Oct', quantity: 370 },
      { month: 'Nov', quantity: 390 },
      { month: 'Dec', quantity: 410 },
      { month: 'Jan', quantity: 420 },
      { month: 'Feb', quantity: 420 },
    ],
    totalSpent: 5188.80,
  },
];

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: mockInventoryData,

  addItem: (item) => {
    set((state) => ({
      items: [...state.items, item],
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  updateStock: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          const status =
            quantity === 0
              ? 'out-of-stock'
              : quantity <= item.reorderThreshold
                ? 'low-stock'
                : 'in-stock';
          return { ...item, quantity, status };
        }
        return item;
      }),
    }));
  },

  setReorderThreshold: (id, threshold) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          const status =
            item.quantity === 0
              ? 'out-of-stock'
              : item.quantity <= threshold
                ? 'low-stock'
                : 'in-stock';
          return { ...item, reorderThreshold: threshold, status };
        }
        return item;
      }),
    }));
  },

  toggleAutoReorder: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, autoReorder: !item.autoReorder } : item
      ),
    }));
  },

  getLowStockItems: () => {
    return get().items.filter((item) => item.status === 'low-stock');
  },

  getTotalValue: () => {
    return get().items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  },

  getItemsByCategory: (category) => {
    return get().items.filter((item) => item.product.category === category);
  },
}));
