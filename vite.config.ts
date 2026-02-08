import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
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
        manualChunks: isSsrBuild ? undefined : {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'recharts': ['recharts'],
        },
      },
    },
  },
  ssr: {
    // Bundle react-helmet-async to avoid CJS/ESM interop issues
    noExternal: ["react-helmet-async"],
  },
}));
