import { db } from "./auth.js";
import {
  collection, getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

async function renderStats(){
  const members = await getCountFromServer(collection(db,"users"));
  const todayJoin = 56; // TODO: implement with date filter
  const reports = await getCountFromServer(collection(db,"reports"));
  setText('stat-members', members.data().count || 0);
  setText('stat-today', todayJoin);
  setText('stat-reports', reports.data().count || 0);
}
function setText(id, v){ const el = document.getElementById(id); if(el) el.textContent = v; }

document.addEventListener('DOMContentLoaded', renderStats);