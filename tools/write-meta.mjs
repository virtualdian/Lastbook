#!/usr/bin/env node
/*
 * Schrijft data/meta.json: wanneer de data is gebouwd, hoe groot de kaart is
 * en welke kleine bestanden de service worker meteen offline moet bewaren.
 *   node tools/write-meta.mjs <bron-datum-kaart> <maxzoom>
 */
import { readFile, writeFile, stat, readdir } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data");
const [mapSource = "", maxzoom = ""] = process.argv.slice(2);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(DATA);
const assets = files
  .filter((f) => !f.endsWith("map.pmtiles") && !f.endsWith("meta.json") && !f.endsWith(".gitkeep"))
  .map((f) => "data/" + relative(DATA, f).split(sep).map(encodeURIComponent).join("/"))
  .sort();

let mapBytes = 0;
try { mapBytes = (await stat(join(DATA, "map.pmtiles"))).size; } catch { /* geen kaart */ }
const poi = JSON.parse(await readFile(join(DATA, "poi.json"), "utf8"));
const streets = JSON.parse(await readFile(join(DATA, "streets.json"), "utf8"));

const meta = {
  built: new Date().toISOString(),
  map: mapBytes ? { file: "data/map.pmtiles", bytes: mapBytes, maxzoom: Number(maxzoom) || null, source: mapSource } : null,
  poiCount: poi.items.length,
  streetCount: streets.streets.length,
  assets
};
await writeFile(join(DATA, "meta.json"), JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ ...meta, assets: `${assets.length} bestanden` }, null, 1));
