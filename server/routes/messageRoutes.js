const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authmiddleware');
const multer = require('multer');

// Multer storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
  const filePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: filePath });
});
router.post('/', protect, sendMessage);
router.get('/:roomName', protect, getMessages);

module.exports = router;
