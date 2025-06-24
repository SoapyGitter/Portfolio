'use client';

import { useState, useEffect } from 'react';

interface ResponsiveConfig {
  radius: number;
  rotationSpeed: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useResponsive(): ResponsiveConfig {
  const [config, setConfig] = useState<ResponsiveConfig>({
    radius: 8,
    rotationSpeed: 0.01,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      let radius = 8;
      let rotationSpeed = 0.01;

      if (isMobile) {
        radius = 5;
        rotationSpeed = 0.008;
      } else if (isTablet) {
        radius = 6.5;
        rotationSpeed = 0.009;
      }

      setConfig({
        radius,
        rotationSpeed,
        isMobile,
        isTablet,
        isDesktop,
      });
    };

    updateConfig();
    window.addEventListener('resize', updateConfig);
    
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  return config;
} 