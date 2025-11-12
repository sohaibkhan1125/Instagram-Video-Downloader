import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import PreviewCard from './components/PreviewCard';
import HowItWorks from './components/HowItWorks';
import ContentSection from './components/ContentSection';
import FAQs from './components/FAQs';
import Footer from './components/Footer';
import MaintenanceMode from './components/MaintenanceMode';
import AdminRoutes from './components/admin/AdminRoutes';
import apiClient from './lib/apiClient';
import downloadHelper from './lib/downloadHelper';

function App() {
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('video');
  const previewRef = useRef(null);

  // Handle URL submission
  const handleUrlSubmit = async (url, type = 'video') => {
    setSelectedType(type);
    if (!url.trim()) {
      toast.error('Please enter a valid Instagram or TikTok URL');
      return;
    }

    if (!apiClient.validateInstagramUrl(url)) {
      toast.error('Please enter a valid Instagram or TikTok URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setVideoData(null);

    try {
      const data = await apiClient.fetchInstagramVideo(url);
      setVideoData(data);
      toast.success('Video preview loaded successfully!');
    } catch (err) {
      console.error('Error fetching video:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download
  const handleDownload = async (quality) => {
    if (!quality?.url) {
      toast.error('No download URL available');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const filename = downloadHelper.generateFilename(
        videoData.username,
        videoData.id,
        quality.label
      );

      await apiClient.downloadVideo(
        quality.url,
        filename,
        (progress) => setDownloadProgress(progress)
      );

      toast.success('Download completed successfully!');
      setIsDownloading(false);
      setDownloadProgress(0);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Download failed. Please try again.');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // Clear error when component mounts
  useEffect(() => {
    setError('');
  }, []);

  // Auto scroll to preview when video data loads
  useEffect(() => {
    if (videoData && previewRef.current) {
      previewRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [videoData]);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Main App Route */}
          <Route path="/*" element={
            <>
              <MaintenanceMode />
              <Header />
              
              <main>
                <Hero 
                  onUrlSubmit={handleUrlSubmit}
                  isLoading={isLoading}
                />
                
                {/* Preview Section */}
                <AnimatePresence>
                  {videoData && (
                    <motion.section
                      ref={previewRef}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.6 }}
                      className="py-16 bg-gray-50"
                    >
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <PreviewCard
                          videoData={videoData}
                          onDownload={handleDownload}
                          isDownloading={isDownloading}
                          downloadProgress={downloadProgress}
                          selectedType={selectedType}
                        />
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* Error State */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="py-16 bg-red-50"
                    >
                      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                          <h3 className="text-2xl font-bold text-red-600 mb-4">
                            Oops! Something went wrong
                          </h3>
                          <p className="text-gray-600 mb-6">{error}</p>
                          <button
                            onClick={() => {
                              setError('');
                              setVideoData(null);
                            }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <HowItWorks />
                <ContentSection />
                <FAQs />
              </main>
              
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
