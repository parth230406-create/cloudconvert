import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => (
  <section className="relative overflow-hidden py-20 md:py-28">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200 rounded-full opacity-30 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-300 rounded-full opacity-20 blur-3xl" />
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-6">☁️ Powered by Cloud Computing</div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6">
          <span className="text-sky-900">Every tool you need to</span><br />
          <span className="bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 bg-clip-text text-transparent">work with files</span>
        </h1>
        <p className="text-lg md:text-xl text-sky-600 max-w-3xl mx-auto mb-10">Convert, compress, merge, split, and transform your PDFs, images, and documents. Free, powered by cloud infrastructure.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/tools" className="btn-primary text-lg px-8 py-4">Explore All Tools →</Link>
        <Link to="/tool/merge-pdf" className="btn-secondary text-lg px-8 py-4">Try Merge PDF</Link>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
        {[{ n: '22+', l: 'Tools' }, { n: 'Free', l: 'Always' }, { n: 'Cloud', l: 'Powered' }].map((s, i) => (
          <div key={i}><p className="text-2xl md:text-3xl font-bold text-sky-600">{s.n}</p><p className="text-sm text-sky-400 mt-1">{s.l}</p></div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;