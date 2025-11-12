import React from 'react';
import { motion } from 'framer-motion';
import { Link, MousePointer, Download, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Link className="w-8 h-8" />,
      title: "Copy Link",
      description: "Copy the Instagram post or reel URL from your browser or app",
      color: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: <MousePointer className="w-8 h-8" />,
      title: "Paste & Fetch",
      description: "Paste the URL into our input field and click 'Fetch Preview'",
      color: "from-purple-500 to-purple-600",
      delay: 0.2
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Choose Quality",
      description: "Select your preferred video quality and click download",
      color: "from-pink-500 to-pink-600",
      delay: 0.3
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Download Complete",
      description: "Your video downloads instantly to your device",
      color: "from-green-500 to-green-600",
      delay: 0.4
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Download Instagram videos in just 4 simple steps. No registration required, 
            completely free and secure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: step.delay }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-600 shadow-lg z-10">
                {index + 1}
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto`}
                >
                  {step.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connecting Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform -translate-y-1/2 z-0" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Our Downloader?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🚀",
                  title: "Lightning Fast",
                  description: "Download videos in seconds with our optimized servers"
                },
                {
                  icon: "🔒",
                  title: "100% Secure",
                  description: "Your privacy is protected, no data is stored"
                },
                {
                  icon: "📱",
                  title: "Mobile Friendly",
                  description: "Works perfectly on all devices and browsers"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
