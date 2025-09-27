// tools/test_order_flow.mjs - run against emulator (recommended)
import admin from "firebase-admin";
admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || "demo-dororong" });
const db = admin.firestore();

async function main(){
  const orderRef = db.collection("orders").doc("o_demo");
  await orderRef.set({ listingId:"l1", price:150000, buyerId:"u_buyer", sellerId:"u_seller", status:"paid", createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge:true });
  console.log("Created demo order 'paid'");

  const after = (await orderRef.get()).data();
  console.log("Fee:", after.fee, "Settle:", after.settleAmount);
}
main().catch(e=>{ console.error(e); process.exit(1); });