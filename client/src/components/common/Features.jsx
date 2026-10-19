import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { icon: '☁️', title: 'Cloud Powered', desc: 'Deployed on cloud infrastructure for reliable processing.' },
  { icon: '🔒', title: 'Secure', desc: 'Files auto-deleted after processing. Your data stays private.' },
  { icon: '⚡', title: 'Fast', desc: 'Lightning-fast processing powered by optimized libraries.' },
  { icon: '🛠️', title: '22+ Tools', desc: 'PDF, image, document converters and much more.' },
  { icon: '📱', title: 'Responsive', desc: 'Works on desktop, tablet, and mobile devices.' },
  { icon: '🗑️', title: 'Auto Cleanup', desc: 'Files cleaned up automatically within 30 minutes.' },
];

const Features = () => (
  <section className="py-20 bg-white/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="section-title mb-4">Why CloudConvert?</h2>
      <p className="section-subtitle mb-16">Built with modern cloud technologies for the best experience.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="card p-6 text-center group">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-lg font-bold text-sky-800 mb-2">{f.title}</h3>
            <p className="text-sky-500 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;