const express = require('express');
const { validationResult } = require('express-validator');
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { orderValidation, paginationValidation } = require('../middleware/validation');

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

router.post(
  '/',
  verifyToken,
  orderValidation.create,
  validateRequest,
  orderController.createOrder
);

router.get('/', verifyToken, paginationValidation, validateRequest, orderController.getUserOrders);

router.get('/admin/all', verifyToken, isAdmin, paginationValidation, validateRequest, orderController.getAllOrders);

router.get('/admin/stats', verifyToken, isAdmin, orderController.getOrderStats);

router.get('/:id', verifyToken, orderController.getOrderById);

router.put(
  '/:id/status',
  verifyToken,
  isAdmin,
  orderController.updateOrderStatus
);

module.exports = router;
