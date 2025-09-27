// payments.adapters.js - provider-agnostic client helper
import { httpsCallable, getFunctions } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";

export async function createCheckout({ provider="stripe", orderId }){
  const fns = getFunctions();
  const map = {
    stripe: "createStripeCheckout",
    toss: "createTossCheckout",
    iamport: "createIamportCheckout"
  };
  const name = map[provider];
  if(!name) throw new Error("Unknown provider: " + provider);
  const res = await httpsCallable(fns, name)({ orderId });
  if(res?.data?.url) location.href = res.data.url;
  else throw new Error("No checkout URL");
}