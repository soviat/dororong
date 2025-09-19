import { db, auth } from "./auth.js";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { $ } from "./helpers.js";
export function observeNotifications(outSel){
  const out = $(outSel); if(!out) return;
  const user = auth.currentUser;
  if(!user){ out.innerHTML = "<div class='card'>로그인이 필요합니다.</div>"; return; }
  const q = query(collection(db,"notifications"), where("uid","==",user.uid), orderBy("createdAt","desc"));
  onSnapshot(q, (snap)=>{
    out.innerHTML = "";
    if(snap.empty){ out.innerHTML = "<div class='card'>새 알림이 없어요.</div>"; return; }
    snap.forEach(d=>{
      const n = d.data();
      const el = document.createElement("div"); el.className="card";
      const link = n.listingId ? `<a href="product_detail.html?id=${n.listingId}">보러가기</a>` : "";
      el.innerHTML = `<div class="flex" style="justify-content:space-between">
        <div>${n.type||"알림"}</div>
        <div class="flex">${link}<button class="btn" data-id="${d.id}">${n.read?"읽음":"읽기"}</button></div>
      </div>`; out.appendChild(el);
    });
    out.addEventListener("click", async (e)=>{
      const b = e.target.closest("button[data-id]"); if(!b) return;
      await updateDoc(doc(db,"notifications", b.getAttribute("data-id")), { read: true });
    }, { once:true });
  });
}