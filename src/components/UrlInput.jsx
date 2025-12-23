import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, AlertCircle, Clipboard, X, Video, FileImage, BookOpen, Play } from 'lucide-react';
import apiClient from '../lib/apiClient';

const UrlInput = ({ onUrlSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [selectedType, setSelectedType] = useState('video');

  const validateUrl = async (inputUrl) => {
    if (!inputUrl.trim()) {
      setError('');
      return false;
    }

    if (!apiClient.validateInstagramUrl(inputUrl)) {
      setError('Please enter a valid Instagram or TikTok URL');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter an Instagram or TikTok URL');
      return;
    }

    setIsValidating(true);
    const isValid = await validateUrl(url);

    if (isValid) {
      onUrlSubmit(url.trim(), selectedType);
    }

    setIsValidating(false);
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setUrl(clipboardText);
      if (error) {
        setError('');
      }
    } catch (err) {
      // Silent fail - clipboard access might be denied
    }
  };

  const handleClear = () => {
    setUrl('');
    setError('');
  };

  const getPlaceholder = () => {
    switch (selectedType) {
      case 'video':
        return 'Paste Instagram/TikTok video URL here...';
      case 'story':
        return 'Paste Instagram story URL here...';
      case 'photos':
        return 'Paste Instagram photo URL here...';
      case 'reels':
        return 'Paste Instagram reel URL here...';
      default:
        return 'Paste Instagram or TikTok URL here';
    }
  };

  const typeOptions = [
    { id: 'video', label: 'Video', icon: Video, emoji: '🎥' },
    { id: 'reels', label: 'Reels', icon: Play, emoji: '🎬' },
    { id: 'story', label: 'Story', icon: BookOpen, emoji: '📖' },
    { id: 'photos', label: 'Photos', icon: FileImage, emoji: '🖼️' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Link className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder={getPlaceholder()}
            className={`w-full pl-12 pr-10 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg ${error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 bg-white'
              }`}
            disabled={isLoading || isValidating}
            aria-label="Instagram URL input"
            aria-describedby={error ? "url-error" : "url-help"}
            aria-invalid={!!error}
          />

          {/* Paste/Clear Icon */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {url ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label="Clear input"
              >
                <X className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePaste}
                className="p-1 text-gray-400 hover:text-purple-500 transition-colors duration-200"
                aria-label="Paste from clipboard"
              >
                <Clipboard className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Type Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {typeOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(option.id)}
                className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-lg border-2 transition-all duration-200 ${selectedType === option.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-sm'
                  }`}
              >
                <span className="text-lg">{option.emoji}</span>
                <IconComponent className="w-4 h-4" />
                <span className="font-medium text-sm sm:text-base">{option.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-red-600 text-sm"
            id="url-error"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Help Text */}
        {!error && (
          <div id="url-help" className="text-sm text-gray-500">
            Supports Instagram posts, reels, stories, photos and TikTok videos
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!url.trim() || isLoading || isValidating}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Fetching Preview...</span>
            </>
          ) : isValidating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Validating URL...</span>
            </>
          ) : (
            <>
              <Link className="w-5 h-5" />
              <span>Fetch Preview</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UrlInput;
