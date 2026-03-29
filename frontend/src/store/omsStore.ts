import { create } from 'zustand';
import { OMSOrder, OrderStage } from '@/types';
import { products } from '@/data/products';

interface OMSStore {
  orders: OMSOrder[];
  moveToNextStage: (orderId: string) => void;
  moveToPreviousStage: (orderId: string) => void;
  addNote: (orderId: string, author: string, text: string) => void;
  updatePriority: (orderId: string, priority: 'normal' | 'rush' | 'express') => void;
  getOrdersByStage: (stage: OrderStage) => OMSOrder[];
  getOrderById: (orderId: string) => OMSOrder | undefined;
  getStats: () => {
    completedToday: number;
    revenueToday: number;
    averageProcessingTime: number;
    pendingReturns: number;
  };
}

const stages: OrderStage[] = [
  'order-placed',
  'payment-verified',
  'design-approved',
  'in-production',
  'quality-check',
  'packaging',
  'shipped',
  'delivered',
  'returns-refunds',
];

const mockOrders: OMSOrder[] = [
  {
    id: 'ORD-001',
    customerId: 'cust-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    items: [
      {
        product: products[0],
        quantity: 500,
        price: 24.99,
      },
    ],
    currentStage: 'order-placed',
    timeline: [
      {
        stage: 'order-placed',
        status: 'current',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'payment-verified', status: 'upcoming' },
      { stage: 'design-approved', status: 'upcoming' },
      { stage: 'in-production', status: 'upcoming' },
      { stage: 'quality-check', status: 'upcoming' },
      { stage: 'packaging', status: 'upcoming' },
      { stage: 'shipped', status: 'upcoming' },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'normal',
    totalAmount: 12495.00,
    shippingAddress: {
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '555-0101',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '555-0101',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    paymentMethod: 'Visa ****1234',
    transactionId: 'txn_001_a1b2c3d4',
    notes: [
      {
        author: 'Support',
        text: 'Order received and confirmed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-002',
    customerId: 'cust-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    items: [
      {
        product: products[1],
        quantity: 1000,
        price: 22.99,
      },
    ],
    currentStage: 'payment-verified',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'current',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'design-approved', status: 'upcoming' },
      { stage: 'in-production', status: 'upcoming' },
      { stage: 'quality-check', status: 'upcoming' },
      { stage: 'packaging', status: 'upcoming' },
      { stage: 'shipped', status: 'upcoming' },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'rush',
    totalAmount: 22990.00,
    shippingAddress: {
      fullName: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '555-0102',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '555-0102',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    paymentMethod: 'Mastercard ****5678',
    transactionId: 'txn_002_e5f6g7h8',
    notes: [
      {
        author: 'Finance',
        text: 'Payment verified successfully',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-003',
    customerId: 'cust-003',
    customerName: 'Michael Chen',
    customerEmail: 'mchen@example.com',
    items: [
      {
        product: products[3],
        quantity: 250,
        price: 39.99,
      },
    ],
    currentStage: 'design-approved',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'current',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'in-production', status: 'upcoming' },
      { stage: 'quality-check', status: 'upcoming' },
      { stage: 'packaging', status: 'upcoming' },
      { stage: 'shipped', status: 'upcoming' },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'normal',
    totalAmount: 9997.50,
    shippingAddress: {
      fullName: 'Michael Chen',
      email: 'mchen@example.com',
      phone: '555-0103',
      address: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Michael Chen',
      email: 'mchen@example.com',
      phone: '555-0103',
      address: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    paymentMethod: 'American Express ****9012',
    transactionId: 'txn_003_i9j0k1l2',
    notes: [
      {
        author: 'Design Team',
        text: 'Design approved for production',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-004',
    customerId: 'cust-004',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.r@example.com',
    items: [
      {
        product: products[6],
        quantity: 150,
        price: 89.99,
      },
    ],
    currentStage: 'in-production',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'completed',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'in-production',
        status: 'current',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'quality-check', status: 'upcoming' },
      { stage: 'packaging', status: 'upcoming' },
      { stage: 'shipped', status: 'upcoming' },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'express',
    totalAmount: 13498.50,
    shippingAddress: {
      fullName: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      phone: '555-0104',
      address: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      phone: '555-0104',
      address: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
    },
    paymentMethod: 'Visa ****3456',
    transactionId: 'txn_004_m3n4o5p6',
    notes: [
      {
        author: 'Production',
        text: 'Production started',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 75 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-005',
    customerId: 'cust-005',
    customerName: 'David Wilson',
    customerEmail: 'dwilson@example.com',
    items: [
      {
        product: products[0],
        quantity: 300,
        price: 24.99,
      },
    ],
    currentStage: 'quality-check',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 94 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'completed',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'in-production',
        status: 'completed',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'quality-check',
        status: 'current',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'packaging', status: 'upcoming' },
      { stage: 'shipped', status: 'upcoming' },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'normal',
    totalAmount: 7497.00,
    shippingAddress: {
      fullName: 'David Wilson',
      email: 'dwilson@example.com',
      phone: '555-0105',
      address: '654 Birch Ln',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'David Wilson',
      email: 'dwilson@example.com',
      phone: '555-0105',
      address: '654 Birch Ln',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA',
    },
    paymentMethod: 'Discover ****7890',
    transactionId: 'txn_005_q7r8s9t0',
    notes: [
      {
        author: 'QC Team',
        text: 'Quality check in progress',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 100 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-006',
    customerId: 'cust-006',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.a@example.com',
    items: [
      {
        product: products[4],
        quantity: 200,
        price: 59.99,
      },
    ],
    currentStage: 'packaging',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 118 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'completed',
        timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'in-production',
        status: 'completed',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'quality-check',
        status: 'completed',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'packaging',
        status: 'current',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'shipped', status: 'upcoming' },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'normal',
    totalAmount: 11998.00,
    shippingAddress: {
      fullName: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      phone: '555-0106',
      address: '987 Maple Dr',
      city: 'Philadelphia',
      state: 'PA',
      zipCode: '19101',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      phone: '555-0106',
      address: '987 Maple Dr',
      city: 'Philadelphia',
      state: 'PA',
      zipCode: '19101',
      country: 'USA',
    },
    paymentMethod: 'Visa ****5678',
    transactionId: 'txn_006_u1v2w3x4',
    notes: [
      {
        author: 'Warehouse',
        text: 'Order being packaged for shipment',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 124 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-007',
    customerId: 'cust-007',
    customerName: 'Robert Taylor',
    customerEmail: 'rtaylor@example.com',
    items: [
      {
        product: products[7],
        quantity: 100,
        price: 79.99,
      },
    ],
    currentStage: 'shipped',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 142 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'completed',
        timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'in-production',
        status: 'completed',
        timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'quality-check',
        status: 'completed',
        timestamp: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'packaging',
        status: 'completed',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'shipped',
        status: 'current',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'normal',
    totalAmount: 7999.00,
    shippingAddress: {
      fullName: 'Robert Taylor',
      email: 'rtaylor@example.com',
      phone: '555-0107',
      address: '159 Cedar Way',
      city: 'San Antonio',
      state: 'TX',
      zipCode: '78201',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Robert Taylor',
      email: 'rtaylor@example.com',
      phone: '555-0107',
      address: '159 Cedar Way',
      city: 'San Antonio',
      state: 'TX',
      zipCode: '78201',
      country: 'USA',
    },
    paymentMethod: 'Mastercard ****9012',
    transactionId: 'txn_007_y5z6a7b8',
    trackingNumber: 'TRACK789456123',
    notes: [
      {
        author: 'Shipping',
        text: 'Order shipped via FedEx',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 148 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-008',
    customerId: 'cust-008',
    customerName: 'Jennifer Martinez',
    customerEmail: 'jmartinez@example.com',
    items: [
      {
        product: products[8],
        quantity: 75,
        price: 99.99,
      },
    ],
    currentStage: 'delivered',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 166 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'completed',
        timestamp: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'in-production',
        status: 'completed',
        timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'quality-check',
        status: 'completed',
        timestamp: new Date(Date.now() - 84 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'packaging',
        status: 'completed',
        timestamp: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'shipped',
        status: 'completed',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'delivered',
        status: 'current',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'normal',
    totalAmount: 7499.25,
    shippingAddress: {
      fullName: 'Jennifer Martinez',
      email: 'jmartinez@example.com',
      phone: '555-0108',
      address: '753 Spruce St',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Jennifer Martinez',
      email: 'jmartinez@example.com',
      phone: '555-0108',
      address: '753 Spruce St',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      country: 'USA',
    },
    paymentMethod: 'Visa ****7890',
    transactionId: 'txn_008_c9d0e1f2',
    trackingNumber: 'TRACK987654321',
    estimatedDelivery: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    notes: [
      {
        author: 'Delivery',
        text: 'Order delivered successfully',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 172 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-009',
    customerId: 'cust-009',
    customerName: 'James Brown',
    customerEmail: 'jbrown@example.com',
    items: [
      {
        product: products[9],
        quantity: 120,
        price: 14.99,
      },
    ],
    currentStage: 'delivered',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 192 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 190 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'completed',
        timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'in-production',
        status: 'completed',
        timestamp: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'quality-check',
        status: 'completed',
        timestamp: new Date(Date.now() - 108 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'packaging',
        status: 'completed',
        timestamp: new Date(Date.now() - 84 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'shipped',
        status: 'completed',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'delivered',
        status: 'current',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'normal',
    totalAmount: 1798.80,
    shippingAddress: {
      fullName: 'James Brown',
      email: 'jbrown@example.com',
      phone: '555-0109',
      address: '357 Walnut Ave',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'James Brown',
      email: 'jbrown@example.com',
      phone: '555-0109',
      address: '357 Walnut Ave',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      country: 'USA',
    },
    paymentMethod: 'Amex ****3456',
    transactionId: 'txn_009_g3h4i5j6',
    trackingNumber: 'TRACK555111222',
    estimatedDelivery: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    notes: [
      {
        author: 'Delivery',
        text: 'Order delivered successfully',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 196 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-010',
    customerId: 'cust-010',
    customerName: 'Patricia Lee',
    customerEmail: 'plee@example.com',
    items: [
      {
        product: products[10],
        quantity: 80,
        price: 34.99,
      },
    ],
    currentStage: 'returns-refunds',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 216 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 214 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'completed',
        timestamp: new Date(Date.now() - 192 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'in-production',
        status: 'completed',
        timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'quality-check',
        status: 'completed',
        timestamp: new Date(Date.now() - 132 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'packaging',
        status: 'completed',
        timestamp: new Date(Date.now() - 108 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'shipped',
        status: 'completed',
        timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'delivered',
        status: 'completed',
        timestamp: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'returns-refunds',
        status: 'current',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
    priority: 'normal',
    totalAmount: 2799.20,
    shippingAddress: {
      fullName: 'Patricia Lee',
      email: 'plee@example.com',
      phone: '555-0110',
      address: '654 Willow Ln',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95101',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Patricia Lee',
      email: 'plee@example.com',
      phone: '555-0110',
      address: '654 Willow Ln',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95101',
      country: 'USA',
    },
    paymentMethod: 'Visa ****1111',
    transactionId: 'txn_010_k7l8m9n0',
    trackingNumber: 'TRACK333777888',
    estimatedDelivery: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    notes: [
      {
        author: 'Customer Service',
        text: 'Return requested by customer',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 220 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-011',
    customerId: 'cust-011',
    customerName: 'Christopher White',
    customerEmail: 'cwhite@example.com',
    items: [
      {
        product: products[0],
        quantity: 200,
        price: 24.99,
      },
    ],
    currentStage: 'order-placed',
    timeline: [
      {
        stage: 'order-placed',
        status: 'current',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'payment-verified', status: 'upcoming' },
      { stage: 'design-approved', status: 'upcoming' },
      { stage: 'in-production', status: 'upcoming' },
      { stage: 'quality-check', status: 'upcoming' },
      { stage: 'packaging', status: 'upcoming' },
      { stage: 'shipped', status: 'upcoming' },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'normal',
    totalAmount: 4998.00,
    shippingAddress: {
      fullName: 'Christopher White',
      email: 'cwhite@example.com',
      phone: '555-0111',
      address: '789 Poplar St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Christopher White',
      email: 'cwhite@example.com',
      phone: '555-0111',
      address: '789 Poplar St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
    },
    paymentMethod: 'Visa ****2222',
    transactionId: 'txn_011_o1p2q3r4',
    notes: [
      {
        author: 'System',
        text: 'Order created',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-012',
    customerId: 'cust-012',
    customerName: 'Nancy Harris',
    customerEmail: 'nharris@example.com',
    items: [
      {
        product: products[5],
        quantity: 160,
        price: 79.99,
      },
    ],
    currentStage: 'payment-verified',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'current',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'design-approved', status: 'upcoming' },
      { stage: 'in-production', status: 'upcoming' },
      { stage: 'quality-check', status: 'upcoming' },
      { stage: 'packaging', status: 'upcoming' },
      { stage: 'shipped', status: 'upcoming' },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'rush',
    totalAmount: 12798.40,
    shippingAddress: {
      fullName: 'Nancy Harris',
      email: 'nharris@example.com',
      phone: '555-0112',
      address: '852 Sycamore Rd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32099',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Nancy Harris',
      email: 'nharris@example.com',
      phone: '555-0112',
      address: '852 Sycamore Rd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32099',
      country: 'USA',
    },
    paymentMethod: 'Mastercard ****4444',
    transactionId: 'txn_012_s5t6u7v8',
    notes: [
      {
        author: 'Finance',
        text: 'Payment confirmed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-013',
    customerId: 'cust-013',
    customerName: 'Mark Davis',
    customerEmail: 'mdavis@example.com',
    items: [
      {
        product: products[2],
        quantity: 50,
        price: 49.99,
      },
    ],
    currentStage: 'in-production',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 34 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'completed',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'in-production',
        status: 'current',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'quality-check', status: 'upcoming' },
      { stage: 'packaging', status: 'upcoming' },
      { stage: 'shipped', status: 'upcoming' },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'express',
    totalAmount: 2499.50,
    shippingAddress: {
      fullName: 'Mark Davis',
      email: 'mdavis@example.com',
      phone: '555-0113',
      address: '963 Hickory Way',
      city: 'Fort Worth',
      state: 'TX',
      zipCode: '76101',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Mark Davis',
      email: 'mdavis@example.com',
      phone: '555-0113',
      address: '963 Hickory Way',
      city: 'Fort Worth',
      state: 'TX',
      zipCode: '76101',
      country: 'USA',
    },
    paymentMethod: 'Discover ****5555',
    transactionId: 'txn_013_w9x0y1z2',
    notes: [
      {
        author: 'Production',
        text: 'Started production run',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 38 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-014',
    customerId: 'cust-014',
    customerName: 'Susan Miller',
    customerEmail: 'smiller@example.com',
    items: [
      {
        product: products[11],
        quantity: 90,
        price: 9.99,
      },
    ],
    currentStage: 'shipped',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 84 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 82 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'completed',
        timestamp: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'in-production',
        status: 'completed',
        timestamp: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'quality-check',
        status: 'completed',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'packaging',
        status: 'completed',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'shipped',
        status: 'current',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'normal',
    totalAmount: 899.10,
    shippingAddress: {
      fullName: 'Susan Miller',
      email: 'smiller@example.com',
      phone: '555-0114',
      address: '741 Ash Blvd',
      city: 'Columbus',
      state: 'OH',
      zipCode: '43085',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Susan Miller',
      email: 'smiller@example.com',
      phone: '555-0114',
      address: '741 Ash Blvd',
      city: 'Columbus',
      state: 'OH',
      zipCode: '43085',
      country: 'USA',
    },
    paymentMethod: 'Visa ****6666',
    transactionId: 'txn_014_a3b4c5d6',
    trackingNumber: 'TRACK222444666',
    notes: [
      {
        author: 'Shipping',
        text: 'Shipped via UPS',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 88 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-015',
    customerId: 'cust-015',
    customerName: 'Thomas Garcia',
    customerEmail: 'tgarcia@example.com',
    items: [
      {
        product: products[1],
        quantity: 300,
        price: 22.99,
      },
    ],
    currentStage: 'quality-check',
    timeline: [
      {
        stage: 'order-placed',
        status: 'completed',
        timestamp: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'payment-verified',
        status: 'completed',
        timestamp: new Date(Date.now() - 58 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'design-approved',
        status: 'completed',
        timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'in-production',
        status: 'completed',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        stage: 'quality-check',
        status: 'current',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      { stage: 'packaging', status: 'upcoming' },
      { stage: 'shipped', status: 'upcoming' },
      { stage: 'delivered', status: 'upcoming' },
      { stage: 'returns-refunds', status: 'upcoming' },
    ],
    priority: 'normal',
    totalAmount: 6897.00,
    shippingAddress: {
      fullName: 'Thomas Garcia',
      email: 'tgarcia@example.com',
      phone: '555-0115',
      address: '456 Oak Terrace',
      city: 'Charlotte',
      state: 'NC',
      zipCode: '28202',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'Thomas Garcia',
      email: 'tgarcia@example.com',
      phone: '555-0115',
      address: '456 Oak Terrace',
      city: 'Charlotte',
      state: 'NC',
      zipCode: '28202',
      country: 'USA',
    },
    paymentMethod: 'Mastercard ****7777',
    transactionId: 'txn_015_e7f8g9h0',
    notes: [
      {
        author: 'QC Team',
        text: 'Quality check in progress',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 64 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export const useOMSStore = create<OMSStore>((set, get) => ({
  orders: mockOrders,

  moveToNextStage: (orderId) => {
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id === orderId) {
          const currentIndex = stages.indexOf(order.currentStage);
          if (currentIndex < stages.length - 1) {
            const nextStage = stages[currentIndex + 1];
            const updatedTimeline = order.timeline.map((t) =>
              t.stage === order.currentStage
                ? {
                    ...t,
                    status: 'completed' as const,
                    timestamp: new Date().toISOString(),
                  }
                : t.stage === nextStage
                  ? { ...t, status: 'current' as const }
                  : t
            );
            return {
              ...order,
              currentStage: nextStage,
              timeline: updatedTimeline,
              updatedAt: new Date().toISOString(),
            };
          }
        }
        return order;
      }),
    }));
  },

  moveToPreviousStage: (orderId) => {
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id === orderId) {
          const currentIndex = stages.indexOf(order.currentStage);
          if (currentIndex > 0) {
            const prevStage = stages[currentIndex - 1];
            const updatedTimeline = order.timeline.map((t) =>
              t.stage === order.currentStage
                ? { ...t, status: 'upcoming' as const }
                : t.stage === prevStage
                  ? { ...t, status: 'current' as const }
                  : t
            );
            return {
              ...order,
              currentStage: prevStage,
              timeline: updatedTimeline,
              updatedAt: new Date().toISOString(),
            };
          }
        }
        return order;
      }),
    }));
  },

  addNote: (orderId, author, text) => {
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            notes: [
              ...order.notes,
              {
                author,
                text,
                timestamp: new Date().toISOString(),
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      }),
    }));
  },

  updatePriority: (orderId, priority) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, priority, updatedAt: new Date().toISOString() }
          : order
      ),
    }));
  },

  getOrdersByStage: (stage) => {
    return get().orders.filter((order) => order.currentStage === stage);
  },

  getOrderById: (orderId) => {
    return get().orders.find((order) => order.id === orderId);
  },

  getStats: () => {
    const orders = get().orders;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = orders.filter((order) => {
      const orderDate = new Date(order.updatedAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime() && order.currentStage === 'delivered';
    }).length;

    const revenueToday = orders
      .filter((order) => {
        const orderDate = new Date(order.updatedAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      })
      .reduce((total, order) => total + order.totalAmount, 0);

    const allTimestamps = orders.flatMap((order) =>
      order.timeline
        .filter((t) => t.timestamp)
        .map((t) => {
          const start = new Date(order.createdAt);
          const end = new Date(t.timestamp!);
          return end.getTime() - start.getTime();
        })
    );

    const averageProcessingTime = allTimestamps.length
      ? Math.round(
          allTimestamps.reduce((a, b) => a + b, 0) /
            allTimestamps.length /
            (1000 * 60 * 60)
        )
      : 0;

    const pendingReturns = orders.filter(
      (order) => order.currentStage === 'returns-refunds'
    ).length;

    return {
      completedToday,
      revenueToday,
      averageProcessingTime,
      pendingReturns,
    };
  },
}));
