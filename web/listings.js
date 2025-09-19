import { db } from "./auth.js";
import { collection, query, where, orderBy, limit, startAfter, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { $, esc, fmtWon, thumbset } from "./helpers.js";
const PAGE = 12;
export async function loadMarket({last=null, category=null, character=null}={}){
  let ref = collection(db, "listings");
  const clauses = [ where("status","==","active") ];
  if (category) clauses.push(where("category","==",category));
  if (character) clauses.push(where("character","==",character));
  let q = query(ref, ...clauses, orderBy("createdAt","desc"), limit(PAGE));
  if (last) q = query(ref, ...clauses, orderBy("createdAt","desc"), startAfter(last), limit(PAGE));
  const snap = await getDocs(q);
  const items = []; snap.forEach(d=>items.push({ id:d.id, ...d.data() }));
  renderCards(items, !last);
  return { items, last: snap.docs.at(-1) || null };
}
function renderCards(items, replace){
  const wrap = $("#market-list"); if(!wrap) return;
  if (replace) wrap.innerHTML = "";
  for(const d of items){
    const el = document.createElement("a"); el.className="card"; el.href = `product_detail.html?id=${d.id}`;
    const ts = thumbset(d.imageUrl||"");
    el.innerHTML = `<div class="flex">
      <img class="img" src="${ts.src}" srcset="${ts.srcset}" sizes="(max-width:768px) 88px, 160px" alt="" style="width:88px;height:88px;object-fit:cover;border-radius:12px" loading="lazy"/>
      <div><div style="font-weight:700">${esc(d.title||'')}</div>
      <div class="muted">${fmtWon(d.price||0)}</div>
      <div style="color:#98a2b3;font-size:.85rem">${esc(d.character||'')}${d.category?' · '+esc(d.category):''}</div></div></div>`;
    wrap.appendChild(el);
  }
}