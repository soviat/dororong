One‑liner install (no design changes)

1) Unzip into your repo root.
   - web/*  -> /web
   - functions/* -> /functions

2) Add ONE line at the end of every HTML page (or your shared footer):
   <script type="module" src="./auto-init.js"></script>
   (This file auto-loads proper page modules by filename.)

That's it. If a page is missing the tiny id hooks, open DevTools and see the console warning listing required ids for that page. Adding ids doesn't change visual design.

Pages auto-wired:
- product_detail.html, register_product.html, chat.html, feed.html, favorites.html, mypage.html, keyword_settings.html, admin.html

If you already include layout.js on index.html, nothing else to do for the home page.

Functions:
- onCall: calcFee, report
- onRequest: health