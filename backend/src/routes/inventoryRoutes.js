const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All inventory routes require authentication
router.use(verifyToken);

router.get('/', inventoryController.getUserInventory);
router.get('/alerts', inventoryController.getInventoryAlerts);
router.get('/stats', inventoryController.getInventoryStats);
router.get('/:id', inventoryController.getInventoryItem);
router.post('/', inventoryController.addInventoryItem);
router.put('/:id', inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);
router.post('/:id/reorder', inventoryController.triggerReorder);

module.exports = router;
