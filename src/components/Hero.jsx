import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Link, Sparkles } from 'lucide-react';
import UrlInput from './UrlInput';

const Hero = ({ onUrlSubmit, isLoading }) => {
  const [heroTitle, setHeroTitle] = useState('Download Instagram & TikTok\nVideos & Reels');
  const [heroDescription, setHeroDescription] = useState('Save your favorite Instagram posts, reels, stories, photos and TikTok videos in high quality. Fast, secure, and completely free.');

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedTitle = localStorage.getItem('heroTitle');
    const savedDescription = localStorage.getItem('heroDescription');
    
    if (savedTitle) {
      setHeroTitle(savedTitle);
    }
    
    if (savedDescription) {
      setHeroDescription(savedDescription);
    }
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const handleTitleChange = (event) => {
      setHeroTitle(event.detail.title);
    };

    const handleDescriptionChange = (event) => {
      setHeroDescription(event.detail.description);
    };

    window.addEventListener('heroTitleChanged', handleTitleChange);
    window.addEventListener('heroDescriptionChanged', handleDescriptionChange);

    return () => {
      window.removeEventListener('heroTitleChanged', handleTitleChange);
      window.removeEventListener('heroDescriptionChanged', handleDescriptionChange);
    };
  }, []);

  // Split title by newlines for display
  const titleLines = heroTitle.split('\n');

  return (
    <section id="hero" className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
            >
              {titleLines.length > 0 && titleLines[0] && (
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  {titleLines[0]}
                </span>
              )}
              {titleLines.length > 1 && (
                <>
                  <br />
                  <span className="text-gray-900">
                    {titleLines[1]}
                  </span>
                </>
              )}
              {titleLines.length === 0 && (
                <>
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                    Download Instagram & TikTok
                  </span>
                  <br />
                  <span className="text-gray-900">Videos & Reels</span>
                </>
              )}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              {heroDescription || 'Save your favorite Instagram posts, reels, stories, photos and TikTok videos in high quality. Fast, secure, and completely free.'}
            </motion.p>
          </motion.div>

          {/* URL Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <UrlInput onUrlSubmit={onUrlSubmit} isLoading={isLoading} />
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                icon: <Download className="w-8 h-8 text-purple-600" />,
                title: "High Quality",
                description: "Download in original quality up to 1080p"
              },
              {
                icon: <Sparkles className="w-8 h-8 text-pink-600" />,
                title: "Fast & Secure",
                description: "Quick downloads with privacy protection"
              },
              {
                icon: <Link className="w-8 h-8 text-red-600" />,
                title: "Easy to Use",
                description: "Just paste the link and download"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
