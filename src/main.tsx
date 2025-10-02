import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/globals.css";
import "./styles/accessibility.css";

const saved = sessionStorage.getItem('gh:redirect');
if (saved) {
  sessionStorage.removeItem('gh:redirect');
  const BASE = (import.meta as any).env?.BASE_URL || '/';
  const ORIGIN_BASE = window.location.origin + BASE;
  const url = new URL(saved.replace(/^\//, ''), ORIGIN_BASE);
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
}

createRoot(document.getElementById("root")!).render(<App />);
