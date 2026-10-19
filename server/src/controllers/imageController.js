const imageService = require('../services/imageService');
const compressionService = require('../services/compressionService');
const { getFileSize, formatFileSize, deleteFile } = require('../utils/fileUtils');
const path = require('path');

const outputDir = path.join(__dirname, '../../outputs');

const imageController = {

  convert: async (req, res, next) => {
    try {
      const { format } = req.body;
      const filePath = req.file.path;

      if (!format) {
        return res.status(400).json({ success: false, error: 'Target format is required' });
      }

      const outputPath = await imageService.convertImage(filePath, outputDir, format);
      const fileSize = await getFileSize(outputPath);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: `Image converted to ${format.toUpperCase()} successfully`,
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  },

  batchConvert: async (req, res, next) => {
    try {
      const { format } = req.body;
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, error: 'At least one image file is required' });
      }

      const filePaths = req.files.map(f => f.path);
      const outputPaths = await imageService.batchConvert(filePaths, outputDir, format);

      let result;
      if (outputPaths.length > 1) {
        const zipPath = await compressionService.createZip(outputPaths, outputDir, 'converted_images');
        const zipSize = await getFileSize(zipPath);
        for (const op of outputPaths) await deleteFile(op);
        result = { name: path.basename(zipPath), size: formatFileSize(zipSize), downloadUrl: `/downloads/${path.basename(zipPath)}` };
      } else {
        const fileSize = await getFileSize(outputPaths[0]);
        result = { name: path.basename(outputPaths[0]), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPaths[0])}` };
      }

      for (const fp of filePaths) await deleteFile(fp);

      res.json({ success: true, message: `${outputPaths.length} images converted successfully`, file: result });
    } catch (error) { next(error); }
  },

  compress: async (req, res, next) => {
    try {
      const { quality = 70 } = req.body;
      const filePath = req.file.path;
      const originalSize = await getFileSize(filePath);

      const outputPath = await imageService.compressImage(filePath, outputDir, parseInt(quality));
      const compressedSize = await getFileSize(outputPath);
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'Image compressed successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(compressedSize), downloadUrl: `/downloads/${path.basename(outputPath)}` },
        stats: { originalSize: formatFileSize(originalSize), compressedSize: formatFileSize(compressedSize), reduction: `${reduction}%` }
      });
    } catch (error) { next(error); }
  },

  resize: async (req, res, next) => {
    try {
      const { width, height, percentage, fit } = req.body;
      const filePath = req.file.path;

      const outputPath = await imageService.resizeImage(filePath, outputDir, {
        width, height, percentage: parseInt(percentage), fit
      });
      const fileSize = await getFileSize(outputPath);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'Image resized successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  },

  crop: async (req, res, next) => {
    try {
      const { left, top, width, height } = req.body;
      const filePath = req.file.path;

      if (!width || !height) {
        return res.status(400).json({ success: false, error: 'Width and height are required for cropping' });
      }

      const outputPath = await imageService.cropImage(filePath, outputDir, { left, top, width, height });
      const fileSize = await getFileSize(outputPath);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'Image cropped successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  },

  rotate: async (req, res, next) => {
    try {
      const { angle = 90 } = req.body;
      const filePath = req.file.path;

      const outputPath = await imageService.rotateImage(filePath, outputDir, angle);
      const fileSize = await getFileSize(outputPath);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'Image rotated successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  },

  toBase64: async (req, res, next) => {
    try {
      const filePath = req.file.path;
      const base64String = await imageService.imageToBase64(filePath);
      await deleteFile(filePath);

      res.json({ success: true, message: 'Image converted to Base64 successfully', data: base64String });
    } catch (error) { next(error); }
  },

  info: async (req, res, next) => {
    try {
      const filePath = req.file.path;
      const info = await imageService.getImageInfo(filePath);
      const fileSize = await getFileSize(filePath);
      await deleteFile(filePath);

      res.json({ success: true, info: { ...info, fileSize: formatFileSize(fileSize) } });
    } catch (error) { next(error); }
  },

  effects: async (req, res, next) => {
    try {
      const filePath = req.file.path;
      const effects = req.body;

      const outputPath = await imageService.applyEffects(filePath, outputDir, effects);
      const fileSize = await getFileSize(outputPath);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'Effects applied successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  }
};

module.exports = imageController;