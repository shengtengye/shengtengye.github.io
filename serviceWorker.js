const site = "Thomas's Website";
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  // "/images/xxx.jpg",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(site).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
