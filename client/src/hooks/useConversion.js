import { useState, useCallback } from 'react';
import { pdfAPI, imageAPI, convertAPI } from '../utils/api';
import toast from 'react-hot-toast';

const useConversion = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onProgress = (e) => { setProgress(Math.min(Math.round((e.loaded * 100) / e.total), 95)); };

  const processFiles = useCallback(async (endpoint, action, formData) => {
    setIsProcessing(true);
    setProgress(0);
    setResult(null);
    setError(null);
    try {
      let res;
      if (endpoint === 'pdf') res = await pdfAPI[action](formData, onProgress);
      else if (endpoint === 'image') res = await imageAPI[action](formData, onProgress);
      else if (endpoint === 'convert') res = await convertAPI.convert(action, formData, onProgress);
      else throw new Error('Invalid endpoint');
      setProgress(100);
      setResult(res.data);
      toast.success(res.data.message || 'Done!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Error occurred';
      setError(msg);
      toast.error(msg);
    } finally { setIsProcessing(false); }
  }, []);

  const reset = useCallback(() => { setIsProcessing(false); setProgress(0); setResult(null); setError(null); }, []);

  return { isProcessing, progress, result, error, processFiles, reset };
};

export default useConversion;