const express = require('express');
const router = express.Router();
const c = require('../controllers/pdfController');
const { handleUpload } = require('../middleware/upload');
const { validateFileExists } = require('../middleware/validation');
const { uploadLimiter } = require('../middleware/rateLimiter');

router.post('/merge', uploadLimiter, handleUpload('multiple'), validateFileExists, c.merge);
router.post('/split', uploadLimiter, handleUpload('single'), validateFileExists, c.split);
router.post('/compress', uploadLimiter, handleUpload('single'), validateFileExists, c.compress);
router.post('/from-images', uploadLimiter, handleUpload('multiple'), validateFileExists, c.fromImages);
router.post('/add-page-numbers', uploadLimiter, handleUpload('single'), validateFileExists, c.addPageNumbers);
router.post('/add-watermark', uploadLimiter, handleUpload('single'), validateFileExists, c.addWatermark);
router.post('/rotate', uploadLimiter, handleUpload('single'), validateFileExists, c.rotate);
router.post('/protect', uploadLimiter, handleUpload('single'), validateFileExists, c.protect);
router.post('/extract-pages', uploadLimiter, handleUpload('single'), validateFileExists, c.extractPages);

module.exports = router;