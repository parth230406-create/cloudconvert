import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Processing...' }) => {
  const s = { sm: 'w-6 h-6 border-2', md: 'w-10 h-10 border-3', lg: 'w-16 h-16 border-4' };
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className={`${s[size]} border-sky-200 border-t-sky-500 rounded-full animate-spin`} />
      {text && <p className="text-sky-600 font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;