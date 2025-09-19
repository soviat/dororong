import { db } from "./auth.js";
import {
  collection, query, orderBy, limit, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

function postCard(p){
  const ts = p.createdAt?.toDate?.() ? p.createdAt.toDate() : new Date();
  return `
  <article class="border-b" style="border-color: var(--border-color);">
    <div class="p-4">
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
        <div>
          <p class="font-bold">${p.authorName || '익명'}</p>
          <p class="text-xs" style="color: var(--text-secondary-color);">${ts.toLocaleString('ko-KR')}</p>
        </div>
      </div>
      <p class="mt-3 whitespace-pre-wrap">${p.text || ''}</p>
    </div>
    ${p.image ? `<img src="${p.image}" class="w-full h-64 object-cover">` : ''}
    <div class="p-4 flex justify-between items-center">
      <div class="text-sm" style="color: var(--text-secondary-color);">❤️ ${p.likes || 0} · 💬 ${p.comments || 0}</div>
      <span>...</span>
    </div>
  </article>`;
}

async function renderFeed(){
  const el = document.getElementById('feed-list');
  if(!el) return;
  const q = query(collection(db, "posts"), orderBy("createdAt","desc"), limit(20));
  const snap = await getDocs(q);
  el.innerHTML = snap.docs.map(d => postCard(d.data())).join('') || `<p class="text-center text-sm" style="color:var(--text-secondary-color);">아직 게시물이 없어요.</p>`;
}

document.addEventListener('DOMContentLoaded', renderFeed);