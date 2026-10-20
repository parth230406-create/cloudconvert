const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message });
  }

  // ALWAYS show the real error message so we can debug
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An unexpected error occurred'
  });
};

module.exports = errorHandler;