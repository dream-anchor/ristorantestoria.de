import { useEffect } from 'react';

export const usePrerenderReady = (isReady: boolean) => {
  useEffect(() => {
    if (isReady && typeof window !== 'undefined') {
      document.dispatchEvent(new Event('prerender-ready'));
    }
  }, [isReady]);
};
