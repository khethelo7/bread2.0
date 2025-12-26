import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Simple hash function for IP anonymization
const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

export const usePageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { error } = await supabase.from('page_views').insert({
          page_path: location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          ip_hash: hashString(navigator.userAgent + new Date().toDateString()),
        });

        if (error) {
          logger.warn('Page tracking failed', `Path: ${location.pathname}, Error: ${error.message}`);
        }
      } catch (e) {
        logger.error('Page tracker error', `Failed to track ${location.pathname}`);
      }
    };

    trackPageView();
  }, [location.pathname]);
};
