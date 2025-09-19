export const $ = (s, el=document) => el.querySelector(s);
export const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
export const fmtWon = (n) => (Number(n||0)).toLocaleString() + "원";
export const esc = (s="") => s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
export const tokenify = (s="") => Array.from(new Set(String(s).toLowerCase().split(/[\s\/\-_.\[\](),]+/).filter(Boolean))).slice(0,30);
export function thumbset(url){
  try{
    const i = url.lastIndexOf('.'); if(i<0) return {src:url, srcset:`${url}`};
    const base = url.slice(0,i); const ext = url.slice(i);
    return { src:url, srcset:`${base}_thumb320${ext} 320w, ${base}_thumb640${ext} 640w, ${url} 1024w` };
  }catch{ return {src:url, srcset:url}; }
}