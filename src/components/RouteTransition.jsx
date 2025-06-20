// src/components/RouteTransition.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Icon from './AppIcon';

/**
 * Route transition component that shows loading states during navigation
 * Provides smooth transitions between routes with loading indicators
 */
const RouteTransition = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    // Check if location exists and has pathname
    if (!location || !location.pathname) {
      return;
    }

    // Check if this is actually a route change
    if (displayLocation && location.pathname === displayLocation.pathname) {
      return;
    }

    // Start loading transition
    setIsLoading(true);
    
    // Simulate route loading time
    const timer = setTimeout(() => {
      setDisplayLocation(location);
      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [location, displayLocation]);

  // Handle initial render when displayLocation is not set
  useEffect(() => {
    if (!displayLocation && location) {
      setDisplayLocation(location);
    }
  }, [location, displayLocation]);

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 bottom-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin">
              <Icon name="Loader" size={32} className="text-primary" />
            </div>
            <p className="text-text-secondary font-medium">Loading...</p>
          </div>
        </motion.div>
      )}

      {/* Page Content with Transition */}
      <motion.div
        key={displayLocation?.pathname || 'default'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default RouteTransition;