'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { categories } from '@/data/categories';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setActiveCategory] = useState<string | null>(null);
  const cartCount = useCartStore(state => state.getItemCount());
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-print7-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P7</span>
            </div>
            <span className="text-xl font-bold text-print7-dark hidden sm:inline">
              Print7
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {categories.slice(0, 5).map(category => (
              <div
                key={category.id}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={`/products/${category.slug}`}
                  className="text-gray-700 hover:text-print7-primary font-medium transition-colors py-4"
                >
                  {category.name}
                </Link>
              </div>
            ))}
            <Link
              href="/products"
              className="text-gray-700 hover:text-print7-primary font-medium transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/marketplace"
              className="text-gray-700 hover:text-print7-primary font-medium transition-colors"
            >
              Marketplace
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 justify-center mx-4">
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-print7-primary"
              />
              <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative text-gray-700 hover:text-print7-primary transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-print7-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative group">
              <button className="text-gray-700 hover:text-print7-primary transition-colors">
                <User size={24} />
              </button>
              <div className="absolute right-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {user ? (
                  <div className="p-4">
                    <p className="font-medium text-print7-dark">{user.name}</p>
                    <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                    <Link href="/dashboard" className="block text-print7-primary hover:underline text-sm mb-2">
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="text-print7-primary hover:underline text-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    <Link href="/auth/login" className="block text-print7-primary hover:underline font-medium">
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="block text-print7-primary hover:underline text-sm">
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <button
              className="lg:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className="block px-4 py-2 text-gray-700 hover:bg-print7-light rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-print7-light rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Products
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
