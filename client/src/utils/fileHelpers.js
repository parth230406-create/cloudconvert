export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, s = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + s[i];
};

export const getFileExtension = (name) => name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();

export const getFileIcon = (name) => {
  const icons = { pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊', csv: '📊', ppt: '📋', pptx: '📋', jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️', bmp: '🖼️', tiff: '🖼️', txt: '📃', html: '🌐', zip: '📦' };
  return icons[getFileExtension(name)] || '📁';
};