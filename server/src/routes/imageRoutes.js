const express = require('express');
const router = express.Router();
const c = require('../controllers/imageController');
const { handleUpload } = require('../middleware/upload');
const { validateFileExists } = require('../middleware/validation');
const { uploadLimiter } = require('../middleware/rateLimiter');

router.post('/convert', uploadLimiter, handleUpload('single'), validateFileExists, c.convert);
router.post('/compress', uploadLimiter, handleUpload('single'), validateFileExists, c.compress);
router.post('/resize', uploadLimiter, handleUpload('single'), validateFileExists, c.resize);
router.post('/crop', uploadLimiter, handleUpload('single'), validateFileExists, c.crop);
router.post('/rotate', uploadLimiter, handleUpload('single'), validateFileExists, c.rotate);

module.exports = router;