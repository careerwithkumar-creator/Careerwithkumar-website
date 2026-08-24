export const THEME_STORAGE_KEY = "cwk-theme";

// Runs synchronously, before first paint (see its placement as the first
// child of <body> in the root layout) — reads the visitor's explicit choice
// if they made one, otherwise falls back to system preference. Written as a
// plain string (not a React event handler) because it has to execute before
// React hydrates.
export const THEME_BOOTSTRAP_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;
