const mockDb = require('../data/mockDb');
const { getPaginationParams, generateOrderId } = require('../utils/helpers');

// Stage constants
const STAGES = [
  'Order Placed',
  'Payment Verified',
  'Design Approved',
  'In Production',
  'Quality Check',
  'Packaging',
  'Shipped',
  'Delivered',
  'Returns/Refunds',
];

async function initializeOmsData() {
  // Initialize OMS with seed data if empty
  if (mockDb.omsOrders.length === 0) {
    const sampleOrders = [
      {
        id: generateOrderId(),
        customerId: 'cust-001',
        customerName: 'John Doe',
        stage: 'Order Placed',
        priority: 'normal',
        status: 'pending',
        items: [{ productName: 'Business Cards', quantity: 500 }],
        total: 150.00,
        notes: [],
        timeline: [],
        assignedTo: null,
      },
      {
        id: generateOrderId(),
        customerId: 'cust-002',
        customerName: 'Jane Smith',
        stage: 'Payment Verified',
        priority: 'normal',
        status: 'processing',
        items: [{ productName: 'Flyers', quantity: 1000 }],
        total: 250.00,
        notes: [],
        timeline: [],
        assignedTo: null,
      },
      {
        id: generateOrderId(),
        customerId: 'cust-003',
        customerName: 'Bob Johnson',
        stage: 'Design Approved',
        priority: 'high',
        status: 'processing',
        items: [{ productName: 'Posters', quantity: 100 }],
        total: 180.00,
        notes: [],
        timeline: [],
        assignedTo: null,
      },
      {
        id: generateOrderId(),
        customerId: 'cust-004',
        customerName: 'Alice Brown',
        stage: 'In Production',
        priority: 'normal',
        status: 'processing',
        items: [{ productName: 'T-Shirts', quantity: 50 }],
        total: 400.00,
        notes: [],
        timeline: [],
        assignedTo: null,
      },
      {
        id: generateOrderId(),
        customerId: 'cust-005',
        customerName: 'Charlie Davis',
        stage: 'Quality Check',
        priority: 'high',
        status: 'processing',
        items: [{ productName: 'Mugs', quantity: 200 }],
        total: 300.00,
        notes: [],
        timeline: [],
        assignedTo: null,
      },
      {
        id: generateOrderId(),
        customerId: 'cust-006',
        customerName: 'Emma Wilson',
        stage: 'Packaging',
        priority: 'normal',
        status: 'processing',
        items: [{ productName: 'Stickers', quantity: 5000 }],
        total: 120.00,
        notes: [],
        timeline: [],
        assignedTo: null,
      },
      {
        id: generateOrderId(),
        customerId: 'cust-007',
        customerName: 'Frank Miller',
        stage: 'Shipped',
        priority: 'normal',
        status: 'shipped',
        items: [{ productName: 'Brochures', quantity: 500 }],
        total: 200.00,
        trackingNumber: 'TRK123456789',
        notes: [],
        timeline: [],
        assignedTo: null,
      },
      {
        id: generateOrderId(),
        customerId: 'cust-008',
        customerName: 'Grace Lee',
        stage: 'Delivered',
        priority: 'normal',
        status: 'completed',
        items: [{ productName: 'Envelopes', quantity: 1000 }],
        total: 180.00,
        trackingNumber: 'TRK987654321',
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: [],
        timeline: [],
        assignedTo: null,
      },
      {
        id: generateOrderId(),
        customerId: 'cust-009',
        customerName: 'Henry Taylor',
        stage: 'Returns/Refunds',
        priority: 'high',
        status: 'refunded',
        items: [{ productName: 'Banners', quantity: 10 }],
        total: 500.00,
        refundAmount: 500.00,
        refundReason: 'Quality issue',
        notes: [],
        timeline: [],
        assignedTo: null,
      },
      {
        id: generateOrderId(),
        customerId: 'cust-010',
        customerName: 'Isabella Garcia',
        stage: 'Order Placed',
        priority: 'low',
        status: 'pending',
        items: [{ productName: 'Labels', quantity: 2000 }],
        total: 95.00,
        notes: [],
        timeline: [],
        assignedTo: null,
      },
    ];

    for (const order of sampleOrders) {
      await mockDb.addOmsOrder(order);
    }
  }
}

async function getAllOrders(req, res) {
  try {
    await initializeOmsData();

    const { page, limit, offset } = getPaginationParams(req.query);
    const { stage, status } = req.query;

    const filters = {};
    if (stage) filters.stage = stage;
    if (status) filters.status = status;

    const result = await mockDb.getAllOmsOrders(limit, offset, filters);

    return res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: {
        orders: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching OMS orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  }
}

async function getOrderDetail(req, res) {
  try {
    await initializeOmsData();

    const { id } = req.params;

    const order = await mockDb.getOmsOrder(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message,
    });
  }
}

async function updateOrderStage(req, res) {
  try {
    const { id } = req.params;
    const { newStage } = req.body;

    const order = await mockDb.getOmsOrder(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!STAGES.includes(newStage)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stage. Valid stages are: ' + STAGES.join(', '),
      });
    }

    const oldStage = order.stage;
    const timelineEntry = {
      timestamp: new Date().toISOString(),
      event: `Moved from ${oldStage} to ${newStage}`,
      stage: newStage,
    };

    if (!order.timeline) {
      order.timeline = [];
    }
    order.timeline.push(timelineEntry);

    const updatedOrder = await mockDb.updateOmsOrder(id, {
      stage: newStage,
      timeline: order.timeline,
    });

    return res.status(200).json({
      success: true,
      message: 'Order stage updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order stage:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order stage',
      error: error.message,
    });
  }
}

async function updateOrderPriority(req, res) {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (!['low', 'normal', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority. Valid values: low, normal, high, urgent',
      });
    }

    const order = await mockDb.getOmsOrder(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const updatedOrder = await mockDb.updateOmsOrder(id, { priority });

    return res.status(200).json({
      success: true,
      message: 'Order priority updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order priority:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order priority',
      error: error.message,
    });
  }
}

async function addOrderNote(req, res) {
  try {
    const { id } = req.params;
    const { note, isInternal } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'note is required',
      });
    }

    const order = await mockDb.getOmsOrder(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const noteEntry = {
      id: require('uuid').v4(),
      text: note,
      isInternal: isInternal === true,
      author: req.user.email || 'admin@print7.com',
      timestamp: new Date().toISOString(),
    };

    if (!order.notes) {
      order.notes = [];
    }
    order.notes.push(noteEntry);

    const updatedOrder = await mockDb.updateOmsOrder(id, { notes: order.notes });

    return res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: noteEntry,
    });
  } catch (error) {
    console.error('Error adding order note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message,
    });
  }
}

async function getOrderTimeline(req, res) {
  try {
    const { id } = req.params;

    const order = await mockDb.getOmsOrder(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const timeline = order.timeline || [];

    return res.status(200).json({
      success: true,
      message: 'Order timeline retrieved successfully',
      data: {
        orderId: id,
        timeline,
      },
    });
  } catch (error) {
    console.error('Error fetching order timeline:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve timeline',
      error: error.message,
    });
  }
}

async function getOmsStats(req, res) {
  try {
    await initializeOmsData();

    const stats = await mockDb.getOmsStats();

    return res.status(200).json({
      success: true,
      message: 'OMS statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching OMS stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message,
    });
  }
}

async function getPipeline(req, res) {
  try {
    await initializeOmsData();

    const stats = await mockDb.getOmsStats();
    const breakdown = stats.stageBreakdown || {};

    const pipeline = STAGES.map((stage) => ({
      stage,
      count: breakdown[stage] || 0,
    }));

    return res.status(200).json({
      success: true,
      message: 'Pipeline view retrieved successfully',
      data: {
        pipeline,
        total: stats.totalOrders,
      },
    });
  } catch (error) {
    console.error('Error fetching pipeline:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve pipeline',
      error: error.message,
    });
  }
}

async function assignOrder(req, res) {
  try {
    const { id } = req.params;
    const { staffMemberId, staffName } = req.body;

    if (!staffMemberId || !staffName) {
      return res.status(400).json({
        success: false,
        message: 'staffMemberId and staffName are required',
      });
    }

    const order = await mockDb.getOmsOrder(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const updatedOrder = await mockDb.updateOmsOrder(id, {
      assignedTo: {
        id: staffMemberId,
        name: staffName,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Order assigned successfully',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error assigning order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign order',
      error: error.message,
    });
  }
}

async function processRefund(req, res) {
  try {
    const { id } = req.params;
    const { refundAmount, reason } = req.body;

    const order = await mockDb.getOmsOrder(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!refundAmount || refundAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid refundAmount is required',
      });
    }

    const refund = {
      id: require('uuid').v4(),
      amount: refundAmount,
      reason: reason || 'Requested by customer',
      status: 'approved',
      processedAt: new Date().toISOString(),
    };

    const timelineEntry = {
      timestamp: new Date().toISOString(),
      event: `Refund processed: $${refundAmount}`,
      stage: 'Returns/Refunds',
    };

    if (!order.timeline) {
      order.timeline = [];
    }
    order.timeline.push(timelineEntry);

    const updatedOrder = await mockDb.updateOmsOrder(id, {
      stage: 'Returns/Refunds',
      status: 'refunded',
      refundAmount,
      refund,
      timeline: order.timeline,
    });

    return res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refund,
        order: updatedOrder,
      },
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message,
    });
  }
}

module.exports = {
  getAllOrders,
  getOrderDetail,
  updateOrderStage,
  updateOrderPriority,
  addOrderNote,
  getOrderTimeline,
  getOmsStats,
  getPipeline,
  assignOrder,
  processRefund,
};
