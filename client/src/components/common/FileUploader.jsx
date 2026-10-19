import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { formatFileSize, getFileIcon } from '../../utils/fileHelpers';
import { ACCEPTED_FILE_TYPES } from '../../utils/constants';

const FileUploader = ({ files, onFilesAdded, onFileRemoved, acceptedTypes = 'all', multiple = false, disabled = false }) => {
  const accept = ACCEPTED_FILE_TYPES[acceptedTypes] || ACCEPTED_FILE_TYPES.all;

  const onDrop = useCallback((accepted) => { if (accepted.length) onFilesAdded(accepted); }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, multiple, disabled, maxSize: 25 * 1024 * 1024 });

  return (
    <div className="w-full">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-sky-500 bg-sky-100/70 scale-[1.02]' : 'border-sky-300 bg-sky-50/50 hover:border-sky-400 hover:bg-sky-100/50'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${isDragActive ? 'bg-sky-500 text-white' : 'bg-sky-100'}`}>☁️</div>
          <div>
            <p className="text-lg font-semibold text-sky-800">{isDragActive ? 'Drop files here!' : 'Drag & drop files here'}</p>
            <p className="text-sky-500 mt-1">or <span className="text-sky-600 font-medium underline">browse files</span></p>
          </div>
          <p className="text-xs text-sky-400">{multiple ? 'Up to 20 files' : 'Single file'} • Max 25MB</p>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-sky-800">{files.length} file{files.length > 1 ? 's' : ''}</h3>
              <p className="text-xs text-sky-500">Total: {formatFileSize(files.reduce((a, f) => a + f.size, 0))}</p>
            </div>
            {files.map((file, i) => (
              <motion.div key={`${file.name}-${i}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-sky-100 shadow-sm">
                <span className="text-2xl">{getFileIcon(file.name)}</span>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-sky-800 truncate">{file.name}</p>
                  <p className="text-xs text-sky-400">{formatFileSize(file.size)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onFileRemoved(i); }} className="p-1.5 rounded-lg hover:bg-red-50 text-sky-300 hover:text-red-500">✕</button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;