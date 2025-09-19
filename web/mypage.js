import { auth, db } from "./auth.js";
import {
  collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

async function renderMyStats(){
  if(!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  const selling = await getDocs(query(collection(db,"products"), where("uid","==",uid), where("status","==","active")));
  const sold = await getDocs(query(collection(db,"products"), where("uid","==",uid), where("status","==","sold")));
  const reviews = await getDocs(query(collection(db,"reviews"), where("to","==",uid)));
  setText('stat-selling', selling.size);
  setText('stat-sold', sold.size);
  setText('stat-reviews', reviews.size);
}

function setText(id, v){ const el = document.getElementById(id); if(el) el.textContent = v; }

document.addEventListener('DOMContentLoaded', renderMyStats);