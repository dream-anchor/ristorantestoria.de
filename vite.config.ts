import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";

const routes = [
  '/',
  '/reservierung',
  '/speisekarte',
  '/mittagsmenu',
  '/getraenke',
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
    mode === "production" && prerender({
      routes: routes,
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'prerender-ready',
        timeout: 30000,
      },
      postProcess(renderedRoute) {
        // Fix URLs for production
        renderedRoute.html = renderedRoute.html
          .replace(/http:/ig, 'https:')
          .replace(/(https:\/\/)?(localhost|127\.0\.0\.1):\d*/ig, 'https://ristorantestoria.de');
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
