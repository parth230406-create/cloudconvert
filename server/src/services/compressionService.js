const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const { generateOutputPath } = require('../utils/fileUtils');

class CompressionService {

  async createZip(filePaths, outputDir, zipName = 'files') {
    const outputPath = generateOutputPath(outputDir, zipName, '.zip');

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve(outputPath));
      archive.on('error', reject);

      archive.pipe(output);

      filePaths.forEach(filePath => {
        archive.file(filePath, { name: path.basename(filePath) });
      });

      archive.finalize();
    });
  }
}

module.exports = new CompressionService();