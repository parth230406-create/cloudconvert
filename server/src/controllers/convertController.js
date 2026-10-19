const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mammoth = require('mammoth');
const ExcelJS = require('exceljs');
const csvParser = require('csv-parser');
const PDFDocument = require('pdfkit');
const { PDFDocument: PDFLibDoc } = require('pdf-lib');

const outputDir = path.join(__dirname, '../../outputs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper: generate output path
function getOutputPath(extension) {
  const id = uuidv4();
  return path.join(outputDir, `${id}.${extension}`);
}

// Helper: wrap stream finish in a promise
function streamFinished(stream) {
  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

// 1. Word to PDF
exports.wordToPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await mammoth.extractRawText({ path: req.file.path });
    const text = result.value;
    const outputPath = getOutputPath('pdf');

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    doc.fontSize(12).text(text, { align: 'left' });
    doc.end();

    await streamFinished(writeStream);

    const filename = path.basename(outputPath);
    res.json({
      success: true,
      filename,
      downloadUrl: `/downloads/${filename}`
    });
  } catch (error) {
    next(error);
  }
};

// 2. Excel to PDF
exports.excelToPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const outputPath = getOutputPath('pdf');
    const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    workbook.eachSheet((worksheet, sheetId) => {
      if (sheetId > 1) doc.addPage();

      doc.fontSize(14).text(`Sheet: ${worksheet.name}`, { underline: true });
      doc.moveDown(0.5);

      const tableData = [];
      worksheet.eachRow((row, rowNumber) => {
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

    const filename = path.basename(outputPath);
    res.json({
      success: true,
      filename,
      downloadUrl: `/downloads/${filename}`
    });
  } catch (error) {
    next(error);
  }
};

// 3. Text to PDF
exports.textToPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const text = fs.readFileSync(req.file.path, 'utf-8');
    const outputPath = getOutputPath('pdf');

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    doc.fontSize(12).text(text, { align: 'left' });
    doc.end();

    await streamFinished(writeStream);

    const filename = path.basename(outputPath);
    res.json({
      success: true,
      filename,
      downloadUrl: `/downloads/${filename}`
    });
  } catch (error) {
    next(error);
  }
};

// 4. CSV to Excel
exports.csvToExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
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
    }

    const outputPath = getOutputPath('xlsx');
    await workbook.xlsx.writeFile(outputPath);

    const filename = path.basename(outputPath);
    res.json({
      success: true,
      filename,
      downloadUrl: `/downloads/${filename}`
    });
  } catch (error) {
    next(error);
  }
};

// 5. Excel to CSV
exports.excelToCsv = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const outputPath = getOutputPath('csv');
    const writeStream = fs.createWriteStream(outputPath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return res.status(400).json({ error: 'Excel file has no sheets' });
    }

    const rows = [];
    worksheet.eachRow((row) => {
      const rowData = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        let val = cell.value;
        if (val && typeof val === 'object' && val.result !== undefined) {
          val = val.result;
        }
        rowData.push(String(val || ''));
      });
      rows.push(rowData.join(','));
    });

    writeStream.write(rows.join('\n'));
    writeStream.end();

    await streamFinished(writeStream);

    const filename = path.basename(outputPath);
    res.json({
      success: true,
      filename,
      downloadUrl: `/downloads/${filename}`
    });
  } catch (error) {
    next(error);
  }
};