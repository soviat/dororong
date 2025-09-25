export function BottomNav() {
  return `
    <nav style="padding:0.5rem; background:#fff; border-top:1px solid var(--border-color); position:fixed; bottom:0; left:0; right:0;">
      <a href="#/home" style="margin-right:1rem;">홈</a>
      <a href="#/feed" style="margin-right:1rem;">피드</a>
      <a href="#/chat" style="margin-right:1rem;">채팅</a>
      <a href="#/my">마이</a>
    </nav>
  `;
}