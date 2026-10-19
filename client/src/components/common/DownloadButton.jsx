import React from 'react';
import { motion } from 'framer-motion';
import useDownload from '../../hooks/useDownload';

const DownloadButton = ({ result, onReset }) => {
  const { downloadFile } = useDownload();
  if (!result || !result.success) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">✅</span>
        <div>
          <h3 className="text-lg font-bold text-green-800">{result.message}</h3>
          {result.stats && <p className="text-sm text-green-600">{result.stats.originalSize} → {result.stats.compressedSize} ({result.stats.reduction} reduction)</p>}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => downloadFile(result.file.name)} className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 shadow-lg">
          ⬇️ Download ({result.file.size})
        </button>
        <button onClick={onReset} className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-sky-600 font-semibold py-3 px-6 rounded-xl border-2 border-sky-200 transition-all">
          Process Another File
        </button>
      </div>
    </motion.div>
  );
};

export default DownloadButton;