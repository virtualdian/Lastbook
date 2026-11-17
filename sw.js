/* Lastbook Loosduinen: service worker.
 * - App-bestanden: vooraf opgeslagen, eerst uit de cache.
 * - Kleine data (hulppunten, straten, lettertypen, iconen): cache, op de achtergrond verversen.
 * - Kaart (map.pmtiles): na "Kaart offline opslaan" uit de cache, met ondersteuning
 *   voor HTTP Range-verzoeken (PMTiles leest losse stukjes van het bestand).
 */
const BUILD = "__BUILD__";
const SHELL_CACHE = "lb-shell-" + BUILD;
const DATA_CACHE = "lb-data";
const MAP_CACHE = "lb-map";

const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "area.json",
  "css/app.css",
  "js/guides.js",
  "js/app.js",
  "js/map.js",
  "vendor/maplibre-gl.js",
  "vendor/maplibre-gl.css",
  "vendor/pmtiles.js",
  "vendor/basemaps.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png"
];

const url = (p) => new URL(p, self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL_CACHE);
    await shell.addAll(SHELL.map((p) => new Request(url(p), { cache: "reload" })));
    // Kleine data: zo veel mogelijk, maar installatie faalt niet als het ontbreekt.
    try {
      const res = await fetch(url("data/meta.json"), { cache: "no-cache" });
      if (res.ok) {
        const meta = await res.clone().json();
        const data = await caches.open(DATA_CACHE);
        await data.put(url("data/meta.json"), res);
        const list = ["data/poi.json", "data/streets.json", ...(meta.assets || [])];
        await Promise.all([...new Set(list)].map(async (p) => {
          try { const r = await fetch(url(p), { cache: "no-cache" }); if (r.ok) await data.put(url(p), r); } catch { /* later */ }
        }));
      }
    } catch { /* nog geen data */ }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) {
      if (k.startsWith("lb-shell-") && k !== SHELL_CACHE) await caches.delete(k);
    }
    await self.clients.claim();
  })());
});

/* ---------- kaart met Range-ondersteuning ---------- */
let mapBlob = null, mapBlobKey = null;
async function cachedMapBlob() {
  const cache = await caches.open(MAP_CACHE);
  const res = await cache.match(url("data/map.pmtiles"));
  if (!res) { mapBlob = null; mapBlobKey = null; return null; }
  const key = res.headers.get("X-Lb-Built") + "|" + res.headers.get("X-Lb-Bytes");
  if (mapBlob && mapBlobKey === key) return mapBlob;
  mapBlob = await res.blob();
  mapBlobKey = key;
  return mapBlob;
}

async function handleMap(request) {
  const range = request.headers.get("range");
  // Zonder Range is het de download zelf: altijd via het netwerk.
  if (!range) return fetch(request);
  const blob = await cachedMapBlob();
  if (!blob) return fetch(request);
  const m = /bytes=(\d+)-(\d*)/.exec(range);
  if (!m) return new Response(blob, { status: 200, headers: { "Content-Type": "application/octet-stream", "Content-Length": String(blob.size) } });
  const start = Number(m[1]);
  const end = m[2] ? Math.min(Number(m[2]), blob.size - 1) : blob.size - 1;
  if (start >= blob.size || start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${blob.size}` } });
  }
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${blob.size}`,
      "Accept-Ranges": "bytes",
      "ETag": '"' + (mapBlobKey || "lb") + '"'
    }
  });
}

addEventListener("message", (e) => { if (e.data === "map-updated") { mapBlob = null; mapBlobKey = null; } });

/* ---------- strategieën ---------- */
async function shellFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  const hit = await cache.match(request, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const res = await fetch(request);
    if (res.ok && request.method === "GET") cache.put(request, res.clone());
    return res;
  } catch (e) {
    if (request.mode === "navigate") {
      const idx = await cache.match(url("index.html"));
      if (idx) return idx;
    }
    throw e;
  }
}

async function dataStaleWhileRevalidate(request, event) {
  const cache = await caches.open(DATA_CACHE);
  const key = request.url.split("?")[0];
  const hit = await cache.match(key);
  const net = fetch(request).then((res) => {
    if (res.ok) cache.put(key, res.clone());
    return res;
  }).catch(() => null);
  if (hit) { event.waitUntil(net); return hit; }
  const res = await net;
  return res || new Response("", { status: 504, statusText: "Offline" });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.origin !== self.location.origin) return;
  const scope = new URL(self.registration.scope).pathname;
  const path = u.pathname.startsWith(scope) ? u.pathname.slice(scope.length) : u.pathname;

  if (path === "data/map.pmtiles") { event.respondWith(handleMap(req)); return; }
  if (path.startsWith("data/")) { event.respondWith(dataStaleWhileRevalidate(req, event)); return; }
  if (req.mode === "navigate") {
    event.respondWith(shellFirst(new Request(url("index.html"))).catch(() => fetch(req)));
    return;
  }
  event.respondWith(shellFirst(req));
});
