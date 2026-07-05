/* ============================================================
   seed.js  —  the locked 24-plant collection + constants
   Ported from houseplant-24-plants.html. These are CARE
   CONSTANTS (species facts, mature ceilings, buckets), not
   personal data. The app ships pre-seeded with these on first
   run. The owner only fills the variable fields, which are then
   stored locally (never in this file, never in the repo).

   `art` is stored as a string key resolved through art.js ART
   registry, so records survive JSON round-trips and export.
   ============================================================ */
import { dstr } from "./care.js";

/* Default field values applied to every plant. intv seeds from thirst then recomputes live. */
function mk(o) {
  // Infer a starting room from the descriptive location; owner can reassign in-app.
  const room = o.room || (/(outside|gravel|patio|balcony)/i.test(o.loc || "") ? "Patio / Outside" : "Unassigned");
  return Object.assign({
    hi: 2, light: "med", water: "tap", wsens: 0, tox: true, drain: true,
    intv: o.thirst, intvMan: false, fert: "bgl", lastW: 4, lastF: 14,
    snug: 35, rootcond: null, trapN: 0, trapL: 0,
    top: 22, bot: 17, ph: 20, mat: "plastic", shape: "round", loc: "TBD", room,
    photos: [], repotDate: null
  }, o);
}

/* Build the 24 fresh (log dates relative to first run). Returns an ordered object. */
export function buildSeed() {
  return {
    inch:   mk({ name: "Inchplant", latin: "Tradescantia zebrina", art: "pVine", pace: "fast", thirst: 6, matureCm: 60, hCm: 30, hi: 1, med: "general", loc: "TBD", top: 22, bot: 17, ph: 18, mat: "plastic", trapN: 1, trapL: 2, todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Chop the good vines, toss the dead core, replant dense" }] }),
    corn:   mk({ name: "Corn plant", latin: "Dracaena fragrans", art: "pStrap", pace: "slow", thirst: 8, matureCm: 150, hCm: 90, med: "general", wsens: 2, loc: "TBD", top: 28, bot: 22, ph: 26, mat: "ceramic", todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Added to the log. Pot up if rootbound" }] }),
    corn2:  mk({ name: "Corn plant #2", latin: "Dracaena fragrans", art: "pStrap", pace: "slow", thirst: 8, matureCm: 150, hCm: 40, med: "leca", wsens: 2, drain: false, fert: "hydro", loc: "Shelf, in LECA", top: 14, bot: 12, ph: 15, mat: "ceramic", todo: ["Measure the real height", "Confirm the LECA reservoir routine"], log: [{ date: dstr(3), t: "Logged as the second corn plant, growing in LECA" }] }),
    pink:   mk({ name: "Pink Princess", latin: "Philodendron 'Pink Princess'", art: "pMonstera", pace: "moderate", thirst: 7, matureCm: 90, hCm: 45, hi: 1, med: "aroid", loc: "TBD", trapN: 1, trapL: 2, todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Bright indirect light, repot with the gnat protocol" }] }),
    mon:    mk({ name: "Monstera", latin: "Monstera deliciosa", art: "pMonstera", pace: "moderate", thirst: 7, matureCm: 213, hCm: 112, med: "aroid", loc: "Living room floor", top: 24, bot: 18, ph: 22, mat: "terracotta", trapN: 2, trapL: 3, todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Pot up, optional moss pole" }] }),
    taro:   mk({ name: "Giant taro", latin: "Alocasia macrorrhizos", art: "pShield", pace: "fast", thirst: 5, matureCm: 183, hCm: 110, light: "bright", med: "aroid", loc: "White planter, floor", top: 30, bot: 23, ph: 28, mat: "ceramic", trapN: 3, trapL: 4, todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Heavy feeder, keep on Big Green Leaves" }] }),
    regal:  mk({ name: "Regal Shields", latin: "Alocasia 'Regal Shields'", art: "pShield", pace: "moderate", thirst: 5, matureCm: 137, hCm: 115, med: "aroid", loc: "Floor, black nursery pot", top: 26, bot: 20, ph: 24, trapN: 3, trapL: 4, todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Repot aroid mix + gnat protocol, heavy feeder" }] }),
    yuc:    mk({ name: "Yucatan Princess", latin: "Alocasia 'Yucatan Princess'", art: "pShield", pace: "fast", thirst: 5, matureCm: 152, hCm: 82, hi: 1, med: "aroid", loc: "Floor, black nursery pot", rootcond: "rot", trapN: 4, trapL: 6, todo: ["Measure the real height", "Confirm Yucatan vs odora off the tag"], log: [{ date: dstr(28), t: "Repotted, trimmed soft roots, full gnat protocol" }, { date: dstr(12), t: "Oldest leaf yellowing, cut at the base" }] }),
    banana: mk({ name: "Wild banana", latin: "Strelitzia nicolai", art: "pPaddle", pace: "slow", thirst: 6, matureCm: 213, hCm: 170, light: "bright", med: "general", loc: "Outside, gravel bed", top: 34, bot: 26, ph: 30, mat: "stone", todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Maintain. Widens more than heightens indoors" }] }),
    bird:   mk({ name: "Bird of paradise", latin: "Strelitzia reginae", art: "pPaddle", pace: "slow", thirst: 7, matureCm: 137, hCm: 95, light: "bright", med: "general", loc: "Outside, gravel bed", top: 30, bot: 23, ph: 27, mat: "stone", todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Blooms once mature and root-snug in strong light" }] }),
    florida:mk({ name: "Florida Beauty", latin: "Dracaena surculosa", art: "pStrap", pace: "slow", thirst: 8, matureCm: 76, hCm: 40, med: "general", wsens: 1, loc: "Combo pot", top: 14, bot: 12, ph: 14, mat: "ceramic", todo: ["Measure the real height", "Decide keep grouped or split at repot"], log: [{ date: dstr(3), t: "Confirmed. Combo pot with Dragon tree #1 and a variegated dracaena" }] }),
    snake:  mk({ name: "Snake plant", latin: "Dracaena trifasciata", art: "pSnake", pace: "slow", thirst: 13, matureCm: 91, hCm: 56, light: "low", med: "gritty", drain: false, loc: "Ribbed white pot, wood base", top: 16, bot: 14, ph: 18, mat: "ceramic", todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Ideal gnat-resistant specimen. No action" }] }),
    vsnake: mk({ name: "Variegated snake", latin: "Dracaena trifasciata 'Laurentii'", art: "pSnake", pace: "slow", thirst: 13, matureCm: 91, hCm: 52, light: "low", med: "gritty", loc: "Round speckled white pot", top: 16, bot: 14, ph: 18, mat: "ceramic", todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "No action" }] }),
    bella:  mk({ name: "Bella Sansevieria", latin: "Sansevieria, kirkii or parva", art: "pSnake", pace: "slow", thirst: 13, matureCm: 120, hCm: 70, light: "low", med: "gritty", loc: "Textured white Bella pot, shelf", top: 16, bot: 14, ph: 18, mat: "ceramic", todo: ["Measure the real height", "Check the Bella tag for the exact species"], log: [{ date: dstr(3), t: "Confirmed present. One specimen so the count holds" }] }),
    dragon1:mk({ name: "Dragon tree #1", latin: "Dracaena marginata", art: "pStrap", pace: "slow", thirst: 12, matureCm: 168, hCm: 90, light: "bright", med: "gritty", wsens: 2, loc: "Combo pot", top: 14, bot: 12, ph: 14, mat: "ceramic", todo: ["Measure the real height", "Fix the name in the app, ease off water"], log: [{ date: dstr(3), t: "Name corrected to marginata. Brighter light" }] }),
    vdrac:  mk({ name: "Variegated dracaena", latin: "Dracaena reflexa (confirm)", art: "pStrap", pace: "slow", thirst: 9, matureCm: 120, hCm: 60, med: "general", wsens: 1, loc: "Combo pot", top: 14, bot: 12, ph: 14, mat: "ceramic", todo: ["Measure the real height", "ID by tag or a solo shot"], log: [{ date: dstr(3), t: "Third plant in the combo pot. Decide split at repot" }] }),
    dragon2:mk({ name: "Dragon tree #2", latin: "Dracaena marginata", art: "pStrap", pace: "slow", thirst: 12, matureCm: 168, hCm: 130, light: "bright", med: "gritty", wsens: 2, loc: "Black pot, multi-cane", top: 30, bot: 23, ph: 27, mat: "plastic", todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Second marginata specimen, same species. Good red color" }] }),
    scarlet:mk({ name: "Scarlet-star", latin: "Guzmania lingulata", art: "pBromeliad", pace: "slow", thirst: 7, matureCm: 40, hCm: 32, hi: 1, tox: false, med: "bark", drain: false, loc: "Stone bowl on stool", top: 16, bot: 13, ph: 12, mat: "stone", todo: ["Confirm the tag", "Keep the pup, cut the spent bloom"], log: [{ date: dstr(3), t: "Mother post-bloom, pup emerging. Repot the pup once it roots" }] }),
    palm:   mk({ name: "Majestic palm", latin: "Ravenea rivularis", art: "pPalm", pace: "slow", thirst: 6, matureCm: 213, hCm: 70, hi: 0, med: "general", loc: "Floor, black nursery pot", top: 30, bot: 23, ph: 28, todo: ["Run the 3 to 4 week spear test", "Plan the Kentia replacement"], log: [{ date: dstr(3), t: "Down to one green spear. Testing the growth point" }] }),
    pine:   mk({ name: "Pineapple", latin: "Ananas comosus", art: "pBromeliad", pace: "slow", thirst: 11, matureCm: 76, hCm: 40, light: "bright", tox: false, med: "gritty", loc: "TBD", top: 20, bot: 16, ph: 18, mat: "ceramic", todo: ["Confirm with a current pic", "Measure the real height"], log: [{ date: dstr(3), t: "Confirm condition. Fruits once at 2 to 3 years then pups" }] }),
    golden: mk({ name: "Golden pothos", latin: "Epipremnum aureum", art: "pVine", pace: "fast", thirst: 7, matureCm: 200, hCm: 120, med: "aroid", loc: "TBD", trapN: 1, trapL: 2, todo: ["Confirm with a current pic", "Measure the real height"], log: [{ date: dstr(3), t: "Optional condition pic before its repot" }] }),
    marble: mk({ name: "Marble Queen", latin: "Epipremnum aureum 'Marble Queen'", art: "pVine", pace: "moderate", thirst: 7, matureCm: 200, hCm: 100, med: "aroid", loc: "Speckled ceramic pot, shelf", mat: "ceramic", trapN: 1, trapL: 2, todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Second, distinct pothos. Heavy cream marbling" }] }),
    rubber: mk({ name: "Rubber plant", latin: "Ficus elastica", art: "pTree", pace: "moderate", thirst: 8, matureCm: 213, hCm: 120, med: "general", loc: "TBD", top: 28, bot: 22, ph: 26, todo: ["Measure the real height", "Measure the pot, set material"], log: [{ date: dstr(3), t: "Log in the app. Healthy, glossy burgundy" }] }),
    ginseng:mk({ name: "Ginseng ficus", latin: "Ficus microcarpa", art: "pTree", pace: "slow", thirst: 9, matureCm: 60, hCm: 34, med: "gritty", loc: "Tabletop", top: 16, bot: 13, ph: 10, mat: "ceramic", todo: ["Measure the real height", "Still acclimating, hold off repotting"], log: [{ date: dstr(3), t: "New, still acclimating. Height is a pruning decision" }] })
  };
}

export const SEED_ORDER = ["inch","corn","corn2","pink","mon","taro","regal","yuc","banana","bird","florida","snake","vsnake","bella","dragon1","vdrac","dragon2","scarlet","palm","pine","golden","marble","rubber","ginseng"];

/* ---- Archetypes for adding new plants beyond the seeded 24 ----
   Each maps a friendly plant "type" to its art generator and sensible starting
   constants. The owner tunes the exact fields on the plant page afterward. */
export const ARCHETYPES = {
  aroid:      { label: "Aroid / Monstera",   art: "pMonstera",  matureCm: 180, thirst: 7,  pace: "moderate", med: "aroid",   light: "med",    tox: true },
  alocasia:   { label: "Alocasia / Shield",  art: "pShield",    matureCm: 150, thirst: 5,  pace: "fast",     med: "aroid",   light: "bright", tox: true },
  snake:      { label: "Snake / Spear",      art: "pSnake",     matureCm: 90,  thirst: 13, pace: "slow",     med: "gritty",  light: "low",    tox: true },
  dracaena:   { label: "Dracaena / Cane",    art: "pStrap",     matureCm: 150, thirst: 9,  pace: "slow",     med: "general", light: "med",    tox: true },
  pothos:     { label: "Pothos / Vine",      art: "pVine",      matureCm: 200, thirst: 7,  pace: "fast",     med: "aroid",   light: "med",    tox: true },
  strelitzia: { label: "Strelitzia / Paddle",art: "pPaddle",    matureCm: 180, thirst: 6,  pace: "slow",     med: "general", light: "bright", tox: true },
  bromeliad:  { label: "Bromeliad",          art: "pBromeliad", matureCm: 45,  thirst: 8,  pace: "slow",     med: "bark",    light: "med",    tox: false },
  palm:       { label: "Palm",               art: "pPalm",      matureCm: 200, thirst: 6,  pace: "slow",     med: "general", light: "med",    tox: true },
  ficus:      { label: "Ficus / Tree",       art: "pTree",      matureCm: 200, thirst: 8,  pace: "moderate", med: "general", light: "med",    tox: true }
};

/* Build a fresh user-added plant record from a chosen archetype. */
export function newPlant({ name, latin, type, room, tox, photoDataUrl }) {
  const a = ARCHETYPES[type] || ARCHETYPES.ficus;
  const id = "user_" + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  const photos = photoDataUrl ? [{ id: "ph_" + Date.now(), date: dstr(0), dataUrl: photoDataUrl }] : [];
  const log = [{ date: dstr(0), t: "Added to your library" }];
  if (photoDataUrl) log.push({ date: dstr(0), t: "Photo added", photoId: photos[0].id });
  return {
    id,
    name: name || "New plant",
    latin: latin || "",
    art: a.art, pace: a.pace, thirst: a.thirst, matureCm: a.matureCm,
    hCm: Math.max(8, Math.round(a.matureCm * 0.4)),
    med: a.med, light: a.light,
    tox: (typeof tox === "boolean") ? tox : a.tox,
    room: room || "Unassigned", loc: room || "TBD",
    hi: 2, water: "tap", wsens: 0, drain: true,
    intv: a.thirst, intvMan: false, fert: a.tox ? "bgl" : "bgl", lastW: 0, lastF: 14,
    snug: 35, rootcond: null, trapN: 0, trapL: 0,
    top: 18, bot: 15, ph: 16, mat: "plastic", shape: "round",
    photos, repotDate: null,
    todo: ["Measure the real height", "Measure the pot, set material"],
    log
  };
}
