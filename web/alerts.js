import { auth, db } from "./auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { $, tokenify } from "./helpers.js";
export async function mountAlerts(){
  const user = auth.currentUser; if(!user){ document.querySelector("#alerts").innerHTML="<div class='card'>로그인이 필요합니다.</div>"; return; }
  const ref = doc(db,"alerts", user.uid);
  const snap = await getDoc(ref); const arr = (snap.exists()? (snap.data().keywords||[]) : []);
  $("#kw").value = arr.join(", ");
  $("#save").onclick = async ()=>{
    const toks = tokenify($("#kw").value);
    await setDoc(ref,{ keywords: toks }, { merge:true });
    alert("저장되었습니다.");
  };
}