// sw.js - PWA offline cache (simple)
const VERSION = 'v1';
const CORE = ['/','/index.html','/styles.css','/manifest.webmanifest'];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==VERSION && caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  e.respondWith((async ()=>{
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req);
    if(hit) return hit;
    try{
      const res = await fetch(req);
      if(res.ok) cache.put(req, res.clone());
      return res;
    }catch(_){
      // offline fallback
      if(req.mode==='navigate') return await cache.match('/index.html');
      throw _;
    }
  })());
});