const { db, isFirebaseInitialized } = require('../config/firebase');
const mockDb = require('../data/mockDb');
const {
  getPaginationParams,
} = require('../utils/helpers');
const { HTTP_STATUS } = require('../utils/constants');

async function saveDesign(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { name, content, templateType, category, thumbnail } = req.body;

    if (!name || !content) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Design name and content are required',
      });
    }

    const designData = {
      userId,
      name,
      content,
      templateType: templateType || 'custom',
      category: category || 'general',
      thumbnail: thumbnail || '',
    };

    let design;
    if (isFirebaseInitialized) {
      const ref = await db.collection('designs').add({
        ...designData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      design = { id: ref.id, ...designData };
    } else {
      design = await mockDb.addDesign(userId, designData);
    }

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Design saved successfully',
      data: design,
    });
  } catch (error) {
    console.error('Error saving design:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to save design',
      error: error.message,
    });
  }
}

async function getUserDesigns(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { page, limit, offset } = getPaginationParams(req.query);

    let designs = [];
    let total = 0;

    if (isFirebaseInitialized) {
      const snapshot = await db
        .collection('designs')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const allDesigns = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      total = allDesigns.length;
      designs = allDesigns.slice(offset, offset + limit);
    } else {
      const result = await mockDb.getUserDesigns(userId, limit, offset);
      designs = result.data;
      total = result.total;
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'User designs retrieved successfully',
      data: {
        designs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching user designs:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve designs',
      error: error.message,
    });
  }
}

async function getDesignById(req, res) {
  try {
    const { id } = req.params;

    let design;
    if (isFirebaseInitialized) {
      const doc = await db.collection('designs').doc(id).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Design not found',
        });
      }
      design = { id: doc.id, ...doc.data() };
    } else {
      design = await mockDb.getDesign(id);
      if (!design) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Design not found',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Design retrieved successfully',
      data: design,
    });
  } catch (error) {
    console.error('Error fetching design:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve design',
      error: error.message,
    });
  }
}

async function updateDesign(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;
    const updates = req.body;

    updates.updatedAt = new Date().toISOString();

    let design;
    if (isFirebaseInitialized) {
      const doc = await db.collection('designs').doc(id).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Design not found',
        });
      }

      const existingDesign = doc.data();
      if (existingDesign.userId !== userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'You do not have permission to update this design',
        });
      }

      await db.collection('designs').doc(id).update(updates);
      const updatedDoc = await db.collection('designs').doc(id).get();
      design = { id: updatedDoc.id, ...updatedDoc.data() };
    } else {
      const existingDesign = await mockDb.getDesign(id);
      if (!existingDesign) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Design not found',
        });
      }

      if (existingDesign.userId !== userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'You do not have permission to update this design',
        });
      }

      design = await mockDb.updateDesign(id, updates);
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Design updated successfully',
      data: design,
    });
  } catch (error) {
    console.error('Error updating design:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to update design',
      error: error.message,
    });
  }
}

async function deleteDesign(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    if (isFirebaseInitialized) {
      const doc = await db.collection('designs').doc(id).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Design not found',
        });
      }

      const design = doc.data();
      if (design.userId !== userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'You do not have permission to delete this design',
        });
      }

      await db.collection('designs').doc(id).delete();
    } else {
      const design = await mockDb.getDesign(id);
      if (!design) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Design not found',
        });
      }

      if (design.userId !== userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'You do not have permission to delete this design',
        });
      }

      await mockDb.deleteDesign(id);
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Design deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting design:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to delete design',
      error: error.message,
    });
  }
}

module.exports = {
  saveDesign,
  getUserDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
};
