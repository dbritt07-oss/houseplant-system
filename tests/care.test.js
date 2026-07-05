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
import { buildSeed } from "../js/seed.js";

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

/* ---- summary ---- */
console.log(`\n${pass} passed, ${fails.length} failed.`);
if (fails.length) {
  console.log("\nFAILURES (do not silently edit expectations — decide code-vs-expectation first):");
  fails.forEach(f => console.log(`  ✗ ${f.name}\n      ${f.detail || ""}`));
  process.exit(1);
}
console.log("All care-math golden values hold. ✓");
