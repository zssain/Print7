'use client';

import { create } from 'zustand';
import { DesignAsset, DesignFolder, DesignReview, MarketplaceFilters } from '@/types';
import { generateId } from '@/lib/utils';

interface DesignMarketStore {
  myDesigns: DesignAsset[];
  folders: DesignFolder[];
  marketplaceDesigns: DesignAsset[];
  purchasedDesigns: string[];
  reviews: DesignReview[];

  // Design operations
  addDesign: (design: DesignAsset) => void;
  updateDesign: (design: DesignAsset) => void;
  deleteDesign: (designId: string) => void;
  duplicateDesign: (designId: string) => void;
  archiveDesign: (designId: string) => void;

  // Folder operations
  createFolder: (name: string, color: string) => void;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, newName: string) => void;
  moveToFolder: (designId: string, folderId: string | undefined) => void;

  // Marketplace operations
  publishToMarketplace: (designId: string, price: number, description: string, tags: string[]) => void;
  unpublishFromMarketplace: (designId: string) => void;
  purchaseDesign: (designId: string) => void;

  // Review operations
  addReview: (designId: string, rating: number, comment: string) => void;
  likeDesign: (designId: string) => void;

  // Query operations
  getDesignsByFolder: (folderId?: string) => DesignAsset[];
  getArchivedDesigns: () => DesignAsset[];
  getMarketplaceDesigns: (filters: Partial<MarketplaceFilters>) => DesignAsset[];
  getMyPublishedDesigns: () => DesignAsset[];
  getPurchasedDesigns: () => DesignAsset[];
}

// Mock data
const mockFolders: DesignFolder[] = [
  { id: 'f1', name: 'Business', color: '#667eea', designCount: 4, createdAt: '2025-01-15' },
  { id: 'f2', name: 'Marketing', color: '#f093fb', designCount: 5, createdAt: '2025-01-20' },
  { id: 'f3', name: 'Apparel', color: '#4facfe', designCount: 3, createdAt: '2025-02-01' },
  { id: 'f4', name: 'Personal', color: '#43e97b', designCount: 3, createdAt: '2025-02-10' },
];

const mockMyDesigns: DesignAsset[] = [
  {
    id: 'd1',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Corporate Business Cards',
    description: 'Professional business cards with modern design',
    thumbnail: '#667eea',
    category: 'business-cards',
    tags: ['business', 'professional', 'corporate'],
    canvasData: '{}',
    productId: 'bc-001',
    width: 3.5,
    height: 2,
    createdAt: '2025-01-15',
    updatedAt: '2025-03-20',
    version: 3,
    versions: [
      { version: 1, canvasData: '{}', updatedAt: '2025-01-15', note: 'Initial design' },
      { version: 2, canvasData: '{}', updatedAt: '2025-02-01', note: 'Updated colors' },
      { version: 3, canvasData: '{}', updatedAt: '2025-03-20', note: 'Final tweaks' },
    ],
    folderId: 'f1',
    isArchived: false,
    isPublished: true,
    marketplacePrice: 0,
    downloads: 45,
    rating: 4.8,
    reviewCount: 12,
    likes: 23,
  },
  {
    id: 'd2',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Marketing Flyer Template',
    description: 'Colorful flyer for promoting events',
    thumbnail: '#f093fb',
    category: 'flyers',
    tags: ['marketing', 'event', 'flyer'],
    canvasData: '{}',
    productId: 'fl-001',
    width: 8.5,
    height: 11,
    createdAt: '2025-01-20',
    updatedAt: '2025-03-18',
    version: 2,
    versions: [
      { version: 1, canvasData: '{}', updatedAt: '2025-01-20', note: 'Original design' },
      { version: 2, canvasData: '{}', updatedAt: '2025-03-18', note: 'Layout improvements' },
    ],
    folderId: 'f2',
    isArchived: false,
    isPublished: true,
    marketplacePrice: 2.99,
    downloads: 78,
    rating: 4.5,
    reviewCount: 18,
    likes: 34,
  },
  {
    id: 'd3',
    userId: 'user1',
    authorName: 'Current User',
    name: 'T-Shirt Design Collection',
    description: 'Modern apparel designs for custom printing',
    thumbnail: '#4facfe',
    category: 't-shirts',
    tags: ['apparel', 'tshirt', 'design'],
    canvasData: '{}',
    productId: 'ap-001',
    width: 12,
    height: 12,
    createdAt: '2025-02-05',
    updatedAt: '2025-03-15',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-05', note: 'Initial design' }],
    folderId: 'f3',
    isArchived: false,
    isPublished: false,
    downloads: 0,
  },
  {
    id: 'd4',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Premium Poster Design',
    description: 'Eye-catching poster for art exhibitions',
    thumbnail: '#fa709a',
    category: 'posters',
    tags: ['poster', 'art', 'exhibition'],
    canvasData: '{}',
    productId: 'po-001',
    width: 24,
    height: 36,
    createdAt: '2025-02-12',
    updatedAt: '2025-03-10',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-12', note: 'Initial design' }],
    folderId: 'f1',
    isArchived: false,
    isPublished: true,
    marketplacePrice: 4.99,
    downloads: 32,
    rating: 4.7,
    reviewCount: 8,
    likes: 15,
  },
  {
    id: 'd5',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Sticker Pack Design',
    description: 'Fun vinyl sticker pack for merchandise',
    thumbnail: '#43e97b',
    category: 'stickers',
    tags: ['sticker', 'vinyl', 'fun'],
    canvasData: '{}',
    productId: 'st-001',
    width: 5,
    height: 5,
    createdAt: '2025-02-20',
    updatedAt: '2025-03-08',
    version: 2,
    versions: [
      { version: 1, canvasData: '{}', updatedAt: '2025-02-20', note: 'Initial designs' },
      { version: 2, canvasData: '{}', updatedAt: '2025-03-08', note: 'Color refinements' },
    ],
    folderId: 'f4',
    isArchived: false,
    isPublished: false,
    downloads: 0,
  },
  {
    id: 'd6',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Coffee Mug Design',
    description: 'Minimalist design for ceramic mugs',
    thumbnail: '#a18cd1',
    category: 'mugs',
    tags: ['mug', 'coffee', 'beverage'],
    canvasData: '{}',
    productId: 'mg-001',
    width: 8,
    height: 6,
    createdAt: '2025-02-28',
    updatedAt: '2025-03-05',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-28', note: 'Initial design' }],
    folderId: 'f4',
    isArchived: false,
    isPublished: true,
    marketplacePrice: 0,
    downloads: 12,
    rating: 4.6,
    reviewCount: 3,
    likes: 8,
  },
  {
    id: 'd7',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Banner Design Pro',
    description: 'Large format banner for outdoor events',
    thumbnail: '#fee140',
    category: 'banners',
    tags: ['banner', 'outdoor', 'event'],
    canvasData: '{}',
    productId: 'bn-001',
    width: 48,
    height: 24,
    createdAt: '2025-03-01',
    updatedAt: '2025-03-12',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-03-01', note: 'Initial design' }],
    folderId: 'f2',
    isArchived: false,
    isPublished: false,
    downloads: 0,
  },
  {
    id: 'd8',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Vintage Band Poster',
    description: 'Retro style poster for music events',
    thumbnail: '#fa709a',
    category: 'posters',
    tags: ['poster', 'music', 'vintage'],
    canvasData: '{}',
    productId: 'po-001',
    width: 18,
    height: 24,
    createdAt: '2025-03-05',
    updatedAt: '2025-03-05',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-03-05', note: 'Initial design' }],
    folderId: 'f1',
    isArchived: false,
    isPublished: false,
    downloads: 0,
  },
  {
    id: 'd9',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Wedding Invitation',
    description: 'Elegant wedding invitation design',
    thumbnail: '#f5576c',
    category: 'flyers',
    tags: ['wedding', 'invitation', 'elegant'],
    canvasData: '{}',
    productId: 'fl-001',
    width: 5,
    height: 7,
    createdAt: '2025-03-10',
    updatedAt: '2025-03-10',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-03-10', note: 'Initial design' }],
    folderId: 'f2',
    isArchived: false,
    isPublished: true,
    marketplacePrice: 3.99,
    downloads: 15,
    rating: 4.9,
    reviewCount: 5,
    likes: 12,
  },
  {
    id: 'd10',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Logo Concept',
    description: 'Modern logo design for brand identity',
    thumbnail: '#667eea',
    category: 'business-cards',
    tags: ['logo', 'brand', 'identity'],
    canvasData: '{}',
    productId: 'bc-001',
    width: 4,
    height: 4,
    createdAt: '2025-03-12',
    updatedAt: '2025-03-12',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-03-12', note: 'Initial concept' }],
    folderId: 'f1',
    isArchived: false,
    isPublished: false,
    downloads: 0,
  },
  {
    id: 'd11',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Social Media Post',
    description: 'Instagram-sized design template',
    thumbnail: '#f093fb',
    category: 'flyers',
    tags: ['social', 'instagram', 'marketing'],
    canvasData: '{}',
    productId: 'fl-001',
    width: 1080,
    height: 1080,
    createdAt: '2025-03-14',
    updatedAt: '2025-03-14',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-03-14', note: 'Initial design' }],
    folderId: 'f2',
    isArchived: false,
    isPublished: true,
    marketplacePrice: 1.99,
    downloads: 8,
    rating: 4.4,
    reviewCount: 2,
    likes: 5,
  },
  {
    id: 'd12',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Product Label Design',
    description: 'Packaging label for product branding',
    thumbnail: '#4facfe',
    category: 'stickers',
    tags: ['label', 'packaging', 'product'],
    canvasData: '{}',
    productId: 'st-001',
    width: 4,
    height: 3,
    createdAt: '2025-03-16',
    updatedAt: '2025-03-16',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-03-16', note: 'Initial design' }],
    folderId: 'f3',
    isArchived: false,
    isPublished: false,
    downloads: 0,
  },
  {
    id: 'd13',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Limited Edition Tee',
    description: 'Exclusive limited edition t-shirt design',
    thumbnail: '#4facfe',
    category: 't-shirts',
    tags: ['tshirt', 'limited', 'exclusive'],
    canvasData: '{}',
    productId: 'ap-001',
    width: 12,
    height: 12,
    createdAt: '2025-03-18',
    updatedAt: '2025-03-18',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-03-18', note: 'Initial design' }],
    folderId: 'f3',
    isArchived: false,
    isPublished: false,
    downloads: 0,
  },
  {
    id: 'd14',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Archived Design',
    description: 'Old design no longer in use',
    thumbnail: '#a18cd1',
    category: 'business-cards',
    tags: ['archived', 'old'],
    canvasData: '{}',
    productId: 'bc-001',
    width: 3.5,
    height: 2,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-05',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-01-01', note: 'Original' }],
    isArchived: true,
    isPublished: false,
    downloads: 0,
  },
  {
    id: 'd15',
    userId: 'user1',
    authorName: 'Current User',
    name: 'Retired Poster',
    description: 'Old poster design no longer used',
    thumbnail: '#fbc2eb',
    category: 'posters',
    tags: ['archived', 'retired'],
    canvasData: '{}',
    productId: 'po-001',
    width: 24,
    height: 36,
    createdAt: '2024-12-15',
    updatedAt: '2024-12-20',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2024-12-15', note: 'Original' }],
    isArchived: true,
    isPublished: false,
    downloads: 0,
  },
];

const mockMarketplaceDesigns: DesignAsset[] = [
  {
    id: 'mp1',
    userId: 'author1',
    authorName: 'Designer Pro',
    name: 'Modern Business Card',
    description: 'Sleek and professional business card design',
    thumbnail: '#667eea',
    category: 'business-cards',
    tags: ['business', 'professional', 'modern'],
    canvasData: '{}',
    productId: 'bc-001',
    width: 3.5,
    height: 2,
    createdAt: '2025-02-10',
    updatedAt: '2025-03-10',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-10', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 0,
    downloads: 156,
    rating: 4.7,
    reviewCount: 42,
    likes: 89,
  },
  {
    id: 'mp2',
    userId: 'author2',
    authorName: 'Creative Studio',
    name: 'Colorful Event Flyer',
    description: 'Vibrant flyer template for any event',
    thumbnail: '#f093fb',
    category: 'flyers',
    tags: ['event', 'colorful', 'promotion'],
    canvasData: '{}',
    productId: 'fl-001',
    width: 8.5,
    height: 11,
    createdAt: '2025-01-28',
    updatedAt: '2025-03-08',
    version: 2,
    versions: [
      { version: 1, canvasData: '{}', updatedAt: '2025-01-28', note: 'Initial' },
      { version: 2, canvasData: '{}', updatedAt: '2025-03-08', note: 'Updated' },
    ],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 2.99,
    downloads: 234,
    rating: 4.8,
    reviewCount: 67,
    likes: 145,
  },
  {
    id: 'mp3',
    userId: 'author3',
    authorName: 'Brand Masters',
    name: 'Premium Poster Collection',
    description: 'High-quality poster designs for artists',
    thumbnail: '#fa709a',
    category: 'posters',
    tags: ['poster', 'art', 'premium'],
    canvasData: '{}',
    productId: 'po-001',
    width: 24,
    height: 36,
    createdAt: '2025-02-05',
    updatedAt: '2025-03-05',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-05', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 5.99,
    downloads: 89,
    rating: 4.9,
    reviewCount: 28,
    likes: 76,
  },
  {
    id: 'mp4',
    userId: 'author4',
    authorName: 'Fashion Designer',
    name: 'Trendy T-Shirt Designs',
    description: 'Modern and trendy apparel designs',
    thumbnail: '#4facfe',
    category: 't-shirts',
    tags: ['tshirt', 'trendy', 'fashion'],
    canvasData: '{}',
    productId: 'ap-001',
    width: 12,
    height: 12,
    createdAt: '2025-02-15',
    updatedAt: '2025-03-12',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-15', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 3.99,
    downloads: 178,
    rating: 4.6,
    reviewCount: 48,
    likes: 123,
  },
  {
    id: 'mp5',
    userId: 'author5',
    authorName: 'Label Maker',
    name: 'Sticker Pack Designs',
    description: 'Fun and colorful vinyl sticker packs',
    thumbnail: '#43e97b',
    category: 'stickers',
    tags: ['sticker', 'fun', 'vinyl'],
    canvasData: '{}',
    productId: 'st-001',
    width: 5,
    height: 5,
    createdAt: '2025-02-20',
    updatedAt: '2025-03-10',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-20', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 0,
    downloads: 312,
    rating: 4.7,
    reviewCount: 89,
    likes: 234,
  },
  {
    id: 'mp6',
    userId: 'author1',
    authorName: 'Designer Pro',
    name: 'Coffee Lover Mug Design',
    description: 'Perfect design for coffee enthusiasts',
    thumbnail: '#a18cd1',
    category: 'mugs',
    tags: ['mug', 'coffee', 'gift'],
    canvasData: '{}',
    productId: 'mg-001',
    width: 8,
    height: 6,
    createdAt: '2025-02-18',
    updatedAt: '2025-03-08',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-18', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 1.99,
    downloads: 125,
    rating: 4.5,
    reviewCount: 34,
    likes: 67,
  },
  {
    id: 'mp7',
    userId: 'author2',
    authorName: 'Creative Studio',
    name: 'Large Format Banner',
    description: 'Professional banner template for businesses',
    thumbnail: '#fee140',
    category: 'banners',
    tags: ['banner', 'business', 'outdoor'],
    canvasData: '{}',
    productId: 'bn-001',
    width: 48,
    height: 24,
    createdAt: '2025-02-25',
    updatedAt: '2025-03-09',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-25', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 7.99,
    downloads: 67,
    rating: 4.8,
    reviewCount: 19,
    likes: 45,
  },
  {
    id: 'mp8',
    userId: 'author3',
    authorName: 'Brand Masters',
    name: 'Wedding Invitation Suite',
    description: 'Elegant wedding invitation templates',
    thumbnail: '#f5576c',
    category: 'flyers',
    tags: ['wedding', 'invitation', 'elegant'],
    canvasData: '{}',
    productId: 'fl-001',
    width: 5,
    height: 7,
    createdAt: '2025-03-01',
    updatedAt: '2025-03-11',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-03-01', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 4.99,
    downloads: 98,
    rating: 4.9,
    reviewCount: 32,
    likes: 88,
  },
  {
    id: 'mp9',
    userId: 'author4',
    authorName: 'Fashion Designer',
    name: 'Minimalist Poster Design',
    description: 'Clean and simple poster for modern spaces',
    thumbnail: '#667eea',
    category: 'posters',
    tags: ['poster', 'minimalist', 'modern'],
    canvasData: '{}',
    productId: 'po-001',
    width: 18,
    height: 24,
    createdAt: '2025-02-12',
    updatedAt: '2025-03-07',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-12', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 0,
    downloads: 234,
    rating: 4.6,
    reviewCount: 56,
    likes: 112,
  },
  {
    id: 'mp10',
    userId: 'author5',
    authorName: 'Label Maker',
    name: 'Corporate Identity Pack',
    description: 'Complete business identity design',
    thumbnail: '#764ba2',
    category: 'business-cards',
    tags: ['business', 'identity', 'corporate'],
    canvasData: '{}',
    productId: 'bc-001',
    width: 3.5,
    height: 2,
    createdAt: '2025-02-22',
    updatedAt: '2025-03-06',
    version: 2,
    versions: [
      { version: 1, canvasData: '{}', updatedAt: '2025-02-22', note: 'Initial' },
      { version: 2, canvasData: '{}', updatedAt: '2025-03-06', note: 'Updated' },
    ],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 6.99,
    downloads: 143,
    rating: 4.7,
    reviewCount: 41,
    likes: 98,
  },
  {
    id: 'mp11',
    userId: 'author1',
    authorName: 'Designer Pro',
    name: 'Social Media Templates',
    description: 'Ready-to-use social media designs',
    thumbnail: '#f093fb',
    category: 'flyers',
    tags: ['social', 'template', 'marketing'],
    canvasData: '{}',
    productId: 'fl-001',
    width: 1080,
    height: 1080,
    createdAt: '2025-02-08',
    updatedAt: '2025-03-04',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-08', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 2.99,
    downloads: 267,
    rating: 4.8,
    reviewCount: 72,
    likes: 156,
  },
  {
    id: 'mp12',
    userId: 'author2',
    authorName: 'Creative Studio',
    name: 'Product Label Pack',
    description: 'Professional product labels',
    thumbnail: '#4facfe',
    category: 'stickers',
    tags: ['label', 'product', 'packaging'],
    canvasData: '{}',
    productId: 'st-001',
    width: 4,
    height: 3,
    createdAt: '2025-02-28',
    updatedAt: '2025-03-03',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-28', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 1.99,
    downloads: 89,
    rating: 4.5,
    reviewCount: 24,
    likes: 52,
  },
  {
    id: 'mp13',
    userId: 'author3',
    authorName: 'Brand Masters',
    name: 'Limited Edition Apparel',
    description: 'Exclusive limited edition designs',
    thumbnail: '#4facfe',
    category: 't-shirts',
    tags: ['tshirt', 'limited', 'exclusive'],
    canvasData: '{}',
    productId: 'ap-001',
    width: 12,
    height: 12,
    createdAt: '2025-02-14',
    updatedAt: '2025-03-02',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-14', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 4.99,
    downloads: 76,
    rating: 4.9,
    reviewCount: 22,
    likes: 68,
  },
  {
    id: 'mp14',
    userId: 'author4',
    authorName: 'Fashion Designer',
    name: 'Seasonal Poster Pack',
    description: 'Seasonal and holiday poster designs',
    thumbnail: '#fa709a',
    category: 'posters',
    tags: ['poster', 'seasonal', 'holiday'],
    canvasData: '{}',
    productId: 'po-001',
    width: 24,
    height: 36,
    createdAt: '2025-02-03',
    updatedAt: '2025-03-01',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-03', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 3.99,
    downloads: 145,
    rating: 4.7,
    reviewCount: 39,
    likes: 94,
  },
  {
    id: 'mp15',
    userId: 'author5',
    authorName: 'Label Maker',
    name: 'Customizable Banner Templates',
    description: 'Flexible banner designs for any business',
    thumbnail: '#fee140',
    category: 'banners',
    tags: ['banner', 'customizable', 'template'],
    canvasData: '{}',
    productId: 'bn-001',
    width: 48,
    height: 24,
    createdAt: '2025-02-19',
    updatedAt: '2025-02-28',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-19', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 5.99,
    downloads: 112,
    rating: 4.6,
    reviewCount: 31,
    likes: 73,
  },
  {
    id: 'mp16',
    userId: 'author1',
    authorName: 'Designer Pro',
    name: 'Elegant Mug Designs',
    description: 'Sophisticated designs for ceramic mugs',
    thumbnail: '#a18cd1',
    category: 'mugs',
    tags: ['mug', 'elegant', 'gift'],
    canvasData: '{}',
    productId: 'mg-001',
    width: 8,
    height: 6,
    createdAt: '2025-02-11',
    updatedAt: '2025-02-27',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-11', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 0,
    downloads: 198,
    rating: 4.8,
    reviewCount: 54,
    likes: 129,
  },
  {
    id: 'mp17',
    userId: 'author2',
    authorName: 'Creative Studio',
    name: 'Premium Business Card Suite',
    description: 'Luxury business card designs',
    thumbnail: '#667eea',
    category: 'business-cards',
    tags: ['business', 'premium', 'luxury'],
    canvasData: '{}',
    productId: 'bc-001',
    width: 3.5,
    height: 2,
    createdAt: '2025-02-07',
    updatedAt: '2025-02-26',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-07', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 3.99,
    downloads: 167,
    rating: 4.9,
    reviewCount: 45,
    likes: 107,
  },
  {
    id: 'mp18',
    userId: 'author3',
    authorName: 'Brand Masters',
    name: 'Event Marketing Flyer',
    description: 'Professional event promotion flyers',
    thumbnail: '#f5576c',
    category: 'flyers',
    tags: ['event', 'marketing', 'promotion'],
    canvasData: '{}',
    productId: 'fl-001',
    width: 8.5,
    height: 11,
    createdAt: '2025-02-16',
    updatedAt: '2025-02-25',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-16', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 2.99,
    downloads: 134,
    rating: 4.6,
    reviewCount: 36,
    likes: 81,
  },
  {
    id: 'mp19',
    userId: 'author4',
    authorName: 'Fashion Designer',
    name: 'Artistic Sticker Collection',
    description: 'Unique artistic sticker designs',
    thumbnail: '#43e97b',
    category: 'stickers',
    tags: ['sticker', 'artistic', 'unique'],
    canvasData: '{}',
    productId: 'st-001',
    width: 5,
    height: 5,
    createdAt: '2025-02-24',
    updatedAt: '2025-02-24',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-24', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 1.99,
    downloads: 156,
    rating: 4.7,
    reviewCount: 42,
    likes: 99,
  },
  {
    id: 'mp20',
    userId: 'author5',
    authorName: 'Label Maker',
    name: 'Complete Apparel Line',
    description: 'Full apparel design collection',
    thumbnail: '#4facfe',
    category: 't-shirts',
    tags: ['tshirt', 'apparel', 'collection'],
    canvasData: '{}',
    productId: 'ap-001',
    width: 12,
    height: 12,
    createdAt: '2025-02-27',
    updatedAt: '2025-02-23',
    version: 1,
    versions: [{ version: 1, canvasData: '{}', updatedAt: '2025-02-27', note: 'Initial' }],
    isArchived: false,
    isPublished: true,
    marketplacePrice: 5.99,
    downloads: 189,
    rating: 4.8,
    reviewCount: 51,
    likes: 118,
  },
];

const mockReviews: DesignReview[] = [
  {
    id: 'r1',
    designId: 'd1',
    userId: 'user2',
    userName: 'John Doe',
    rating: 5,
    comment: 'Great design, very professional!',
    createdAt: '2025-03-20',
  },
  {
    id: 'r2',
    designId: 'd2',
    userId: 'user3',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Nice colors and layout, very eye-catching.',
    createdAt: '2025-03-19',
  },
  {
    id: 'r3',
    designId: 'd4',
    userId: 'user4',
    userName: 'Mike Johnson',
    rating: 5,
    comment: 'Excellent poster design, exactly what I needed!',
    createdAt: '2025-03-18',
  },
  {
    id: 'r4',
    designId: 'd9',
    userId: 'user5',
    userName: 'Sarah Wilson',
    rating: 5,
    comment: 'Beautiful invitation design, very elegant!',
    createdAt: '2025-03-17',
  },
  {
    id: 'r5',
    designId: 'd11',
    userId: 'user6',
    userName: 'Tom Brown',
    rating: 4,
    comment: 'Good social media template, easy to customize.',
    createdAt: '2025-03-16',
  },
];

export const useDesignMarketStore = create<DesignMarketStore>((set, get) => ({
  myDesigns: mockMyDesigns,
  folders: mockFolders,
  marketplaceDesigns: mockMarketplaceDesigns,
  purchasedDesigns: ['mp2', 'mp8', 'mp10', 'mp14', 'mp18'],
  reviews: mockReviews,

  addDesign: (design: DesignAsset) => {
    set(state => ({
      myDesigns: [...state.myDesigns, design],
    }));
  },

  updateDesign: (design: DesignAsset) => {
    set(state => ({
      myDesigns: state.myDesigns.map(d => (d.id === design.id ? design : d)),
    }));
  },

  deleteDesign: (designId: string) => {
    set(state => ({
      myDesigns: state.myDesigns.filter(d => d.id !== designId),
    }));
  },

  duplicateDesign: (designId: string) => {
    const state = get();
    const original = state.myDesigns.find(d => d.id === designId);
    if (!original) return;

    const duplicate: DesignAsset = {
      ...original,
      id: generateId(),
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      versions: [{ version: 1, canvasData: original.canvasData, updatedAt: new Date().toISOString(), note: 'Duplicate' }],
    };

    set(s => ({
      myDesigns: [...s.myDesigns, duplicate],
    }));
  },

  archiveDesign: (designId: string) => {
    set(state => ({
      myDesigns: state.myDesigns.map(d =>
        d.id === designId ? { ...d, isArchived: true } : d
      ),
    }));
  },

  createFolder: (name: string, color: string) => {
    const newFolder: DesignFolder = {
      id: generateId(),
      name,
      color,
      designCount: 0,
      createdAt: new Date().toISOString(),
    };

    set(state => ({
      folders: [...state.folders, newFolder],
    }));
  },

  deleteFolder: (folderId: string) => {
    set(state => ({
      folders: state.folders.filter(f => f.id !== folderId),
      myDesigns: state.myDesigns.map(d =>
        d.folderId === folderId ? { ...d, folderId: undefined } : d
      ),
    }));
  },

  renameFolder: (folderId: string, newName: string) => {
    set(state => ({
      folders: state.folders.map(f =>
        f.id === folderId ? { ...f, name: newName } : f
      ),
    }));
  },

  moveToFolder: (designId: string, folderId: string | undefined) => {
    set(state => ({
      myDesigns: state.myDesigns.map(d =>
        d.id === designId ? { ...d, folderId } : d
      ),
    }));
  },

  publishToMarketplace: (designId: string, price: number, description: string, tags: string[]) => {
    set(state => ({
      myDesigns: state.myDesigns.map(d =>
        d.id === designId
          ? { ...d, isPublished: true, marketplacePrice: price, description, tags }
          : d
      ),
    }));
  },

  unpublishFromMarketplace: (designId: string) => {
    set(state => ({
      myDesigns: state.myDesigns.map(d =>
        d.id === designId ? { ...d, isPublished: false } : d
      ),
    }));
  },

  purchaseDesign: (designId: string) => {
    set(state => ({
      purchasedDesigns: state.purchasedDesigns.includes(designId)
        ? state.purchasedDesigns
        : [...state.purchasedDesigns, designId],
    }));
  },

  addReview: (designId: string, rating: number, comment: string) => {
    const newReview: DesignReview = {
      id: generateId(),
      designId,
      userId: 'current-user',
      userName: 'Current User',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    set(state => ({
      reviews: [...state.reviews, newReview],
      myDesigns: state.myDesigns.map(d => {
        if (d.id === designId) {
          const currentReviews = state.reviews.filter(r => r.designId === designId);
          const totalRating = currentReviews.reduce((sum, r) => sum + r.rating, 0) + rating;
          const newCount = currentReviews.length + 1;
          return {
            ...d,
            rating: Math.round(totalRating / newCount * 10) / 10,
            reviewCount: newCount,
          };
        }
        return d;
      }),
    }));
  },

  likeDesign: (designId: string) => {
    set(state => ({
      myDesigns: state.myDesigns.map(d =>
        d.id === designId ? { ...d, likes: (d.likes || 0) + 1 } : d
      ),
    }));
  },

  getDesignsByFolder: (folderId?: string) => {
    const state = get();
    return state.myDesigns.filter(d => !d.isArchived && d.folderId === folderId);
  },

  getArchivedDesigns: () => {
    const state = get();
    return state.myDesigns.filter(d => d.isArchived);
  },

  getMarketplaceDesigns: (filters: Partial<MarketplaceFilters>) => {
    const state = get();
    let results = [...state.marketplaceDesigns];

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      results = results.filter(d => d.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange) {
      results = results.filter(d => {
        const price = d.marketplacePrice || 0;
        switch (filters.priceRange) {
          case 'free':
            return price === 0;
          case 'under-5':
            return price > 0 && price < 5;
          case 'under-10':
            return price > 0 && price < 10;
          case '10-plus':
            return price >= 10;
          default:
            return true;
        }
      });
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(d =>
        d.name.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower) ||
        d.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'popular':
          results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
          break;
        case 'newest':
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'top-rated':
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'price-low':
          results.sort((a, b) => (a.marketplacePrice || 0) - (b.marketplacePrice || 0));
          break;
        case 'price-high':
          results.sort((a, b) => (b.marketplacePrice || 0) - (a.marketplacePrice || 0));
          break;
      }
    }

    return results;
  },

  getMyPublishedDesigns: () => {
    const state = get();
    return state.myDesigns.filter(d => d.isPublished);
  },

  getPurchasedDesigns: () => {
    const state = get();
    return state.purchasedDesigns
      .map(id => state.marketplaceDesigns.find(d => d.id === id))
      .filter((d): d is DesignAsset => d !== undefined);
  },
}));
