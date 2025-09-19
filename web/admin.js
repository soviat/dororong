import { auth, db } from "./auth.js";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { httpsCallable, getFunctions } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";
import { $ } from "./helpers.js";

export function mountAdmin(){
  const user = auth.currentUser;
  const out = $("#reports");
  const qy = query(collection(db,"admin/reports/items"), orderBy("createdAt","desc"));
  onSnapshot(qy, (snap)=>{
    out.innerHTML="";
    snap.forEach(d=>{
      const r = d.data();
      const el = document.createElement("div"); el.className="card";
      el.innerHTML = `<div class="flex" style="justify-content:space-between">
        <div>[${r.type}] ${r.targetId} — ${r.reason}</div>
        <div class="flex">
          <button class="btn" data-hide="${r.targetId}">숨김</button>
          <button class="btn" data-unhide="${r.targetId}">복구</button>
          <button class="btn" data-ban="${r.reporter}">신고자 제재?</button>
        </div>
      </div>`;
      out.appendChild(el);
    });
  });

  out.addEventListener("click", async (e)=>{
    const hide = e.target.closest("button[data-hide]");
    const unhide = e.target.closest("button[data-unhide]");
    const ban = e.target.closest("button[data-ban]");
    const fns = getFunctions();
    if(hide){ await httpsCallable(fns, "moderateListing")({ id: hide.getAttribute("data-hide"), action:"hide" }); alert("숨김 처리했습니다."); }
    if(unhide){ await httpsCallable(fns, "moderateListing")({ id: unhide.getAttribute("data-unhide"), action:"unhide" }); alert("복구했습니다."); }
    if(ban){ await httpsCallable(fns, "setUserBan")({ uid: ban.getAttribute("data-ban"), banned: true }); alert("사용자 제한했습니다."); }
  });
}