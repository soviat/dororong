// firebase-app.js, firebase-auth.js 등 필요한 SDK를 import 합니다.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-functions.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js';

// Firebase 프로젝트 설정 값 (이 정보는 공개되어도 안전합니다)
const firebaseConfig = {
  apiKey: "AIzaSy...", // 실제 값은 GitHub에 있는 값을 사용합니다.
  authDomain: "project-eae45.firebaseapp.com",
  projectId: "project-eae45",
  storageBucket: "project-eae45.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// --- 핵심 수정 사항 ---
// Firebase 앱을 초기화하고 그 결과를 상수로 선언합니다.
export const app = initializeApp(firebaseConfig);

// 초기화된 app을 기반으로 다른 서비스들도 즉시 초기화합니다.
export const auth = getAuth(app);
export const functions = getFunctions(app, 'asia-northeast3');
export const storage = getStorage(app);

// 로그인 상태 감지 및 UI 업데이트 로직은 그대로 둡니다.
const provider = new GoogleAuthProvider();

export function handleAuthUI(user) {
  const nav = document.getElementById('app-nav');
  if (!nav) return;
  if (user) {
    nav.innerHTML = `<span>${user.displayName}님 환영합니다!</span> <button id="logout-btn">로그아웃</button>`;
    document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));
  } else {
    nav.innerHTML = `<button id="login-btn">Google 로그인</button>`;
    document.getElementById('login-btn').addEventListener('click', () => signInWithPopup(auth, provider));
  }
}

onAuthStateChanged(auth, (user) => {
  handleAuthUI(user);
});
