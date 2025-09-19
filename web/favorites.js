import { auth, db } from "./auth.js";
import {
  collection, getDocs, getDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

async function renderFavorites(){
  if(!auth.currentUser) return;
  const listEl = document.getElementById('fav-list');
  const snap = await getDocs(collection(db, "users", auth.currentUser.uid, "favorites"));
  const ids = snap.docs.map(d => d.id);
  if(!ids.length){ listEl.innerHTML = '<p class="text-center text-sm" style="color:var(--text-secondary-color);">찜한 상품이 없습니다.</p>'; return; }
  const prods = await Promise.all(ids.map(id => getDoc(doc(db, "products", id))));
  listEl.innerHTML = prods.filter(s => s.exists()).map(s => {
    const p = s.data();
    const img = (p.images && p.images[0]) || 'https://placehold.co/600x600';
    return `<a href="product_detail.html?id=${s.id}" class="flex items-center p-3 rounded hover:bg-gray-50">
      <img src="${img}" class="w-16 h-16 object-cover rounded mr-3">
      <div class="flex-1">
        <div class="font-semibold">${p.title}</div>
        <div class="text-sm" style="color: var(--text-secondary-color);">${Intl.NumberFormat('ko-KR',{style:'currency',currency:'KRW',maximumFractionDigits:0}).format(p.price||0)}</div>
      </div>
    </a>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', renderFavorites);