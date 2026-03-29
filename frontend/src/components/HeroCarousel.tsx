'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=1200&h=400&fit=crop',
    title: 'Professional Business Cards',
    subtitle: 'Make a lasting impression with custom business cards',
    cta: 'Design Now',
    ctaLink: '/products/business-cards',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1565193566173-7cde230c01d7?w=1200&h=400&fit=crop',
    title: 'Eye-Catching Marketing Materials',
    subtitle: 'Promote your brand with custom flyers and brochures',
    cta: 'Get Started',
    ctaLink: '/products/flyers',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556821552-3f87d7baa7a8?w=1200&h=400&fit=crop',
    title: 'Custom Apparel & Merchandise',
    subtitle: 'Create branded t-shirts, hoodies, and more',
    cta: 'Shop Now',
    ctaLink: '/products/apparel',
  },
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  return (
    <div
      className="relative w-full h-96 overflow-hidden rounded-lg"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            priority={index === 0}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-2xl">
              {slide.title}
            </h2>
            <p className="text-xl text-gray-100 mb-8 max-w-xl">
              {slide.subtitle}
            </p>
            <Link href={slide.ctaLink}>
              <Button variant="secondary" size="lg">
                {slide.cta}
              </Button>
            </Link>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
      >
        <ChevronLeft size={24} className="text-print7-dark" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
      >
        <ChevronRight size={24} className="text-print7-dark" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white bg-opacity-50 w-3 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
