const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../middleware/rateLimiter');
const healthController = require('../controllers/healthController');

router.use(apiLimiter);
router.get('/health', healthController.check);
router.use('/pdf', require('./pdfRoutes'));
router.use('/image', require('./imageRoutes'));
router.use('/convert', require('./convertRoutes'));

module.exports = router;