import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings, Wrench, AlertTriangle, CheckCircle, Key, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient, { DEFAULT_API_KEY, API_KEY_STORAGE_KEY } from '../../lib/apiClient';

const GeneralSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isApiKeySaving, setIsApiKeySaving] = useState(false);

  // Load maintenance mode state from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      setApiKey(DEFAULT_API_KEY);
      return;
    }

    const savedState = window.localStorage.getItem('maintenanceMode');
    if (savedState !== null) {
      setMaintenanceMode(JSON.parse(savedState));
    }

    const savedApiKey = window.localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setApiKey(DEFAULT_API_KEY);
      window.localStorage.setItem(API_KEY_STORAGE_KEY, DEFAULT_API_KEY);
    }
  }, []);

  // Save maintenance mode state
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage for immediate effect
      localStorage.setItem('maintenanceMode', JSON.stringify(maintenanceMode));
      
      // Also save to Firebase for cross-device sync (optional)
      // You can implement Firebase realtime database here if needed
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(
        maintenanceMode 
          ? 'Maintenance mode activated successfully!' 
          : 'Maintenance mode deactivated successfully!'
      );
      
      // Trigger custom event for main website to listen
      window.dispatchEvent(new CustomEvent('maintenanceModeChanged', {
        detail: { enabled: maintenanceMode }
      }));
      
    } catch (error) {
      console.error('Error saving maintenance mode:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApiKeySave = async () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      toast.error('API key cannot be empty.');
      return;
    }

    setIsApiKeySaving(true);

    try {
      apiClient.setApiKey(trimmedKey);

      window.dispatchEvent(
        new CustomEvent('apiKeyChanged', {
          detail: { apiKey: trimmedKey }
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('API key updated successfully!');
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key. Please try again.');
    } finally {
      setIsApiKeySaving(false);
    }
  };

  const handleApiKeyReset = async () => {
    setApiKey(DEFAULT_API_KEY);
    setIsApiKeyVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await handleApiKeySave();
  };

  const handleCopyApiKey = async () => {
    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error('Clipboard API not supported');
      }
      await navigator.clipboard.writeText(apiKey);
      toast.success('API key copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy API key. Please try again.');
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
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
          <p className="text-gray-600">Configure your application settings</p>
        </div>
      </div>

      {/* Maintenance Mode Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Maintenance Mode</h3>
              <div className="flex items-center space-x-2">
                {maintenanceMode ? (
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Inactive</span>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              When enabled, your website will display a maintenance page to all visitors. 
              This is useful for updates, maintenance, or temporary downtime.
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enable Maintenance Mode</p>
                <p className="text-sm text-gray-500">
                  {maintenanceMode 
                    ? 'Your website is currently in maintenance mode' 
                    : 'Your website is currently accessible to all users'
                  }
                </p>
              </div>
              
              <motion.button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  ${maintenanceMode ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-300'}
                `}
              >
                <motion.span
                  animate={{
                    x: maintenanceMode ? 20 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200
                  `}
                />
              </motion.button>
            </div>

            {/* Warning Message */}
            {maintenanceMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Warning</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Maintenance mode is currently active. Your website visitors will see a maintenance page instead of the normal content.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
                  ${isSaving 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                  }
                `}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
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
          </div>
        </div>
      </div>

      {/* API Key Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">RapidAPI Key</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Required for downloads</span>
              </div>
            </div>

            <p className="text-gray-600">
              Update the RapidAPI key used to fetch Instagram and TikTok content. Use the provided trial key or paste your own production key.
            </p>

            <div className="space-y-3">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                RapidAPI Key
              </label>
              <div className="relative">
                <input
                  id="apiKey"
                  type={isApiKeyVisible ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 pr-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your RapidAPI key"
                  autoComplete="off"
                />

                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                  <button
                    type="button"
                    onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                    className="p-2 rounded-md text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                    aria-label={isApiKeyVisible ? 'Hide API key' : 'Show API key'}
                  >
                    {isApiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyApiKey}
                    className="p-2 rounded-md text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                    aria-label="Copy API key"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={handleApiKeySave}
                  disabled={isApiKeySaving || !apiKey.trim()}
                  whileHover={{ scale: !isApiKeySaving && apiKey.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: !isApiKeySaving && apiKey.trim() ? 0.98 : 1 }}
                  className={`
                    flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                    ${isApiKeySaving || !apiKey.trim()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'}
                  `}
                >
                  {isApiKeySaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save API Key</span>
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={handleApiKeyReset}
                  className="px-5 py-2.5 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors text-sm font-semibold"
                >
                  Use Trial Key
                </button>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-sm text-purple-700">
              <p className="font-medium">Need more requests?</p>
              <p className="mt-1">
                Upgrade your RapidAPI subscription and paste the new key here to increase your request quota.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Settings Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">More Settings Coming Soon</h3>
          <p className="text-gray-600">
            Additional configuration options will be available in future updates.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GeneralSettings;
