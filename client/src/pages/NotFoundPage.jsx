import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-8xl font-bold text-sky-200">404</h1>
      <h2 className="text-2xl font-bold text-sky-800 mt-4">Page Not Found</h2>
      <p className="text-sky-500 mt-2 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">🏠 Go Home</Link>
    </div>
  </div>
);

export default NotFoundPage;