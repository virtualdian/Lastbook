/* Lastbook Loosduinen: offline kaart (MapLibre + PMTiles) en hulppunten. */
(function () {
  "use strict";
  const LB = window.LB;
  const { $, esc, dist, bearing, fmtDist, area } = LB;

  const CATS = {
    aed:        { label: "AED",              color: "#d6336c" },
    ziekenhuis: { label: "Ziekenhuis",       color: "#c92a2a" },
    huisarts:   { label: "Huisarts/kliniek", color: "#e8590c" },
    apotheek:   { label: "Apotheek",         color: "#2f9e44" },
    hulpdienst: { label: "Hulpdiensten",     color: "#1c7ed6" },
    water:      { label: "Drinkwater",       color: "#1098ad" },
    winkel:     { label: "Supermarkt",       color: "#7048e8" },
    bouwmarkt:  { label: "Bouwmarkt",        color: "#795548" },
    tank:       { label: "Tankstation",      color: "#495057" },
    verzamel:   { label: "Verzamelen",       color: "#f08c00" }
  };
  window.LB_POI_CATS = CATS;
  const DEFAULT_ON = ["aed", "ziekenhuis", "huisarts", "apotheek", "hulpdienst", "water"];

  let active = new Set(LB.store.get("map-cats", DEFAULT_ON).filter((c) => CATS[c]));
  let pois = [];
  let map = null, mapState = "idle"; // idle | loading | ready | failed
  let userPos = null, geo = null, popup = null, marker = null;
  let pendingFocus = null;

  /* ---------- scripts lui laden (MapLibre is groot) ---------- */
  function loadScript(src) {
    return new Promise((ok, fail) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = () => fail(new Error("Kan " + src + " niet laden"));
      document.head.appendChild(s);
    });
  }
  function loadCss(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l);
  }

  /* ---------- chips ---------- */
  function renderChips() {
    $("#chips").innerHTML = Object.entries(CATS).map(([id, c]) =>
      `<button type="button" class="chip" data-cat="${id}" aria-pressed="${active.has(id)}"><span class="dot" style="background:${c.color}"></span>${esc(c.label)}</button>`).join("");
  }
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    const id = b.dataset.cat;
    if (active.has(id)) active.delete(id); else active.add(id);
    LB.store.set("map-cats", [...active]);
    b.setAttribute("aria-pressed", active.has(id));
    applyFilter(); renderList();
  });

  /* ---------- lijst (sheet) ---------- */
  const sheet = $("#sheet");
  function setSheet(state) { // "min" | "mid" | "open"
    sheet.classList.toggle("open", state === "open");
    sheet.classList.toggle("min", state === "min");
    $("#sheet-toggle").setAttribute("aria-expanded", state === "open");
  }
  $("#sheet-toggle").addEventListener("click", () => {
    setSheet(sheet.classList.contains("min") ? "mid" : sheet.classList.contains("open") ? "min" : "open");
  });
  const mobile = () => window.matchMedia("(max-width: 899px)").matches;
  // ruimte voor zoekbalk, filters en lijst zodat een gekozen punt in beeld valt
  const focusPadding = () => ({ top: mobile() ? 380 : 260, bottom: mobile() ? 90 : 20, left: mobile() ? 20 : 420, right: 20 });

  function origin() {
    return userPos || [area.center[1], area.center[0]];
  }

  function renderList() {
    const body = $("#sheet-body");
    if (!pois.length) {
      body.innerHTML = `<p class="muted small" style="padding:0 6px">Nog geen hulppunten beschikbaar. Ze worden gebouwd bij het publiceren van de app. Open de app één keer met internet.</p>`;
      $("#sheet-title").textContent = "Dichtbij";
      return;
    }
    const o = origin();
    const list = pois.filter((p) => active.has(p[0]))
      .map((p) => ({ p, d: dist(o, [p[1], p[2]]) }))
      .sort((a, b) => a.d - b.d).slice(0, 60);
    $("#sheet-title").textContent = userPos ? "Dichtbij jou" : `Dichtbij ${area.short} (centrum)`;
    body.innerHTML = (userPos ? "" : `<p class="muted small" style="margin:0 6px 8px">Tik op het locatie-icoon op de kaart om afstanden vanaf jouw plek te zien.</p>`) +
      (list.length ? `<ul class="list">${list.map(({ p, d }, i) => `<li><button class="row" type="button" data-i="${pois.indexOf(p)}">
        <span class="dot" style="background:${CATS[p[0]].color}"></span>
        <span class="txt"><b>${esc(p[3] || p[4])}</b><span>${[p[3] ? p[4] : "", p[5] ? p[5].split("\n")[0] : ""].filter(Boolean).map(esc).join(" · ")}</span></span>
        <span class="dist">${fmtDist(d)}<br>${bearing(o, [p[1], p[2]])}</span></button></li>`).join("")}</ul>`
        : `<p class="muted small" style="padding:0 6px">Kies hierboven een of meer soorten hulppunten.</p>`);
  }
  $("#sheet-body").addEventListener("click", (e) => {
    const b = e.target.closest("button.row"); if (!b) return;
    const p = pois[+b.dataset.i];
    focusPoi(p);
  });

  function popupHTML(p) {
    const o = origin();
    const d = dist(o, [p[1], p[2]]);
    const q = encodeURIComponent(p[3] || p[4]);
    return `<div class="pop"><b>${esc(p[3] || p[4])}</b>${p[3] ? `<span class="sub">${esc(p[4])}</span>` : ""}
      ${p[5] ? `<div class="info">${esc(p[5])}</div>` : ""}
      <div class="small muted">${fmtDist(d)} ${bearing(o, [p[1], p[2]])} van ${userPos ? "jou" : area.short + " (centrum)"}</div>
      <div class="small" style="margin-top:6px"><a href="https://maps.apple.com/?ll=${p[1]},${p[2]}&q=${q}" target="_blank" rel="noopener">Route (online)</a></div></div>`;
  }

  function focusPoi(p) {
    if (map && mapState === "ready") {
      if (mobile()) setSheet("min");
      map.flyTo({ center: [p[2], p[1]], zoom: Math.max(map.getZoom(), 16), padding: focusPadding() });
      if (popup) popup.remove();
      popup = new maplibregl.Popup({ offset: 10, maxWidth: "280px" }).setLngLat([p[2], p[1]]).setHTML(popupHTML(p)).addTo(map);
    } else {
      LB.toast(`${p[3] || p[4]}: ${p[5] ? p[5].split("\n")[0] : ""}`);
    }
  }

  function focusPoint(lat, lon, name) {
    if (!map || mapState !== "ready") { pendingFocus = { lat, lon, name }; return; }
    if (mobile()) setSheet("min");
    map.flyTo({ center: [lon, lat], zoom: 16, padding: focusPadding() });
    if (marker) marker.remove();
    marker = new maplibregl.Marker({ color: "#b9470b" }).setLngLat([lon, lat]).addTo(map);
    if (name) {
      if (popup) popup.remove();
      popup = new maplibregl.Popup({ offset: 30 }).setLngLat([lon, lat]).setHTML(`<div class="pop"><b>${esc(name)}</b></div>`).addTo(map);
    }
  }

  /* ---------- zoeken op de kaart ---------- */
  const q = $("#map-q"), results = $("#map-results");
  let seq = 0, found = [];
  q.addEventListener("input", async () => {
    const my = ++seq;
    const v = q.value.trim();
    if (v.length < 2) { results.hidden = true; return; }
    found = await LB.searchPlaces(v, 10);
    if (my !== seq) return;
    results.hidden = false;
    results.innerHTML = found.length
      ? `<ul class="list">${found.map((f, i) => `<li><button class="row" type="button" data-i="${i}"><span class="txt"><b>${esc(f.name)}</b><span>${esc(f.sub)}</span></span><span class="badge">${f.kind}</span></button></li>`).join("")}</ul>`
      : `<div class="card small muted" style="margin:0">Niets gevonden${pois.length ? "" : " (zoekgegevens nog niet beschikbaar)"}.</div>`;
  });
  results.addEventListener("click", (e) => {
    const b = e.target.closest("button.row"); if (!b) return;
    const f = found[+b.dataset.i];
    results.hidden = true; q.value = f.name; q.blur();
    focusPoint(f.lat, f.lon, f.name);
  });

  /* ---------- kaart ---------- */
  function poiGeoJSON() {
    return {
      type: "FeatureCollection",
      features: pois.map((p, i) => ({ type: "Feature", id: i, geometry: { type: "Point", coordinates: [p[2], p[1]] }, properties: { cat: p[0], name: p[3], i } }))
    };
  }
  function applyFilter() {
    if (!map || mapState !== "ready" || !map.getLayer("poi")) return;
    const f = ["in", ["get", "cat"], ["literal", [...active]]];
    map.setFilter("poi", f);
    map.setFilter("poi-label", f);
  }

  function showMsg(html) {
    const m = $("#map-msg");
    if (!html) { m.hidden = true; return; }
    m.innerHTML = `<div class="card">${html}</div>`; m.hidden = false;
  }

  async function initMap() {
    if (mapState !== "idle") return;
    mapState = "loading";
    let meta = null;
    try { meta = await LB.loadJSON("data/meta.json"); } catch { /* geen data */ }
    const saved = await LB.mapCachedInfo();
    if (!meta || !meta.map) {
      mapState = "idle";
      showMsg(`<b>Kaart nog niet beschikbaar</b><p class="small muted">De kaartgegevens worden gebouwd bij het publiceren. De lijst met hulppunten hieronder werkt wel als die er is.</p>`);
      return;
    }
    if (!saved && !navigator.onLine) {
      mapState = "idle";
      showMsg(`<b>Kaart niet offline opgeslagen</b><p class="small muted">Ga met internet naar <a href="#/">Nu</a> en tik op "Kaart offline opslaan". De lijst hieronder werkt wel.</p>`);
      return;
    }
    try {
      loadCss("vendor/maplibre-gl.css");
      await Promise.all([loadScript("vendor/maplibre-gl.js"), loadScript("vendor/pmtiles.js"), loadScript("vendor/basemaps.js")]);
    } catch (e) {
      mapState = "idle";
      showMsg(`<b>Kaart kan niet laden</b><p class="small muted">${esc(e.message)}</p>`);
      return;
    }
    await LB.areaReady;
    const dark = matchMedia("(prefers-color-scheme: dark)").matches;
    const flavor = dark ? "dark" : "light";
    const protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    const [w, s, e, n] = area.bbox;
    const padX = (e - w) * 0.15, padY = (n - s) * 0.15;
    let layers;
    try { layers = basemaps.layers("protomaps", basemaps.namedFlavor(flavor), { lang: "nl" }); }
    catch { layers = basemaps.layers("protomaps", basemaps.namedFlavor(flavor)); }

    map = new maplibregl.Map({
      container: "map",
      style: {
        version: 8,
        glyphs: LB.abs("data/fonts/") + "{fontstack}/{range}.pbf",
        sprite: LB.abs("data/sprites/" + flavor),
        sources: {
          protomaps: {
            type: "vector",
            url: "pmtiles://" + LB.abs("data/map.pmtiles"),
            attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://protomaps.com">Protomaps</a>'
          }
        },
        layers
      },
      center: area.center,
      zoom: area.zoom || 13,
      minZoom: 9,
      maxZoom: 19,
      maxBounds: [[w - padX, s - padY], [e + padX, n + padY]],
      attributionControl: { compact: true },
      cooperativeGestures: false
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    geo = new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true, showAccuracyCircle: true });
    map.addControl(geo, "top-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");
    geo.on("geolocate", (ev) => {
      const first = !userPos;
      userPos = [ev.coords.latitude, ev.coords.longitude];
      if (first) renderList();
    });
    geo.on("error", () => LB.toast("Locatie niet beschikbaar. Sta locatie toe in je instellingen."));

    map.on("error", (ev) => {
      // ontbrekende glyph-bereiken of losse tegels: niet fataal
      if (ev && ev.error && /pmtiles|Failed to fetch|NetworkError/i.test(String(ev.error.message)) && !navigator.onLine) {
        showMsg(`<b>Kaartdeel niet beschikbaar offline</b><p class="small muted">Sla de kaart op via <a href="#/">Nu</a>.</p>`);
      }
    });

    map.on("load", () => {
      mapState = "ready";
      showMsg(null);
      map.addSource("pois", { type: "geojson", data: poiGeoJSON() });
      const colorExpr = ["match", ["get", "cat"]];
      for (const [id, c] of Object.entries(CATS)) colorExpr.push(id, c.color);
      colorExpr.push("#888");
      map.addLayer({
        id: "poi", type: "circle", source: "pois",
        paint: {
          "circle-color": colorExpr,
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 3, 14, 6, 17, 9],
          "circle-stroke-color": dark ? "#14171c" : "#ffffff",
          "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 15, 2]
        }
      });
      map.addLayer({
        id: "poi-label", type: "symbol", source: "pois", minzoom: 15,
        layout: {
          "text-field": ["get", "name"], "text-font": ["Noto Sans Medium"], "text-size": 12,
          "text-offset": [0, 1.1], "text-anchor": "top", "text-optional": true, "text-max-width": 10
        },
        paint: { "text-color": dark ? "#eceae6" : "#1d1f23", "text-halo-color": dark ? "#14171c" : "#ffffff", "text-halo-width": 1.5 }
      });
      applyFilter();
      map.on("click", "poi", (ev) => {
        const f = ev.features && ev.features[0]; if (!f) return;
        focusPoi(pois[f.properties.i]);
      });
      map.on("mouseenter", "poi", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "poi", () => { map.getCanvas().style.cursor = ""; });
      if (pendingFocus) { const pf = pendingFocus; pendingFocus = null; focusPoint(pf.lat, pf.lon, pf.name); }
    });
  }

  async function loadPois() {
    if (pois.length) return;
    try {
      const d = await LB.loadJSON("data/poi.json");
      pois = d.items || [];
      if (map && mapState === "ready" && map.getSource("pois")) map.getSource("pois").setData(poiGeoJSON());
    } catch { pois = []; }
  }

  window.LBMap = {
    async show(opts = {}) {
      if (opts.cat && CATS[opts.cat]) {
        active = new Set([opts.cat]);
        LB.store.set("map-cats", [...active]);
        setSheet("open");
      }
      renderChips();
      await loadPois();
      renderList();
      if (opts.ll) {
        const [lat, lon] = opts.ll.split(",").map(Number);
        if (isFinite(lat) && isFinite(lon)) pendingFocus = { lat, lon, name: opts.name };
      }
      await initMap();
      if (map) {
        map.resize();
        applyFilter();
        if (pendingFocus && mapState === "ready") { const pf = pendingFocus; pendingFocus = null; focusPoint(pf.lat, pf.lon, pf.name); }
      }
    },
    hide() { if (popup) { popup.remove(); popup = null; } results.hidden = true; },
    get map() { return map; }
  };
  addEventListener("lb-map-saved", () => { if (mapState === "idle") showMsg(null); });
})();
