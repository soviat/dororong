import { HomePage } from "./pages/home.js";

const routes = {
  "": HomePage,
  "#/home": HomePage,
  "#/my": () => "<div class='page-my'><h2>마이페이지</h2></div>",
  "#/feed": () => "<div class='page-feed'><h2>피드</h2></div>",
  "#/chat": () => "<div class='page-chat'><h2>채팅</h2></div>",
  "#/quests": () => "<div class='page-quests'><h2>일일 퀘스트</h2></div>",
  "#/notifications": () => "<div class='page-notifications'><h2>알림</h2></div>",
};

export function router(renderLayout) {
  function loadPage() {
    const path = window.location.hash || "";
    const pageFn = routes[path] || (() => "<h2>404 Not Found</h2>");
    renderLayout(pageFn());
  }
  window.addEventListener("hashchange", loadPage);
  loadPage();
}