require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const { cleanupOldFiles } = require('./src/utils/cleanup');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Create necessary directories
const dirs = ['uploads', 'outputs', 'logs'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (origin.includes('.onrender.com')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

// Logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for downloads
app.use('/downloads', express.static(path.join(__dirname, 'outputs'), {
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
  }
}));

// API Routes
app.use('/api', routes);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');

  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath, {
      maxAge: '1d',
      etag: true
    }));

    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });

    logger.info('Serving React build from: ' + clientBuildPath);
  } else {
    logger.warn('React build not found at: ' + clientBuildPath);
    app.get('*', (req, res) => {
      res.status(200).json({
        message: 'CloudConvert API is running',
        docs: '/api/health',
        note: 'React frontend not built yet'
      });
    });
  }
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'CloudConvert API - Development Mode',
      frontend: 'http://localhost:3000',
      api: '/api/health'
    });
  });
}

// Error handling
app.use(errorHandler);

// Cleanup cron job - every 15 minutes
cron.schedule('*/15 * * * *', () => {
  logger.info('Running file cleanup...');
  cleanupOldFiles(path.join(__dirname, 'uploads'), 1800000);
  cleanupOldFiles(path.join(__dirname, 'outputs'), 1800000);

  const memUsage = process.memoryUsage();
  logger.info(`Memory: RSS=${Math.round(memUsage.rss / 1024 / 1024)}MB, Heap=${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`========================================`);
  logger.info(`  CloudConvert Server Running`);
  logger.info(`  Port: ${PORT}`);
  logger.info(`  Environment: ${process.env.NODE_ENV}`);
  logger.info(`  URL: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}`);
  logger.info(`========================================`);
});

module.exports = app;