const express = require('express');
const { validationResult } = require('express-validator');
const designController = require('../controllers/designController');
const { verifyToken } = require('../middleware/auth');
const { designValidation, paginationValidation } = require('../middleware/validation');

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
  '/',
  verifyToken,
  designValidation.create,
  validateRequest,
  designController.saveDesign
);

router.get('/', verifyToken, paginationValidation, validateRequest, designController.getUserDesigns);

router.get('/:id', designController.getDesignById);

router.put(
  '/:id',
  verifyToken,
  designValidation.update,
  validateRequest,
  designController.updateDesign
);

router.delete('/:id', verifyToken, designController.deleteDesign);

module.exports = router;
