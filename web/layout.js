import { onAuthInit, signInWithGoogleOnce, signOutOnce, fetchLatestProducts } from "./auth.js";

const currency = (n) => {
  const num = typeof n === "number" ? n : Number(String(n).replace(/[^0-9.]/g, ""));
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(isNaN(num) ? 0 : num);
};

function toast(msg){
  const el = document.getElementById("auth-toast");
  if(!el) return;
  el.innerHTML = `<div class="fixed bottom-20 left-1/2 -translate-x-1/2 card p-2 text-sm">${msg}</div>`;
  setTimeout(() => { el.innerHTML = ""; }, 1800);
}

function renderHeader(user){
  const header = document.getElementById("app-nav");
  if(!header) return;
  // 우측 컨테이너(아이콘들 있는 곳) 선택 (마지막 자식 div)
  const right = header.querySelector(":scope > div:last-child");
  if(!right) return;

  // 기존에 우리가 추가한 요소 제거
  right.querySelectorAll("[data-drr]").forEach(n => n.remove());

  if(user){
    // 등록 버튼
    const btnReg = document.createElement("a");
    btnReg.href = "register_product.html";
    btnReg.textContent = "등록";
    btnReg.setAttribute("data-drr","1");
    btnReg.className = "btn btn-primary text-sm ml-2";
    right.appendChild(btnReg);

    // 로그아웃 버튼
    const btnOut = document.createElement("button");
    btnOut.type = "button";
    btnOut.textContent = "로그아웃";
    btnOut.setAttribute("data-drr","1");
    btnOut.className = "btn text-sm ml-2";
    btnOut.addEventListener("click", async () => {
      await signOutOnce();
      toast("로그아웃 되었습니다.");
    });
    right.appendChild(btnOut);
  }else{
    // 로그인 버튼
    const btnIn = document.createElement("button");
    btnIn.type = "button";
    btnIn.textContent = "Google 로그인";
    btnIn.setAttribute("data-drr","1");
    btnIn.className = "btn btn-primary text-sm ml-2";
    btnIn.addEventListener("click", async () => {
      try{
        await signInWithGoogleOnce();
        toast("환영합니다!");
      }catch(e){
        console.error(e);
        toast("로그인에 실패했습니다.");
      }
    });
    right.appendChild(btnIn);
  }
}

function productCard(p){
  const img = (p.images && p.images[0]) ? p.images[0] : "https://placehold.co/600x600";
  // 디자인 시스템 준수: .card 사용, 색상은 변수에 위임. Tailwind는 여백/크기만.
  return `
    <a href="product_detail.html?id=${encodeURIComponent(p.id)}" class="card block hover:shadow transition">
      <div class="w-full aspect-square overflow-hidden mb-3 bg-white">
        <img src="${img}" alt="${(p.title||"상품").replace(/"/g,'&quot;')}" class="w-full h-full object-cover">
      </div>
      <div class="text-sm font-semibold line-clamp-1">${p.title || "제목 없음"}</div>
      <div class="text-sm text-secondary mt-1">${currency(p.price)}</div>
    </a>
  `;
}

async function renderProducts(){
  const grid = document.getElementById("product-grid");
  const loading = document.getElementById("loading-message");
  try{
    const items = await fetchLatestProducts({ pageSize: 20 });
    if(loading) loading.remove();
    if(!items.length){
      grid.innerHTML = '<p class="col-span-2 text-center text-secondary">아직 상품이 없어요.</p>';
      return;
    }
    grid.innerHTML = items.map(productCard).join("");
  }catch(e){
    console.error(e);
    if(loading) loading.textContent = "상품을 불러오지 못했습니다.";
  }
}

function wireBottomNav(){
  const nav = document.querySelector("nav.bottom-nav");
  if(!nav) return;
  const anchors = nav.querySelectorAll("a.nav-item");
  if(anchors[1]) anchors[1].setAttribute("href", "feed.html");
  if(anchors[2]) anchors[2].setAttribute("href", "register_product.html");
  if(anchors[3]) anchors[3].setAttribute("href", "chat.html");
  if(anchors[4]) anchors[4].setAttribute("href", "mypage.html");
}

// 초기화
onAuthInit((user) => renderHeader(user));
wireBottomNav();
renderProducts();