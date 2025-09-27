// messaging.auto.js - auto register device token post-login
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getMessaging, getToken, isSupported } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging.js";
import { firebaseConfig, auth } from "./auth.js";
import { httpsCallable, getFunctions } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";

export async function autoRegisterFCM(vapidKey){
  try{
    if(!await isSupported()) return;
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey });
    if(token && auth.currentUser){
      const fn = httpsCallable(getFunctions(), "registerDeviceToken");
      await fn({ token });
      console.log("FCM token registered");
    }
  }catch(e){ console.warn("FCM auto-register failed", e); }
}

// Call this after login:
window.addEventListener("load", ()=>{
  const VAPID = window.FCM_VAPID_KEY || "YOUR_VAPID_KEY";
  // Wait a tick so onAuthStateChanged runs first
  setTimeout(()=>autoRegisterFCM(VAPID), 800);
});