import { useEffect } from 'react';

export const usePrerenderReady = (isReady: boolean) => {
  useEffect(() => {
    if (isReady && typeof window !== 'undefined') {
      // Set DOM attribute for react-snap to detect when page is ready
      document.documentElement.setAttribute('data-prerender-ready', 'true');
      // Also dispatch event for backwards compatibility
      document.dispatchEvent(new Event('prerender-ready'));
    }
  }, [isReady]);
};
