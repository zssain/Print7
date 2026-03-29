const mockDb = require('../data/mockDb');
const { getPaginationParams } = require('../utils/helpers');

async function getUserInventory(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { page, limit, offset } = getPaginationParams(req.query);

    const result = await mockDb.getUserInventory(userId, limit, offset);

    return res.status(200).json({
      success: true,
      message: 'Inventory items retrieved successfully',
      data: {
        items: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve inventory items',
      error: error.message,
    });
  }
}

async function getInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const item = await mockDb.getInventoryItem(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    if (item.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this inventory item',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inventory item retrieved successfully',
      data: item,
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve inventory item',
      error: error.message,
    });
  }
}

async function addInventoryItem(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const {
      productId,
      productName,
      quantity,
      unit,
      threshold,
      autoReorder,
      reorderQuantity,
    } = req.body;

    if (!productId || !productName || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'productId, productName, and quantity are required',
      });
    }

    const itemData = {
      productId,
      productName,
      quantity: parseInt(quantity),
      unit: unit || 'units',
      threshold: threshold ? parseInt(threshold) : 5,
      autoReorder: autoReorder === true,
      reorderQuantity: reorderQuantity ? parseInt(reorderQuantity) : 10,
    };

    const item = await mockDb.addInventoryItem(userId, itemData);

    return res.status(201).json({
      success: true,
      message: 'Inventory item added successfully',
      data: item,
    });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add inventory item',
      error: error.message,
    });
  }
}

async function updateInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;
    const updates = req.body;

    const item = await mockDb.getInventoryItem(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    if (item.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this inventory item',
      });
    }

    // Validate numeric fields
    if (updates.quantity !== undefined) {
      updates.quantity = parseInt(updates.quantity);
    }
    if (updates.threshold !== undefined) {
      updates.threshold = parseInt(updates.threshold);
    }
    if (updates.reorderQuantity !== undefined) {
      updates.reorderQuantity = parseInt(updates.reorderQuantity);
    }

    const updatedItem = await mockDb.updateInventoryItem(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Inventory item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update inventory item',
      error: error.message,
    });
  }
}

async function deleteInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const item = await mockDb.getInventoryItem(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    if (item.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this inventory item',
      });
    }

    await mockDb.deleteInventoryItem(id);

    return res.status(200).json({
      success: true,
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete inventory item',
      error: error.message,
    });
  }
}

async function triggerReorder(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const item = await mockDb.getInventoryItem(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    if (item.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to reorder this item',
      });
    }

    // Mock reorder logic
    const reorderRequest = {
      id: require('uuid').v4(),
      inventoryId: id,
      quantity: item.reorderQuantity || 10,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    // Update inventory to reflect pending reorder
    await mockDb.updateInventoryItem(id, {
      lastReorderAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Reorder request created successfully',
      data: reorderRequest,
    });
  } catch (error) {
    console.error('Error triggering reorder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to trigger reorder',
      error: error.message,
    });
  }
}

async function getInventoryAlerts(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    const alerts = await mockDb.getInventoryAlerts(userId);

    return res.status(200).json({
      success: true,
      message: 'Inventory alerts retrieved successfully',
      data: {
        alerts,
        count: alerts.length,
      },
    });
  } catch (error) {
    console.error('Error fetching inventory alerts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve inventory alerts',
      error: error.message,
    });
  }
}

async function getInventoryStats(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    const items = await mockDb.getUserInventory(userId, 1000, 0);
    const allItems = items.data;

    const stats = {
      totalItems: allItems.length,
      totalUnits: allItems.reduce((sum, item) => sum + item.quantity, 0),
      itemsAboveThreshold: allItems.filter(
        (item) => item.quantity > (item.threshold || 5)
      ).length,
      itemsBelowThreshold: allItems.filter(
        (item) => item.quantity <= (item.threshold || 5)
      ).length,
      autoReorderEnabled: allItems.filter((item) => item.autoReorder).length,
      avgQuantityPerItem:
        allItems.length > 0
          ? allItems.reduce((sum, item) => sum + item.quantity, 0) /
            allItems.length
          : 0,
    };

    return res.status(200).json({
      success: true,
      message: 'Inventory statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve inventory statistics',
      error: error.message,
    });
  }
}

module.exports = {
  getUserInventory,
  getInventoryItem,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  triggerReorder,
  getInventoryAlerts,
  getInventoryStats,
};
