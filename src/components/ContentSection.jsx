import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const SLUG = 'homepage_text'; // Specific slug for Instagram downloader homepage content

const ContentSection = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    // Load initial content
    const loadContent = async () => {
      try {
        const { data, error } = await supabase
          .from('website_content')
          .select('*')
          .eq('slug', SLUG)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.warn('Error loading content:', error);
          return;
        }

        if (data && data.content) {
          setContent(data.content);
        }
      } catch (error) {
        console.warn('Error loading content:', error);
      }
    };

    loadContent();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('public:website_content:homepage_text')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_content',
          filter: `slug=eq.${SLUG}`
        },
        (payload) => {
          // Check if the update affects our content
          if (payload.new && payload.new.content !== undefined) {
            setContent(payload.new.content || '');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Don't render anything if there's no content
  if (!content || content.trim() === '') {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </motion.section>
  );
};

export default ContentSection;
