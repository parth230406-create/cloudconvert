import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/common/HeroSection';
import Features from '../components/common/Features';
import ToolCard from '../components/common/ToolCard';
import { categories, getToolsByCategory } from '../utils/toolsConfig';

const HomePage = () => (
  <div>
    <HeroSection />
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((cat, ci) => (
          <div key={cat.id} className={ci > 0 ? 'mt-16' : ''}>
            <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mb-2">{cat.name}</h2>
            <p className="text-sky-500 mb-8">{cat.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {getToolsByCategory(cat.id).slice(0, 5).map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
    <Features />
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="card p-12 bg-gradient-to-br from-sky-500 to-sky-700 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Convert?</h2>
          <p className="text-sky-100 text-lg mb-8">Choose from 22+ tools to convert, compress, merge, and transform your files.</p>
          <Link to="/tools" className="inline-flex items-center gap-2 bg-white text-sky-600 font-bold py-4 px-8 rounded-xl hover:bg-sky-50 transition-all text-lg">Get Started Free →</Link>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;