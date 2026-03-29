const express = require('express');
const paymentController = require('../controllers/paymentController');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/process', verifyToken, paymentController.processPayment);

router.post('/verify', verifyToken, paymentController.verifyPayment);

router.get('/:orderId', verifyToken, paymentController.getPaymentStatus);

module.exports = router;
