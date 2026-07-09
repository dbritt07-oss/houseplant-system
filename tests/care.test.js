/* ============================================================
   tests/care.test.js — golden-value assertions for the care math.

   PURPOSE: lock the current, agreed-correct outputs of the care
   engine so the Sprint 1–4 refactors (IA consolidation, Study
   reorder, backup) cannot silently change a number. This is a
   pure regression net — it does NOT change app behavior and does
   NOT touch the DOM or storage. `js/care.js` and `js/seed.js` are
   the source of truth; every expected value below was derived by
   hand from those formulas and the seeded 24-plant constants.

   Run:  npm test    (node tests/care.test.js)

   If an assertion fails after a change: DO NOT edit the expected
   value to make it green. First decide whether the app logic
   change was intended (update the expectation + document why) or
   accidental (fix the code). A silent expectation edit defeats
   the purpose of this net.
   ============================================================ */

import * as C from "../js/care.js";
import { buildSeed, newPlant } from "../js/seed.js";
import { validateBackup, BACKUP_VERSION } from "../js/db.js";

/* ---- tiny zero-dependency assert harness ---- */
let pass = 0;
const fails = [];
function ok(name, cond, detail) {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fails.push({ name, detail }); console.log(`  ✗ ${name}${detail ? "  — " + detail : ""}`); }
}
function eq(name, actual, expected) {
  ok(name, actual === expected, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}
function near(name, actual, expected, tol = 1e-6) {
  ok(name, Math.abs(actual - expected) <= tol, `expected ≈${expected} (±${tol}), got ${actual}`);
}
/* asserts fn() throws; if `match` is given, the message must contain it */
function throws(name, fn, match) {
  try { fn(); ok(name, false, "expected it to throw, but it returned"); }
  catch (e) { ok(name, !match || (e.message || "").includes(match), `threw "${e.message}" (wanted it to contain "${match}")`); }
}

const seed = buildSeed();
const mon = seed.mon;       // Monstera deliciosa — round pot 24/18/22 cm, aroid, terracotta
const corn2 = seed.corn2;   // Corn plant #2 — LECA, no drainage
const snake = seed.snake;   // Snake plant — gritty, no drainage

console.log("Plant Daddy HQ — care-math golden tests\n");

/* 1) POT VOLUME (round frustum of a cone).
   Protects: potVolL round branch + the seeded Monstera pot dimensions.
   π·22/3·((24/2)² + (24/2)(18/2) + (18/2)²)/1000 = 7.6718 L. */
near("Monstera pot volume ≈ 7.67 L (round frustum)", C.potVolL(mon), 7.6718, 0.001);
near("Monstera pot volume rounds to the agreed 7.67 L", Math.round(C.potVolL(mon) * 100) / 100, 7.67, 1e-9);

/* 2) POT VOLUME (square pyramid frustum) differs from round and matches the pyramid formula.
   Protects: potVolL square branch. 22/3·(24²+24·18+18²)/1000 = 9.7680 L. */
const monSquare = Object.assign({}, mon, { shape: "square" });
near("Square pot volume = pyramid frustum (24/18/22) ≈ 9.768 L", C.potVolL(monSquare), 9.7680, 0.001);
ok("Square pot holds more mix than the round pot of the same dimensions", C.potVolL(monSquare) > C.potVolL(mon));

/* 3) FRESH MIX to prepare (headroom + root ball fractions).
   Protects: freshMixL. new pot = 0.7×full, same pot = 0.5×full. */
near("Fresh mix for a NEW pot = 70% of full volume", C.freshMixL(mon, true), C.potVolL(mon) * 0.7, 1e-9);
near("Fresh mix for the SAME pot = 50% of full volume", C.freshMixL(mon, false), C.potVolL(mon) * 0.5, 1e-9);

/* 4) WATERING INTERVAL — full multiplicative model.
   Protects: suggestIntv for a soil plant. season() reads the real clock,
   so we assert the correct golden for whichever season it is today:
   growing → 6 days, dormant → 9 days (all other factors fixed). */
const monExpected = C.season() ? 6 : 9;
eq(`Monstera interval = ${monExpected} days (${C.season() ? "growing season" : "dormant"})`, C.suggestIntv(mon), monExpected);

/* 5) LECA feed/water logic.
   Protects: the fixed semi-hydro cadence and the soilless flag that drives feeding. */
eq("LECA plant waters on a fixed 4-day reservoir cadence", C.suggestIntv(corn2), 4);
eq("LECA is soilless (feeds through the water, not the medium)", C.MEDIA.leca.soil, false);
eq("Aroid mix is soil-based", C.MEDIA.aroid.soil, true);
eq("feedState(LECA) resolves to soilless mode", C.feedState(corn2).mode, "soilless");
eq(`feedState(soil plant) mode follows the season (${C.season() ? "season" : "dormant"})`, C.feedState(mon).mode, C.season() ? "season" : "dormant");

/* 6) PET-SAFE / TOXIC flags.
   Protects: the seeded toxicity constants. Exactly two plants are pet-safe:
   Scarlet-star (Guzmania) and Pineapple (Ananas). Everything else is toxic. */
eq("Scarlet-star is pet-safe", seed.scarlet.tox, false);
eq("Pineapple is pet-safe", seed.pine.tox, false);
eq("Monstera is toxic to pets", seed.mon.tox, true);
const petSafeCount = Object.values(seed).filter(p => p.tox === false).length;
eq("Exactly 2 of the 24 seeded plants are pet-safe", petSafeCount, 2);

/* 7) REPOT WINDOW (months range, never a hard date).
   Protects: repotWindow math + LECA null. Monstera: pace moderate [10,15],
   snug 35%, intv 7, terracotta → [7, 11]. LECA returns null (check on sight). */
const win = C.repotWindow(mon);
ok("Monstera repot window = [7, 11] months", Array.isArray(win) && win[0] === 7 && win[1] === 11, `got ${JSON.stringify(win)}`);
eq("LECA has no scheduled repot window (check on sight)", C.repotWindow(corn2), null);

/* 8) POT-SIZE BRACKET from top diameter (cm). Protects: potBracket thresholds. */
eq("Top 24 cm → medium bracket", C.potBracket(24), "medium");
eq("Top 14 cm → small bracket", C.potBracket(14), "small");
eq("Top 30 cm → large bracket", C.potBracket(30), "large");

/* 9) UNIT CONVERSIONS. Protects: the length/volume converters used across the UI. */
near("cm→in: 2.54 cm = 1.00 in", C.cmIn(2.54), 1);
near("in→cm: 1 in = 2.54 cm", C.inCm(1), 2.54);
near("L→gal: 1 L = 0.264172 gal", C.lGal(1), 0.264172);
near("L→cups: 1 L = 4.2268 cups", C.lCup(1), 4.2268);
near("L→mL: 2 L = 2000 mL", C.lMl(2), 2000);

/* 10) SEASON boundary (Apr–Sep growing). Protects: season() month logic (date passed in). */
eq("July is growing season", C.season(new Date(2026, 6, 15)), true);
eq("January is dormant", C.season(new Date(2026, 0, 15)), false);

/* 11) HEALTH scale integrity. Protects: the 4-step health model the art + status use. */
eq("Health scale has 4 steps", C.HEALTH.length, 4);
eq("Health value multipliers align to 4 steps", C.HVAL.length, 4);

/* 12) SCHEMA FREEZE (Sprint 3, T3.3). Locks the persisted plant-record field set so the
   Sprint 4 backup build serializes/restores a stable shape. Mirror of docs/DATA-SCHEMA.md.
   If this fails after a change it IS a schema change: bump the export `version`, write a
   migration, and update docs/DATA-SCHEMA.md — do NOT just edit the list to make it green. */
const REQUIRED = ["name","latin","art","pace","thirst","matureCm","med","hCm","hi","light","water","wsens","tox","drain","intv","intvMan","fert","lastW","lastF","snug","rootcond","trapN","trapL","top","bot","ph","mat","shape","loc","room","repotDate","photos","todo","log"].sort();
eq("Schema: seed holds the locked 24 plants", Object.keys(seed).length, 24);
let seedShapeOk = true, seedDetail = "";
Object.keys(seed).forEach(k => {
  const got = Object.keys(seed[k]).sort();
  if (JSON.stringify(got) !== JSON.stringify(REQUIRED)) {
    seedShapeOk = false;
    if (!seedDetail) seedDetail = `${k}: missing [${REQUIRED.filter(f => !got.includes(f))}] extra [${got.filter(f => !REQUIRED.includes(f))}]`;
  }
});
ok("Schema: every seed plant matches the frozen 34-field shape (excl. id)", seedShapeOk, seedDetail);
const np = newPlant({ name: "Test", latin: "", type: "aroid", room: "Office", tox: true, photoDataUrl: "data:image/jpeg;base64,AAAA" });
const npKeys = Object.keys(np).sort(), REQUIRED_ID = [...REQUIRED, "id"].sort();
ok("Schema: newPlant() matches the frozen shape + id", JSON.stringify(npKeys) === JSON.stringify(REQUIRED_ID),
   `missing [${REQUIRED_ID.filter(f => !npKeys.includes(f))}] extra [${npKeys.filter(f => !REQUIRED_ID.includes(f))}]`);
const phKeys = np.photos[0] && Object.keys(np.photos[0]).sort();
ok("Schema: photo record shape { id, date, dataUrl }", JSON.stringify(phKeys) === JSON.stringify(["dataUrl","date","id"]));
const le = seed.mon.log[0];
ok("Schema: log entry carries a date + text", !!(le && le.date && typeof le.t === "string"));
ok("Schema: rootcond defaults to null (unchecked)", newPlant({ name: "x", type: "ficus" }).rootcond === null);

/* 13) BACKUP ENVELOPE VALIDATION (Sprint 4, T4.3). Locks the guard that stands between
   a corrupt/foreign/newer file and the user's data. Every rejection below is a data-loss
   scenario that must fail LOUDLY and leave local data untouched. Mirrors docs/DATA-SCHEMA.md §5. */
const seedPlants = Object.entries(seed).map(([id, p]) => Object.assign({ id }, p));
const goodBackup = () => ({
  app: "Plant Daddy HQ", format: "hps-backup", version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  settings: { order: Object.keys(seed), lenUnit: "in" },
  plants: JSON.parse(JSON.stringify(seedPlants))
});
const okStats = validateBackup(goodBackup());
eq("Backup: a valid envelope reports 24 plants", okStats.plants, 24);
ok("Backup: counts log entries across plants", okStats.logs > 0, `logs=${okStats.logs}`);
eq("Backup: seeded collection has no photos yet", okStats.photos, 0);
ok("Backup: photo + log counts are tallied", (() => {
  const b = goodBackup();
  b.plants[0].photos = [{ id: "ph_1", date: "2026-07-01", dataUrl: "data:image/jpeg;base64,AA" }];
  return validateBackup(b).photos === 1;
})());
ok("Backup: settings may be absent", (() => { const b = goodBackup(); delete b.settings; return validateBackup(b).plants === 24; })());

throws("Backup: rejects null", () => validateBackup(null), "unreadable");
throws("Backup: rejects a bare array", () => validateBackup([]), "unreadable");
throws("Backup: rejects a foreign file (wrong format)", () => { const b = goodBackup(); b.format = "something-else"; validateBackup(b); }, "Not a Plant Daddy HQ backup");
throws("Backup: rejects a missing version", () => { const b = goodBackup(); delete b.version; validateBackup(b); }, "missing its version");
throws("Backup: rejects a NEWER version (forward-compat guard)", () => { const b = goodBackup(); b.version = BACKUP_VERSION + 1; validateBackup(b); }, "newer version");
throws("Backup: rejects a missing plants list", () => { const b = goodBackup(); delete b.plants; validateBackup(b); }, "no plants list");
throws("Backup: rejects a non-array plants list", () => { const b = goodBackup(); b.plants = {}; validateBackup(b); }, "no plants list");
throws("Backup: rejects a plant with no id", () => { const b = goodBackup(); delete b.plants[3].id; validateBackup(b); }, "missing its id");
throws("Backup: rejects duplicate plant ids", () => { const b = goodBackup(); b.plants[1].id = b.plants[0].id; validateBackup(b); }, "sharing the id");
throws("Backup: rejects a corrupted photo list", () => { const b = goodBackup(); b.plants[0].photos = "oops"; validateBackup(b); }, "unreadable photo list");
throws("Backup: rejects a corrupted timeline", () => { const b = goodBackup(); b.plants[0].log = 42; validateBackup(b); }, "unreadable timeline");
throws("Backup: rejects unreadable settings", () => { const b = goodBackup(); b.settings = []; validateBackup(b); }, "unreadable settings");

/* ---- summary ---- */
console.log(`\n${pass} passed, ${fails.length} failed.`);
if (fails.length) {
  console.log("\nFAILURES (do not silently edit expectations — decide code-vs-expectation first):");
  fails.forEach(f => console.log(`  ✗ ${f.name}\n      ${f.detail || ""}`));
  process.exit(1);
}
console.log("All care-math golden values hold. ✓");
