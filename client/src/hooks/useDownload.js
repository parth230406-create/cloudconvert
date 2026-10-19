import { useCallback } from 'react';
import { getDownloadUrl } from '../utils/api';
import toast from 'react-hot-toast';

const useDownload = () => {
  const downloadFile = useCallback((filename) => {
    try {
      const a = document.createElement('a');
      a.href = getDownloadUrl(filename);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download started!');
    } catch { toast.error('Download failed'); }
  }, []);
  return { downloadFile };
};

export default useDownload;