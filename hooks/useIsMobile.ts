'use client';

import { useState, useEffect } from 'react';

const useIsMobile = (options?: { default?: boolean }) => {
  const [mobile, setMobile] = useState(options?.default ?? false);

  useEffect(() => {
    const checkIsMobile = () => {
      setMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return mobile;
};

export default useIsMobile;
