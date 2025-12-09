import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";

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

const Renderer = vitePrerender.PuppeteerRenderer;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && vitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: routes,
      renderer: new Renderer({
        renderAfterDocumentEvent: 'prerender-ready',
        timeout: 30000,
      }),
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
