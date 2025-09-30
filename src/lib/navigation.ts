// Navigation utility for consistent routing throughout the app
const BASE = (import.meta as any).env?.BASE_URL || '/';
const ORIGIN_BASE = (typeof window !== 'undefined' ? window.location.origin : '') + BASE;

export const toAbsolute = (p: string) => new URL(p.replace(/^\//, ''), ORIGIN_BASE).pathname;

export const navigate = (path: string) => {
  const absolutePath = toAbsolute(path);
  window.history.pushState({}, '', absolutePath);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const replace = (path: string) => {
  const absolutePath = toAbsolute(path);
  window.history.replaceState({}, '', absolutePath);
  window.dispatchEvent(new PopStateEvent('popstate'));
};