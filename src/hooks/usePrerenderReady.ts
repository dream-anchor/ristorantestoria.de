import { useEffect } from 'react';

export const usePrerenderReady = (isReady: boolean) => {
  // Reset attribute on mount so react-snap waits for each new page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.removeAttribute('data-prerender-ready');
    }
    return () => {
      document.documentElement.removeAttribute('data-prerender-ready');
    };
  }, []);

  // Set ready attribute when data is loaded
  useEffect(() => {
    if (isReady && typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-prerender-ready', 'true');
      document.dispatchEvent(new Event('prerender-ready'));
    }
  }, [isReady]);
};
