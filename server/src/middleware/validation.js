function validateFileExists(req, res, next) {
  if (!req.file && (!req.files || req.files.length === 0)) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  next();
}

function validateConversionType(req, res, next) {
  const validTypes = [
    'word-to-pdf', 'excel-to-pdf', 'text-to-pdf',
    'csv-to-excel', 'excel-to-csv'
  ];
  const type = req.params.type;
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: `Invalid conversion type: ${type}` });
  }
  next();
}

module.exports = { validateFileExists, validateConversionType };