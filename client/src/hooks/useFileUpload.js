import { useState, useCallback } from 'react';
import { formatFileSize } from '../utils/fileHelpers';

const useFileUpload = (maxFiles = 20, maxSize = 25 * 1024 * 1024) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const addFiles = useCallback((newFiles) => {
    setError(null);
    const valid = [];
    for (const f of newFiles) {
      if (f.size > maxSize) { setError(`"${f.name}" exceeds ${formatFileSize(maxSize)}`); continue; }
      valid.push(f);
    }
    setFiles(prev => {
      const combined = [...prev, ...valid];
      if (combined.length > maxFiles) { setError(`Max ${maxFiles} files`); return combined.slice(0, maxFiles); }
      return combined;
    });
  }, [maxFiles, maxSize]);

  const removeFile = useCallback((i) => { setFiles(prev => prev.filter((_, idx) => idx !== i)); setError(null); }, []);
  const clearFiles = useCallback(() => { setFiles([]); setError(null); }, []);

  return { files, error, addFiles, removeFile, clearFiles, hasFiles: files.length > 0, fileCount: files.length };
};

export default useFileUpload;