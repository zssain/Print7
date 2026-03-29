const { v4: uuidv4 } = require('uuid');

function generateOrderId() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

function generateDesignId() {
  return `DESIGN-${uuidv4()}`;
}

function generateCartId() {
  return uuidv4();
}

function formatResponse(success, message, data = null, statusCode = 200) {
  return {
    success,
    message,
    data,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}

function calculateOrderTotal(items) {
  return items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const rush = item.rushOrder ? itemTotal * 0.15 : 0;
    return total + itemTotal + rush;
  }, 0);
}

function calculateShippingCost(total, expedited = false) {
  if (total > 100) return 0;
  if (total > 50) return expedited ? 15 : 8;
  return expedited ? 20 : 12;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

function sanitizeObject(obj) {
  const sanitized = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      sanitized[key] = obj[key];
    }
  });
  return sanitized;
}

function getPaginationParams(query) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
}

function formatProductResponse(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    images: product.images || [],
    sizes: product.sizes || [],
    materials: product.materials || [],
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    inStock: product.inStock !== false,
    featured: product.featured || false,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function formatOrderResponse(order) {
  return {
    id: order.id,
    userId: order.userId,
    items: order.items || [],
    subtotal: order.subtotal,
    shipping: order.shipping || 0,
    tax: order.tax || 0,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

function formatUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role || 'user',
    address: user.address,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  generateOrderId,
  generateDesignId,
  generateCartId,
  formatResponse,
  calculateOrderTotal,
  calculateShippingCost,
  validateEmail,
  validatePhone,
  sanitizeObject,
  getPaginationParams,
  formatProductResponse,
  formatOrderResponse,
  formatUserResponse,
};
