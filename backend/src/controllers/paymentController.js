const { db, isFirebaseInitialized } = require('../config/firebase');
const mockDb = require('../data/mockDb');
const { v4: uuidv4 } = require('uuid');
const { HTTP_STATUS, PAYMENT_STATUS } = require('../utils/constants');

async function processPayment(req, res) {
  try {
    const { orderId, amount, paymentMethod, cardLastFour } = req.body;

    if (!orderId || !amount) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Order ID and amount are required',
      });
    }

    const paymentData = {
      orderId,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod || 'card',
      status: PAYMENT_STATUS.COMPLETED,
      cardLastFour: cardLastFour || '****',
      transactionId: `TXN-${uuidv4()}`,
    };

    let payment;
    if (isFirebaseInitialized) {
      const ref = await db.collection('payments').add({
        ...paymentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      payment = { id: ref.id, ...paymentData };
    } else {
      payment = await mockDb.addPaymentRecord(paymentData);
    }

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Payment processed successfully (Mock)',
      data: payment,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message,
    });
  }
}

async function verifyPayment(req, res) {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Transaction ID is required',
      });
    }

    let payment;
    if (isFirebaseInitialized) {
      const snapshot = await db
        .collection('payments')
        .where('transactionId', '==', transactionId)
        .get();

      if (snapshot.empty) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Payment not found',
        });
      }

      const doc = snapshot.docs[0];
      payment = { id: doc.id, ...doc.data() };
    } else {
      payment = Object.values(mockDb.paymentRecords).find(
        (p) => p.transactionId === transactionId
      );

      if (!payment) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Payment not found',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        ...payment,
        verified: true,
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
}

async function getPaymentStatus(req, res) {
  try {
    const { orderId } = req.params;

    let payment;
    if (isFirebaseInitialized) {
      const snapshot = await db
        .collection('payments')
        .where('orderId', '==', orderId)
        .get();

      if (snapshot.empty) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Payment not found for this order',
        });
      }

      const doc = snapshot.docs[0];
      payment = { id: doc.id, ...doc.data() };
    } else {
      payment = await mockDb.getPaymentByOrderId(orderId);

      if (!payment) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Payment not found for this order',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Payment status retrieved successfully',
      data: payment,
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve payment status',
      error: error.message,
    });
  }
}

module.exports = {
  processPayment,
  verifyPayment,
  getPaymentStatus,
};
