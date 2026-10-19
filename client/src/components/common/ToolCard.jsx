import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ToolCard = ({ tool, index = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
    <Link to={`/tool/${tool.id}`}>
      <div className="tool-card h-full">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
          {tool.icon}
        </div>
        <h3 className="text-base font-bold text-sky-800 group-hover:text-sky-600 transition-colors text-center">{tool.name}</h3>
        <p className="text-sm text-sky-500 text-center leading-relaxed">{tool.description}</p>
      </div>
    </Link>
  </motion.div>
);

export default ToolCard;