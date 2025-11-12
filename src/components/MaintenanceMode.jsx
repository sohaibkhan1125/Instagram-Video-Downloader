import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Clock, ArrowLeft, RefreshCw } from 'lucide-react';

const MaintenanceMode = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if maintenance mode is enabled
    const checkMaintenanceMode = () => {
      const maintenanceMode = localStorage.getItem('maintenanceMode');
      const isEnabled = maintenanceMode === 'true';
      setIsVisible(isEnabled);
    };

    // Check on mount
    checkMaintenanceMode();

    // Listen for maintenance mode changes
    const handleMaintenanceModeChange = (event) => {
      setIsVisible(event.detail.enabled);
    };

    window.addEventListener('maintenanceModeChanged', handleMaintenanceModeChange);

    // Also listen for storage changes (in case of multiple tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'maintenanceMode') {
        checkMaintenanceMode();
      }
    });

    return () => {
      window.removeEventListener('maintenanceModeChanged', handleMaintenanceModeChange);
      window.removeEventListener('storage', checkMaintenanceMode);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
        >
          {/* Icon */}
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Wrench className="w-10 h-10 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            We'll Be Right Back
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-xl text-white/80 mb-8"
          >
            We're currently performing scheduled maintenance to improve your experience.
          </motion.p>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-semibold text-white">Maintenance in Progress</span>
            </div>
            <p className="text-white/70">
              Our team is working hard to bring you an even better experience. 
              We'll be back online shortly.
            </p>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {[
              { icon: '⚡', title: 'Faster Performance', desc: 'Optimized loading speeds' },
              { icon: '🔒', title: 'Enhanced Security', desc: 'Improved data protection' },
              { icon: '✨', title: 'New Features', desc: 'Exciting updates coming' }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-lg border border-white/20"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Page</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="mt-8 pt-6 border-t border-white/20"
          >
            <p className="text-white/60 text-sm">
              Thank you for your patience. We appreciate your understanding.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MaintenanceMode;
