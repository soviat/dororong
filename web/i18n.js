// i18n.js - ultra light i18n for ko/en
const dict = {
  ko: { home:"홈", market:"마켓", login:"로그인", logout:"로그아웃", feed:"피드" },
  en: { home:"Home", market:"Market", login:"Login", logout:"Logout", feed:"Feed" }
};
export function t(key){ const lang = localStorage.getItem("lang") || navigator.language.slice(0,2) || "ko"; return (dict[lang]||dict.ko)[key] || key; }
export function setLang(lang){ localStorage.setItem("lang", lang); location.reload(); }
window.I18N = { t, setLang };