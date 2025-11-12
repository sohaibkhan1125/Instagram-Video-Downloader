import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ContentSection = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    // Load content from localStorage on component mount
    const loadContent = () => {
      try {
        const savedSettings = localStorage.getItem('admin_settings');
        if (savedSettings) {
          const data = JSON.parse(savedSettings);
          setContent(data.content || '');
        }
      } catch (error) {
        console.warn('Error loading content:', error);
      }
    };

    // Load content initially
    loadContent();

    // Listen for content updates from admin panel
    const handleContentUpdate = (event) => {
      setContent(event.detail.content || '');
    };

    window.addEventListener('contentUpdated', handleContentUpdate);

    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate);
    };
  }, []);

  // Don't render anything if there's no content
  if (!content || content.trim() === '') {
    return null;
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </motion.section>
  );
};

export default ContentSection;
