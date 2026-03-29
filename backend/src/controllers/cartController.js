const { db, isFirebaseInitialized } = require('../config/firebase');
const mockDb = require('../data/mockDb');
const { HTTP_STATUS } = require('../utils/constants');

async function getCart(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    let cart;
    if (isFirebaseInitialized) {
      const doc = await db.collection('carts').doc(userId).get();
      if (!doc.exists) {
        cart = {
          userId,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        cart = { id: doc.id, ...doc.data() };
      }
    } else {
      cart = await mockDb.getCart(userId);
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve cart',
      error: error.message,
    });
  }
}

async function addToCart(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { productId, quantity, price, selectedSize, selectedMaterial, name } =
      req.body;

    if (!productId || !quantity || !price) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Product ID, quantity, and price are required',
      });
    }

    const item = {
      productId,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      selectedSize: selectedSize || '',
      selectedMaterial: selectedMaterial || '',
      name: name || '',
    };

    let cart;
    if (isFirebaseInitialized) {
      let cartDoc = await db.collection('carts').doc(userId).get();

      if (!cartDoc.exists) {
        cart = {
          userId,
          items: [item],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await db.collection('carts').doc(userId).set(cart);
      } else {
        const existingCart = cartDoc.data();
        const existingItem = existingCart.items.find(
          (i) =>
            i.productId === productId &&
            i.selectedMaterial === item.selectedMaterial &&
            i.selectedSize === item.selectedSize
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          existingCart.items.push(item);
        }

        existingCart.updatedAt = new Date().toISOString();
        await db.collection('carts').doc(userId).update({
          items: existingCart.items,
          updatedAt: existingCart.updatedAt,
        });
        cart = existingCart;
      }
    } else {
      cart = await mockDb.addToCart(userId, item);
    }

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message,
    });
  }
}

async function updateCartItem(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Quantity is required',
      });
    }

    if (quantity < 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Quantity must be a positive number',
      });
    }

    let cart;
    if (isFirebaseInitialized) {
      const doc = await db.collection('carts').doc(userId).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Cart not found',
        });
      }

      const existingCart = doc.data();
      const item = existingCart.items.find((i) => i.id === itemId);

      if (!item) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Item not found in cart',
        });
      }

      item.quantity = parseInt(quantity);
      existingCart.updatedAt = new Date().toISOString();

      await db.collection('carts').doc(userId).update({
        items: existingCart.items,
        updatedAt: existingCart.updatedAt,
      });

      cart = existingCart;
    } else {
      cart = await mockDb.updateCartItem(userId, itemId, { quantity });
      if (!cart) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Cart not found',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message,
    });
  }
}

async function removeFromCart(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { itemId } = req.params;

    let cart;
    if (isFirebaseInitialized) {
      const doc = await db.collection('carts').doc(userId).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Cart not found',
        });
      }

      const existingCart = doc.data();
      const itemIndex = existingCart.items.findIndex((i) => i.id === itemId);

      if (itemIndex === -1) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Item not found in cart',
        });
      }

      existingCart.items.splice(itemIndex, 1);
      existingCart.updatedAt = new Date().toISOString();

      await db.collection('carts').doc(userId).update({
        items: existingCart.items,
        updatedAt: existingCart.updatedAt,
      });

      cart = existingCart;
    } else {
      cart = await mockDb.removeFromCart(userId, itemId);
      if (!cart) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Cart not found',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message,
    });
  }
}

async function clearCart(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    let cart;
    if (isFirebaseInitialized) {
      await db.collection('carts').doc(userId).set({
        userId,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      cart = {
        userId,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      cart = await mockDb.clearCart(userId);
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message,
    });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
