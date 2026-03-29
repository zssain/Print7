'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useDesignMarketStore } from '@/store/designMarketStore';
import {
  ArrowLeft,
  Heart,
  Download,
  Star,
  Flag,
  ShoppingCart,
} from 'lucide-react';

export default function MarketplaceDesignPage() {
  const params = useParams();
  const designId = params.id as string;
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [liked, setLiked] = useState(false);

  const { marketplaceDesigns, reviews, addReview, likeDesign, purchasedDesigns } =
    useDesignMarketStore();

  const design = marketplaceDesigns.find(d => d.id === designId);
  const designReviews = reviews.filter(r => r.designId === designId);
  const isPurchased = purchasedDesigns.includes(designId);

  if (!design) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Design not found</h2>
          <Link href="/marketplace" className="text-[#0066CC] hover:underline mt-4">
            Back to marketplace
          </Link>
        </div>
      </>
    );
  }

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

  const handleSubmitReview = () => {
    if (reviewComment.trim()) {
      addReview(design.id, reviewRating, reviewComment);
      setReviewComment('');
      setReviewRating(5);
      setShowReviewForm(false);
    }
  };

  const avgRating = designReviews.length > 0
    ? (designReviews.reduce((sum, r) => sum + r.rating, 0) / designReviews.length).toFixed(1)
    : design.rating || 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => {
    const count = designReviews.filter(r => r.rating === rating).length;
    const total = designReviews.length || 1;
    return { rating, count, percentage: (count / total) * 100 };
  });

  const authorDesigns = marketplaceDesigns.filter(
    d => d.authorName === design.authorName && d.id !== design.id
  );

  const relatedDesigns = marketplaceDesigns.filter(
    d => d.category === design.category && d.id !== design.id
  );

  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Link */}
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-[#0066CC] hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Marketplace
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Preview */}
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <div
                  className="w-full h-96 flex items-center justify-center"
                  style={{ background: getCategoryGradient(design.category) }}
                >
                  <div className="text-white text-center">
                    <p className="text-4xl font-bold mb-2">{design.name}</p>
                    <p className="text-lg opacity-75">{design.width}x{design.height}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{design.name}</h2>
                <p className="text-gray-700 mb-4">{design.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {design.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Info */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#0066CC] text-white flex items-center justify-center text-2xl font-bold">
                    {design.authorName[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{design.authorName}</h4>
                    <p className="text-sm text-gray-600">Member since February 2025</p>
                    <p className="text-sm text-gray-600">{authorDesigns.length} designs published</p>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Reviews</h3>

                {/* Rating Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center">
                    <p className="text-5xl font-bold text-gray-900">{avgRating}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={
                            i < Math.floor(parseFloat(avgRating.toString()))
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Based on {designReviews.length} reviews
                    </p>
                  </div>

                  <div className="space-y-2">
                    {ratingBreakdown.map(item => (
                      <div key={item.rating} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-12">{item.rating} star</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Write Review */}
                {isPurchased && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full px-4 py-3 border-2 border-[#0066CC] text-[#0066CC] font-medium rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Write a Review
                  </button>
                )}

                {showReviewForm && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-300">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            onClick={() => setReviewRating(rating)}
                            className="focus:outline-none"
                          >
                            <Star
                              size={28}
                              className={
                                rating <= reviewRating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                        rows={4}
                        placeholder="Share your experience with this design..."
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        className="px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-blue-700"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                )}

                {!isPurchased && (
                  <p className="text-sm text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
                    Purchase this design to leave a review
                  </p>
                )}

                {/* Reviews List */}
                {designReviews.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    {designReviews.map(review => (
                      <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{review.userName}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Author's Other Designs */}
              {authorDesigns.length > 0 && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    More by {design.authorName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {authorDesigns.slice(0, 3).map(d => (
                      <Link
                        key={d.id}
                        href={`/marketplace/${d.id}`}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                      >
                        <div
                          className="w-full h-32 flex items-center justify-center bg-gray-100"
                          style={{ background: getCategoryGradient(d.category) }}
                        />
                        <div className="p-3">
                          <h4 className="font-semibold text-gray-900 truncate text-sm">
                            {d.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {(d.marketplacePrice ?? 0) === 0
                              ? 'FREE'
                              : `$${(d.marketplacePrice ?? 0).toFixed(2)}`}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Designs */}
              {relatedDesigns.length > 0 && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Related Designs</h3>
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 pb-2">
                      {relatedDesigns.slice(0, 6).map(d => (
                        <Link
                          key={d.id}
                          href={`/marketplace/${d.id}`}
                          className="flex-shrink-0 w-40 border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div
                            className="w-full h-24 flex items-center justify-center bg-gray-100"
                            style={{ background: getCategoryGradient(d.category) }}
                          />
                          <div className="p-2">
                            <h4 className="font-semibold text-gray-900 truncate text-xs">
                              {d.name}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {(d.marketplacePrice ?? 0) === 0
                                ? 'FREE'
                                : `$${(d.marketplacePrice ?? 0).toFixed(2)}`}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-4 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {(design.marketplacePrice ?? 0) === 0
                      ? 'FREE'
                      : `$${(design.marketplacePrice ?? 0).toFixed(2)}`}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {design.category.replace('-', ' ')}
                  </p>

                  {(design.marketplacePrice ?? 0) === 0 ? (
                    <button className="w-full px-4 py-3 bg-[#0066CC] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Download size={20} />
                      Use Template
                    </button>
                  ) : (
                    <button className="w-full px-4 py-3 bg-[#0066CC] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart size={20} />
                      Purchase
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    likeDesign(design.id);
                    setLiked(!liked);
                  }}
                  className="w-full px-4 py-2 border-2 border-[#0066CC] text-[#0066CC] font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                  Like ({design.likes || 0})
                </button>

                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Flag size={18} />
                  Report Design
                </button>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-3">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {design.downloads || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(parseFloat(avgRating.toString()))
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {avgRating}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {designReviews.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
