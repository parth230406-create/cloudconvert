const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const generateOutputPath = (outputDir, originalName, newExtension) => {
  const baseName = path.basename(originalName, path.extname(originalName));
  const uniqueId = uuidv4().substring(0, 8);
  return path.join(outputDir, `${baseName}_${uniqueId}${newExtension}`);
};

const getFileSize = async (filePath) => {
  const stats = await fs.stat(filePath);
  return stats.size;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

const ensureDir = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
};

module.exports = {
  generateOutputPath,
  getFileSize,
  formatFileSize,
  deleteFile,
  ensureDir
};