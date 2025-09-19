import { auth, db } from "./auth.js";
import { uploadImages } from "./product_upload.js";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { $, esc } from "./helpers.js";

export function mountFeed(){
  const form = $("#feed-form");
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    try{
      const user = auth.currentUser; if(!user) throw new Error("로그인이 필요합니다.");
      const text = $("#post-text").value.trim();
      const files = $("#post-images").files;
      let images = [];
      if(files && files.length){ const up = await uploadImages(files, "posts"); images = up.all; }
      await addDoc(collection(db, "posts"), { ownerId:user.uid, text, images, createdAt: serverTimestamp() });
      form.reset();
    }catch(err){ alert(err.message||err); }
  });

  const out = $("#feed-list");
  const qy = query(collection(db,"posts"), orderBy("createdAt","desc"));
  onSnapshot(qy, (snap)=>{
    out.innerHTML="";
    snap.forEach(d=>{
      const p = d.data();
      const el = document.createElement("div"); el.className="card";
      const imgs = (p.images||[]).map(u=>`<img class="img" src="${u}" loading="lazy" style="max-width:100%;border-radius:12px" />`).join("");
      el.innerHTML = `<div><div class="muted">${p.ownerId}</div><p>${esc(p.text||'')}</p>${imgs}
        <div class="flex" style="margin-top:8px">
          <button class="btn" data-like="${d.id}">좋아요</button>
          <input class="input" data-cmt="${d.id}" placeholder="댓글 달기" />
          <button class="btn" data-sendc="${d.id}">댓글</button>
        </div>
        <div id="c-${d.id}" class="grid"></div>
      </div>`;
      out.appendChild(el);
    });
  });

  out.addEventListener("click", async (e)=>{
    const b = e.target.closest("button[data-like]");
    if(b){
      const id = b.getAttribute("data-like");
      await toggleLike(id);
    }
    const sc = e.target.closest("button[data-sendc]");
    if(sc){
      const id = sc.getAttribute("data-sendc");
      const input = $(`input[data-cmt="${id}"]`);
      const text = input.value.trim(); if(!text) return;
      await addComment(id, text); input.value="";
    }
  });
}

async function toggleLike(postId){
  const user = auth.currentUser; if(!user) throw new Error("로그인이 필요합니다.");
  const ref = doc(db, `posts/${postId}/likes/${user.uid}`);
  const snap = await getDoc(ref);
  if(snap?.exists) { await deleteDoc(ref); } else { await setDoc(ref, { createdAt: serverTimestamp() }); }
}
import { getDoc, doc as d } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
async function addComment(postId, text){
  const user = auth.currentUser; if(!user) throw new Error("로그인이 필요합니다.");
  await addDoc(collection(db, `posts/${postId}/comments`), { from:user.uid, text, createdAt: serverTimestamp() });
}