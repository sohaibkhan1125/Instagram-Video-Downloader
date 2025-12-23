import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Layout, Plus, Trash2, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaTiktok,
  FaTelegram,
  FaWhatsapp
} from 'react-icons/fa';

// Icon mapping for React Icons
const iconMap = {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaTiktok,
  FaTelegram,
  FaWhatsapp
};

const FooterManagement = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Social media platforms with their icons
  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'bg-pink-600' },
    { id: 'twitter', name: 'Twitter (X)', icon: FaTwitter, color: 'bg-sky-500' },
    { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: 'bg-red-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: 'bg-blue-700' },
    { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: 'bg-red-500' },
    { id: 'reddit', name: 'Reddit', icon: FaReddit, color: 'bg-orange-600' },
    { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: 'bg-black' },
    { id: 'telegram', name: 'Telegram', icon: FaTelegram, color: 'bg-blue-500' },
    { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'bg-green-600' }
  ];

  // Load saved social links from localStorage on component mount
  useEffect(() => {
    const savedLinks = localStorage.getItem('socialLinks');
    if (savedLinks) {
      setSocialLinks(JSON.parse(savedLinks));
    }
  }, []);

  // Handle platform selection
  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  // Handle URL input
  const handleUrlChange = (e) => {
    setSocialUrl(e.target.value);
  };

  // Add new social link
  const handleAddLink = () => {
    if (!selectedPlatform || !socialUrl.trim()) {
      toast.error('Please select a platform and enter a URL');
      return;
    }

    // Validate URL
    try {
      new URL(socialUrl);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    // Check if platform already exists
    if (socialLinks.some(link => link.platform === selectedPlatform)) {
      toast.error('This platform is already added');
      return;
    }

    const platform = socialPlatforms.find(p => p.id === selectedPlatform);
    const newLink = {
      id: Date.now(),
      platform: selectedPlatform,
      name: platform.name,
      icon: platform.icon.name, // Store icon name as string
      color: platform.color,
      url: socialUrl
    };

    setSocialLinks([...socialLinks, newLink]);
    setSelectedPlatform('');
    setSocialUrl('');
    setHasChanges(true);
    toast.success(`${platform.name} link added successfully!`);
  };

  // Delete social link
  const handleDeleteLink = (id) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
    setHasChanges(true);
    toast.success('Social link deleted successfully!');
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save to localStorage
      localStorage.setItem('socialLinks', JSON.stringify(socialLinks));

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('socialLinksChanged', {
        detail: { links: socialLinks }
      }));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Social media links saved successfully!');
      setHasChanges(false);

    } catch (error) {
      toast.error('Failed to save changes. Please try again.');
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
        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Layout className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Management</h1>
          <p className="text-gray-600">Manage social media links in your website footer</p>
        </div>
      </div>

      {/* Add New Social Link */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Add Social Media Link</h3>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Select a social media platform and enter the URL to add it to your website footer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Platform Selection */}
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media Platform
                </label>
                <select
                  id="platform"
                  value={selectedPlatform}
                  onChange={handlePlatformChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a platform</option>
                  {socialPlatforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* URL Input */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Profile URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={socialUrl}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/your-profile"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Add Button */}
            <div className="mt-4">
              <motion.button
                onClick={handleAddLink}
                disabled={!selectedPlatform || !socialUrl.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
                  ${selectedPlatform && socialUrl.trim()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Social Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Social Links</h3>
            <p className="text-gray-600">Manage your active social media links</p>
          </div>
          <div className="text-sm text-gray-500">
            {socialLinks.length} link{socialLinks.length !== 1 ? 's' : ''} added
          </div>
        </div>

        <AnimatePresence>
          {socialLinks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layout className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No social links added</h4>
              <p className="text-gray-600">Add your first social media link above to get started.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialLinks
                .filter(link => iconMap[link.icon]) // Filter out invalid icons first
                .map((link) => {
                  const Icon = iconMap[link.icon];

                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${link.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{link.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-32">{link.url}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <motion.a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </motion.a>

                          <motion.button
                            onClick={() => handleDeleteLink(link.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </AnimatePresence>
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
              ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
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

export default FooterManagement;
