import { db, auth } from "./auth.js";
import { collection, addDoc, serverTimestamp, onSnapshot, orderBy, query, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { $ } from "./helpers.js";
export async function ensureChatWith(targetUid){
  const me = auth.currentUser; if(!me) throw new Error("로그인이 필요합니다.");
  const [a,b] = [me.uid, targetUid].sort();
  const chatId = `${a}_${b}`;
  const ref = doc(db, "chats", chatId);
  const snap = await getDoc(ref);
  if(!snap.exists()){ await setDoc(ref, { participants:[a,b], updatedAt: serverTimestamp(), lastMsg:"" }); }
  return chatId;
}
export function mountChatUI({wrap="#chat-wrap", chatId, targetUid}){
  const el = $(wrap);
  el.innerHTML = `<div class="card"><div id="msgs" style="height:360px; overflow:auto; display:flex; flex-direction:column; gap:8px"></div>
    <div style="display:flex; gap:8px; margin-top:8px"><input id="msg" class="input" placeholder="메시지 입력" style="flex:1" />
    <button id="send" class="btn btn-brand">보내기</button></div></div>`;
  const msgs = $("#msgs"); const me = auth.currentUser;
  const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt","asc"));
  onSnapshot(q, (snap)=>{ msgs.innerHTML=""; snap.forEach(d=>{
      const m = d.data(); const mine = m.from === me.uid;
      const row = document.createElement("div"); row.style.alignSelf = mine ? "flex-end" : "flex-start";
      row.innerHTML = `<div class="card" style="max-width:70%; ${mine?'background:#eef2ff':''}">${m.text||''}</div>`;
      msgs.appendChild(row);
    }); msgs.scrollTop = msgs.scrollHeight; });
  $("#send").addEventListener("click", async ()=>{
    const text = $("#msg").value.trim(); if(!text) return;
    await addDoc(collection(db, "chats", chatId, "messages"), { from: me.uid, text, createdAt: serverTimestamp() });
    await updateDoc(doc(db,"chats",chatId), { lastMsg: text, updatedAt: serverTimestamp() });
    $("#msg").value="";
  });
}