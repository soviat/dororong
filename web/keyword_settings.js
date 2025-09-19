import { auth, db } from "./auth.js";
import {
  collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

async function renderKeywords(){
  if(!auth.currentUser) return;
  const list = document.getElementById('kw-list');
  const snap = await getDocs(collection(db, "users", auth.currentUser.uid, "keywords"));
  list.innerHTML = snap.docs.map(d => `<li class="flex justify-between items-center p-3 rounded-lg" style="background-color: var(--bg-color);">
    <span>${d.id}</span>
    <button data-id="${d.id}" class="font-bold text-red-500">X</button>
  </li>`).join('') || '<p class="text-sm" style="color:var(--text-secondary-color);">등록된 키워드가 없습니다.</p>';
  list.querySelectorAll('button[data-id]').forEach(btn => btn.addEventListener('click', () => removeKeyword(btn.dataset.id)));
}

async function addKeyword(){
  const input = document.getElementById('kw-input');
  const kw = (input.value||'').trim();
  if(!kw) return;
  await setDoc(doc(db, "users", auth.currentUser.uid, "keywords", kw), { createdAt: serverTimestamp() });
  input.value='';
  renderKeywords();
}

async function removeKeyword(id){
  await deleteDoc(doc(db, "users", auth.currentUser.uid, "keywords", id));
  renderKeywords();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('kw-add')?.addEventListener('click', addKeyword);
  renderKeywords();
});