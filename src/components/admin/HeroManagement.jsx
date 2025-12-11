import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Type, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabaseClient';

const HeroManagement = () => {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load saved data from Supabase on component mount
  useEffect(() => {
    loadHeroContent();
  }, []);

  const loadHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content_instagram_downloader')
        .select('hero_title, hero_description')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error loading hero content:', error);
        return;
      }

      if (data) {
        setHeroTitle(data.hero_title || 'Download Instagram & TikTok\nVideos & Reels');
        setHeroDescription(data.hero_description || 'Save your favorite Instagram posts, reels, stories, photos and TikTok videos in high quality. Fast, secure, and completely free.');
      } else {
        // Set defaults if no data exists
        setHeroTitle('Download Instagram & TikTok\nVideos & Reels');
        setHeroDescription('Save your favorite Instagram posts, reels, stories, photos and TikTok videos in high quality. Fast, secure, and completely free.');
      }
    } catch (error) {
      console.warn('Error loading hero content:', error);
      // Set defaults on error
      setHeroTitle('Download Instagram & TikTok\nVideos & Reels');
      setHeroDescription('Save your favorite Instagram posts, reels, stories, photos and TikTok videos in high quality. Fast, secure, and completely free.');
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setHeroTitle(newTitle);
    setHasChanges(true);
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setHeroDescription(newDescription);
    setHasChanges(true);
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Check if record exists
      const { data: existingData, error: fetchError } = await supabase
        .from('website_content_instagram_downloader')
        .select('id')
        .limit(1)
        .single();

      let result;
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('website_content_instagram_downloader')
          .update({
            hero_title: heroTitle,
            hero_description: heroDescription,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('website_content_instagram_downloader')
          .insert([{
            hero_title: heroTitle,
            hero_description: heroDescription
          }]);
      }

      if (result.error) throw result.error;
      
      toast.success('Hero section updated successfully!');
      setHasChanges(false);
      
    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error('Failed to save changes: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
          <Type className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Section Management</h1>
          <p className="text-gray-600">Update your hero section title and description</p>
        </div>
      </div>

      {/* Hero Title Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Type className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Hero Title</h3>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Update your hero section title. This is the main heading that appears at the top of your website.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Title
                </label>
                <textarea
                  id="heroTitle"
                  value={heroTitle}
                  onChange={handleTitleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter your hero title (use \n for line breaks)"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Use \n for line breaks. Example: "First Line\nSecond Line"
                </p>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="space-y-2">
                  {heroTitle.split('\n').map((line, index) => (
                    <h1
                      key={index}
                      className="text-2xl md:text-4xl font-extrabold text-gray-900"
                    >
                      {line || <span className="text-gray-400">(Empty line)</span>}
                    </h1>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Description Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Hero Description</h3>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Update your hero section description. This appears below the title and describes your service.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="heroDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Description
                </label>
                <textarea
                  id="heroDescription"
                  value={heroDescription}
                  onChange={handleDescriptionChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter your hero description"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {heroDescription.length} characters
                </p>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {heroDescription || <span className="text-gray-400">(No description)</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          whileHover={{ scale: hasChanges && !isSaving ? 1.02 : 1 }}
          whileTap={{ scale: hasChanges && !isSaving ? 0.98 : 1 }}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${hasChanges && !isSaving
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Changes Indicator */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-yellow-800">You have unsaved changes</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HeroManagement;

