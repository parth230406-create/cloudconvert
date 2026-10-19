import React, { useState } from 'react';
import ToolCard from '../components/common/ToolCard';
import { tools, categories, getToolsByCategory } from '../utils/toolsConfig';

const AllToolsPage = () => {
  const [active, setActive] = useState('all');
  const filtered = active === 'all' ? tools : getToolsByCategory(active);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title">All Tools</h1>
        <p className="section-subtitle mb-12">Everything you need for PDFs, images, and documents</p>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button onClick={() => setActive('all')} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${active === 'all' ? 'bg-sky-500 text-white shadow-lg' : 'bg-white text-sky-600 border border-sky-200 hover:bg-sky-50'}`}>All ({tools.length})</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${active === c.id ? 'bg-sky-500 text-white shadow-lg' : 'bg-white text-sky-600 border border-sky-200 hover:bg-sky-50'}`}>{c.name} ({getToolsByCategory(c.id).length})</button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((t, i) => <ToolCard key={t.id} tool={t} index={i} />)}
        </div>
      </div>
    </div>
  );
};

export default AllToolsPage;