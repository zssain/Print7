import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'business-cards',
    name: 'Business Cards',
    slug: 'business-cards',
    icon: '💼',
    description: 'Professional business cards to make a lasting impression',
    image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop',
  },
  {
    id: 'flyers',
    name: 'Flyers',
    slug: 'flyers',
    icon: '📄',
    description: 'Eye-catching flyers for events and promotions',
    image: 'https://images.unsplash.com/photo-1565193566173-7cde230c01d7?w=500&h=500&fit=crop',
  },
  {
    id: 'banners',
    name: 'Banners',
    slug: 'banners',
    icon: '🎉',
    description: 'Large format banners for maximum visibility',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop',
  },
  {
    id: 'posters',
    name: 'Posters',
    slug: 'posters',
    icon: '🖼️',
    description: 'Custom posters for any occasion',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&h=500&fit=crop',
  },
  {
    id: 'apparel',
    name: 'Apparel',
    slug: 'apparel',
    icon: '👕',
    description: 'Custom t-shirts, hoodies, and more',
    image: 'https://images.unsplash.com/photo-1556821552-3f87d7baa7a8?w=500&h=500&fit=crop',
  },
  {
    id: 'mugs',
    name: 'Mugs',
    slug: 'mugs',
    icon: '☕',
    description: 'Personalized mugs for gifts and promotion',
    image: 'https://images.unsplash.com/photo-1625525191007-3b3edd5b5b7d?w=500&h=500&fit=crop',
  },
  {
    id: 'stickers',
    name: 'Stickers',
    slug: 'stickers',
    icon: '🏷️',
    description: 'Custom stickers in any shape and size',
    image: 'https://images.unsplash.com/photo-1598163286242-96ce85b1a3fa?w=500&h=500&fit=crop',
  },
  {
    id: 'signs',
    name: 'Signs',
    slug: 'signs',
    icon: '🪧',
    description: 'Professional signage for your business',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop',
  },
];

export const categoryMap = new Map(categories.map(cat => [cat.slug, cat]));
