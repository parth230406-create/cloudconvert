import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-sky-900 text-sky-100 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">☁️</span>
            <span className="text-xl font-bold text-white">CloudConvert</span>
          </div>
          <p className="text-sky-300 text-sm">Free online file converter powered by cloud computing. Built as a Cloud Computing curriculum project.</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/tools" className="text-sky-300 hover:text-white">All Tools</Link></li>
            <li><Link to="/tool/merge-pdf" className="text-sky-300 hover:text-white">Merge PDF</Link></li>
            <li><Link to="/tool/compress-image" className="text-sky-300 hover:text-white">Compress Image</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">PDF Tools</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/tool/split-pdf" className="text-sky-300 hover:text-white">Split PDF</Link></li>
            <li><Link to="/tool/compress-pdf" className="text-sky-300 hover:text-white">Compress PDF</Link></li>
            <li><Link to="/tool/word-to-pdf" className="text-sky-300 hover:text-white">Word to PDF</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sky-800 mt-8 pt-8 text-center text-sky-400 text-sm">
        © {new Date().getFullYear()} CloudConvert — Cloud Computing Project
      </div>
    </div>
  </footer>
);

export default Footer;