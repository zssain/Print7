const mockDb = require('../data/mockDb');
const { getPaginationParams, generateDesignId } = require('../utils/helpers');

async function initializeMarketplaceData() {
  // Initialize marketplace with seed data if empty
  if (mockDb.marketplaceDesigns.length === 0) {
    const sampleDesigns = [
      {
        id: generateDesignId(),
        name: 'Minimalist Business Card',
        description: 'Clean and professional business card design',
        category: 'business-cards',
        price: 5.99,
        authorId: 'author-001',
        authorName: 'Design Studio Pro',
        images: ['https://via.placeholder.com/400x300?text=Business+Card+1'],
        rating: 4.8,
        reviewCount: 145,
        downloads: 312,
        featured: true,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Modern Flyer Template',
        description: 'Contemporary flyer design for events and promotions',
        category: 'flyers',
        price: 7.99,
        authorId: 'author-002',
        authorName: 'Creative Designs',
        images: ['https://via.placeholder.com/400x300?text=Flyer+1'],
        rating: 4.5,
        reviewCount: 89,
        downloads: 203,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Colorful Poster Design',
        description: 'Vibrant poster for marketing campaigns',
        category: 'posters',
        price: 9.99,
        authorId: 'author-003',
        authorName: 'Graphics Unlimited',
        images: ['https://via.placeholder.com/400x300?text=Poster+1'],
        rating: 4.7,
        reviewCount: 67,
        downloads: 156,
        featured: true,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Professional Brochure',
        description: 'Three-fold brochure for corporate use',
        category: 'brochures',
        price: 12.99,
        authorId: 'author-001',
        authorName: 'Design Studio Pro',
        images: ['https://via.placeholder.com/400x300?text=Brochure+1'],
        rating: 4.9,
        reviewCount: 234,
        downloads: 445,
        featured: true,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Social Media Banner',
        description: 'Customizable social media templates',
        category: 'social-media',
        price: 4.99,
        authorId: 'author-004',
        authorName: 'Social Creators',
        images: ['https://via.placeholder.com/400x300?text=Social+Banner+1'],
        rating: 4.6,
        reviewCount: 112,
        downloads: 287,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'T-Shirt Design Bundle',
        description: 'Multiple apparel design templates',
        category: 'apparel',
        price: 14.99,
        authorId: 'author-005',
        authorName: 'Apparel Designs Co',
        images: ['https://via.placeholder.com/400x300?text=TShirt+1'],
        rating: 4.4,
        reviewCount: 98,
        downloads: 234,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Elegant Wedding Invitation',
        description: 'Sophisticated wedding invitation template',
        category: 'invitations',
        price: 6.99,
        authorId: 'author-006',
        authorName: 'Event Designs',
        images: ['https://via.placeholder.com/400x300?text=Wedding+Invite+1'],
        rating: 4.9,
        reviewCount: 156,
        downloads: 389,
        featured: true,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Product Label Design',
        description: 'Professional product label templates',
        category: 'labels',
        price: 8.99,
        authorId: 'author-007',
        authorName: 'Label Masters',
        images: ['https://via.placeholder.com/400x300?text=Product+Label+1'],
        rating: 4.7,
        reviewCount: 134,
        downloads: 278,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Certificate Template',
        description: 'Customizable certificate designs',
        category: 'certificates',
        price: 3.99,
        authorId: 'author-008',
        authorName: 'Certificate Design',
        images: ['https://via.placeholder.com/400x300?text=Certificate+1'],
        rating: 4.5,
        reviewCount: 67,
        downloads: 143,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Packaging Box Design',
        description: 'Custom packaging box templates',
        category: 'packaging',
        price: 16.99,
        authorId: 'author-009',
        authorName: 'Package Design Pro',
        images: ['https://via.placeholder.com/400x300?text=Packaging+Box+1'],
        rating: 4.8,
        reviewCount: 189,
        downloads: 412,
        featured: true,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Menu Card Design',
        description: 'Restaurant menu card templates',
        category: 'menus',
        price: 9.99,
        authorId: 'author-010',
        authorName: 'Restaurant Designs',
        images: ['https://via.placeholder.com/400x300?text=Menu+Card+1'],
        rating: 4.6,
        reviewCount: 91,
        downloads: 187,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Letterhead Template',
        description: 'Professional letterhead designs',
        category: 'stationery',
        price: 4.99,
        authorId: 'author-001',
        authorName: 'Design Studio Pro',
        images: ['https://via.placeholder.com/400x300?text=Letterhead+1'],
        rating: 4.4,
        reviewCount: 78,
        downloads: 154,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Vehicle Wrap Design',
        description: 'Full vehicle wrap design templates',
        category: 'vehicle-wraps',
        price: 24.99,
        authorId: 'author-011',
        authorName: 'Vehicle Design Studio',
        images: ['https://via.placeholder.com/400x300?text=Vehicle+Wrap+1'],
        rating: 4.9,
        reviewCount: 45,
        downloads: 98,
        featured: true,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Billboard Design',
        description: 'Large format billboard templates',
        category: 'billboards',
        price: 19.99,
        authorId: 'author-012',
        authorName: 'Outdoor Advertising',
        images: ['https://via.placeholder.com/400x300?text=Billboard+1'],
        rating: 4.7,
        reviewCount: 56,
        downloads: 112,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Book Cover Design',
        description: 'Professional book cover templates',
        category: 'books',
        price: 11.99,
        authorId: 'author-013',
        authorName: 'Publishing Designs',
        images: ['https://via.placeholder.com/400x300?text=Book+Cover+1'],
        rating: 4.8,
        reviewCount: 167,
        downloads: 345,
        featured: true,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Thumbnail Design Set',
        description: 'YouTube thumbnail templates',
        category: 'digital',
        price: 6.99,
        authorId: 'author-014',
        authorName: 'Digital Content Designs',
        images: ['https://via.placeholder.com/400x300?text=Thumbnail+1'],
        rating: 4.5,
        reviewCount: 203,
        downloads: 456,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Logo Design Package',
        description: 'Complete logo design templates',
        category: 'logos',
        price: 13.99,
        authorId: 'author-015',
        authorName: 'Logo Masters',
        images: ['https://via.placeholder.com/400x300?text=Logo+Package+1'],
        rating: 4.9,
        reviewCount: 289,
        downloads: 567,
        featured: true,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Calendar Template',
        description: 'Annual calendar design templates',
        category: 'calendars',
        price: 7.99,
        authorId: 'author-016',
        authorName: 'Calendar Designs',
        images: ['https://via.placeholder.com/400x300?text=Calendar+1'],
        rating: 4.6,
        reviewCount: 134,
        downloads: 278,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Ticket Design Bundle',
        description: 'Event ticket design templates',
        category: 'events',
        price: 8.99,
        authorId: 'author-017',
        authorName: 'Event Tickets',
        images: ['https://via.placeholder.com/400x300?text=Ticket+1'],
        rating: 4.5,
        reviewCount: 98,
        downloads: 212,
        featured: false,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
      {
        id: generateDesignId(),
        name: 'Custom Sticker Pack',
        description: 'Die-cut sticker design templates',
        category: 'stickers',
        price: 5.99,
        authorId: 'author-018',
        authorName: 'Sticker Creators',
        images: ['https://via.placeholder.com/400x300?text=Stickers+1'],
        rating: 4.7,
        reviewCount: 145,
        downloads: 334,
        featured: true,
        previewUrl: 'https://via.placeholder.com/400x300',
      },
    ];

    for (const design of sampleDesigns) {
      await mockDb.addMarketplaceDesign(design);
    }
  }
}

async function getMarketplaceDesigns(req, res) {
  try {
    await initializeMarketplaceData();

    const { page, limit, offset } = getPaginationParams(req.query);
    const { category, minPrice, maxPrice, search, sort } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (search) filters.search = search;
    if (sort) filters.sort = sort;

    const result = await mockDb.getAllMarketplaceDesigns(limit, offset, filters);

    return res.status(200).json({
      success: true,
      message: 'Marketplace designs retrieved successfully',
      data: {
        designs: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching marketplace designs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve marketplace designs',
      error: error.message,
    });
  }
}

async function getMarketplaceDesignDetail(req, res) {
  try {
    await initializeMarketplaceData();

    const { id } = req.params;

    const design = await mockDb.getMarketplaceDesign(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    const reviews = await mockDb.getDesignReviews(id);

    return res.status(200).json({
      success: true,
      message: 'Design retrieved successfully',
      data: {
        ...design,
        reviewCount: reviews.length,
        reviews,
      },
    });
  } catch (error) {
    console.error('Error fetching design detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve design',
      error: error.message,
    });
  }
}

async function getDesignReviews(req, res) {
  try {
    const { id } = req.params;

    const reviews = await mockDb.getDesignReviews(id);

    return res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: {
        designId: id,
        reviews,
        count: reviews.length,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reviews',
      error: error.message,
    });
  }
}

async function addDesignReview(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user ? (req.user.uid || req.user.id) : 'anonymous';

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'rating must be between 1 and 5',
      });
    }

    const design = await mockDb.getMarketplaceDesign(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    const reviewData = {
      designId: id,
      userId,
      userName: req.user ? req.user.email : 'Anonymous',
      rating: parseInt(rating),
      comment: comment || '',
    };

    const review = await mockDb.addDesignReview(id, reviewData);

    return res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message,
    });
  }
}

async function purchaseDesign(req, res) {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to purchase',
      });
    }

    const userId = req.user.uid || req.user.id;

    const design = await mockDb.getMarketplaceDesign(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    // Mock purchase
    const purchase = await mockDb.addPurchasedDesign(userId, id);

    return res.status(201).json({
      success: true,
      message: 'Design purchased successfully',
      data: {
        purchaseId: purchase.id,
        designId: id,
        price: design.price,
        downloadUrl: `https://api.print7.com/designs/${id}/download`,
        purchasedAt: purchase.purchasedAt,
      },
    });
  } catch (error) {
    console.error('Error purchasing design:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to purchase design',
      error: error.message,
    });
  }
}

async function toggleLike(req, res) {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to like designs',
      });
    }

    const design = await mockDb.getMarketplaceDesign(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    // Mock like toggle - track per user
    const likeKey = `${req.user?.uid || 'anon'}_${id}`;
    if (!global._likeState) global._likeState = {};
    global._likeState[likeKey] = !global._likeState[likeKey];
    const isLiked = global._likeState[likeKey];

    return res.status(200).json({
      success: true,
      message: isLiked ? 'Design liked' : 'Like removed',
      data: {
        designId: id,
        liked: isLiked,
      },
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle like',
      error: error.message,
    });
  }
}

async function getFeaturedDesigns(req, res) {
  try {
    await initializeMarketplaceData();

    const { page, limit, offset } = getPaginationParams(req.query);

    const result = await mockDb.getAllMarketplaceDesigns(limit, offset, { featured: true });

    return res.status(200).json({
      success: true,
      message: 'Featured designs retrieved successfully',
      data: {
        designs: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching featured designs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured designs',
      error: error.message,
    });
  }
}

async function getAuthorDesigns(req, res) {
  try {
    await initializeMarketplaceData();

    const { authorId } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);

    const allDesigns = mockDb.marketplaceDesigns.filter((d) => d.authorId === authorId);
    const total = allDesigns.length;
    const designs = allDesigns.slice(offset, offset + limit);

    return res.status(200).json({
      success: true,
      message: 'Author designs retrieved successfully',
      data: {
        authorId,
        designs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching author designs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve author designs',
      error: error.message,
    });
  }
}

module.exports = {
  getMarketplaceDesigns,
  getMarketplaceDesignDetail,
  getDesignReviews,
  addDesignReview,
  purchaseDesign,
  toggleLike,
  getFeaturedDesigns,
  getAuthorDesigns,
};
