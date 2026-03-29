const express = require('express');
const marketplaceController = require('../controllers/marketplaceController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Marketplace routes - optional auth for public designs
router.get('/', optionalAuth, marketplaceController.getMarketplaceDesigns);
router.get('/featured', optionalAuth, marketplaceController.getFeaturedDesigns);
router.get('/authors/:authorId', optionalAuth, marketplaceController.getAuthorDesigns);
router.get('/:id', optionalAuth, marketplaceController.getMarketplaceDesignDetail);
router.get('/:id/reviews', optionalAuth, marketplaceController.getDesignReviews);
router.post('/:id/reviews', optionalAuth, marketplaceController.addDesignReview);
router.post('/:id/purchase', optionalAuth, marketplaceController.purchaseDesign);
router.post('/:id/like', optionalAuth, marketplaceController.toggleLike);

module.exports = router;
