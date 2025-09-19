export const ProtectedPages = new Set([
  "admin.html","register_product.html","mypage.html","sales.html",
  "favorites.html","notifications.html","chat.html"
]);
export function currentPage(){ return (location.pathname.split('/').pop()||"index.html"); }
export function mountNav(user){
  const nav = document.querySelector("#app-nav"); if(!nav) return;
  const authed = !!user; const name = user?.displayName || user?.email || "사용자";
  nav.innerHTML = `<div class="inner"><div class="brand">
    <div class="logo"></div><a href="index.html">도로롱 마켓</a></div>
    <div class="flex">
      <a href="market.html">마켓</a>
      <a href="search.html">검색</a>
      <a href="feed.html">피드</a>
      ${authed ? `<a href="register_product.html">등록</a>` : ``}
      <a href="notifications.html">알림</a>
      ${authed ? `<a href="mypage.html">마이</a>` : `<a href="login.html">로그인</a>`}
      ${authed ? `<span class="badge">${name}</span>` : ``}
    </div></div>`;
}
export function guardIfNeeded(user){
  const page = currentPage();
  if(ProtectedPages.has(page) && !user){
    sessionStorage.setItem("returnTo", location.href);
    location.href = "login.html";
  }
}
window.Layout = { ProtectedPages, currentPage, mountNav, guardIfNeeded };