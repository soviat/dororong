// error.boundary.js - tiny UI guard for critical sections
export function withBoundary(fn, onError){
  try{ return fn(); }catch(e){ console.error(e); if(onError) onError(e); }
}
export function renderError(el, msg="문제가 발생했습니다. 잠시 후 다시 시도해 주세요."){
  if(!el) return; el.innerHTML = `<div class="card" style="border:1px solid #fecaca;background:#fff1f2;color:#991b1b">${msg}</div>`;
}