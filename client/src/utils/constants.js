export const FILE_SIZE_LIMIT = 25 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = {
  pdf: { 'application/pdf': ['.pdf'] },
  images: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/gif': ['.gif'], 'image/bmp': ['.bmp'], 'image/webp': ['.webp'], 'image/tiff': ['.tiff'], 'image/svg+xml': ['.svg'] },
  documents: { 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'], 'text/html': ['.html', '.htm'] },
  spreadsheets: { 'application/vnd.ms-excel': ['.xls'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'text/csv': ['.csv'] },
  all: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/*': ['.txt', '.csv', '.html'] }
};