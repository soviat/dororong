export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

export function qs(id){ return document.getElementById(id); }

export function toast(msg, ms=1600){
  let el = qs('auth-toast');
  if(!el){
    el = document.createElement('div');
    el.id = 'auth-toast';
    document.body.appendChild(el);
  }
  el.innerHTML = `<div class="fixed bottom-20 left-1/2 -translate-x-1/2 card p-2 text-sm">${msg}</div>`;
  setTimeout(() => el.innerHTML = '', ms);
}