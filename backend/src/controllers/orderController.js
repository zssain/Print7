const { db, isFirebaseInitialized } = require('../config/firebase');
const mockDb = require('../data/mockDb');
const {
  generateOrderId,
  calculateOrderTotal,
  calculateShippingCost,
  formatOrderResponse,
  getPaginationParams,
} = require('../utils/helpers');
const { HTTP_STATUS, ORDER_STATUS } = require('../utils/constants');

async function createOrder(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { items, shippingAddress, billingAddress, rushOrder } = req.body;

    if (!items || items.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    const subtotal = calculateOrderTotal(items);
    const shipping = calculateShippingCost(subtotal, rushOrder);
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = parseFloat((subtotal + shipping + tax).toFixed(2));

    const orderData = {
      id: generateOrderId(),
      userId,
      items,
      subtotal,
      shipping,
      tax,
      total,
      status: ORDER_STATUS.PENDING,
      paymentStatus: 'pending',
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      rushOrder: rushOrder || false,
      notes: req.body.notes || '',
    };

    let order;
    if (isFirebaseInitialized) {
      await db.collection('orders').doc(orderData.id).set({
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      order = orderData;
    } else {
      order = await mockDb.addOrder(orderData);
    }

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Order created successfully',
      data: formatOrderResponse(order),
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
}

async function getUserOrders(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { page, limit, offset } = getPaginationParams(req.query);

    let orders = [];
    let total = 0;

    if (isFirebaseInitialized) {
      const snapshot = await db
        .collection('orders')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const allOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      total = allOrders.length;
      orders = allOrders.slice(offset, offset + limit);
    } else {
      const result = await mockDb.getUserOrders(userId, limit, offset);
      orders = result.data;
      total = result.total;
    }

    const formattedOrders = orders.map(formatOrderResponse);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: {
        orders: formattedOrders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    let order;
    if (isFirebaseInitialized) {
      const doc = await db.collection('orders').doc(id).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Order not found',
        });
      }
      order = { id: doc.id, ...doc.data() };
    } else {
      order = await mockDb.getOrder(id);
      if (!order) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Order not found',
        });
      }
    }

    if (order.userId !== userId && req.user.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Access denied',
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Order retrieved successfully',
      data: formatOrderResponse(order),
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message,
    });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(ORDER_STATUS).includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const updates = {
      status,
      updatedAt: new Date().toISOString(),
    };

    let order;
    if (isFirebaseInitialized) {
      await db.collection('orders').doc(id).update(updates);
      const doc = await db.collection('orders').doc(id).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Order not found',
        });
      }
      order = { id: doc.id, ...doc.data() };
    } else {
      order = await mockDb.updateOrder(id, updates);
      if (!order) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Order not found',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Order status updated successfully',
      data: formatOrderResponse(order),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
}

async function getAllOrders(req, res) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { status } = req.query;

    let orders = [];
    let total = 0;

    if (isFirebaseInitialized) {
      let query = db.collection('orders').orderBy('createdAt', 'desc');

      if (status) {
        query = query.where('status', '==', status);
      }

      const snapshot = await query.get();
      const allOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      total = allOrders.length;
      orders = allOrders.slice(offset, offset + limit);
    } else {
      let result;
      if (status) {
        const allOrders = await mockDb.getAllOrders(1000, 0);
        const filtered = allOrders.data.filter((o) => o.status === status);
        result = {
          data: filtered.slice(offset, offset + limit),
          total: filtered.length,
        };
      } else {
        result = await mockDb.getAllOrders(limit, offset);
      }
      orders = result.data;
      total = result.total;
    }

    const formattedOrders = orders.map(formatOrderResponse);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'All orders retrieved successfully',
      data: {
        orders: formattedOrders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  }
}

async function getOrderStats(req, res) {
  try {
    let stats;

    if (isFirebaseInitialized) {
      const snapshot = await db.collection('orders').get();
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      const statuses = {};

      orders.forEach((o) => {
        statuses[o.status] = (statuses[o.status] || 0) + 1;
      });

      stats = {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        statuses,
        averageOrderValue: parseFloat(
          (totalOrders > 0 ? totalRevenue / totalOrders : 0).toFixed(2)
        ),
      };
    } else {
      stats = await mockDb.getOrderStats();
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Order statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve order statistics',
      error: error.message,
    });
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
};
