// theme.js - light/dark theme toggle with prefers-color-scheme
export function applyTheme(){
  const pref = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light");
  document.documentElement.dataset.theme = pref;
}
export function toggleTheme(){
  const cur = document.documentElement.dataset.theme || "light";
  const next = cur==="light" ? "dark" : "light";
  localStorage.setItem("theme", next);
  applyTheme();
}
applyTheme();
window.Theme = { toggleTheme };