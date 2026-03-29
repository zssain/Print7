const { v4: uuidv4 } = require('uuid');
const { generateOrderId, generateDesignId } = require('../utils/helpers');

const mockDb = {
  users: {},
  products: {},
  orders: {},
  carts: {},
  designs: {},
  paymentRecords: {},
  inventory: [],
  profiles: {},
  addresses: [],
  activityLogs: [],
  omsOrders: [],
  paymentCards: [],
  wallets: [],
  transactions: [],
  marketplaceDesigns: [],
  designLibrary: [],
  designFolders: [],
  designReviews: [],
  purchasedDesigns: [],

  // User operations
  async addUser(userId, userData) {
    this.users[userId] = {
      id: userId,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.users[userId];
  },

  async getUser(userId) {
    return this.users[userId] || null;
  },

  async getUserByEmail(email) {
    return Object.values(this.users).find((u) => u.email === email) || null;
  },

  async updateUser(userId, updates) {
    if (!this.users[userId]) return null;
    this.users[userId] = {
      ...this.users[userId],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.users[userId];
  },

  async getAllUsers(limit = 50, offset = 0) {
    const users = Object.values(this.users);
    const total = users.length;
    const data = users.slice(offset, offset + limit);
    return { data, total };
  },

  // Product operations
  async addProduct(productData) {
    const id = productData.id || uuidv4();
    this.products[id] = {
      id,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.products[id];
  },

  async getProduct(productId) {
    return this.products[productId] || null;
  },

  async getAllProducts(limit = 20, offset = 0, filters = {}) {
    let products = Object.values(this.products);

    if (filters.category) {
      products = products.filter((p) => p.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.featured === true) {
      products = products.filter((p) => p.featured === true);
    }

    if (filters.sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'newest') {
      products.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (filters.sort === 'rating') {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const total = products.length;
    const data = products.slice(offset, offset + limit);
    return { data, total };
  },

  async updateProduct(productId, updates) {
    if (!this.products[productId]) return null;
    this.products[productId] = {
      ...this.products[productId],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.products[productId];
  },

  async deleteProduct(productId) {
    delete this.products[productId];
    return true;
  },

  // Order operations
  async addOrder(orderData) {
    const id = orderData.id || generateOrderId();
    this.orders[id] = {
      id,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.orders[id];
  },

  async getOrder(orderId) {
    return this.orders[orderId] || null;
  },

  async getUserOrders(userId, limit = 20, offset = 0) {
    const orders = Object.values(this.orders).filter(
      (o) => o.userId === userId
    );
    const total = orders.length;
    const data = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit);
    return { data, total };
  },

  async getAllOrders(limit = 50, offset = 0) {
    const orders = Object.values(this.orders);
    const total = orders.length;
    const data = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit);
    return { data, total };
  },

  async updateOrder(orderId, updates) {
    if (!this.orders[orderId]) return null;
    this.orders[orderId] = {
      ...this.orders[orderId],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.orders[orderId];
  },

  async getOrderStats() {
    const orders = Object.values(this.orders);
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const statuses = {};

    orders.forEach((o) => {
      statuses[o.status] = (statuses[o.status] || 0) + 1;
    });

    return {
      totalOrders,
      totalRevenue,
      statuses,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  },

  // Cart operations
  async getCart(userId) {
    if (!this.carts[userId]) {
      this.carts[userId] = {
        userId,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return this.carts[userId];
  },

  async addToCart(userId, item) {
    if (!this.carts[userId]) {
      this.carts[userId] = {
        userId,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const existingItem = this.carts[userId].items.find(
      (i) =>
        i.productId === item.productId &&
        i.selectedMaterial === item.selectedMaterial &&
        i.selectedSize === item.selectedSize
    );

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      this.carts[userId].items.push({
        ...item,
        id: uuidv4(),
        quantity: item.quantity || 1,
      });
    }

    this.carts[userId].updatedAt = new Date().toISOString();
    return this.carts[userId];
  },

  async updateCartItem(userId, itemId, updates) {
    const cart = this.carts[userId];
    if (!cart) return null;

    const item = cart.items.find((i) => i.id === itemId);
    if (item) {
      Object.assign(item, updates);
      cart.updatedAt = new Date().toISOString();
    }

    return cart;
  },

  async removeFromCart(userId, itemId) {
    const cart = this.carts[userId];
    if (!cart) return null;

    cart.items = cart.items.filter((i) => i.id !== itemId);
    cart.updatedAt = new Date().toISOString();
    return cart;
  },

  async clearCart(userId) {
    if (!this.carts[userId]) {
      this.carts[userId] = { items: [], updatedAt: new Date().toISOString() };
    } else {
      this.carts[userId].items = [];
      this.carts[userId].updatedAt = new Date().toISOString();
    }
    return this.carts[userId];
  },

  // Design operations
  async addDesign(userId, designData) {
    const id = designData.id || generateDesignId();
    this.designs[id] = {
      id,
      userId,
      ...designData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.designs[id];
  },

  async getDesign(designId) {
    return this.designs[designId] || null;
  },

  async getUserDesigns(userId, limit = 20, offset = 0) {
    const designs = Object.values(this.designs).filter(
      (d) => d.userId === userId
    );
    const total = designs.length;
    const data = designs
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit);
    return { data, total };
  },

  async updateDesign(designId, updates) {
    if (!this.designs[designId]) return null;
    this.designs[designId] = {
      ...this.designs[designId],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.designs[designId];
  },

  async deleteDesign(designId) {
    delete this.designs[designId];
    return true;
  },

  // Payment operations
  async addPaymentRecord(paymentData) {
    const id = uuidv4();
    this.paymentRecords[id] = {
      id,
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.paymentRecords[id];
  },

  async getPaymentRecord(paymentId) {
    return this.paymentRecords[paymentId] || null;
  },

  async getPaymentByOrderId(orderId) {
    return (
      Object.values(this.paymentRecords).find(
        (p) => p.orderId === orderId
      ) || null
    );
  },

  async updatePaymentRecord(paymentId, updates) {
    if (!this.paymentRecords[paymentId]) return null;
    this.paymentRecords[paymentId] = {
      ...this.paymentRecords[paymentId],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.paymentRecords[paymentId];
  },

  // Inventory operations
  async addInventoryItem(userId, itemData) {
    const id = itemData.id || uuidv4();
    const item = {
      id,
      userId,
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.inventory.push(item);
    return item;
  },

  async getInventoryItem(id) {
    return this.inventory.find((i) => i.id === id) || null;
  },

  async getUserInventory(userId, limit = 20, offset = 0) {
    const items = this.inventory.filter((i) => i.userId === userId);
    const total = items.length;
    const data = items
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit);
    return { data, total };
  },

  async updateInventoryItem(id, updates) {
    const item = this.inventory.find((i) => i.id === id);
    if (!item) return null;
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    return item;
  },

  async deleteInventoryItem(id) {
    const index = this.inventory.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.inventory.splice(index, 1);
    return true;
  },

  async getInventoryAlerts(userId) {
    return this.inventory.filter(
      (i) => i.userId === userId && i.quantity <= (i.threshold || 5)
    );
  },

  // Account operations
  async addProfile(userId, profileData) {
    this.profiles[userId] = {
      userId,
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.profiles[userId];
  },

  async getProfile(userId) {
    return this.profiles[userId] || null;
  },

  async updateProfile(userId, updates) {
    if (!this.profiles[userId]) return null;
    this.profiles[userId] = {
      ...this.profiles[userId],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.profiles[userId];
  },

  async addAddress(userId, addressData) {
    const id = addressData.id || uuidv4();
    const address = {
      id,
      userId,
      ...addressData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.addresses.push(address);
    return address;
  },

  async getAddress(id) {
    return this.addresses.find((a) => a.id === id) || null;
  },

  async getUserAddresses(userId) {
    return this.addresses.filter((a) => a.userId === userId);
  },

  async updateAddress(id, updates) {
    const address = this.addresses.find((a) => a.id === id);
    if (!address) return null;
    Object.assign(address, updates, { updatedAt: new Date().toISOString() });
    return address;
  },

  async deleteAddress(id) {
    const index = this.addresses.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.addresses.splice(index, 1);
    return true;
  },

  async addActivityLog(userId, logData) {
    const log = {
      id: uuidv4(),
      userId,
      ...logData,
      timestamp: new Date().toISOString(),
    };
    this.activityLogs.push(log);
    return log;
  },

  async getUserActivityLogs(userId, limit = 20, offset = 0) {
    const logs = this.activityLogs.filter((l) => l.userId === userId);
    const total = logs.length;
    const data = logs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(offset, offset + limit);
    return { data, total };
  },

  // OMS operations
  async addOmsOrder(orderData) {
    const id = orderData.id || generateOrderId();
    const order = {
      id,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.omsOrders.push(order);
    return order;
  },

  async getOmsOrder(id) {
    return this.omsOrders.find((o) => o.id === id) || null;
  },

  async getAllOmsOrders(limit = 50, offset = 0, filters = {}) {
    let orders = [...this.omsOrders];

    if (filters.stage) {
      orders = orders.filter((o) => o.stage === filters.stage);
    }

    if (filters.status) {
      orders = orders.filter((o) => o.status === filters.status);
    }

    const total = orders.length;
    const data = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit);
    return { data, total };
  },

  async updateOmsOrder(id, updates) {
    const order = this.omsOrders.find((o) => o.id === id);
    if (!order) return null;
    Object.assign(order, updates, { updatedAt: new Date().toISOString() });
    return order;
  },

  async getOmsStats() {
    const stages = {};
    let totalProcessingTime = 0;
    let processingCount = 0;

    this.omsOrders.forEach((o) => {
      stages[o.stage] = (stages[o.stage] || 0) + 1;
      if (o.completedAt) {
        const time =
          new Date(o.completedAt) - new Date(o.createdAt);
        totalProcessingTime += time;
        processingCount++;
      }
    });

    return {
      totalOrders: this.omsOrders.length,
      stageBreakdown: stages,
      avgProcessingTimeMs: processingCount > 0 ? totalProcessingTime / processingCount : 0,
    };
  },

  // Payment Card operations
  async addPaymentCard(userId, cardData) {
    const id = cardData.id || uuidv4();
    const card = {
      id,
      userId,
      ...cardData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.paymentCards.push(card);
    return card;
  },

  async getPaymentCard(id) {
    return this.paymentCards.find((c) => c.id === id) || null;
  },

  async getUserPaymentCards(userId) {
    return this.paymentCards.filter((c) => c.userId === userId);
  },

  async updatePaymentCard(id, updates) {
    const card = this.paymentCards.find((c) => c.id === id);
    if (!card) return null;
    Object.assign(card, updates, { updatedAt: new Date().toISOString() });
    return card;
  },

  async deletePaymentCard(id) {
    const index = this.paymentCards.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.paymentCards.splice(index, 1);
    return true;
  },

  // Wallet operations
  async addWallet(userId, walletData) {
    const id = walletData.id || uuidv4();
    const wallet = {
      id,
      userId,
      ...walletData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.wallets.push(wallet);
    return wallet;
  },

  async getWallet(id) {
    return this.wallets.find((w) => w.id === id) || null;
  },

  async getUserWallets(userId) {
    return this.wallets.filter((w) => w.userId === userId);
  },

  async updateWallet(id, updates) {
    const wallet = this.wallets.find((w) => w.id === id);
    if (!wallet) return null;
    Object.assign(wallet, updates, { updatedAt: new Date().toISOString() });
    return wallet;
  },

  async deleteWallet(id) {
    const index = this.wallets.findIndex((w) => w.id === id);
    if (index === -1) return false;
    this.wallets.splice(index, 1);
    return true;
  },

  // Transaction operations
  async addTransaction(userId, transactionData) {
    const id = transactionData.id || uuidv4();
    const transaction = {
      id,
      userId,
      ...transactionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.transactions.push(transaction);
    return transaction;
  },

  async getTransaction(id) {
    return this.transactions.find((t) => t.id === id) || null;
  },

  async getUserTransactions(userId, limit = 20, offset = 0, filters = {}) {
    let transactions = this.transactions.filter((t) => t.userId === userId);

    if (filters.status) {
      transactions = transactions.filter((t) => t.status === filters.status);
    }

    const total = transactions.length;
    const data = transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit);
    return { data, total };
  },

  async updateTransaction(id, updates) {
    const transaction = this.transactions.find((t) => t.id === id);
    if (!transaction) return null;
    Object.assign(transaction, updates, { updatedAt: new Date().toISOString() });
    return transaction;
  },

  // Marketplace Design operations
  async addMarketplaceDesign(designData) {
    const id = designData.id || generateDesignId();
    const design = {
      id,
      ...designData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.marketplaceDesigns.push(design);
    return design;
  },

  async getMarketplaceDesign(id) {
    return this.marketplaceDesigns.find((d) => d.id === id) || null;
  },

  async getAllMarketplaceDesigns(limit = 20, offset = 0, filters = {}) {
    let designs = [...this.marketplaceDesigns];

    if (filters.category) {
      designs = designs.filter((d) => d.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      designs = designs.filter((d) => d.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      designs = designs.filter((d) => d.price <= filters.maxPrice);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      designs = designs.filter(
        (d) =>
          d.name.toLowerCase().includes(searchLower) ||
          d.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.sort === 'price-asc') {
      designs.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      designs.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'newest') {
      designs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === 'rating') {
      designs.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const total = designs.length;
    const data = designs.slice(offset, offset + limit);
    return { data, total };
  },

  async updateMarketplaceDesign(id, updates) {
    const design = this.marketplaceDesigns.find((d) => d.id === id);
    if (!design) return null;
    Object.assign(design, updates, { updatedAt: new Date().toISOString() });
    return design;
  },

  // Design Library operations
  async addDesignLibraryItem(userId, designData) {
    const id = designData.id || generateDesignId();
    const design = {
      id,
      userId,
      ...designData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.designLibrary.push(design);
    return design;
  },

  async getDesignLibraryItem(id) {
    return this.designLibrary.find((d) => d.id === id) || null;
  },

  async getUserDesignLibrary(userId, limit = 20, offset = 0) {
    const designs = this.designLibrary.filter((d) => d.userId === userId);
    const total = designs.length;
    const data = designs
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit);
    return { data, total };
  },

  async updateDesignLibraryItem(id, updates) {
    const design = this.designLibrary.find((d) => d.id === id);
    if (!design) return null;
    Object.assign(design, updates, { updatedAt: new Date().toISOString() });
    return design;
  },

  async deleteDesignLibraryItem(id) {
    const index = this.designLibrary.findIndex((d) => d.id === id);
    if (index === -1) return false;
    this.designLibrary.splice(index, 1);
    return true;
  },

  // Design Folder operations
  async addDesignFolder(userId, folderData) {
    const id = folderData.id || uuidv4();
    const folder = {
      id,
      userId,
      ...folderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.designFolders.push(folder);
    return folder;
  },

  async getDesignFolder(id) {
    return this.designFolders.find((f) => f.id === id) || null;
  },

  async getUserDesignFolders(userId) {
    return this.designFolders.filter((f) => f.userId === userId);
  },

  async updateDesignFolder(id, updates) {
    const folder = this.designFolders.find((f) => f.id === id);
    if (!folder) return null;
    Object.assign(folder, updates, { updatedAt: new Date().toISOString() });
    return folder;
  },

  async deleteDesignFolder(id) {
    const index = this.designFolders.findIndex((f) => f.id === id);
    if (index === -1) return false;
    this.designFolders.splice(index, 1);
    return true;
  },

  // Design Review operations
  async addDesignReview(designId, reviewData) {
    const id = reviewData.id || uuidv4();
    const review = {
      id,
      designId,
      ...reviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.designReviews.push(review);
    return review;
  },

  async getDesignReviews(designId) {
    return this.designReviews.filter((r) => r.designId === designId);
  },

  async addPurchasedDesign(userId, designId) {
    const purchase = {
      id: uuidv4(),
      userId,
      designId,
      purchasedAt: new Date().toISOString(),
    };
    this.purchasedDesigns.push(purchase);
    return purchase;
  },

  async getUserPurchasedDesigns(userId) {
    return this.purchasedDesigns.filter((p) => p.userId === userId);
  },
};

module.exports = mockDb;
