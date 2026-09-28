const CACHE='mohasabi-v2';
const FILES=[
  './',
  './index.html',
  './manifest.json'
  // أضف هنا كل ملفات JS و CSS والخطوط والمكتبات (Chart.js وغيرها)
];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r&&(r.ok||r.type==='opaque')){
        const c=r.clone();
        caches.open(CACHE).then(ch=>ch.put(e.request,c));
      }
      return r;
    }).catch(()=>
      caches.match(e.request,{ignoreSearch:true}).then(m=>
        m||caches.match('./index.html')||caches.match('./')
      )
    )
  );
});
