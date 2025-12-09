import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Pre-rendering disabled due to vite-plugin-prerender ESM compatibility issues
// Routes kept for future implementation with a compatible solution
const routes = [
  '/',
  '/reservierung',
  '/speisekarte',
  '/mittagsmenu',
  '/getraenke',
  '/besondere-anlaesse',
  '/besondere-anlaesse/weihnachtsmenues',
  '/besondere-anlaesse/silvesterparty',
  '/kontakt',
  '/ueber-uns',
  '/impressum',
  '/datenschutz',
  '/cookie-richtlinie',
  '/agb-restaurant',
  '/agb-gutscheine',
  '/widerrufsbelehrung',
  '/zahlungsinformationen',
  '/lebensmittelhinweise',
  '/haftungsausschluss',
  '/catering',
  // SEO Landing Pages
  '/lunch-muenchen-maxvorstadt',
  '/aperitivo-muenchen',
  '/romantisches-dinner-muenchen',
  '/eventlocation-muenchen-maxvorstadt',
  '/firmenfeier-muenchen',
  '/geburtstagsfeier-muenchen',
  '/neapolitanische-pizza-muenchen',
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Pre-rendering plugin disabled - package has ESM compatibility issues
    // Will need alternative solution (e.g., vite-ssg, custom puppeteer script)
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
