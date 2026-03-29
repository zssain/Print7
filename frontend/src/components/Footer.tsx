'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-print7-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link href="/products/business-cards" className="hover:text-print7-secondary transition-colors">Business Cards</Link></li>
              <li><Link href="/products/flyers" className="hover:text-print7-secondary transition-colors">Flyers</Link></li>
              <li><Link href="/products/banners" className="hover:text-print7-secondary transition-colors">Banners</Link></li>
              <li><Link href="/products/posters" className="hover:text-print7-secondary transition-colors">Posters</Link></li>
              <li><Link href="/products/apparel" className="hover:text-print7-secondary transition-colors">Apparel</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-print7-secondary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-print7-secondary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-print7-secondary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-print7-secondary transition-colors">Press</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-print7-secondary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-print7-secondary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-print7-secondary transition-colors">Shipping Info</Link></li>
              <li><Link href="#" className="hover:text-print7-secondary transition-colors">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:1-800-PRINT7" className="hover:text-print7-secondary transition-colors">1-800-PRINT7</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:hello@print7.com" className="hover:text-print7-secondary transition-colors">hello@print7.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={18} />
                <span>123 Print St, Design City, DC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              <p>&copy; 2024 Print7. All rights reserved.</p>
            </div>

            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-print7-secondary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-print7-secondary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-print7-secondary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-print7-secondary transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>

            <div className="flex gap-4 text-gray-400 text-sm">
              <Link href="#" className="hover:text-print7-secondary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-print7-secondary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-print7-secondary transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
