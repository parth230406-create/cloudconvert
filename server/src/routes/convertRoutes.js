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
      'txt-to-pdf',
      'text-to-pdf',
      'csv-to-xlsx',
      'csv-to-excel',
      'xlsx-to-csv',
      'excel-to-csv',
      'jpg-to-png',
      'png-to-jpg',
      'webp-to-jpg'
    ]
  });
});

// Document conversions
router.post('/word-to-pdf', upload.single('file'), c.wordToPdf);
router.post('/excel-to-pdf', upload.single('file'), c.excelToPdf);

// Text to PDF — support both names used by frontend
router.post('/txt-to-pdf', upload.single('file'), c.textToPdf);
router.post('/text-to-pdf', upload.single('file'), c.textToPdf);

// CSV ↔ Excel — support both names
router.post('/csv-to-xlsx', upload.single('file'), c.csvToExcel);
router.post('/csv-to-excel', upload.single('file'), c.csvToExcel);
router.post('/xlsx-to-csv', upload.single('file'), c.excelToCsv);
router.post('/excel-to-csv', upload.single('file'), c.excelToCsv);

// Image format conversions used from "convert" category
router.post('/jpg-to-png', upload.single('file'), c.imageConvert('png'));
router.post('/png-to-jpg', upload.single('file'), c.imageConvert('jpg'));
router.post('/webp-to-jpg', upload.single('file'), c.imageConvert('jpg'));

module.exports = router;