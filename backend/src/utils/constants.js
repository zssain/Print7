const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

const PRODUCT_CATEGORIES = [
  'business-cards',
  'flyers',
  'banners',
  'posters',
  't-shirts',
  'mugs',
  'stickers',
  'signs',
  'brochures',
  'postcards',
  'labels',
  'caps',
];

const PRODUCT_MATERIALS = {
  'business-cards': ['standard', 'premium', 'matte', 'gloss'],
  'flyers': ['80gsm', '100gsm', '200gsm', '300gsm'],
  'banners': ['vinyl', 'canvas', 'fabric'],
  'posters': ['glossy', 'matte', 'satin'],
  't-shirts': ['100% cotton', 'cotton-polyester blend', 'organic cotton'],
  'mugs': ['ceramic', 'porcelain'],
  'stickers': ['vinyl', 'paper', 'waterproof'],
  'signs': ['corrugated plastic', 'foam board', 'aluminum'],
  'brochures': ['80gsm', '100gsm', '150gsm'],
  'postcards': ['standard', 'premium'],
  'labels': ['matte', 'gloss', 'clear'],
  'caps': ['cotton', 'polyester'],
};

const FILE_UPLOAD_LIMITS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'application/pdf',
  ],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'svg', 'pdf'],
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

module.exports = {
  ORDER_STATUS,
  PAYMENT_STATUS,
  USER_ROLES,
  PRODUCT_CATEGORIES,
  PRODUCT_MATERIALS,
  FILE_UPLOAD_LIMITS,
  HTTP_STATUS,
};
