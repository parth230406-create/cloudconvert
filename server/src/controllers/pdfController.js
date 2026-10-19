const pdfService = require('../services/pdfService');
const compressionService = require('../services/compressionService');
const { getFileSize, formatFileSize, deleteFile } = require('../utils/fileUtils');
const path = require('path');

const outputDir = path.join(__dirname, '../../outputs');

const pdfController = {

  merge: async (req, res, next) => {
    try {
      if (!req.files || req.files.length < 2) {
        return res.status(400).json({ success: false, error: 'At least 2 PDF files are required' });
      }

      const filePaths = req.files.map(f => f.path);
      const outputPath = await pdfService.mergePDFs(filePaths, outputDir);
      const fileSize = await getFileSize(outputPath);

      for (const fp of filePaths) await deleteFile(fp);

      res.json({
        success: true,
        message: 'PDFs merged successfully',
        file: {
          name: path.basename(outputPath),
          size: formatFileSize(fileSize),
          downloadUrl: `/downloads/${path.basename(outputPath)}`
        }
      });
    } catch (error) { next(error); }
  },

  split: async (req, res, next) => {
    try {
      const { ranges } = req.body;
      const filePath = req.file.path;

      const outputPaths = await pdfService.splitPDF(filePath, outputDir, { ranges });

      let result;
      if (outputPaths.length > 1) {
        const zipPath = await compressionService.createZip(outputPaths, outputDir, 'split_pages');
        const zipSize = await getFileSize(zipPath);
        for (const op of outputPaths) await deleteFile(op);
        result = { name: path.basename(zipPath), size: formatFileSize(zipSize), downloadUrl: `/downloads/${path.basename(zipPath)}` };
      } else {
        const fileSize = await getFileSize(outputPaths[0]);
        result = { name: path.basename(outputPaths[0]), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPaths[0])}` };
      }

      await deleteFile(filePath);

      res.json({ success: true, message: 'PDF split successfully', file: result, totalParts: outputPaths.length });
    } catch (error) { next(error); }
  },

  compress: async (req, res, next) => {
    try {
      const { quality } = req.body;
      const filePath = req.file.path;
      const originalSize = await getFileSize(filePath);

      const outputPath = await pdfService.compressPDF(filePath, outputDir, quality);
      const compressedSize = await getFileSize(outputPath);
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'PDF compressed successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(compressedSize), downloadUrl: `/downloads/${path.basename(outputPath)}` },
        stats: { originalSize: formatFileSize(originalSize), compressedSize: formatFileSize(compressedSize), reduction: `${reduction}%` }
      });
    } catch (error) { next(error); }
  },

  fromImages: async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, error: 'At least one image file is required' });
      }

      const filePaths = req.files.map(f => f.path);
      const outputPath = await pdfService.imagesToPDF(filePaths, outputDir);
      const fileSize = await getFileSize(outputPath);

      for (const fp of filePaths) await deleteFile(fp);

      res.json({
        success: true,
        message: 'Images converted to PDF successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  },

  addPageNumbers: async (req, res, next) => {
    try {
      const { position, fontSize, startPage } = req.body;
      const filePath = req.file.path;

      const outputPath = await pdfService.addPageNumbers(filePath, outputDir, {
        position, fontSize: parseInt(fontSize) || 12, startPage: parseInt(startPage) || 1
      });
      const fileSize = await getFileSize(outputPath);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'Page numbers added successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  },

  addWatermark: async (req, res, next) => {
    try {
      const { text, fontSize, opacity, rotation } = req.body;
      const filePath = req.file.path;

      const outputPath = await pdfService.addWatermark(filePath, outputDir, {
        text: text || 'WATERMARK', fontSize: parseInt(fontSize) || 50,
        opacity: parseFloat(opacity) || 0.3, rotation: parseInt(rotation) || 45
      });
      const fileSize = await getFileSize(outputPath);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'Watermark added successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  },

  rotate: async (req, res, next) => {
    try {
      const { angle = 90, pages } = req.body;
      const filePath = req.file.path;

      const pageNumbers = pages ? pages.split(',').map(Number) : null;
      const outputPath = await pdfService.rotatePDF(filePath, outputDir, parseInt(angle), pageNumbers);
      const fileSize = await getFileSize(outputPath);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'PDF rotated successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  },

  protect: async (req, res, next) => {
    try {
      const { password } = req.body;
      const filePath = req.file.path;

      if (!password) {
        return res.status(400).json({ success: false, error: 'Password is required' });
      }

      const outputPath = await pdfService.protectPDF(filePath, outputDir, password);
      const fileSize = await getFileSize(outputPath);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'PDF protected successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  },

  info: async (req, res, next) => {
    try {
      const filePath = req.file.path;
      const info = await pdfService.getPDFInfo(filePath);
      const fileSize = await getFileSize(filePath);
      await deleteFile(filePath);

      res.json({ success: true, info: { ...info, fileSize: formatFileSize(fileSize) } });
    } catch (error) { next(error); }
  },

  extractPages: async (req, res, next) => {
    try {
      const { pages } = req.body;
      const filePath = req.file.path;

      if (!pages) {
        return res.status(400).json({ success: false, error: 'Page numbers are required' });
      }

      const pageNumbers = [];
      pages.split(',').forEach(part => {
        part = part.trim();
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let i = start; i <= end; i++) pageNumbers.push(i);
        } else {
          pageNumbers.push(parseInt(part));
        }
      });

      const outputPath = await pdfService.extractPages(filePath, outputDir, pageNumbers);
      const fileSize = await getFileSize(outputPath);
      await deleteFile(filePath);

      res.json({
        success: true,
        message: 'Pages extracted successfully',
        file: { name: path.basename(outputPath), size: formatFileSize(fileSize), downloadUrl: `/downloads/${path.basename(outputPath)}` }
      });
    } catch (error) { next(error); }
  }
};

module.exports = pdfController;