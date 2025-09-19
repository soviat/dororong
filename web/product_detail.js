import { auth, db } from "./auth.js";
import {
  doc, getDoc, serverTimestamp, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { qs, toast } from "./utils/dom.js";

function getParam(name){
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

async function loadProduct(){
  const id = getParam('id');
  if(!id){ toast("상품 ID가 없습니다."); return; }
  const snap = await getDoc(doc(db, "products", id));
  if(!snap.exists()){ toast("상품을 찾을 수 없습니다."); return; }
  const p = snap.data();

  setText('pd-title', p.title);
  setText('pd-price', new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(p.price || 0));
  setText('pd-desc', p.description || '');
  const imgWrap = document.getElementById('pd-images');
  if(imgWrap){
    imgWrap.innerHTML = (p.images||[]).slice(0,5).map(url => `<img src="${url}" class="w-full h-64 object-cover rounded-lg mb-2">`).join('') || `<img src="https://placehold.co/600x400?text=No+Image" class="w-full h-64 object-cover rounded-lg">`;
  }

  const chatBtn = document.getElementById('pd-chat-btn');
  if(chatBtn){
    chatBtn.addEventListener('click', () => openChatWithSeller(id, p.uid));
  }
  const favBtn = document.getElementById('pd-fav-btn');
  if(favBtn){
    favBtn.addEventListener('click', () => toggleFavorite(id));
  }
}

function setText(id, text){
  const el = document.getElementById(id);
  if(el) el.textContent = text;
}

async function openChatWithSeller(productId, sellerUid){
  if(!auth.currentUser){ toast("로그인이 필요합니다."); return; }
  if(auth.currentUser.uid === sellerUid){
    toast("본인 상품입니다."); return;
  }
  const participants = [auth.currentUser.uid, sellerUid].sort().join('_');
  const roomId = `p_${productId}_${participants}`;
  await setDoc(doc(db, "chats", roomId), {
    productId, participants: [auth.currentUser.uid, sellerUid], createdAt: serverTimestamp()
  }, { merge: true });
  location.href = `chat.html?room=${encodeURIComponent(roomId)}`;
}

async function toggleFavorite(productId){
  if(!auth.currentUser){ toast("로그인이 필요합니다."); return; }
  const { getDoc, doc, deleteDoc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js");
  const favDoc = doc(db, "users", auth.currentUser.uid, "favorites", productId);
  const snap = await getDoc(favDoc);
  if(snap.exists()){
    await deleteDoc(favDoc);
    toast("찜 해제");
  }else{
    await setDoc(favDoc, { productId, createdAt: serverTimestamp() });
    toast("찜 완료");
  }
}

document.addEventListener('DOMContentLoaded', loadProduct);