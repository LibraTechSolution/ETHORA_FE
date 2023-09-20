import { useEffect, useState } from 'react';

// export const useIsMobile = () => useBreakpointValue({ base: true, md: false },{ssr: false});
export const useIsMobile = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.matchMedia('(max-width: 768px)').matches);

  useEffect(() => {
    // I write this into a function for better visibility
    const handleResize = (e: MediaQueryListEvent) => {
      setIsLargeScreen(e.matches);
    };

    const mediaQuery = window.matchMedia('(max-width: 768px)');

    mediaQuery.addEventListener('change', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return isLargeScreen;
};
