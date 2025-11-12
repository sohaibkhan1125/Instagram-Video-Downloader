import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Heart, Shield, Lock } from 'lucide-react';
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

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [websiteTitle, setWebsiteTitle] = useState('InstaDownloader');
  const [websiteLogo, setWebsiteLogo] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);

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

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedTitle = localStorage.getItem('websiteTitle');
    const savedLogo = localStorage.getItem('websiteLogo');
    const savedSocialLinks = localStorage.getItem('socialLinks');
    
    if (savedTitle) {
      setWebsiteTitle(savedTitle);
    }
    
    if (savedLogo) {
      setWebsiteLogo(savedLogo);
    }
    
    if (savedSocialLinks) {
      setSocialLinks(JSON.parse(savedSocialLinks));
    }
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const handleTitleChange = (event) => {
      setWebsiteTitle(event.detail.title);
    };

    const handleLogoChange = (event) => {
      setWebsiteLogo(event.detail.logo);
    };

    const handleSocialLinksChange = (event) => {
      setSocialLinks(event.detail.links);
    };

    window.addEventListener('websiteTitleChanged', handleTitleChange);
    window.addEventListener('websiteLogoChanged', handleLogoChange);
    window.addEventListener('socialLinksChanged', handleSocialLinksChange);

    return () => {
      window.removeEventListener('websiteTitleChanged', handleTitleChange);
      window.removeEventListener('websiteLogoChanged', handleLogoChange);
      window.removeEventListener('socialLinksChanged', handleSocialLinksChange);
    };
  }, []);

  const footerLinks = {
    product: [
      { name: 'How it works', href: '#how-it-works' },
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'FAQ', href: '#faqs' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Report Issue', href: '#report' },
      { name: 'Status', href: '#status' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'DMCA', href: '#dmca' },
      { name: 'Copyright', href: '#copyright' }
    ]
  };

  // Dynamic social links are now managed through state

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              {websiteLogo ? (
                <img
                  src={websiteLogo}
                  alt="Website Logo"
                  className="w-8 h-8 object-contain rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="text-xl font-bold">{websiteTitle}</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Download Instagram videos, reels, and stories in high quality. 
              Fast, secure, and completely free.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.length > 0 ? (
                socialLinks
                  .filter(social => iconMap[social.icon]) // Filter out invalid icons first
                  .map((social) => {
                    const Icon = iconMap[social.icon];
                    
                    return (
                      <motion.a
                        key={social.id}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-200`}
                        aria-label={social.name}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.a>
                    );
                  })
              ) : (
                <div className="text-gray-400 text-sm">
                  No social links added yet
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 mb-8 py-6 border-t border-gray-800"
        >
          <div className="flex items-center space-x-2 text-gray-400">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Secure Downloads</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Lock className="w-5 h-5" />
            <span className="text-sm">Privacy Protected</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm">Made with Love</span>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-800"
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} InstaDownloader. All rights reserved.
          </div>
          
          <div className="text-gray-400 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-6 p-4 bg-gray-800 rounded-lg"
        >
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            <strong>Disclaimer:</strong> This tool is for personal use only. Please respect copyright laws and Instagram's Terms of Service. 
            We are not affiliated with Instagram or Meta. Download content responsibly and always give credit to original creators.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
