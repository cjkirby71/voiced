// src/hooks/useGoogleAnalytics.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Skip initialization in non-production environments
    if (import.meta.env.MODE !== 'production') return;

    // Initialize gtag.js if not already done
    if (!window.dataLayer) {
      // Load gtag.js script dynamically
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
    }

    // Send page_view event on initial load and route changes
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}

// Utility function to track custom events
export function trackEvent(eventName, parameters = {}) {
  if (import.meta.env.MODE === 'production' && typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  }
}

export default useGoogleAnalytics;