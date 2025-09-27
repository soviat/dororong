// sentry.init.js - front error capture (wire your DSN)
export function initSentry(){
  // Minimal placeholder to avoid hard dep if DSN not set
  const DSN = window.SENTRY_DSN || "";
  if(!DSN){ console.info("Sentry disabled (no DSN)"); return; }
  // Lightweight loader (optional to swap with official SDK)
  window.addEventListener("error", (e)=>{
    fetch("/__err", { method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ m: e.message, s: e.filename+':'+e.lineno+':'+e.colno, t: Date.now() }) }).catch(()=>{});
  });
  window.addEventListener("unhandledrejection", (e)=>{
    fetch("/__err", { method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ m: String(e.reason), t: Date.now() }) }).catch(()=>{});
  });
}
initSentry();