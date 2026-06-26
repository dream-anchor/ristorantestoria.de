import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from "@/lib/helmetAsync";
import App from "./App.tsx";
import { parseLocalizedPath } from "@/config/routes";
import { loadTranslations } from "@/translations";
import "./index.css";

const root = document.getElementById("root")!;

if (import.meta.env.PROD && typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    import("@/lib/reportError").then(({ reportError }) => {
      reportError({
        source: "frontend:window.error",
        severity: "error",
        message: `${e.message} (${e.filename}:${e.lineno}:${e.colno})`,
        payload: { filename: e.filename, lineno: e.lineno, colno: e.colno },
      });
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    import("@/lib/reportError").then(({ reportError }) => {
      reportError({
        source: "frontend:unhandledrejection",
        severity: "error",
        message: String(e.reason),
        payload: { reason: String(e.reason) },
      });
    });
  });
}

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

function mount() {
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
}

// Übersetzungen der aktiven Sprache laden, BEVOR (hydratisiert) gerendert wird —
// sonst hat der LanguageProvider beim ersten Render keinen Cache-Eintrag.
const activeLanguage = parseLocalizedPath(window.location.pathname).language;
loadTranslations(activeLanguage).then(mount);
