import { httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";
import { functions } from "./auth.js";

/**
 * Cloud Functions (callable) 호출
 * @param {string} name 
 * @param {any} data 
 * @returns {Promise<any>}
 */
export function callCallable(name, data = {}){
  return httpsCallable(functions, name)(data).then(r => r.data);
}

const IS_FIREBASE_HOSTING = location.host.endsWith(".web.app") || location.host.endsWith(".firebaseapp.com");

/**
 * onRequest URL 리졸브 (Firebase Hosting 또는 Vercel에서 공통 사용)
 * Firebase Hosting이면 /__/functions/{name} 로 프록시됨.
 * Vercel 등 외부 호스팅이면 아래 TRIGGER_URLS에 직접 입력 필요.
 */
const TRIGGER_URLS = {
  // 예: search_products: "https://search-products-xxxxx-asia-northeast3.a.run.app"
};

export function onRequestUrl(name){
  if(IS_FIREBASE_HOSTING) return `/__/functions/${name}`;
  if(!TRIGGER_URLS[name]) throw new Error(`Trigger URL for ${name} missing`);
  return TRIGGER_URLS[name];
}