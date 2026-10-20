const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');
const { generateOutputPath } = require('../utils/fileUtils');
const logger = require('../utils/logger');

class PDFService {

  async mergePDFs(filePaths, outputDir) {
    const mergedPdf = await PDFDocument.create();

    for (const filePath of filePaths) {
      const pdfBytes = await fs.readFile(filePath);
      const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    const outputPath = generateOutputPath(outputDir, 'merged', '.pdf');
    const mergedBytes = await mergedPdf.save();
    await fs.writeFile(outputPath, mergedBytes);

    return outputPath;
  }

  async splitPDF(filePath, outputDir, options = {}) {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const totalPages = pdf.getPageCount();
    const outputPaths = [];

    if (options.ranges) {
      const ranges = this.parseRanges(options.ranges, totalPages);

      for (let i = 0; i < ranges.length; i++) {
        const newPdf = await PDFDocument.create();
        const pageIndices = ranges[i].map(p => p - 1);
        const pages = await newPdf.copyPages(pdf, pageIndices);
        pages.forEach(page => newPdf.addPage(page));

        const outputPath = generateOutputPath(outputDir, `split_part${i + 1}`, '.pdf');
        const bytes = await newPdf.save();
        await fs.writeFile(outputPath, bytes);
        outputPaths.push(outputPath);
      }
    } else {
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);

        const outputPath = generateOutputPath(outputDir, `page_${i + 1}`, '.pdf');
        const bytes = await newPdf.save();
        await fs.writeFile(outputPath, bytes);
        outputPaths.push(outputPath);
      }
    }

    return outputPaths;
  }

  async compressPDF(filePath, outputDir) {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setKeywords([]);
    pdf.setProducer('CloudConvert');
    pdf.setCreator('CloudConvert');

    const outputPath = generateOutputPath(outputDir, 'compressed', '.pdf');

    const compressedBytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50
    });

    await fs.writeFile(outputPath, compressedBytes);
    return outputPath;
  }

  async imagesToPDF(imagePaths, outputDir, options = {}) {
    const pdfDoc = await PDFDocument.create();

    for (const imagePath of imagePaths) {
      const imageBytes = await fs.readFile(imagePath);
      const ext = path.extname(imagePath).toLowerCase();

      let image;
      if (ext === '.png') {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (['.jpg', '.jpeg'].includes(ext)) {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        const pngBuffer = await sharp(imageBytes).png().toBuffer();
        image = await pdfDoc.embedPng(pngBuffer);
      }

      const pageWidth = options.pageWidth || image.width;
      const pageHeight = options.pageHeight || image.height;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      const scale = Math.min(
        pageWidth / image.width,
        pageHeight / image.height
      );

      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;

      page.drawImage(image, {
        x: (pageWidth - scaledWidth) / 2,
        y: (pageHeight - scaledHeight) / 2,
        width: scaledWidth,
        height: scaledHeight
      });
    }

    const outputPath = generateOutputPath(outputDir, 'images_combined', '.pdf');
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);

    return outputPath;
  }

  async addPageNumbers(filePath, outputDir, options = {}) {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const pages = pdf.getPages();

    const position = options.position || 'bottom-center';
    const fontSize = options.fontSize || 12;
    const startPage = options.startPage || 1;

    pages.forEach((page, index) => {
      if (index + 1 >= startPage) {
        const { width, height } = page.getSize();
        const pageNumber = (index + 1).toString();
        const textWidth = font.widthOfTextAtSize(pageNumber, fontSize);

        let x, y;
        switch (position) {
          case 'bottom-left':
            x = 40; y = 30; break;
          case 'bottom-right':
            x = width - 40 - textWidth; y = 30; break;
          case 'top-center':
            x = (width - textWidth) / 2; y = height - 30; break;
          case 'top-left':
            x = 40; y = height - 30; break;
          case 'top-right':
            x = width - 40 - textWidth; y = height - 30; break;
          default:
            x = (width - textWidth) / 2; y = 30;
        }

        page.drawText(pageNumber, {
          x, y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0)
        });
      }
    });

    const outputPath = generateOutputPath(outputDir, 'numbered', '.pdf');
    const numberedBytes = await pdf.save();
    await fs.writeFile(outputPath, numberedBytes);

    return outputPath;
  }

  async addWatermark(filePath, outputDir, options = {}) {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    const pages = pdf.getPages();

    const text = options.text || 'WATERMARK';
    const fontSize = options.fontSize || 50;
    const opacity = options.opacity || 0.3;
    const rotation = options.rotation || 45;

    pages.forEach(page => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(0.7, 0.7, 0.7),
        opacity,
        rotate: degrees(rotation)
      });
    });

    const outputPath = generateOutputPath(outputDir, 'watermarked', '.pdf');
    const watermarkedBytes = await pdf.save();
    await fs.writeFile(outputPath, watermarkedBytes);

    return outputPath;
  }

  async rotatePDF(filePath, outputDir, angle = 90, pageNumbers = null) {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdf.getPages();

    pages.forEach((page, index) => {
      if (!pageNumbers || pageNumbers.includes(index + 1)) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      }
    });

    const outputPath = generateOutputPath(outputDir, 'rotated', '.pdf');
    const rotatedBytes = await pdf.save();
    await fs.writeFile(outputPath, rotatedBytes);

    return outputPath;
  }

  /**
   * Protect PDF with password using qpdf (system-level tool).
   * qpdf encrypts the PDF in-place — ALL original content is preserved perfectly.
   * Uses AES-256 encryption.
   */
  async protectPDF(filePath, outputDir, password) {
    if (!password || password.trim() === '') {
      throw new Error('Password is required to protect a PDF');
    }

    const outputPath = generateOutputPath(outputDir, 'protected', '.pdf');

    try {
      // Use qpdf to encrypt the PDF with AES-256
      // --encrypt user_pass owner_pass key_length -- input output
      execSync(
        `qpdf --encrypt "${password}" "${password}" 256 -- "${filePath}" "${outputPath}"`,
        {
          timeout: 30000,
          stdio: 'pipe',
          maxBuffer: 50 * 1024 * 1024
        }
      );

      logger.info(`PDF protected successfully with AES-256: ${outputPath}`);
      return outputPath;

    } catch (err) {
      const errMsg = err.stderr ? err.stderr.toString() : err.message;
      logger.error(`qpdf encryption failed: ${errMsg}`);

      // Check if qpdf is even installed
      if (errMsg.includes('not found') || errMsg.includes('ENOENT')) {
        throw new Error('PDF protection tool (qpdf) is not installed on this server. Please contact the administrator.');
      }

      throw new Error('Failed to apply password protection to PDF. The file may be corrupted or already encrypted.');
    }
  }

  async getPDFInfo(filePath) {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    return {
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle() || '',
      author: pdf.getAuthor() || '',
      subject: pdf.getSubject() || '',
      creator: pdf.getCreator() || '',
      producer: pdf.getProducer() || '',
      creationDate: pdf.getCreationDate(),
      modificationDate: pdf.getModificationDate()
    };
  }

  async extractPages(filePath, outputDir, pageNumbers) {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const newPdf = await PDFDocument.create();

    const indices = pageNumbers.map(p => p - 1).filter(i => i >= 0 && i < pdf.getPageCount());
    const pages = await newPdf.copyPages(pdf, indices);
    pages.forEach(page => newPdf.addPage(page));

    const outputPath = generateOutputPath(outputDir, 'extracted', '.pdf');
    const bytes = await newPdf.save();
    await fs.writeFile(outputPath, bytes);

    return outputPath;
  }

  parseRanges(rangeStr, totalPages) {
    const ranges = [];
    const parts = rangeStr.split(',');

    parts.forEach(part => {
      part = part.trim();
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        const pages = [];
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          pages.push(i);
        }
        ranges.push(pages);
      } else {
        const page = parseInt(part);
        if (page >= 1 && page <= totalPages) {
          ranges.push([page]);
        }
      }
    });

    return ranges;
  }
}

module.exports = new PDFService();