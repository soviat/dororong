import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut,
  GoogleAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore, collection, query, where, orderBy, limit,
  getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyCF8NmZBwrV25o0-RZRIzwuBSbjB7M8dkQ",
  authDomain: "project-eae45.firebaseapp.com",
  projectId: "project-eae45",
  storageBucket: "project-eae45.appspot.com",
  messagingSenderId: "401084912598",
  appId: "1:401084912598:web:07d24bf3ce95a349200a77",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "asia-northeast3");
export const nowTs = () => serverTimestamp();

/**
 * Auth 상태 초기화 후 콜백 실행
 * @param {(user: import('firebase/auth').User|null)=>void} callback 
 */
export function onAuthInit(callback){
  onAuthStateChanged(auth, (user) => {
    try { callback(user); } catch(e){ console.error(e); }
  });
}

export async function signInWithGoogleOnce(){
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
  return user;
}

export async function signOutOnce(){
  await signOut(auth);
}

/**
 * 최신 상품 가져오기
 * @param {{pageSize?: number}} opts 
 * @returns {Promise<Array<{id:string,title:string,price:number,images?:string[],createdAt:any,status:string}>>}
 */
export async function fetchLatestProducts({ pageSize = 20 } = {}){
  const q = query(
    collection(db, "products"),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}