const fs = require('fs');
const path = require('path');
const { HTTP_STATUS } = require('../utils/constants');

const uploadsDir = path.join(__dirname, '../../uploads');

function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
}

function uploadDesign(req, res) {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Design file uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error('Error uploading design:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to upload design',
      error: error.message,
    });
  }
}

function deleteUploadedFile(req, res) {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Filename is required',
      });
    }

    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'File not found',
      });
    }

    const normalizedUploadPath = path.normalize(uploadsDir);
    const normalizedFilePath = path.normalize(filePath);

    if (!normalizedFilePath.startsWith(normalizedUploadPath)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Invalid file path',
      });
    }

    fs.unlinkSync(filePath);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'File deleted successfully',
      data: {
        filename,
      },
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message,
    });
  }
}

module.exports = {
  uploadImage,
  uploadDesign,
  deleteUploadedFile,
};
