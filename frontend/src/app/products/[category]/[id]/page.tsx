'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { ProductGrid } from '@/components/ProductGrid';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const categorySlug = params.category as string;

  const product = products.find(p => p.id === productId);
  const addItem = useCartStore(state => state.addItem);

  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0] || '');
  const [selectedMaterial] = useState<string>(product?.material || '');
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const relatedProducts = products.filter(
    p => p.category === categorySlug && p.id !== productId
  ).slice(0, 4);

  if (!product) {
    return (
      <div className="container-print7 py-16 text-center">
        <h1 className="text-3xl font-bold text-print7-dark">Product Not Found</h1>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addItem(product, {
        size: selectedSize,
        color: selectedColor,
        material: selectedMaterial,
        quantity,
      });
      toast.success(`Added ${quantity} item(s) to cart!`);
      setTimeout(() => setIsAddingToCart(false), 500);
    } catch {
      toast.error('Failed to add to cart');
      setIsAddingToCart(false);
    }
  };

  const handleDesignNow = () => {
    router.push(`/studio?productId=${productId}`);
  };

  return (
    <div className="w-full">
      <div className="container-print7 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: product.name.split(' ')[0], href: `/products/${categorySlug}` },
          ]}
        />
      </div>

      <div className="container-print7 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-print7-dark mb-4">{product.name}</h1>

            <div className="mb-6">
              <Rating rating={product.rating} reviews={product.reviews} size="lg" />
            </div>

            <p className="text-gray-600 text-lg mb-6">{product.description}</p>

            <div className="mb-8 p-6 bg-print7-light rounded-lg">
              <div className="text-4xl font-bold text-print7-primary mb-2">
                {formatPrice(product.price)}
              </div>
              {!product.inStock && (
                <p className="text-print7-error font-semibold">Out of Stock</p>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-print7-dark mb-3">
                  Size
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-print7-primary bg-print7-primary text-white'
                          : 'border-gray-300 text-print7-dark hover:border-print7-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-print7-dark mb-3">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-print7-primary bg-print7-primary text-white'
                          : 'border-gray-300 text-print7-dark hover:border-print7-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-semibold text-print7-dark mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-print7-primary transition-colors"
                >
                  −
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-print7-primary transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleDesignNow}
                disabled={!product.inStock}
              >
                <ShoppingCart size={20} className="mr-2" />
                Start Designing
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart
                  size={20}
                  className={isFavorited ? 'fill-print7-secondary text-print7-secondary' : ''}
                />
              </Button>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              isLoading={isAddingToCart}
              disabled={!product.inStock}
            >
              Add to Cart (No Design)
            </Button>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-print7-dark mb-3">Product Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>Material:</strong> {product.material || 'Premium Quality'}</li>
                <li><strong>Category:</strong> {product.category}</li>
                <li><strong>Availability:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}</li>
              </ul>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-print7-dark mb-8">Related Products</h2>
            <ProductGrid
              products={relatedProducts}
              onDesignClick={(p) => router.push(`/products/${p.category}/${p.id}`)}
            />
          </div>
        )}
      </div>

      <section className="bg-print7-light py-16">
        <div className="container-print7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">✓</div>
              <h4 className="font-bold text-print7-dark mb-2">Quality Guaranteed</h4>
              <p className="text-gray-600">Premium materials and professional printing</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🚚</div>
              <h4 className="font-bold text-print7-dark mb-2">Fast Delivery</h4>
              <p className="text-gray-600">Quick processing and reliable shipping</p>
            </div>
            <div>
              <div className="text-4xl mb-3">💯</div>
              <h4 className="font-bold text-print7-dark mb-2">100% Satisfaction</h4>
              <p className="text-gray-600">Money-back guarantee on all orders</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
