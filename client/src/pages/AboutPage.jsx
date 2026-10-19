import React from 'react';

const tech = [
  { name: 'React.js', desc: 'Frontend framework', icon: '⚛️' },
  { name: 'Node.js', desc: 'Runtime environment', icon: '🟢' },
  { name: 'Express.js', desc: 'Backend framework', icon: '🚂' },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS', icon: '🎨' },
  { name: 'Render.com', desc: 'Cloud hosting (PaaS)', icon: '☁️' },
  { name: 'Docker', desc: 'Containerization', icon: '🐳' },
];

const AboutPage = () => (
  <div className="py-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="section-title mb-4">About CloudConvert</h1>
      <p className="section-subtitle mb-12">A cloud computing project providing free online file conversion tools</p>
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-bold text-sky-800 mb-4">Project Overview</h2>
        <p className="text-sky-600 leading-relaxed mb-4">CloudConvert is a comprehensive file conversion platform built as part of an Engineering Cloud Computing curriculum. It demonstrates practical application of cloud computing concepts including PaaS deployment, scalable architecture, and modern web development.</p>
        <p className="text-sky-600 leading-relaxed">The platform supports 22+ file operations including PDF manipulation, image conversion, and document transformation — all processed on cloud infrastructure.</p>
      </div>
      <h2 className="text-2xl font-bold text-sky-800 mb-6 text-center">Technology Stack</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {tech.map((t, i) => (
          <div key={i} className="card p-6 text-center">
            <div className="text-4xl mb-3">{t.icon}</div>
            <h3 className="font-bold text-sky-800">{t.name}</h3>
            <p className="text-sm text-sky-500">{t.desc}</p>
          </div>
        ))}
      </div>
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-sky-800 mb-4">Cloud Architecture</h2>
        <ul className="space-y-3 text-sky-600">
          <li className="flex items-start gap-3"><span className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" /><span><strong>Render.com (PaaS):</strong> Hosts the Node.js backend and React frontend as a single web service</span></li>
          <li className="flex items-start gap-3"><span className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" /><span><strong>Ephemeral Storage:</strong> Local disk with automated cron cleanup every 15 minutes</span></li>
          <li className="flex items-start gap-3"><span className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" /><span><strong>Security:</strong> Helmet.js, CORS, rate limiting, file validation</span></li>
          <li className="flex items-start gap-3"><span className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" /><span><strong>CI/CD:</strong> Auto-deploy on git push via GitHub integration</span></li>
        </ul>
      </div>
    </div>
  </div>
);

export default AboutPage;