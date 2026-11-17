/* Lastbook Loosduinen: app-logica (router, gidsen, zoeken, plan, offline). */
(function () {
  "use strict";
  const BUILD = "__BUILD__";
  const $ = (s, el = document) => el.querySelector(s);
  const view = $("#view");

  /* ---------------- hulpfuncties ---------------- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const abs = (p) => new URL(p, location.href).href.split("#")[0];

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem("lb-" + key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem("lb-" + key, JSON.stringify(val)); return true; } catch { return false; }
    },
    del(key) { try { localStorage.removeItem("lb-" + key); } catch { /* niets */ } }
  };

  const ICONS = {
    plus: '<path d="M12 21s-7-4.4-9.3-9A5.4 5.4 0 0 1 12 6.3 5.4 5.4 0 0 1 21.3 12C19 16.6 12 21 12 21z"/><path d="M8 12h2.5l1.5-3 2 5 1.3-2H17"/>',
    drop: '<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>',
    wave: '<path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M7 9l3-5 3 5 3-3 3 3"/>',
    radio: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="m7 8 9-5M7 14h4M15.5 14a1.5 1.5 0 1 0 0 .01"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    back: '<path d="m15 6-6 6 6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'
  };
  const icon = (n, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;

  let toastTimer;
  function toast(msg, action) {
    const t = $("#toast");
    t.innerHTML = `<span>${esc(msg)}</span>` + (action ? `<button type="button">${esc(action.label)}</button>` : "");
    t.hidden = false;
    if (action) t.querySelector("button").onclick = () => { t.hidden = true; action.run(); };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, action ? 12000 : 3500);
  }

  // Afstand in km en windrichting tussen [lat, lon]-punten
  function dist(a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function bearing(a, b) {
    const r = Math.PI / 180;
    const y = Math.sin((b[1] - a[1]) * r) * Math.cos(b[0] * r);
    const x = Math.cos(a[0] * r) * Math.sin(b[0] * r) - Math.sin(a[0] * r) * Math.cos(b[0] * r) * Math.cos((b[1] - a[1]) * r);
    const deg = (Math.atan2(y, x) / r + 360) % 360;
    return ["noord", "noordoost", "oost", "zuidoost", "zuid", "zuidwest", "west", "noordwest"][Math.round(deg / 45) % 8];
  }
  const fmtDist = (km) => (km < 1 ? `${Math.round((km * 1000) / 10) * 10} m` : `${km.toFixed(km < 10 ? 1 : 0).replace(".", ",")} km`);
  const fmtMB = (b) => `${(b / 1048576).toFixed(b > 104857600 ? 0 : 1).replace(".", ",")} MB`;
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }); } catch { return iso; } };

  /* ---------------- data ---------------- */
  const cache = {};
  function loadJSON(path) {
    if (!cache[path]) {
      cache[path] = fetch(path).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .catch((e) => { delete cache[path]; throw e; });
    }
    return cache[path];
  }
  const area = { name: "Den Haag-Loosduinen", short: "Loosduinen", center: [4.2375, 52.0565], zoom: 13, bbox: [4.02, 51.92, 4.46, 52.19] };
  const areaReady = loadJSON("area.json").then((a) => Object.assign(area, a)).catch(() => area);

  /* ---------------- gidsen ---------------- */
  const GUIDES = window.LB_GUIDES || [];
  const CATS = window.LB_CATEGORIES || [];
  const guideById = Object.fromEntries(GUIDES.map((g) => [g.id, g]));
  const catById = Object.fromEntries(CATS.map((c) => [c.id, c]));

  const guideIndex = GUIDES.map((g) => ({
    g, t: norm(g.title), s: norm(g.short), b: norm(g.body.replace(/<[^>]+>/g, " "))
  }));

  function searchGuides(q) {
    const terms = norm(q).split(/\s+/).filter((t) => t.length > 1);
    if (!terms.length) return [];
    const res = [];
    for (const x of guideIndex) {
      let score = 0, all = true;
      for (const t of terms) {
        const s = (x.t.includes(t) ? 6 : 0) + (x.s.includes(t) ? 3 : 0) + (x.b.includes(t) ? 1 : 0);
        if (!s) { all = false; break; }
        score += s;
      }
      if (all) res.push([score, x.g]);
    }
    return res.sort((a, b) => b[0] - a[0]).map((r) => r[1]);
  }

  async function searchPlaces(q, limit = 12) {
    const n = norm(q).trim();
    if (n.length < 2) return [];
    const out = [];
    try {
      const s = await loadJSON("data/streets.json");
      for (const p of s.places) if (norm(p[0]).includes(n)) out.push({ kind: "plaats", name: p[0], sub: "Wijk of plaats", lat: p[1], lon: p[2], rank: norm(p[0]).startsWith(n) ? 0 : 2 });
      for (const st of s.streets) if (norm(st[0]).includes(n)) out.push({ kind: "straat", name: st[0], sub: st[3] || "Straat", lat: st[1], lon: st[2], rank: norm(st[0]).startsWith(n) ? 1 : 3 });
    } catch { /* nog geen data */ }
    try {
      const p = await loadJSON("data/poi.json");
      for (const it of p.items) if (it[3] && norm(it[3]).includes(n)) out.push({ kind: "plek", name: it[3], sub: it[4], lat: it[1], lon: it[2], cat: it[0], rank: norm(it[3]).startsWith(n) ? 1 : 3 });
    } catch { /* nog geen data */ }
    out.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name, "nl"));
    return out.slice(0, limit);
  }

  function guideRow(g) {
    return `<li><a href="#/gids/${g.id}"><div class="txt"><b>${esc(g.title)}</b><span>${esc(g.short)}</span></div>${icon("chev", "chev")}</a></li>`;
  }

  /* ---------------- views ---------------- */
  function setTab(tab) {
    document.querySelectorAll(".tabs a").forEach((a) => {
      if (a.dataset.tab === tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  function viewHome() {
    const hot = ["reanimatie", "bloeding", "verslikking", "bewusteloos", "beroerte", "brandwond", "koolmonoxide", "allergie"];
    const ramp = ["stroomuitval", "overstroming-acuut", "storm", "rampenzender", "drinkwater", "alarmnummers"];
    const near = [["aed", "AED"], ["ziekenhuis", "Ziekenhuis"], ["huisarts", "Huisarts"], ["apotheek", "Apotheek"], ["water", "Drinkwater"], ["winkel", "Supermarkt"]];
    view.innerHTML = `
      <a class="call112" href="tel:112">${icon("phone")}<span><span class="big">112</span><small>Levensgevaar? Bel direct.</small></span></a>
      <label class="search">${icon("search")}<input id="q" type="search" placeholder="Zoek: reanimatie, stroom, AED, straat…" autocomplete="off" enterkeyhint="search" aria-label="Zoeken in Lastbook"></label>
      <div id="results"></div>
      <div id="home-rest">
        <div class="section-title">Eerste hulp, nu meteen</div>
        <div class="grid">${hot.map((id) => guideById[id]).filter(Boolean).map((g) => `<a class="tile hot" href="#/gids/${g.id}"><b>${esc(g.title)}</b><span>${esc(g.short)}</span></a>`).join("")}</div>
        <div class="section-title">Bij een ramp of storing</div>
        <div class="grid">${ramp.map((id) => guideById[id]).filter(Boolean).map((g) => `<a class="tile" href="#/gids/${g.id}"><b>${esc(g.title)}</b><span>${esc(g.short)}</span></a>`).join("")}</div>
        <div class="section-title">Dichtbij ${esc(area.short)}</div>
        <div class="chips" style="flex-wrap:wrap">${near.map(([c, l]) => `<a class="chip" href="#/kaart/${c}"><span class="dot" style="background:${(window.LB_POI_CATS || {})[c]?.color || "var(--accent)"}"></span>${l}</a>`).join("")}</div>
        <div id="offline-card"></div>
        <div id="install-card"></div>
      </div>`;
    const q = $("#q"), results = $("#results"), rest = $("#home-rest");
    let seq = 0;
    q.addEventListener("input", async () => {
      const v = q.value.trim(), my = ++seq;
      if (!v) { results.innerHTML = ""; rest.hidden = false; return; }
      rest.hidden = true;
      const gs = searchGuides(v);
      const ps = await searchPlaces(v, 8);
      if (my !== seq) return;
      results.innerHTML =
        (gs.length ? `<div class="section-title">Gidsen</div><ul class="list">${gs.slice(0, 10).map(guideRow).join("")}</ul>` : "") +
        (ps.length ? `<div class="section-title">Op de kaart</div><ul class="list">${ps.map((p) => `<li><a href="#/kaart?ll=${p.lat},${p.lon}&n=${encodeURIComponent(p.name)}"><div class="txt"><b>${esc(p.name)}</b><span>${esc(p.sub)}</span></div><span class="badge">${p.kind}</span></a></li>`).join("")}</ul>` : "") +
        (!gs.length && !ps.length ? `<p class="muted">Niets gevonden voor "${esc(v)}". Probeer een ander woord, of kijk bij <a href="#/gidsen">alle gidsen</a>.</p>` : "");
    });
    renderOfflineCard($("#offline-card"));
    renderInstallCard($("#install-card"));
  }

  function viewGuides() {
    view.innerHTML = `<h1>Gidsen</h1>
      <p class="muted">Alles staat op je toestel en werkt zonder internet.</p>
      ${CATS.map((c) => {
        const list = GUIDES.filter((g) => g.cat === c.id);
        return `<div class="section-title" id="cat-${c.id}">${esc(c.title)}</div><ul class="list">${list.map(guideRow).join("")}</ul>`;
      }).join("")}`;
  }

  function viewCategory(id) {
    const c = catById[id];
    if (!c) return viewGuides();
    view.innerHTML = `<a class="crumb" href="#/gidsen">${icon("back")} Gidsen</a>
      <h1>${esc(c.title)}</h1><p class="lead">${esc(c.blurb)}</p>
      <ul class="list">${GUIDES.filter((g) => g.cat === id).map(guideRow).join("")}</ul>`;
  }

  function viewGuide(id) {
    const g = guideById[id];
    if (!g) { view.innerHTML = `<p>Deze gids bestaat niet. <a href="#/gidsen">Naar alle gidsen</a></p>`; return; }
    const c = catById[g.cat];
    const related = GUIDES.filter((x) => x.cat === g.cat && x.id !== g.id).slice(0, 5);
    view.innerHTML = `
      <a class="crumb" href="#/cat/${g.cat}">${icon("back")} ${esc(c ? c.title : "Gidsen")}</a>
      ${g.call112 ? `<a class="call112 compact" href="tel:112">${icon("phone")}<span><span class="big">112</span> bellen</span></a>` : ""}
      <article class="guide">
        <h1>${esc(g.title)}</h1>
        <p class="lead">${esc(g.short)}</p>
        ${g.body}
        ${g.src && g.src.length ? `<div class="sources"><b>Bronnen om na te lezen (online)</b><ul>${g.src.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>` : ""}
      </article>
      ${related.length ? `<div class="section-title">Ook in ${esc(c.title)}</div><ul class="list">${related.map(guideRow).join("")}</ul>` : ""}`;
    view.querySelectorAll("[data-checklist]").forEach(renderChecklist);
  }

  function renderChecklist(el) {
    const key = el.dataset.checklist;
    const groups = (window.LB_CHECKLISTS || {})[key] || [];
    const state = store.get("check-" + key, {});
    const total = groups.reduce((n, g) => n + g.items.length, 0);
    el.className = "checklist";
    el.innerHTML = `<div class="card"><b id="cl-count"></b><div class="progress"><i id="cl-bar"></i></div></div>` +
      groups.map((g) => `<fieldset><legend>${esc(g.group)}</legend>${g.items.map(([id, label]) =>
        `<label><input type="checkbox" data-id="${id}" ${state[id] ? "checked" : ""}><span>${esc(label)}</span></label>`).join("")}</fieldset>`).join("");
    const update = () => {
      const done = groups.reduce((n, g) => n + g.items.filter(([id]) => state[id]).length, 0);
      $("#cl-count", el).textContent = `${done} van ${total} in huis`;
      $("#cl-bar", el).style.width = `${Math.round((done / total) * 100)}%`;
    };
    el.addEventListener("change", (e) => {
      const id = e.target.dataset.id; if (!id) return;
      state[id] = e.target.checked; store.set("check-" + key, state); update();
    });
    update();
  }

  /* ---------------- Mijn plan ---------------- */
  const PLAN = [
    { legend: "Mijn huishouden", fields: [
      ["huishouden", "Wie wonen er (en bijzonderheden)", "textarea", "Bijvoorbeeld: 2 volwassenen, kind van 4, oma slechtziend."],
      ["huisdieren", "Huisdieren", "text"]
    ]},
    { legend: "Contacten", fields: [
      ["c1", "Contact 1", "pair"], ["c2", "Contact 2", "pair"], ["c3", "Contact 3", "pair"],
      ["cbuiten", "Contact buiten de regio (doorgeefluik)", "pair"]
    ]},
    { legend: "Afspraken", fields: [
      ["verzamel1", "Verzamelpunt in de buurt", "text", "Waar zie je elkaar als je niet in huis kunt?"],
      ["verzamel2", "Verzamelpunt buiten de wijk", "text"],
      ["onderdak", "Onderdak buiten de regio (adres)", "text", "Bij familie of vrienden, het liefst hoger gelegen."]
    ]},
    { legend: "Overstroming", fields: [
      ["oik_diepte", "Maximale waterdiepte op mijn adres (overstroomik.nl)", "text", "Eén keer online opzoeken en hier invullen."],
      ["oik_advies", "Advies van overstroomik.nl", "select", "", ["", "Blijven (hoger schuilen)", "Op tijd vertrekken", "Weet ik nog niet"]],
      ["hoog", "Hoogste veilige plek in huis of buurt", "text"]
    ]},
    { legend: "Zorg", fields: [
      ["huisarts", "Huisarts", "pair"], ["hap", "Huisartsenpost", "pair"], ["apotheek", "Apotheek", "pair"],
      ["medicijnen", "Medicijnen en dosering", "textarea"],
      ["allergie", "Allergieën en aandoeningen", "textarea"]
    ]},
    { legend: "In huis", fields: [
      ["kranen", "Waar zitten de hoofdkraan water, gaskraan en meterkast?", "text"],
      ["noodpakket", "Waar staat het noodpakket?", "text"],
      ["notities", "Overige notities", "textarea"]
    ]}
  ];

  function viewPlan() {
    const data = store.get("plan", {});
    const fieldHTML = ([id, label, type, hint, opts]) => {
      const v = data[id] || "";
      let input;
      if (type === "textarea") input = `<textarea id="f-${id}" name="${id}">${esc(v)}</textarea>`;
      else if (type === "select") input = `<select id="f-${id}" name="${id}">${opts.map((o) => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
      else if (type === "pair") {
        const [n, t] = Array.isArray(v) ? v : ["", ""];
        input = `<div class="pair"><input id="f-${id}" name="${id}" data-i="0" placeholder="Naam" value="${esc(n)}" autocomplete="off"><input name="${id}" data-i="1" type="tel" inputmode="tel" placeholder="Telefoon" value="${esc(t)}" autocomplete="off" aria-label="${esc(label)} telefoon"></div>`;
      } else input = `<input id="f-${id}" name="${id}" value="${esc(v)}" autocomplete="off">`;
      return `<div class="field"><label for="f-${id}">${esc(label)}</label>${input}${hint ? `<span class="hint">${esc(hint)}</span>` : ""}</div>`;
    };
    view.innerHTML = `<div class="plan">
      <h1>Mijn noodplan</h1>
      <p class="muted no-print">Vul in wat voor jou belangrijk is. Dit blijft <b>alleen op dit toestel</b> en gaat nergens heen. Print het ook: een lege telefoon helpt je niet.</p>
      <div class="row-actions no-print" style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn primary" id="p-print" type="button">Afdrukken</button>
        <button class="btn" id="p-share" type="button">Delen of kopiëren</button>
        <a class="btn" href="#/gids/noodpakket">Noodpakket-checklist</a>
      </div>
      <p class="saved no-print" id="p-saved" aria-live="polite"></p>
      <form id="plan-form" onsubmit="return false">
        ${PLAN.map((s) => `<fieldset><legend>${esc(s.legend)}</legend>${s.fields.map(fieldHTML).join("")}</fieldset>`).join("")}
      </form>
      <button class="btn danger no-print" id="p-clear" type="button">Alles wissen</button>
    </div>`;
    const form = $("#plan-form");
    let t;
    form.addEventListener("input", (e) => {
      const el = e.target, id = el.name;
      if (el.dataset.i != null) {
        const cur = Array.isArray(data[id]) ? data[id] : ["", ""];
        cur[+el.dataset.i] = el.value; data[id] = cur;
      } else data[id] = el.value;
      clearTimeout(t);
      t = setTimeout(() => {
        $("#p-saved").textContent = store.set("plan", data) ? "Opgeslagen op dit toestel" : "Opslaan lukt niet (privémodus?). Print je plan.";
      }, 300);
    });
    $("#p-print").onclick = () => window.print();
    $("#p-share").onclick = async () => {
      const text = planText(data);
      try {
        if (navigator.share) { await navigator.share({ title: "Mijn noodplan", text }); return; }
      } catch (e) { if (e && e.name === "AbortError") return; }
      try { await navigator.clipboard.writeText(text); toast("Plan gekopieerd"); } catch { toast("Kopiëren lukt niet op dit toestel"); }
    };
    $("#p-clear").onclick = () => {
      if (confirm("Weet je zeker dat je je hele plan van dit toestel wilt wissen?")) { store.del("plan"); viewPlan(); toast("Plan gewist"); }
    };
  }

  function planText(data) {
    const lines = ["MIJN NOODPLAN (Lastbook " + area.name + ")", ""];
    for (const s of PLAN) {
      const part = [];
      for (const [id, label] of s.fields) {
        let v = data[id];
        if (Array.isArray(v)) v = v.filter(Boolean).join(", ");
        if (v) part.push(`${label}: ${v}`);
      }
      if (part.length) lines.push(s.legend.toUpperCase(), ...part, "");
    }
    lines.push("Spoed: 112 | Politie geen spoed: 0900-8844 | Storing gas/stroom: 0800-9009 | Rampenzender: Radio West 89.3 FM");
    return lines.join("\n");
  }

  /* ---------------- offline & installeren ---------------- */
  const MAP_CACHE = "lb-map";
  const DATA_CACHE = "lb-data";
  async function mapCachedInfo() {
    try {
      const c = await caches.open(MAP_CACHE);
      const r = await c.match(abs("data/map.pmtiles"));
      if (!r) return null;
      return { built: r.headers.get("X-Lb-Built"), bytes: +r.headers.get("X-Lb-Bytes") || 0 };
    } catch { return null; }
  }

  async function downloadMap(meta, onProgress) {
    if (!("caches" in window)) throw new Error("Deze browser kan geen bestanden offline bewaren.");
    try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch { /* optioneel */ }
    // Kleine bestanden (lettertypen, iconen, hulppunten) eerst
    const dc = await caches.open(DATA_CACHE);
    const small = ["data/meta.json", "data/poi.json", "data/streets.json", ...(meta.assets || [])];
    await Promise.all([...new Set(small)].map((p) => fetch(p, { cache: "no-cache" }).then((r) => r.ok && dc.put(abs(p), r)).catch(() => {})));

    const res = await fetch(meta.map.file + "?v=" + encodeURIComponent(meta.built), { cache: "no-store" });
    if (!res.ok || !res.body) throw new Error("Download mislukt (" + res.status + ")");
    const total = meta.map.bytes;
    let loaded = 0;
    const chunks = [];
    const reader = res.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); loaded += value.length;
      onProgress(loaded, total);
    }
    const blob = new Blob(chunks, { type: "application/octet-stream" });
    if (total && blob.size !== total) throw new Error("Download onvolledig, probeer het opnieuw.");
    const mc = await caches.open(MAP_CACHE);
    await mc.put(abs("data/map.pmtiles"), new Response(blob, {
      headers: { "Content-Type": "application/octet-stream", "Content-Length": String(blob.size), "X-Lb-Built": meta.built, "X-Lb-Bytes": String(blob.size) }
    }));
    window.dispatchEvent(new Event("lb-map-saved"));
  }

  async function renderOfflineCard(el) {
    if (!el) return;
    const swOk = "serviceWorker" in navigator && navigator.serviceWorker.controller;
    let meta = null;
    try { meta = await loadJSON("data/meta.json"); } catch { /* nog geen data */ }
    const saved = await mapCachedInfo();
    let est = "";
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const e = await navigator.storage.estimate();
        if (e.usage) est = `In gebruik op dit toestel: ${fmtMB(e.usage)}.`;
      }
    } catch { /* optioneel */ }
    const outdated = saved && meta && meta.map && saved.built !== meta.built;
    let mapPart;
    if (!meta || !meta.map) mapPart = `<p class="muted small">De offline kaart is nog niet beschikbaar. Hij wordt gebouwd bij het publiceren van de app.</p>`;
    else if (saved && !outdated) mapPart = `<p><span class="status-ok">✓ Kaart opgeslagen</span> <span class="muted small">(${fmtMB(saved.bytes)}, ${fmtDate(saved.built)})</span></p>`;
    else mapPart = `<p>${outdated ? "Er is een nieuwere kaart." : "Sla de kaart en hulppunten op voor gebruik zonder internet."} <span class="muted small">${fmtMB(meta.map.bytes)}, liefst via wifi.</span></p>
      <div class="progress" hidden><i></i></div><p class="small muted" id="dl-status"></p>
      <div class="row-actions"><button class="btn primary" id="dl-map" type="button">${outdated ? "Kaart bijwerken" : "Kaart offline opslaan"}</button></div>`;
    el.innerHTML = `<div class="card">
      <h3>Offline klaar?</h3>
      <p>${swOk ? '<span class="status-ok">✓ Gidsen werken offline</span>' : '<span class="muted">Open de app nog één keer met internet, dan werken de gidsen offline.</span>'}</p>
      ${mapPart}
      ${est ? `<p class="muted small">${est}</p>` : ""}
    </div>`;
    const btn = $("#dl-map", el);
    if (btn) btn.onclick = async () => {
      btn.disabled = true;
      const bar = $(".progress", el), status = $("#dl-status", el);
      bar.hidden = false;
      try {
        await downloadMap(meta, (l, t) => {
          if (t) bar.firstElementChild.style.width = Math.min(100, (l / t) * 100) + "%";
          status.textContent = `${fmtMB(l)}${t ? " van " + fmtMB(t) : ""}`;
        });
        toast("Kaart opgeslagen. Werkt nu ook zonder internet.");
        renderOfflineCard(el);
      } catch (e) {
        status.textContent = e.message || "Opslaan mislukt.";
        btn.disabled = false;
      }
    };
  }

  let installEvt = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; const el = $("#install-card"); if (el) renderInstallCard(el); });
  const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  function renderInstallCard(el) {
    if (!el || standalone()) { if (el) el.innerHTML = ""; return; }
    if (isIOS()) {
      el.innerHTML = `<div class="card"><h3>Zet Lastbook op je beginscherm</h3>
        <ol class="small" style="padding-left:1.2em;margin:.4em 0">
          <li>Open deze pagina in <b>Safari</b>.</li>
          <li>Tik op <b>Deel</b> (het vierkantje met de pijl omhoog).</li>
          <li>Kies <b>Zet op beginscherm</b>.</li>
          <li>Open Lastbook vanaf je beginscherm en tik daar op <b>Kaart offline opslaan</b>.</li>
        </ol>
        <p class="muted small">Op een iPhone heeft de app op je beginscherm een eigen opslag. Sla de kaart dus op vanuit die app, niet vanuit Safari. Je noodplan blijft daar ook bewaard.</p></div>`;
    } else if (installEvt) {
      el.innerHTML = `<div class="card"><h3>Installeer Lastbook</h3><p class="small">Zet de app op je toestel. Dan start hij ook zonder internet.</p><div class="row-actions"><button class="btn primary" type="button" id="inst">Installeren</button></div></div>`;
      $("#inst", el).onclick = async () => { installEvt.prompt(); try { await installEvt.userChoice; } catch { /* */ } installEvt = null; renderInstallCard(el); };
    } else {
      el.innerHTML = `<div class="card"><h3>Installeren</h3><p class="small muted">Gebruik in je browsermenu "App installeren" of "Toevoegen aan startscherm". Op een computer werkt de app ook gewoon in een tabblad, en offline na het eerste bezoek.</p></div>`;
    }
  }

  /* ---------------- netwerkstatus ---------------- */
  function updateNet() {
    const n = $("#net");
    n.textContent = navigator.onLine ? "Online" : "Offline";
    n.classList.toggle("off", !navigator.onLine);
  }
  addEventListener("online", updateNet);
  addEventListener("offline", updateNet);

  /* ---------------- router ---------------- */
  function route() {
    const h = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = h.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(qs || "");
    const isMap = parts[0] === "kaart";
    $("#mapview").hidden = !isMap;
    view.hidden = isMap;
    if (isMap) {
      setTab("kaart");
      if (window.LBMap) window.LBMap.show({ cat: parts[1], ll: params.get("ll"), name: params.get("n") });
      return;
    }
    if (window.LBMap) window.LBMap.hide();
    switch (parts[0]) {
      case undefined: setTab("home"); viewHome(); break;
      case "gidsen": setTab("gidsen"); viewGuides(); break;
      case "cat": setTab("gidsen"); viewCategory(parts[1]); break;
      case "gids": setTab("gidsen"); viewGuide(parts[1]); break;
      case "plan": setTab("plan"); viewPlan(); break;
      default: setTab("home"); viewHome();
    }
    window.scrollTo(0, 0);
  }

  /* ---------------- service worker ---------------- */
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").then((reg) => {
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", () => {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            toast("Er is een nieuwe versie.", { label: "Vernieuwen", run: () => location.reload() });
          }
        });
      });
    }).catch(() => { /* geen offline-ondersteuning */ });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      const el = $("#offline-card"); if (el) renderOfflineCard(el);
    });
  }

  /* ---------------- export voor kaart ---------------- */
  window.LB = { $, esc, norm, abs, store, toast, dist, bearing, fmtDist, fmtMB, loadJSON, area, areaReady, searchPlaces, mapCachedInfo, BUILD };

  areaReady.then(() => { $("#area-name").textContent = area.short; });
  updateNet();
  addEventListener("hashchange", route);
  // wacht tot map.js geladen is zodat de kaart-route meteen werkt
  addEventListener("DOMContentLoaded", route);
})();
