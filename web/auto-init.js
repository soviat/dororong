/**
 * Dororong auto-init
 * - No HTML/CSS change
 * - Include this ONCE at the end of <body>: <script type="module" src="./auto-init.js"></script>
 * - It will import auth.js, then load page module by filename automatically.
 */
const filename = location.pathname.split('/').pop().toLowerCase();
await import('./auth.js'); // ensure Firebase init

const route = {
  'index.html': null, // index already wires via layout.js
  'product_detail.html': './product_detail.js',
  'register_product.html': './register_product.js',
  'chat.html': './chat.js',
  'feed.html': './feed.js',
  'favorites.html': './favorites.js',
  'mypage.html': './mypage.js',
  'keyword_settings.html': './keyword_settings.js',
  'admin.html': './admin.js',
};

// Attempt to infer default page for empty filename (e.g., / -> index.html)
const key = filename || 'index.html';
const mod = route[key];
if (mod) {
  await import(mod);
}

// Optional developer aid: check for required DOM hooks and log hints (no UI change)
const required = {
  'product_detail.html': ['pd-title','pd-price','pd-desc','pd-images','pd-chat-btn','pd-fav-btn'],
  'register_product.html': ['register-form','image-input','image-preview','title','category','price','description'],
  'chat.html': ['chat-list','chat-input','chat-send'],
  'feed.html': ['feed-list'],
  'favorites.html': ['fav-list'],
  'mypage.html': ['stat-selling','stat-sold','stat-reviews'],
  'keyword_settings.html': ['kw-list','kw-input','kw-add'],
  'admin.html': ['stat-members','stat-today','stat-reports'],
};

const need = required[key] || [];
const missing = need.filter(id => !document.getElementById(id));
if (missing.length) {
  console.warn('[Dororong] Missing DOM ids on %s: %o\nAdd id attributes without changing design.', key, missing);
}