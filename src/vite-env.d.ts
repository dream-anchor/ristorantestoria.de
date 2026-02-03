/// <reference types="vite/client" />

// React Query SSR hydration state
declare global {
  interface Window {
    __REACT_QUERY_STATE__?: unknown;
  }
}

export {};
