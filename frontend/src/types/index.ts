export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  material?: string;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions: {
    size?: string;
    color?: string;
    material?: string;
    quantity: number;
  };
  designId?: string;
  totalPrice: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  totalPrice: number;
  shippingAddress: Address;
  createdAt: Date;
  estimatedDelivery?: Date;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Design {
  id: string;
  userId: string;
  name: string;
  thumbnail: string;
  canvasData: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  canvasData: string;
  width: number;
  height: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
}

// MODULE 1: Inventory System Types
export interface InventoryItem {
  id: string;
  product: Product;
  quantity: number;
  reorderThreshold: number;
  autoReorder: boolean;
  reorderQuantity: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastOrdered: string;
  stockHistory: { month: string; quantity: number }[];
  totalSpent: number;
}

// MODULE 2: User Account Manager Types
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  companyName?: string;
  role?: string;
  industry?: string;
  companySize?: string;
  taxId?: string;
  emailNotifications: boolean;
  smsAlerts: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
  twoFactorEnabled: boolean;
  memberSince: string;
}

export interface AddressBook {
  id: string;
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
}

// MODULE 3: OMS Types
export type OrderStage =
  | 'order-placed'
  | 'payment-verified'
  | 'design-approved'
  | 'in-production'
  | 'quality-check'
  | 'packaging'
  | 'shipped'
  | 'delivered'
  | 'returns-refunds';

export interface OrderTimeline {
  stage: OrderStage;
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
  note?: string;
}

export interface OMSOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: { product: Product; quantity: number; price: number; designId?: string }[];
  currentStage: OrderStage;
  timeline: OrderTimeline[];
  priority: 'normal' | 'rush' | 'express';
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  transactionId: string;
  notes: { author: string; text: string; timestamp: string }[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

// MODULE 4: Payment Profile Types
export interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  cardNumber: string; // masked like **** **** **** 4242
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
  billingAddress: Address;
}

export interface DigitalWallet {
  id: string;
  type: 'paypal' | 'google-pay' | 'apple-pay' | 'upi';
  email?: string;
  upiId?: string;
  displayName: string;
  isLinked: boolean;
  isDefault: boolean;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  method: 'card' | 'wallet' | 'cod' | 'net-banking';
  methodDetail: string; // e.g. "Visa ending 4242" or "PayPal (user@email.com)"
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  completedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
}

export interface PaymentProfile {
  cards: PaymentCard[];
  wallets: DigitalWallet[];
  defaultMethod: 'card' | 'wallet' | 'cod';
  defaultCardId?: string;
  defaultWalletId?: string;
  codEnabled: boolean;
  transactions: PaymentTransaction[];
}

// MODULE 5: Custom Design Inventory & Marketplace Types
export interface DesignAsset {
  id: string;
  userId: string;
  authorName: string;
  name: string;
  description: string;
  thumbnail: string; // placeholder color/gradient
  category: string; // business-cards, flyers, posters, t-shirts, etc.
  tags: string[];
  canvasData: string;
  productId: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  versions: { version: number; canvasData: string; updatedAt: string; note: string }[];
  folderId?: string;
  isArchived: boolean;
  isPublished: boolean; // true = listed on marketplace
  marketplacePrice?: number; // 0 = free
  downloads?: number;
  rating?: number;
  reviewCount?: number;
  likes?: number;
}

export interface DesignFolder {
  id: string;
  name: string;
  color: string; // folder color accent
  designCount: number;
  createdAt: string;
}

export interface DesignReview {
  id: string;
  designId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface MarketplaceFilters {
  category: string;
  priceRange: 'all' | 'free' | 'under-5' | 'under-10' | '10-plus';
  sortBy: 'popular' | 'newest' | 'top-rated' | 'price-low' | 'price-high';
  search: string;
}
