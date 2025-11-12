import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const GeneralSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load maintenance mode state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('maintenanceMode');
    if (savedState !== null) {
      setMaintenanceMode(JSON.parse(savedState));
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
