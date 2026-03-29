const mockDb = require('../data/mockDb');
const { getPaginationParams } = require('../utils/helpers');

// Utility function to mask card number
function maskCardNumber(cardNumber) {
  const last4 = cardNumber.slice(-4);
  return `****-****-****-${last4}`;
}

async function getPaymentCards(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    const cards = await mockDb.getUserPaymentCards(userId);

    // Mask card numbers before returning
    const maskedCards = cards.map((card) => ({
      ...card,
      cardNumber: maskCardNumber(card.cardNumber),
    }));

    return res.status(200).json({
      success: true,
      message: 'Payment cards retrieved successfully',
      data: {
        cards: maskedCards,
        count: maskedCards.length,
      },
    });
  } catch (error) {
    console.error('Error fetching payment cards:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment cards',
      error: error.message,
    });
  }
}

async function addPaymentCard(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { cardNumber, cardholderName, expiryMonth, expiryYear, cvv, cardType, isDefault } = req.body;

    if (!cardNumber || !cardholderName || !expiryMonth || !expiryYear) {
      return res.status(400).json({
        success: false,
        message: 'cardNumber, cardholderName, expiryMonth, and expiryYear are required',
      });
    }

    // Validate card format (mock validation)
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card number format',
      });
    }

    const cardData = {
      cardNumber,
      cardholderName,
      expiryMonth,
      expiryYear,
      cvv: '***', // Never store actual CVV
      cardType: cardType || 'visa',
      isDefault: isDefault === true,
      last4: cardNumber.slice(-4),
    };

    // If default, unset others
    if (isDefault) {
      const userCards = await mockDb.getUserPaymentCards(userId);
      for (const card of userCards) {
        await mockDb.updatePaymentCard(card.id, { isDefault: false });
      }
    }

    const card = await mockDb.addPaymentCard(userId, cardData);

    return res.status(201).json({
      success: true,
      message: 'Payment card added successfully',
      data: {
        ...card,
        cardNumber: maskCardNumber(card.cardNumber),
      },
    });
  } catch (error) {
    console.error('Error adding payment card:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add payment card',
      error: error.message,
    });
  }
}

async function updatePaymentCard(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;
    const { cardholderName, expiryMonth, expiryYear } = req.body;

    const card = await mockDb.getPaymentCard(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Payment card not found',
      });
    }

    if (card.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this card',
      });
    }

    const updates = {};
    if (cardholderName) updates.cardholderName = cardholderName;
    if (expiryMonth) updates.expiryMonth = expiryMonth;
    if (expiryYear) updates.expiryYear = expiryYear;

    const updatedCard = await mockDb.updatePaymentCard(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Payment card updated successfully',
      data: {
        ...updatedCard,
        cardNumber: maskCardNumber(updatedCard.cardNumber),
      },
    });
  } catch (error) {
    console.error('Error updating payment card:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update payment card',
      error: error.message,
    });
  }
}

async function deletePaymentCard(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const card = await mockDb.getPaymentCard(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Payment card not found',
      });
    }

    if (card.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this card',
      });
    }

    await mockDb.deletePaymentCard(id);

    return res.status(200).json({
      success: true,
      message: 'Payment card deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting payment card:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete payment card',
      error: error.message,
    });
  }
}

async function setDefaultCard(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const card = await mockDb.getPaymentCard(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Payment card not found',
      });
    }

    if (card.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this card',
      });
    }

    // Unset all other defaults
    const userCards = await mockDb.getUserPaymentCards(userId);
    for (const c of userCards) {
      await mockDb.updatePaymentCard(c.id, { isDefault: false });
    }

    const updatedCard = await mockDb.updatePaymentCard(id, { isDefault: true });

    return res.status(200).json({
      success: true,
      message: 'Default card updated successfully',
      data: {
        ...updatedCard,
        cardNumber: maskCardNumber(updatedCard.cardNumber),
      },
    });
  } catch (error) {
    console.error('Error setting default card:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set default card',
      error: error.message,
    });
  }
}

async function getWallets(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    const wallets = await mockDb.getUserWallets(userId);

    return res.status(200).json({
      success: true,
      message: 'Wallets retrieved successfully',
      data: {
        wallets,
        count: wallets.length,
      },
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve wallets',
      error: error.message,
    });
  }
}

async function linkWallet(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { walletType, walletEmail, isDefault } = req.body;

    if (!walletType || !walletEmail) {
      return res.status(400).json({
        success: false,
        message: 'walletType and walletEmail are required',
      });
    }

    const walletData = {
      walletType,
      walletEmail,
      isDefault: isDefault === true,
      verified: false,
    };

    // If default, unset others
    if (isDefault) {
      const userWallets = await mockDb.getUserWallets(userId);
      for (const wallet of userWallets) {
        await mockDb.updateWallet(wallet.id, { isDefault: false });
      }
    }

    const wallet = await mockDb.addWallet(userId, walletData);

    return res.status(201).json({
      success: true,
      message: 'Wallet linked successfully',
      data: wallet,
    });
  } catch (error) {
    console.error('Error linking wallet:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to link wallet',
      error: error.message,
    });
  }
}

async function unlinkWallet(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const wallet = await mockDb.getWallet(id);

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    if (wallet.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to unlink this wallet',
      });
    }

    await mockDb.deleteWallet(id);

    return res.status(200).json({
      success: true,
      message: 'Wallet unlinked successfully',
    });
  } catch (error) {
    console.error('Error unlinking wallet:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unlink wallet',
      error: error.message,
    });
  }
}

async function setDefaultWallet(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const wallet = await mockDb.getWallet(id);

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    if (wallet.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this wallet',
      });
    }

    // Unset all other defaults
    const userWallets = await mockDb.getUserWallets(userId);
    for (const w of userWallets) {
      await mockDb.updateWallet(w.id, { isDefault: false });
    }

    const updatedWallet = await mockDb.updateWallet(id, { isDefault: true });

    return res.status(200).json({
      success: true,
      message: 'Default wallet updated successfully',
      data: updatedWallet,
    });
  } catch (error) {
    console.error('Error setting default wallet:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set default wallet',
      error: error.message,
    });
  }
}

async function getPaymentMethods(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    const cards = await mockDb.getUserPaymentCards(userId);
    const wallets = await mockDb.getUserWallets(userId);

    const defaultCard = cards.find((c) => c.isDefault);
    const defaultWallet = wallets.find((w) => w.isDefault);

    return res.status(200).json({
      success: true,
      message: 'Payment methods retrieved successfully',
      data: {
        defaultPaymentMethod: 'card', // or 'wallet'
        defaultCard: defaultCard ? { ...defaultCard, cardNumber: maskCardNumber(defaultCard.cardNumber) } : null,
        defaultWallet,
      },
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment methods',
      error: error.message,
    });
  }
}

async function updatePaymentMethods(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { defaultPaymentMethod, defaultCardId, defaultWalletId } = req.body;

    if (!['card', 'wallet'].includes(defaultPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'defaultPaymentMethod must be "card" or "wallet"',
      });
    }

    if (defaultPaymentMethod === 'card' && defaultCardId) {
      const card = await mockDb.getPaymentCard(defaultCardId);
      if (!card || card.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Card not found',
        });
      }
      await setDefaultCard({ params: { id: defaultCardId }, user: req.user }, res);
      return;
    }

    if (defaultPaymentMethod === 'wallet' && defaultWalletId) {
      const wallet = await mockDb.getWallet(defaultWalletId);
      if (!wallet || wallet.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Wallet not found',
        });
      }
      await setDefaultWallet({ params: { id: defaultWalletId }, user: req.user }, res);
      return;
    }

    return res.status(200).json({
      success: true,
      message: 'Payment method preference updated',
      data: { defaultPaymentMethod },
    });
  } catch (error) {
    console.error('Error updating payment methods:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update payment methods',
      error: error.message,
    });
  }
}

async function processPayment(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { amount, orderId, paymentMethodId, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'orderId is required',
      });
    }

    // Mock payment processing
    const success = Math.random() > 0.1; // 90% success rate

    const transaction = {
      transactionId: require('uuid').v4(),
      orderId,
      amount: parseFloat(amount),
      currency: 'USD',
      status: success ? 'completed' : 'failed',
      paymentMethodId,
      description: description || 'Order payment',
      processedAt: new Date().toISOString(),
    };

    const savedTransaction = await mockDb.addTransaction(userId, transaction);

    const statusCode = success ? 201 : 400;
    const message = success ? 'Payment processed successfully' : 'Payment processing failed';

    return res.status(statusCode).json({
      success,
      message,
      data: savedTransaction,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message,
    });
  }
}

async function getTransactions(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { page, limit, offset } = getPaginationParams(req.query);
    const { status } = req.query;

    const filters = {};
    if (status) filters.status = status;

    const result = await mockDb.getUserTransactions(userId, limit, offset, filters);

    return res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions',
      error: error.message,
    });
  }
}

async function getTransactionDetail(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const transaction = await mockDb.getTransaction(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this transaction',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve transaction',
      error: error.message,
    });
  }
}

async function refundTransaction(req, res) {
  try {
    const { transactionId } = req.params;
    const userId = req.user.uid || req.user.id;
    const { reason } = req.body;

    const transaction = await mockDb.getTransaction(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to refund this transaction',
      });
    }

    if (transaction.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Transaction already refunded',
      });
    }

    const refund = {
      refundId: require('uuid').v4(),
      amount: transaction.amount,
      reason: reason || 'Customer requested',
      status: 'approved',
      refundedAt: new Date().toISOString(),
    };

    const updatedTransaction = await mockDb.updateTransaction(transactionId, {
      status: 'refunded',
      refund,
    });

    return res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refund,
        transaction: updatedTransaction,
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
  getPaymentCards,
  addPaymentCard,
  updatePaymentCard,
  deletePaymentCard,
  setDefaultCard,
  getWallets,
  linkWallet,
  unlinkWallet,
  setDefaultWallet,
  getPaymentMethods,
  updatePaymentMethods,
  processPayment,
  getTransactions,
  getTransactionDetail,
  refundTransaction,
};
