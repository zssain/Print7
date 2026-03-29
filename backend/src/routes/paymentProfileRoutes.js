const express = require('express');
const paymentProfileController = require('../controllers/paymentProfileController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All payment routes require authentication
router.use(verifyToken);

router.get('/cards', paymentProfileController.getPaymentCards);
router.post('/cards', paymentProfileController.addPaymentCard);
router.put('/cards/:id', paymentProfileController.updatePaymentCard);
router.delete('/cards/:id', paymentProfileController.deletePaymentCard);
router.put('/cards/:id/default', paymentProfileController.setDefaultCard);

router.get('/wallets', paymentProfileController.getWallets);
router.post('/wallets/link', paymentProfileController.linkWallet);
router.delete('/wallets/:id', paymentProfileController.unlinkWallet);
router.put('/wallets/:id/default', paymentProfileController.setDefaultWallet);

router.get('/methods', paymentProfileController.getPaymentMethods);
router.put('/methods', paymentProfileController.updatePaymentMethods);

router.post('/process', paymentProfileController.processPayment);
router.get('/transactions', paymentProfileController.getTransactions);
router.get('/transactions/:id', paymentProfileController.getTransactionDetail);
router.post('/refund/:transactionId', paymentProfileController.refundTransaction);

module.exports = router;
