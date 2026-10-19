const mammoth = require('mammoth');
const XLSX = require('xlsx');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const { generateOutputPath } = require('../utils/fileUtils');
const logger = require('../utils/logger');

class ConversionService {

  async wordToPDF(filePath, outputDir) {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const margin = 50;
    const lineHeight = fontSize * 1.5;

    const lines = this.wrapText(text, font, fontSize, 495);
    let currentPage = pdfDoc.addPage([595.28, 841.89]);
    let yPosition = 841.89 - margin;

    for (const line of lines) {
      if (yPosition < margin) {
        currentPage = pdfDoc.addPage([595.28, 841.89]);
        yPosition = 841.89 - margin;
      }

      currentPage.drawText(line, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      });

      yPosition -= lineHeight;
    }

    const outputPath = generateOutputPath(outputDir, path.basename(filePath), '.pdf');
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);

    return outputPath;
  }

  async textToPDF(filePath, outputDir) {
    const text = await fs.readFile(filePath, 'utf-8');

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Courier);
    const fontSize = 11;
    const margin = 50;
    const lineHeight = fontSize * 1.4;

    const lines = text.split('\n');
    let currentPage = pdfDoc.addPage([595.28, 841.89]);
    let yPosition = 841.89 - margin;

    for (const line of lines) {
      const wrappedLines = this.wrapText(line, font, fontSize, 495);

      for (const wrappedLine of wrappedLines) {
        if (yPosition < margin) {
          currentPage = pdfDoc.addPage([595.28, 841.89]);
          yPosition = 841.89 - margin;
        }

        currentPage.drawText(wrappedLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(0, 0, 0)
        });

        yPosition -= lineHeight;
      }
    }

    const outputPath = generateOutputPath(outputDir, path.basename(filePath), '.pdf');
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);

    return outputPath;
  }

  async excelToPDF(filePath, outputDir) {
    const workbook = XLSX.readFile(filePath);
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (data.length === 0) continue;

      const page = pdfDoc.addPage([841.89, 595.28]);
      const fontSize = 9;
      const cellPadding = 5;
      const startX = 30;
      let yPosition = 595.28 - 40;

      page.drawText(`Sheet: ${sheetName}`, {
        x: startX,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      yPosition -= 25;

      for (let row = 0; row < Math.min(data.length, 50); row++) {
        if (yPosition < 30) break;

        let xPosition = startX;
        const rowData = data[row];

        if (!rowData) continue;

        for (let col = 0; col < Math.min(rowData.length, 10); col++) {
          const cellValue = String(rowData[col] || '').substring(0, 20);
          const currentFont = row === 0 ? boldFont : font;

          page.drawText(cellValue, {
            x: xPosition,
            y: yPosition,
            size: fontSize,
            font: currentFont,
            color: rgb(0, 0, 0)
          });

          xPosition += 80;
        }

        yPosition -= fontSize + cellPadding * 2;
      }
    }

    const outputPath = generateOutputPath(outputDir, path.basename(filePath), '.pdf');
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);

    return outputPath;
  }

  async csvToXlsx(filePath, outputDir) {
    const csvContent = await fs.readFile(filePath, 'utf-8');
    const workbook = XLSX.read(csvContent, { type: 'string' });

    const outputPath = generateOutputPath(outputDir, path.basename(filePath), '.xlsx');
    XLSX.writeFile(workbook, outputPath);

    return outputPath;
  }

  async xlsxToCsv(filePath, outputDir) {
    const workbook = XLSX.readFile(filePath);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csvContent = XLSX.utils.sheet_to_csv(firstSheet);

    const outputPath = generateOutputPath(outputDir, path.basename(filePath), '.csv');
    await fs.writeFile(outputPath, csvContent);

    return outputPath;
  }

  async pdfToText(filePath, outputDir) {
    const pdfParse = require('pdf-parse');
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);

    const outputPath = generateOutputPath(outputDir, path.basename(filePath), '.txt');
    await fs.writeFile(outputPath, data.text);

    return outputPath;
  }

  wrapText(text, font, fontSize, maxWidth) {
    if (!text) return [''];

    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      try {
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      } catch (err) {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [''];
  }
}

module.exports = new ConversionService();