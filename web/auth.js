// auth.js — Applied Firebase init for project-eae45

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider,
  signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

// ✅ Your project's config (applied)
export const firebaseConfig = {
  apiKey: "AIzaSyCF8NmZBwrV25o0-RZRIzwuBSbjB7M8dkQ",
  authDomain: "project-eae45.firebaseapp.com",
  projectId: "project-eae45",
  storageBucket: "project-eae45.appspot.com",
  messagingSenderId: "401084912598",
  appId: "1:401084912598:web:07d24bf3ce95a349200a77"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth helpers
export async function loginWithGoogle(){ return await signInWithPopup(auth, new GoogleAuthProvider()); }
export async function loginEmail(email, pw){ return await signInWithEmailAndPassword(auth, email, pw); }
export async function registerEmail(email, pw){ return await createUserWithEmailAndPassword(auth, email, pw); }
export async function logout(){ return await signOut(auth); }

// Basic UI hook (optional)
onAuthStateChanged(auth, (u)=>{
  const e = document.getElementById("auth-status");
  if (e) e.textContent = u ? `로그인: ${u.email||u.uid}` : "로그아웃 상태";
});