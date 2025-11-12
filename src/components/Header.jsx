import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [websiteTitle, setWebsiteTitle] = useState('InstaDownloader');
  const [websiteLogo, setWebsiteLogo] = useState('');

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedTitle = localStorage.getItem('websiteTitle');
    const savedLogo = localStorage.getItem('websiteLogo');
    
    if (savedTitle) {
      setWebsiteTitle(savedTitle);
    }
    
    if (savedLogo) {
      setWebsiteLogo(savedLogo);
    }
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const handleTitleChange = (event) => {
      setWebsiteTitle(event.detail.title);
    };

    const handleLogoChange = (event) => {
      setWebsiteLogo(event.detail.logo);
    };

    window.addEventListener('websiteTitleChanged', handleTitleChange);
    window.addEventListener('websiteLogoChanged', handleLogoChange);

    return () => {
      window.removeEventListener('websiteTitleChanged', handleTitleChange);
      window.removeEventListener('websiteLogoChanged', handleLogoChange);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', id: 'hero' },
    { name: 'How it works', id: 'how-it-works' },
    { name: 'FAQs', id: 'faqs' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            {websiteLogo ? (
              <img
                src={websiteLogo}
                alt="Website Logo"
                className="w-8 h-8 object-contain rounded-lg"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {websiteTitle}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('hero')}
            className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center space-x-2 w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
