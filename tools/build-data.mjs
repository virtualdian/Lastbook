#!/usr/bin/env node
/*
 * Haalt hulppunten, straten en plaatsnamen voor het gebied uit area.json op
 * via de Overpass API (OpenStreetMap) en schrijft compacte JSON naar data/.
 *
 *   node tools/build-data.mjs            # haalt live data op
 *   node tools/build-data.mjs --from x   # gebruikt een eerder opgeslagen Overpass-antwoord (testen)
 *
 * Geen dependencies: draait op Node 20+.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const area = JSON.parse(await readFile(join(ROOT, "area.json"), "utf8"));
const [W, S, E, N] = area.bbox;
const BB = `${S},${W},${N},${E}`;

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter"
];

const POI_QUERY = `[out:json][timeout:240];
(
  nwr["amenity"~"^(hospital|clinic|doctors|pharmacy|fire_station|police|drinking_water|fuel|townhall|community_centre)$"](${BB});
  nwr["healthcare"~"^(hospital|doctor|pharmacy|clinic)$"](${BB});
  nwr["emergency"~"^(defibrillator|assembly_point|lifeguard|lifeguard_base|lifeguard_station|ambulance_station|drinking_water)$"](${BB});
  nwr["shop"~"^(supermarket|convenience|hardware|doityourself)$"](${BB});
);
out center tags;`;

const STREET_QUERY = `[out:json][timeout:240];
(
  way["highway"]["name"]["highway"!~"^(bus_stop|platform|proposed|construction|elevator)$"](${BB});
  node["place"~"^(city|town|village|suburb|quarter|neighbourhood|hamlet)$"](${BB});
);
out center tags;`;

async function overpass(query, label) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const url of ENDPOINTS) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "lastbook-loosduinen-builder/1.0 (offline emergency guide; GitHub Actions)"
          },
          body: "data=" + encodeURIComponent(query)
        });
        if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
        const json = await res.json();
        console.log(`${label}: ${json.elements.length} elementen van ${url}`);
        return json;
      } catch (e) {
        lastErr = e;
        console.warn(`${label}: ${e.message}`);
      }
    }
    await new Promise((r) => setTimeout(r, 15000 * (attempt + 1)));
  }
  throw lastErr;
}

/* ---------- categorieën (gelijk aan js/map.js) ---------- */
function classify(t) {
  const a = t.amenity, h = t.healthcare, em = t.emergency, sh = t.shop;
  if (em === "defibrillator") return ["aed", "AED"];
  if (a === "hospital" || h === "hospital")
    return ["ziekenhuis", t.emergency === "yes" ? "Ziekenhuis met spoedeisende hulp" : "Ziekenhuis"];
  if (a === "pharmacy" || h === "pharmacy") return ["apotheek", "Apotheek"];
  if (a === "doctors" || h === "doctor") return ["huisarts", "Huisarts / arts"];
  if (a === "clinic" || h === "clinic") return ["huisarts", "Kliniek / gezondheidscentrum"];
  if (a === "fire_station") return ["hulpdienst", "Brandweer"];
  if (a === "police") return ["hulpdienst", "Politie"];
  if (em === "ambulance_station") return ["hulpdienst", "Ambulancepost"];
  if (em && em.startsWith("lifeguard")) return ["hulpdienst", "Reddingsbrigade / strandpost"];
  if (a === "drinking_water" || em === "drinking_water") return ["water", "Drinkwaterpunt"];
  if (sh === "supermarket") return ["winkel", "Supermarkt"];
  if (sh === "convenience") return ["winkel", "Buurtwinkel"];
  if (sh === "hardware" || sh === "doityourself") return ["bouwmarkt", "Bouwmarkt / ijzerwaren"];
  if (a === "fuel") return ["tank", "Tankstation"];
  if (em === "assembly_point") return ["verzamel", "Verzamelpunt"];
  if (a === "townhall") return ["verzamel", "Gemeentehuis / stadsdeelkantoor"];
  if (a === "community_centre") return ["verzamel", "Buurthuis / wijkcentrum"];
  return null;
}

function address(t) {
  const street = t["addr:street"] ? `${t["addr:street"]} ${t["addr:housenumber"] || ""}`.trim() : "";
  const city = t["addr:city"] || "";
  return [street, [t["addr:postcode"] || "", city].join(" ").trim()].filter(Boolean).join(", ");
}

const YES = { yes: "ja", no: "nee" };
function infoLines(t, cat) {
  const out = [];
  const adr = address(t);
  if (adr) out.push(adr);
  if (cat === "aed") {
    const loc = t["defibrillator:location:nl"] || t["defibrillator:location"] || t.description;
    if (loc) out.push(`Plek: ${loc}`);
    if (t.indoor) out.push(`Binnen: ${YES[t.indoor] || t.indoor}`);
    if (t.access) out.push(`Toegang: ${t.access === "yes" || t.access === "public" ? "openbaar" : t.access}`);
    if (t.operator) out.push(`Beheer: ${t.operator}`);
  }
  if (t.opening_hours) out.push(`Open: ${t.opening_hours === "24/7" ? "24 uur per dag" : t.opening_hours}`);
  const phone = t.phone || t["contact:phone"];
  if (phone && cat !== "winkel" && cat !== "tank") out.push(`Tel: ${phone}`);
  if (t.emergency === "yes" && cat === "ziekenhuis") out.push("Spoedeisende hulp: ja");
  return out.join("\n");
}

function coord(el) {
  if (el.type === "node") return [el.lat, el.lon];
  if (el.center) return [el.center.lat, el.center.lon];
  return null;
}
const r5 = (n) => Math.round(n * 1e5) / 1e5;

function buildPois(json) {
  const items = [];
  const seen = new Set();
  for (const el of json.elements) {
    const t = el.tags || {};
    const c = classify(t);
    const p = coord(el);
    if (!c || !p) continue;
    const name = t.name || t.brand || t.operator || "";
    const key = `${c[0]}|${name}|${p[0].toFixed(4)}|${p[1].toFixed(4)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push([c[0], r5(p[0]), r5(p[1]), name, c[1], infoLines(t, c[0])]);
  }
  items.sort((a, b) => a[0].localeCompare(b[0]) || a[3].localeCompare(b[3]));
  return items;
}

function dist(a, b) {
  const dLat = (a[0] - b[0]) * 111.32;
  const dLon = (a[1] - b[1]) * 111.32 * Math.cos((a[0] * Math.PI) / 180);
  return Math.hypot(dLat, dLon);
}

function buildStreets(json) {
  const places = [];
  const ways = [];
  for (const el of json.elements) {
    const t = el.tags || {};
    const p = coord(el);
    if (!p || !t.name) continue;
    if (el.type === "node" && t.place) places.push({ name: t.name, kind: t.place, p });
    else if (el.type === "way") ways.push({ name: t.name, p });
  }
  // Groepeer stukken van dezelfde straat (binnen 1,5 km) tot één zoekresultaat.
  const groups = new Map();
  for (const w of ways) {
    const list = groups.get(w.name) || [];
    let g = list.find((x) => dist(x.p, w.p) < 1.5);
    if (!g) { g = { name: w.name, p: w.p, pts: [] }; list.push(g); }
    g.pts.push(w.p);
    groups.set(w.name, list);
  }
  const local = places.filter((p) => ["suburb", "quarter", "neighbourhood", "village", "hamlet", "town", "city"].includes(p.kind));
  const nearestPlace = (pt) => {
    let best = null, bd = Infinity;
    for (const pl of local) {
      const d = dist(pt, pl.p) * (pl.kind === "city" || pl.kind === "town" ? 2.5 : 1);
      if (d < bd) { bd = d; best = pl; }
    }
    return best ? best.name : "";
  };
  const streets = [];
  for (const list of groups.values()) {
    for (const g of list) {
      // kies het punt dat het dichtst bij het gemiddelde ligt
      const avg = [g.pts.reduce((s, q) => s + q[0], 0) / g.pts.length, g.pts.reduce((s, q) => s + q[1], 0) / g.pts.length];
      const pt = g.pts.reduce((b, q) => (dist(q, avg) < dist(b, avg) ? q : b), g.pts[0]);
      streets.push([g.name, r5(pt[0]), r5(pt[1]), nearestPlace(pt)]);
    }
  }
  streets.sort((a, b) => a[0].localeCompare(b[0], "nl"));
  const placeList = places
    .map((p) => [p.name, r5(p.p[0]), r5(p.p[1]), p.kind])
    .sort((a, b) => a[0].localeCompare(b[0], "nl"));
  return { streets, places: placeList };
}

async function main() {
  const args = process.argv.slice(2);
  const fromIdx = args.indexOf("--from");
  let poiJson, streetJson;
  if (fromIdx >= 0) {
    const base = args[fromIdx + 1];
    poiJson = JSON.parse(await readFile(join(base, "overpass-poi.json"), "utf8"));
    streetJson = JSON.parse(await readFile(join(base, "overpass-streets.json"), "utf8"));
  } else {
    poiJson = await overpass(POI_QUERY, "hulppunten");
    streetJson = await overpass(STREET_QUERY, "straten");
  }
  const pois = buildPois(poiJson);
  const { streets, places } = buildStreets(streetJson);
  if (pois.length < 50) throw new Error(`Te weinig hulppunten (${pois.length}); Overpass-antwoord lijkt niet compleet.`);

  const outDir = join(ROOT, "data");
  await mkdir(outDir, { recursive: true });
  const stamp = new Date().toISOString();
  await writeFile(join(outDir, "poi.json"), JSON.stringify({ updated: stamp, items: pois }));
  await writeFile(join(outDir, "streets.json"), JSON.stringify({ updated: stamp, streets, places }));

  const counts = {};
  for (const p of pois) counts[p[0]] = (counts[p[0]] || 0) + 1;
  console.log("Hulppunten per categorie:", counts);
  console.log(`Straten: ${streets.length}, plaatsen: ${places.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
