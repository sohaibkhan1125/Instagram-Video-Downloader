import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Play, Pause, Volume2, VolumeX, Maximize, User, Clock, FileText, Image } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import QualitySelector from './QualitySelector';
import downloadHelper from '../lib/downloadHelper';

const PreviewCard = ({ videoData, onDownload, isDownloading, downloadProgress, selectedType }) => {
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Set default quality when data loads
  React.useEffect(() => {
    if (videoData?.qualities && videoData.qualities.length > 0 && !selectedQuality) {
      setSelectedQuality(videoData.qualities[0]);
    }
  }, [videoData, selectedQuality]);

  const handleDownload = () => {
    if (selectedQuality && onDownload) {
      onDownload(selectedQuality);
    }
  };

  const handleQualityDownload = (quality) => {
    if (onDownload) {
      onDownload(quality);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (!videoData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Media Display Section */}
      <div className="relative bg-black">
        {selectedType === 'photos' ? (
          /* Photo Display */
          <div className="relative">
            <img
              src={videoData.thumbnail || selectedQuality?.url || videoData.qualities?.[0]?.url}
              alt={`Photo by ${videoData.username}`}
              className="w-full aspect-video object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400/6366f1/ffffff?text=Photo+Preview';
              }}
            />
            
            {/* Photo Overlay Info */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                <div className="flex items-center space-x-2">
                  <Image className="w-4 h-4" />
                  <span className="font-medium">{videoData.username}</span>
                </div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>Photo</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Video Player */
          <VideoPlayer
            src={selectedQuality?.url || videoData.qualities?.[0]?.url}
            thumbnail={videoData.thumbnail}
            onPlayPause={setIsPlaying}
            className="w-full aspect-video"
          />
        )}
        
        {/* Video Overlay Info (for non-photos) */}
        {selectedType !== 'photos' && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{videoData.username}</span>
              </div>
            </div>
            
            {videoData.duration && (
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(videoData.duration)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6">
        {/* Metadata */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {videoData.username?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">
                @{videoData.username}
              </h3>
              {videoData.caption && (
                <p className="text-gray-600 mt-1">
                  {truncateText(videoData.caption, 150)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quality Selector */}
        {videoData.qualities && videoData.qualities.length > 1 && (
          <QualitySelector
            qualities={videoData.qualities}
            selectedQuality={selectedQuality}
            onQualityChange={setSelectedQuality}
          />
        )}

        {/* Download Section */}
        <div className="space-y-4">
          {selectedType === 'photos' ? (
            /* Photo Download Section */
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">Download Image</h4>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQualityDownload(videoData.qualities?.[0] || { url: videoData.thumbnail, label: 'Original Image' })}
                  disabled={isDownloading}
                  className={`px-8 py-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                    isDownloading
                      ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                      : 'border-purple-200 bg-purple-50 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <Image className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">
                    {isDownloading ? 'Downloading Image...' : 'Download Image'}
                  </span>
                </motion.button>
              </div>
            </div>
          ) : (
            /* Video Download Section */
            videoData.qualities && videoData.qualities.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">Download Options</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {videoData.qualities.map((quality, index) => (
                    <motion.button
                      key={`${quality.quality}-${index}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQualityDownload(quality)}
                      disabled={isDownloading}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        isDownloading
                          ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                          : 'border-purple-200 bg-purple-50 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Download className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-gray-900">
                            {quality.label}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {downloadHelper.formatFileSize(quality.size)}
                        </span>
                      </div>
                      
                      {/* Format and Type Indicators */}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          {quality.extension?.toUpperCase() || quality.mime?.split('/')[1]?.toUpperCase() || 'MP4'}
                        </div>
                        
                        {/* Content Type Indicators */}
                        <div className="flex space-x-1">
                          {quality.videoAvailable && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Video
                            </span>
                          )}
                          {quality.audioAvailable && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              Audio
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Quality-specific indicators */}
                      {quality.quality === '128kbps' && (
                        <div className="text-xs text-orange-600 mt-1 font-medium flex items-center">
                          🎵 Audio Only - MP3 Format
                        </div>
                      )}
                      {quality.quality === 'hd' && (
                        <div className="text-xs text-green-600 mt-1 font-medium flex items-center">
                          📹 High Definition - MP4 Video
                        </div>
                      )}
                      {quality.quality === 'full hd' && (
                        <div className="text-xs text-purple-600 mt-1 font-medium flex items-center">
                          🎬 Full HD Quality - MP4 Video
                        </div>
                      )}
                      {quality.extension === 'mp3' && (
                        <div className="text-xs text-blue-600 mt-1 font-medium flex items-center">
                          🎧 Audio File - MP3
                        </div>
                      )}
                      {quality.extension === 'mp4' && quality.videoAvailable && (
                        <div className="text-xs text-green-600 mt-1 font-medium flex items-center">
                          🎬 Video File - MP4
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Download Progress */}
          {isDownloading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Downloading...</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${downloadProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Format: MP4</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>No Watermark</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Instant Download</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewCard;
