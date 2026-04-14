const router = require('express').Router();
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Store files in memory (buffer), not on disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No files uploaded' });

    const urls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    res.json({ urls });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

module.exports = router;
