import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ChevronRight, Navigation, Layout, FileText, Sparkles } from 'lucide-react';

const AdminSidebar = ({ activeSection, onSectionChange, isMobile, isSidebarOpen, onCloseSidebar }) => {
  const navigationItems = [
    {
      id: 'general-settings',
      label: 'General Settings',
      icon: Settings,
      description: 'Configure basic settings'
    },
    {
      id: 'navbar-management',
      label: 'Navbar Management',
      icon: Navigation,
      description: 'Manage website title and logo'
    },
    {
      id: 'footer-management',
      label: 'Footer Management',
      icon: Layout,
      description: 'Manage social media links'
    },
    {
      id: 'content-management',
      label: 'Content Management',
      icon: FileText,
      description: 'Manage website content'
    },
    {
      id: 'hero-management',
      label: 'Hero Management',
      icon: Sparkles,
      description: 'Manage hero section content'
    }
    // More navigation items can be added here in the future
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={isMobile ? { x: -280 } : { x: 0 }}
        animate={{ x: isMobile && !isSidebarOpen ? -280 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg lg:shadow-none
          ${isMobile ? 'transform' : ''}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                <p className="text-sm text-gray-500">Control Center</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    if (isMobile) onCloseSidebar();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 shadow-sm' 
                      : 'hover:bg-gray-50 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className={`font-medium ${isActive ? 'text-purple-900' : 'text-gray-900'}`}>
                        {item.label}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                    />
                  )}
                  
                  {!isActive && (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Admin Panel v1.0</p>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-1 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
