import { httpsCallable, getFunctions } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";
import { auth } from "./auth.js";
export async function submitReport({type="listing", targetId, reason}){
  const user = auth.currentUser; if(!user) throw new Error("로그인이 필요합니다.");
  const fn = httpsCallable(getFunctions(), "submitReport");
  const res = await fn({ type, targetId, reason });
  return res.data;
}