const mockDb = require('../data/mockDb');
const { getPaginationParams, generateDesignId } = require('../utils/helpers');

async function getDesignLibrary(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { page, limit, offset } = getPaginationParams(req.query);
    const { archived, folderId } = req.query;

    const result = await mockDb.getUserDesignLibrary(userId, 100, 0);
    let designs = result.data;

    // Filter by archived status
    if (archived === 'true') {
      designs = designs.filter((d) => d.archived === true);
    } else if (archived === 'false') {
      designs = designs.filter((d) => d.archived !== true);
    }

    // Filter by folder
    if (folderId) {
      designs = designs.filter((d) => d.folderId === folderId);
    }

    const total = designs.length;
    const paginatedDesigns = designs.slice(offset, offset + limit);

    return res.status(200).json({
      success: true,
      message: 'Design library retrieved successfully',
      data: {
        designs: paginatedDesigns,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching design library:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve design library',
      error: error.message,
    });
  }
}

async function createDesign(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { name, description, category, thumbnail, folderId } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Design name is required',
      });
    }

    const designData = {
      name,
      description: description || '',
      category: category || 'uncategorized',
      thumbnail: thumbnail || '',
      folderId: folderId || null,
      published: false,
      archived: false,
      content: {},
    };

    const design = await mockDb.addDesignLibraryItem(userId, designData);

    return res.status(201).json({
      success: true,
      message: 'Design created successfully',
      data: design,
    });
  } catch (error) {
    console.error('Error creating design:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create design',
      error: error.message,
    });
  }
}

async function updateDesign(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;
    const { name, description, category, thumbnail, content } = req.body;

    const design = await mockDb.getDesignLibraryItem(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    if (design.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this design',
      });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (thumbnail !== undefined) updates.thumbnail = thumbnail;
    if (content !== undefined) updates.content = content;

    const updatedDesign = await mockDb.updateDesignLibraryItem(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Design updated successfully',
      data: updatedDesign,
    });
  } catch (error) {
    console.error('Error updating design:', error);
    return res.status(500).json({
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

    const design = await mockDb.getDesignLibraryItem(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    if (design.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this design',
      });
    }

    await mockDb.deleteDesignLibraryItem(id);

    return res.status(200).json({
      success: true,
      message: 'Design deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting design:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete design',
      error: error.message,
    });
  }
}

async function duplicateDesign(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const originalDesign = await mockDb.getDesignLibraryItem(id);

    if (!originalDesign) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    if (originalDesign.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to duplicate this design',
      });
    }

    const duplicateData = {
      ...originalDesign,
      name: `${originalDesign.name} (Copy)`,
      published: false,
    };
    delete duplicateData.id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;

    const duplicatedDesign = await mockDb.addDesignLibraryItem(userId, duplicateData);

    return res.status(201).json({
      success: true,
      message: 'Design duplicated successfully',
      data: duplicatedDesign,
    });
  } catch (error) {
    console.error('Error duplicating design:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to duplicate design',
      error: error.message,
    });
  }
}

async function toggleArchive(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;
    const { archived } = req.body;

    const design = await mockDb.getDesignLibraryItem(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    if (design.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to archive this design',
      });
    }

    const isArchived = archived !== undefined ? archived : !design.archived;

    const updatedDesign = await mockDb.updateDesignLibraryItem(id, { archived: isArchived });

    return res.status(200).json({
      success: true,
      message: isArchived ? 'Design archived successfully' : 'Design unarchived successfully',
      data: updatedDesign,
    });
  } catch (error) {
    console.error('Error toggling archive:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle archive',
      error: error.message,
    });
  }
}

async function publishDesign(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;
    const { price, description: marketplaceDescription } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required to publish',
      });
    }

    const design = await mockDb.getDesignLibraryItem(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    if (design.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to publish this design',
      });
    }

    // Create marketplace design
    const marketplaceDesign = {
      name: design.name,
      description: marketplaceDescription || design.description,
      category: design.category,
      price: parseFloat(price),
      authorId: userId,
      authorName: req.user.email || 'Anonymous',
      images: design.thumbnail ? [design.thumbnail] : [],
      rating: 0,
      reviewCount: 0,
      downloads: 0,
      featured: false,
      previewUrl: design.thumbnail || '',
    };

    const publishedDesign = await mockDb.addMarketplaceDesign(marketplaceDesign);

    const updatedLibraryDesign = await mockDb.updateDesignLibraryItem(id, {
      published: true,
      publishedId: publishedDesign.id,
      price,
    });

    return res.status(200).json({
      success: true,
      message: 'Design published to marketplace successfully',
      data: {
        libraryDesign: updatedLibraryDesign,
        marketplaceDesign: publishedDesign,
      },
    });
  } catch (error) {
    console.error('Error publishing design:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish design',
      error: error.message,
    });
  }
}

async function unpublishDesign(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const design = await mockDb.getDesignLibraryItem(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    if (design.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to unpublish this design',
      });
    }

    const updatedDesign = await mockDb.updateDesignLibraryItem(id, {
      published: false,
      publishedId: null,
    });

    return res.status(200).json({
      success: true,
      message: 'Design removed from marketplace successfully',
      data: updatedDesign,
    });
  } catch (error) {
    console.error('Error unpublishing design:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unpublish design',
      error: error.message,
    });
  }
}

async function moveToFolder(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;
    const { folderId } = req.body;

    const design = await mockDb.getDesignLibraryItem(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    if (design.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to move this design',
      });
    }

    // Verify folder exists if provided
    if (folderId) {
      const folder = await mockDb.getDesignFolder(folderId);
      if (!folder || folder.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Folder not found',
        });
      }
    }

    const updatedDesign = await mockDb.updateDesignLibraryItem(id, { folderId });

    return res.status(200).json({
      success: true,
      message: 'Design moved successfully',
      data: updatedDesign,
    });
  } catch (error) {
    console.error('Error moving design:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to move design',
      error: error.message,
    });
  }
}

async function getFolders(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    const folders = await mockDb.getUserDesignFolders(userId);

    return res.status(200).json({
      success: true,
      message: 'Folders retrieved successfully',
      data: {
        folders,
        count: folders.length,
      },
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve folders',
      error: error.message,
    });
  }
}

async function createFolder(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required',
      });
    }

    const folderData = {
      name,
    };

    const folder = await mockDb.addDesignFolder(userId, folderData);

    return res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      data: folder,
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create folder',
      error: error.message,
    });
  }
}

async function renameFolder(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required',
      });
    }

    const folder = await mockDb.getDesignFolder(id);

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }

    if (folder.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to rename this folder',
      });
    }

    const updatedFolder = await mockDb.updateDesignFolder(id, { name });

    return res.status(200).json({
      success: true,
      message: 'Folder renamed successfully',
      data: updatedFolder,
    });
  } catch (error) {
    console.error('Error renaming folder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to rename folder',
      error: error.message,
    });
  }
}

async function deleteFolder(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const folder = await mockDb.getDesignFolder(id);

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }

    if (folder.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this folder',
      });
    }

    // Move designs out of folder first
    const libResult = await mockDb.getUserDesignLibrary(userId, 1000, 0);
    for (const design of libResult.data) {
      if (design.folderId === id) {
        await mockDb.updateDesignLibraryItem(design.id, { folderId: null });
      }
    }

    await mockDb.deleteDesignFolder(id);

    return res.status(200).json({
      success: true,
      message: 'Folder deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete folder',
      error: error.message,
    });
  }
}

async function getPurchasedDesigns(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { page, limit, offset } = getPaginationParams(req.query);

    const purchases = await mockDb.getUserPurchasedDesigns(userId);

    const designIds = purchases.map((p) => p.designId);
    const designs = [];

    for (const designId of designIds) {
      const design = await mockDb.getMarketplaceDesign(designId);
      if (design) {
        designs.push(design);
      }
    }

    const total = designs.length;
    const paginatedDesigns = designs.slice(offset, offset + limit);

    return res.status(200).json({
      success: true,
      message: 'Purchased designs retrieved successfully',
      data: {
        designs: paginatedDesigns,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching purchased designs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve purchased designs',
      error: error.message,
    });
  }
}

module.exports = {
  getDesignLibrary,
  createDesign,
  updateDesign,
  deleteDesign,
  duplicateDesign,
  toggleArchive,
  publishDesign,
  unpublishDesign,
  moveToFolder,
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  getPurchasedDesigns,
};
