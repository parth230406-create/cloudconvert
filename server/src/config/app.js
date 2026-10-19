module.exports = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 25 * 1024 * 1024,
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  outputDir: process.env.OUTPUT_DIR || './outputs',
  supportedFormats: {
    pdf: ['.pdf'],
    image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.svg', '.ico'],
    document: ['.doc', '.docx', '.odt', '.rtf', '.txt'],
    spreadsheet: ['.xls', '.xlsx', '.csv', '.ods'],
    presentation: ['.ppt', '.pptx', '.odp'],
    archive: ['.zip', '.rar', '.7z'],
    web: ['.html', '.htm']
  },
  conversionMatrix: {
    'pdf-to-jpg': { input: '.pdf', output: '.jpg' },
    'pdf-to-png': { input: '.pdf', output: '.png' },
    'word-to-pdf': { input: ['.doc', '.docx'], output: '.pdf' },
    'excel-to-pdf': { input: ['.xls', '.xlsx'], output: '.pdf' },
    'image-to-pdf': { input: ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp', '.tiff'], output: '.pdf' },
    'html-to-pdf': { input: ['.html', '.htm'], output: '.pdf' },
    'txt-to-pdf': { input: ['.txt'], output: '.pdf' },
    'jpg-to-png': { input: '.jpg', output: '.png' },
    'png-to-jpg': { input: '.png', output: '.jpg' },
    'webp-to-jpg': { input: '.webp', output: '.jpg' },
    'jpg-to-webp': { input: '.jpg', output: '.webp' },
    'png-to-webp': { input: '.png', output: '.webp' },
    'bmp-to-jpg': { input: '.bmp', output: '.jpg' },
    'gif-to-jpg': { input: '.gif', output: '.jpg' },
    'tiff-to-jpg': { input: '.tiff', output: '.jpg' },
    'svg-to-png': { input: '.svg', output: '.png' },
    'csv-to-xlsx': { input: '.csv', output: '.xlsx' },
    'xlsx-to-csv': { input: '.xlsx', output: '.csv' }
  }
};