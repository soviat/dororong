// tools/seed.mjs - Seed Firestore (emulator or dev project)
// Usage: node tools/seed.mjs
import admin from "firebase-admin";
import { readFileSync } from "node:fs";
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS; // optional for prod
admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || "demo-dororong" });
const db = admin.firestore();
const data = {
  users: [
    { uid:"u_alice", displayName:"Alice", score:4.8 },
    { uid:"u_bob", displayName:"Bob", score:4.2 }
  ],
  listings: [
    { id:"l1", title:"넨도로이드 레무", price:45000, character:"레무", category:"넨도", ownerId:"u_alice", status:"active", createdAt: admin.firestore.FieldValue.serverTimestamp() },
    { id:"l2", title:"피그마 사쿠라", price:70000, character:"사쿠라", category:"피그마", ownerId:"u_bob", status:"active", createdAt: admin.firestore.FieldValue.serverTimestamp() }
  ]
};
async function run(){
  for(const u of data.users){
    await db.collection("users").doc(u.uid).set(u, { merge:true });
  }
  for(const l of data.listings){
    const id = l.id; const {id:_, ...rest} = l;
    await db.collection("listings").doc(id).set(rest, { merge:true });
  }
  console.log("Seeded.");
  process.exit(0);
}
run().catch(err=>{ console.error(err); process.exit(1); });