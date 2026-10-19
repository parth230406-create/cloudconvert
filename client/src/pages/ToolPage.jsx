import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getToolById } from '../utils/toolsConfig';
import FileUploader from '../components/common/FileUploader';
import ProgressBar from '../components/common/ProgressBar';
import DownloadButton from '../components/common/DownloadButton';
import useFileUpload from '../hooks/useFileUpload';
import useConversion from '../hooks/useConversion';
import NotFoundPage from './NotFoundPage';

const ToolPage = () => {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  const { files, addFiles, removeFile, clearFiles, hasFiles } = useFileUpload(tool?.multiple ? 20 : 1);
  const { isProcessing, progress, result, error, processFiles, reset } = useConversion();
  const [options, setOptions] = useState({ quality: 70, format: 'png', position: 'bottom-center', fontSize: 12, text: 'WATERMARK', opacity: 0.3, rotation: 45, angle: 90, password: '', pages: '', ranges: '', width: '', height: '', percentage: '', left: 0, top: 0, cropWidth: '', cropHeight: '' });

  if (!tool) return <NotFoundPage />;

  const set = (k, v) => setOptions(p => ({ ...p, [k]: v }));

  const handleProcess = async () => {
    const fd = new FormData();
    if (tool.multiple) files.forEach(f => fd.append('files', f));
    else fd.append('file', files[0]);

    if (tool.apiAction === 'compress') fd.append('quality', options.quality);
    if (tool.apiAction === 'convert' && tool.apiEndpoint === 'image') fd.append('format', options.format);
    if (tool.apiAction === 'addPageNumbers') { fd.append('position', options.position); fd.append('fontSize', options.fontSize); }
    if (tool.apiAction === 'addWatermark') { fd.append('text', options.text); fd.append('fontSize', options.fontSize); fd.append('opacity', options.opacity); fd.append('rotation', options.rotation); }
    if (tool.apiAction === 'rotate') fd.append('angle', options.angle);
    if (tool.apiAction === 'protect') fd.append('password', options.password);
    if (tool.apiAction === 'split' && options.ranges) fd.append('ranges', options.ranges);
    if (tool.apiAction === 'extractPages') fd.append('pages', options.pages);
    if (tool.apiAction === 'resize') { if (options.width) fd.append('width', options.width); if (options.height) fd.append('height', options.height); if (options.percentage) fd.append('percentage', options.percentage); }
    if (tool.apiAction === 'crop') { fd.append('left', options.left); fd.append('top', options.top); fd.append('width', options.cropWidth); fd.append('height', options.cropHeight); }

    await processFiles(tool.apiEndpoint, tool.apiAction, fd);
  };

  const handleReset = () => { clearFiles(); reset(); };

  const renderOptions = () => {
    if (!tool.hasOptions) return null;
    const box = "mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100";
    const label = "block text-sm font-semibold text-sky-800 mb-2";
    const input = "w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 focus:border-transparent";

    switch (tool.apiAction) {
      case 'compress':
        return <div className={box}><label className={label}>Quality: {options.quality}%</label><input type="range" min="10" max="100" value={options.quality} onChange={e => set('quality', e.target.value)} className="w-full accent-sky-500" /><div className="flex justify-between text-xs text-sky-400 mt-1"><span>Max Compression</span><span>Best Quality</span></div></div>;
      case 'convert':
        if (tool.apiEndpoint === 'image') return <div className={box}><label className={label}>Output Format</label><div className="flex flex-wrap gap-2">{['jpg', 'png', 'webp', 'tiff', 'gif'].map(f => <button key={f} onClick={() => set('format', f)} className={`px-4 py-2 rounded-lg text-sm font-medium ${options.format === f ? 'bg-sky-500 text-white' : 'bg-white text-sky-600 border border-sky-200'}`}>{f.toUpperCase()}</button>)}</div></div>;
        return null;
      case 'addPageNumbers':
        return <div className={box}><label className={label}>Position</label><select value={options.position} onChange={e => set('position', e.target.value)} className={input}><option value="bottom-center">Bottom Center</option><option value="bottom-left">Bottom Left</option><option value="bottom-right">Bottom Right</option><option value="top-center">Top Center</option></select><label className={`${label} mt-4`}>Font Size</label><input type="number" value={options.fontSize} onChange={e => set('fontSize', e.target.value)} className={input} min="8" max="36" /></div>;
      case 'addWatermark':
        return <div className={box}><label className={label}>Text</label><input type="text" value={options.text} onChange={e => set('text', e.target.value)} className={input} /><label className={`${label} mt-4`}>Opacity: {(options.opacity * 100).toFixed(0)}%</label><input type="range" min="0.1" max="1" step="0.1" value={options.opacity} onChange={e => set('opacity', e.target.value)} className="w-full accent-sky-500" /><label className={`${label} mt-4`}>Rotation: {options.rotation}°</label><input type="range" min="-180" max="180" value={options.rotation} onChange={e => set('rotation', e.target.value)} className="w-full accent-sky-500" /></div>;
      case 'rotate':
        return <div className={box}><label className={label}>Angle</label><div className="flex gap-3">{[90, 180, 270].map(a => <button key={a} onClick={() => set('angle', a)} className={`px-4 py-2 rounded-lg text-sm font-medium ${parseInt(options.angle) === a ? 'bg-sky-500 text-white' : 'bg-white text-sky-600 border border-sky-200'}`}>{a}°</button>)}</div></div>;
      case 'protect':
        return <div className={box}><label className={label}>Password</label><input type="password" value={options.password} onChange={e => set('password', e.target.value)} className={input} placeholder="Enter password" /></div>;
      case 'split':
        return <div className={box}><label className={label}>Page Ranges (optional)</label><input type="text" value={options.ranges} onChange={e => set('ranges', e.target.value)} className={input} placeholder="e.g., 1-3, 5-7, 9" /></div>;
      case 'extractPages':
        return <div className={box}><label className={label}>Pages to Extract</label><input type="text" value={options.pages} onChange={e => set('pages', e.target.value)} className={input} placeholder="e.g., 1, 3, 5-7" required /></div>;
      case 'resize':
        return <div className={box}><div className="grid grid-cols-2 gap-4"><div><label className={label}>Width (px)</label><input type="number" value={options.width} onChange={e => set('width', e.target.value)} className={input} /></div><div><label className={label}>Height (px)</label><input type="number" value={options.height} onChange={e => set('height', e.target.value)} className={input} /></div></div><label className={`${label} mt-4`}>Or Percentage (%)</label><input type="number" value={options.percentage} onChange={e => set('percentage', e.target.value)} className={input} placeholder="e.g., 50" /></div>;
      case 'crop':
        return <div className={box}><div className="grid grid-cols-2 gap-4"><div><label className={label}>Left</label><input type="number" value={options.left} onChange={e => set('left', e.target.value)} className={input} /></div><div><label className={label}>Top</label><input type="number" value={options.top} onChange={e => set('top', e.target.value)} className={input} /></div><div><label className={label}>Width*</label><input type="number" value={options.cropWidth} onChange={e => set('cropWidth', e.target.value)} className={input} required /></div><div><label className={label}>Height*</label><input type="number" value={options.cropHeight} onChange={e => set('cropHeight', e.target.value)} className={input} required /></div></div></div>;
      default: return null;
    }
  };

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/tools" className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-700 font-medium mb-6">← All Tools</Link>
        <div className="text-center mb-8">
          <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl`}>{tool.icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-sky-900">{tool.name}</h1>
          <p className="text-sky-500 mt-2 text-lg">{tool.description}</p>
        </div>
        <div className="card p-6 md:p-8">
          {!result ? (
            <>
              <FileUploader files={files} onFilesAdded={addFiles} onFileRemoved={removeFile} acceptedTypes={tool.acceptedTypes} multiple={tool.multiple} disabled={isProcessing} />
              {renderOptions()}
              <ProgressBar progress={progress} isProcessing={isProcessing} />
              {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
              {hasFiles && !isProcessing && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button onClick={handleProcess} className="btn-primary flex-grow flex items-center justify-center gap-2" disabled={isProcessing}>
                    {isProcessing ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : tool.name}
                  </button>
                  <button onClick={handleReset} className="btn-secondary" disabled={isProcessing}>Clear</button>
                </div>
              )}
            </>
          ) : <DownloadButton result={result} onReset={handleReset} />}
        </div>
      </div>
    </div>
  );
};

export default ToolPage;