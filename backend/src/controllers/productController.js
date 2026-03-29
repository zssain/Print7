const { db, isFirebaseInitialized } = require('../config/firebase');
const mockDb = require('../data/mockDb');
const {
  formatResponse,
  getPaginationParams,
  formatProductResponse,
} = require('../utils/helpers');
const { HTTP_STATUS } = require('../utils/constants');

const getDb = () => (isFirebaseInitialized ? db : mockDb);

async function getAllProducts(req, res) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { category, minPrice, maxPrice, search, sort, featured } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (search) filters.search = search;
    if (sort) filters.sort = sort;
    if (featured === 'true') filters.featured = true;

    let products = [];
    let total = 0;

    if (isFirebaseInitialized) {
      let query = db.collection('products');

      if (category) {
        query = query.where('category', '==', category);
      }

      if (minPrice) {
        query = query.where('price', '>=', parseFloat(minPrice));
      }

      if (maxPrice) {
        query = query.where('price', '<=', parseFloat(maxPrice));
      }

      if (featured === 'true') {
        query = query.where('featured', '==', true);
      }

      const snapshot = await query.get();
      const allProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (search) {
        const searchLower = search.toLowerCase();
        products = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
      } else {
        products = allProducts;
      }

      if (sort === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'newest') {
        products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (sort === 'rating') {
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      total = products.length;
      products = products.slice(offset, offset + limit);
    } else {
      const result = await mockDb.getAllProducts(limit, offset, filters);
      products = result.data;
      total = result.total;
    }

    const formattedProducts = products.map(formatProductResponse);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products: formattedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;

    let product;
    if (isFirebaseInitialized) {
      const doc = await db.collection('products').doc(id).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Product not found',
        });
      }
      product = { id: doc.id, ...doc.data() };
    } else {
      product = await mockDb.getProduct(id);
      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Product not found',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product retrieved successfully',
      data: formatProductResponse(product),
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message,
    });
  }
}

async function getProductsByCategory(req, res) {
  try {
    const { category } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);

    let products = [];
    let total = 0;

    if (isFirebaseInitialized) {
      const snapshot = await db
        .collection('products')
        .where('category', '==', category)
        .get();

      const allProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      total = allProducts.length;
      products = allProducts.slice(offset, offset + limit);
    } else {
      const result = await mockDb.getAllProducts(limit, offset, { category });
      products = result.data;
      total = result.total;
    }

    const formattedProducts = products.map(formatProductResponse);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        category,
        products: formattedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
}

async function searchProducts(req, res) {
  try {
    const { q } = req.query;
    const { page, limit, offset } = getPaginationParams(req.query);

    if (!q) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Search query is required',
      });
    }

    let products = [];
    let total = 0;

    if (isFirebaseInitialized) {
      const snapshot = await db.collection('products').get();
      const allProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const searchLower = q.toLowerCase();
      products = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );

      total = products.length;
      products = products.slice(offset, offset + limit);
    } else {
      const result = await mockDb.getAllProducts(limit, offset, {
        search: q,
      });
      products = result.data;
      total = result.total;
    }

    const formattedProducts = products.map(formatProductResponse);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Search completed successfully',
      data: {
        query: q,
        products: formattedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    });
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, category, price, sizes, materials, inStock, featured, images } = req.body;

    const productData = {
      name,
      description,
      category,
      price: parseFloat(price),
      sizes: sizes || [],
      materials: materials || [],
      images: images || [],
      inStock: inStock !== false,
      featured: featured === true,
      rating: 0,
      reviewCount: 0,
    };

    let product;
    if (isFirebaseInitialized) {
      const ref = await db.collection('products').add({
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      product = { id: ref.id, ...productData };
    } else {
      product = await mockDb.addProduct(productData);
    }

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Product created successfully',
      data: formatProductResponse(product),
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.price !== undefined) {
      updates.price = parseFloat(updates.price);
    }

    updates.updatedAt = new Date().toISOString();

    let product;
    if (isFirebaseInitialized) {
      const doc = await db.collection('products').doc(id).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Product not found',
        });
      }
      await db.collection('products').doc(id).update(updates);
      const updatedDoc = await db.collection('products').doc(id).get();
      product = { id: updatedDoc.id, ...updatedDoc.data() };
    } else {
      product = await mockDb.updateProduct(id, updates);
      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Product not found',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product updated successfully',
      data: formatProductResponse(product),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (isFirebaseInitialized) {
      await db.collection('products').doc(id).delete();
    } else {
      await mockDb.deleteProduct(id);
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
