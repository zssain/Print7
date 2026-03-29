const express = require('express');
const accountController = require('../controllers/accountController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All account routes require authentication
router.use(verifyToken);

router.get('/profile', accountController.getProfile);
router.put('/profile', accountController.updateProfile);

router.get('/addresses', accountController.getAddresses);
router.post('/addresses', accountController.addAddress);
router.put('/addresses/:id', accountController.updateAddress);
router.delete('/addresses/:id', accountController.deleteAddress);
router.put('/addresses/:id/default', accountController.setDefaultAddress);

router.get('/activity', accountController.getActivity);
router.post('/change-password', accountController.changePassword);
router.put('/preferences', accountController.updatePreferences);
router.post('/export-data', accountController.exportData);
router.delete('/', accountController.deleteAccount);

module.exports = router;
