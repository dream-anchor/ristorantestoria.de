import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from "@/lib/helmetAsync";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

/**
 * Hydration-Strategie:
 * - Pre-renderte Seiten haben data-prerendered-path auf #root
 * - Nur hydratieren wenn der aktuelle Pfad zum Pre-Render passt
 * - Sonst: createRoot (verhindert weiße Seite bei dynamischen Routen)
 */
const normalizePath = (p: string) => p.replace(/\/+$/, '') || '/';

if (import.meta.env.PROD) {
  const prerenderedPath = root.dataset.prerenderedPath;
  const currentPath = normalizePath(window.location.pathname);
  const isMatch = prerenderedPath && normalizePath(prerenderedPath) === currentPath;

  if (isMatch) {
    hydrateRoot(root, app);
  } else {
    // Kein Pre-Render für diese Route: DOM + State aufräumen, fresh rendern
    root.innerHTML = '';
    delete (window as any).__REACT_QUERY_STATE__;
    createRoot(root).render(app);
  }
} else {
  createRoot(root).render(app);
}
