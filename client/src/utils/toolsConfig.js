export const tools = [
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one', icon: '📑', category: 'pdf-tools', color: 'from-red-400 to-red-600', acceptedTypes: 'pdf', multiple: true, apiEndpoint: 'pdf', apiAction: 'merge' },
  { id: 'split-pdf', name: 'Split PDF', description: 'Split PDF into separate pages', icon: '✂️', category: 'pdf-tools', color: 'from-orange-400 to-orange-600', acceptedTypes: 'pdf', multiple: false, apiEndpoint: 'pdf', apiAction: 'split', hasOptions: true },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size', icon: '📦', category: 'pdf-tools', color: 'from-green-400 to-green-600', acceptedTypes: 'pdf', multiple: false, apiEndpoint: 'pdf', apiAction: 'compress' },
  { id: 'image-to-pdf', name: 'Image to PDF', description: 'Convert images to PDF', icon: '🖼️', category: 'pdf-tools', color: 'from-purple-400 to-purple-600', acceptedTypes: 'images', multiple: true, apiEndpoint: 'pdf', apiAction: 'fromImages' },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word docs to PDF', icon: '📝', category: 'pdf-tools', color: 'from-blue-500 to-blue-700', acceptedTypes: 'documents', multiple: false, apiEndpoint: 'convert', apiAction: 'word-to-pdf' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert spreadsheets to PDF', icon: '📊', category: 'pdf-tools', color: 'from-green-500 to-green-700', acceptedTypes: 'spreadsheets', multiple: false, apiEndpoint: 'convert', apiAction: 'excel-to-pdf' },
  { id: 'txt-to-pdf', name: 'Text to PDF', description: 'Convert text files to PDF', icon: '📃', category: 'pdf-tools', color: 'from-gray-400 to-gray-600', acceptedTypes: 'documents', multiple: false, apiEndpoint: 'convert', apiAction: 'txt-to-pdf' },
  { id: 'add-page-numbers', name: 'Page Numbers', description: 'Add page numbers to PDF', icon: '🔢', category: 'pdf-tools', color: 'from-teal-400 to-teal-600', acceptedTypes: 'pdf', multiple: false, apiEndpoint: 'pdf', apiAction: 'addPageNumbers', hasOptions: true },
  { id: 'add-watermark', name: 'Watermark', description: 'Add text watermark to PDF', icon: '💧', category: 'pdf-tools', color: 'from-indigo-400 to-indigo-600', acceptedTypes: 'pdf', multiple: false, apiEndpoint: 'pdf', apiAction: 'addWatermark', hasOptions: true },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages', icon: '🔄', category: 'pdf-tools', color: 'from-pink-400 to-pink-600', acceptedTypes: 'pdf', multiple: false, apiEndpoint: 'pdf', apiAction: 'rotate', hasOptions: true },
  { id: 'protect-pdf', name: 'Protect PDF', description: 'Add password to PDF', icon: '🔒', category: 'pdf-tools', color: 'from-yellow-400 to-yellow-600', acceptedTypes: 'pdf', multiple: false, apiEndpoint: 'pdf', apiAction: 'protect', hasOptions: true },
  { id: 'extract-pages', name: 'Extract Pages', description: 'Extract specific pages', icon: '📄', category: 'pdf-tools', color: 'from-cyan-400 to-cyan-600', acceptedTypes: 'pdf', multiple: false, apiEndpoint: 'pdf', apiAction: 'extractPages', hasOptions: true },
  { id: 'compress-image', name: 'Compress Image', description: 'Reduce image file size', icon: '🗜️', category: 'image-tools', color: 'from-emerald-400 to-emerald-600', acceptedTypes: 'images', multiple: false, apiEndpoint: 'image', apiAction: 'compress', hasOptions: true },
  { id: 'resize-image', name: 'Resize Image', description: 'Change image dimensions', icon: '↔️', category: 'image-tools', color: 'from-violet-400 to-violet-600', acceptedTypes: 'images', multiple: false, apiEndpoint: 'image', apiAction: 'resize', hasOptions: true },
  { id: 'crop-image', name: 'Crop Image', description: 'Crop image to area', icon: '✂️', category: 'image-tools', color: 'from-fuchsia-400 to-fuchsia-600', acceptedTypes: 'images', multiple: false, apiEndpoint: 'image', apiAction: 'crop', hasOptions: true },
  { id: 'rotate-image', name: 'Rotate Image', description: 'Rotate image by angle', icon: '🔃', category: 'image-tools', color: 'from-rose-400 to-rose-600', acceptedTypes: 'images', multiple: false, apiEndpoint: 'image', apiAction: 'rotate', hasOptions: true },
  { id: 'convert-image', name: 'Convert Image', description: 'Convert between image formats', icon: '🔄', category: 'image-tools', color: 'from-sky-400 to-sky-600', acceptedTypes: 'images', multiple: false, apiEndpoint: 'image', apiAction: 'convert', hasOptions: true },
  { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG to PNG', icon: '🖼️', category: 'convert', color: 'from-sky-400 to-blue-500', acceptedTypes: 'images', multiple: false, apiEndpoint: 'convert', apiAction: 'jpg-to-png' },
  { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG to JPG', icon: '🖼️', category: 'convert', color: 'from-blue-400 to-indigo-500', acceptedTypes: 'images', multiple: false, apiEndpoint: 'convert', apiAction: 'png-to-jpg' },
  { id: 'webp-to-jpg', name: 'WebP to JPG', description: 'Convert WebP to JPG', icon: '🖼️', category: 'convert', color: 'from-teal-400 to-green-500', acceptedTypes: 'images', multiple: false, apiEndpoint: 'convert', apiAction: 'webp-to-jpg' },
  { id: 'csv-to-xlsx', name: 'CSV to Excel', description: 'Convert CSV to Excel', icon: '📊', category: 'convert', color: 'from-green-400 to-emerald-600', acceptedTypes: 'spreadsheets', multiple: false, apiEndpoint: 'convert', apiAction: 'csv-to-xlsx' },
  { id: 'xlsx-to-csv', name: 'Excel to CSV', description: 'Convert Excel to CSV', icon: '📊', category: 'convert', color: 'from-emerald-400 to-teal-600', acceptedTypes: 'spreadsheets', multiple: false, apiEndpoint: 'convert', apiAction: 'xlsx-to-csv' },
];

export const getToolById = (id) => tools.find(t => t.id === id);
export const getToolsByCategory = (cat) => tools.filter(t => t.category === cat);

export const categories = [
  { id: 'pdf-tools', name: 'PDF Tools', description: 'All tools to work with PDFs' },
  { id: 'image-tools', name: 'Image Tools', description: 'Compress, resize, crop, convert images' },
  { id: 'convert', name: 'File Converter', description: 'Convert between formats' },
];