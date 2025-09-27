import { db } from "./auth.js";
import { collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { $, esc, fmtWon, tokenify, thumbset } from "./helpers.js";
export async function runSearch(qs){
  const terms = tokenify(qs).slice(0,10);
  const out = $("#search-results");
  out.innerHTML = `<div class="card">검색 중...</div>`;
  if(terms.length===0){ out.innerHTML = `<div class="card">키워드를 입력해 주세요.</div>`; return; }
  const ref = collection(db,"listings");
  const snap = await getDocs(query(ref, where("searchTerms","array-contains-any", terms), where("status","==","active"), orderBy("createdAt","desc"), limit(30)));
  const items = []; snap.forEach(d=>items.push({id:d.id, ...d.data()}));
  if(items.length===0){ out.innerHTML = `<div class="card">결과가 없어요.</div>`; return; }
  out.innerHTML = "";
  for(const d of items){
    const ts = thumbset(d.imageUrl||"");
    const a = document.createElement("a"); a.className="card"; a.href=`product_detail.html?id=${d.id}`;
    a.innerHTML = `<div class="flex">
      <img class="img" src="${ts.src}" srcset="${ts.srcset}" sizes="120px" style="width:72px;height:72px;object-fit:cover;border-radius:12px" loading="lazy"/>
      <div><div style="font-weight:700">${esc(d.title||'')}</div><div class="muted">${fmtWon(d.price||0)}</div></div>
    </div>`; out.appendChild(a);
  }
}