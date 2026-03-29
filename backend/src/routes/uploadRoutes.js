const express = require('express');
const uploadController = require('../controllers/uploadController');
const { verifyToken } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

router.post(
  '/image',
  verifyToken,
  upload.single('file'),
  handleUploadError,
  uploadController.uploadImage
);

router.post(
  '/design',
  verifyToken,
  upload.single('file'),
  handleUploadError,
  uploadController.uploadDesign
);

router.delete('/:filename', verifyToken, uploadController.deleteUploadedFile);

module.exports = router;
