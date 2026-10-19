const express = require('express');
const router = express.Router();
const c = require('../controllers/convertController');
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: path.join(__dirname, '../../uploads'),
  limits: { fileSize: 25 * 1024 * 1024 }
});

router.get('/supported', (req, res) => {
  res.json({
    success: true,
    conversions: [
      'word-to-pdf',
      'excel-to-pdf',
      'text-to-pdf',
      'csv-to-excel',
      'excel-to-csv'
    ]
  });
});

router.post('/word-to-pdf', upload.single('file'), c.wordToPdf);
router.post('/excel-to-pdf', upload.single('file'), c.excelToPdf);
router.post('/text-to-pdf', upload.single('file'), c.textToPdf);
router.post('/csv-to-excel', upload.single('file'), c.csvToExcel);
router.post('/excel-to-csv', upload.single('file'), c.excelToCsv);

module.exports = router;