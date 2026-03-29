const express = require('express');
const { validationResult } = require('express-validator');
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { productValidation, paginationValidation, searchValidation } = require('../middleware/validation');

const router = express.Router();

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
}

router.get('/', paginationValidation, validateRequest, productController.getAllProducts);

router.get('/search', searchValidation, validateRequest, productController.searchProducts);

router.get('/category/:category', paginationValidation, validateRequest, productController.getProductsByCategory);

router.get('/:id', productController.getProductById);

router.post(
  '/',
  verifyToken,
  isAdmin,
  productValidation.create,
  validateRequest,
  productController.createProduct
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  productValidation.update,
  validateRequest,
  productController.updateProduct
);

router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  productController.deleteProduct
);

module.exports = router;
