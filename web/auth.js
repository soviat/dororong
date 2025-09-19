import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, limit, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";
const firebaseConfig={apiKey:"AIzaSyCF8NmZBwrV25o0-RZRIzwuBSbjB7M8dkQ",authDomain:"project-eae45.firebaseapp.com",projectId:"project-eae45",storageBucket:"project-eae45.appspot.com",messagingSenderId:"401084912598",appId:"1:401084912598:web:07d24bf3ce95a349200a77"};
export const app=initializeApp(firebaseConfig);export const auth=getAuth(app);export const db=getFirestore(app);export const storage=getStorage(app);export const functions=getFunctions(app,"asia-northeast3");
export function onAuthInit(cb){return onAuthStateChanged(auth,u=>cb?.(u||null));}
export async function signInWithGoogleOnce(){const p=new GoogleAuthProvider();const r=await signInWithPopup(auth,p);return r.user;}
export async function signOutOnce(){await signOut(auth);}export const nowTs=()=>serverTimestamp();
export async function fetchLatestProducts({pageSize=20}={}){const q=query(collection(db,"products"),where("status","==","active"),orderBy("createdAt","desc"),limit(pageSize));const snap=await getDocs(q);return snap.docs.map(d=>({id:d.id,...d.data()}));}