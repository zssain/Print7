const express = require('express');
const { validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');

const router = express.Router();

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
}

router.post(
  '/register',
  userValidation.register,
  validateRequest,
  userController.registerUser
);

router.post(
  '/login',
  userValidation.login,
  validateRequest,
  userController.loginUser
);

router.get('/profile', verifyToken, userController.getUserProfile);

router.put(
  '/profile',
  verifyToken,
  userValidation.updateProfile,
  validateRequest,
  userController.updateUserProfile
);

router.get('/admin/all', verifyToken, isAdmin, userController.getAllUsers);

router.put(
  '/:id/role',
  verifyToken,
  isAdmin,
  userController.updateUserRole
);

module.exports = router;
