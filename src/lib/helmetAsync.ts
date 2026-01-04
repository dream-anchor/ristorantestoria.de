// Centralized re-export for react-helmet-async
// Uses default import for CommonJS compatibility in Node.js ESM (SSR/prerender)
import pkg from 'react-helmet-async';

export const { Helmet, HelmetProvider } = pkg;
