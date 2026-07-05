/* ============================================================
   care.js  —  the care-math domain module
   Ported verbatim from houseplant-24-plants.html (the artifact
   is the source of truth for every calculation). Nothing here
   touches the DOM or storage. Tweak the models here.
   ============================================================ */

/* ---- small helpers ---- */
export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
export function mix(a, b, t) {
  t = clamp(t, 0, 1);
  const p = (s, i) => parseInt(s.slice(i, i + 2), 16);
  const A = [p(a, 1), p(a, 3), p(a, 5)], B = [p(b, 1), p(b, 3), p(b, 5)];
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
export function qpt(p0, p1, p2, t) { return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2; }

export const DAY = 86400000;
export const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const cmIn = cm => cm / 2.54;
export const inCm = inch => inch * 2.54;
export const lGal = l => l * 0.264172;
export const lCup = l => l * 4.2268;
export const lMl = l => l * 1000;

/* Date helpers. dstr(daysAgo) -> "YYYY-MM-DD", daysAgo(str) -> integer days. */
export function dstr(daysAgo) {
  const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function daysAgo(v) {
  const a = v.split("-").map(Number);
  const chosen = new Date(a[0], a[1] - 1, a[2], 12, 0, 0);
  const now = new Date(); now.setHours(12, 0, 0, 0);
  return clamp(Math.round((now - chosen) / DAY), 0, 3650);
}
export function fmt(v) { const a = v.split("-").map(Number); return MON[a[1] - 1] + " " + a[2]; }

/* ---- constants ---- */
export const HEALTH = ["Critical", "Stressed", "Healthy", "Thriving"];
export const HVAL   = [0.2, 0.45, 0.8, 1.0];

export const MATS = {
  plastic:   { label: "Plastic",    dry: 1.0, note: "Seals moisture in. Water less, keep the top dry." },
  terracotta:{ label: "Terracotta", dry: 0.8, note: "Breathes and wicks. Dries fast, water sooner. Lower gnat risk." },
  ceramic:   { label: "Ceramic",    dry: 1.0, note: "Glazed and sealed. Holds moisture, let it dry between drinks." },
  stone:     { label: "Stone",      dry: 0.9, note: "Heavy, topple-proofing for tall plants. Dries moderately." },
  metal:     { label: "Metal",      dry: 1.0, note: "Seals moisture, heats in sun. Water like plastic." }
};

export const MEDIA = {
  aroid:  { label: "Aroid mix",   dry: 0.88, soil: true },
  general:{ label: "General mix", dry: 1.05, soil: true },
  gritty: { label: "Gritty mix",  dry: 0.76, soil: true },
  bark:   { label: "Bark blend",  dry: 0.82, soil: true },
  leca:   { label: "LECA",        dry: 1.0,  soil: false },
  pon:    { label: "Pon",         dry: 0.7,  soil: false }
};

export const FERTS = {
  bgl:     { label: "Big Green Leaves 12-4-8", str: "half strength" },
  hydro:   { label: "Hydro nutrients",         str: "quarter to half strength" },
  fishkelp:{ label: "Fish & kelp",             str: "diluted" },
  none:    { label: "None yet",                str: "" }
};

export const LIGHTF = { low: 1.3, med: 1.0, bright: 0.8 };
export const PACE_R = { fast: [6, 10], moderate: [10, 15], slow: [18, 26] };

export const WSENS = [
  "Tap is fine for this one.",
  "A bit sensitive to tap minerals, filtered is safer long term.",
  "Fluoride-sensitive. Tap browns the tips over time, use filtered or distilled."
];

export const ROOTS = {
  roomy: { label: "Roomy",       note: "Roots roomy and white. No rush, normal watering, check again at the window." },
  snug:  { label: "Snug",        note: "Snug but healthy, the sweet spot. Check again at the window, no repot yet." },
  bound: { label: "Rootbound",   note: "Rootbound and circling. Pot up one size, about 5 cm / 2 in wider, into fresh mix at the next repot." },
  rot:   { label: "Soft / rot",  note: "Soft or rotten roots. Trim to firm tissue, run the full four-step gnat protocol, water sparingly until it recovers." },
  pale:  { label: "Pale / shock",note: "Pale roots, transplant shock. Ease off water and feed, bright indirect light, let it settle a few weeks." }
};

/* Soil recipes (Master Doc Section 7) and the gnat protocol (Section 8). */
export const RECIPES = {
  aroid:  { name: "Aroid / chunky tropical", parts: [["Rosy Aroid", 40], ["Perlite", 25], ["Rosy Houseplant or Back to the Roots", 25], ["Sol Soils Soil Salvation", 10]] },
  general:{ name: "General houseplant",      parts: [["Back to the Roots or Rosy Houseplant", 50], ["Perlite", 30], ["Sol Soils Necessary Nutrients", 10], ["GreenGro biochar", 10]] },
  gritty: { name: "Gritty / cactus",         parts: [["G&B or Kellogg Cactus mix", 60], ["Perlite", 30], ["Sol Soils Soil Salvation", 10]] },
  bark:   { name: "Airy / bromeliad",        parts: [["Rosy Aroid", 55], ["Orchid bark", 30], ["Perlite", 15]], note: "Fast draining. Water bromeliads in the central cup, not the soil." },
  leca:   { name: "LECA (semi-hydro)",       parts: [["LECA clay pebbles", 100]], note: "No food in the medium. Feed through the water, keep a shallow reservoir, flush every couple weeks." },
  pon:    { name: "Pon (inorganic)",         parts: [["Pon mineral mix", 100]], note: "Drains and dries fast, feeds nothing. Top-water often with dilute nutrients." }
};

/* The four-step gnat protocol, expanded to the bench-run screens. Runs on EVERY repot. */
export const PROTOCOL = [
  { t: "Steep and pre-wet", s: "Mosquito Bits (BTI) into the watering can the moment you start, so every pour is a larvae drench." },
  { t: "Unpot and read roots", s: "Firm and white is fine. Brown and mushy is rot, cut to clean tissue. Knock off the wet top inch, the gnat nursery." },
  { t: "Repot one size up", s: "Holes mandatory, same depth, no rock layer in the bottom. Drainage is the mix, not the rocks." },
  { t: "Mix Bits into the soil", s: "Plus the steeped drench. First kill layer." },
  { t: "Add nematodes", s: "NemaKnights after potting. Second kill layer, hunts larvae in the soil." },
  { t: "Top-dress dry", s: "Thin perlite or grit plus a dusting of cinnamon. Pebbles on top of fine grit for feature plants." },
  { t: "Bottom-water, then let it dry", s: "Soak from below, let the top two inches dry fully before the next drink. No vermiculite near the top." }
];

/* ---- the live math ---- */

/* Pot soil volume in litres from top/base/height in cm.
   Round (default): frustum of a cone, top/base are DIAMETERS.
   Square: frustum of a pyramid, top/base are SIDE lengths. */
export function potVolL(p) {
  const t = p.top, b = p.bot, h = p.ph;
  if (p.shape === "square") {
    return h / 3 * (t * t + t * b + b * b) / 1000;
  }
  return Math.PI * h / 3 * ((t / 2) ** 2 + (t / 2) * (b / 2) + (b / 2) ** 2) / 1000;
}

/* Fresh mix to actually prepare, as a fraction of full capacity.
   A repot leaves headroom and the existing root ball fills part of the pot,
   so you scoop less than the geometric volume. New (bigger) pot ~0.7; same pot ~0.5. */
export function freshMixL(p, newPot) {
  return potVolL(p) * (newPot ? 0.7 : 0.5);
}

/* Growing season = Apr..Sep (month index 3..8). */
export function season(date) {
  const m = (date || new Date()).getMonth();
  return (m >= 3 && m <= 8);
}

/* Watering interval in days. Every factor is live. LECA rides a fixed reservoir cadence. */
export function suggestIntv(p) {
  if (p.med === "leca") return 4;
  let d = p.thirst * LIGHTF[p.light] * MATS[p.mat].dry * MEDIA[p.med].dry;
  d *= (1.1 - (p.hCm / p.matureCm) * 0.2);
  d *= clamp(0.9 + (potVolL(p) - 2) / 12, 0.85, 1.25);
  d *= season() ? 1.0 : 1.4;
  if (!p.drain) d *= 1.25;
  return Math.max(2, Math.round(d));
}

/* Repot check-window as a range in months. Never a hard date. */
export function repotWindow(p) {
  if (p.med === "leca") return null;
  const snug = p.snug / 100;
  const b = PACE_R[p.pace];
  const sF = 1 - snug * 0.55;
  const wF = 0.9 + (p.intv - 2) / 28 * 0.25;
  const mF = 0.9 + MATS[p.mat].dry * 0.1;
  const lo = Math.max(1, Math.round(b[0] * sF * wF * mF));
  const hi = Math.max(lo + 1, Math.round(b[1] * sF * wF * mF));
  return [lo, hi];
}

/* Feeding: soil+season = every 14d half strength; soil+dormant = hold; soilless = feed every watering. */
export function feedState(p) {
  const soilless = !MEDIA[p.med].soil;
  const f = FERTS[p.fert];
  if (soilless) return { mode: "soilless", due: p.lastW <= (p.intv - p.lastW <= 0 ? 999 : 0), fert: f };
  if (!season()) return { mode: "dormant", fert: f };
  const fdue = 14 - p.lastF;
  return { mode: "season", fdue, due: fdue <= 0, fert: f };
}

/* Pot-size bracket from the entered top diameter (cm). */
export function potBracket(topCm) {
  return topCm < 15 ? "small" : topCm < 25 ? "medium" : "large";
}

/* Unit-aware formatters. Length unit: "cm" | "in". Volume unit: "L" | "mL" | "gal".
   Soil mix is always expressed in cups elsewhere. */
export function len(cm, u) { return u === "in" ? cmIn(cm).toFixed(1) + " in" : Math.round(cm) + " cm"; }
export function vol(l, u) {
  if (u === "gal") return lGal(l).toFixed(2) + " gal";
  if (u === "mL")  return Math.round(lMl(l)) + " mL";
  return l.toFixed(1) + " L";
}
