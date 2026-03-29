'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useDesignMarketStore } from '@/store/designMarketStore';
import {
  Search,
  Heart,
  Download,
  Star,
} from 'lucide-react';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { likeDesign } = useDesignMarketStore();

  const categories = [
    'all',
    'business-cards',
    'flyers',
    'posters',
    'banners',
    't-shirts',
    'mugs',
    'stickers',
  ];

  const filteredDesigns = useMemo(() => {
    return useDesignMarketStore.getState().getMarketplaceDesigns({
      category: selectedCategory === 'all' ? '' : selectedCategory,
      priceRange: selectedPriceRange as any,
      sortBy: selectedSort as any,
      search: searchQuery,
    });
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedSort]);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredDesigns.length / itemsPerPage);
  const displayedDesigns = filteredDesigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'business-cards':
        return 'linear-gradient(135deg, #667eea, #764ba2)';
      case 'flyers':
        return 'linear-gradient(135deg, #f093fb, #f5576c)';
      case 'posters':
        return 'linear-gradient(135deg, #fa709a, #fee140)';
      case 't-shirts':
      case 'apparel':
        return 'linear-gradient(135deg, #4facfe, #00f2fe)';
      case 'stickers':
        return 'linear-gradient(135deg, #43e97b, #38f9d7)';
      case 'mugs':
        return 'linear-gradient(135deg, #a18cd1, #fbc2eb)';
      case 'banners':
        return 'linear-gradient(135deg, #fee140, #fbc2eb)';
      default:
        return 'linear-gradient(135deg, #a18cd1, #fbc2eb)';
    }
  };

  const getPriceLabel = (price?: number) => {
    if (!price || price === 0) {
      return <span className="text-green-600 font-bold text-sm">FREE</span>;
    }
    return <span className="text-[#0066CC] font-bold">${price.toFixed(2)}</span>;
  };

  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen pt-8 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#0066CC] to-[#FF6600] text-white py-12 mb-12">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">Design Marketplace</h1>
            <p className="text-lg opacity-90 mb-8">
              Browse thousands of professional templates created by our community
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search designs, tags, authors..."
                className="w-full px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Search size={20} className="absolute right-4 top-3.5 text-gray-400" />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer hover:text-[#0066CC]"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={e => {
                          setSelectedCategory(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 text-[#0066CC] cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {cat === 'all' ? 'All Categories' : cat.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Price</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'free', label: 'Free' },
                    { value: 'under-5', label: 'Under $5' },
                    { value: 'under-10', label: 'Under $10' },
                    { value: '10-plus', label: '$10+' },
                  ].map(option => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer hover:text-[#0066CC]"
                    >
                      <input
                        type="radio"
                        name="price"
                        value={option.value}
                        checked={selectedPriceRange === option.value}
                        onChange={e => {
                          setSelectedPriceRange(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 text-[#0066CC] cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Rating</h3>
                <div className="space-y-2">
                  {[
                    { value: 0, label: 'All Ratings' },
                    { value: 3, label: '3+ Stars' },
                    { value: 4, label: '4+ Stars' },
                  ].map(option => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer hover:text-[#0066CC]"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={option.value}
                        checked={selectedRating === option.value}
                        onChange={e => {
                          setSelectedRating(parseInt(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 text-[#0066CC] cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
                <select
                  value={selectedSort}
                  onChange={e => {
                    setSelectedSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066CC] focus:outline-none text-sm"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="top-rated">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Designs Grid */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {displayedDesigns.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
                  {Math.min(currentPage * itemsPerPage, filteredDesigns.length)} of{' '}
                  {filteredDesigns.length} results
                </p>
              </div>

              {displayedDesigns.length > 0 ? (
                <>
                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayedDesigns.map(design => (
                      <Link
                        key={design.id}
                        href={`/marketplace/${design.id}`}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                      >
                        {/* Thumbnail */}
                        <div
                          className="w-full h-48 relative overflow-hidden bg-gray-100"
                          style={{ background: getCategoryGradient(design.category) }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4 group-hover:opacity-0 transition-opacity">
                            <p className="font-semibold">{design.name}</p>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                            {design.name}
                          </h3>

                          {/* Author */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-[#0066CC] text-white flex items-center justify-center text-xs font-bold">
                              {design.authorName[0]}
                            </div>
                            <span className="text-sm text-gray-600">{design.authorName}</span>
                          </div>

                          {/* Price and Category */}
                          <div className="flex items-center justify-between mb-3">
                            {getPriceLabel(design.marketplacePrice)}
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                              {design.category}
                            </span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < Math.floor(design.rating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">
                              ({design.reviewCount || 0})
                            </span>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-1">
                              <Download size={14} />
                              {design.downloads || 0}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart size={14} />
                              {design.likes || 0}
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button className="w-full px-4 py-2 bg-[#0066CC] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                            {design.marketplacePrice === 0 ? 'Use Template' : 'Purchase'}
                          </button>

                          {/* Like Button */}
                          <button
                            onClick={e => {
                              e.preventDefault();
                              likeDesign(design.id);
                            }}
                            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            <Heart size={16} />
                            Like
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-[#0066CC] text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                  <Search size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No designs found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
