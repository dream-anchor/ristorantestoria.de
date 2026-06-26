import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: [
      // SSR-safe Supabase client (must come before generic @ alias)
      ...(isSsrBuild ? [{
        find: /^@\/integrations\/supabase\/client$/,
        replacement: path.resolve(__dirname, "./src/integrations/supabase/client.ssr.ts"),
      }] : []),
      // Generic @ alias for all other imports
      { find: /^@\//, replacement: path.resolve(__dirname, "./src") + "/" },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        // Schwere Shared-Vendors aus der Haupt-index.js ziehen → kleinerer
        // Entry-Chunk, parallele Downloads, langfristig cachebar.
        // Funktions-Form, damit @radix-ui/* (27 Pakete) gruppiert greifen.
        manualChunks: isSsrBuild ? undefined : (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('node_modules/react-router')) return 'react';
          if (id.includes('node_modules/react-dom/')) return 'react';
          if (id.includes('node_modules/react/')) return 'react';
          if (id.includes('node_modules/scheduler/')) return 'react';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('recharts') || id.includes('node_modules/d3-') || id.includes('victory-vendor')) return 'recharts';
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('@tanstack')) return 'query';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('date-fns')) return 'date-fns';
          return undefined; // Rest bleibt im Default-Chunk
        },
      },
    },
  },
  ssr: {
    // Bundle react-helmet-async to avoid CJS/ESM interop issues
    noExternal: ["react-helmet-async"],
  },
}));
