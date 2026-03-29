const express = require('express');
const designLibraryController = require('../controllers/designLibraryController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All design library routes require authentication
router.use(verifyToken);

router.get('/', designLibraryController.getDesignLibrary);
router.post('/', designLibraryController.createDesign);
router.put('/:id', designLibraryController.updateDesign);
router.delete('/:id', designLibraryController.deleteDesign);
router.post('/:id/duplicate', designLibraryController.duplicateDesign);
router.put('/:id/archive', designLibraryController.toggleArchive);
router.post('/:id/publish', designLibraryController.publishDesign);
router.put('/:id/unpublish', designLibraryController.unpublishDesign);
router.put('/:id/move', designLibraryController.moveToFolder);

router.get('/folders', designLibraryController.getFolders);
router.post('/folders', designLibraryController.createFolder);
router.put('/folders/:id', designLibraryController.renameFolder);
router.delete('/folders/:id', designLibraryController.deleteFolder);

router.get('/purchased', designLibraryController.getPurchasedDesigns);

module.exports = router;
