import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/globals.css";

const saved = sessionStorage.getItem('gh:redirect');
if (saved) {
  sessionStorage.removeItem('gh:redirect');
  const BASE = (import.meta as any).env?.BASE_URL || '/';
  const url = new URL(saved.replace(/^\//, ''), window.location.origin + BASE);
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
}

createRoot(document.getElementById("root")!).render(<App />);
