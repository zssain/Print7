const express = require('express');
const omsController = require('../controllers/omsController');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All OMS routes require authentication
router.use(verifyToken);

router.get('/orders', isAdmin, omsController.getAllOrders);
router.get('/orders/:id', isAdmin, omsController.getOrderDetail);
router.put('/orders/:id/stage', isAdmin, omsController.updateOrderStage);
router.put('/orders/:id/priority', isAdmin, omsController.updateOrderPriority);
router.post('/orders/:id/notes', isAdmin, omsController.addOrderNote);
router.get('/orders/:id/timeline', isAdmin, omsController.getOrderTimeline);
router.get('/stats', isAdmin, omsController.getOmsStats);
router.get('/pipeline', isAdmin, omsController.getPipeline);
router.put('/orders/:id/assign', isAdmin, omsController.assignOrder);
router.post('/orders/:id/refund', isAdmin, omsController.processRefund);

module.exports = router;
