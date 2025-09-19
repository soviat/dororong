import { db, auth } from "./auth.js";
import { doc, setDoc, deleteDoc, getDoc, collection, onSnapshot, query, getDoc as g, doc as d } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { $, esc } from "./helpers.js";
export async function toggleFavorite(listingId){
  const user = auth.currentUser; if(!user) throw new Error("로그인이 필요합니다.");
  const ref = doc(db, `users/${user.uid}/favorites/${listingId}`);
  const snap = await getDoc(ref);
  if (snap.exists()) { await deleteDoc(ref); return { on:false }; }
  await setDoc(ref, { listingId, createdAt: Date.now() });
  return { on:true };
}
export function observeFavoritesList(outSel){
  const out = $(outSel); if(!out) return;
  const user = auth.currentUser; if(!user){ out.innerHTML="<div class='card'>로그인이 필요합니다.</div>"; return; }
  const q = query(collection(db, `users/${user.uid}/favorites`));
  onSnapshot(q, async (snap)=>{
    out.innerHTML=""; if(snap.empty){ out.innerHTML="<div class='card'>아직 찜한 상품이 없어요.</div>"; return; }
    for(const docSnap of snap.docs){
      const id = docSnap.data().listingId;
      const res = await g(d(db,"listings", id)); if(!res.exists()) continue;
      const it = res.data();
      const a = document.createElement("a"); a.className="card"; a.href=`product_detail.html?id=${id}`; a.textContent = it.title || id;
      out.appendChild(a);
    }
  });
}