import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Navigation, Type, Image, Trash2, Upload, Eye, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const NavbarManagement = () => {
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedTitle = localStorage.getItem('websiteTitle');
    const savedLogo = localStorage.getItem('websiteLogo');
    
    if (savedTitle) {
      setWebsiteTitle(savedTitle);
    } else {
      setWebsiteTitle('InstaDownloader'); // Default title
    }
    
    if (savedLogo) {
      setLogoPreview(savedLogo);
    }
  }, []);

  // Handle title change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setWebsiteTitle(newTitle);
    setHasChanges(true);
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo deletion
  const handleDeleteLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setHasChanges(true);
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save title to localStorage
      localStorage.setItem('websiteTitle', websiteTitle);
      
      // Save logo if uploaded
      if (logoFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          localStorage.setItem('websiteLogo', e.target.result);
        };
        reader.readAsDataURL(logoFile);
      } else if (!logoPreview) {
        // Remove logo from localStorage if deleted
        localStorage.removeItem('websiteLogo');
      }
      
      // Update document title
      document.title = websiteTitle;
      
      // Dispatch custom events for real-time updates
      window.dispatchEvent(new CustomEvent('websiteTitleChanged', {
        detail: { title: websiteTitle }
      }));
      
      window.dispatchEvent(new CustomEvent('websiteLogoChanged', {
        detail: { logo: logoPreview }
      }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Changes saved successfully!');
      setHasChanges(false);
      
    } catch (error) {
      console.error('Error saving changes:', error);
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
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Navigation className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Navbar Management</h1>
          <p className="text-gray-600">Manage your website title and logo</p>
        </div>
      </div>

      {/* Website Title Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Type className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Website Title</h3>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Update your website title. This will change the title in the navbar, footer, and browser tab.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="websiteTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Website Title
                </label>
                <input
                  id="websiteTitle"
                  type="text"
                  value={websiteTitle}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your website title"
                />
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">I</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{websiteTitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Website Logo</h3>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Upload a new logo for your website. The logo will appear in the navbar and footer.
            </p>

            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {logoPreview && (
                    <button
                      onClick={handleDeleteLogo}
                      className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Logo</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>

              {/* Logo Preview */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Current Logo:</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  {logoPreview ? (
                    <div className="flex items-center space-x-3">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-12 h-12 object-contain rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Custom Logo</p>
                        <p className="text-xs text-gray-500">Uploaded logo will be displayed</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">I</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Default Logo</p>
                        <p className="text-xs text-gray-500">Original logo is being used</p>
                      </div>
                    </div>
                  )}
                </div>
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
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
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

export default NavbarManagement;
