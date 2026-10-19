const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { generateOutputPath } = require('../utils/fileUtils');
const logger = require('../utils/logger');

class ImageService {

  async convertImage(filePath, outputDir, targetFormat) {
    const outputPath = generateOutputPath(outputDir, path.basename(filePath), `.${targetFormat}`);

    let pipeline = sharp(filePath);

    switch (targetFormat.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality: 90 });
        break;
      case 'png':
        pipeline = pipeline.png({ compressionLevel: 6 });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality: 85 });
        break;
      case 'tiff':
        pipeline = pipeline.tiff();
        break;
      case 'gif':
        pipeline = pipeline.gif();
        break;
      default:
        pipeline = pipeline.png();
    }

    await pipeline.toFile(outputPath);
    return outputPath;
  }

  async compressImage(filePath, outputDir, quality = 70) {
    const ext = path.extname(filePath).toLowerCase();
    const outputPath = generateOutputPath(outputDir, path.basename(filePath), ext === '.png' ? '.png' : '.jpg');

    let pipeline = sharp(filePath);

    if (ext === '.png') {
      pipeline = pipeline.png({
        compressionLevel: 9,
        palette: true,
        quality: Math.max(10, quality)
      });
    } else {
      pipeline = pipeline.jpeg({
        quality: Math.max(10, quality),
        mozjpeg: true
      });
    }

    await pipeline.toFile(outputPath);
    return outputPath;
  }

  async resizeImage(filePath, outputDir, options = {}) {
    const ext = path.extname(filePath).toLowerCase();
    const outputPath = generateOutputPath(outputDir, path.basename(filePath), ext);

    const resizeOptions = {};

    if (options.width) resizeOptions.width = parseInt(options.width);
    if (options.height) resizeOptions.height = parseInt(options.height);
    if (options.fit) resizeOptions.fit = options.fit;
    if (options.withoutEnlargement) resizeOptions.withoutEnlargement = true;

    if (options.percentage) {
      const metadata = await sharp(filePath).metadata();
      resizeOptions.width = Math.round(metadata.width * (options.percentage / 100));
      resizeOptions.height = Math.round(metadata.height * (options.percentage / 100));
    }

    await sharp(filePath)
      .resize(resizeOptions)
      .toFile(outputPath);

    return outputPath;
  }

  async cropImage(filePath, outputDir, options = {}) {
    const ext = path.extname(filePath).toLowerCase();
    const outputPath = generateOutputPath(outputDir, path.basename(filePath), ext);

    const { left = 0, top = 0, width, height } = options;

    await sharp(filePath)
      .extract({
        left: parseInt(left),
        top: parseInt(top),
        width: parseInt(width),
        height: parseInt(height)
      })
      .toFile(outputPath);

    return outputPath;
  }

  async rotateImage(filePath, outputDir, angle = 90) {
    const ext = path.extname(filePath).toLowerCase();
    const outputPath = generateOutputPath(outputDir, path.basename(filePath), ext);

    await sharp(filePath)
      .rotate(parseInt(angle))
      .toFile(outputPath);

    return outputPath;
  }

  async imageToBase64(filePath) {
    const imageBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const mimeType = ext === 'jpg' ? 'jpeg' : ext;
    const base64 = imageBuffer.toString('base64');
    return `data:image/${mimeType};base64,${base64}`;
  }

  async getImageInfo(filePath) {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      channels: metadata.channels,
      space: metadata.space,
      hasAlpha: metadata.hasAlpha,
      size: metadata.size
    };
  }

  async batchConvert(filePaths, outputDir, targetFormat) {
    const outputPaths = [];

    for (const filePath of filePaths) {
      try {
        const outputPath = await this.convertImage(filePath, outputDir, targetFormat);
        outputPaths.push(outputPath);
      } catch (err) {
        logger.error(`Error converting ${filePath}: ${err.message}`);
      }
    }

    return outputPaths;
  }

  async applyEffects(filePath, outputDir, effects = {}) {
    const ext = path.extname(filePath).toLowerCase();
    const outputPath = generateOutputPath(outputDir, path.basename(filePath), ext);

    let pipeline = sharp(filePath);

    if (effects.grayscale) pipeline = pipeline.grayscale();
    if (effects.blur) pipeline = pipeline.blur(parseFloat(effects.blur));
    if (effects.sharpen) pipeline = pipeline.sharpen();
    if (effects.flip) pipeline = pipeline.flip();
    if (effects.flop) pipeline = pipeline.flop();
    if (effects.negate) pipeline = pipeline.negate();
    if (effects.normalize) pipeline = pipeline.normalize();

    if (effects.brightness || effects.saturation || effects.hue) {
      pipeline = pipeline.modulate({
        brightness: effects.brightness ? parseFloat(effects.brightness) : undefined,
        saturation: effects.saturation ? parseFloat(effects.saturation) : undefined,
        hue: effects.hue ? parseInt(effects.hue) : undefined
      });
    }

    await pipeline.toFile(outputPath);
    return outputPath;
  }
}

module.exports = new ImageService();