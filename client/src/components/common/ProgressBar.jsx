import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, isProcessing }) => {
  if (!isProcessing && progress === 0) return null;
  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-sky-700">{progress < 100 ? 'Processing...' : 'Complete!'}</span>
        <span className="text-sm font-bold text-sky-600">{progress}%</span>
      </div>
      <div className="w-full bg-sky-100 rounded-full h-3 overflow-hidden">
        <motion.div className={`h-full rounded-full ${progress === 100 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-sky-400 to-sky-500'}`} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </div>
      {isProcessing && progress < 100 && (
        <div className="flex items-center gap-2 mt-3">
          <div className="loader w-5 h-5 border-2" />
          <span className="text-sm text-sky-500">Processing your file...</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;