import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is it free to download Instagram videos?",
      answer: "Yes, our Instagram video downloader is completely free to use. No registration, no hidden fees, and no watermarks on your downloads."
    },
    {
      question: "What video formats are supported?",
      answer: "We support MP4 format in various qualities including 1080p, 720p, and 480p. The exact available qualities depend on the original Instagram post."
    },
    {
      question: "Can I download private Instagram videos?",
      answer: "No, you can only download public Instagram posts, reels, and stories. Private accounts and posts are not accessible for security and privacy reasons."
    },
    {
      question: "Is it legal to download Instagram videos?",
      answer: "Downloading videos for personal use is generally acceptable, but you should respect copyright laws and the original creator's rights. Always get permission before using downloaded content commercially."
    },
    {
      question: "Why can't I download some videos?",
      answer: "Some videos may be unavailable due to privacy settings, account restrictions, or regional limitations. We also cannot download videos from private accounts or posts that have been deleted."
    },
    {
      question: "Do you store my downloaded videos?",
      answer: "No, we don't store any of your downloaded content. Videos are processed in real-time and delivered directly to your device. We also don't track your download history."
    },
    {
      question: "Can I download Instagram Stories?",
      answer: "Yes, you can download Instagram Stories as long as they are public and still available. Stories are typically available for 24 hours after posting."
    },
    {
      question: "What's the maximum video size I can download?",
      answer: "There's no strict limit, but very large videos may take longer to process. We recommend a stable internet connection for videos over 100MB."
    },
    {
      question: "Does this work on mobile devices?",
      answer: "Yes, our downloader works on all devices including smartphones and tablets. The interface is fully responsive and optimized for mobile use."
    },
    {
      question: "How do I report a problem or request a feature?",
      answer: "You can contact us through our support page or email. We're constantly improving our service based on user feedback and suggestions."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HelpCircle className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our Instagram video downloader
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-xl"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div
                      id={`faq-answer-${index}`}
                      className="px-6 pb-4 text-gray-600 leading-relaxed"
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? We're here to help!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQs;
