const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const appConfig = require('./app');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, appConfig.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allFormats = Object.values(appConfig.supportedFormats).flat();
  const ext = path.extname(file.originalname).toLowerCase();

  if (allFormats.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} is not supported`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: appConfig.maxFileSize,
    files: 20
  }
});

module.exports = upload;