const filename=(location.pathname.split('/').pop()||'index.html').toLowerCase();
(async()=>{
  try{ await import('./auth.js'); }catch(e){ console.warn('auth.js load failed', e); }
  const route={
    'product_detail.html':'./product_detail.js',
    'register_product.html':'./register_product.js',
    'chat.html':'./chat.js',
    'feed.html':'./feed.js',
    'favorites.html':'./favorites.js',
    'mypage.html':'./mypage.js',
    'keyword_settings.html':'./keyword_settings.js',
    'admin.html':'./admin.js',
  };
  if(route[filename]){ try{ await import(route[filename]); }catch(e){ console.warn('page module failed', e);} }
})();