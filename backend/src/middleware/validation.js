const { body, query, param } = require('express-validator');
const { PRODUCT_CATEGORIES } = require('../utils/constants');
const { validateEmail, validatePhone } = require('../utils/helpers');

const productValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('category')
      .trim()
      .isIn(PRODUCT_CATEGORIES)
      .withMessage('Invalid category'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('sizes').optional().isArray().withMessage('Sizes must be an array'),
    body('materials').optional().isArray().withMessage('Materials must be an array'),
    body('inStock').optional().isBoolean().withMessage('inStock must be boolean'),
    body('featured').optional().isBoolean().withMessage('featured must be boolean'),
  ],
  update: [
    body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('category').optional().trim().isIn(PRODUCT_CATEGORIES).withMessage('Invalid category'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('sizes').optional().isArray().withMessage('Sizes must be an array'),
    body('materials').optional().isArray().withMessage('Materials must be an array'),
    body('inStock').optional().isBoolean().withMessage('inStock must be boolean'),
    body('featured').optional().isBoolean().withMessage('featured must be boolean'),
  ],
};

const orderValidation = {
  create: [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId').trim().notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('shippingAddress.street')
      .trim()
      .notEmpty()
      .withMessage('Street is required'),
    body('shippingAddress.city')
      .trim()
      .notEmpty()
      .withMessage('City is required'),
    body('shippingAddress.state')
      .trim()
      .notEmpty()
      .withMessage('State is required'),
    body('shippingAddress.zipCode')
      .trim()
      .notEmpty()
      .withMessage('ZIP code is required'),
    body('shippingAddress.country')
      .trim()
      .notEmpty()
      .withMessage('Country is required'),
  ],
};

const userValidation = {
  register: [
    body('email')
      .trim()
      .custom((value) => {
        if (!validateEmail(value)) {
          throw new Error('Invalid email address');
        }
        return true;
      }),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
  ],
  login: [
    body('email')
      .trim()
      .custom((value) => {
        if (!validateEmail(value)) {
          throw new Error('Invalid email address');
        }
        return true;
      }),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  updateProfile: [
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('phone')
      .optional()
      .custom((value) => {
        if (value && !validatePhone(value)) {
          throw new Error('Invalid phone number');
        }
        return true;
      }),
  ],
};

const designValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Design name is required'),
    body('content').notEmpty().withMessage('Design content is required'),
    body('templateType')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Template type cannot be empty'),
  ],
  update: [
    body('name').optional().trim().notEmpty().withMessage('Design name cannot be empty'),
    body('content').optional().notEmpty().withMessage('Design content cannot be empty'),
    body('templateType')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Template type cannot be empty'),
  ],
};

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query cannot be empty'),
  ...paginationValidation,
];

const idParamValidation = [
  param('id').trim().notEmpty().withMessage('ID is required'),
];

module.exports = {
  productValidation,
  orderValidation,
  userValidation,
  designValidation,
  paginationValidation,
  searchValidation,
  idParamValidation,
};
