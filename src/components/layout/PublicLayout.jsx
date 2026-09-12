import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingCTA from './FloatingCTA';

export default function PublicLayout({ children, settings }) {
  const location = useLocation();

  // Smooth scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-warm-white text-brand-text selection:bg-brand-blue selection:text-brand-text">
      <Navbar settings={settings} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
      <FloatingCTA settings={settings} />
    </div>
  );
}
