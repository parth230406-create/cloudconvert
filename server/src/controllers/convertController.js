const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const ExcelJS = require('exceljs');
const csvParser = require('csv-parser');
const PDFDocument = require('pdfkit');
const { generateOutputPath, getFileSize, formatFileSize, deleteFile } = require('../utils/fileUtils');
const logger = require('../utils/logger');

const outputDir = path.join(__dirname, '../../outputs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper: wrap stream finish in a promise
function streamFinished(stream) {
  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

// Helper: build standard success response matching frontend expectations
async function buildResponse(outputPath, message) {
  const fileSize = await getFileSize(outputPath);
  const filename = path.basename(outputPath);
  return {
    success: true,
    message,
    file: {
      name: filename,
      size: formatFileSize(fileSize),
      downloadUrl: `/downloads/${filename}`
    }
  };
}

// 1. Word to PDF
exports.wordToPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const result = await mammoth.extractRawText({ path: req.file.path });
    const text = result.value || 'Empty document';
    const outputPath = generateOutputPath(outputDir, req.file.originalname, '.pdf');

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    doc.fontSize(12).text(text, { align: 'left' });
    doc.end();

    await streamFinished(writeStream);
    await deleteFile(req.file.path);

    const response = await buildResponse(outputPath, 'Word converted to PDF successfully');
    res.json(response);
  } catch (error) {
    logger.error(`wordToPdf error: ${error.message}`);
    if (req.file) await deleteFile(req.file.path).catch(() => {});
    next(error);
  }
};

// 2. Excel to PDF
exports.excelToPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const outputPath = generateOutputPath(outputDir, req.file.originalname, '.pdf');
    const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    let firstSheet = true;
    workbook.eachSheet((worksheet) => {
      if (!firstSheet) doc.addPage();
      firstSheet = false;

      doc.fontSize(14).text(`Sheet: ${worksheet.name}`, { underline: true });
      doc.moveDown(0.5);

      const tableData = [];
      worksheet.eachRow((row) => {
        const rowData = [];
        row.eachCell({ includeEmpty: true }, (cell) => {
          rowData.push(cell.text || String(cell.value || ''));
        });
        tableData.push(rowData);
      });

      doc.fontSize(8);
      tableData.forEach((row, index) => {
        const line = row.join('  |  ');
        if (index === 0) {
          doc.font('Helvetica-Bold').text(line);
          doc.font('Helvetica');
        } else {
          doc.text(line);
        }
      });
    });

    doc.end();
    await streamFinished(writeStream);
    await deleteFile(req.file.path);

    const response = await buildResponse(outputPath, 'Excel converted to PDF successfully');
    res.json(response);
  } catch (error) {
    logger.error(`excelToPdf error: ${error.message}`);
    if (req.file) await deleteFile(req.file.path).catch(() => {});
    next(error);
  }
};

// 3. Text to PDF
exports.textToPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const text = fs.readFileSync(req.file.path, 'utf-8') || 'Empty file';
    const outputPath = generateOutputPath(outputDir, req.file.originalname, '.pdf');

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    doc.fontSize(12).text(text, { align: 'left' });
    doc.end();

    await streamFinished(writeStream);
    await deleteFile(req.file.path);

    const response = await buildResponse(outputPath, 'Text converted to PDF successfully');
    res.json(response);
  } catch (error) {
    logger.error(`textToPdf error: ${error.message}`);
    if (req.file) await deleteFile(req.file.path).catch(() => {});
    next(error);
  }
};

// 4. CSV to Excel (xlsx)
exports.csvToExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const rows = [];
    const readStream = fs.createReadStream(req.file.path);

    await new Promise((resolve, reject) => {
      readStream
        .pipe(csvParser())
        .on('data', (row) => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    if (rows.length > 0) {
      const headers = Object.keys(rows[0]);
      worksheet.addRow(headers);
      worksheet.getRow(1).font = { bold: true };

      rows.forEach((row) => {
        worksheet.addRow(headers.map((h) => row[h] || ''));
      });
    } else {
      worksheet.addRow(['Empty CSV']);
    }

    const outputPath = generateOutputPath(outputDir, req.file.originalname, '.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    await deleteFile(req.file.path);

    const response = await buildResponse(outputPath, 'CSV converted to Excel successfully');
    res.json(response);
  } catch (error) {
    logger.error(`csvToExcel error: ${error.message}`);
    if (req.file) await deleteFile(req.file.path).catch(() => {});
    next(error);
  }
};

// 5. Excel to CSV
exports.excelToCsv = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      await deleteFile(req.file.path).catch(() => {});
      return res.status(400).json({ success: false, error: 'Excel file has no sheets' });
    }

    const outputPath = generateOutputPath(outputDir, req.file.originalname, '.csv');
    const writeStream = fs.createWriteStream(outputPath);

    const rows = [];
    worksheet.eachRow((row) => {
      const rowData = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        let val = cell.value;
        if (val && typeof val === 'object' && val.result !== undefined) {
          val = val.result;
        }
        // Escape commas and quotes properly
        let str = String(val || '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          str = `"${str.replace(/"/g, '""')}"`;
        }
        rowData.push(str);
      });
      rows.push(rowData.join(','));
    });

    writeStream.write(rows.join('\n'));
    writeStream.end();

    await streamFinished(writeStream);
    await deleteFile(req.file.path);

    const response = await buildResponse(outputPath, 'Excel converted to CSV successfully');
    res.json(response);
  } catch (error) {
    logger.error(`excelToCsv error: ${error.message}`);
    if (req.file) await deleteFile(req.file.path).catch(() => {});
    next(error);
  }
};

// 6. JPG to PNG (and other image conversions)
exports.imageConvert = (targetFormat) => async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const sharp = require('sharp');
    const outputPath = generateOutputPath(outputDir, req.file.originalname, `.${targetFormat}`);

    let pipeline = sharp(req.file.path);
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
      default:
        pipeline = pipeline.png();
    }

    await pipeline.toFile(outputPath);
    await deleteFile(req.file.path);

    const response = await buildResponse(outputPath, `Image converted to ${targetFormat.toUpperCase()} successfully`);
    res.json(response);
  } catch (error) {
    logger.error(`imageConvert error: ${error.message}`);
    if (req.file) await deleteFile(req.file.path).catch(() => {});
    next(error);
  }
};