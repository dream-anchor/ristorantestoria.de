import { useEffect } from 'react';

export const usePrerenderReady = (isReady: boolean) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Reset attribute on mount so react-snap waits for each new page
    document.documentElement.removeAttribute('data-prerender-ready');

    // Set ready attribute when data is loaded
    if (isReady) {
      document.documentElement.setAttribute('data-prerender-ready', 'true');
      document.dispatchEvent(new Event('prerender-ready'));
    }

    return () => {
      document.documentElement.removeAttribute('data-prerender-ready');
    };
  }, [isReady]);
};
