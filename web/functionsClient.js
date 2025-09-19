import { httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";
import { functions } from "./auth.js";

export function callCallable(name, data = {}) {
  return httpsCallable(functions, name)(data).then(r => r.data);
}
const IS_FIREBASE_HOSTING =
  location.host.endsWith(".web.app") || location.host.endsWith(".firebaseapp.com");
const TRIGGER_URLS = {};
export function onRequestUrl(name) {
  if (IS_FIREBASE_HOSTING) return `/__/functions/${name}`;
  if (!TRIGGER_URLS[name]) throw new Error(`Trigger URL for ${name} missing`);
  return TRIGGER_URLS[name];
}
