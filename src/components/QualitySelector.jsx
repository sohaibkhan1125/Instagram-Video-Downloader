import React from 'react';
import { motion } from 'framer-motion';
import { Check, Download } from 'lucide-react';
import downloadHelper from '../lib/downloadHelper';

const QualitySelector = ({ qualities, selectedQuality, onQualityChange }) => {
  if (!qualities || qualities.length <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <h4 className="text-lg font-semibold text-gray-900">Choose Quality</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {qualities.map((quality, index) => (
          <motion.button
            key={quality.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onQualityChange(quality)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedQuality?.label === quality.label
                ? 'border-purple-500 bg-purple-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
            aria-pressed={selectedQuality?.label === quality.label}
            aria-label={`Select ${quality.label} quality`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {quality.label}
                  </span>
                  {selectedQuality?.label === quality.label && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 text-purple-600" />
                    </motion.div>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  {downloadHelper.formatFileSize(quality.size)}
                </div>
                
                <div className="text-xs text-gray-500 mt-1">
                  {quality.mime?.split('/')[1]?.toUpperCase() || 'MP4'}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-400">
                <Download className="w-4 h-4" />
              </div>
            </div>
            
            {/* Quality indicator bar */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
              <motion.div
                className={`h-1 rounded-full ${
                  quality.label.includes('1080') 
                    ? 'bg-green-500' 
                    : quality.label.includes('720')
                    ? 'bg-yellow-500'
                    : 'bg-orange-500'
                }`}
                style={{ width: `${(index + 1) * (100 / qualities.length)}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${(index + 1) * (100 / qualities.length)}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Quality info */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium">1080p - Best quality, larger file size</span>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="font-medium">720p - Good quality, balanced size</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="font-medium">480p - Smaller file, faster download</span>
        </div>
      </div>
    </motion.div>
  );
};

export default QualitySelector;
