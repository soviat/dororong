// payments.js - Escrow-style order flow (client side scaffold)
import { auth, db } from "./auth.js";
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { httpsCallable, getFunctions } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";

export async function startCheckout({listingId}){
  const user = auth.currentUser; if(!user) throw new Error("로그인이 필요합니다.");
  // Read listing info
  const snap = await getDoc(doc(db,"listings", listingId));
  if(!snap.exists()) throw new Error("상품이 존재하지 않습니다.");
  const li = snap.data();

  // Create order doc
  const orderRef = await addDoc(collection(db,"orders"), {
    listingId, sellerId: li.ownerId, buyerId: user.uid,
    price: li.price, status: "created",
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });

  // Request payment intent from server (mock provider)
  const fn = httpsCallable(getFunctions(), "createPaymentIntent");
  const res = await fn({ orderId: orderRef.id, amount: li.price });
  // Redirect to provider hosted page (mock url)
  if(res?.data?.checkoutUrl){
    location.href = res.data.checkoutUrl;
  }else{
    throw new Error("결제 생성 실패");
  }
}

export async function confirmReturn(){
  // Called on checkout_return.html after provider redirects back
  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");
  const status = params.get("status"); // 'succeeded' | 'canceled'
  if(!orderId) return;
  const ref = doc(db,"orders", orderId);
  await updateDoc(ref, { clientReturn: status || "unknown" });
  // Server-side webhook will set the official status; here we just display.
  return { orderId, status };
}