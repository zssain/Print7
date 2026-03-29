'use client';

import React from 'react';
import Link from 'next/link';
import { HeroCarousel } from '@/components/HeroCarousel';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/Button';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { CheckCircle, Truck, Award, Lock } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  return (
    <div className="w-full">
      <section className="container-print7 py-8">
        <HeroCarousel />
      </section>

      <section className="container-print7 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-print7-dark mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of customizable products for your business and personal needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-print7-light py-16">
        <div className="container-print7">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-print7-dark mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Three simple steps to get your custom prints</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Choose Product',
                description: 'Browse our catalog and select the perfect product for your needs',
                icon: '🛍️',
              },
              {
                step: 2,
                title: 'Design It',
                description: 'Use our easy-to-use design studio to create or customize your design',
                icon: '✏️',
              },
              {
                step: 3,
                title: 'We Print & Ship',
                description: 'We handle the rest - printing, quality checks, and fast shipping',
                icon: '📦',
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-print7-primary text-white rounded-full mb-6">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-print7-dark mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-print7 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-print7-dark mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600">Discover customer favorites</p>
        </div>

        <ProductGrid products={featuredProducts} />

        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="primary" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-print7-primary text-white py-16">
        <div className="container-print7">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Premium Quality',
                description: 'High-quality materials and professional printing',
              },
              {
                icon: Truck,
                title: 'Fast Shipping',
                description: 'Quick turnaround and reliable delivery',
              },
              {
                icon: Award,
                title: 'Expert Design',
                description: 'Professional design tools and templates included',
              },
              {
                icon: Lock,
                title: 'Secure Payment',
                description: 'Safe and secure checkout process',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <item.icon size={48} className="mx-auto mb-4" />
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-gray-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-print7 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-print7-dark mb-4">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Johnson',
              role: 'Small Business Owner',
              comment: 'Print7 made it so easy to create professional business cards. The design tools are intuitive and the quality is outstanding!',
              rating: 5,
            },
            {
              name: 'Michael Chen',
              role: 'Marketing Manager',
              comment: 'We order all our promotional materials from Print7. Fast turnaround, excellent quality, and great customer service.',
              rating: 5,
            },
            {
              name: 'Emily Rodriguez',
              role: 'Event Planner',
              comment: 'The custom apparel options are fantastic. Our clients love the quality and the prices are very competitive.',
              rating: 5,
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
              <div className="mb-4">
                {'★'.repeat(testimonial.rating)}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
              <div>
                <p className="font-bold text-print7-dark">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-print7-primary to-print7-secondary text-white py-16">
        <div className="container-print7 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create your first custom design today and see why thousands of businesses trust Print7
          </p>
          <Link href="/products">
            <Button variant="secondary" size="lg" className="bg-white text-print7-primary hover:bg-gray-100">
              Start Designing Now
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-print7-light py-16">
        <div className="container-print7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-print7-dark mb-2">Free Design Tools</h3>
              <p className="text-gray-600">Use our built-in design studio with templates, fonts, and millions of images</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-print7-dark mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer support team is here to help you whenever you need assistance</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-print7-dark mb-2">100% Satisfaction</h3>
              <p className="text-gray-600">Not happy with your order? We offer a full refund guarantee</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-print7 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-print7-dark mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">Get exclusive discounts and tips on design trends</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-print7-primary"
              />
              <Button variant="primary" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
