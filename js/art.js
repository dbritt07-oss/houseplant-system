/* ============================================================
   art.js  —  the nine parametric plant art generators
   Ported verbatim from houseplant-24-plants.html. Each takes
   (growth 0..1, health 0..1) and returns an SVG string wrapped
   in the hand-wobble filter. Resolution-independent, theme-able.
   ============================================================ */
import { mix, clamp, qpt } from "./care.js";

const POTW = "#f3ead2", POTS = "#cabf9d";

function wrapLab(inner) {
  return `<svg viewBox="0 0 200 210"><g filter="url(#wob)" stroke="var(--pen)" stroke-width="1.1" stroke-linejoin="round" fill-opacity="0.55">${inner}</g></svg>`;
}
function labPot() {
  return `<path d="M70,178 L77,202 Q100,207 123,202 L130,178 Z" fill="${POTW}" stroke="${POTS}"/><ellipse cx="100" cy="178" rx="30" ry="6.2" fill="${POTW}" stroke="${POTS}"/>`;
}

/* ---- monstera / aroid form ---- */
const MON_OUT = "M60,150 Q86,150 96,134 Q82,126 80,120 Q104,118 110,98 Q92,92 88,86 Q106,80 108,58 Q92,54 88,49 Q98,42 92,24 Q80,30 76,28 Q70,14 60,2 Q50,14 44,28 Q40,30 28,24 Q22,42 32,49 Q28,54 12,58 Q14,80 32,86 Q28,92 10,98 Q16,118 40,120 Q38,126 24,134 Q34,150 60,150 Z";
const MON_HOLES = [[60,72,6,15,0],[46,118,6,11,-18],[74,118,6,11,18],[40,96,7,13,-14],[80,96,7,13,14],[36,74,7,14,-8],[84,74,7,14,8]];
export function pMonstera(g, h) {
  const n = 2 + Math.round(g * 4), gsc = 0.5 + g * 0.5, fillA = mix("#b7ad4e","#37592f",h), fillB = mix("#a89a44","#2c4a26",h), vein = mix("#8a853c","#294524",h), droop = (1 - h) * 16, cx = 100, by0 = 178, holeN = Math.max(2, Math.round(g * 7));
  let pet = "", bl = "";
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1), a = -42 + 84 * t, sc = gsc * (0.68 + 0.32 * Math.cos((t - 0.5) * 2.2)), dx = Math.sin(a * Math.PI / 180) * 54 * gsc, dy = -40 * gsc + droop * Math.abs(t - 0.5) * 2 + (1 - h) * 7;
    pet += `<path d="M${cx},${by0 - 3} Q ${(cx + dx * 0.5).toFixed(1)},${(by0 + dy * 0.5).toFixed(1)} ${(cx + dx).toFixed(1)},${(by0 + dy).toFixed(1)}" fill="none" stroke="${vein}" stroke-width="${(3.2 * sc).toFixed(1)}" stroke-linecap="round"/>`;
    const mid = "ml" + i, hs = MON_HOLES.slice(0, holeN).map(hh => `<ellipse cx="${hh[0]}" cy="${hh[1]}" rx="${hh[2]}" ry="${hh[3]}" transform="rotate(${hh[4]} ${hh[0]} ${hh[1]})" fill="#000" fill-opacity="1" stroke="none"/>`).join("");
    bl += `<g transform="translate(${(cx + dx).toFixed(1)},${(by0 + dy).toFixed(1)}) rotate(${(a + (t - 0.5) * droop).toFixed(1)}) scale(${sc.toFixed(2)}) translate(-60,-150)"><mask id="${mid}"><rect x="-6" y="-6" width="132" height="162" fill="#fff" fill-opacity="1" stroke="none"/>${hs}</mask><g mask="url(#${mid})"><path d="${MON_OUT}" fill="${i % 2 ? fillB : fillA}"/><path d="M60,148 L60,8" stroke="${vein}" stroke-width="1.2" fill="none"/></g></g>`;
  }
  return wrapLab(pet + bl + labPot());
}

/* ---- shield / alocasia form ---- */
function shieldLeaf(x, y, a, s, fill, vein) {
  const p = "M0,-2 L 10,8 C 14,2 18,-10 16,-22 C 14,-36 8,-46 0,-52 C -8,-46 -14,-36 -16,-22 C -18,-10 -14,2 -10,8 Z";
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a.toFixed(1)}) scale(${s.toFixed(2)})"><path d="${p}" fill="${fill}"/><path d="M0,-4 L0,-50" stroke="${vein}" stroke-width="1.2"/><path d="M0,-22 L9,-26 M0,-22 L-9,-26 M0,-34 L7,-38 M0,-34 L-7,-38" stroke="${vein}" stroke-width="0.8" fill="none"/></g>`;
}
export function pShield(g, h) {
  const n = 1 + Math.round(g * 3), gsc = 0.55 + g * 0.55, green = mix("#8a8438","#33512c",h), petCol = mix("#6a6448","#2c2a26",h), yellow = "#c7b24a", droop = (1 - h) * 26, cx = 100, by0 = 180;
  let pet = "", bl = "";
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1), a = -38 + 76 * t + (t - 0.5) * droop, sc = gsc * (0.72 + 0.28 * Math.cos((t - 0.5) * 2)), sick = (i === 0 && h < 0.62), fill = sick ? mix(yellow, green, h / 0.62) : green, dx = Math.sin(a * Math.PI / 180) * 40 * gsc, dy = -28 * gsc + (1 - h) * 12 + Math.abs(t - 0.5) * droop;
    pet += `<path d="M${cx},${by0 - 2} Q ${(cx + dx * 0.4).toFixed(1)},${(by0 - 14).toFixed(1)} ${(cx + dx).toFixed(1)},${(by0 + dy).toFixed(1)}" fill="none" stroke="${petCol}" stroke-width="${(3.4 * sc).toFixed(1)}" stroke-linecap="round"/>`;
    bl += shieldLeaf(cx + dx, by0 + dy, a, sc, fill, mix("#3a4a2c","#1e3320",h));
  }
  return wrapLab(pet + bl + labPot());
}

/* ---- snake / spear form ---- */
export function pSnake(g, h) {
  const n = 3 + Math.round(g * 4), hsc = 0.7 + g * 0.7, green = mix("#7a8a52","#48633f",h * 0.5 + 0.5), margin = "#cdbf6e";
  let o = "";
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1), a = -30 + 60 * t, hh = (120 + Math.cos((t - 0.5) * 2) * 34) * hsc * 0.8, w = 9;
    const outer = `M0,0 C ${w},${(-hh * 0.18).toFixed(1)} ${(w * 0.66).toFixed(1)},${(-hh * 0.74).toFixed(1)} 0,${(-hh).toFixed(1)} C ${(-w * 0.66).toFixed(1)},${(-hh * 0.74).toFixed(1)} ${-w},${(-hh * 0.18).toFixed(1)} 0,0 Z`;
    const iw = w * 0.7, inner = `M0,-1 C ${iw.toFixed(1)},${(-hh * 0.2).toFixed(1)} ${(iw * 0.66).toFixed(1)},${(-hh * 0.72).toFixed(1)} 0,${(-(hh - 4)).toFixed(1)} C ${(-iw * 0.66).toFixed(1)},${(-hh * 0.72).toFixed(1)} ${(-iw).toFixed(1)},${(-hh * 0.2).toFixed(1)} 0,-1 Z`;
    o += `<g transform="translate(100,178) rotate(${a})"><path d="${outer}" fill="${margin}"/><path d="${inner}" fill="${green}"/><path d="M0,-2 L0,${(-(hh - 6)).toFixed(1)}" stroke="${mix('#4a5a30','#2e4222',h)}" stroke-width="0.7"/></g>`;
  }
  return wrapLab(o + labPot());
}

/* ---- strap / dracaena cane (corn plants, dragon trees, variegated dracaena) ---- */
function strapLeaves(x, y, n, len, green, droop) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1), a = -74 + 148 * t, rad = a * Math.PI / 180, dx = Math.sin(rad) * len, dy = -Math.cos(rad) * len * 0.92 + droop * Math.abs(t - 0.5), mx = x + Math.sin(rad) * len * 0.45, my = y - Math.cos(rad) * len * 0.45 + 7;
    s += `<path d="M${x.toFixed(1)},${y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${(x + dx).toFixed(1)},${(y + dy).toFixed(1)}" fill="none" stroke="${green}" stroke-width="${(3.1 * (0.7 + 0.3 * Math.cos((t - 0.5) * 2))).toFixed(1)}" stroke-linecap="round"/>`;
  }
  return s;
}
export function pStrap(g, h) {
  const canes = 1 + Math.round(g * 2), baseY = 176, green = mix("#9a9a48","#46662f",h), cane = mix("#7a6a4a","#4a3a26",h), droop = (1 - h) * 16, len = 32 + g * 30, n = 6 + Math.round(g * 4);
  let o = "";
  for (let c = 0; c < canes; c++) {
    const cx = 100 + (c - (canes - 1) / 2) * 17, caneH = (54 + g * 54) * (1 - c * 0.14), topY = baseY - caneH;
    o += `<path d="M${cx},${baseY} L${cx},${(topY + 4).toFixed(1)}" stroke="${cane}" stroke-width="4.2" stroke-linecap="round" fill="none"/>`;
    o += strapLeaves(cx, topY, n, len, green, droop);
  }
  return wrapLab(o + labPot());
}

/* ---- trailing vine (inchplant, pothos) ---- */
function vineLeaf(x, y, s, fill) {
  return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(6 * s).toFixed(1)}" ry="${(8 * s).toFixed(1)}" fill="${fill}" transform="rotate(24 ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
}
export function pVine(g, h) {
  const stems = 2 + Math.round(g * 3), green = mix("#a6ad5a","#4f6d34",h), alt = mix("#8fa04a","#3c5a2a",h), stemc = mix("#8a8a50","#4a5a30",h), cx = 100, cy = 172;
  let o = "";
  for (let i = 0; i < stems; i++) {
    const t = stems === 1 ? 0.5 : i / (stems - 1), dir = (t - 0.5) * 2, sx = cx + dir * 8, midx = cx + dir * (38 + g * 22), midy = cy + 30, endx = cx + dir * (28 + g * 16), endy = Math.min(206, cy + 46 + g * 46);
    o += `<path d="M${sx.toFixed(1)},${cy} Q${midx.toFixed(1)},${midy.toFixed(1)} ${endx.toFixed(1)},${endy.toFixed(1)}" fill="none" stroke="${stemc}" stroke-width="2" stroke-linecap="round"/>`;
    const lc = 3 + Math.round(g * 3);
    for (let k = 1; k <= lc; k++) { const tt = k / (lc + 1), bx = qpt(sx, midx, endx, tt), by = qpt(cy, midy, endy, tt); o += vineLeaf(bx, by, 0.6 + g * 0.4, k % 2 ? green : alt); }
  }
  const up = 1 + Math.round(g * 2);
  for (let i = 0; i < up; i++) { const dir = (i - (up - 1) / 2) * 0.7, tx = cx + dir * 16, ty = cy - (24 + g * 22); o += `<path d="M${cx},${cy} Q${(cx + dir * 10).toFixed(1)},${(cy - 16).toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}" fill="none" stroke="${stemc}" stroke-width="2" stroke-linecap="round"/>`; o += vineLeaf(tx, ty, 0.6 + g * 0.35, green); }
  return wrapLab(o + labPot());
}

/* ---- strelitzia paddle (wild banana, bird of paradise) ---- */
export function pPaddle(g, h) {
  const n = 2 + Math.round(g * 4), green = mix("#8a9a58","#3f5f38",h), alt = mix("#7a8a4c","#33512e",h), stem = mix("#7a8a4a","#46603a",h), droop = (1 - h) * 10;
  let o = "";
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1), a = -32 + 64 * t, rad = a * Math.PI / 180, L = (88 + g * 40) * (0.78 + 0.22 * Math.cos((t - 0.5) * 2)), ex = 100 + Math.sin(rad) * L, ey = 176 - Math.cos(rad) * L + droop * Math.abs(t - 0.5);
    o += `<path d="M100,176 L${ex.toFixed(1)},${ey.toFixed(1)}" stroke="${stem}" stroke-width="3" stroke-linecap="round"/>`;
    o += `<g transform="translate(${ex.toFixed(1)},${ey.toFixed(1)}) rotate(${a.toFixed(1)})"><ellipse cx="0" cy="-16" rx="11" ry="20" fill="${i % 2 ? green : alt}"/><path d="M0,3 L0,-34" stroke="${mix('#3a4a2a','#20331e',h)}" stroke-width="1"/></g>`;
  }
  return wrapLab(o + labPot());
}

/* ---- bromeliad rosette (guzmania, pineapple) ---- */
export function pBromeliad(g, h) {
  const n = 8 + Math.round(g * 6), green = mix("#93a852","#4c6d3a",h), alt = mix("#82984a","#3c5a30",h), spike = mix("#c9923a","#b0563a",clamp(h * 0.6 + 0.3, 0, 1));
  let o = "";
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1), a = -88 + 176 * t, rad = a * Math.PI / 180, L = (30 + g * 34) * (0.7 + 0.3 * Math.cos((t - 0.5) * 2)), ex = 100 + Math.sin(rad) * L, ey = 172 - Math.cos(rad) * L * 0.72, mx = 100 + Math.sin(rad) * L * 0.5, my = 172 - Math.cos(rad) * L * 0.5 - 6;
    o += `<path d="M100,172 Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}" fill="none" stroke="${i % 2 ? green : alt}" stroke-width="${(4 * (0.7 + 0.3 * Math.cos((t - 0.5) * 2))).toFixed(1)}" stroke-linecap="round"/>`;
  }
  if (g > 0.4) o += `<path d="M100,172 L100,${(150 - g * 20).toFixed(1)}" stroke="${spike}" stroke-width="6" stroke-linecap="round"/>`;
  return wrapLab(o + labPot());
}

/* ---- palm (majestic / kentia) ---- */
export function pPalm(g, h) {
  const n = Math.max(1, 1 + Math.round(g * 5)), green = mix("#8a9a4e","#41652f",h), stem = mix("#6a6a3a","#3f5230",h), droop = (1 - h) * 22;
  let o = "";
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1), a = -58 + 116 * t, rad = a * Math.PI / 180, L = (60 + g * 54), ex = 100 + Math.sin(rad) * L, ey = 176 - Math.cos(rad) * L + droop, mx = 100 + Math.sin(rad) * L * 0.5 - Math.cos(rad) * 10, my = 176 - Math.cos(rad) * L * 0.5;
    o += `<path d="M100,176 Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}" fill="none" stroke="${stem}" stroke-width="2.4"/>`;
    for (let k = 1; k <= 6; k++) { const tt = k / 7, bx = qpt(100, mx, ex, tt), by = qpt(176, my, ey, tt), ll = 6 + g * 4; o += `<path d="M${bx.toFixed(1)},${by.toFixed(1)} l${(Math.cos(rad) * ll).toFixed(1)},${(Math.sin(rad) * ll).toFixed(1)}" stroke="${green}" stroke-width="1.6"/><path d="M${bx.toFixed(1)},${by.toFixed(1)} l${(-Math.cos(rad) * ll).toFixed(1)},${(-Math.sin(rad) * ll).toFixed(1)}" stroke="${green}" stroke-width="1.6"/>`; }
  }
  return wrapLab(o + labPot());
}

/* ---- tree (rubber plant, ginseng ficus) ---- */
export function pTree(g, h) {
  const trunkc = mix("#7a6a4a","#4a3a26",clamp(h * 0.4 + 0.4, 0, 1)), green = mix("#8fa852","#41652f",h), alt = mix("#7d9646","#35592b",h), th = (48 + g * 44), cx = 100, topY = 176 - th;
  let o = `<path d="M${cx - 3},176 Q${(cx - 6).toFixed(1)},${(176 - th * 0.6).toFixed(1)} ${cx},${topY.toFixed(1)}" stroke="${trunkc}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const n = 6 + Math.round(g * 10), R = 20 + g * 18;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, rr = R * (0.5 + 0.5 * (((i * 7) % 5) / 5)), lx = cx + Math.cos(a) * rr * 0.92, ly = topY - 6 + Math.sin(a) * rr * 0.7; o += `<ellipse cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" rx="8" ry="11" fill="${i % 2 ? green : alt}" transform="rotate(${(a * 57).toFixed(0)} ${lx.toFixed(1)} ${ly.toFixed(1)})"/>`; }
  return wrapLab(o + labPot());
}

/* Registry so seed records can reference an art generator by string key (survives JSON). */
export const ART = {
  pMonstera, pShield, pSnake, pStrap, pVine, pPaddle, pBromeliad, pPalm, pTree
};
