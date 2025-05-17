const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticate = require('../middlewares/auth');
const { uploadFile, listAttachments } = require('../controllers/attachmentController');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/:projectId', authenticate, upload.single('file'), uploadFile);
router.get('/:projectId', authenticate, listAttachments);

module.exports = router;