// webvitals.js - report Core Web Vitals to Cloud Function
import { onCLS, onFID, onLCP, onTTFB, onINP } from "https://unpkg.com/web-vitals@4/dist/web-vitals.attribution.iife.js";
function send(metric){
  try{
    navigator.sendBeacon?.("/vitals", JSON.stringify(metric)) ||
    fetch("/vitals", { method:"POST", keepalive:true, body: JSON.stringify(metric) });
  }catch(_){}
}
onCLS(send); onFID(send); onLCP(send); onTTFB(send); onINP(send);