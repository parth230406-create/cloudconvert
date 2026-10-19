const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const cleanupOldFiles = (directory, maxAge) => {
  if (!fs.existsSync(directory)) return;

  const now = Date.now();
  let cleanedCount = 0;
  let freedBytes = 0;

  try {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
      const filePath = path.join(directory, file);

      try {
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;

        if (fileAge > maxAge) {
          const fileSize = stats.size;

          if (stats.isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(filePath);
          }

          cleanedCount++;
          freedBytes += fileSize;
        }
      } catch (err) {
        logger.error(`Error cleaning up file ${file}: ${err.message}`);
      }
    });

    if (cleanedCount > 0) {
      logger.info(`Cleanup: removed ${cleanedCount} files, freed ${(freedBytes / 1024 / 1024).toFixed(2)}MB from ${path.basename(directory)}`);
    }
  } catch (err) {
    logger.error(`Error reading cleanup directory ${directory}: ${err.message}`);
  }
};

const emergencyCleanup = (directory) => {
  if (!fs.existsSync(directory)) return;

  try {
    const files = fs.readdirSync(directory);
    files.forEach(file => {
      const filePath = path.join(directory, file);
      try {
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        // Ignore during emergency
      }
    });
    logger.warn(`Emergency cleanup completed for ${directory}`);
  } catch (err) {
    logger.error(`Emergency cleanup failed: ${err.message}`);
  }
};

module.exports = { cleanupOldFiles, emergencyCleanup };