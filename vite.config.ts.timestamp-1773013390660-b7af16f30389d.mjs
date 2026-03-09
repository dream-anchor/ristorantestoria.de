// vite.config.ts
import { defineConfig } from "file:///Users/antoinemonot/Documents/Websites/VISUAL%20STUDIO%20CODE/ristorantestoria.de/node_modules/vite/dist/node/index.js";
import react from "file:///Users/antoinemonot/Documents/Websites/VISUAL%20STUDIO%20CODE/ristorantestoria.de/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/antoinemonot/Documents/Websites/VISUAL STUDIO CODE/ristorantestoria.de";
var vite_config_default = defineConfig(({ mode, isSsrBuild }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: [
      // SSR-safe Supabase client (must come before generic @ alias)
      ...isSsrBuild ? [{
        find: /^@\/integrations\/supabase\/client$/,
        replacement: path.resolve(__vite_injected_original_dirname, "./src/integrations/supabase/client.ssr.ts")
      }] : [],
      // Generic @ alias for all other imports
      { find: /^@\//, replacement: path.resolve(__vite_injected_original_dirname, "./src") + "/" }
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild ? void 0 : {
          "vendor": ["react", "react-dom", "react-router-dom"],
          "recharts": ["recharts"]
        }
      }
    }
  },
  ssr: {
    // Bundle react-helmet-async to avoid CJS/ESM interop issues
    noExternal: ["react-helmet-async"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYW50b2luZW1vbm90L0RvY3VtZW50cy9XZWJzaXRlcy9WSVNVQUwgU1RVRElPIENPREUvcmlzdG9yYW50ZXN0b3JpYS5kZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FudG9pbmVtb25vdC9Eb2N1bWVudHMvV2Vic2l0ZXMvVklTVUFMIFNUVURJTyBDT0RFL3Jpc3RvcmFudGVzdG9yaWEuZGUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FudG9pbmVtb25vdC9Eb2N1bWVudHMvV2Vic2l0ZXMvVklTVUFMJTIwU1RVRElPJTIwQ09ERS9yaXN0b3JhbnRlc3RvcmlhLmRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlLCBpc1NzckJ1aWxkIH0pID0+ICh7XG4gIGJhc2U6ICcvJyxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICAvLyBTU1Itc2FmZSBTdXBhYmFzZSBjbGllbnQgKG11c3QgY29tZSBiZWZvcmUgZ2VuZXJpYyBAIGFsaWFzKVxuICAgICAgLi4uKGlzU3NyQnVpbGQgPyBbe1xuICAgICAgICBmaW5kOiAvXkBcXC9pbnRlZ3JhdGlvbnNcXC9zdXBhYmFzZVxcL2NsaWVudCQvLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9pbnRlZ3JhdGlvbnMvc3VwYWJhc2UvY2xpZW50LnNzci50c1wiKSxcbiAgICAgIH1dIDogW10pLFxuICAgICAgLy8gR2VuZXJpYyBAIGFsaWFzIGZvciBhbGwgb3RoZXIgaW1wb3J0c1xuICAgICAgeyBmaW5kOiAvXkBcXC8vLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSArIFwiL1wiIH0sXG4gICAgXSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiBpc1NzckJ1aWxkID8gdW5kZWZpbmVkIDoge1xuICAgICAgICAgICd2ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgJ3JlY2hhcnRzJzogWydyZWNoYXJ0cyddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzc3I6IHtcbiAgICAvLyBCdW5kbGUgcmVhY3QtaGVsbWV0LWFzeW5jIHRvIGF2b2lkIENKUy9FU00gaW50ZXJvcCBpc3N1ZXNcbiAgICBub0V4dGVybmFsOiBbXCJyZWFjdC1oZWxtZXQtYXN5bmNcIl0sXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZaLFNBQVMsb0JBQW9CO0FBQzFiLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxNQUFNLFdBQVcsT0FBTztBQUFBLEVBQ3JELE1BQU07QUFBQSxFQUNOLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsRUFDUixFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQTtBQUFBLE1BRUwsR0FBSSxhQUFhLENBQUM7QUFBQSxRQUNoQixNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssUUFBUSxrQ0FBVywyQ0FBMkM7QUFBQSxNQUNsRixDQUFDLElBQUksQ0FBQztBQUFBO0FBQUEsTUFFTixFQUFFLE1BQU0sUUFBUSxhQUFhLEtBQUssUUFBUSxrQ0FBVyxPQUFPLElBQUksSUFBSTtBQUFBLElBQ3RFO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYyxhQUFhLFNBQVk7QUFBQSxVQUNyQyxVQUFVLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ25ELFlBQVksQ0FBQyxVQUFVO0FBQUEsUUFDekI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQTtBQUFBLElBRUgsWUFBWSxDQUFDLG9CQUFvQjtBQUFBLEVBQ25DO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
