const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadDocument, getAllDocuments, deleteDocument } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authmiddleware');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.post('/', protect, authorize(['leader', 'admin']), upload.single('document'), uploadDocument);
router.get('/', protect, getAllDocuments);
router.delete('/:id', protect, authorize(['leader', 'admin']), deleteDocument);

module.exports = router;
