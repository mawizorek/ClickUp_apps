#!/usr/bin/env node
/* build-baselines.mjs — Retrocast baseline generator (the "import step", NOT baked into the app).
 *
 * WHY THIS EXISTS (spec §4): the app reads OUR OWN stored data table, never the API directly at
 * render. This job produces that durable floor: one 366-row TSV per location holding the this-day
 * normal, spread, and records computed from the ERA5 archive. The APP never writes repo files; it
 * only reads them + its own client cache. This script is the only thing that touches the data files.
 *
 * HONESTY (spec §3/§7): never fabricate. Every row carries its true sampleYears; a sparse or Feb-29
 * row reports the real (smaller) count rather than faking confidence. Values come straight from ERA5.
 *
 * RUN:  node retrocast/routines/build-baselines.mjs            # all seed locations
 *       node retrocast/routines/build-baselines.mjs rochester-ny
 * Node 18+ (global fetch). Writes retrocast/data/<slug>/baseline.tsv.
 *
 * Two-endpoint truth (spec §3): this job uses the ARCHIVE endpoint ONLY (history). Today's live value
 * is the app's job via the FORECAST endpoint at render — never seed "today" into the durable file.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ARCHIVE = "https://archive-api.open-meteo.com/v1/archive";
const DAILY = ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "wind_speed_10m_max", "snowfall_sum"];

// Seed locations — keep in lockstep with js/store.js SEEDS.
const LOCATIONS = [
  { name: "Rochester, NY",   slug: "rochester-ny",   lat: 43.1566, lng: -77.6088, tz: "America/New_York" },
  { name: "Chattanooga, TN", slug: "chattanooga-tn", lat: 35.0456, lng: -85.3097, tz: "America/New_York" },
  { name: "Ogunquit, ME",    slug: "ogunquit-me",    lat: 43.2492, lng: -70.5989, tz: "America/New_York" }
];

// Baseline window: 30 years ending last complete year (ERA5 lags ~5 days, so current year is partial).
const END_YEAR = new Date().getUTCFullYear() - 1;
const START_YEAR = END_YEAR - 29;

const COLS = [
  "mmdd",
  "tempHigh_normal", "tempLow_normal", "precip_normal", "wind_normal", "snow_normal",
  "tempHigh_min", "tempHigh_max", "tempLow_min", "tempLow_max",
  "precip_min", "precip_max", "wind_min", "wind_max", "snow_min", "snow_max",
  "sampleYears", "recordHigh", "recordHighYear", "recordLow", "recordLowYear"
];

const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
const r1 = (n) => (n == null ? "" : Math.round(n * 10) / 10);

async function fetchSeries(loc) {
  const url = `${ARCHIVE}?latitude=${loc.lat}&longitude=${loc.lng}` +
    `&start_date=${START_YEAR}-01-01&end_date=${END_YEAR}-12-31` +
    `&daily=${DAILY.join(",")}&timezone=${encodeURIComponent(loc.tz)}` +
    `&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`archive ${res.status} for ${loc.slug}`);
  const json = await res.json();
  if (!json.daily || !json.daily.time) throw new Error(`no daily block for ${loc.slug}`);
  return json.daily;
}

// Group every archive day by its MM-DD so each of the 366 calendar days aggregates across all years.
function buildRows(daily) {
  const byMMDD = new Map();
  for (let i = 0; i < daily.time.length; i++) {
    const mmdd = daily.time[i].slice(5);
    if (!byMMDD.has(mmdd)) byMMDD.set(mmdd, []);
    byMMDD.get(mmdd).push(i);
  }
  const rows = [];
  for (const mmdd of [...byMMDD.keys()].sort()) {
    const idx = byMMDD.get(mmdd);
    const grab = (key) => idx.map((k) => daily[key][k]).filter((v) => v != null);
    const hi = grab("temperature_2m_max"), lo = grab("temperature_2m_min");
    const pr = grab("precipitation_sum"), wd = grab("wind_speed_10m_max"), sn = grab("snowfall_sum");
    const recordHigh = hi.length ? Math.max(...hi) : null;
    const recordLow = lo.length ? Math.min(...lo) : null;
    const yearAt = (key, target) => {
      for (const k of idx) if (daily[key][k] === target) return +daily.time[k].slice(0, 4);
      return "";
    };
    rows.push([
      mmdd,
      r1(mean(hi)), r1(mean(lo)), r1(mean(pr)), r1(mean(wd)), r1(mean(sn)),
      r1(hi.length ? Math.min(...hi) : null), r1(recordHigh),
      r1(lo.length ? Math.min(...lo) : null), r1(lo.length ? Math.max(...lo) : null),
      r1(pr.length ? Math.min(...pr) : null), r1(pr.length ? Math.max(...pr) : null),
      r1(wd.length ? Math.min(...wd) : null), r1(wd.length ? Math.max(...wd) : null),
      r1(sn.length ? Math.min(...sn) : null), r1(sn.length ? Math.max(...sn) : null),
      idx.length,                              // sampleYears — honest, per row
      r1(recordHigh), yearAt("temperature_2m_max", recordHigh),
      r1(recordLow), yearAt("temperature_2m_min", recordLow)
    ].join("\t"));
  }
  return rows;
}

async function main() {
  const only = process.argv[2];
  const targets = only ? LOCATIONS.filter((l) => l.slug === only) : LOCATIONS;
  if (!targets.length) { console.error(`No seed location matches "${only}".`); process.exit(1); }

  const dataDir = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
  for (const loc of targets) {
    process.stdout.write(`→ ${loc.name} (${START_YEAR}–${END_YEAR})… `);
    const daily = await fetchSeries(loc);
    const rows = buildRows(daily);
    const tsv = [
      `# Retrocast baseline · ${loc.name} · ERA5 archive ${START_YEAR}–${END_YEAR} · generated ${new Date().toISOString().slice(0, 10)}`,
      COLS.join("\t"),
      ...rows
    ].join("\n") + "\n";
    const outDir = join(dataDir, loc.slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "baseline.tsv"), tsv, "utf8");
    console.log(`${rows.length} rows written`);
  }
  console.log("Done. Commit retrocast/data/**/baseline.tsv.");
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
