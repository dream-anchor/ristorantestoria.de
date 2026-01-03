// NEUE VERSION (Static / Hydration Support)
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root");

if (container && container.hasChildNodes()) {
  // Wenn HTML schon da ist (durch react-snap generiert) -> Hydrate
  hydrateRoot(container, <App />);
} else {
  // Wenn leer (lokale Entwicklung oder Fallback) -> Render
  if (container) {
    createRoot(container).render(<App />);
  }
}
