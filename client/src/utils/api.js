import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

const api = axios.create({ baseURL: API_BASE_URL, timeout: 120000 });

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.code === 'ECONNABORTED') err.message = 'Request timed out. File may be too large.';
    if (!err.response) err.message = 'Server waking up... please wait ~30s and try again.';
    return Promise.reject(err);
  }
);

const post = (url, formData, onProgress) => api.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: onProgress });

export const pdfAPI = {
  merge: (fd, p) => post('/pdf/merge', fd, p),
  split: (fd, p) => post('/pdf/split', fd, p),
  compress: (fd, p) => post('/pdf/compress', fd, p),
  fromImages: (fd, p) => post('/pdf/from-images', fd, p),
  addPageNumbers: (fd, p) => post('/pdf/add-page-numbers', fd, p),
  addWatermark: (fd, p) => post('/pdf/add-watermark', fd, p),
  rotate: (fd, p) => post('/pdf/rotate', fd, p),
  protect: (fd, p) => post('/pdf/protect', fd, p),
  extractPages: (fd, p) => post('/pdf/extract-pages', fd, p),
};

export const imageAPI = {
  convert: (fd, p) => post('/image/convert', fd, p),
  compress: (fd, p) => post('/image/compress', fd, p),
  resize: (fd, p) => post('/image/resize', fd, p),
  crop: (fd, p) => post('/image/crop', fd, p),
  rotate: (fd, p) => post('/image/rotate', fd, p),
};

export const convertAPI = {
  convert: (type, fd, p) => post(`/convert/${type}`, fd, p),
  getSupportedConversions: () => api.get('/convert/supported'),
};

export const getDownloadUrl = (filename) => {
  if (process.env.NODE_ENV === 'production') return `/downloads/${filename}`;
  return `${(process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '')}/downloads/${filename}`;
};

export default api;