import { auth, db } from "./auth.js";
import {
  collection, addDoc, serverTimestamp, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

function getParam(name){
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

async function init(){
  const room = getParam('room');
  if(!room) return;
  const msgCol = collection(db, "chats", room, "messages");
  const list = document.getElementById('chat-list');
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-send');

  onSnapshot(query(msgCol, orderBy('createdAt')), (snap) => {
    list.innerHTML = '';
    snap.forEach(docu => {
      const m = docu.data();
      const mine = auth.currentUser && m.uid === auth.currentUser.uid;
      const item = document.createElement('div');
      item.className = `flex ${mine? 'justify-end' : 'justify-start'} mb-2`;
      item.innerHTML = `<span class="text-xs ${mine? 'text-white' : ''} p-2 rounded-lg" style="background-color:${mine? 'var(--primary-color)': 'var(--surface-color)'}; border: 1px solid var(--border-color);">${m.text||''}</span>`;
      list.appendChild(item);
      list.scrollTop = list.scrollHeight;
    });
  });

  btn?.addEventListener('click', async () => {
    const text = (input?.value || '').trim();
    if(!text) return;
    input.value='';
    await addDoc(msgCol, { uid: auth.currentUser?.uid || 'anon', text, createdAt: serverTimestamp() });
  });
}

document.addEventListener('DOMContentLoaded', init);